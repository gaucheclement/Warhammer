# Wizard - Équipement initial

## Vue d'ensemble

Le step "Possessions" gère l'équipement de départ du personnage : affichage automatique des objets fournis par la classe sociale et la carrière, résolution des choix multiples, calcul d'encombrement temps réel, et validation avant passage au step suivant.

**Sources :** Table Classes (trappings classe) + Table CareerLevels niveau 1 (trappings carrière)
**Règles cumul :** Niveau 1 combine classe + carrière. Niveaux 2-4 ajoutent uniquement leurs propres trappings sans héritage.
**Pas de dédoublonnage :** Si classe et carrière donnent le même objet, le personnage en possède deux.

## Trappings de carrière

### Source des données

**Équipement de classe :** Table Classes, champ `trappings`, hérité au niveau 1 uniquement. Format CSV. Équipement de base commun à toutes les carrières de la classe sociale.

Exemples :
- Citadins : "Chapeau ou Bonnet, Bourse, Vêtements de bonne facture, Cape, 2 CO"
- Guerriers : "Arme de mêlée, Bouclier ou Arme de mêlée, Bourse, Vêtements, Cape, 18 SB"

**Équipement de carrière :** Table CareerLevels (niveau 1), champ `trappings`. Format CSV. Équipement spécifique au métier initial. Parsing via [pattern-parsing.md](../../patterns/pattern-parsing.md).

### Format des entrées

**Objets simples :** Nom direct tel que défini dans table Trappings.
```
Nécessaire d'écriture, Marteau, Clous
```

**Quantités :** Nombre avant le nom.
```
2 CO, 18 SB, 10 Clous
```

**Choix multiples :** Format "Item1 ou Item2", séparateur " ou ".
```
Chapeau ou Bonnet
Bouclier ou Arme de mêlée
```
Le personnage doit choisir une option. Voir section Sélection trappings.

**Choix imbriqués :** Parenthèses pour sous-groupes.
```
Armure légère (Armure de cuir ou Armure de cuir souple avec Gilet de mailles ou Veste de cuir clouté)
```

### Règles de cumul

**Niveau 1 = Classe + Carrière :** L'équipement total combine trappings de classe (hérités une seule fois) + trappings du niveau 1 de carrière. Pas de dédoublonnage automatique. Doublons possibles.

**Niveaux 2-4 :** Ajoutent uniquement leurs propres trappings. Aucun héritage de classe ou niveaux précédents. Voir [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md).

### Résolution des objets

**Matching :** `Helper.searchTrapping(label, CharGen)` recherche par label exact dans table Trappings. Si trouvé : type, enc, prix, desc. Sinon : objet générique sans aide.

**Objets spéciaux :**
- Argent (CO/PA/SB) : Converti en monnaie (1 CO = 20 PA = 240 SB)
- "Vêtements", "Nécessaire de..." : Catégories génériques

### Exemples concrets

**Agitateur :** Classe (Chapeau ou Bonnet, Bourse, Vêtements, Cape, 2 CO) + Carrière (Nécessaire écriture, Marteau, 10 Clous, 10 Tracts) = 9 items (1 choix)
**Soldat :** Classe (Arme mêlée, Bouclier ou Arme mêlée, Bourse, Vêtements, Cape, 18 SB) + Carrière (Armure légère sous-choix, Arme mêlée, Dague) = 9 items (2 choix, doublon possible)
**Érudit :** Classe (Dague ou Gourdin, Bourse, Vêtements, Cape, 2 CO) + Carrière (Grimoire, Nécessaire écriture, Sac) = 8 items (1 choix)

## Trappings d'espèce

Aucun trapping spécifique fourni par l'espèce. Les espèces définissent capacités et caractéristiques mais pas d'équipement initial. L'équipement provient exclusivement de la classe sociale et de la carrière.

## Sélection trappings

### Format parsing

**Opérateur "ou" :** Séparateur " ou ". Split sur " ou " pour tableau d'options. Ex : "Chapeau ou Bonnet" → ["Chapeau", "Bonnet"]
**Choix imbriqués :** Parenthèses pour sous-groupes. Extraction → split " ou " → affichage liste options. Voir [pattern-parsing.md](../../patterns/pattern-parsing.md).

### Interface de sélection

**Panneau gauche :** Titre "X Possessions à choisir", liste cliquable options, icône aide si objet existe. Traitement séquentiel : un choix à la fois, passage automatique au suivant.
**Panneau droit :** Description générale + liste équipement confirmé. Objets automatiques grisés (pas suppression), choix faits normaux (avec suppression).
**Aide contextuelle :** Clic icône → popup `Helper.getHelpFormat(trapp, CharGen)` : nom, type, caractéristiques, description.

### Logique de sélection

**Algorithme itératif :** Pour chaque position dans `character.trappings[]` : si null ET contient " ou " → afficher titre + options + attendre sélection → stocker dans `character.trappings[position]` → appel récursif suivant. Sinon automatique → affecter valeur. Sinon → continuer.
**Stockage :** `character.trappings[index]` = label texte option (string).
**Annulation :** Bouton suppression → `character.trappings[index] = null` → redémarrage `showTrappings(0)` pour correction.

### Validation nombre de choix

**Compteur restants :** Positions avec " ou " ET `character.trappings[index] === null`. Affichage "X Possessions à choisir". Si 0 : panneau vide + bouton "Valider" activé.
**Blocage validation :** `remaining !== 0` → bouton désactivé. Empêche progression si choix incomplets.

## Monnaie initiale

**Source :** Classe + Carrière (montants spécifiés dans trappings)
**Format :** "2 CO", "18 SB", "5 PA" dans listes trappings
**Conversion :** 1 CO = 20 PA = 240 SB
**Cumul :** Argent classe + carrière additionné

