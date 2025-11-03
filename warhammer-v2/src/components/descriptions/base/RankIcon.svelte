<script>
  /**
   * RankIcon Component
   *
   * Affiche une icône de rang pour les niveaux de carrière.
   * Remplace la fonction rankToImg() qui générait du HTML.
   *
   * @prop {number} rank - Rang (1-4)
   *   1: Croix (Niveau Cuivre)
   *   2: Épée (Niveau Argent)
   *   3: Crâne (Niveau Or)
   *   4: Bouclier (Niveau Platine)
   * @prop {string} [label] - Label optionnel pour le rang (par défaut: "Rang {rank}")
   */

  // Props
  export let rank;
  export let label = null;

  // Map des icônes et couleurs par rang
  const rankConfig = {
    1: { icon: 'cross_icon', color: '#FFFFFF', name: 'Cuivre' },
    2: { icon: 'sword_icon', color: '#CD7F32', name: 'Argent' },
    3: { icon: 'skull_icon', color: '#C0C0C0', name: 'Or' },
    4: { icon: 'shield_icon', color: '#FFFF00', name: 'Platine' }
  };

  // Récupérer la config pour le rang actuel
  $: config = rankConfig[rank] || rankConfig[1];
  $: displayLabel = label || `Rang ${rank}`;
  $: iconClass = `rank-icon__svg rank-icon__svg--${config.icon}`;
</script>

<div class="rank-icon" title={displayLabel}>
  <div class={iconClass} aria-label={displayLabel} role="img"></div>
</div>

