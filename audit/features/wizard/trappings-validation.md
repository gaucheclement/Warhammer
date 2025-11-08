# Wizard Trappings - Validation encombrement

## Vue d'ensemble

Validation finale avant passage au step suivant. Vérification que tous choix sont faits et affichage avertissements si encombrement dépasse la limite du personnage.

## Prérequis validation

### Choix obligatoires complets

**Condition :** Tous objets " ou " doivent être résolus

**Vérification :**
```
Pour chaque position dans allTrappingsToChoose[] :
  Si contient " ou " ET character.trappings[position] === null :
    → Validation bloquée
```

**Compteur :** "X Possessions à choisir" affiché dans panneau gauche

**Blocage UI :** Bouton "Valider" désactivé tant que `remaining !== 0`

Voir : [trappings-choice.md](./trappings-choice.md)

### Aucun choix manquant

**Indicateur :** Panneau gauche vide = tous choix faits

**Activation bouton :** `$('.validate').prop('disabled', false)` quand `remaining === 0`

## Validation encombrement

### Calcul limite

**Formule :** Bonus Force × 10

Exemples :
- Force 25 → BF 2 → Limite 20
- Force 35 → BF 3 → Limite 30
- Force 42 → BF 4 → Limite 40

Voir : [calcul-encombrement.md](../../business-rules/calcul-encombrement.md)

### Calcul encombrement total

**Formule :** Σ (quantité × enc) pour tous trappings

Parcours `character.trappings[]` :
1. Résolution objets via `Helper.searchTrapping()`
2. Récupération champ `enc`
3. Multiplication par quantité
4. Sommation totale

Voir : [trappings-encumbrement.md](./trappings-encumbrance.md)

### Seuils pénalités

| Encombrement | État | Pénalités |
|--------------|------|-----------|
| ≤ BF × 10 | Normal | Aucune |
| BF × 10 < enc ≤ BF × 20 | Surchargé | Mouvement réduit, malus Agilité -10, pas de course |
| > BF × 20 | Immobilisé | Déplacement impossible |

## Messages de validation

### Encombrement normal (≤ limite)

**Message :** "Encombrement : X / Y (OK)"
**Couleur :** Vert
**Icône :** ✓
**Action :** Validation autorisée sans avertissement

### Encombrement surchargé (> limite, ≤ 2× limite)

**Message principal :** "Attention : Encombrement dépasse la limite !"

**Détails pénalités :**
- Mouvement réduit de moitié
- Malus -10 aux Tests d'Agilité
- Course impossible
- Fatigue accrue

**Couleur :** Orange/Rouge
**Icône :** ⚠️

**Action :** Validation autorisée AVEC avertissement visible

### Encombrement immobilisant (> 2× limite)

**Message principal :** "CRITIQUE : Encombrement immobilise le personnage !"

**Détails :**
- Déplacement impossible
- Nécessite laisser objets sur place
- Personnage injouable dans cet état

**Couleur :** Rouge vif
**Icône :** ⛔

**Action :** Validation techniquement autorisée mais fortement déconseillée

**Recommandation :** "Retirez des objets lourds avant de continuer"

## Interface avertissements

### Popup confirmation

**Si surchargé :** Popup "Encombrement : 25/20 (125%) - Pénalités : Mouvement réduit, -10 Agilité, pas course. Continuer ? [Retour] [Confirmer]"

**Bannière :** "⚠️ Surchargé : 25/20 | Clic pour détails"

## Suggestions optimisation

**Si surchargé (101-200%) :** Conseils retirer objets lourds, prioriser légers. Bouton "Optimiser équipement"

**Si immobilisé (>200%) :** Message critique, liste objets lourds triée avec suppression rapide, blocage optionnel

## Validation budget (si ajout manuel actif)

### Argent restant ≥ 0

**Condition :** Pas de dette

**Vérification :**
```
Argent initial (classe + carrière) - Achats manuels ≥ 0
```

**Blocage :** Impossible de valider si solde négatif

**Message erreur :** "Fonds insuffisants : retirez des achats ou augmentez budget"

Voir : [trappings-manual.md](./trappings-manual.md)

## Exemples concrets

### Validation réussie (Normal)

**Guerrier Force 35, BF 3, Limite 30**
- Équipement : 9 enc total
- Message : "Encombrement : 9 / 30 (OK)"
- Validation : Immédiate, aucun avertissement

### Validation avec avertissement (Surchargé)

**Guerrier Force 25, BF 2, Limite 20**
- Équipement : 25 enc total
- Message : "Attention : 25 / 20 (125%) - Surchargé !"
- Popup confirmation requise avant validation
- Pénalités listées clairement

### Validation critique (Immobilisé)

**Érudit Force 20, BF 2, Limite 20**
- Équipement : 45 enc total (baril + livres + armure)
- Message : "CRITIQUE : 45 / 20 (225%) - IMMOBILISÉ !"
- Blocage recommandé ou popup très explicite
- Liste objets lourds avec suppression rapide

## Règles métier

### Validation bloquante
Choix "ou" incomplets bloquent validation (obligatoire).

### Validation non-bloquante
Encombrement surchargé N'empêche PAS validation (avertissement seulement).

### Traçabilité
État encombrement stocké avec personnage pour application pénalités en jeu.

### Équilibre
Permet choix joueur (rôleplay surchargé) tout en l'informant clairement des conséquences.

## Relations

**Avec database :**
- [trappings.md](../../database/trappings.md) : Champ `enc`
- [characteristics.md](../../database/characteristics.md) : Force pour calcul limite

**Avec business-rules :**
- [calcul-encombrement.md](../../business-rules/calcul-encombrement.md) : Formules et seuils

**Avec autres features wizard :**
- [trappings-career.md](./trappings-career.md) : Équipement de base
- [trappings-choice.md](./trappings-choice.md) : Vérification choix complets
- [trappings-encumbrement.md](./trappings-encumbrance.md) : Calcul temps réel
- [trappings-manual.md](./trappings-manual.md) : Validation budget achats
