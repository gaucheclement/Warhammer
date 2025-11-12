# Prévisualisation et Descriptions Riches

## Objectif

Prévisualisation modifications admin avant sauvegarde pour validation visuelle et test rendu. Gère l'affichage descriptions HTML formatées avec éditeur riche.

## Fonctionnalités Prévisualisation

**Aperçu description HTML**: Bouton "Prévisualiser" affiche rendu desc avec HTML formaté dans popup modale

**Traitement texte**: Suppression espaces début/fin, suppression retours ligne multiples fin, conversion séquences sauts ligne en doubles sauts HTML (br×2), normalisation apostrophes typographiques → simples

**Affichage**: Popup modale overlay avec rendu HTML, application CSS, fermeture clic extérieur ou bouton Fermer

**Processus**: Éditer desc textarea (éditeur HTML riche) → Cliquer Prévisualiser (si activé) → Popup rendu final → Vérification visuelle (mise en forme, typos) → Fermer popup, ajuster si nécessaire, valider sauvegarde

## État Actuel

**Bouton désactivé**: Code commenté Admin.html (lignes 37-45), nécessite activation manuelle

**Desc uniquement**: Prévisualisation limitée descriptions, pas skills/talents/autres champs

**Pas de rendu complet**: Ne montre pas comment apparaît dans wizard réel

**Pas d'aperçu automatique**: Nécessite activation manuelle

## Activation Prévisualisation

**Conditions affichage**: Champ Description visible contient texte, si vide aucune popup

**Pour activer**: Décommenter code activation bouton dans Admin.html

## Éditeur HTML Riche

**Fonctionnalités**: Mise en forme texte (gras, italique, souligné), listes à puces et numérotées, sauts ligne et paragraphes, conservation balises HTML personnalisées

**Intégration**: Textarea avec toolbar édition, conversion automatique markdown/HTML basique, nettoyage sauts ligne multiples

**Format HTML**: Balises autorisées b/i/u/br/p/ul/ol/li, inline CSS préservé, nettoyage automatique balises invalides

## Exemples Concrets

**Exemple 1 - Talent**: Éditer "Strike Mighty Blow" → Modifier desc "Ce talent permet de b>frapper avec puissance/b>.br×2Bonus: +1 dégât." → Prévisualiser → Popup texte formaté gras et sauts ligne → Vérifier rendu, fermer, valider

**Exemple 2 - Species**: Éditer "Halflings" → Desc longue avec multiples paragraphes HTML → Prévisualiser mise en page → Ajuster balises si nécessaire

**Exemple 3 - Career**: Éditer "Soldat" → Ajouter sections ul>li>Compétences combat/li>li>Entraînement physique/li>/ul> → Prévisualiser liste → Valider mise en forme

## Relations

**Dépendances**: admin-ui.md - Interface admin, pattern-descriptions-html.md - Format HTML

**Fonctionnalités liées**: Toutes tables edit-* - Descriptions éditables, admin-edit-entities.md - Formulaires édition, save.md - Sauvegarde post-prévisualisation

## Limites et Contraintes

**Fonctionnalité désactivée**: Nécessite activation manuelle code

**Desc uniquement**: Pas prévisualisation autres champs

**Pas de rendu contextualisé**: Ne montre pas rendu final dans wizard

**Pas de validation HTML**: Balises invalides non détectées édition

**Pas de mode wysiwyg complet**: Éditeur simple, pas éditeur avancé type TinyMCE/CKEditor
