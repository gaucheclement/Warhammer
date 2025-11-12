# Wizard Step Stars - Sélection du signe astrologique

## Vue d'ensemble

Étape optionnelle du wizard de création permettant de sélectionner le signe astrologique du personnage (constellation influençant sa naissance). Cette étape affecte les caractéristiques et peut accorder un talent initial gratuit.

**Contexte**: Système optionnel WFRP (ADE2 p.40-47). Le joueur peut choisir d'ignorer cette étape.

---

## Modes de sélection

### Mode aléatoire

**Principe**: Tirage 1d100 pour sélectionner un signe parmi les 23 disponibles.

**Algorithme**:
1. Générer nombre aléatoire 1-100
2. Trouver premier signe où `signe.rand >= valeur_aléatoire`
3. Si `rand=100` (Étoile du Sorcier), tirer 1d10 supplémentaire pour déterminer variante (subRand)

**Récompense XP**: +25 XP si le joueur accepte le premier tirage aléatoire (sans relancer).

**Variantes Étoile du Sorcier** (4 possibilités):
- Résultat 1-3 (subRand=3): Sixième sens
- Résultat 4-6 (subRand=6): Seconde vue
- Résultat 7-9 (subRand=9): Magie mineure
- Résultat 10 (subRand=10): Sorcier !

**Distribution probabilités**:
- 19 signes normaux: 5% chacun (rand: 5, 10, 15...95)
- 4 variantes Étoile du Sorcier: 1.25% chacune (rand=100, puis subRand)

Voir [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md)

### Mode manuel

**Principe**: Le joueur sélectionne librement un signe dans la liste complète.

**Interface**:
1. Afficher liste des 23 signes astrologiques
2. Afficher pour chaque signe: label + plage de tirage (ex: "Wymund l'Anachorète 1-5")
3. Permettre clic sur un signe pour le sélectionner
4. Afficher description détaillée lors de la sélection

**Pas de bonus XP**: Le mode manuel ne donne pas les 25 XP du mode aléatoire.

**Regroupement**: Les 4 variantes de l'Étoile du Sorcier sont affichées séparément avec leurs sous-plages (1-3, 4-6, 7-9, 10).

### Mode libre (Free Mode)

**Cas particulier**: Si le personnage est en mode libre (édition post-création), les boutons "Lancer" et "Choisir" sont masqués. Le joueur peut sélectionner directement n'importe quel signe sans contrainte.

---

## États de sélection

### star

Champ `star` trackant le statut de sélection:

**Valeurs possibles**:
- `0`: Aucune sélection effectuée (état initial)
- `1`: Tirage aléatoire lancé, résultat proposé
- `-1`: Mode manuel activé (le joueur a cliqué "Choisir")
- `-2`: Sélection validée et sauvegardée

**Flux de sélection**:
1. État initial: `star = 0`
2. Si clic "Lancer": `star = 1` + tirage aléatoire + proposition résultat
3. Si clic "Choisir": `star = -1` + activation sélection manuelle
4. Si validation: `star = -2` + sauvegarde choix + application effets

### Verrouillage interface

**Bouton "Lancer"**:
- Activé si `star = 0` (aucune sélection)
- Désactivé si `star !== 0` (déjà lancé ou mode manuel)
- Masqué en mode libre

**Bouton "Choisir"**:
- Activé si `star = 0` (aucune sélection)
- Désactivé si `star <= -1` (mode manuel déjà activé)
- Masqué en mode libre

**Liste des signes**:
- Éléments désactivés (`disabled`) si `star !== -1` (tant que mode manuel non activé)
- Activée après clic "Choisir" ou en mode libre

---

## Informations affichées

### Affichage liste

Pour chaque signe, afficher:
- **Label**: Nom du signe (ex: "Wymund l'Anachorète")
- **Plage tirage**: Valeurs 1d100 correspondantes (ex: "1-5", "6-10", "96-100")

