# Workflow: Progression par Dépense XP

## Vue d'ensemble

Processus complet de dépense d'Points d'Expérience (XP/PX) pour améliorer un personnage existant après création. Ce workflow documente l'acquisition XP, les coûts par type d'amélioration, le système "en carrière" vs "hors carrière", les validations, et les recalculs automatiques.

**Contexte**: Personnage créé et validé, progression entre aventures ou après événements majeurs.

**Objectifs métier**: Permettre l'évolution du personnage selon règles Warhammer (coûts progressifs, spécialisation carrière, multi-carrières).

**Référence**: [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md), [progression-careerlevels.md](../../business-rules/progression-careerlevels.md)

## Sources d'XP

### Acquisition XP

**Sources principales**:
- **Récompense aventure**: 100-200 XP par scénario terminé (selon durée et difficulté)
- **Récompense session**: 10-20 XP par session de jeu (récompense participation)
- **Milestones narratifs**: 50-100 XP événements majeurs (sauver ville, vaincre boss, résoudre intrigue)
- **Roleplay exceptionnel**: 10-50 XP interprétation, décisions marquantes, moments héroïques

**Fréquence typique**:
- Session 4h: +15 XP (session) + 20-40 XP (progression aventure) = 35-55 XP
- Aventure complète (4-6 sessions): 150-250 XP total
- Campagne longue (10 aventures): 1500-2500 XP sur 1-2 ans

**Cumul**:
- XP Totale: somme historique toutes sources (création + acquisitions)
- XP Dépensée: somme coûts améliorations achetées
- XP Actuelle: XP Totale - XP Dépensée (disponible pour dépenses)

**Affichage interface**:
- Écran personnage: "XP: 125 / 850 (Totale 850, Dépensée 725)"
- Écran dépense: "XP Disponibles: 125" (mise à jour temps réel après chaque achat)

**Gestion MJ**:
- Attribution manuelle: champ "+X XP" avec raison (aventure, session, milestone, roleplay)
- Historique: log horodaté avec source et montant (ex: "2025-03-15: +150 XP (Aventure: La Tour du Sorcier)")
- Correction: ajout/retrait XP (positif ou négatif) avec justification

### Historique XP

**Structure log XP**:

```json
{
  "xpLog": [
    {"date": "2025-01-10", "source": "Création personnage", "amount": 90, "total": 90},
    {"date": "2025-01-17", "source": "Session 1", "amount": 15, "total": 105},
    {"date": "2025-01-24", "source": "Session 2", "amount": 15, "total": 120},
    {"date": "2025-01-31", "source": "Milestone: Sauver le village", "amount": 50, "total": 170},
    {"date": "2025-02-07", "source": "Aventure: Les Loups de Middenheim", "amount": 150, "total": 320}
  ]
}
```

**Utilité**: traçabilité acquisitions, validation cohérence totale, audit MJ.

## Système de coûts

### Coûts Skills (Compétences)

**Formule**: Coût par palier de 5 niveaux, progressif selon niveau atteint.

**Table complète des coûts**: Voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

**Rappel**:
- Palier 1-5: 10 XP/niveau
- Palier 6-10: 15 XP/niveau
- Palier 11-15: 20 XP/niveau
- Au-delà de 70: coût reste 380 XP/palier

**Exemples**:
- Améliorer Athlétisme 0 → 5: 5 × 10 = 50 XP
- Améliorer Athlétisme 0 → 10: 50 + (5 × 15) = 125 XP
- Améliorer Athlétisme 15 → 20: 5 × 30 = 150 XP

### Coûts Characteristics (Caractéristiques)

**Formule**: Coût par palier de 5 niveaux, plus cher que skills (caractéristiques = fondamentales).

**Table complète des coûts**: Voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

**Rappel**:
- Palier 1-5: 25 XP/niveau
- Palier 6-10: 30 XP/niveau
- Palier 11-15: 40 XP/niveau
- Au-delà de 70: coût reste 450 XP/palier

**Exemples**:
- Améliorer Force 0 → 5: 5 × 25 = 125 XP
- Améliorer Force 0 → 10: 125 + (5 × 30) = 275 XP
- Améliorer Force 15 → 20: 5 × 50 = 250 XP