<style>
  /* ========================================================================
     BEM Component: rank-icon
     ======================================================================== */

  .rank-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .rank-icon__svg {
    height: 21px;
    width: 21px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
  }

  /* Icône Croix - Rang 1 (Cuivre) */
  .rank-icon__svg--cross_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M486 371.316L486 142.75C 430.9156 181.09032 367.0511 204.9185 300.315 212.03C 307.88223 145.02985 332.29944 81.03862 371.288 26.028L371.288 26.028L142.72 26.028C 181.06047 81.11275 204.88866 144.97755 212 211.714C 145.0004 204.14616 81.009964 179.72868 26 140.74L26 140.74L26 369.31C 81.08441 330.96967 144.94893 307.14148 211.685 300.03C 204.10829 367.01007 179.69154 430.9801 140.712 485.974L140.712 485.974L369.28 485.974C 330.948 430.9049 307.12024 367.05975 300 300.342C 366.99957 307.90985 430.99002 332.32733 486 371.316z" stroke="none" fill="%23FFFFFF" fill-rule="nonzero" /></g></svg>');
  }

  /* Icône Épée - Rang 2 (Argent) */
  .rank-icon__svg--sword_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.875 0 0 0.875 0 0)"><path d="M2 19.2L3.8 21L2 19.2zM4.7 13.8L5.6 17.4zM5.6 17.4L9.2 18.3zM5.6 17.4L2.9 20.1zM16.4 3.9L7.4 12.9L7.85 15.15L10.1 15.6L19.1 6.6L20 3L16.4 3.9z" stroke="%23CD7F32" stroke-width="2" stroke-linecap="square" fill="none" /><path d="M22 19.2L20.2 21zM19.3 13.8L18.4 17.4zM18.4 17.4L21.1 20.1zM18.4 17.4L16.6 17.85L14.8 18.3zM9.3 11L4.9 6.6L4 3L7.6 3.9L12 8.3zM12.1 13.8L13.9 15.6L16.15 15.15L16.6 12.9L14.8 11.1" stroke="%23CD7F32" stroke-width="2" stroke-linecap="square" fill="none" /></g></svg>');
  }

  /* Icône Crâne - Rang 3 (Or) */
  .rank-icon__svg--skull_icon {
    background-image: url('data:image/svg+xml,<%3Fxml version="1.0" standalone="no"%3F><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M448 225.64L448 324.64C 447.9991 350.80875 432.0669 374.34076 407.77 384.06L407.77 384.06L384.09 393.53C 374.04224 397.5538 366.7094 406.38403 364.6 417L364.6 417L354.6 467.14C 353.1011 474.62927 346.51776 480.01486 338.88 480L338.88 480L173.12 480C 165.4935 480.00055 158.9267 474.6182 157.43 467.14L157.43 467.14L147.4 417C 145.28139 406.39536 137.95001 397.57812 127.909996 393.56L127.909996 393.56L104.229996 384.09C 79.933105 374.37076 64.00087 350.8387 64 324.67L64 324.67L64 224C 64 118.08 149.77 32.19 255.65 32C 361.52997 31.810001 448 119.85 448 225.64z" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M208 280C 208 291.04572 204.09476 300.47382 196.28427 308.28427C 188.47379 316.0948 179.0457 320 168 320C 156.95432 320 147.52621 316.0948 139.71573 308.28427C 131.90524 300.47382 128 291.04572 128 280C 128 268.9543 131.90524 259.5262 139.71573 251.71573C 147.52621 243.90524 156.95432 240 168 240C 179.0457 240 188.47379 243.90524 196.28427 251.71573C 204.09476 259.5262 208 268.9543 208 280C 208 280.46548 207.99188 280.9308 207.97563 281.39597" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M384 280C 384 291.04572 380.09476 300.47382 372.28427 308.28427C 364.4738 316.0948 355.04572 320 344 320C 332.9543 320 323.5262 316.0948 315.71573 308.28427C 307.90524 300.47382 304 291.04572 304 280C 304 268.9543 307.90524 259.5262 315.71573 251.71573C 323.5262 243.90524 332.9543 240 344 240C 355.04572 240 364.4738 243.90524 372.28427 251.71573C 380.09476 259.5262 384 268.9543 384 280C 384 280.46548 383.99188 280.9308 383.97565 281.39597" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M256 336L240 384L272 384L256 336L256 336" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M256 448L256 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M208 448L208 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /><path d="M304 448L304 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="none" /></g></svg>');
  }

  /* Icône Bouclier - Rang 4 (Platine) */
  .rank-icon__svg--shield_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M463.1 112.37C 373.68 96.33 336.71 84.45 256 48C 175.29 84.45 138.32 96.33 48.9 112.37C 32.7 369.13 240.58 457.79 256 464C 271.42 457.79 479.3 369.13 463.1 112.37z" stroke="%23FFFF00" stroke-width="32" stroke-linecap="square" fill="none" /></g></svg>');
  }

  /* Support du thème clair - variantes avec fond pour les icônes */
  [data-theme="light"] .rank-icon__svg--shield_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M463.1 112.37C 373.68 96.33 336.71 84.45 256 48C 175.29 84.45 138.32 96.33 48.9 112.37C 32.7 369.13 240.58 457.79 256 464C 271.42 457.79 479.3 369.13 463.1 112.37z" stroke="black" stroke-width="32" stroke-linecap="square" fill="black" /></g></svg>');
    background-color: yellow;
  }

  [data-theme="light"] .rank-icon__svg--skull_icon {
    background-image: url('data:image/svg+xml,<%3Fxml version="1.0" standalone="no"%3F><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M448 225.64L448 324.64C 447.9991 350.80875 432.0669 374.34076 407.77 384.06L407.77 384.06L384.09 393.53C 374.04224 397.5538 366.7094 406.38403 364.6 417L364.6 417L354.6 467.14C 353.1011 474.62927 346.51776 480.01486 338.88 480L338.88 480L173.12 480C 165.4935 480.00055 158.9267 474.6182 157.43 467.14L157.43 467.14L147.4 417C 145.28139 406.39536 137.95001 397.57812 127.909996 393.56L127.909996 393.56L104.229996 384.09C 79.933105 374.37076 64.00087 350.8387 64 324.67L64 324.67L64 224C 64 118.08 149.77 32.19 255.65 32C 361.52997 31.810001 448 119.85 448 225.64z" stroke="black" stroke-width="32" stroke-linecap="square" fill="black" /><path d="M208 280C 208 291.04572 204.09476 300.47382 196.28427 308.28427C 188.47379 316.0948 179.0457 320 168 320C 156.95432 320 147.52621 316.0948 139.71573 308.28427C 131.90524 300.47382 128 291.04572 128 280C 128 268.9543 131.90524 259.5262 139.71573 251.71573C 147.52621 243.90524 156.95432 240 168 240C 179.0457 240 188.47379 243.90524 196.28427 251.71573C 204.09476 259.5262 208 268.9543 208 280C 208 280.46548 207.99188 280.9308 207.97563 281.39597" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /><path d="M384 280C 384 291.04572 380.09476 300.47382 372.28427 308.28427C 364.4738 316.0948 355.04572 320 344 320C 332.9543 320 323.5262 316.0948 315.71573 308.28427C 307.90524 300.47382 304 291.04572 304 280C 304 268.9543 307.90524 259.5262 315.71573 251.71573C 323.5262 243.90524 332.9543 240 344 240C 355.04572 240 364.4738 243.90524 372.28427 251.71573C 380.09476 259.5262 384 268.9543 384 280C 384 280.46548 383.99188 280.9308 383.97565 281.39597" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /><path d="M256 336L240 384L272 384L256 336L256 336" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /><path d="M256 448L256 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /><path d="M208 448L208 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /><path d="M304 448L304 480" stroke="%23C0C0C0" stroke-width="32" stroke-linecap="square" fill="%23C0C0C0" /></g></svg>');
    background-color: #C0C0C0;
  }

  [data-theme="light"] .rank-icon__svg--sword_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.875 0 0 0.875 0 0)"><path d="M2 19.2L3.8 21L2 19.2zM4.7 13.8L5.6 17.4zM5.6 17.4L9.2 18.3zM5.6 17.4L2.9 20.1zM16.4 3.9L7.4 12.9L7.85 15.15L10.1 15.6L19.1 6.6L20 3L16.4 3.9z" stroke="black" stroke-width="2" stroke-linecap="square" fill="black" /><path d="M22 19.2L20.2 21zM19.3 13.8L18.4 17.4zM18.4 17.4L21.1 20.1zM18.4 17.4L16.6 17.85L14.8 18.3zM9.3 11L4.9 6.6L4 3L7.6 3.9L12 8.3zM12.1 13.8L13.9 15.6L16.15 15.15L16.6 12.9L14.8 11.1" stroke="black" stroke-width="2" stroke-linecap="square" fill="black" /></g></svg>');
    background-color: #CD7F32;
  }

  [data-theme="light"] .rank-icon__svg--cross_icon {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="21" height="21"><g transform="matrix(0.041015625 0 0 0.041015625 0 0)"><path d="M486 371.316L486 142.75C 430.9156 181.09032 367.0511 204.9185 300.315 212.03C 307.88223 145.02985 332.29944 81.03862 371.288 26.028L371.288 26.028L142.72 26.028C 181.06047 81.11275 204.88866 144.97755 212 211.714C 145.0004 204.14616 81.009964 179.72868 26 140.74L26 140.74L26 369.31C 81.08441 330.96967 144.94893 307.14148 211.685 300.03C 204.10829 367.01007 179.69154 430.9801 140.712 485.974L140.712 485.974L369.28 485.974C 330.948 430.9049 307.12024 367.05975 300 300.342C 366.99957 307.90985 430.99002 332.32733 486 371.316z" stroke="none" fill="black" fill-rule="nonzero" /></g></svg>');
  }
</style>
