# Characteristics - Table des Caractéristiques

## Vue d'ensemble

Les Caractéristiques représentent les attributs fondamentaux d'un personnage dans Warhammer. Chaque caractéristique définit une capacité physique, mentale ou spirituelle utilisée comme base pour les tests et les calculs de jeu.

## Structure de données

### Champs principaux

- **index**: Position unique de la caractéristique (0-17)
- **label**: Nom complet en français
- **abr**: Abréviation utilisée dans les feuilles de personnage
- **type**: Catégorie de la caractéristique
- **desc**: Description détaillée du rôle et des usages
- **book**: Référence du livre source
- **page**: Numéro de page dans la source
- **rand**: Valeurs de base par espèce

### Types de caractéristiques

**roll**: Caractéristiques générées par tirage aléatoire
- CC, CT, F, E, I, Ag, Dex, Int, FM, Soc (indices 0-9)
- Valeurs de base variant selon l'espèce (10-40)

**wounds**: Points de Blessure (index 10)
- Calculés via formule incluant BF, BE, BFM
- Formules différentes par espèce

**extra**: Points spéciaux à distribution (indices 11-14)
- Destin, Résilience et leurs pools associés
- Extra Points pour répartition libre

**mv**: Mouvement (index 16)
- Valeur fixe par espèce (3-6)
- Détermine vitesses de marche et course

**points**: Points à distribuer (index 15)
- Entre Destin et Résilience
- Montant variable par espèce

**Autres**: Corruption (index 17), Chance (index 12), Détermination (index 14)
- Pas de type spécifique
- Initialisés à 0

## Relations avec Skills

### Lien caractéristique-compétence

Chaque compétence est associée à une caractéristique via le champ "characteristic" dans skills.json.

**Exemples de répartition**:
- **CC**: Corps à corps (Bagarre, Base, Cavalerie, etc.)
- **CT**: Projectiles (Arc, Arbalète, Poudre noire, etc.)
- **F**: Force physique (Escalade, Natation, Ramer, Intimidation)
- **E**: Endurance (Résistance, Résistance à l'alcool)
- **I**: Réactivité (Initiative, Intuition, Orientation, Perception, Pistage)
- **Ag**: Coordination (Athlétisme, Chevaucher, Conduite d'attelage, Esquive, Discrétion, Voile, Représentation)
- **Dex**: Dextérité manuelle (Art, Crochetage, Escamotage, Métier, Musicien, Piégeage)
- **Int**: Intellect (Dressage, Évaluation, Guérison, Langue, Pari, Recherche, Savoir, Signes secrets, Soin aux animaux, Survie en extérieur)
- **FM**: Volonté (Calme, Emprise sur les animaux, Focalisation, Prière)
- **Soc**: Charisme (Charme, Commandement, Divertissement, Marchandage, Ragot, Subornation)

### Calcul de valeur de compétence

Valeur finale = Caractéristique de base + Avances acquises

La caractéristique définit le potentiel naturel, les avances représentent l'entraînement.

## Valeurs par espèce

### Espèces communes

**Humain**: Standard équilibré (20 sur la plupart), 4 en Mouvement
**Halfling**: CT et Dex élevées (30), petit (M3), pas de Destin de base
**Nain**: E et FM élevées (30-40), CC forte (30), lent (M3)
**Haut Elfe/Elfe Sylvain**: I très haute (40), caractéristiques mentales élevées (30), rapide (M5)
**Gnome**: Dex et FM élevées (30-40), petit (M3), 2 Points de Destin
**Ogre**: F et E exceptionnelles (35), I nulle (0), très robuste mais lent intellectuellement

### Caractéristiques dérivées

**Bonus**: Dizaine d'une caractéristique (ex: CC 35 = BC 3)
Utilisé dans de nombreux calculs et capacités

**Points de Blessure**: Formule complexe par espèce
- Standard: BF + (2 × BE) + BFM
- Halfling/Gnome: (2 × BE) + BFM
- Ogre: (BF + (2 × BE) + BFM) × 2

## Tests de cohérence

### Validation structurelle

**Unicité**: Chaque index doit être unique (0-17)
**Complétude**: Tous les champs obligatoires présents (index, label, type, desc, rand)
**Abréviations**: Cohérentes avec conventions Warhammer (CC, CT, etc.)

### Validation des valeurs rand

**Caractéristiques roll**: Valeurs multiples de 5 ou 10, plage 0-40
**Espèces complètes**: Toutes les espèces présentes pour chaque caractéristique
**Cohérence des formules**: Blessures utilisent BF, BE, BFM correctement

### Relations inter-tables

**Skills**: Chaque skill.characteristic doit correspondre à un label valide
**Species**: Espèces en rand doivent exister dans species.json
**CareerLevels**: Avances de caractéristiques doivent référencer des abréviations valides

### Règles métier

**Types cohérents**: roll pour 0-9, wounds pour 10, extra/points/mv selon logique
**Progression logique**: Pas de valeur négative
**Mouvement borné**: Entre 3 et 6
**Points raisonnables**: Destin/Résilience/Extra dans limites attendues (0-3)

## Règles de validation

### Contraintes par champ

**index**: Entier 0-17, unique, séquentiel
**label**: Texte non vide, unique
**abr**: Texte court ou vide, cohérent avec conventions
**type**: Parmi: roll, wounds, extra, mv, points, ou vide
**desc**: Texte non vide, HTML autorisé
**book**: Code source valide (LDB, VDLM)
**page**: Entier positif
**rand**: Objet avec clés espèces, valeurs entières ou formules

### Validation des espèces dans rand

Espèces attendues: Humain, Halfling, Nain, Haut Elfe, Elfe Sylvain, Gnome, Ogre
Toutes doivent être présentes pour chaque caractéristique

### Format des formules

Pour Blessures: Expressions arithmétiques utilisant BF, BE, BFM, × et +
Validation: Syntaxe correcte, opérateurs valides

### Intégrité référentielle

**vers Skills**: label doit apparaître comme characteristic dans skills.json
**vers Species**: Clés de rand doivent correspondre aux noms d'espèces
**vers CareerLevels**: abr doit être utilisable dans avances de carrière

### Messages d'erreur métier

**Index manquant**: "Caractéristique sans index défini"
**Index dupliqué**: "Index {X} utilisé plusieurs fois"
**Label vide**: "Label requis pour caractéristique {index}"
**Type invalide**: "Type {type} inconnu pour {label}"
**Espèce manquante**: "{espèce} absente dans rand pour {label}"
**Valeur hors limites**: "Valeur {val} invalide pour {label} (attendu 0-40)"
**Formule invalide**: "Formule Blessures incorrecte pour {espèce}"
**Référence cassée**: "{label} référencée dans skills mais absente"

## Exemples concrets Warhammer

**Capacité de Combat (CC)**: Nain 30, Humain 20
Un nain débute avec +10 en combat au corps à corps

**Initiative (I)**: Haut Elfe 40, Ogre 0
L'elfe agit en premier, l'ogre est très lent à réagir

**Blessures (B)**: Ogre a formule ×2
Deux fois plus résistant qu'un humain à Force et Endurance égales

**Mouvement (M)**: Elfe 5, Halfling 3
L'elfe parcourt 10km/h en marche, le halfling 6km/h

**Destin**: Humain 2, Gnome 2, autres 0
Humains et gnomes ont une destinée spéciale

**Extra Points**: Humain 3, Nain 2
L'humain peut mieux personnaliser Destin/Résilience