**Calcul plage**:
- Minimum = `rand` du signe précédent + 1 (ou 1 pour le premier)
- Maximum = `rand` du signe actuel
- Si min = max, afficher uniquement la valeur (ex: "100")

**Signes spéciaux**:
- Étoile du Sorcier (4 variantes): Toutes affichent "100" mais avec labels différents

### Affichage description

Lors de la sélection d'un signe, afficher:

**Informations**: Signe symbolique, nom classique, ascendant, dates calendrier, divinité, apparence constellation, bonus/pénalités (caractéristiques + talent), description personnalité (HTML).

**Parsing caractéristiques**: Parser chaîne `characteristics` (format "+X Nom, -Y Nom"), séparer bonus/malus, afficher séparément.

Voir [pattern-parsing.md](../../patterns/pattern-parsing.md) et [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md)

---

## Exemples concrets

### Wymund l'Anachorète (tirage aléatoire)

Joueur clique "Lancer", obtient 3 → "Wymund l'Anachorète" (rand=5, premier ≥3). XP: +25. Affichage: "Signe de l'Endurance", Wymenos, cœur de l'hiver, Manann, +2 Force/+2 Force Mentale/-3 Initiative.

### Étoile du Sorcier (double tirage)

Joueur clique "Lancer", obtient 100 puis 8 → "Magie mineure" (subRand=9, plage 7-9). XP: +25. Talent: Magie mineure, -3 Force.

### Grande Croix (sélection manuelle)

Joueur clique "Choisir", sélectionne "La Grande Croix" (rand=10). XP: 0. Affichage: "Signe de la Résistance", talent Résistance (Maladie), +2 Endurance.

---

## Relations avec autres tables

### Table Stars

**Source données**: Lecture complète de `data/stars.json` (23 signes). Champs utilisés: index, label, rand, subRand, signe, classique, ascendant, dates, dieux, apparence, characteristics, talent, desc.

Voir [stars.md](../../database/stars.md)

### Table Talents

**Référence**: Champ `star.talent` contient nom exact d'un talent. Lookup par `talent.label`. Talents possibles: Chanceux, Maître artisan (Au choix), Ferveur ardente, Noctambule, Sixième sens, Résistance (Maladie), Affinité avec les animaux, Volonté de fer, Négociateur, Seconde vue, Magie mineure, Sorcier !

Voir [talents.md](../../database/talents.md) et [pattern-relation-textuelle.md](../../patterns/pattern-relation-textuelle.md)

### Table Characteristics

**Référence**: Champ `star.characteristics` contient noms caractéristiques. Parser chaîne "+X Nom, -Y Nom", lookup dans `data/characteristics.json`.

Voir [characteristics.md](../../database/characteristics.md) et [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md)

---

## Règles métier

### Étape optionnelle

**Principe**: Système optionnel WFRP. Interface indique le caractère optionnel. Possibilité de sauter l'étape (bouton "Suivant" sans sélection → `star = null`).

### Bonus XP aléatoire

**Règle**: +25 XP si tirage aléatoire accepté au premier résultat.

**Conditions d'application**:
- Mode création (pas mode libre)
- `star = 1` (tirage effectué)
- Validation sans relancer

**Log XP**: Enregistré comme "Signe astrologique Aléatoire" (+25 XP, gratuit).

### Signe TEST (exclusion)

**Règle**: Signe index=23 (rand=101) jamais sélectionnable. Signe debug avec bonus extrêmes (+100 toutes caractéristiques). Filtrer signes avec `rand <= 100`.

---

## Voir aussi

- [star-effects.md](./star-effects.md) - Application effets du signe
- [stars.md](../../database/stars.md) - Table stars complète
- [talents.md](../../database/talents.md) - Table talents
- [characteristics.md](../../database/characteristics.md) - Table caractéristiques
- [pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md) - Système rand
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing chaînes
- [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md) - Modificateurs
