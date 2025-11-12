# Wizard - Sélection carrière

## Vue d'ensemble

L'étape Carrière permet au joueur de choisir une profession parmi celles accessibles à son espèce. Le système filtre automatiquement les carrières selon les restrictions culturelles, applique une pondération aléatoire reflétant la fréquence réaliste des professions, et attribue automatiquement le niveau 1 (Bronze) avec tous ses avantages.

## Sélection carrière

### Filtrage automatique par espèce

Le système utilise `species.refCareer` pour filtrer via `careers.rand` : nombre → ACCESSIBLE, "" ou absent → NON ACCESSIBLE.

**Compatibilité** : Carrières universelles (Artisan toutes espèces), multi-espèces restreintes (Agitateur Humain/Halfling/Nain/Gnome), mono-espèce (Sorcier/Prêtre Sigmar Humain uniquement), interdites (Chaos : `rand` vides).

**Affinités par espèce** : Humains (polyvalents, toutes carrières), Nains (Artisan 8, Guerrier, Ingénieur, interdit Sorcier), Halflings (Artisan 7, Bourgeois 10, Marchand 16, interdit Chevalier), Elfes (Artiste 14, Mage, Éclaireur, interdit Mendiant/Ratier/Égoutier), Gnomes (métiers techniques), Ogres (métiers physiques).

**Mode libre** : `isFreeMode()` active toutes carrières sans filtrage ni bonus XP. Permet concepts narratifs (Nain Sorcier, Elfe Mendiant).

### Classes de carrières

**9 classes jouables + 1 non-jouable** : Citadins (Agitateur, Artisan, Bourgeois), Courtisans (Artiste, Avocat, Noble), Guerriers (Soldat, Mercenaire, Chevalier), Itinérants (Charlatan, Colporteur, Messager), Lettrés (Apprenti sorcier, Érudit, Ingénieur), Riverains (Batelier, Contrebandier, Pêcheur), Seafarers (Matelot, Capitaine), Roublards (Criminel, Escroc, Voleur), Ruraux (Chasseur, Éleveur, Paysan), Chaos (non-jouable).

**Structure affichage** : Niveau 1 (Classes en-têtes `listchild1` non sélectionnables), Niveau 2 (Carrières `listchild2` sélectionnables avec seuil "Artisan 2-3"), Niveau 3 (Levels masqués `hide()` en création).

**Construction liste** : Parcours `data.career.all` → Vérification `rand[espèce]` numérique → Ajout header classe si nouvelle → Ajout carrière sous classe → Calcul seuils affichés.

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

**Gestion doublons** : `carrières proposées` stocke IDs proposées. Re-tirage automatique jusqu'à carrière unique. Cas particulier même seuil : propose première non déjà proposée.

### Influence espèce et région

**Filtrage préalable** : Éliminer `rand[espèce]` vide → Éliminer `rand[région]` vide si applicable → Utiliser seuil plus spécifique (région > espèce) → Tirage sur liste filtrée.

**Seuils multiples** : Soldat `{Humain: 25, Middenheim: 30, Nordland: 28}`. Système utilise seuil régional si présent, sinon espèce.

**Distributions variables** : Nains (Artisan 8, Guerrier 30 forte probabilité artisanale/technique), Elfes (peu carrières → probabilités individuelles élevées), Humains (maximum carrières → distribution étale).

**Animation** : Seuils jaunes, dés roulent, carrière clignote orange, scroll automatique vers classe générée.

**États tirage** : Aucun tirage (bouton "Lancer" actif), tirage 1 (1 carrière proposée), tirage 2 (3 carrières proposées, bouton désactivé), manuel (toutes carrières déverrouillées), validé (sélection terminée). Persistance : état restauré si retour arrière.

## Niveau initial

### Niveau 1 (Bronze) obligatoire

**Règle** : Mode création sélectionne TOUJOURS niveau 1.

