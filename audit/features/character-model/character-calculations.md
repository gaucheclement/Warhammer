# Character Model - Calculs et attributs dérivés

## Objectif

Documenter les calculs de valeurs finales, attributs dérivés, modifications par talents et gestion XP.

## Calcul valeurs caractéristiques

### getSpecie()

Retourne valeur de base selon espèce.

**Cas normaux** (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc): data.rand[specie.data.refChar]. Exemple Humain CC=30, Nain E=40

**Cas spéciaux**:
- Points de Blessures: Formule selon espèce (Humain/Elfe: BE×2+BFM, Nain: BF+BE×2+BFM, Ogre: ×2 du total)
- Corruption: BE + BFM
- Chance: Égale au total Destin
- Détermination: Égale au total Résilience
- Mouvement: Défini par espèce (Humain=4, Nain=3, Elfe=5, Halfling=3)

### Méthodes de calcul

**getStar()**: Bonus signe astral (+0 à +3), seulement pour type='roll'
**getBase()**: specie + roll + talent + star (ex: 30+8+0+0 = 38)
**getAdvance()**: advance + career + tmpadvance (ex: 5+0+2 = 7)
**getTotal()**: getBase() + getAdvance() (ex: 38+7 = 45)
**getBonus()**: Math.floor(getTotal() / 10) (ex: 45 → 4)

## Calcul valeurs compétences

### getCharacteristic()

Retourne caractéristique liée (Athlétisme → Agilité)

### getBase()

Valeur totale de la caractéristique liée. Si Ag=35, Athlétisme getBase()=35

### getAdvance()

Somme advance + specie + career + tmpadvance. Note: specie et career toujours 0 dans système actuel.

### getTotal() et getBonus()

total = base + advance. bonus = floor(total/10). Exemple Athlétisme Ag=35, advance=10 → total=45, bonus=4

## Calcul valeurs talents

**getBase()**: Toujours 0 (talents sans valeur de base)
**getAdvance()**: advance + roll + tmpadvance
**getTotal()**: Rang total actuel
**getMax()**: Rang maximum autorisé (Résistant max=BE, Tireur précision max=BAg, Maîtrise max=illimité)

## Application effets talents

### applyTalent()

Recalcule et applique effets de tous talents actifs (getTotal() > 0):

1. **Réinitialisation**: Met characteristic.talent = 0 pour toutes
2. **Collecte effets magiques**: Si addMagic existe, ajoute {type, spec}. Cas spécial Béni: ajoute toutes bénédictions du dieu
3. **Application caractéristiques**: Calcule bonus selon type (PB: +BE/rang, M/Chance/Détermination/Corruption: +1/rang, Autres: +5/rang). Exemples: Résistant rang2 → E.talent+10, Robuste rang1 → PB.talent+BE, Véloce → M.talent+1
4. **Collecte compétences**: Si getSkill() retourne compétence, ajoute avec origin='talent'
5. **Nettoyage sorts**: Supprime sorts ne correspondant plus à talent actif (type ET spec doivent matcher)
6. **Nettoyage compétences**: Supprime compétences origin='talent' non correspondantes

**Types effets**:
- addCharacteristic: Modifie caractéristique (Résistant +5E/rang, Robuste +BE PB/rang)
- addSkill: Ajoute compétence (Linguistique → Langue Au choix)
- addMagic: Donne accès magie (Béni → Bénédictions, Magie Arcanes → Sorts domaine)
- addTalent: Donne talent supplémentaire (Savoirs Histoire → Lire/Écrire)

## Attributs dérivés

### Mouvement (M)

Formule base espèce + modificateurs (Véloce +1/rang, armure lourde peut réduire). Exemple Humain base=4, avec Véloce=5.

### Points de Blessures (PB)

Formule selon espèce:
- Humain/Elfe/Halfling: (BE × 2) + BFM
- Nain: BF + (BE × 2) + BFM
- Ogre/Géants: ((BF + (BE × 2) + BFM) × 2

Modificateurs: Robuste +BE/rang, Dur à cuire +BE/rang

Exemple Humain Robuste rang1 (BE=3): Base(3×2)+2=8, Robuste+3, Total=11

### Encombrement

**Limite**: BF + BE (ex: BF=2, BE=3 → limite=5)
**Actuel**: Somme (qty × enc) tous trappings (ex: Épée 1×1 + Armure 1×3 + Rations 7×0.1 = 4.7)
**État**: Si actuel > limite → encombré (malus déplacement/actions)

**calculateEncumbrance()**: Retourne {current, max, encumbered}

## Gestion XP

### Structure

{max: 0, log: {}, used: 0, tmp_used: 0} - Total disponible, historique transactions, validé, temporaire

### Méthodes

**setXPMax(xp)**: Définit budget total
**addXP(id, value, uniqueId)**: Ajoute transaction (positif=gain, négatif=dépense). Si value>0: max+=value, si value<0: used-=value
**spendXP(amount, category)**: Dépense temporaire avant validation (tmp_used+=amount)
**getXPAvailable()**: max - used - tmp_used

### Coût XP

Dépend type, niveau actuel, de carrière ou non:
- Caractéristique: 25 × nombre avances
- Compétence: 10 × nombre avances
- Talent: 100 × rang
- Multiplicateur hors carrière: × 2

Exemples: CC 0→5 carrière=125XP hors=250XP, Athlétisme 5→10=50XP, Résistant rang1=100XP hors=200XP

### saveAdvance()

Valide avances temporaires:
1. Parcourt skills/characteristics/talents avec tmpadvance > 0
2. Calcule coût: Helper.getXPCost(elem, from, to) × (de carrière ? 1 : 2)
3. Ajoute transaction: addXP(description, -coût)
4. Transfère: advance += tmpadvance, tmpadvance = 0
5. Décrémente tmp_used
6. Nettoyage: deleteEmpty()
7. Sauvegarde: CharGen.saveCharacter(this)

### Historique (log)

Format: {'Quête':100, '0_Athlétisme':-25, '1_CC':-125}. Clés gains=id direct, dépenses=index+'_'+description. Permet audit toutes dépenses.

## Avances temporaires

Workflow: Augmente tmpadvance+tmp_used → Teste → Valide saveAdvance() (advance+=tmpadvance, tmpadvance=0) OU Annule (tmpadvance=0, tmp_used=0, XP récupéré)

## Exemples concrets

**CC Humain Soldat**: specie=30, roll=12, star=0, talent=0, advance=5 → base=42, advance=5, total=47, bonus=4, origins=['humain','soldat|1']

**Endurance Nain Résistant×2**: specie=40, roll=10, star=3, talent=10, advance=15 → base=63, advance=15, total=78, bonus=7

**Guerrier Humain Robuste**: BF=3, BE=4, BFM=2, M=4, PB=14 (base10+Robuste4), Enc=6.2/7

**Aventure 100 XP**: max=100, Athlétisme 0→5 coût50 → après saveAdvance() used=50, disponible=50

## Validation

Contraintes: getTotal() >= 0 pour toutes characteristics, advance <= getMax() pour talents, xp.max >= xp.used + xp.tmp_used (pas XP négatif), PB >= 1 minimum absolu

Voir [character-validation.md](./character-validation.md)

## Voir aussi

- [character-structure.md](./character-structure.md) - Structure complète
- [character-talents.md](./character-talents.md) - Talents et effets
- [database/characteristics.md](../database/characteristics.md) - Liste caractéristiques
- [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md) - Modificateurs
