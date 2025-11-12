# Workflow: Changement de Carrière

## Vue d'ensemble

Processus complet de changement de carrière pour un personnage existant. Ce workflow documente le coût XP, les règles de conservation des acquis, l'impact sur le système "en carrière" vs "hors carrière", l'historique des carrières, et les stratégies de progression multi-carrières.

**Contexte**: Personnage créé ayant progressé dans sa carrière initiale (niveau 1-4), souhaitant explorer une nouvelle voie professionnelle.

**Objectif métier**: Permettre diversification personnages, renouveler gameplay, optimiser progression XP, refléter évolution narrative.

**Règle fondamentale**: Changement de carrière = nouveau départ niveau 1, mais conservation TOTALE acquis passés.

**Référence**: [progression-careerlevels.md](../../business-rules/progression-careerlevels.md), [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md)

## Coût et contraintes

### Coût XP

**Règle V1** : Coût variable selon situation (100-300 XP).

**Coûts cumulatifs** :
1. **Base : 100 XP** - Coût minimal pour tout changement de carrière
2. **+100 XP** - Si changement de classe (ex: Citadins → Guerriers)
3. **+100 XP** - Si rang actuel non validé (pas tous éléments acquis)

**Exemples** :
- Artisan N2 (validé) → Marchand N1 (même classe Citadins) : **100 XP**
- Artisan N2 (validé) → Soldat N1 (autre classe Guerriers) : **200 XP**
- Artisan N2 (non validé) → Marchand N1 (même classe) : **200 XP**
- Artisan N2 (non validé) → Soldat N1 (autre classe) : **300 XP**

**Validation rang** : Rang validé = tous éléments acquis (characteristics, skills, talents).

**Déduction** : XP Actuelle diminuée, XP Dépensée incrémentée.

**Log** : "2025-03-15: -200 XP (Changement carrière: Artisan N2 → Soldat N1, classe différente)"

### Contraintes et restrictions