**Pourquoi** : Règles Warhammer (débutent Bronze, progressent Argent/Or via XP), équilibrage (personnages comparables), narratif (novices).

**Processus** : Joueur clique carrière → Niveau 1 sélectionné automatiquement → Avantages appliqués. Pas de choix niveau 2-4 en création (masqués).

**Niveaux 2-4** : Masqués en création. Mode avancement, niveaux 2-4 visibles/sélectionnables, progression via dépense XP.

**Structure niveaux** : Chaque carrière possède 4 niveaux. Statuts sociaux variables selon carrière (ex: Artisan niveau 1=Bronze 2, niveau 2=Argent 1, niveau 4=Or 1; Agitateur niveau 1=Bronze 1, niveau 2=Bronze 2).

## Application avantages niveau 1

### Avantages appliqués

**1. Caractéristiques** : Liste 3 caractéristiques carrière niveau 1. Distribution 5 points à l'étape Characteristics. Exemples : Agitateur N1 (CT, Int, Soc), Artisan N1 (Dex, F, Soc), Soldat N1 (CC, CT, F).

**2. Skills** : Liste 8-10 skills carrière niveau 1. Format parsing voir [pattern-parsing.md](../../patterns/pattern-parsing.md), spécialisations voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md). Répartition avances à l'étape Skills.

**3. Talents** : Liste 4 talents carrière niveau 1. Format parsing voir [pattern-parsing.md](../../patterns/pattern-parsing.md). Sélection et application effets à l'étape Talents.

**4. Trappings** : Sources doubles (classe sociale + niveau 1). Format parsing voir [pattern-parsing.md](../../patterns/pattern-parsing.md). Calcul encombrement voir [calcul-encombrement.md](../../business-rules/calcul-encombrement.md).

### Ordre d'application

**Phase 1 (Sélection)** : Joueur clique carrière, niveau 1 chargé.

**Phase 2 (Caractéristiques)** : Résolution noms, liste 3 caractéristiques disponibles pour distribution 5 points.

**Phase 3 (Skills)** : Parsing format voir [pattern-parsing.md](../../patterns/pattern-parsing.md), liste skills disponibles pour répartition avances.

**Phase 4 (Talents)** : Parsing format voir [pattern-parsing.md](../../patterns/pattern-parsing.md), application effets voir [talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md).

**Phase 5 (Trappings)** : Parsing format voir [pattern-parsing.md](../../patterns/pattern-parsing.md), calcul encombrement voir [calcul-encombrement.md](../../business-rules/calcul-encombrement.md).

**Ordre important** : Talents APRÈS caractéristiques mais AVANT finalisation (certains modifient caractéristiques comme Affable +5 Soc).

**Validation** : Références valides vers tables existantes, listes cohérentes (3 caractéristiques listées, 8-10 skills listés, 4 talents listés), niveau 1 existe.

## Gestion carrières multiples

### Restrictions en création

**Une seule carrière** : Wizard permet UNE carrière uniquement en mode création. Processus : Species → Careers (UNE) → Niveau 1 appliqué → Étapes suivantes → Sauvegarde finale.

**Changement vs Ajout** : Retour arrière permet CHANGER carrière (remplacer), pas ajouter seconde.

**État sélection** : Aucune sélection, tirage 1, tirage 2, mode choix manuel, validée. Liste carrières proposées conservée si retour arrière.

**Différence modes** : Création (1 carrière niveau 1 obligatoire, niveaux 2-4 masqués). Avancement (progresser 1→2→3→4, changer carrière nouvelle niveau 1, conserver historique, niveaux 2-4 visibles).

**Sauvegarde** : Vérification changement carrière/niveau. Attribution XP bonus si mode guidé ET tirage aléatoire : tirage 1 → +50 XP, tirage 2 → +25 XP. Finalisation : bonus XP appliqué, état validé, sauvegarde personnage, passage étape suivante.

