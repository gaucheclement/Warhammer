# Prévisualisation Modifications

## Objectif

Prévisualisation des modifications admin avant sauvegarde pour validation visuelle et test rendu.

## Fonctionnalités

**Aperçu description HTML**: Bouton "Prévisualiser" pour voir rendu desc avec HTML formaté

**Mode avant/après**: Comparaison visuelle état original vs modifié (optionnel)

**Prévisualisation dans contexte**: Voir comment modification apparaît dans wizard/sheet (optionnel, non implémenté)

## Interface Prévisualisation

**Popup modale**: Affichage desc dans popup overlay

**Rendu HTML**: Conversion markdown/HTML, application CSS

**Nettoyage**: Sauts ligne multiples → `<br><br>`, trim fin texte

**Fermeture**: Clic extérieur ou bouton "Fermer"

## Processus

**Étape 1**: Éditer desc dans textarea (éditeur HTML riche)

**Étape 2**: Cliquer bouton "Prévisualiser" (si activé)

**Étape 3**: Popup affiche rendu final

**Étape 4**: Vérification visuelle (mise en forme, typos, etc.)

**Étape 5**: Fermer popup, ajuster si nécessaire, valider sauvegarde

## Limitations Actuelles

**Bouton désactivé**: Code commenté dans Admin.html (lignes 37-45)

**Pas d'aperçu automatique**: Nécessite activation manuelle

**Desc uniquement**: Prévisualisation limitée aux descriptions, pas des skills/talents/etc.

**Pas de rendu complet**: Ne montre pas comment apparaît dans wizard réel

## Activation Prévisualisation

**Comportement du bouton "Prévisualiser"**:

Lorsque le bouton est activé, il permet d'afficher le contenu du champ Description dans une popup modale.

**Conditions d'affichage**:
- Le champ Description visible doit contenir du texte
- Si vide, aucune popup ne s'affiche

**Traitement du texte**:
1. Suppression des espaces en début/fin
2. Suppression des retours à la ligne multiples en fin de texte
3. Conversion des séquences de sauts de ligne en doubles sauts HTML (`<br><br>`)
4. Normalisation des apostrophes typographiques en apostrophes simples

**Affichage**: Popup modale affichant le texte formaté pour validation visuelle

**Pour activer**: Décommenter le code d'activation du bouton dans Admin.html

## Exemples Concrets Warhammer

**Exemple 1: Prévisualiser description talent**
1. Éditer talent "Strike Mighty Blow"
2. Modifier desc: "Ce talent permet de <b>frapper avec puissance</b>.<br><br>Bonus: +1 dégât."
3. Cliquer "Prévisualiser"
4. Popup affiche texte formaté avec gras et sauts ligne
5. Vérifier rendu, fermer, valider sauvegarde

**Exemple 2: Prévisualiser description species**
1. Éditer species "Halflings"
2. Desc longue avec multiples paragraphes HTML
3. Prévisualiser pour vérifier mise en page
4. Ajuster balises si nécessaire

## Relations avec Autres Fonctionnalités

**Dépendances**
- [interface.md](./interface.md) - Interface admin
- [pattern-descriptions-html.md](../../patterns/pattern-descriptions-html.md) - Format HTML

**Fonctionnalités liées**
- Toutes tables edit-* - Descriptions éditables
- [save.md](./save.md) - Sauvegarde post-prévisualisation

## Limites et Contraintes

**Fonctionnalité désactivée**: Nécessite activation manuelle code

**Desc uniquement**: Pas de prévisualisation autres champs

**Pas de rendu contextualisé**: Ne montre pas rendu final dans wizard
