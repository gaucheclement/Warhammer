# Wizard - Sélection carrière

## Vue d'ensemble

L'étape Carrière permet au joueur de choisir une profession parmi celles accessibles à son espèce. Le système filtre automatiquement les carrières selon les restrictions culturelles, applique une pondération aléatoire reflétant la fréquence réaliste des professions, et attribue automatiquement le niveau 1 (Bronze) avec tous ses avantages.

## Sélection carrière

### Filtrage automatique par espèce

Le système utilise `species.refCareer` pour filtrer via `careers.rand` : nombre → ACCESSIBLE, "" ou absent → NON ACCESSIBLE.

**Compatibilité** : Carrières universelles (Artisan toutes espèces), multi-espèces restreintes (Agitateur Humain/Halfling/Nain/Gnome), mono-espèce (Sorcier/Prêtre Sigmar Humain uniquement), interdites (Chaos : `rand` vides).

**Affinités par espèce** : Humains (polyvalents, toutes carrières), Nains (Artisan 8, Guerrier, Ingénieur, interdit Sorcier), Halflings (Artisan 7, Bourgeois 10, Marchand 16, interdit Chevalier), Elfes (Artiste 14, Mage, Éclaireur, interdit Mendiant/Ratier/Égoutier), Gnomes (métiers techniques), Ogres (métiers physiques).

**Mode libre** : `character.isFreeMode()` active toutes carrières sans filtrage ni bonus XP. Permet concepts narratifs (Nain Sorcier, Elfe Mendiant).

### Classes de carrières

**9 classes jouables + 1 non-jouable** : Citadins (Agitateur, Artisan, Bourgeois), Courtisans (Artiste, Avocat, Noble), Guerriers (Soldat, Mercenaire, Chevalier), Itinérants (Charlatan, Colporteur, Messager), Lettrés (Apprenti sorcier, Érudit, Ingénieur), Riverains (Batelier, Contrebandier, Pêcheur), Seafarers (Matelot, Capitaine), Roublards (Criminel, Escroc, Voleur), Ruraux (Chasseur, Éleveur, Paysan), Chaos (non-jouable).

**Structure affichage** : Niveau 1 (Classes en-têtes `listchild1` non sélectionnables), Niveau 2 (Carrières `listchild2` sélectionnables avec seuil "Artisan 2-3"), Niveau 3 (Levels masqués `hide()` en création).

**Construction liste** : Parcours `CharGen.data.career.all` → Vérification `rand[espèce]` numérique → Ajout header classe si nouvelle → Ajout carrière sous classe → Calcul seuils affichés.

**Regroupement dynamique** : Seules classes avec au moins une carrière accessible affichées. Nain : Citadins (Artisan 2-8, Bourgeois 9-14), Guerriers (Soldat 25-30, Tueur de Trolls 95-100), Lettrés (Ingénieur 40-45). Elfe : Guerriers (Éclaireur 10-15), Lettrés (Mage 80-90), Courtisans (Artiste 5-14).

**Calcul seuils** : Format "Label Min-Max" ou "Label Min". Algorithme `previousRand` (seuil précédent + 1), gère carrières même seuil.

## Génération aléatoire

### Pondération

**Seuils cumulatifs** : Valeurs `rand` sont seuils cumulatifs dans tirage 1-100, pas pourcentages indépendants. Mécanisme : tirage 1-100 → parcours carrières → première où `rand[critère] >= tirage` sélectionnée.

**Exemple Humain** : Agitateur (1) 1%, Artisan (3) 2% (tirage 2-3), Bourgeois (6) 3% (tirage 4-6), Sorcier (95) 6% (tirage 95-100). Formule : `(Seuil_actuel - Seuil_précédent) / 100`.

**Rareté** : Communes (1-20 métiers urbains), Moyennes (20-50 professions spécialisées), Rares (90-100 exceptionnelles).

### Système multi-tirages avec bonus XP

**Tirage 1 (+50 XP)** : Clic "Lancer" génère 1 carrière, devient cliquable, autres grisées. Accepter → +50 XP étape suivante. Refuser → clic "Lancer" à nouveau.

**Tirage 2 (+25 XP)** : Génère 2 carrières supplémentaires (total 3 actives). "Lancer" désactivé. Choisir parmi 3 → +25 XP. Refuser → clic "Choisir".

**Tirage 3 (0 XP)** : "Choisir" déverrouille toutes carrières accessibles. Choix libre, aucun bonus.

**Gestion doublons** : `imposedCareers[]` stocke IDs proposées. Re-tirage automatique jusqu'à carrière unique. Cas particulier même seuil : propose première non déjà proposée.

### Influence espèce et région

**Filtrage préalable** : Éliminer `rand[espèce]` vide → Éliminer `rand[région]` vide si applicable → Utiliser seuil plus spécifique (région > espèce) → Tirage sur liste filtrée.

