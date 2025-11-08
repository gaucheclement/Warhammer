# Wizard Skills - Calcul Valeurs Finales

## Contexte

Calcul de la valeur finale de chaque compétence et de son bonus associé. La valeur finale est utilisée pour les tests de compétences en jeu.

**Objectif métier** : Calculer et afficher la valeur de test de chaque compétence acquise par le personnage.

## Périmètre fonctionnel

### Formule de calcul

**Valeur finale**
- Formule : Valeur = Caractéristique liée + Avances totales
- Exemples : Athlétisme (Agilité 25 + Avances 10) = 35, Charme (Sociabilité 35 + Avances 13) = 48

**Caractéristique liée**
- Définie dans le champ `characteristic` de la table Skills (voir [skills.md](../../database/skills.md))
- Valeur provient de la table Characteristics du personnage
- Exemples : Art → Dextérité, Calme → Force Mentale, Corps à corps → Capacité de Combat

**Avances totales**
- Cumul : espèce + carrière + XP (voir [skills-advances.md](./skills-advances.md))
- Exemples : 5+10=15, 3+7=10, 0+10+5=15

### Calcul du Bonus

**Formule Bonus**
- Bonus = Valeur ÷ 10 (division entière)
- Exemples : Valeur 35 → Bonus +3, Valeur 48 → Bonus +4, Valeur 63 → Bonus +6

**Utilisation du Bonus**
- Utilisé pour certains tests (Bonus de Calme pour résister à la peur)
- Dégâts au corps à corps (Bonus de Force)
- Capacités diverses (Bonus d'Agilité pour talents)

### Mise à jour temps réel

**Déclencheurs de recalcul**
- Changement de caractéristique (avances de carrière sur caractéristiques)
- Modification d'avances de skills
- Application d'effets de talents (modificateurs de caractéristiques)

**Affichage dynamique**
- Les colonnes "Base" et "Total" se mettent à jour automatiquement
- Recalcul instantané lors de l'allocation de points

## Affichage

**Colonne "Base"**
- Valeur de la caractéristique liée
- Exemple : Dextérité 28 pour Art → Base 28

**Colonne "Augm" ou "Augmentation"**
- Total des avances (espèce + carrière + XP)
- Exemple : 5+10 = 15

**Colonne "Total"**
- Valeur finale = Base + Augmentation
- Exemple : 28 + 15 = 43

**Affichage Bonus** (si nécessaire)
- Format : "Valeur (Bonus)"
- Exemple : "43 (+4)"

## Exemples de calculs Warhammer

### Humain Agitateur - Athlétisme

**Caractéristique liée** : Agilité = 25
**Avances** : 5 (espèce) + 5 (carrière) = 10
**Valeur** : 25 + 10 = 35
**Bonus** : 35 ÷ 10 = +3

### Humain Agitateur - Charme

**Caractéristique liée** : Sociabilité = 35
**Avances** : 3 (espèce) + 10 (carrière) = 13
**Valeur** : 35 + 13 = 48
**Bonus** : 48 ÷ 10 = +4

### Nain Artisan - Métier (Forgeron)

**Caractéristique liée** : Dextérité = 30
**Avances** : 5 (espèce) + 10 (carrière) = 15
**Valeur** : 30 + 15 = 45
**Bonus** : 45 ÷ 10 = +4

### Nain Artisan - Résistance

**Caractéristique liée** : Endurance = 40
**Avances** : 5 (espèce) + 0 (carrière) = 5
**Valeur** : 40 + 5 = 45
**Bonus** : 45 ÷ 10 = +4

### Elfe Éclaireur - Corps à corps (Escrime)

**Caractéristique liée** : Capacité de Combat = 35
**Avances** : 5 (espèce) + 8 (carrière) = 13
**Valeur** : 35 + 13 = 48
**Bonus** : 48 ÷ 10 = +4

## Relations avec autres composants

**Tables** : Skills (characteristic), Characteristics (valeurs), Species/CareerLevels (avances initiales)

**Business rules** : characteristics-derived.md (calcul caractéristiques), skills-advances.md (cumul avances)

**Étapes wizard** : Characteristics (valeurs base), Species/Career Skills (avances)

## Règles métier

### Dépendances de calcul

**Ordre de calcul**
1. Caractéristiques de base (espèce + tirage/saisie)
2. Modificateurs de caractéristiques (signe astrologique, talents)
3. Avances de skills (espèce + carrière)
4. Valeurs finales de skills (caractéristique + avances)

**Recalcul en cascade**
- Si caractéristique change → toutes les skills liées recalculées
- Exemple : Talent "Affable" (+5 Sociabilité) → Charme, Commandement, etc. recalculés

### Caractéristiques liées par type de skill

**Combat** : Corps à corps (CC), Projectiles (CT)

**Physiques** : Athlétisme (Ag), Escalade (F), Chevaucher (Ag), Esquive (Ag), Résistance (E)

**Mentales** : Calme (FM), Intuition (I), Perception (I), Focalisation (FM), Langues (Int)

**Sociales** : Charme (Soc), Commandement (Soc), Intimidation (F ou FM), Ragots (Soc)

**Spécialisées** : Métier (Dex), Art (Dex), Guérison (Int), Crochetage (Dex), Navigation (Int)

### Limites et plages

**Valeur minimale**
- Caractéristique sans avances (ex: Dextérité 20 + 0 avances = 20)
- Minimum théorique : 0 (si caractéristique et avances à 0, cas rarissime)

**Valeur maximale à la création**
- Caractéristique max (~45-50 selon espèce et modificateurs) + Avances max (15) = ~60-65
- Exemple extrême : Nain Endurance 40 + Modificateurs +5 + Avances 15 = 60

**Bonus max à la création**
- Généralement +4 à +6 pour les skills principales
- Exemple : Valeur 60 → Bonus +6

## Validation et contraintes

### Validation des calculs

**Cohérence caractéristique-skill**
- Vérifier que le champ `characteristic` de Skills correspond à une caractéristique existante
- Exemple : "Dextérité" doit exister dans table Characteristics

**Recalcul automatique**
- Pas d'intervention manuelle nécessaire
- Les valeurs se mettent à jour automatiquement lors des changements

**Affichage en temps réel**
- Colonnes Base et Total doivent refléter instantanément les modifications
- Exemple : Allocation +1 avance → Total +1 immédiatement visible

## Voir aussi

- [skills-advances.md](./skills-advances.md) - Calcul des avances
- [skills-species.md](./skills-species.md) - Avances d'espèce
- [skills-career.md](./skills-career.md) - Avances de carrière
- [characteristics-derived.md](./characteristics-derived.md) - Caractéristiques dérivées
- [skills.md](../../database/skills.md) - Table Skills
- [characteristics.md](../../database/characteristics.md) - Table Characteristics
