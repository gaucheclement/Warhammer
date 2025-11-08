# Récapitulatif Complet du Personnage

## Contexte

L'écran de résumé (StepResume) est la dernière étape du wizard de création. Il affiche une vue complète du personnage avec toutes ses caractéristiques, compétences, talents, possessions et sorts, organisés en sections avec onglets cliquables.

## Organisation de l'affichage

### En-tête : Caractéristiques principales

Tableau des 10 caractéristiques de type "roll" avec colonnes : Nom abrégé, Symbole, Valeur initiale, Avances, Total actuel.

Exemple : Nain CC montre "30 (Init) + 10 (Aug) = 40 (Cour)"

### Onglet "Perso"

**Panneau gauche - Identité :**
1. Nom, Race, Signe Astrologique
2. Classe sociale, Carrière, Niveau de Carrière, Schéma, Statut
3. Âge, Taille, Yeux, Cheveux
4. Ambition, Marques distinctives, Autres détails

**Panneau droit - Attributs dérivés :**
- Destin : Destin (permanent), Chance (consommable)
- Résilience : Résilience (permanent), Détermination (consommable), Motivations
- Mouvement : Mouvement (base), Marche (×2), Course (×4)
- Autre : Points de Blessures, Corruption

Tous les éléments sont cliquables pour popup d'aide contextuelle.

### Onglet "Compétences/Talents"

**Panneau gauche - Compétences de base :**
Tableau avec colonnes : Nom, Caractéristique associée (abr + base), Avances, Total.
Filtre : type "base" et spec "Base".

**Panneau droit :**
- Compétences groupées et avancées (même format, filtre inversé)
- Talents : Nom, Rang actuel/Max, Description courte (test)

Seuls les talents avec rang > 0 sont affichés.

### Onglet "Possession"

**Panneau gauche - Possessions générales :**
Liste simple de tous les trappings, cliquables si description disponible.

**Panneau droit :**
- Armures : Nom, Localisation, Enc, PA, Qualités (filtre type "Armures")
- Armes : Nom, Groupe, Enc, Portée/Allonge, Dégâts, Qualités (filtre "Armes" ou "Munitions")

### Onglet "Sorts"

Affiché uniquement si le personnage possède des sorts.

**En-tête conditionnel :**
- Dieu (si talent "Béni")
- Domaine de Magie Arcanes (si talent "Magie des Arcanes")
- Domaine du Chaos (si talent "Magie du Chaos")

**Sorts par catégorie :**
5 catégories affichées si présentes : Béni, Invocation, Magie mineure, Magie des Arcanes, Magie du Chaos.

Colonnes par sort : Nom, NI, Portée, Cible, Durée, Effet.
Répartition en deux colonnes (left/right) pour optimiser l'espace.

### Onglet "Expérience"

**Résumé XP :**
1. Expérience Actuelle : xp.max - xp.tmp_used - xp.used
2. Expérience Dépensée : xp.tmp_used + xp.used
3. Expérience Totale : xp.max

**Historique :**
Liste des gains XP depuis début création (source + montant), extraite de character.xp.log.

## Interactions utilisateur

### Navigation

Interface à onglets jQuery UI permettant de basculer entre 5 sections sans rechargement.

### Popups d'aide

Clic sur tout élément affiche popup avec label, description HTML complète, et informations supplémentaires (règles, effets, sources). Éléments cliquables : caractéristiques, race, carrière, compétences, talents, trappings, sorts.

### Validation

Bouton "Valider" :
- Désactivé si personnage pas à cette étape (stepIndex !== number)
- Caché si création terminée (stepIndex === -1)
- Activé uniquement si étapes précédentes complètes

Clic valider → validation finale cohérence → stepIndex = -1 → déclenchement CharGen.defaultAction.validate.

## Calculs affichés

### Formules

- Caractéristiques : Init espèce + Avances carrière + Modificateurs talents/signe
- Compétences : Caractéristique associée + Avances (specie + career + progression)
- Mouvement dérivé : Marche = Mvt × 2, Course = Mvt × 4
- Points de Blessures : Formule espèce (ex: End + 2×Bonus End + Bonus Force)
- Destin/Résilience : Valeurs espèce + modificateurs signe/talents
- XP Actuelle : Budget restant, Dépensée : Somme coûts acquisitions, Totale : Départ + bonus

## Relations

### Dépendances d'étapes

Requiert complétion étapes : Species (#086-#090), Careers (#091-#096), Characteristics (#097-#103), Stars, Talents (#106-#112), Skills (#113-#120), Trappings (#121-#126), Detail (#127-#132), Experience (#133-#139).

### Tables utilisées

species, careers, careerLevels, characteristics, skills, talents, trappings, spells, lores, gods, stars, details.

Voir [species.md](../../database/species.md), [careers.md](../../database/careers.md), [skills.md](../../database/skills.md), [talents.md](../../database/talents.md), [trappings.md](../../database/trappings.md), [spells.md](../../database/spells.md).

## Règles métier

### Filtrage et organisation

- Compétences base sans spécialisation : Panneau gauche
- Compétences avancées + spécialisations : Panneau droit
- Talents : Filtre getAdvance() > 0 (masque non acquis)
- Sorts : Tri automatique par type, répartition deux colonnes

### Affichage conditionnel

- Onglet Sorts : Masqué si aucun sort
- Dieu : Affiché si personnage béni
- Domaine magie : Affiché si talent correspondant
- Historique XP : Toujours affiché (peut être vide)

### Clonage

Personnage cloné (character.clone()) pour affichage sans modifier original, permet retour arrière.

## Exemples Warhammer

**Agitateur Humain niveau 1 :**
- Perso : Nom "Johann", Race "Humain", Signe "Grande Croix", Classe "Roublards", Carrière "Agitateur", Niveau "Bronze 1", Statut "Cuivre 3"
- Caractéristiques : CC 30+5=35, CT 30, F 30, E 30+5=35, I 40, Ag 30+5=35, Dex 30, Int 30+10=40, FM 30+5=35, Soc 30+10=40
- Compétences base : Athlétisme (AG 35), Calme (FM 35), Charme (Soc 40+5=45)
- Talents : Orateur rang 1/1, Rompu aux armes (Armes d'hast) rang 1/1
- Trappings : Arme à 1 main, Vêtements
- XP : Totale 40 (base 20 + carrière 20), Dépensée 0, Actuelle 40

**Répurgateur Nain niveau 2 :**
- Perso : Race "Nain", Carrière "Répurgateur", Niveau "Bronze 2", Statut "Argent 1"
- Sorts Béni : Bénédiction de Courage, Bénédiction de Ténacité (via Prêtre de Grungni)
- Domaine : Grungni affiché en en-tête
- XP : Historique montre "+25 xp bonus carrière aléatoire", "+20 xp espèce Nain"

**Sorcier Elfe spécialisé Azyr :**
- Talents : Magie des Arcanes (Azyr) rang 1
- Domaine affiché : "Domaine de Magie: Azyr"
- Sorts Arcanes : Aethyrique Armure, Frappe du ciel, Comète de Cassandora (3 sorts NI 5-8-10)
- Sorts répartis en deux colonnes dans section "Magie des Arcanes"
