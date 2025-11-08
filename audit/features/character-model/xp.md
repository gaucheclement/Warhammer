# Character Model - Gestion XP

## Objectif

Documenter la gestion de l'expérience (XP): budget, dépenses, historique, validation avances.

## Contexte Warhammer

L'expérience (XP) permet d'améliorer le personnage après création:
- **Caractéristiques**: +1 pour N XP
- **Compétences**: +1 pour N XP
- **Talents**: +1 rang pour N XP

Coût variable selon:
- **De carrière** (hasOrigin(currentCareer)): Coût simple
- **Hors carrière**: Coût double

## Structure xp

```
{
  max: 0,        // XP total disponible
  log: {},       // Historique {id: montant}
  used: 0,       // XP déjà dépensé (validé)
  tmp_used: 0    // XP temporairement dépensé (non validé)
}
```

**max**: XP total gagné (gains, récompenses)
**log**: Trace de toutes les dépenses (gains positifs, dépenses négatives)
**used**: Total des dépenses validées
**tmp_used**: Dépenses en cours de session (annulables)

## Méthodes principales

### setXPMax(xp)

**Rôle**: Définir le budget XP total du personnage.

**Comportement**: this.xp.max = xp

**Usage**: Appelé lors de la création (XP de départ) ou gains.

### addXP(id, value, uniqueId)

**Rôle**: Ajouter une transaction XP (gain ou dépense).

**Paramètres**:
- id: Description de la transaction
- value: Montant (positif=gain, négatif=dépense)
- uniqueId: true = une seule fois, false = permet doublons

**Comportement**:
1. Si uniqueId ET log[id] existe: retourne false (déjà ajouté)
2. Si value > 0: xp.max += value (gain)
3. Si value < 0: xp.used -= value (dépense, donc used augmente)
4. Ajoute à log avec clé unique si besoin

**Exemples**: addXP('Quête',100,true) → max+=100; addXP('Athlétisme 0→5',-25,false) → used+=25

### spendXP(amount, category)

**Rôle**: Dépenser de l'XP temporairement (avant validation).

**Comportement**: this.xp.tmp_used += amount

**Usage**: Pendant une session d'amélioration, avant saveAdvance().

### getXPAvailable()

**Rôle**: Calculer l'XP disponible restant.

**Formule**: max - used - tmp_used

**Exemples**:
- max=100, used=50, tmp_used=10 → disponible = 40
- max=200, used=200, tmp_used=0 → disponible = 0

## Validation et sauvegarde avances

### saveAdvance()

**Rôle**: Valider les avances temporaires et consommer l'XP définitivement.

**Comportement**:

1. **Parcourt skills, characteristics, talents**:
   Pour chaque élément avec tmpadvance > 0:
   - Calcule coût XP: Helper.getXPCost(elem, from, to) × (de carrière ? 1 : 2)
   - Ajoute transaction: addXP(description, -coût)
   - Transfère: elem.advance += elem.tmpadvance
   - Réinitialise: elem.tmpadvance = 0
   - Décrémente tmp_used

2. **Si tmp_used restant** (dépense non assignée):
   - Ajoute transaction: addXP('Modification', -tmp_used)

3. **Nettoyage**: deleteEmpty()

4. **Sauvegarde**: CharGen.saveCharacter(this)

**Exemple**: Athlétisme tmpadvance=3 (de 5 à 8), coût=30, after saveAdvance() → advance=8, used+=30

## Coût XP

Le coût dépend de:
- **Type** (skill, characteristic, talent)
- **Niveau actuel** (advance)
- **De carrière ou non**

**Formules** (Helper.getXPCost):
- **Caractéristique**: 25 × nombre d'avances
- **Compétence**: 10 × nombre d'avances
- **Talent**: 100 × rang

**Multiplicateur hors carrière**: × 2

**Exemples**: CC 0→5 carrière=125XP, hors=250XP; Athlétisme 5→10=50XP; Résistant rang1=100XP, hors=200XP

## Historique (log)

Le log conserve TOUTES les transactions:

**Format**: {'Quête':100, '0_Athlétisme':-25, '1_CC':-125, '2_Résistant':-100}

**Clés**:
- Gains: id direct
- Dépenses: préfixe index (log.length + '_') + description

**Usage**: Permet d'auditer toutes les dépenses, annuler si erreur.

## Gestion avances temporaires

Les tmpadvance permettent d'"essayer" des améliorations avant validation.

**Workflow**:
1. Utilisateur augmente compétence: tmpadvance += 1, tmp_used += coût
2. Teste le personnage
3. **Valide**: saveAdvance() → advance += tmpadvance, tmpadvance = 0
4. **Annule**: tmpadvance = 0, tmp_used = 0 (XP récupéré)

**Avantage**: Permet de revenir en arrière sans corrompre les données.

## Exemples concrets

**Création 0 XP**: max=0, aucune amélioration possible

**Aventure 100 XP**: max=100, Athlétisme 0→5 coût50, après saveAdvance() → used=50, disponible=50

**Multi-amélio**: max=200, used=50, dispo=150. Si tmp_used=175 > dispo → annuler partiel jusqu'à équilibre

## Validation

Contraintes:
- max >= 0
- used >= 0
- tmp_used >= 0
- used + tmp_used <= max (pas d'XP négatif)
- log cohérent avec used

Voir [validation.md](./validation.md)

## Voir aussi

- [characteristics.md](./characteristics.md) - Avances caractéristiques
- [skills-methods.md](./skills-methods.md) - Avances compétences
- [talents-methods.md](./talents-methods.md) - Rangs talents
- [save-load.md](./save-load.md) - Sauvegarde XP et log
