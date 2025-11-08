# Wizard Skills - Groupement et Organisation

## Contexte

Organisation visuelle et regroupement des compétences affichées dans l'étape Skills. Les compétences sont organisées pour faciliter la lecture et la navigation.

**Objectif métier** : Permettre au joueur de comprendre facilement la structure des compétences et de naviguer efficacement dans la liste.

## Périmètre fonctionnel

### Groupement par type Basic/Advanced

**Compétences Basic**
- Type "base" dans la table Skills (voir [skills.md](../../database/skills.md))
- Accessibles à tous les personnages sans formation particulière
- Exemples : Athlétisme, Calme, Charme, Esquive, Intuition, Perception, Résistance

**Compétences Advanced**
- Type "avancée" dans la table Skills
- Nécessitent formation spécifique (listées dans carrière)
- Exemples : Crochetage, Focalisation, Guérison, Langue, Navigation

**Affichage groupé**
- Section "Compétences de base" : toutes les skills type="base"
- Section "Compétences avancées" : toutes les skills type="avancée"
- Séparateur visuel ou titre de section entre les deux groupes

### Organisation par caractéristique liée

**Groupement par attribut**
- Compétences regroupées selon le champ `characteristic`
- Sous-sections : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc

**Exemples de groupes**
- **CC** (Capacité de Combat) : Corps à corps (toutes specs)
- **CT** (Capacité de Tir) : Projectiles (toutes specs)
- **Ag** (Agilité) : Athlétisme, Esquive, Chevaucher, Discrétion
- **Dex** (Dextérité) : Art, Métier, Crochetage, Escamotage, Passe-passe
- **Int** (Intelligence) : Connaissance, Guérison, Langue, Navigation, Recherche
- **FM** (Force Mentale) : Calme, Focalisation, Commandement (en partie)
- **Soc** (Sociabilité) : Charme, Commandement, Commerage, Marchandage, Ragots

**Utilité**
- Visualiser rapidement quelles compétences bénéficient d'une caractéristique élevée
- Comprendre les synergies entre caractéristiques et compétences

### Ordre alphabétique dans chaque groupe

**Tri**
- Compétences triées alphabétiquement par label au sein de chaque groupe/section
- Exemple section Ag : Athlétisme, Chevaucher, Discrétion (Rurale), Esquive

**Gestion des spécialisations**
- Tri sur le label complet incluant spécialisation
- Exemple : Art (Calligraphie), Art (Peinture), Art (Sculpture)
- Corps à corps (Bagarre), Corps à corps (Base), Corps à corps (Escrime)

## Affichage regroupé lisible

### Structure visuelle

**Titres de sections**
- "Compétences de base" / "Compétences avancées"
- Ou : regroupement par caractéristique avec titres "Agilité", "Dextérité", etc.

**Séparateurs**
- Ligne horizontale ou espace blanc entre groupes
- Titres en gras ou couleur différente

**Liste compacte**
- Tableau avec colonnes : Nom | Base | Augm | Total
- Pas de ligne vide entre skills du même groupe
- Ligne de séparation ou titre entre groupes différents

### Mode d'affichage

**Affichage par défaut (probable)**
- Liste unique triée alphabétiquement
- Pas de regroupement visuel (simple tri)

**Affichage alternatif (possible)**
- Regroupement Basic/Advanced avec titres de section
- Ou regroupement par caractéristique

**Filtrage (non implémenté dans wizard)**
- Possible amélioration future : filtrer par type ou caractéristique
- Non présent dans le code actuel de StepSkills.html

## Exemples d'organisation Warhammer

### Affichage alphabétique simple (implémentation actuelle)

**Liste complète triée**
- Animaux, Art (Peinture), Athlétisme, Calme, Charme, Commandement, Commerage, Connaissance (Reikland), Corps à corps (Base), Esquive, Intuition, Langue (Bataille), Métier (Forgeron), Perception, Ragots, Résistance

**Avantages**
- Simple, rapide à parcourir
- Pas de complexité visuelle

**Inconvénients**
- Pas de distinction Basic/Advanced
- Pas de regroupement logique

### Affichage groupé par type (amélioration possible)

**Compétences de base**
- Athlétisme, Calme, Charme, Commerage, Corps à corps (Base), Esquive, Intuition, Perception, Ragots, Résistance

**Compétences avancées**
- Animaux, Art (Peinture), Commandement, Connaissance (Reikland), Langue (Bataille), Métier (Forgeron)

**Avantages**
- Distinction claire entre compétences universelles et spécialisées

### Affichage groupé par caractéristique (amélioration possible)

**Agilité (Ag)**
- Athlétisme, Esquive

**Dextérité (Dex)**
- Art (Peinture), Métier (Forgeron)

**Intelligence (Int)**
- Connaissance (Reikland), Langue (Bataille)

**Force Mentale (FM)**
- Calme, Commandement

**Sociabilité (Soc)**
- Charme, Commerage, Ragots

**Capacité de Combat (CC)**
- Corps à corps (Base)

**Avantages**
- Visualisation des synergies
- Compréhension des forces du personnage

## Relations avec autres composants

**Tables** : Skills (type, characteristic, label), Characteristics (labels des caractéristiques)

**Étapes wizard** : Species Skills, Career Skills (affichent les listes groupées)

**Patterns** : Aucun pattern spécifique, logique d'affichage UI

## Règles métier

### Ordre de tri

**Priorité 1 : Regroupement (si implémenté)**
- Par type (Basic/Advanced) ou par caractéristique

**Priorité 2 : Alphabétique**
- Tri sur le champ `label` complet (incluant spécialisation)
- Tri insensible à la casse (normalement)

**Priorité 3 : Compétences avec avances d'abord (optionnel)**
- Possible amélioration : afficher en premier les skills avec points > 0
- Non implémenté dans le code actuel

### Cohérence entre étapes

**Species Skills**
- Liste uniquement les compétences de l'espèce
- Tri alphabétique simple

**Career Skills**
- Liste uniquement les compétences du niveau 1 de carrière
- Tri alphabétique simple
- Possibilité d'afficher toutes les skills en mode Free (avec highlighting)

### Mode Free

**Affichage étendu**
- Toutes les compétences de la base de données disponibles
- Compétences raciales/carrière surlignées (class `highlighting`)
- Tri alphabétique global

## Validation et contraintes

**Aucune validation spécifique**
- Le groupement est purement visuel
- Pas d'impact sur les règles métier ou la validation

**Performance**
- Tri dynamique en JavaScript (rapide pour ~50 skills)
- Pas de pagination nécessaire

## Voir aussi

- [skills-species.md](./skills-species.md) - Affichage skills espèce
- [skills-career.md](./skills-career.md) - Affichage skills carrière
- [skills.md](../../database/skills.md) - Table Skills (type, characteristic)
- [characteristics.md](../../database/characteristics.md) - Table Characteristics
