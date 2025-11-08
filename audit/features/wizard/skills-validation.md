# Wizard Skills - Validation Cohérence

## Contexte

Validation de la cohérence des compétences sélectionnées lors de l'étape Skills du wizard. Vérifications avant de permettre la progression vers l'étape suivante.

**Objectif métier** : Garantir que le personnage a correctement sélectionné et configuré ses compétences initiales selon les règles de Warhammer.

## Périmètre fonctionnel

### Validation spécialisations saisies

**Spécialisations obligatoires**
- Toute compétence groupée (champ `specs` non vide) doit avoir une spécialisation définie
- Format attendu : "Nom (Spécialisation)"
- Exemples valides : "Art (Peinture)", "Métier (Forgeron)", "Langue (Bataille)"

**Détection spécialisations manquantes**
- Parcours de toutes les compétences avec points > 0
- Vérification que le champ `spec` est rempli pour les compétences groupées
- Popup automatique si spécialisation manquante lors de l'allocation de points

**Validation format**
- Spécialisation non vide (longueur > 0)
- Spécialisation cohérente avec le champ `specs` de Skills (si liste fermée)

### Détection compétences en double

**Unicité (Nom, Spécialisation)**
- Chaque combinaison doit être unique dans la liste du personnage
- Exemples valides : Art (Peinture) + Art (Sculpture) = 2 skills distinctes
- Exemple invalide : Art (Peinture) apparaît 2 fois = doublon

**Cas d'erreur théorique**
- Dans le wizard, les doublons sont structurellement impossibles (sélection unique)
- Validation utile si import/export ou édition manuelle des données

**Message d'erreur**
- "La compétence {Nom} ({Spécialisation}) est présente plusieurs fois"

### Validation pré-requis compétences Advanced

**Compétences avancées hors carrière**
- Type "avancée" dans Skills nécessite qu'elle soit dans la carrière actuelle ou passée
- Dans le wizard de création : vérifier que skills avancées sont bien dans espèce OU carrière

**Exception : Mode Free**
- En mode Free, toutes les compétences sont accessibles sans restriction

**Validation**
- Parcours des skills avancées avec points > 0
- Vérification que la skill est présente dans species.skills OU careerLevels.skills
- Message : "La compétence avancée {Nom} n'est pas accessible (pas dans espèce ou carrière)"

### Messages d'erreur explicites

**Formats de messages**

**Spécialisation manquante**
- "La compétence {Nom} nécessite une spécialisation. Veuillez en sélectionner une."
- Popup affichée automatiquement lors du clic

**Spécialisation invalide** (si liste fermée)
- "La spécialisation '{Spec}' n'est pas valide pour {Nom}. Choisissez parmi : {Liste}"

**Points non alloués complètement**
- Espèce : "Vous devez sélectionner exactement 3 compétences à +5 et 3 compétences à +3"
- Carrière : "Il reste {N} points à allouer"

**Affichage**
- Messages en rouge ou popup modale
- Bouton "Valider" désactivé si erreurs présentes
- Compteurs visuels (points restants) en temps réel

## Exemples de cas invalides Warhammer

### Cas 1 : Spécialisation manquante

**Situation** : Métier (Au choix) sans spécialisation, +5 alloués

**Validation** : Popup "Choisissez une spécialisation", blocage validation

### Cas 2 : Points incomplets (Espèce)

**Situation** : 2 compétences à +5 et 4 à +3 (au lieu de 3+3)

**Validation** : Compteurs incorrects, bouton "Valider" désactivé

### Cas 3 : Points incomplets (Carrière)

**Situation** : 35/40 points alloués

**Validation** : "5 points à allouer", bouton "Valider" désactivé

### Cas 4 : Compétence avancée hors carrière

**Situation** : Guérison (avancée) allouée, non dans espèce/carrière

**Validation** : Message "Guérison n'est pas accessible" (cas rare, liste normalement filtrée)

### Cas 5 : Doublon (théorique)

**Situation** : Art (Peinture) présent 2 fois

**Validation** : "Art (Peinture) présente plusieurs fois", blocage

## Relations avec autres composants

**Tables** : Skills (type, specs), Species (skills), CareerLevels (skills)

**Étapes wizard** : Species Skills, Career Skills (déclenchent validations)

**Patterns** : Spécialisations (format "(Au choix)", popup)

## Règles métier

### Critères de validation (Espèce)

**Critère 1 : Nombre de sélections**
- Exactement 3 compétences à +5
- Exactement 3 compétences à +3

**Critère 2 : Spécialisations**
- Toutes les compétences groupées avec points > 0 ont une spécialisation définie

**Critère 3 : Liste fermée**
- Uniquement les compétences de l'espèce sont sélectionnables (sauf mode Free)

### Critères de validation (Carrière)

**Critère 1 : Total de points**
- Exactement 40 points alloués

**Critère 2 : Limite par compétence**
- Aucune compétence ne dépasse 10 points (sauf mode Free)

**Critère 3 : Spécialisations**
- Toutes les compétences groupées avec points > 0 ont une spécialisation définie

**Critère 4 : Liste fermée**
- Uniquement les compétences de carrière sont sélectionnables (sauf mode Free)

### Mode Free

**Désactivation des validations**
- Pas de limite de points
- Toutes les compétences accessibles
- Pas de validation bloquante
- Bouton "Valider" toujours actif

**Utilité**
- Tests, création rapide de personnages
- Personnages avancés hors règles standards

## Validation et contraintes

### Validation au clic sur "Valider"

**Étape 1 : Vérification spécialisations**
- Parcours des compétences avec points > 0
- Vérification champ `spec` rempli si compétence groupée
- Si manquant : afficher popup, bloquer validation

**Étape 2 : Vérification points alloués**
- Espèce : vérifier 3×+5 et 3×+3
- Carrière : vérifier total = 40
- Si incorrect : désactiver bouton "Valider", afficher compteurs en rouge

**Étape 3 : Vérification doublons** (optionnel)
- Parcours liste, vérification unicité (label + spec)
- Si doublon : message d'erreur, bloquer validation

**Étape 4 : Vérification pré-requis advanced** (optionnel)
- Vérifier que skills avancées sont dans espèce ou carrière
- Si non : message d'erreur

### Activation/Désactivation bouton "Valider"

**Conditions d'activation**
- Espèce : 3×+5 ET 3×+3 exactement
- Carrière : 40 points exactement alloués
- Toutes spécialisations définies

**Feedback visuel**
- Bouton grisé si conditions non remplies
- Compteurs en rouge si objectifs non atteints
- Compteurs en vert si objectifs atteints

## Voir aussi

- [skills-species.md](./skills-species.md) - Validation étape espèce
- [skills-career.md](./skills-career.md) - Validation étape carrière
- [skills-specialization.md](./skills-specialization.md) - Validation spécialisations
- [skills.md](../../database/skills.md) - Table Skills (type, specs)
