# Progression et Restrictions Carrière

## Objectif

Gère la progression 4 niveaux carrière, restrictions achats XP selon niveau actuel, et mécanisme changement carrière avec impacts coûts.

## Structure 4 Niveaux Carrière

**Niveau 1 Bronze**: Point entrée carrière, 3 caractéristiques +5, 8-10 compétences, 4 talents

**Niveau 2 Silver**: 1 caractéristique +10, 6 compétences, 4 talents

**Niveau 3 Gold**: 1 caractéristique +15, 4 compétences, 4 talents

**Niveau 4 Gold+**: 1 caractéristique +20, 2 compétences, 4 talents

**Total cumulé 4 niveaux**: 6 caractéristiques (+30 avances), 20-22 compétences, 16 talents

## Conditions Passage Niveau Supérieur

**Complétion niveau optionnelle MJ**: Règle stricte acheter tous avantages listés avant passage niveau supérieur (Exemple Pamphlétaire 1→2: Avances caractéristiques +5 Ag/Int/Soc 75 XP minimum, Compétences 8 acquises, Talents 4 acquis 400 XP = Total minimum ~500-700 XP), règle souple passage autorisé sans complétion V1 actuel

**Validation MJ optionnelle**: Complétion partielle au moins 2/3 avantages achetés, justification narrative événement RP mentor temps écoulé, tests compétence prouver maîtrise métier (V1 pas validation passage libre si niveau existe)

**Tests compétences optionnels**: Principe avant passer niveau supérieur personnage doit prouver maîtrise métier en réussissant tests compétences clés (Exemple Pamphlétaire 1→2: Test Charme Difficile convaincre foule, Test Ragot Moyen collecter informations ville, Test Commandement Difficile mener manifestation), règle 2-3 tests selon MJ au moins 1 réussite requise, difficulté ajustée selon niveau cible (1→2 Moyens, 2→3 Difficiles, 3→4 Très difficiles)

**Mentor et formation optionnels**: Besoin mentor (PNJ expert carrière niveau ≥ niveau cible, rôle enseigner nouvelles compétences/valider apprentissage tests/autoriser passage niveau supérieur, coût 1-10 CO par semaine selon niveau), temps formation minimum (1→2: 3-6 mois, 2→3: 6-12 mois, 3→4: 1-2 ans)

**Implémentation V1**: Aucune implémentation technique tests/mentor, gestion entièrement manuelle par MJ discussions hors système, système autorise toujours passage pas blocage technique

## Mécanisme Passage Niveau

**Processus**: Personnage au niveau N avec avantages achetés → Clic interface bouton implicite ou via changement carrière → Validation conditions si règle MJ activée → Mise à jour careerLevel niveau N+1 → Nouveaux avantages disponibles liste niveau N+1

**Conservation acquis**: Toutes avances précédentes caractéristiques/compétences/talents, XP dépensé, Status social niveau N

**Changements**: Niveau actuel N → N+1, liste "dans carrière" ajout nouveaux éléments niveau N+1, Status social Bronze → Silver → Gold, salaire augmente avec status

**Accumulation avantages**: Éléments s'accumulent chaque niveau (Pamphlétaire niveau 2: Dans carrière éléments niveau 1 ET niveau 2, Hors carrière tout le reste)

**Application nouveaux avantages**: Passage niveau N+1 ajoute nouveaux éléments liste "dans carrière" (Nouvelles caractéristiques 1 nouvelle coût normal acheter +10/+15/+20 selon niveau, Nouvelles compétences 6/4/2 nouvelles coût normal acquisition/avances, Nouveaux talents 4 nouveaux coût normal 100 XP), coût futur réduit nouveaux éléments passent hors carrière ×2 à dans carrière ×1

**Exemple économie XP**: Avant passage niveau 1 Éloquence hors carrière acquisition 20 XP, Après passage niveau 2 Éloquence dans carrière acquisition 10 XP (nouveau niveau 2) = Économie 10 XP

**Coût passage**: V1 actuel passage niveau N+1 gratuit aucun coût XP, coût réside dans achat avantages listés si complétion requise, V2 option coût fixe passage (ex: 100 XP) + achat avantages

**Restrictions**: Limite niveau 4 impossible dépasser niveau 4 carrière (Options après niveau 4: Rester niveau 4 continuer acheter avances XP, Changer carrière), impossibilité retour impossible revenir niveau N-1 après passage N

## Restrictions Carrière

**Pendant création wizard**: Restriction stricte seulement 3 caractéristiques niveau 1 carrière, seulement compétences niveau 1 carrière, seulement 4 talents niveau 1 carrière, aucun changement carrière autorisé, aucune progression niveau autorisée bloqué niveau 1

**En post-création advancement**: Libertés avec coût toutes caractéristiques accessibles (coût × 2 si hors carrière actuelle), toutes compétences Basic/Advanced accessibles (coût × 2 si hors carrière), tous talents accessibles (coût × 2 si hors carrière si pré-requis OK), changement carrière autorisé, progression niveau autorisée

**Détermination dans carrière**: Élément (caractéristique, compétence, talent) considéré dans carrière si apparaît niveau carrière actuel

**Cumul niveaux**: Niveau 1 Liste 1, Niveau 2 Liste 1 + Liste 2, Niveau 3 Liste 1 + Liste 2 + Liste 3, Niveau 4 Liste 1 + Liste 2 + Liste 3 + Liste 4