**Impact modificateurs**: Si caractéristique modifiée par talent (ex: Costaud +5 E), avances XP ajoutées au total modifié.
- Exemple: Nain E 35 (30 base + 5 Costaud) → achat +1 avance XP → E 36 (30 base + 5 Costaud + 1 XP)

### Coûts Talents

**Formule**: Rang × 100 XP (coût pour acquérir le rang N).

**Table complète des coûts**: Voir [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

**Rappel**:
- Rang 1: 100 XP
- Rang 2: 200 XP
- Rang 3: 300 XP
- Coût cumulé rang 3: 100 + 200 + 300 = 600 XP

**Exception Magie du Chaos**: Coût fixe 100 XP quel que soit le rang (règle spéciale).

**Rangs multiples**:
- Talents max=1: impossible acheter rang 2 (ex: "Baratiner")
- Talents max=nombre fixe: achat jusqu'à max (ex: "Chanceux" max 3)
- Talents max=dynamique: achat jusqu'à Bonus caractéristique (ex: "Artiste" max Bonus Dex)
- Talents max=illimité: achat sans limite (rarissime)

**Spécialisations différentes**:
- "Résistance (Maladie)" rang 1 + "Résistance (Poison)" rang 1 = 2 talents distincts, 200 XP total (100 + 100)
- Total rangs ≤ max global (ex: Résistance max 5 → max 5 rangs toutes spécialisations confondues)

### Exception: Progression de niveau carrière

**Coût progression niveau**: GRATUIT en XP pur, mais nécessite acquisition TOUS éléments du niveau.

**Règle**: Pour progresser niveau N → niveau N+1, le personnage DOIT acquérir:
- Toutes caractéristiques listées au niveau N+1 (au moins +1 avance chacune)
- Toutes skills listées au niveau N+1 (au moins +1 avance chacune)
- Tous talents listés au niveau N+1 (rang 1 minimum)

**Exemple Artisan niveau 1 → niveau 2**:
- Niveau 2 liste: Soc (characteristic), 6 skills, 4 talents
- Coût indirect:
  - Soc +1: 25 XP (si 0 avance actuelle, palier 1-5)
  - 6 skills +1 chacune: 6 × 10 = 60 XP (si 0 avance actuelle, palier 1-5)
  - 4 talents rang 1: 4 × 100 = 400 XP
- **Total minimum**: 485 XP
- Si éléments déjà possédés (ex: via autre carrière), coût réduit

**Déblocage**: Une fois tous éléments acquis, le personnage "progresse" automatiquement niveau N+1.
- Status social change (ex: Bronze 2 → Argent 1)
- Éléments niveau N+1 deviennent "en carrière" (coût normal vs ×2)
- Trappings niveau N+1 acquis automatiquement

**Validation**: Interface vérifie acquisition complète avant autoriser progression.
- Message si incomplet: "Il vous manque X éléments pour progresser au niveau 2: [Liste]"
- Bouton "Progresser" désactivé jusqu'à complétion

## Système "En Carrière" vs "Hors Carrière"

### Définition "En Carrière"

**Règle**: Élément "en carrière" si listé dans niveau actuel OU niveaux passés de carrières actuelles OU passées.

**Accumulation multi-niveaux**: Le personnage cumule les éléments de TOUS les niveaux atteints dans TOUTES les carrières.

**Exemple Artisan niveau 2**:
- En carrière:
  - Characteristics niveau 1 (Dex, F, Soc) + niveau 2 (Soc) = {Dex, F, Soc}
  - Skills niveau 1 (8 skills) + niveau 2 (6 skills) = 14 skills
  - Talents niveau 1 (4 talents) + niveau 2 (4 talents) = 8 talents
- Hors carrière: tous autres éléments non listés niveaux 1-2 Artisan

**Exemple multi-carrières**: Personnage Agitateur niveau 3 → Artisan niveau 2
- En carrière:
  - Skills/Talents/Characteristics Agitateur niveaux 1-3 (18 skills, 12 talents, 5 characteristics)
  - Skills/Talents/Characteristics Artisan niveaux 1-2 (14 skills, 8 talents, 3 characteristics)
  - Union: ~25 skills uniques, ~15 talents uniques, ~6 characteristics uniques
- Hors carrière: tous autres

### Multiplicateur ×2 Hors Carrière

**Règle**: Améliorer élément hors carrière coûte 2× le prix normal.

**Application**:
- Skills: coût palier × 2
- Characteristics: coût palier × 2
- Talents: rang × 100 × 2

**Exemples**:
- Améliorer skill "en carrière" 0 → 5: 5 × 10 = 50 XP
- Améliorer skill "hors carrière" 0 → 5: 5 × (10 × 2) = 100 XP
- Améliorer characteristic "en carrière" 0 → 5: 5 × 25 = 125 XP
- Améliorer characteristic "hors carrière" 0 → 5: 5 × (25 × 2) = 250 XP
- Acquérir talent "en carrière" rang 1: 100 XP
- Acquérir talent "hors carrière" rang 1: 200 XP

**Exception compétences de base**: Compétences type "base" (Athlétisme, Calme, Esquive...) peuvent être améliorées au coût normal même si hors carrière (règle Warhammer: compétences universelles).

**Compétences avancées hors carrière**: Compétences type "avancée" (Guérison, Crochetage, Focalisation...) coûtent ×2 si hors carrière.

### Stratégie de dépense

**Optimisation "en carrière"**:
- Prioriser éléments listés dans carrière actuelle (coût normal)
- Équilibrer progression verticale (améliorer existant) vs horizontale (acquérir nouveaux)

**Exemple Artisan niveau 1** (150 XP disponibles):
- Option A (vertical en carrière): Métier (Forgeron) 0 → 10 (125 XP) + Évaluation 0 → 2 (20 XP) = 145 XP → spécialisation craft
- Option B (horizontal en carrière): Métier (Forgeron) 0 → 5 (50 XP) + Évaluation 0 → 5 (50 XP) + Marchandage 0 → 5 (50 XP) = 150 XP → polyvalence
- Option C (hors carrière): Force 0 → 5 (250 XP hors carrière) = impossible (pas assez XP) → non optimal

**Changement de carrière**:
- Nouvelle carrière démarre niveau 1
- Éléments nouvelle carrière niveau 1 deviennent "en carrière" immédiatement
- Éléments ancienne carrière restent "en carrière" (cumul historique)
- Stratégie: changer carrière si beaucoup d'éléments hors carrière souhaités → réduction coûts

## Workflow de dépense

### Phase 1 - Consultation XP disponibles

**Écran XP**:
- XP Totale: 850 (historique complet)
- XP Dépensée: 725 (somme achats)
- **XP Actuelle: 125** (disponible)
- Historique acquisitions: log détaillé avec dates et sources

**Calculs affichés**:
- Prochain palier skills: "Athlétisme 15 → 16: 30 XP (en carrière)" ou "60 XP (hors carrière)"
- Prochain palier characteristics: "Force 10 → 11: 40 XP (en carrière)" ou "80 XP (hors carrière)"
- Prochain rang talent: "Chanceux rang 2: 200 XP (en carrière)" ou "400 XP (hors carrière)"

**Filtres et tri**:
- Afficher: tous / en carrière / hors carrière
- Tri: alphabétique, coût croissant, valeur actuelle, type

### Phase 2 - Sélection amélioration

**Interface achat skills**:
- Liste compétences avec colonnes: Nom | Valeur actuelle | Coût +1 | En/Hors carrière
- Exemple: "Athlétisme | 35 (+3) | 30 XP | En carrière"
- Bouton "+1" pour acheter 1 avance (clic unique = achat immédiat)
- Bouton "+5" pour acheter 5 avances (si XP suffisantes, confirmation si changement palier)

**Interface achat characteristics**:
- Liste caractéristiques avec colonnes: Nom | Valeur actuelle | Bonus | Coût +1 | En/Hors carrière
- Exemple: "Force | 36 (B3) | 50 XP | En carrière"
- Bouton "+1" pour acheter 1 avance
- Avertissement si passage bonus: "Attention: Force 39→40 augmente Bonus (3→4), impact Points de Blessure"

**Interface achat talents**:
- Liste talents avec colonnes: Nom | Rang actuel | Rang max | Coût rang suivant | En/Hors carrière
- Exemple: "Chanceux | Rang 1 / Max 3 | 200 XP | En carrière"
- Bouton "Acquérir rang 2" pour acheter rang suivant
- Si talent non possédé: bouton "Acquérir rang 1"
- Si spécialisation requise: popup sélection spécialisation avant achat
- Validation pré-requis: talents grisés si pré-requis non remplis (ex: "Magie des Arcanes" nécessite FM ≥ 35)

**Achat nouveau talent**:
- Onglet "Talents disponibles" avec filtres: tous, magie, combat, social, technique
- Recherche par nom ou mots-clés (ex: "résistance" → Résistance Maladie, Résistance Poison...)
- Affichage: Nom, description, pré-requis, effets, coût rang 1, en/hors carrière
- Clic "Acquérir" → validation pré-requis → sélection spécialisation si nécessaire → confirmation → achat

**Achat nouvelle skill avancée**:
- Skills avancées non possédées listées dans "Compétences disponibles"
- Filtrage: hors carrière uniquement (skills base acquises automatiquement)
- Achat: coût initial = coût palier 1-5 (10 XP en carrière, 20 XP hors carrière) pour la "découverte", puis amélioration normale

### Phase 3 - Confirmation et déduction

**Confirmation achat**:
- Popup: "Acheter +1 Athlétisme pour 30 XP? XP restantes après achat: 95"
- Boutons: "Confirmer" / "Annuler"
- Si achat multiple (+5): détail coûts par niveau si changement palier

**Déduction XP**:
- XP Actuelle diminuée instantanément
- XP Dépensée incrémentée
- Log achat ajouté à historique: "2025-03-10: -30 XP (Athlétisme +1, niveau 15→16)"

**Mise à jour affichage**:
- Valeur compétence/caractéristique/talent incrémentée
- Bonus recalculé si applicable (caractéristiques)
- Coût prochain palier mis à jour (si changement palier)

### Phase 4 - Recalculs automatiques

**Recalculs caractéristiques**:
- Si Force modifiée: recalcul Bonus Force → impact dégâts mêlée, encombrement limite
- Si Endurance modifiée: recalcul Bonus Endurance → impact Points de Blessure (formule espèce)
- Si Force Mentale modifiée: recalcul Bonus Force Mentale → impact Points de Blessure, résistances magie/peur
- Si Agilité modifiée: recalcul Bonus Agilité → impact skills liées (Athlétisme, Esquive...)
- Si caractéristique liée à talent dynamique modifiée: recalcul max rangs talent (ex: Artiste max Bonus Dex)

**Recalculs compétences**:
- Si caractéristique liée modifiée: recalcul toutes skills utilisant cette caractéristique
- Exemple: Agilité 30→31 (B3→B3 pas de changement) → Athlétisme valeur inchangée
- Exemple: Agilité 39→40 (B3→B4) → Athlétisme 35→36, Esquive 30→31, Discrétion 25→26

**Recalculs talents effets**:
- Si talent avec effet `addCharacteristic` acquis: application modificateur → recalcul caractéristique totale → recalcul bonus → cascade recalculs dérivées
- Exemple: Achat "Costaud" rang 1 → +5 Endurance → E 35→40 → BE 3→4 → PB recalculé
- Si talent avec effet `addSkill` acquis: ajout compétence avec spécialisation héritage talent
- Exemple: Achat "Artiste (Peinture)" → ajout "Art (Peinture)" dans liste compétences, valeur = Dex + 0 avances
- Si talent avec effet `addMagic` acquis: déblocage sorts domaine
- Exemple: Achat "Magie des Arcanes (Azyr)" → déblocage liste sorts Azyr, acquisition sorts via coûts XP séparés

**Recalculs attributs dérivés**:
- Points de Blessure: recalculé si BF/BE/BFM modifiés
- Mouvement: généralement fixe, sauf talents modificateurs (ex: "Athlète" +1 M)
- Encombrement limite: recalculé si BF modifié (limite = BF × 10)

### Phase 5 - Validation et sauvegarde

**Validation contraintes**:
- XP suffisantes: impossible acheter si XP Actuelle < Coût
- Pré-requis talents: impossible acheter si pré-requis non remplis (caractéristique insuffisante, talent manquant)
- Max rangs: impossible dépasser max talent (unique, fixe, dynamique)
- Niveau max: impossible dépasser 70 avances compétence/caractéristique (limite système)

**Messages erreur**:
- XP insuffisantes: "XP insuffisantes. Coût: 200 XP, Disponibles: 125 XP"
- Pré-requis KO: "Impossible acquérir [Talent]. Nécessite: [Pré-requis]"
- Max atteint: "[Talent] a atteint son rang maximum ([Max])"
- Niveau max: "[Compétence] a atteint le niveau maximum (70)"

**Sauvegarde automatique**:
- Chaque achat déclenche sauvegarde automatique (éviter perte données)
- Historique XP persisté avec log horodaté
- Possibilité annulation dernier achat (undo) si erreur joueur, sous validation MJ

## Exemples concrets

### Exemple 1: Artisan niveau 1 progresse niveau 2

**État initial**:
- Carrière: Artisan niveau 1 (Bronze 2)
- XP: Totale 400, Dépensée 0, Actuelle 400
- Compétences notables: Métier (Forgeron) 45, Évaluation 38, Marchandage 40
- Caractéristiques: Dex 53 (B5), F 36 (B3), E 40 (B4), Soc 33 (B3)
- Talents: Maître artisan (Forgeron), Méticuleux, Résistance (Maladie), Lire/Écriture (rang 2)

**Objectif**: Progresser au niveau 2 (Argent 1)

**Éléments requis niveau 2** (Artisan):
- Characteristics: Sociabilité (déjà en carrière niveau 1)
- Skills: 6 compétences (Calme, Intuition, Commandement, Art (Au choix), Langue (Au choix), Résistance)
- Talents: 4 talents (Athlétique ou Linguiste, Dealmaker, Imperturbable, Savant)

**Planification achats**:
1. **Sociabilité +1**: déjà 33, besoin minimum +1 → Coût: 70 XP (palier 21-25, en carrière) → Nouvelle valeur: 34 (B3)
2. **Skills niveau 2**:
   - Calme +1: déjà possédée espèce 45 → OK (avance ≥1)
   - Intuition +1: non possédée → Coût: 10 XP (palier 1-5, en carrière) → Nouvelle valeur: Int 28 + 1 = 29
   - Commandement +1: non possédée → Coût: 10 XP → Nouvelle valeur: Soc 34 + 1 = 35
   - Art (Au choix) +1: choisir Sculpture → Coût: 10 XP → Nouvelle valeur: Dex 53 + 1 = 54
   - Langue (Au choix) +1: choisir Tiléen → Coût: 10 XP → Nouvelle valeur: Int 28 + 1 = 29
   - Résistance +1: déjà possédée espèce 45 → OK
   - **Total skills**: 50 XP
3. **Talents niveau 2**:
   - Choix "Athlétique ou Linguiste": choisir Linguiste → Coût: 100 XP (rang 1, en carrière)
   - Dealmaker: Coût: 100 XP
   - Imperturbable: Coût: 100 XP
   - Savant: Coût: 100 XP
   - **Total talents**: 400 XP

**Coût total progression**: 70 + 50 + 400 = 520 XP
**XP insuffisantes**: 400 disponibles < 520 requis

**Ajustement**:
- Réduire achats caractéristiques: Sociabilité déjà ≥21, peut attendre
- Stratégie: acquérir d'abord éléments manquants absolument nécessaires

**Achats réalisés**:
1. Intuition +1: -10 XP → XP: 390
2. Commandement +1: -10 XP → XP: 380
3. Art (Sculpture) +1: -10 XP → XP: 370
4. Langue (Tiléen) +1: -10 XP → XP: 360
5. Linguiste rang 1: -100 XP → XP: 260
6. Dealmaker rang 1: -100 XP → XP: 160
7. Imperturbable rang 1: -100 XP → XP: 60
8. Savant rang 1: -100 XP → **XP: -40 (insuffisant!)**

**Résultat**: Impossible progresser niveau 2 avec 400 XP seulement. Besoin minimum 520 XP (ou 470 si Sociabilité omise temporairement, mais non conforme règles strictes).

**Alternative réaliste**: Attendre acquisition 120 XP supplémentaires (1-2 aventures), ou omette certains éléments si MJ flexible.

### Exemple 2: Amélioration skill en carrière

**État initial**:
- Carrière: Agitateur niveau 2
- Compétence: Charme 48 (Soc 35 + 13 avances: 3 espèce + 10 carrière + 0 XP)
- XP Actuelle: 125

**Objectif**: Améliorer Charme 13 → 18 avances (+5 niveaux)

**Calculs coûts**:
- Avance 14 (niveau 14): palier 11-15 = 20 XP
- Avance 15 (niveau 15): palier 11-15 = 20 XP
- Avance 16 (niveau 16): palier 16-20 = 30 XP
- Avance 17 (niveau 17): palier 16-20 = 30 XP
- Avance 18 (niveau 18): palier 16-20 = 30 XP
- **Total**: 20 + 20 + 30 + 30 + 30 = 130 XP

**XP insuffisantes**: 125 < 130

**Ajustement**: Améliorer 13 → 17 avances (+4 niveaux)
- Coût: 20 + 20 + 30 + 30 = 100 XP
- Nouvelle valeur: Charme 52 (Soc 35 + 17 avances) → Bonus +5
- **XP restantes**: 125 - 100 = 25

**Achats réalisés**:
1. Charme +1 (13→14): -20 XP → Charme 49, XP: 105
2. Charme +1 (14→15): -20 XP → Charme 50 (Bonus +5 atteint!), XP: 85
3. Charme +1 (15→16): -30 XP → Charme 51, XP: 55
4. Charme +1 (16→17): -30 XP → Charme 52, XP: 25

**Résultat final**:
- Charme: 52 (+5) (vs 48 +4 initial) → amélioration significative tests sociaux
- XP restantes: 25 (peut acheter skill 0→2 ou économiser)

### Exemple 3: Achat talent hors carrière

**État initial**:
- Carrière: Artisan niveau 2 (pas de talents magie en carrière)
- XP Actuelle: 250
- Caractéristiques: FM 52 (pré-requis "Magie des Arcanes" = FM ≥ 35: OK)

**Objectif**: Acquérir talent "Magie des Arcanes (Azyr)" rang 1 (hors carrière)

**Calculs coûts**:
- Coût base: rang 1 × 100 = 100 XP
- Multiplicateur hors carrière: ×2
- **Coût total**: 100 × 2 = 200 XP

**Validation pré-requis**:
- FM 52 ≥ 35: OK
- Talent incompatible (ex: "Béni" déjà possédé): aucun

**Achat**:
1. Sélection talent "Magie des Arcanes" dans liste disponibles
2. Popup sélection spécialisation: choix "Azyr" (Vent Céleste)
3. Confirmation: "Acquérir Magie des Arcanes (Azyr) rang 1 pour 200 XP (hors carrière)?"
4. Validation: -200 XP → XP: 50

**Effets appliqués automatiquement**:
- Ajout talent: "Magie des Arcanes (Azyr)" rang 1
- Effet `addMagic`: déblocage domaine Azyr → liste sorts Azyr disponibles pour achat
- Effet `addSkill`: ajout "Focalisation (Azyr)" compétence (valeur FM 52 + 0 avances = 52, Bonus +5)
- Recalcul: aucune cascade (pas de modificateur caractéristique)

**Résultat final**:
- Talents: +1 "Magie des Arcanes (Azyr)" rang 1
- Compétences: +1 "Focalisation (Azyr)" 52 (+5)
- Sorts: accès liste sorts Azyr (acquisition individuelle via XP supplémentaires)
- XP restantes: 50
- **Changement gameplay**: personnage peut maintenant lancer sorts domaine Azyr (après achat sorts)

### Exemple 4: Progression multi-carrières

**État initial**:
- Carrière actuelle: Artisan niveau 3 (Argent 3)
- Carrières passées: Agitateur niveau 2 (Bronze 3)
- XP Actuelle: 200

**Objectif**: Changer carrière pour Marchand niveau 1

**Coût changement carrière**: 100 XP (coût fixe)

**Achat**:
1. Écran "Changer de carrière"
2. Sélection nouvelle carrière: Marchand
3. Confirmation: "Changer de carrière pour Marchand niveau 1? Coût: 100 XP. Vous conserverez tous acquis Agitateur + Artisan."
4. Validation: -100 XP → XP: 100

**Conséquences**:
- Carrière actuelle: Marchand niveau 1 (Bronze 2)
- Historique carrières: "Agitateur 2, Artisan 3, Marchand 1"
- Conservation acquis:
  - Skills Agitateur niveaux 1-2: 14 skills
  - Skills Artisan niveaux 1-3: 18 skills
  - Talents Agitateur: 8 talents
  - Talents Artisan: 12 talents
  - Characteristics avances Agitateur + Artisan: 8 characteristics
- **Nouveaux éléments "en carrière"**:
  - Skills Marchand niveau 1: 8-10 skills → coût normal (vs ×2 avant changement)
  - Talents Marchand niveau 1: 4 talents → coût normal
  - Characteristics Marchand niveau 1: 3 characteristics → coût normal
- **Anciens éléments Agitateur/Artisan**: restent "en carrière" (cumul historique)

**Nouvelle répartition "en carrière" vs "hors carrière"**:
- Total "en carrière": Skills Agitateur (14) + Artisan (18) + Marchand (10) = ~30 skills uniques
- "Hors carrière": Skills non listées dans ces 3 carrières → coût ×2

**Stratégie**: Changement pertinent si beaucoup de skills Marchand souhaités (réduction coûts ×2 → coût normal).

## Gestion cas limites

### XP négatives impossibles

**Règle**: XP Actuelle ne peut pas devenir négative.
- Achat désactivé si Coût > XP Actuelle
- Bouton "+1" grisé avec tooltip "XP insuffisantes"

**Exception correction MJ**: Retrait XP possible (ex: correction erreur) avec justification, peut rendre XP Actuelle négative temporairement.
- Avertissement: "Attention: Retrait 50 XP rendra XP Actuelle négative (-25 XP). Nécessaire correction personnage."
- Blocage achats jusqu'à régularisation

### Annulation achat (undo)

**Mécanisme**:
- Bouton "Annuler dernier achat" disponible 5 minutes après achat (ou jusqu'à fermeture écran)
- Restauration état avant achat: XP remboursées, avances/rangs retirés, recalculs annulés
- Historique log annoté: "2025-03-10: -30 XP (Athlétisme +1, niveau 15→16) [ANNULÉ]"

**Limite**: Undo uniquement dernier achat, pas d'historique undo multiple (éviter complexité).

**Validation MJ**: MJ peut forcer annulation achat même après délai (correction erreur joueur).

### Modification coûts (variantes règles)

**Mode "Coûts réduits"** (optionnel, activation MJ):
- Multiplicateur ×1.5 au lieu ×2 hors carrière
- Progression niveau gratuite (pas besoin acquérir tous éléments, juste atteindre seuil XP)

**Mode "Coûts réalistes"** (variante gritty):
- Multiplicateur ×3 hors carrière
- Talents rang 1: 150 XP (au lieu 100)
- Characteristics: coûts +50% tous paliers

**Configuration**: Paramètre système activable par MJ, appliqué rétroactivement à tous calculs.

### Plafonds et limites

**Limites système**:
- Max 70 avances par compétence/caractéristique (limite affichage et règles)
- Max rang talent selon type (unique 1, fixe N, dynamique Bonus, illimité 99)
- Max XP Totale: 99999 (limite affichage, rarement atteint en campagne normale)

**Campagnes longues**: Personnages niveau 50+ avec 5000+ XP peuvent atteindre limites système.
- Exemple: Artisan niveau 4 multi-carrières avec 6000 XP dépensées → skills principales 60+, characteristics 50+

**Gestion fin de carrière**: Au niveau 4 (Or), progression ralentit (tous éléments acquis, peu de nouveautés).
- Solution: changement carrière pour renouveler "en carrière"
- Solution: acquisition talents/skills rares hors carrière (roleplay, diversification)

## Relations avec autres systèmes

### Progression niveaux carrière

Voir [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) pour système 4 niveaux Bronze→Argent→Or.

**Lien**: Dépense XP permet acquérir éléments requis pour progresser niveau suivant.

### Changement carrière

Voir [workflow-changement-carriere.md](./workflow-changement-carriere.md) pour processus complet changement carrière.

**Lien**: Coût 100 XP pour changer carrière, impact "en carrière" vs "hors carrière".

### Accumulation avantages

Voir [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) pour cumul multi-niveaux et multi-carrières.

**Lien**: XP dépensées pour acquérir éléments s'accumulent historiquement (jamais perdues même changement carrière).

## Voir aussi

**Business rules**:
- [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md) - Formules coûts détaillées
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système 4 niveaux
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul multi-niveaux

**Workflows**:
- [workflow-creation-complete.md](./workflow-creation-complete.md) - Création personnage (contexte initial)
- [workflow-changement-carriere.md](./workflow-changement-carriere.md) - Changement carrière post-création

**Tables database**:
- [database/skills.md](../../database/skills.md) - Table compétences
- [database/characteristics.md](../../database/characteristics.md) - Table caractéristiques
- [database/talents.md](../../database/talents.md) - Table talents
- [database/careerLevels.md](../../database/careerLevels.md) - Niveaux carrières
