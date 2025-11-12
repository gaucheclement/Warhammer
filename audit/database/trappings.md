# Table Trappings

## Vue d'ensemble

Centralise tout l'équipement du jeu : armes de mêlée et à distance, armures, véhicules, objets divers. Chaque entrée représente un objet possédable, achetable ou utilisable.

## Structure de données

### Champs communs

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| index | Nombre | Oui | Identifiant unique séquentiel |
| label | Texte | Oui | Nom de l'objet |
| prefix | Texte | Non | Indicateur visuel (ex: "2M" = deux mains) |
| type | Texte | Oui | Catégorie : melee, ranged, ammunition, armor, vehicle, trapping |
| subType | Texte | Non | Sous-catégorie (ex: "Armes d'hast", "Cuir souple") |
| enc | Nombre | Oui | Encombrement |
| availability | Texte | Oui | Commune / Limitée / Rare / Exotique / Unique |
| gold, silver, bronze | Nombre | Non | Prix en Couronnes d'or, Pistoles d'argent, Sous de bronze |
| desc | HTML | Non | Description enrichie avec liens vers autres entités |
| book | Texte | Oui | Code source (LDB, EDOC, etc.) |
| page | Nombre | Oui | Page source |

### Champs spécifiques par type

**Armes mêlée (melee) :**
- `reach` : Texte (Personnelle, Très courte, Courte, Moyenne, Longue, Très longue, Considérable, Variable)
- `damage` : Formule (ex: "+BF+4")
- `qualities` : Liste séparée par virgules

**Armes distance (ranged) :**
- `reach` : Nombre (portée en mètres)
- `damage` : Formule
- `qualities` : Liste séparée par virgules

