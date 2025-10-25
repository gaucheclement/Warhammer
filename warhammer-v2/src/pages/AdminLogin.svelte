<script>
  /**
   * Admin Login Page
   *
   * Issue #16 Stream A: Authentication & Session Management
   *
   * Password-protected login page for admin access using client-side
   * SHA-256 hashing and localStorage session persistence.
   */

  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { login, isAdmin } from '../lib/adminAuth.js'
  import { adminStore } from '../stores/admin.js'

  let password = ''
  let isLoading = false
  let errorMessage = ''
  let showPassword = false

  // Redirect if already logged in
  onMount(() => {
    if (isAdmin()) {
      console.log('Already authenticated, redirecting to admin dashboard')
      push('/admin')
    }
  })

  /**
   * Handle login form submission
   */
  async function handleLogin(event) {
    event.preventDefault()
    errorMessage = ''

    if (!password) {
      errorMessage = 'Please enter a password'
      return
    }

    isLoading = true

    try {
      const success = await login(password)

      if (success) {
        // Update admin store
        adminStore.login()

        // Redirect to admin dashboard
        console.log('Login successful, redirecting to admin dashboard')
        push('/admin')
      } else {
        errorMessage = 'Invalid password. Please try again.'
        password = '' // Clear password field
      }
    } catch (error) {
      console.error('Login error:', error)
      errorMessage = 'An error occurred during login. Please try again.'
    } finally {
      isLoading = false
    }
  }

  /**
   * Toggle password visibility
   */
  function togglePasswordVisibility() {
    showPassword = !showPassword
  }

  /**
   * Handle Enter key on password input
   */
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      handleLogin(event)
    }
  }
</script>

<div class="login-page">
  <div class="login-container">
    <div class="login-header">
      <div class="icon">🔐</div>
      <h1>Admin Login</h1>
      <p class="subtitle">Enter your password to access the admin panel</p>
    </div>

    <form on:submit={handleLogin} class="login-form">
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={password}
            on:keydown={handleKeydown}
            placeholder="Enter admin password"
            disabled={isLoading}
            autocomplete="current-password"
            autofocus
          />
          <button
            type="button"
            class="toggle-password"
            on:click={togglePasswordVisibility}
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      {#if errorMessage}
        <div class="error-message" role="alert">
          {errorMessage}
        </div>
      {/if}

      <button type="submit" class="login-button" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <div class="login-footer">
      <p class="help-text">
        <strong>Security Note:</strong> This is a client-side authentication system
        for admin access. Your session will persist until you log out.
      </p>
      <p class="help-text">
        Default password for development: <code>admin123</code>
      </p>
      <a href="#/" class="back-link">← Back to Home</a>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, var(--color-bg-secondary, #f5f5f5) 0%, var(--color-bg-primary, #fff) 100%);
  }

  .login-container {
    width: 100%;
    max-width: 450px;
    background: var(--color-bg-primary, #fff);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 3rem;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .login-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary, #333);
    font-family: var(--font-heading, serif);
  }

  .subtitle {
    color: var(--color-text-secondary, #666);
    margin: 0;
    font-size: 0.95rem;
  }

  .login-form {
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--color-text-primary, #333);
    font-size: 0.95rem;
  }

  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input-wrapper input {
    flex: 1;
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem;
    border: 2px solid var(--color-border, #ddd);
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
    background: var(--color-bg-primary, #fff);
    color: var(--color-text-primary, #333);
  }

  .password-input-wrapper input:focus {
    outline: none;
    border-color: var(--color-accent, #8b2e1f);
  }

  .password-input-wrapper input:disabled {
    background: var(--color-bg-secondary, #f5f5f5);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .toggle-password {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .toggle-password:hover:not(:disabled) {
    opacity: 1;
  }

  .toggle-password:disabled {
    cursor: not-allowed;
  }

  .error-message {
    padding: 0.75rem 1rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 6px;
    color: #c33;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .login-button {
    width: 100%;
    padding: 1rem;
    background: var(--color-accent, #8b2e1f);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
  }

  .login-button:hover:not(:disabled) {
    background: var(--color-accent-dark, #6b1e0f);
    transform: translateY(-1px);
  }

  .login-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .login-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border, #ddd);
  }

  .help-text {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  .help-text code {
    background: var(--color-bg-secondary, #f5f5f5);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .back-link {
    display: inline-block;
    margin-top: 1rem;
    color: var(--color-accent, #8b2e1f);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: var(--color-accent-dark, #6b1e0f);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .login-page {
      padding: 1rem;
    }

    .login-container {
      padding: 2rem 1.5rem;
    }

    .login-header h1 {
      font-size: 1.75rem;
    }

    .login-header .icon {
      font-size: 3rem;
    }
  }
</style>
