# Gestion des Spécialisations de Compétences

## Patterns techniques utilisés

- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - Liste de spécialisations possibles, "(Au choix)"
- [pattern-parsing.md](../patterns/pattern-parsing.md) - "Compétence (Spécialisation)", Format listes specs

## Vue d'ensemble

Certaines compétences nécessitent une **spécialisation** : le personnage ne sait pas "Art" en général, mais "Art (Peinture)" spécifiquement. Chaque spécialisation est une compétence distincte.

## Compétence groupée vs non groupée

### Non groupée
**Définition** : Compétence sans spécialisations, s'acquiert telle quelle.

**Dans skills.json** : Champ `specs` est vide.

**Exemples** : Athlétisme, Calme, Esquive, Perception, Résistance.

### Groupée
**Définition** : Compétence avec spécialisations, le personnage doit en choisir une.

**Dans skills.json** : Champ `specs` contient liste selon [pattern-parsing.md](../patterns/pattern-parsing.md).

**Exemples** :
- Art : "Calligraphie, Cartographie, Écriture, Gravure, Peinture, Sculpture, ..."
- Corps à corps : "Armes d'hast, À deux mains, Bagarre, Base, Cavalerie, Escrime, ..."
- Langue : "Bretonnien, Classique, Elthárin, Khazalid, Reikspiel, Tiléen, ..."
- Métier : "Apothicaire, Armurier, Charpentier, Forgeron, ..." (40+ spécialisations)

## Dans le personnage

### Structure données
Voir [pattern-parsing.md](../patterns/pattern-parsing.md) pour format stockage.

**Compétence groupée spécialisée** :
- `label` = nom compétence
- `specs` = liste spécialisations disponibles
- `spec` = spécialisation choisie
- Affichage : "Art (Peinture)", "Langue (Bretonnien)"

**Compétence en attente** :
- `spec` vide → joueur doit choisir avant utilisation

## Règles de sélection

### Spécialisation imposée
Source (espèce/carrière) impose une spécialisation spécifique.

**Exemple** : Elfe donne "Langue (Elthárin)", pas "Langue (Au choix)".

### Spécialisation au choix
Source donne la compétence mais laisse le choix. Voir [pattern-specialisations.md](../patterns/pattern-specialisations.md).

**Exemple** : Carrière artisan donne "Métier (Au choix)".

**Interface** : Popup affiche liste `specs`, joueur sélectionne.

### Acquisition multiple
**Principe** : Un personnage peut apprendre plusieurs spécialisations de la même compétence.

**Exemples** :
- "Art (Peinture)" ET "Art (Sculpture)" = 2 compétences distinctes
- "Langue (Bretonnien)" ET "Langue (Reikspiel)" = 2 compétences distinctes

**Progression indépendante** :
- "Art (Peinture)" +10 et "Art (Sculpture)" +5 = deux valeurs différentes
- Coûts XP calculés par spécialisation

**Limite** : Aucune limite au nombre de spécialisations.

## Cas particulier : Focalisation

**Unicité** : SEULE compétence à la fois groupée et non groupée.

**Mode groupé** (mages formés) :
- Spécialisations : 9 Vents de Magie (Aqshy, Azyr, Chamon, Dhar, Ghur, Ghyran, Hysh, Shyish, Ulgu)
- Le mage choisit son Vent : "Focalisation (Aqshy)"

**Mode non groupé** (non formés) :
- "Focalisation" sans spécialisation
- Rare, utilisateurs informels de magie

**Raison** : Reflète différence mages formés (Collèges) vs informels.

## Spécialisations par catégorie

**Arts/Artisanat** : Art (10), Métier (40+), Musicien (7)

**Combat** : Corps à corps (8), Projectiles (8)

**Social** : Divertissement (10), Représentation (8), Savoir (60+)

**Langues** : Langue (19), Signes secrets (11)

**Magie** : Focalisation (9 Vents)

**Nature** : Chevaucher (6), Dressage (6), Discrétion (3)

**Navigation** : Voile (5)

## Relations avec autres tables

### Avec Species
**Format** : Voir [pattern-parsing.md](../patterns/pattern-parsing.md)

**Exemples** :
- Spécialisation imposée : "Langue (Elthárin)" pour Elfes
- Spécialisation au choix : "Métier (Au choix)" ou "Métier"

### Avec Careers et CareerLevels
**Format similaire** :
- "Art (Au choix)" = joueur choisit
- "Langue (Bataille)" = spécialisation imposée
- "Savoir (Au choix)" = courant pour carrières intellectuelles

**Accumulation** : Personnage peut avoir même compétence de plusieurs sources avec spécialisations différentes.

### Avec Talents
**Talents ajoutant compétences** :
- Si compétence groupée, talent spécifie généralement la spécialisation
- Exemple : "Mage Mineur" donne "Focalisation (Vent)" et "Langue (Magick)"

**Talents modifiant compétences** :
- Peuvent affecter une spécialisation spécifique
- Exemple : Talent affecte "Corps à corps (Escrime)" uniquement

## Validation et cohérence

**Contraintes** :
- Compétence groupée DOIT avoir spécialisation avant utilisation
- Spécialisation choisie DOIT être dans `specs` (sauf "Au choix" libre)
- Deux compétences même label mais specs différentes = distinctes

**Format affichage** :
- Si `spec` défini : "Label (Spec)"
- Si `spec` vide : "Label (Au choix)" avec indicateur choix requis

## Exemples concrets

**Elfe** : Reçoit "Langue (Elthárin)" et "Langue (Reikspiel)" → specs déjà définis, prêt à l'emploi.

**Artisan** : Reçoit "Métier (Au choix)" → choisit "Charpentier", peut apprendre "Forgeron" plus tard.

**Guerrier** : Niveaux 1-3 donnent "Corps à corps (Base)", "(Cavalerie)", "(Escrime)" → 3 compétences distinctes.

**Érudit** : Plusieurs "Savoir (Au choix)" → choisit "Histoire", "Théologie", "Loi" → progressions indépendantes.

## Références croisées

- [species.md](../database/species.md) - Compétences d'espèce
- [careers.md](../database/careers.md) - Compétences de carrière
- [skills.md](../database/skills.md) - Table compétences
- [talents.md](../database/talents.md) - Talents modifiant compétences