**Munitions (ammunition) :**
- `reach` : "Comme l'arme" (hérite de l'arme)
- `qualities` : Qualités additionnelles

**Armures (armor) :**
- `loc` : Emplacements protégés (Tête, Bras, Corps, Jambes, ou combinaisons)
- `pa` : Points d'armure (nombre)
- `qualities` : Propriétés (Partielle, Solide, etc.)

**Véhicules (vehicle) :**
- `carry` : Capacité de chargement
- `mode` : Propulsion (ex: "1 A" = un animal, "2 C" = deux chevaux)
- `toughness` : Endurance
- `wounds` : Points de blessure

**Objets divers (trapping) :**
- `carry` : Capacité de contenu (pour sacs, coffres)

## Relations

### Avec Qualities
- **Champ :** `qualities` (texte libre séparé par virgules)
- **Traitement :** Parsé en objets Quality
- **Usage :** Propriétés mécaniques (Défensive, Empaleuse, Assommante, Recharge N, etc.)
- **Cumul :** Plusieurs qualités par objet possible

Voir : `audit/database/qualities.md`

### Avec Tree
- **Calcul :** Dynamique via `type` + `subType`
- **Structure :** `allByType[type][subTypeId]`
- **Niveaux :** Type (1er) → SubType (2e)
- **Usage :** Navigation et catégorisation UI

### Avec Books
- **Champs :** `book` + `page`
- **Usage :** Traçabilité règles sources

## Logique métier

### Système monétaire

**Conversion :**
- 1 Couronne d'or (CO) = 20 Pistoles d'argent (PA)
- 1 PA = 12 Sous de bronze (SB)
- 1 CO = 240 SB

**Stockage :** Trois champs séparés convertis en format unifié

### Disponibilité

| Niveau | Signification |
|--------|---------------|
| Commune | Facile à trouver partout |
| Limitée | Disponible en ville |
| Rare | Difficile à obtenir |
| Exotique | Très rare |
| Unique | Objet unique ou artefact |

### Affichage conditionnel

Le système adapte l'affichage selon le type :

**Armes mêlée :** Affiche allonge (texte), dégâts, qualités. Masque loc, pa, carry, mode, toughness, wounds.

**Armes distance :** Affiche porté (nombre), dégâts, qualités. Masque loc, pa, carry, mode, toughness, wounds.

**Munitions :** Affiche "Comme l'arme", qualités additionnelles.

**Armures :** Affiche emplacements, PA, qualités. Masque damage, reach, carry, mode, toughness, wounds.

**Véhicules :** Affiche "Chargement", mode, endurance, blessures. Masque damage, reach, loc, pa, qualities.

**Objets divers :** Affiche "Contenu". Masque caractéristiques combat/armure/véhicule.

### Parsing qualités

- Texte libre → objets structurés
- Séparation : virgule
- Résolution : références vers table Qualities
- Ordre : conservé
- Paramètres : supportés (ex: "Recharge 1")

## Exemples

**Hallebarde (melee):** prefix "(2M)", Armes d'hast, enc 3, reach "Longue", damage "+BF+4", qualities "Défensive, Taille, Empaleuse", 2 CO, LDB p.294

**Arbalète (ranged):** Arbalète, enc 2, reach 60, damage "+9", qualities "Recharge 1", 5 CO, LDB p.295

**Calotte cuir (armor):** Cuir souple, enc 0, loc "Tête", pa 1, qualities "Partielle", 8 PA, LDB p.300

**Carreau (ammunition):** Arbalète, enc 0, reach "Comme l'arme", qualities "Empaleuse", 5 PA, LDB p.296

**Charrette (vehicle):** enc 10, carry 25, mode "1 A", toughness 25, wounds 10, 20 CO, EDOC p.27

**Baril (trapping):** Sacs et Contenants, enc 6, carry 12, 8 PA, LDB p.301

## Tests de cohérence

**Structure :** Champs obligatoires (index, label, type, enc, availability, book, page) + champs spécifiques type présents.

**Énumérations :** type ∈ {melee, ranged, ammunition, armor, vehicle, trapping}, availability ∈ {Commune, Limitée, Rare, Exotique, Unique}.

**Prix :** gold/silver/bronze ≥ 0, total > 0 si vendable.

**Relations :** Qualities listées existent dans table Qualities, format paramètres "Label (N)" correct.

**Cohérence :** Armes ont damage+qualities, armures loc+pa, véhicules mode+toughness+wounds. Pas de propriétés contradictoires.

**Logique :** enc ≥ 0, carry ≥ 0, pa ≥ 0, reach > 0 pour ranged.

## Validation des données

### Champs obligatoires

| Champ | Contrainte | Message erreur |
|-------|------------|----------------|
| index | Nombre unique ≥ 0 | "Index manquant ou dupliqué" |
| label | Texte non vide | "Nom d'objet requis" |
| type | Énumération valide | "Type invalide : doit être melee/ranged/ammunition/armor/vehicle/trapping" |
| enc | Nombre ≥ 0 | "Encombrement doit être ≥ 0" |
| availability | Énumération valide | "Disponibilité invalide : doit être Commune/Limitée/Rare/Exotique/Unique" |
| book | Texte non vide | "Livre source requis" |
| page | Nombre > 0 | "Page source requise" |

### Contraintes par type

**melee/ranged :** reach obligatoire (texte pour melee, nombre > 0 pour ranged). damage recommandé.

**ammunition :** reach = "Comme l'arme" ou valide pour arme parente.

**armor :** loc et pa obligatoires. loc non vide, pa ≥ 0.

**vehicle :** mode obligatoire (format "N X" où N > 0). carry, toughness, wounds recommandés.

**trapping :** carry optionnel si contenant.

### Règles intégrité

**Prix :** Si un de gold/silver/bronze > 0, au moins un doit être > 0. Pas de prix négatifs.

**SubType :** Si présent, doit correspondre à arborescence Tree connue.

**Qualities :** Format "Label" ou "Label (N)". Chaque qualité doit exister dans table Qualities. Pas de doublons.

**Relations :** book doit exister dans table Books (si table existe).

### Messages erreur métier

- "Prix incohérent : valeurs négatives détectées"
- "Qualité inconnue : {label}"
- "Format qualité invalide : attendu 'Label' ou 'Label (N)'"
- "Arme sans dégâts : damage recommandé pour {type}"
- "Armure sans protection : loc et pa requis"
- "Véhicule sans propulsion : mode requis"
- "Portée invalide : doit être > 0 pour armes à distance"
- "Emplacements armure vides : loc requis"
