# ActionButton - Guide d'utilisation

## Vue d'ensemble

`ActionButton.svelte` est un composant de bouton réutilisable qui standardise l'apparence et le comportement des boutons d'action dans l'application. Il remplace les patterns dupliqués trouvés dans ExportButton, ImportButton et ResetButton.

## Extraction de code

**Lignes CSS extraites:** ~500 lignes de styles communs
**Lignes totales éliminées des composants existants:** ~1500+ lignes (CSS + structure)

### Styles communs extraits:
- Base button styles (display, flexbox, transitions)
- Variants: primary, secondary, info, warning, error
- Sizes: small, medium, large
- Compact mode (icon-only)
- Spinner loading animation
- Modal structure complete (backdrop, header, body, footer)
- Button states (hover, active, disabled, focus-visible)
- Animations (fadeIn, slideIn, spin)
- Accessibilité (prefers-reduced-motion, prefers-contrast)
- Responsive design

## Props

### Bouton principal

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'warning' \| 'error'` | `'primary'` | Style du bouton |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Taille du bouton |
| `icon` | `string` | `null` | Nom de l'icône (compatible avec getIcon) |
| `label` | `string` | `''` | Texte du bouton |
| `compact` | `boolean` | `false` | Mode icon-only |
| `disabled` | `boolean` | `false` | Désactiver le bouton |
| `loading` | `boolean` | `false` | Afficher le spinner |

### Modale

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `showModal` | `boolean` | `false` | Contrôle l'affichage de la modale |
| `modalConfig` | `object` | voir ci-dessous | Configuration de la modale |

**Structure de modalConfig:**
```javascript
{
  title: '',                    // Titre de la modale
  confirmLabel: 'Confirmer',    // Texte du bouton de confirmation
  cancelLabel: 'Annuler',       // Texte du bouton d'annulation
  confirmVariant: 'primary'     // Style du bouton: 'primary' | 'error' | 'warning' | 'info'
}
```

### Callbacks

| Callback | Signature | Description |
|----------|-----------|-------------|
| `onClick` | `() => void` | Appelé au clic sur le bouton principal |
| `onConfirm` | `() => void` | Appelé au clic sur "Confirmer" dans la modale |
| `onCancel` | `() => void` | Appelé au clic sur "Annuler" dans la modale |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Contenu principal du bouton (remplace `label` si fourni) |
| `modal-body` | Contenu du corps de la modale |

## Exemples d'usage

### 1. Bouton simple (comme ExportButton)

```svelte
<script>
  import ActionButton from './ActionButton.svelte';

  let isExporting = false;

  function handleExport() {
    isExporting = true;
    // Logique d'export...
    isExporting = false;
  }
</script>

<ActionButton
  variant="primary"
  size="medium"
  icon="download"
  label="Export 5 modifications"
  loading={isExporting}
  onClick={handleExport}
/>
```

### 2. Bouton avec modale (comme ExportButton avec author input)

```svelte
<script>
  import ActionButton from './ActionButton.svelte';

  let showModal = false;
  let authorName = '';

  function handleClick() {
    showModal = true;
  }

  function handleConfirm() {
    // Perform export with authorName
    console.log('Exporting with author:', authorName);
    showModal = false;
  }

  function handleCancel() {
    showModal = false;
    authorName = '';
  }
</script>

<ActionButton
  variant="primary"
  icon="download"
  label="Export"
  {showModal}
  modalConfig={{
    title: 'Export Modifications',
    confirmLabel: 'Export',
    cancelLabel: 'Annuler'
  }}
  onClick={handleClick}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
>
  <div slot="modal-body">
    <p>Vous allez exporter 5 modifications.</p>

    <div class="form-group">
      <label for="author">Nom de l'auteur (optionnel)</label>
      <input
        id="author"
        type="text"
        bind:value={authorName}
        placeholder="Votre nom"
      />
    </div>
  </div>
</ActionButton>
```

### 3. Bouton d'import (comme ImportButton)

```svelte
<script>
  import ActionButton from './ActionButton.svelte';

  let isProcessing = false;
  let fileInput;

  function handleClick() {
    fileInput?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    isProcessing = true;
    // Process file...
    isProcessing = false;
  }
</script>

<input
  type="file"
  bind:this={fileInput}
  on:change={handleFileChange}
  style="display: none;"
  accept=".json"
/>

<ActionButton
  variant="primary"
  icon="upload"
  label={isProcessing ? 'Importation...' : 'Import'}
  loading={isProcessing}
  onClick={handleClick}
/>
```

### 4. Bouton de réinitialisation (comme ResetButton)

```svelte
<script>
  import ActionButton from './ActionButton.svelte';

  let showConfirm = false;

  function handleClick() {
    showConfirm = true;
  }

  function handleConfirm() {
    // Perform reset
    console.log('Resetting...');
    showConfirm = false;
  }

  function handleCancel() {
    showConfirm = false;
  }
</script>

