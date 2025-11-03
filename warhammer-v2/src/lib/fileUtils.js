/**
 * File Utils - Utilitaires de gestion de fichiers
 *
 * Module centralisé pour la génération de noms de fichiers, formatage,
 * et utilitaires liés aux fichiers. Élimine la duplication de code
 * entre exportModifications.js et characterExport.js.
 */

/**
 * Génère un timestamp formaté pour les noms de fichiers
 * Format: YYYYMMDD-HHMMSS
 * @returns {string} Timestamp formaté
 * @example generateTimestamp() // "20250131-143025"
 */
export function generateTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

/**
 * Génère un datestamp formaté (date uniquement)
 * Format: YYYY-MM-DD
 * @returns {string} Datestamp formaté
 * @example generateDatestampISO() // "2025-01-31"
 */
export function generateDatestampISO() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Nettoie un nom de fichier en retirant les caractères spéciaux
 * @param {string} name - Nom à nettoyer
 * @returns {string} Nom nettoyé et sécurisé
 * @example sanitizeFilename("Mon Fichier!@#") // "mon-fichier"
 */
export function sanitizeFilename(name) {
  if (!name || typeof name !== 'string') {
    return 'unnamed'
  }

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Remplace les non-alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Retire les tirets en début et fin
    .slice(0, 50) // Limite la longueur
    || 'unnamed' // Fallback si vide après nettoyage
}

/**
 * Génère un nom de fichier avec préfixe, identifiant et timestamp
 * Format: prefix-identifier-YYYYMMDD-HHMMSS.extension
 * @param {string} prefix - Préfixe du fichier (ex: "character", "warhammer-mods")
 * @param {string} [identifier] - Identifiant optionnel (sera nettoyé)
 * @param {string} [extension='json'] - Extension du fichier
 * @returns {string} Nom de fichier complet
 * @example generateFilename("character", "Jean Dupont") // "character-jean-dupont-20250131-143025.json"
 * @example generateFilename("warhammer-mods") // "warhammer-mods-20250131-143025.json"
 */
export function generateFilename(prefix, identifier = '', extension = 'json') {
  const timestamp = generateTimestamp()
  const parts = [prefix]

  if (identifier) {
    const cleanIdentifier = sanitizeFilename(identifier)
    parts.push(cleanIdentifier)
  }

  parts.push(timestamp)

  return `${parts.join('-')}.${extension}`
}

/**
 * Génère un nom de fichier avec datestamp ISO (pour compatibilité existante)
 * Format: prefix-identifier-YYYY-MM-DD.extension
 * @param {string} prefix - Préfixe du fichier
 * @param {string} [identifier] - Identifiant optionnel
 * @param {string} [extension='json'] - Extension du fichier
 * @returns {string} Nom de fichier complet
 * @example generateFilenameWithDate("character", "Jean") // "character-jean-2025-01-31.json"
 */
export function generateFilenameWithDate(prefix, identifier = '', extension = 'json') {
  const datestamp = generateDatestampISO()
  const parts = [prefix]

  if (identifier) {
    const cleanIdentifier = sanitizeFilename(identifier)
    parts.push(cleanIdentifier)
  }

  parts.push(datestamp)

  return `${parts.join('-')}.${extension}`
}

/**
 * Formate une taille de fichier en octets vers une unité lisible
 * @param {number} bytes - Taille en octets
 * @param {number} [decimals=2] - Nombre de décimales
 * @returns {string} Taille formatée (ex: "1.5 MB", "250 KB")
 * @example formatFileSize(1536000) // "1.46 MB"
 * @example formatFileSize(512) // "512 B"
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  if (!bytes || typeof bytes !== 'number') return 'N/A'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Valide si un nom de fichier est sûr (pas de caractères dangereux)
 * @param {string} filename - Nom de fichier à valider
 * @returns {boolean} true si le nom est sûr
 */
export function isValidFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    return false
  }

  // Vérifie qu'il n'y a pas de caractères dangereux
  const dangerousChars = /[<>:"|?*\x00-\x1f]/
  const pathTraversal = /\.\./

  return !dangerousChars.test(filename) && !pathTraversal.test(filename)
}

/**
 * Extrait le nom de fichier sans extension
 * @param {string} filename - Nom de fichier complet
 * @returns {string} Nom sans extension
 * @example getFilenameWithoutExtension("character-jean-20250131.json") // "character-jean-20250131"
 */
export function getFilenameWithoutExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return ''
  }

  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename
}

/**
 * Extrait l'extension d'un nom de fichier
 * @param {string} filename - Nom de fichier complet
 * @returns {string} Extension (sans le point)
 * @example getFileExtension("character.json") // "json"
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') {
    return ''
  }

  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : ''
}