**Contraintes système**:
- XP Actuelle ≥ coût (minimum 100 XP, jusqu'à 300 XP selon situation)
- Vérification classe actuelle vs nouvelle (coût +100 XP si différente)
- Vérification validation rang actuel (coût +100 XP si non validé)
- Aucune limite nombre changements (peut changer plusieurs fois si XP suffisantes)
- Aucune restriction carrières accessibles (toutes carrières disponibles selon espèce, sauf Chaos en mode normal)

**Contraintes narratives** (optionnelles, validation MJ):
- Cohérence roleplay: justification narrative changement (ex: Agitateur → Soldat après enrôlement forcé)
- Restriction géographique: certaines carrières nécessitent localisation spécifique (ex: Marin → port, Prêtre → temple)
- Restriction espèce: respect filtres espèce (Nain ne peut pas devenir Sorcier, sauf mode Free)

**Validation**: Interface affiche liste carrières accessibles selon espèce, message si restrictions narratives (configuration MJ).

## Règles de changement

### Démarrage niveau 1 obligatoire

**Règle**: Nouvelle carrière commence TOUJOURS au niveau 1 (Bronze).
- Impossible démarrer niveau 2-4 directement
- Progression normale niveau 1 → 2 → 3 → 4 via acquisition éléments requis

**Justification**: Règles Warhammer (apprentissage progressif), équilibrage (pas de saut niveau), narratif (novice dans nouvelle profession).

**Exception**: Aucune (même si éléments niveau 2+ déjà possédés via ancienne carrière, démarre niveau 1).

**Exemple**: Artisan niveau 4 (Or 1) change pour Marchand → Marchand niveau 1 (Bronze 2), pas Marchand niveau 2/3/4.

### Conservation TOTALE acquis

**Règle fondamentale**: Le personnage conserve TOUS acquis de TOUTES carrières passées.
- Skills: toutes compétences conservées avec toutes avances
- Talents: tous talents conservés avec tous rangs
- Characteristics: toutes avances conservées
- Attributs dérivés: Points de Blessure, Mouvement, Destin, Résolution inchangés
- Équipement: tous trappings conservés
- XP: XP Dépensée et Totale conservées (seule XP Actuelle diminue de 100)

**Jamais de perte**: Aucun acquis n'est jamais perdu lors changement carrière.

**Exemple**: Agitateur niveau 3 avec 25 skills, 12 talents, 5 characteristics avancées → change Artisan → conserve TOUS ces 25 skills, 12 talents, 5 characteristics + acquiert nouveaux éléments Artisan.

### Impact statut social

**Règle**: Status social (Bronze/Argent/Or + niveau) passe au status carrière niveau 1 nouvelle carrière.
- Exemple: Artisan niveau 4 (Or 1) → Marchand niveau 1 (Bronze 2) → Status devient Bronze 2
- Représente perte prestige/reconnaissance lors changement profession
- Progression status via progression niveaux nouvelle carrière

**Exceptions**:
- Certaines carrières démarrent status élevé (ex: Noble niveau 1 = Argent 5)
- Status narratif peut différer status mécanique (ex: ancien héros guerrier devenu Mendiant conserve réputation)

**Impact mécanique**: Status influence interactions sociales, prix services, accès certains lieux (règles roleplay, pas mécanique XP).

### Historique carrières

**Structure historique**:

```json
{
  "careerHistory": [
    {"career": "Agitateur", "level": 3, "xpSpent": 800, "dateStart": "2025-01-10", "dateEnd": "2025-03-15"},
    {"career": "Artisan", "level": 2, "xpSpent": 650, "dateStart": "2025-03-15", "dateEnd": "2025-06-20"},
    {"career": "Marchand", "level": 1, "xpSpent": 100, "dateStart": "2025-06-20", "dateEnd": null}
  ],
  "currentCareer": "Marchand",
  "currentLevel": 1
}
```

**Informations traçées**:
- Carrière: ID et nom carrière
- Niveau: niveau atteint (1-4) avant changement
- XP dépensée: XP investie dans cette carrière (skills/talents/characteristics)
- Dates: début et fin période carrière
- Actuelle: carrière actuelle marquée `dateEnd: null`

**Utilité**:
- Affichage parcours personnage (fiche résumé, export PDF)
- Calcul "en carrière" (union éléments toutes carrières historiques)
- Validation cohérence narrative (éviter changements incohérents)
- Statistiques (XP par carrière, durée par carrière)

**Affichage interface**: Écran "Historique carrières" avec timeline visuelle et statistiques.

## Impact "En Carrière"

### Redéfinition éléments "en carrière"

**Avant changement**: Éléments "en carrière" = union niveaux atteints carrières actuelles/passées.
- Exemple: Agitateur niveau 3 → en carrière = skills/talents/characteristics niveaux 1-3 Agitateur

**Après changement**: Éléments "en carrière" = union niveaux atteints carrières actuelles/passées + niveau 1 nouvelle carrière.
- Exemple: Agitateur niveau 3 → Artisan niveau 1 → en carrière = niveaux 1-3 Agitateur + niveau 1 Artisan

**Conséquence coûts XP**:
- Éléments nouvelle carrière niveau 1: deviennent "en carrière" → coût normal (vs ×2 avant changement)
- Éléments anciennes carrières: restent "en carrière" → coût normal (pas de perte)
- Éléments non listés aucune carrière: restent "hors carrière" → coût ×2

**Exemple détaillé**:

**Avant changement** (Agitateur niveau 3):
- En carrière: 18 skills Agitateur (niveaux 1-3), 12 talents, 5 characteristics
- Skill "Métier (Forgeron)" hors carrière: coût +1 = 10 × 2 = 20 XP

**Après changement** (Agitateur 3 → Artisan 1):
- En carrière: 18 skills Agitateur + 8 skills Artisan niveau 1 = ~22 skills uniques
- Skill "Métier (Forgeron)" EN CARRIÈRE Artisan niveau 1: coût +1 = 10 XP (économie 50%)
- **Bénéfice**: Réduction coûts skills/talents Artisan de ×2 → ×1

### Stratégies optimisation

**Stratégie 1: Changement pour réduction coûts**
- Identifier skills/talents hors carrière souhaités
- Si beaucoup d'éléments hors carrière souhaités listés dans nouvelle carrière → changement rentable
- Calcul seuil rentabilité: si économie coûts ×2 → ×1 > 100 XP changement

**Exemple**:
- Agitateur souhaite acquérir 10 skills Artisan (toutes hors carrière)
- Coût sans changement: 10 skills × 50 XP (0→5 moyen) × 2 = 1000 XP
- Coût avec changement: 100 XP (changement) + 10 skills × 50 XP = 600 XP
- **Économie**: 400 XP → changement rentable

**Stratégie 2: Changement pour renouvellement gameplay**
- Personnage niveau 4 (tous éléments acquis) → progression ralentie
- Changement carrière → nouveaux éléments "en carrière" niveau 1 → renouveau progression

**Stratégie 3: Changement narratif**
- Événement campagne force changement (enrôlement, exil, conversion religieuse)
- Coût 100 XP = contrepartie mécanique changement narratif

## Workflow changement

### Phase 1 - Décision et sélection

**Déclencheur**:
- Joueur: clic bouton "Changer de carrière" écran personnage
- MJ: proposition changement suite événement narratif

**Écran sélection**:
- Liste carrières accessibles (filtrage espèce, région si applicable)
- Pour chaque carrière:
  - Nom et description
  - Status niveau 1
  - Aperçu éléments niveau 1: 3 characteristics, 8-10 skills, 4 talents
  - Indicateur éléments déjà possédés (ex: "5/8 skills déjà acquises")
  - Calcul rentabilité: "Économie estimée: 250 XP" (si beaucoup d'éléments souhaités)
- Tri: alphabétique, rentabilité, affinité narrative

**Aide décision**:
- Calculateur rentabilité: saisir skills/talents souhaités → calcul économie vs coût 100 XP
- Filtre affinités: carrières synergies avec carrière actuelle (skills/talents communs)

### Phase 2 - Confirmation et paiement

**Popup confirmation**:
- "Changer de carrière: [Carrière actuelle] niveau [N] → [Nouvelle carrière] niveau 1?"
- "Coût: 100 XP"
- "Status: [Status actuel] → [Status nouveau]"
- "Vous conserverez tous acquis (skills, talents, characteristics)"
- "Éléments niveau 1 [Nouvelle carrière] deviendront 'en carrière'"
- Boutons: "Confirmer" / "Annuler"

**Validation XP**:
- Si XP Actuelle < 100: message "XP insuffisantes. Nécessaire: 100 XP, Disponibles: [X] XP"
- Bouton "Confirmer" désactivé si XP insuffisantes

**Paiement**:
- XP Actuelle: -100
- XP Dépensée: +100
- Log historique: "2025-06-20: -100 XP (Changement carrière: Artisan niveau 2 → Marchand niveau 1)"

### Phase 3 - Application changement

**Mise à jour carrière**:
- `currentCareer`: [ID nouvelle carrière]
- `currentLevel`: 1 (niveau 1 forcé)
- `currentStatus`: status niveau 1 nouvelle carrière
- `careerHistory[]`: ajout entrée ancienne carrière avec `dateEnd: [date actuelle]`
- `careerHistory[]`: ajout entrée nouvelle carrière avec `dateStart: [date actuelle]`, `dateEnd: null`

**Mise à jour "en carrière"**:
- Recalcul union éléments "en carrière": anciennes carrières + nouvelle carrière niveau 1
- Mise à jour indicateurs coûts XP (interface affiche "En carrière" vs "Hors carrière" pour chaque skill/talent/characteristic)

**Application trappings niveau 1**:
- Ajout automatique trappings classe sociale niveau 1 nouvelle carrière
- Ajout automatique trappings carrière niveau 1 (équipement de départ)
- Conservation trappings anciennes carrières

**Recalculs**:
- Aucun recalcul caractéristiques/dérivées (pas de perte)
- Aucun recalcul skills/talents (conservation intégrale)
- Recalcul encombrement (ajout nouveaux trappings)

### Phase 4 - Notification et confirmation

**Message confirmation**:
- "Changement de carrière effectué!"
- "[Ancienne carrière] niveau [N] → [Nouvelle carrière] niveau 1"
- "Status: [Ancien status] → [Nouveau status]"
- "XP restantes: [X]"
- "Nouveaux éléments 'en carrière': [Liste skills/talents/characteristics niveau 1]"

**Notification éléments déjà possédés**:
- "Vous possédez déjà 5/8 skills niveau 1 [Nouvelle carrière]" (via ancienne carrière ou XP)
- Liste skills déjà possédées avec niveau actuel
- Suggestion: "Progression niveau 2 facilitée: il reste seulement [X] éléments à acquérir"

**Boutons actions**:
- "Voir fiche personnage" → écran personnage mis à jour
- "Dépenser XP" → écran dépense XP avec nouveaux coûts "en carrière"
- "Retour" → menu principal

### Phase 5 - Progression nouvelle carrière

**Objectif immédiat**: Progresser niveau 1 → niveau 2 nouvelle carrière.

**Éléments requis niveau 2**: identiques progression normale (voir [workflow-progression-xp.md](./workflow-progression-xp.md)).
- Acquérir TOUS éléments niveau 2 (characteristics, skills, talents)
- Éléments déjà possédés via ancienne carrière: comptent acquis, pas de coût supplémentaire
- Coût uniquement éléments manquants

**Facilitation**: Grâce acquis ancienne carrière, progression accélérée si synergies.
- Exemple: Agitateur → Marchand (compétences sociales communes) → progression rapide
- Exemple: Guerrier → Sorcier (aucune synergie) → progression normale

## Exemples concrets

### Exemple 1: Agitateur niveau 3 → Artisan niveau 1

**État initial**:
- Carrière: Agitateur niveau 3 (Bronze 3)
- Status: Bronze 3
- Skills: 18 skills Agitateur niveaux 1-3 (Athlétisme, Charme, Commandement, Ragots, Intuition...)
- Talents: 12 talents (Baratiner, Lire/Écriture, Sociable, Orateur, Focalisation (foule)...)
- Characteristics avancées: CT, Int, Soc, Ag, FM (cumul niveaux 1-3)
- XP: Totale 1200, Dépensée 800, Actuelle 400

**Motivation changement**:
- Personnage souhaite acquérir skills artisanales (Métier Forgeron, Évaluation, Marchandage)
- Toutes ces skills hors carrière Agitateur: coût ×2
- Calcul: 3 skills × 50 XP × 2 = 300 XP
- Changement Artisan: 100 XP + 3 skills × 50 XP = 250 XP → économie 50 XP

**Changement**:
1. Clic "Changer de carrière" → sélection "Artisan"
2. Confirmation: "Agitateur niveau 3 (Bronze 3) → Artisan niveau 1 (Bronze 2)? Coût: 100 XP"
3. Validation: -100 XP → XP Actuelle: 300
4. Application:
   - Carrière actuelle: Artisan niveau 1
   - Status: Bronze 2 (vs Bronze 3 avant)
   - Historique: "Agitateur 3 (800 XP), Artisan 1 (0 XP)"
   - Nouveaux "en carrière": skills/talents/characteristics niveau 1 Artisan
   - Conservation: 18 skills, 12 talents, 5 characteristics avancées Agitateur

**Après changement**:
- En carrière: 18 skills Agitateur + 8 skills Artisan niveau 1 = ~22 skills uniques (certaines communes: Calme, Résistance...)
- Métier (Forgeron) maintenant "en carrière": coût +1 = 10 XP (vs 20 XP avant)
- Évaluation maintenant "en carrière": coût +1 = 10 XP (vs 20 XP avant)
- Marchandage maintenant "en carrière": coût +1 = 10 XP (vs 20 XP avant)

**Progression immédiate**:
- Achat Métier (Forgeron) 0 → 5: 50 XP → XP: 250
- Achat Évaluation 0 → 5: 50 XP → XP: 200
- Achat Marchandage 0 → 5: 50 XP → XP: 150
- **Total dépensé**: 100 (changement) + 150 (skills) = 250 XP (vs 400 XP sans changement)

**Objectif long terme**: Progresser Artisan niveau 2 puis niveau 3.

### Exemple 2: Artisan niveau 4 → Marchand niveau 1 (renouvellement)

**État initial**:
- Carrière: Artisan niveau 4 (Or 1)
- Status: Or 1 (prestige élevé)
- Skills: 20 skills Artisan niveaux 1-4 (Métier Forgeron 60, Évaluation 50, Marchandage 55...)
- Talents: 16 talents (Maître artisan rang 3, Méticuleux rang 2, Dealmaker...)
- Characteristics: toutes avancées, Dex 65 (maître craftsman)
- XP: Totale 5000, Dépensée 4500, Actuelle 500

**Motivation changement**:
- Niveau 4 atteint: TOUS éléments Artisan acquis, progression ralentie
- Skills/talents hors carrière coûtent ×2: progression coûteuse
- Changement Marchand: renouvellement gameplay, synergie compétences sociales/commerce

**Changement**:
1. Sélection "Marchand"
2. Confirmation: "Artisan niveau 4 (Or 1) → Marchand niveau 1 (Bronze 2)? Perte status prestige!"
3. Validation: -100 XP → XP Actuelle: 400
4. Application:
   - Carrière: Marchand niveau 1
   - Status: Bronze 2 (perte Or 1 → Bronze 2, impact narratif)
   - Historique: "Artisan 4 (2500 XP), Marchand 1 (0 XP)"
   - Nouveaux "en carrière": skills niveau 1 Marchand

**Synergies détectées**:
- Marchand niveau 1 skills: Charme, Résistance, Intuition, Marchandage, Évaluation, Ragots...
- Déjà possédées via Artisan: Marchandage 55, Évaluation 50, Résistance 45
- **3/8 skills déjà acquises**: progression niveau 2 facilitée

**Progression accélérée**:
- Éléments niveau 2 Marchand requis: 1 characteristic, 6 skills, 4 talents
- Déjà possédés: Marchandage, Évaluation (2/6 skills), Sociabilité (1/1 characteristic)
- Manquants: 4 skills, 4 talents
- Coût: 4 skills × 50 XP + 4 talents × 100 XP = 600 XP
- XP insuffisantes: 400 < 600 → nécessite 1 aventure supplémentaire

**Bénéfice long terme**: Renouvellement gameplay, découverte talents Marchand (négociation, réseaux), diversification personnage.

### Exemple 3: Guerrier niveau 2 → Sorcier niveau 1 (changement radical)

**État initial**:
- Carrière: Soldat niveau 2 (Bronze 3)
- Skills: combat (Corps à corps 50, Projectiles 45, Athlétisme 40...)
- Talents: combat (Maîtrise arme, Robuste, Fureur guerrière...)
- Characteristics: physiques élevées (F 45, E 50, CC 48), mentales basses (Int 28, FM 32)
- XP: Actuelle 150

**Motivation changement**:
- Événement narratif: découverte grimoire magique, révélation don magique latent
- Changement radical Sorcier: aucune synergie skills/talents
- **Risque**: XP 150 - 100 (changement) = 50 restantes → progression difficile

**Problème pré-requis**:
- Talent "Magie des Arcanes" nécessite FM ≥ 35
- FM actuelle: 32 < 35 → pré-requis non rempli
- **Blocage**: Impossible acquérir talent principal Sorcier

**Solutions**:
1. **Améliorer FM avant changement**: FM 32 → 35 (+3 avances)
   - Coût: 3 × 40 = 120 XP (palier 31-35, hors carrière ×2 = 80 XP)
   - XP restantes: 150 - 80 = 70 → puis changement -100 impossible
2. **Attendre accumulation XP**: acquérir ~150 XP supplémentaires (1-2 aventures)
   - Total: 300 XP → améliorer FM (80 XP) → XP: 220 → changer carrière (100 XP) → XP: 120 → progresser Sorcier
3. **Changement différent**: choisir carrière synergies (Érudit, Enquêteur) → accumulation XP → puis Sorcier

**Résolution narrative**: MJ accorde événement magique exceptionnel: +5 FM temporaire (talent unique "Don latent") permettant changement.

**Changement**:
- Coût: 100 XP → XP: 50
- Carrière: Sorcier niveau 1 (Bronze 1)
- Skills Sorcier: Focalisation, Langue Magick, Intuition, Perception... → aucune synergies Soldat
- Talents Sorcier: Magie des Arcanes → coût 100 XP (en carrière maintenant) → XP insuffisantes (50 < 100)

**Résultat**: Changement effectué mais progression bloquée temporairement (XP insuffisantes talents obligatoires). Nécessite 1-2 sessions supplémentaires accumulation XP.

**Leçon**: Changement radical sans synergies = coûteux, planification nécessaire.

## Cas particuliers

### Retour ancienne carrière

**Règle**: Possible revenir ancienne carrière (coût 100 XP comme tout changement).
- Retour au niveau atteint précédemment (conservation progression)
- Exemple: Agitateur 3 → Artisan 2 → retour Agitateur → Agitateur niveau 3 (pas niveau 1)

**Progression après retour**: Peut progresser niveau suivant si éléments acquis.
- Exemple: Agitateur 3 → Artisan 2 (acquiert certains éléments Agitateur niveau 4 via XP) → retour Agitateur 3 → si tous éléments niveau 4 acquis → progression automatique Agitateur niveau 4

**Utilité**:
- Exploration temporaire autre carrière
- Acquisition skills/talents spécifiques puis retour carrière principale
- Optimisation coûts "en carrière"

### Multi-changements rapides

**Règle**: Aucune limite fréquence changements (si XP suffisantes).
- Peut changer 3× en 1 session si 300 XP disponibles
- Chaque changement: coût 100 XP, ajout historique, redéfinition "en carrière"

**Stratégie "tourisme carrières"**:
- Changer carrière pour acquérir éléments niveau 1 "en carrière" (coût normal)
- Puis changer autre carrière pour autres éléments
- Puis revenir carrière principale
- **Coût**: 300 XP (3 changements) + coûts acquisitions éléments
- **Bénéfice**: Réduction coûts ×2 → ×1 si beaucoup d'éléments souhaités

**Validation MJ**: Peut restreindre fréquence changements pour raisons narratives (délai minimum 1 mois in-game, justification roleplay).

### Carrières incompatibles

**Règle**: Certaines carrières mutuellement exclusives (restrictions narratives, pas mécaniques).
- Exemple: Prêtre Sigmar ↔ Prêtre Ulric (cultes rivaux)
- Exemple: Répurgateur ↔ Sorcier (chasseur vs pratiquant magie)
- Exemple: Hors-la-loi ↔ Garde (criminel vs autorité)

**Application**: Configuration MJ, warnings interface si changement incompatible.
- Message: "Attention: Changement [Ancienne] → [Nouvelle] peut avoir conséquences narratives graves (ex: persécution, exil, perte contacts)"
- Validation: MJ peut bloquer ou autoriser selon contexte campagne

**Solution**: Carrière "intermédiaire" (ex: Soldat → Mercenaire → Garde) pour transition progressive.

## Relations avec autres systèmes

### Progression XP

Voir [workflow-progression-xp.md](./workflow-progression-xp.md) pour dépense XP après changement carrière.

**Lien**: Changement carrière modifie coûts "en carrière" vs "hors carrière", impact stratégie dépense XP.

### Accumulation avantages

Voir [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) pour cumul multi-niveaux et multi-carrières.

**Lien**: Changement carrière ajoute nouvelle carrière à historique, cumul éléments "en carrière" s'étend.

### Progression niveaux

Voir [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) pour système 4 niveaux Bronze→Argent→Or.

**Lien**: Après changement carrière, progression normale niveau 1 → 2 → 3 → 4 nouvelle carrière.

## Voir aussi

**Workflows**:
- [workflow-creation-complete.md](./workflow-creation-complete.md) - Création personnage (contexte initial)
- [workflow-progression-xp.md](./workflow-progression-xp.md) - Dépense XP post-création

**Business rules**:
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Système 4 niveaux
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul multi-niveaux
- [calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md) - Formules coûts XP

**Tables database**:
- [database/careers.md](../../database/careers.md) - Table carrières
- [database/careerLevels.md](../../database/careerLevels.md) - Niveaux carrières
