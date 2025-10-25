/**
 * Retry logic module with exponential backoff
 * Handles network requests with automatic retries and fallback to cached data
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Sleep utility for delays
 * @param {Number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines if an error is retryable
 * @param {Error} error - The error to check
 * @returns {Boolean}
 */
function isRetryableError(error) {
    // Network errors that might be transient
    const retryableCodes = [
        'ECONNRESET',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ENETUNREACH',
        'EAI_AGAIN'
    ];

    if (error.code && retryableCodes.includes(error.code)) {
        return true;
    }

    // HTTP status codes that might be transient
    if (error.statusCode) {
        const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
        return retryableStatusCodes.includes(error.statusCode);
    }

    return false;
}

/**
 * Fetches data from URL with timeout
 * @param {String} url - URL to fetch from
 * @param {Number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} Parsed JSON data
 */
function fetchData(url, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const urlWithParam = url.includes('?') ? `${url}&json=true` : `${url}?json=true`;

        const request = https.get(urlWithParam, {
            headers: { 'User-Agent': 'Node.js' },
            timeout: timeout
        }, (res) => {
            // Handle redirections
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
                if (!res.headers.location) {
                    reject(new Error('Redirect without location header'));
                    return;
                }

                https.get(res.headers.location, {
                    headers: { 'User-Agent': 'Node.js' },
                    timeout: timeout
                }, (redirectRes) => {
                    if (redirectRes.statusCode !== 200) {
                        const error = new Error(`HTTP ${redirectRes.statusCode}: ${redirectRes.statusMessage}`);
                        error.statusCode = redirectRes.statusCode;
                        reject(error);
                        return;
                    }

                    let data = '';
                    redirectRes.on('data', (chunk) => { data += chunk; });
                    redirectRes.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (error) {
                            reject(new Error(`JSON parse error: ${error.message}`));
                        }
                    });
                }).on('error', reject);
                return;
            }

            // Check status code
            if (res.statusCode !== 200) {
                const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
                error.statusCode = res.statusCode;
                reject(error);
                return;
            }

            // Collect data
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });

        // Handle timeout
        request.on('timeout', () => {
            request.destroy();
            const error = new Error(`Request timeout after ${timeout}ms`);
            error.code = 'ETIMEDOUT';
            reject(error);
        });

        // Handle other errors
        request.on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Fetches data with retry logic and exponential backoff
 * @param {String} url - URL to fetch from
 * @param {Object} options - Options object
 * @param {Number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {Number} options.timeout - Timeout per attempt in ms (default: 30000)
 * @param {Boolean} options.verbose - Enable verbose logging (default: false)
 * @returns {Promise<Object>} Parsed JSON data
 */
async function retryFetch(url, options = {}) {
    const maxRetries = options.maxRetries || 3;
    const timeout = options.timeout || 30000;
    const verbose = options.verbose || false;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (verbose && attempt > 1) {
                console.log(`Attempt ${attempt}/${maxRetries}...`);
            }

            const data = await fetchData(url, timeout);
            return data;

        } catch (error) {
            lastError = error;

            // If this is the last attempt, throw the error
            if (attempt === maxRetries) {
                break;
            }

            // If error is not retryable, throw immediately
            if (!isRetryableError(error)) {
                console.error(`Non-retryable error: ${error.message}`);
                throw error;
            }

            // Calculate exponential backoff delay: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;

            console.log(`Warning: ${error.message}`);
            console.log(`Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);

            await sleep(delay);
        }
    }

    // All retries failed
    throw lastError;
}

/**
 * Loads cached data from file
 * @param {String} dataDir - Directory where data is stored
 * @returns {Promise<Object|null>} Cached data or null if not available
 */
async function loadCachedData(dataDir) {
    const cachedFilePath = path.join(dataDir, 'all-data.json');

    try {
        if (!fs.existsSync(cachedFilePath)) {
            return null;
        }

        const cachedContent = fs.readFileSync(cachedFilePath, 'utf8');
        const cachedData = JSON.parse(cachedContent);

        // Check if cache is valid JSON with data
        if (!cachedData || typeof cachedData !== 'object') {
            return null;
        }

        return cachedData;
    } catch (error) {
        console.error(`Failed to load cached data: ${error.message}`);
        return null;
    }
}

/**
 * Fetches data with retry logic and fallback to cached data
 * @param {String} url - URL to fetch from
 * @param {String} dataDir - Directory where data is stored
 * @param {Object} options - Options for retry logic
 * @returns {Promise<Object>} Data from network or cache
 */
async function fetchWithFallback(url, dataDir, options = {}) {
    try {
        // Try to fetch with retries
        const data = await retryFetch(url, options);
        return { data, fromCache: false };

    } catch (error) {
        console.error('Failed to fetch data after all retry attempts');
        console.error(`Error: ${error.message}`);
        console.log('');

        // Try to load cached data
        console.log('Attempting to load cached data...');
        const cachedData = await loadCachedData(dataDir);

        if (cachedData) {
            console.log('Using cached data from previous successful fetch');
            return { data: cachedData, fromCache: true };
        }

        // No cache available
        console.error('No cached data available. Cannot continue.');
        throw new Error('Failed to fetch data and no cache available');
    }
}

module.exports = {
    retryFetch,
    fetchWithFallback,
    loadCachedData,
    isRetryableError
};