**Seuils multiples** : Soldat `{Humain: 25, Middenheim: 30, Nordland: 28}`. Système utilise seuil régional si présent, sinon espèce.

**Distributions variables** : Nains (Artisan 8, Guerrier 30 forte probabilité artisanale/technique), Elfes (peu carrières → probabilités individuelles élevées), Humains (maximum carrières → distribution étale).

**Animation** : `Helper.dice` seuils jaunes, dés roulent, carrière clignote orange, scroll automatique vers classe générée.

**État randomState.career** : `0` (aucun tirage, "Lancer" actif clignotant), `1` (tirage 1, 1 carrière proposée), `2` (tirage 2, 3 carrières proposées, "Lancer" désactivé), `-1` ("Choisir" cliqué, toutes déverrouillées), `-2` (sélection validée, terminé). Persistance : état restauré si retour arrière.

## Niveau initial

### Niveau 1 (Bronze) obligatoire

**Règle** : Mode création sélectionne TOUJOURS niveau 1. Code `character.setCareerLevel(CharGen.data.careerLevel.allByCareer[el.id][1])`. Paramètre [1] = niveau 1 Bronze, [0] invalide, [2-4] niveaux supérieurs.

**Pourquoi** : Règles Warhammer (débutent Bronze, progressent Argent/Or via XP), équilibrage (personnages comparables), narratif (novices).

**Processus** : Joueur clique carrière → `setCareerLevel(...[1])` → Niveau 1 sélectionné automatiquement → Avantages appliqués. Pas de choix niveau 2-4 en création (masqués).

**Niveaux 2-4** : `listchild3` masqué via `hide()`. Mode avancement (`!characterOnCreation()`), niveaux 2-4 visibles/sélectionnables, progression via dépense XP.

**Relation tables** : `CharGen.data.careerLevel.allByCareer[career.id]` tableau 4 éléments (I-IV). Index [0] invalide, [1] Bronze, [2] Bronze, [3] Argent, [4] Or. Champs `characteristics`, `skills`, `talents`, `trappings` CSV nécessitant parsing/résolution.

## Application avantages niveau 1

### Avantages appliqués

**1. Caractéristiques** : Exactement 3, +5 points chacune. Format CSV "Nom1, Nom2, Nom3". Cumul avec bonus raciaux (Nain Artisan : +5 F espèce + +5 F carrière = +10 F). Exemples : Agitateur N1 (CT, Int, Soc → +5 CT/Int/Soc), Artisan N1 (CC, Ag, F → +5 CC/Ag/F), Soldat N1 (CC, CT, F → +5 CC/CT/F).

**2. Skills** : 8-10 skills. Types : simples, spécialisation fixe, choix "(Au choix)", choix exclusif "ou". Application : +5 avance initiale, cumul si déjà possédée.

**3. Talents** : Exactement 4. Types : fixes, choix exclusif "ou", spécialisation "(Au choix)". Application effets (modificateurs, ajout skills/magie).

**4. Trappings** : Sources doubles (classe sociale + niveau 1). Parsing extraction quantités "(3)", "(1d10)", implicite (1). Calcul encombrement total.

### Ordre d'application

**Phase 1 (Sélection)** : Joueur clique carrière, `setCareerLevel(niveau1)`, objet chargé.

**Phase 2 (Caractéristiques)** : Parsing, résolution noms, ajout +5 à `character.characteristics[nom].advance`.

**Phase 3 (Skills)** : Parsing, résolution + spécialisations, détection choix, ajout +5 avance.

**Phase 4 (Talents)** : Parsing, résolution, détection choix, ajout, application effets (peut modifier caractéristiques/ajouter skills).

**Phase 5 (Trappings)** : Parsing classe + niveau 1, résolution, ajout équipements, calcul encombrement.

**Ordre important** : Talents APRÈS caractéristiques mais AVANT finalisation (certains modifient caractéristiques comme Affable +5 Soc).

**Gestion choix** : Choix exclusifs "ou" (détection → options présentées → joueur choisit UNE → application). Spécialisations "(Au choix)" (détection → liste specs → sélection → application avec spécialisation).

**Validation** : Parsing réussi sans erreur, références valides vers tables existantes, quantités correctes (3 caractéristiques, 8-10 skills, 4 talents), niveau 1 existe (`allByCareer[career.id][1]` non `undefined`). Messages erreur : "Erreur parsing skills : Nom skill 'XXX' introuvable", "Erreur talents : Quantité incorrecte (attendu 4, reçu X)", "Erreur système : Niveau 1 introuvable pour cette carrière."

## Gestion carrières multiples

### Restrictions en création

**Une seule carrière** : Wizard permet UNE carrière uniquement en mode création. Processus : Species → Careers (UNE) → Niveau 1 appliqué → Étapes suivantes → Sauvegarde finale.