**Affichage spécial :** Catégorie dédiée "Argent" ou "Finances". Format : "2 CO + 5 PA + 12 SB = Total 572 SB (équivalence)". Cumul classe + carrière + achats/ventes (si ajout manuel actif).

**Budget ajout manuel :** Argent initial disponible pour achats supplémentaires. Validation stricte : impossible de dépenser plus que l'argent initial. Pas de dette. Remboursement si suppression objet manuel.

## Affichage

### Organisation par catégories

**Groupement automatique :** Basé sur champ `type` dans table Trappings.

| Type | Label affiché | Exemples |
|------|---------------|----------|
| melee | Armes de mêlée | Épée, Hallebarde, Dague |
| ranged | Armes à distance | Arbalète, Arc, Arme à poudre |
| ammunition | Munitions | Carreaux, Flèches, Billes |
| armor | Armures | Armure cuir, Casque, Bouclier |
| vehicle | Véhicules | Charrette, Chariot, Cheval |
| trapping | Objets divers | Sac, Corde, Lanterne, Outils |

Voir [pattern-type-subtype.md](../../patterns/pattern-type-subtype.md).

**Structure hiérarchique :** Catégories avec compteur (ex: Armes mêlée (2)) → liste objets. Ordre : Armes mêlée → Armes distance → Munitions → Armures → Objets divers → Véhicules. Sections repliables (accordéon), par défaut dépliées au wizard.

### Informations par objet

**Format ligne :** Label + Quantité + Enc + Actions (ex: "Corde (10m) [×1] enc:1 [ℹ️][🗑️]"). Icônes : ℹ️ aide (popup), 🗑️ suppression (manuel uniquement). Tooltip survol : prix, enc, type, qualités. Filtres : recherche label, catégories, tri multiples.

## Validation

### Prérequis validation

**Choix obligatoires complets :** Tous objets " ou " résolus. Vérification : pour chaque position dans `allTrappingsToChoose[]`, si contient " ou " ET `character.trappings[position] === null` → validation bloquée. Compteur "X Possessions à choisir" dans panneau gauche. Bouton "Valider" désactivé tant que `remaining !== 0`. Panneau vide = choix faits, bouton activé.

### Validation encombrement

**Calcul limite :** Bonus Force × 10. Exemples : Force 25 → BF 2 → Limite 20 | Force 35 → BF 3 → Limite 30 | Force 42 → BF 4 → Limite 40. Voir [calcul-encombrement.md](../../business-rules/calcul-encombrement.md).

**Calcul encombrement total :** Σ (quantité × enc) pour tous trappings. Parcours `character.trappings[]` : résolution objets via `Helper.searchTrapping()` → récupération champ `enc` → multiplication par quantité → sommation totale.

**Seuils pénalités :**

| Encombrement | État | Pénalités |
|--------------|------|-----------|
| ≤ BF × 10 | Normal | Aucune |
| BF × 10 < enc ≤ BF × 20 | Surchargé | Mouvement réduit, malus Agilité -10, pas de course |
| > BF × 20 | Immobilisé | Déplacement impossible |

### Messages de validation

**Normal (≤ limite) :** "Encombrement : X/Y (OK)" vert ✓, validation sans avertissement.
**Surchargé (> limite, ≤ 2× limite) :** "Attention : Encombrement dépasse limite !" orange/rouge ⚠️. Pénalités : mouvement réduit moitié, -10 Agilité, pas course, fatigue. Popup confirmation requise.
**Immobilisé (> 2× limite) :** "CRITIQUE : Encombrement immobilise personnage !" rouge ⛔. Déplacement impossible. Validation autorisée mais déconseillée. Suggère retrait objets lourds.

### Validation budget

**Argent restant ≥ 0 :** Pas de dette. Vérification : `Argent initial (classe + carrière) - Achats manuels ≥ 0`. Blocage : impossible de valider si solde négatif. Message erreur : "Fonds insuffisants : retirez des achats ou augmentez budget".

## Exemples concrets

**Guerrier (F35, BF3, Limite 30) :** Épée, Dague | Cuir, Casque, Bouclier, Grèves | Sac, Corde, Provisions, Outre. Enc 9/30 (30% vert). Validation immédiate.
**Guerrier surchargé (F25, BF2, Limite 20) :** Hallebarde, Armure complète, Bouclier, Sac, Provisions, Baril, Outils. Enc 25/20 (125% rouge). Popup confirmation.
**Érudit (F30, BF3, Limite 30) :** Dague | Sac, Grimoire, 3 Livres, Nécessaire, Lanterne. Enc 6/30 (20% vert). Validation immédiate.
**Chasseur :** Dague | Arc | Flèches ×20 | Cuir souple | Sac, Corde, Pièges, Provisions, Outre.

## Voir aussi

**Database :**
- [careerLevels.md](../../database/careerLevels.md) : Source trappings carrière
- [classes.md](../../database/classes.md) : Source trappings classe
- [trappings.md](../../database/trappings.md) : Résolution objets, champs enc, type, subType
- [characteristics.md](../../database/characteristics.md) : Force et Bonus Force

**Patterns :**
- [pattern-parsing.md](../../patterns/pattern-parsing.md) : Parsing listes CSV, " ou ", parenthèses
- [pattern-type-subtype.md](../../patterns/pattern-type-subtype.md) : Hiérarchie catégories

**Business-rules :**
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) : Règles cumul niveaux
- [calcul-encombrement.md](../../business-rules/calcul-encombrement.md) : Formules et seuils encombrement
- [prix-disponibilite-trappings.md](../../business-rules/prix-disponibilite-trappings.md) : Système monétaire

**Autres features wizard :**
- [step-possessions.md](./step-possessions.md) : Intégration step