**Exemples restrictions création**: Agitateur niveau 1 autorisé (Acheter +3 Sociabilité dans carrière niveau 1, Acheter Charme +5 dans carrière niveau 1, Acheter talent Affable dans carrière niveau 1), interdit (Acheter +1 Endurance hors carrière niveau 1, Acheter Calme hors carrière niveau 1, Passer niveau 2 création bloquée niveau 1)

**Exemples post-création**: Agitateur niveau 1 autorisé coût normal (Acheter +1 Sociabilité 25 XP, Acheter Charme +1 10 XP acquisition), autorisé coût × 2 (Acheter +1 Endurance 50 XP au lieu 25 XP, Acheter Calme +1 20 XP au lieu 10 XP), autorisé si complétion (Passer niveau 2 si conditions MJ satisfaites)

## Changement Carrière

**Conditions changement recommandations WFRP**: Complétion carrière actuelle atteindre niveau 4 Gold carrière actuelle avant changement, justification narrative raison RP valide événement/opportunité/quête, validation MJ accord MJ requis (Note règles optionnelles gérées par MJ pas implémentation V1)

**V1 actuel**: Aucune restriction technique joueur peut changer carrière à tout moment via bouton "Carrière" mode post-création

**Mécanisme changement**: Clic bouton [Carrière] mode advancement → Affichage interface sélection carrière identique création → Choix nouvelle carrière toutes accessibles si compatibles espèce → Confirmation changement → Mise à jour carrière actuelle careerLevel passe niveau 1 nouvelle carrière (Important changement vers niveau 1 nouvelle carrière pas niveau 4 ancienne)

**Conservation acquis**: Toutes caractéristiques améliorées avances permanentes, toutes compétences acquises/améliorées, tous talents acquis/rangs, tous sorts appris, XP dépensé total xp.used

**Changements**: Carrière actuelle career + careerLevel niveau 1, liste "dans carrière" nouvelles caractéristiques/compétences/talents, coûts futurs recalculés selon nouvelle carrière, status social selon nouvelle carrière niveau 1

**Impact coûts recalcul dans/hors carrière**: Lors changement détermination "dans/hors carrière" change instantanément (Nouvelles caractéristiques "dans carrière" celles listées niveau 1 nouvelle carrière, Nouvelles compétences "dans carrière" celles listées niveau 1 nouvelle carrière, Nouveaux talents "dans carrière" ceux listés niveau 1 nouvelle carrière)

**Exemple impact Pamphlétaire → Soldat**: Charme dans carrière Pamphlétaire → hors carrière Soldat coût ×2, Corps à Corps hors carrière Pamphlétaire coût ×2 → dans carrière Soldat, Achat futur +1 Charme avant Pamphlétaire 10 ou 15 XP selon palier après Soldat 20 ou 30 XP ×2 selon palier, Achat futur +1 CC avant Pamphlétaire 50 ou 60 XP ×2 selon palier après Soldat 25 ou 30 XP normal selon palier

**Nouveaux avantages**: Changement donne accès avantages niveau 1 nouvelle carrière (Nouvelles caractéristiques disponibles 3 nouvelles coût normal, Nouvelles compétences disponibles 8-10 nouvelles coût normal, Nouveaux talents disponibles 4 nouveaux coût normal)

**Progression nouvelle carrière**: Après changement personnage peut progresser normalement nouvelle carrière (Niveau 1 → 2 → 3 → 4, Accumulation avantages nouveaux niveaux, Complétion carrière avant nouveau changement optionnel MJ)

**Coûts XP changement**: V1 actuel aucun coût XP pour changement lui-même gratuit, seuls achats futurs nouvelle carrière coûtent XP normal, recommandation WFRP certains MJ imposent coût XP fixe changer carrière (ex: 100-200 XP) refléter temps apprentissage (V2 option configurable MJ)

**Restrictions espèce**: Certaines carrières réservées certaines espèces (Tueur Trolls → Nains uniquement, Mage Bataille → Hauts Elfes uniquement, Halfling → Carrières Halflings uniquement), validation système filtre carrières incompatibles, changement impossible Humain ne peut PAS devenir Tueur Trolls carrière Nain exclusive

## Status Social et Salaire

**Évolution status**: Niveau 1 Bronze Status Bronze ex B3, Niveau 2 Silver Status Silver ex S2, Niveau 3 Gold Status Gold ex G1, Niveau 4 Gold+ Status Gold supérieur ex G2

**Impact status**: Interactions sociales, revenus, respect NPC

**Salaire évolution**: Bronze 1-5 schillings/semaine, Silver 10-20 schillings/semaine, Gold 1-2 couronnes or/semaine (V1 pas implémentation salaire automatique géré par MJ)

## Relations

**Fichiers liés**: xp-costs.md - Coûts caractéristiques/compétences/talents, xp-validation.md - Validation achats, xp-ui.md - Interface dépense

**Tables database**: audit/database/careerLevels.md - 4 niveaux par carrière ~800 niveaux totaux, audit/database/careers.md - 117 carrières

**Business rules**: business-rules/progression-careerlevels.md - Système progression 4 niveaux, business-rules/accumulation-avantages-careerlevels.md - Accumulation avantages, business-rules/filtrage-careers-espece.md - Compatibilité espèce/carrière

## Limites et Contraintes

**Tests/mentor non implémentés**: Gestion manuelle MJ discussions hors système

**Pas complétion automatique**: Pas vérification achats avant passage niveau

**Pas traçabilité changements**: Pas historique carrières précédentes personnage

**Pas calcul automatique économie XP**: Joueur doit calculer manuellement économie passer niveau avant acheter hors carrière