**Changement vs Ajout** : Retour arrière permet CHANGER carrière (remplacer), pas ajouter seconde. Code : `character.career = null` puis `setCareerLevel(nouvelle_carrière[1])`.

**État randomState** : Champ career (0 aucune sélection, 1 tirage 1, 2 tirage 2, -1 mode choix manuel, -2 validée). Champ imposedCareers (tableau IDs proposées, persistance conservée retour arrière).

**Différence modes** : Création (1 carrière niveau 1 obligatoire, niveaux 2-4 masqués). Avancement (progresser 1→2→3→4, changer carrière nouvelle niveau 1, conserver historique, niveaux 2-4 visibles).

**Sauvegarde** : `saveAction()` vérifie changement carrière/niveau. Retour `true` (même qu'avant) ou `false` (changement). Attribution XP bonus si `!isFreeMode()` ET `randomState.career > 0` : state 1 → +50 XP, state 2 → +25 XP. Finalisation : bonus XP, `randomState.career = -2`, sauvegarde personnage, passage étape suivante.

**Historique post-création** : `character.careers[]` tableau `{career, level, xpSpent}`. Vide ou contient uniquement carrière actuelle lors création. Règles changement : coût 100 XP, conservation acquis (skills/talents/caractéristiques), nouvelle carrière démarre toujours niveau 1. Exemple : Artisan niveau 4 (800 XP) devient Marchand niveau 1, conserve skills artisanales, débute Marchand novice.

## Affichage et interaction

**État initial** : Toutes carrières désactivées (headers visibles, carrières grisées `disabled`). Seuls boutons "Lancer" (génération aléatoire) et "Choisir" (sélection manuelle) actifs.

**Après génération aléatoire** : Carrières proposées activées uniquement (3 max). Autres restent grisées.

**Après "Choisir"** : Toutes carrières activées (suppression `disabled` sur `listchild2`). Sélection libre parmi compatibles espèce.

**Mode libre (MJ)** : Toutes classes affichées (même Chaos), tous items activés, ignore `rand`, permet Nain Sorcier/Elfe Mendiant, pas de bonus XP.

**Filtrage régional combiné** : Intersection filtres espèce + région. Carrières nécessitent `rand[espèce]` ET `rand[région]` numériques. Certaines classes peuvent disparaître.

**Scroll automatique** : Lors génération, scroll jusqu'à header classe carrière générée via `Helper.scrollToElement($el.prevAll('.listchild1').first())`.

**Validation** : Espèce définie, carrière compatible (`rand[espèce]` numérique), niveau 1 existe. Messages erreur : "Veuillez sélectionner une espèce avant de choisir une carrière."

## Exemples concrets

**Nain standard** : Species "Nain" → Careers affiche `rand.Nain` numérique → Organisation Citadins (Artisan, Bourgeois), Guerriers (Soldat), Lettrés (Ingénieur) → Masque Sorcier (interdit), Agitateur (rare) → "Lancer" génère "Artisan" (seuil 8) → Accepter +50 XP → Application Bronze 2, +5 CC/Ag/F, 8 skills, 4 talents, trappings Citadins + Outils.

**Elfe concept précis** : Species "Haut Elfe" → Careers affiche Elfes → "Choisir" (refuse hasard) → Sélection manuelle "Mage" (Lettrés) → Aucun bonus XP, contrôle total → Application niveau 1 : +5 Int/FM/Soc, skills magiques, talents Magie, équipement Lettrés.

**Halfling flexible** : Species "Halfling" → "Lancer" tirage 15 → "Marchand" (seuil 16) → Refus → "Lancer" 2 nouvelles → "Artisan" (7), "Cuisinier" (12) → Choix "Cuisinier" +25 XP → Application Bronze 2, skills culinaires, talents.

**Nain Middenheim** : Filtrage espèce éliminer `rand.Nain` vide → Filtrage région éliminer `rand.Middenheim` vide → Seuils privilégier `rand.Middenheim`, sinon `rand.Nain` → Tirage Soldat favorisé (seuil 30 vs 25 standard).

**Changement d'avis** : Careers "Artisan" → Validation → Characteristics → Retour arrière → Careers → Changement "Artisan" → "Milicien" → Validation caractéristiques réappliquées pour Milicien → Sauvegarde finale 1 carrière "Milicien niveau 1".

## Voir aussi

- [careers.md](../../database/careers.md) - Table carrières
- [careerLevels.md](../../database/careerLevels.md) - Table niveaux
- [species.md](../../database/species.md) - Table espèces
- [classes.md](../../database/classes.md) - Classes sociales
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Règles filtrage espèce
- [filtrage-careers-region.md](../../business-rules/filtrage-careers-region.md) - Règles filtrage région
- [ponderation-aleatoire-careers.md](../../business-rules/ponderation-aleatoire-careers.md) - Génération aléatoire
- [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md) - Parsing chaînes
- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Effets talents
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul niveaux
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Progression et changements
