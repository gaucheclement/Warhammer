# Wizard Step Stars - Application des effets du signe astrologique

## Vue d'ensemble

Application automatique des effets du signe astrologique sélectionné sur le personnage en création. Les effets modifient les caractéristiques et accordent potentiellement un talent initial gratuit.

**Contexte**: Effets appliqués immédiatement après validation du signe, avant passage à l'étape suivante du wizard.

---

## Types d'effets

### Modificateurs de caractéristiques

**Principe**: Le signe modifie définitivement les valeurs de caractéristiques du personnage.

**Format source**: Chaîne `star.characteristics` (ex: "+2 Force, +2 Force Mentale, -3 Initiative").

**Application**:
1. Parser chaîne pour extraire modificateurs (nom caractéristique + valeur signée)
2. Pour chaque modificateur, trouver caractéristique correspondante dans `characteristics`
3. Ajouter valeur (positive ou négative) à la caractéristique actuelle
4. Marquer source modification comme "Signe astrologique"

**Moment d'application**: Après sélection espèce, carrière et jets aléatoires, avant passage étape suivante.

**Cumulatif**: Les modificateurs s'ajoutent aux valeurs existantes (espèce + carrière + jets). Exemple: Nain CC 30 de base + Signe +2 → CC 32.

Voir [pattern-parsing.md](../../patterns/pattern-parsing.md) et [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md)

### Talent gratuit

**Principe**: Certains signes accordent un talent de rang 1 gratuitement à la naissance.

**Talents accordés** (12 possibles): Chanceux, Maître artisan (Au choix), Ferveur ardente, Noctambule, Sixième sens, Résistance (Maladie), Affinité avec les animaux, Volonté de fer, Négociateur, Seconde vue, Magie mineure, Sorcier !

**Application**:
1. Si `star.talent` non vide, parser nom talent
2. Lookup talent dans `data/talents.json`
3. Ajouter talent rang 1 à `talents`
4. Appliquer effets talent immédiatement (via `applyTalent()`)
5. Marquer source acquisition comme "Signe astrologique" (gratuit, pas de coût XP)

**Talents magiques**: Les 3 derniers (Seconde vue, Magie mineure, Sorcier !) déblocquent accès magie via `addMagic`. Voir [application-effets-talents.md](../../business-rules/application-effets-talents.md)

**Spécialisations**: Si talent avec "(Au choix)" (ex: Maître artisan), le joueur doit choisir spécialisation lors de l'application.

Voir [pattern-relation-textuelle.md](../../patterns/pattern-relation-textuelle.md) et [talents.md](../../database/talents.md)

---

## Ordre d'application

### Séquence complète

1. **Validation sélection**: Vérifier qu'un signe est sélectionné
2. **Sauvegarde signe**: Enregistrer `star = signeSelectionné`
3. **Application caractéristiques**: Parser et appliquer modificateurs
4. **Application talent**: Si présent, ajouter et appliquer effets
5. **Mise à jour état**: Marquer `star = -2` (validé)
6. **Attribution XP**: Si mode aléatoire, +25 XP
7. **Sauvegarde personnage**: Persister modifications

**Principe atomique**: Toutes modifications appliquées en bloc. Si erreur, annuler toutes modifications (rollback).

### Interactions avec autres étapes

**Ordre**: Espèce + Carrière + Jets AVANT signe. Signe modifie puis passe aux Talents/Compétences/Magie. Formule finale: Carac = Espèce base + Carrière avances + Jets + Signe.

---

## Affichage des effets

### Pendant et après sélection

**Pré-visualisation**: Afficher bonus/pénalités + talent AVANT validation. Exemple: "Grande Croix" → "Bonus: +2 Endurance, talent Résistance (Maladie)".

**Confirmation**: Après validation, afficher récapitulatif (ex: "Endurance: 28 → 30 (+2), Talent acquis: Résistance rang 1"). Modifications persistées dans fiche personnage.

---

## Exemples concrets

### Wymund l'Anachorète

Nain Mineur (F 32, FM 29, I 26) + Signe "+2 Force, +2 Force Mentale, -3 Initiative" → F 34, FM 31, I 23. Pas de talent.

### Grande Croix

Humain Soldat (End 28) + Signe "+2 Endurance" + talent "Résistance (Maladie)" → End 30, talent Résistance rang 1 (+10 tests Endurance vs maladies).

### Étoile du Sorcier (Magie mineure)

Elfe Érudit (F 25) + Signe "-3 Force" + talent "Magie mineure" → F 22, talent Magie mineure rang 1, accès domaine Magie mineure + 3 sorts mineurs aléatoires.

---

## Validation et contraintes

**Vérifications**: Signe existe, noms caractéristiques/talents valides, valeurs ≥0. Si erreur, bloquer application.

**Contraintes**: Valeurs finales ≥0, max ±5 par caractéristique, somme |bonus| - |malus| ≤5. Talent gratuit rang 1 uniquement, pas de doublon. Signe non modifiable après validation (sauf mode libre). Source "Signe astrologique" tracée.

---

## Relations avec autres tables

### Table Stars

Champs utilisés: `characteristics` (chaîne modificateurs), `talent` (nom talent). Voir [stars.md](../../database/stars.md)

### Table Characteristics

Cibles modifications: `star.characteristics` → `characteristics.label`. Modifiables: Capacité de Combat, Capacité de Tir, Force, Endurance, Initiative, Agilité, Dextérité, Intelligence, Force Mentale, Sociabilité. Voir [characteristics.md](../../database/characteristics.md)

### Table Talents

Référence: `star.talent` → `talent.label`. Talents magiques spéciaux: Seconde vue (+10 Perception surnaturel), Magie mineure (sorts mineurs), Sorcier ! (magie + malus social). Voir [talents.md](../../database/talents.md) et [application-effets-talents.md](../../business-rules/application-effets-talents.md)

---

## Règles métier

### Non-réversibilité

Signe validé non modifiable en mode création (éviter exploits, cohérence narrative). Exception: Mode libre permet modification post-création.

### Équilibrage

Signes équilibrés avec bonus + malus (sauf exceptions). Exemples: Wymund (+4/-3), Grande Croix (+2/0 + talent défensif), Étoile Sorcier (malus + talent magique).

### Traçabilité

Modifications marquées "Signe astrologique" pour audit, debug, export/import.

---

## Voir aussi

- [star-selection.md](./star-selection.md) - Sélection du signe
- [stars.md](../../database/stars.md) - Table stars complète
- [talents.md](../../database/talents.md) - Table talents
- [characteristics.md](../../database/characteristics.md) - Table caractéristiques
- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Application talents
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing chaînes
- [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md) - Modificateurs
- [pattern-relation-textuelle.md](../../patterns/pattern-relation-textuelle.md) - Relations textuelles