**Historique post-création** : Historique carrières vide ou contient uniquement carrière actuelle lors création. Règles changement : coût 100 XP, conservation acquis (skills/talents/caractéristiques), nouvelle carrière démarre toujours niveau 1. Exemple : Artisan niveau 4 (800 XP) devient Marchand niveau 1, conserve skills artisanales, débute Marchand novice.

## Affichage et interaction

**État initial** : Toutes carrières désactivées (headers visibles, carrières grisées `disabled`). Seuls boutons "Lancer" (génération aléatoire) et "Choisir" (sélection manuelle) actifs.

**Après génération aléatoire** : Carrières proposées activées uniquement (3 max). Autres restent grisées.

**Après "Choisir"** : Toutes carrières activées (suppression `disabled` sur `listchild2`). Sélection libre parmi compatibles espèce.

**Mode libre (MJ)** : Toutes classes affichées (même Chaos), tous items activés, ignore `rand`, permet Nain Sorcier/Elfe Mendiant, pas de bonus XP.

**Filtrage régional combiné** : Intersection filtres espèce + région. Carrières nécessitent `rand[espèce]` ET `rand[région]` numériques. Certaines classes peuvent disparaître.

**Scroll automatique** : Lors génération, scroll jusqu'à header classe carrière générée via `scrollToElement($el.prevAll('.listchild1').first())`.

**Validation** : Espèce définie, carrière compatible (`rand[espèce]` numérique), niveau 1 existe. Messages erreur : "Veuillez sélectionner une espèce avant de choisir une carrière."

## Exemples concrets

Voir [exemples-personnages-types.md](../exemples-personnages-types.md) pour archétypes complets.

**Focus sélection carrière :**

**Nain standard (Artisan) :** Species Nain sélectionnée → Careers affiche Citadins (Artisan seuil 8, Bourgeois), Guerriers (Soldat), Lettrés (Ingénieur) → Masque Sorcier (interdit) → "Lancer" génère "Artisan" → Accepter +50 XP → Application Bronze 1 : +5 Dex/F/Soc, 8 skills (Métier Forgeron, Évaluation, Marchandage, etc.), 4 talents (Ambidextre ou Maître artisan, Méticuleux, etc.).

**Elfe concept précis (Mage) :** Species Haut Elfe → "Choisir" (refuse hasard) → Sélection manuelle "Apprenti Sorcier" → Aucun bonus XP → Application niveau 1 : +5 Int/FM/Soc, skills magiques (Focalisation Azyr, Intuition, Langue Magick), talents Magie des Arcanes (Azyr).

**Halfling flexible (Bourgeois) :** Species Halfling → "Lancer" tirage 15 → "Marchand" proposé → Refus → "Lancer" 2 nouvelles → "Artisan", "Bourgeois" ajoutés (3 au total) → Choix "Bourgeois" +25 XP → Application skills sociales (Charme, Commandement, Ragots) et talents Étiquette.

**Changement d'avis :** Careers "Artisan" validé → Characteristics → Retour arrière → Careers → Changement "Artisan" → "Milicien" → Validation → Caractéristiques réappliquées pour Milicien.

## Voir aussi

- [careers.md](../../database/careers.md) - Table carrières
- [careerLevels.md](../../database/careerLevels.md) - Table niveaux
- [species.md](../../database/species.md) - Table espèces
- [classes.md](../../database/classes.md) - Classes sociales
- [filtrage-careers-espece.md](../../business-rules/filtrage-careers-espece.md) - Règles filtrage espèce
- [filtrage-careers-region.md](../../business-rules/filtrage-careers-region.md) - Règles filtrage région
- [ponderation-aleatoire-careers.md](../../business-rules/ponderation-aleatoire-careers.md) - Génération aléatoire
- [parsing-wizard-data.md](../../business-rules/parsing-wizard-data.md) - Parsing chaînes
- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Effets talents
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul niveaux
- [progression-careerlevels.md](../../business-rules/progression-careerlevels.md) - Progression et changements