<ActionButton
  variant="error"
  icon="trash"
  label="Réinitialiser tout"
  {showConfirm}
  modalConfig={{
    title: 'Confirmer la réinitialisation',
    confirmLabel: 'Réinitialiser',
    cancelLabel: 'Annuler',
    confirmVariant: 'error'
  }}
  onClick={handleClick}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
>
  <div slot="modal-body">
    <p>Cette action est irréversible.</p>
    <p><strong>Toutes vos modifications seront perdues.</strong></p>
  </div>
</ActionButton>
```

### 5. Bouton compact (icon-only)

```svelte
<ActionButton
  variant="info"
  size="small"
  icon="refresh"
  label="Reset"
  compact={true}
  onClick={handleReset}
/>
```

### 6. Toutes les variantes

```svelte
<!-- Primary: actions principales -->
<ActionButton variant="primary" icon="save" label="Enregistrer" />

<!-- Secondary: actions secondaires -->
<ActionButton variant="secondary" icon="edit" label="Modifier" />

<!-- Info: informations/aide -->
<ActionButton variant="info" icon="info" label="Info" />

<!-- Warning: avertissement -->
<ActionButton variant="warning" icon="alert" label="Attention" />

<!-- Error: suppression/danger -->
<ActionButton variant="error" icon="trash" label="Supprimer" />
```

### 7. Toutes les tailles

```svelte
<!-- Small -->
<ActionButton size="small" icon="save" label="Small" />

<!-- Medium (défaut) -->
<ActionButton size="medium" icon="save" label="Medium" />

<!-- Large -->
<ActionButton size="large" icon="save" label="Large" />
```

### 8. Utilisation avancée avec slot default

```svelte
<ActionButton variant="primary" icon="download">
  <span>Export</span>
  <span class="badge">5</span>
</ActionButton>
```

## Migration des composants existants

### ExportButton → ActionButton

**Avant:**
```svelte
<ExportButton
  variant="primary"
  size="medium"
  showAuthorInput={true}
/>
```

**Après:**
```svelte
<ActionButton
  variant="primary"
  size="medium"
  icon="download"
  label={buttonLabel}
  loading={isExporting}
  showModal={showModal}
  modalConfig={{
    title: 'Export Modifications',
    confirmLabel: 'Export',
    cancelLabel: 'Annuler'
  }}
  onClick={handleExportClick}
  onConfirm={handleModalExport}
  onCancel={closeModal}
>
  <div slot="modal-body">
    <!-- Contenu spécifique export -->
  </div>
</ActionButton>
```

### ImportButton → ActionButton

**Avant:**
```svelte
<ImportButton
  variant="primary"
  size="medium"
/>
```

**Après:**
```svelte
<ActionButton
  variant="primary"
  size="medium"
  icon="upload"
  label={isProcessing ? 'Importation...' : 'Import'}
  loading={isProcessing}
  onClick={triggerFileInput}
/>
<!-- + gérer la modale séparément si nécessaire -->
```

### ResetButton → ActionButton

**Avant:**
```svelte
<ResetButton
  variant="all"
  entityType="units"
/>
```

**Après:**
```svelte
<ActionButton
  variant="error"
  icon="trash"
  label="Réinitialiser tout"
  showModal={showConfirmDialog}
  modalConfig={{
    title: 'Confirmer la réinitialisation',
    confirmLabel: 'Réinitialiser',
    cancelLabel: 'Annuler',
    confirmVariant: 'error'
  }}
  onClick={handleResetClick}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
>
  <div slot="modal-body">
    <!-- Message de confirmation -->
  </div>
</ActionButton>
```

## Variables CSS utilisées

Le composant s'appuie sur les variables CSS existantes du design system:

### Spacing
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`

### Colors
- `--color-primary`, `--color-primary-hover`
- `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
- `--color-text-primary`, `--color-text-secondary`, `--color-text-on-primary`
- `--color-border`, `--color-border-strong`, `--color-border-focus`
- `--color-info`, `--color-info-bg`
- `--color-warning`, `--color-warning-bg`
- `--color-error`, `--color-error-bg`
- `--color-surface` (fallback vers bg-primary si non définie)

### Typography
- `--font-ui`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- `--font-size-xs`, `--font-size-sm`, `--font-size-base`, `--font-size-lg`, `--font-size-xl`

### Effects
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- `--shadow-xl`
- `--transition-fast`
- `--focus-ring-width`, `--focus-ring-offset`

## Accessibilité

Le composant inclut:
- Support complet du clavier (Enter, Escape)
- ARIA labels et roles appropriés
- Focus visible avec outline
- Support de `prefers-reduced-motion`
- Support de `prefers-contrast`
- Boutons désactivés gérés correctement
- Modal avec backdrop et focus trap

## Notes techniques

1. **Icônes:** Le composant utilise `getIcon()` de `../lib/icons.js`
2. **Modale:** La modale est intégrée au composant avec fermeture par Escape ou clic backdrop
3. **Slots:** Supporte les slots pour maximum de flexibilité
4. **CSS:** Tous les styles sont scoped et utilisent les CSS custom properties
5. **Animations:** Inclut fadeIn, slideIn et spinner avec support reduced-motion
