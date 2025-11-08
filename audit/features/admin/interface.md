# Interface Administration

## Objectif

L'interface d'administration permet de modifier les données de référence du jeu (species, careers, talents, skills, spells, trappings, etc.) directement dans Google Sheets via une interface web sécurisée.

## Authentification

**Protection des routes**
- Accès réservé aux administrateurs authentifiés
- Redirection automatique vers page login si non authentifié
- Session maintenue pendant la durée d'utilisation

**Page login**
- Formulaire d'authentification simple
- Validation des identifiants côté serveur
- Message d'erreur en cas d'échec
- Pas de système de récupération de mot de passe (gestion manuelle)

## Navigation

**Menu principal**
- Sélection déroulante des catégories de données à éditer
- Organisation hiérarchique par type de contenu
- Structure arborescente reflétant l'organisation des données

**Catégories disponibles**
- Species, Careers, Talents, Skills, Spells, Trappings
- Tables de référence (Lores, Gods, Stars, Books, etc.)

## Interface Two-Panel

**Panneau gauche (Liste)**
- Affichage hiérarchique des éléments de la catégorie sélectionnée
- Indentation visuelle des niveaux de hiérarchie
- Barre de recherche pour filtrer les éléments
- Sélection d'un élément pour édition
- Indication visuelle de l'élément sélectionné

**Panneau droit (Édition)**
- Formulaire d'édition de l'élément sélectionné
- Champs adaptés au type de données (texte, select, textarea)
- Bouton "Valider" pour sauvegarder les modifications
- Bouton "Dupliquer" pour créer un nouvel élément basé sur l'existant
- Prévisualisation des descriptions HTML (optionnel)

## Workflow d'Édition

**Sélection d'un élément**
1. Choisir la catégorie dans le menu principal
2. Filtrer/rechercher l'élément dans le panneau gauche
3. Cliquer sur l'élément pour l'ouvrir en édition
4. Le formulaire se remplit automatiquement avec les données existantes

**Modification**
1. Éditer les champs nécessaires
2. Utiliser les éditeurs riches pour les descriptions (HTML)
3. Sélectionner les valeurs dans les listes déroulantes (avec autocomplétion)
4. Cliquer sur "Valider" pour sauvegarder

**Duplication**
1. Sélectionner l'élément source
2. Cliquer sur "Dupliquer"
3. Un nouvel élément est créé avec les mêmes données de structure (type, subType, book, page, etc.)
4. Tous les autres champs sont vidés
5. Le label est défini comme "new Item"
6. L'élément est inséré juste après l'élément source
7. Le formulaire d'édition s'ouvre automatiquement

**Annulation**
- Rechargement des données originales si modification non sauvegardée
- Retour à l'état initial en changeant de catégorie ou d'élément

## Champs d'Édition

**Champs texte simples**
- Nom, label, titre, abréviation, préfixe, suffixe

**Champs textarea**
- Description (avec éditeur HTML riche), notes, commentaires

**Listes déroulantes**
- Sélection parmi les valeurs prédéfinies
- Autocomplétion pour faciliter la recherche
- Mode "free" permettant d'ajouter de nouvelles valeurs à la volée

**Champs numériques**
- Page de référence, valeurs de caractéristiques, quantités, modificateurs

**Champs complexes**
- Livre et page (combinaison select + input), listes d'éléments, tableaux de valeurs

## Autocomplétion

**Mode standard (autocomplete)**
- Liste fermée de valeurs prédéfinies
- Recherche par saisie
- Sélection obligatoire dans la liste
- Utilisé pour les références fixes (books, species, careers, etc.)

**Mode libre (autocomplete-free)**
- Liste de suggestions mais saisie libre autorisée
- Si valeur saisie non existante, elle est ajoutée automatiquement à la liste
- Utilisé pour les champs extensibles (nouveaux talents, nouvelles compétences, etc.)

## Éditeur HTML Riche

**Fonctionnalités**
- Mise en forme du texte (gras, italique, souligné)
- Listes à puces et numérotées
- Sauts de ligne et paragraphes
- Conservation des balises HTML personnalisées

**Prévisualisation**
- Bouton optionnel pour prévisualiser le rendu HTML
- Affichage dans une popup modale
- Conversion des sauts de ligne en `<br>`
- Nettoyage des sauts de ligne multiples en fin de texte

## Sauvegarde

**Processus**
1. Collecte des données du formulaire via `EditHelper.prepareData()`
2. Conversion des structures imbriquées en format texte
3. Nettoyage des valeurs (trim, remplacement caractères spéciaux)
4. Envoi au serveur Google Apps Script via `google.script.run.saveData()`
5. Mise à jour des données en base (Google Sheets)
6. Rechargement partiel des données modifiées
7. Restauration de l'état de l'interface (position, sélection, recherche)

**Feedback utilisateur**
- Loader affiché pendant la sauvegarde
- Retour automatique à l'élément modifié après sauvegarde
- Conservation de la position de scroll et du filtre de recherche

## Exemples Concrets Warhammer

**Exemple 1 : Éditer une espèce**
- Sélectionner "Species" dans le menu
- Filtrer avec "Human"
- Cliquer sur "Human" dans la liste
- Modifier la description HTML
- Ajuster les modificateurs de caractéristiques
- Valider la sauvegarde

**Exemple 2 : Dupliquer un talent**
- Sélectionner "Talents" dans le menu
- Chercher "Acute Sense"
- Cliquer sur "Acute Sense (Sight)"
- Cliquer sur "Dupliquer"
- Renommer en "Acute Sense (Taste)"
- Modifier la description spécifique
- Valider la sauvegarde

**Exemple 3 : Créer une nouvelle carrière**
- Sélectionner "Careers" dans le menu
- Chercher une carrière similaire (ex: "Soldier")
- Dupliquer "Soldier"
- Renommer en "Knight"
- Modifier la classe, les skills, les talents
- Ajuster le schéma de progression
- Valider la sauvegarde

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/species.md](../../database/species.md) - Structure des données species
- [database/careers.md](../../database/careers.md) - Structure des données careers
- [database/talents.md](../../database/talents.md) - Structure des données talents
- [database/skills.md](../../database/skills.md) - Structure des données skills
- [database/spells.md](../../database/spells.md) - Structure des données spells
- [database/trappings.md](../../database/trappings.md) - Structure des données trappings

**Fonctionnalités liées**
- [edit-species.md](./edit-species.md) - Édition spécifique des species
- [edit-careers.md](./edit-careers.md) - Édition spécifique des careers
- [edit-talents.md](./edit-talents.md) - Édition spécifique des talents
- [edit-skills.md](./edit-skills.md) - Édition spécifique des skills
- [edit-spells.md](./edit-spells.md) - Édition spécifique des spells
- [edit-trappings.md](./edit-trappings.md) - Édition spécifique des trappings
- [validation.md](./validation.md) - Validation des modifications
- [save.md](./save.md) - Processus de sauvegarde détaillé

## Limites et Contraintes

**Pas de gestion avancée**
- Pas de système de permissions granulaires (admin = accès complet)
- Pas d'historique des modifications (voir [history.md](./history.md))
- Pas de vérification de conflits concurrents
- Pas de mode brouillon (modifications immédiates)

**Validation basique**
- Validation schéma JSON côté serveur uniquement
- Pas de validation métier en temps réel
- Pas de détection automatique des incohérences
