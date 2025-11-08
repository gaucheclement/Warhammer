# Etats - Table de données

## Vue d'ensemble

La table Etats stocke les états et conditions temporaires affectant personnages et créatures pendant le combat. Chaque état représente une condition négative avec effets mécaniques spécifiques et règles de récupération.

**Objectif métier** : Gérer les conditions temporaires de combat (blessures, désorientation, peur) avec effets sur tests, mouvement, actions et gestion de Points de Blessure.

**Fichier** : `data/etats.json` (12 états, 7.8 KB)

## Structure des données

### Champs d'identification
- **index** : Numéro unique d'identification (0-11)
- **label** : Nom de l'état (ex: "Assourdi", "À Terre", "Brisé")
- **book** : Livre source (tous "LDB" - Livre de Base)
- **page** : Page dans le livre source (167-169)

### Données descriptives
- **desc** : Description complète en HTML avec effets mécaniques, pénalités, conditions de récupération et règles spéciales

## États disponibles

### États sensoriels (affectent perception)
**Assourdi** : Perte audition, -10 tests audition, +10 bonus ennemis flanc/arrière. Retiré fin de chaque Round après premier.

**Aveuglé** : Vision altérée, -10 tests vue, +10 bonus ennemis combat. Retiré fin de chaque Round dès prochain.

### États physiques (affectent mouvement/position)
**À Terre** : Au sol, Mouvement réduit moitié ou seulement ramper, -20 tests déplacement, +20 bonus ennemis. Non cumulatif. Retiré en se relevant.

**Empêtré** : Mouvement restreint par cordes/toile/empoignade, aucun Mouvement, -10 tests déplacement. Test Force opposé contre source pour retirer.

**En flammes** : Feu sur personnage, 1d10+nombre d'états Blessures fin Round (min 1 après E et PA). Test Athlétisme retire états (DR = états supplémentaires).

**Hémorragique** : Saignement abondant, -1 Blessure fin Round, -10 tests résistance infections. Si 0 Blessure = inconscient + 10% mort par état. Test Guérison ou sorts retirent états.

### États mentaux (affectent psychologie)
**Brisé** : Terreur/panique, doit fuir/se cacher, -10 tests sauf course/dissimulation. Test Calme fin Round si non Engagé (difficulté variable). Caché 1 Round entier retire 1 état. Récupération totale ajoute 1 Exténué.

**Surpris** : Pris au dépourvu, aucun Mouvement/Action, aucune défense, +20 bonus ennemis. Non cumulatif. Retiré fin Round ou après première attaque subie.

### États combat (affectent capacités)
**Sonné** : Coup tête/désorientation, aucune Action, Mouvement moitié, -10 tests, +1 Avantage ennemis, défense sauf Langue (Magick). Test Résistance fin Round retire états. Récupération totale ajoute 1 Exténué si aucun.

**Inconscient** : KO/incapable, aucune action/conscience. Ennemi obtient Je ne faillirai pas ou tue auto (combat) ou succès auto (distance). Non cumulatif. Récupération ajoute À Terre + Exténué.

### États toxiques (affectent santé)
**Empoisonné** : Venin injecté, -1 Blessure fin Round, -10 tests. Si 0 Blessure = empêche soins tant qu'états présents. Test Résistance/Guérison fin Round retire états. Récupération totale ajoute 1 Exténué.

### États généraux (fatigue)
**Exténué** : Épuisement/stress, -10 tous tests. Retiré par repos, sorts divins ou modifications (ex: réduire encombrement).

## Format des descriptions

### Structure HTML standardisée
Descriptions suivent patron structuré :
- **Paragraphe 1** : Cause et nature de l'état
- **Effets mécaniques** : Modificateurs tests, mouvement, actions, combat (balises `<br><br>` séparent blocs)
- **Conditions récupération** : Tests requis, difficultés, coûts, délais
- **Règles spéciales** : Cumul, seuils critiques, états consécutifs

### Mots-clés récurrents
**Pénalités** : "-10 à tous Tests", "-20 Tests", "+10 bonus ennemis", "+20 bonus ennemis"
**Récupération** : "fin de chaque Round", "Test de Calme", "Test de Résistance", "Test de Guérison", "DR retire état supplémentaire"
**Non-cumul** : "ne se cumule pas", "soit vous êtes X, soit vous ne l'êtes pas"
**États consécutifs** : "gagnez 1 État Exténué", "gagnez l'État À Terre et l'État Exténué"

## Règles de cumul

### États cumulatifs (peuvent avoir plusieurs instances)
**Assourdi** : Cumule, chaque état ajoute pénalités
**Aveuglé** : Cumule, retiré fin Round à partir prochain
**Brisé** : Cumule, nécessite Test Calme par état ou passage temps caché
**Empêtré** : Cumule, Test Force opposé retire 1 + DR états
**En flammes** : Cumule, chaque état ajoute +1 dégâts feu (1d10+états-1)
**Hémorragique** : Cumule, chaque état ajoute 10% mort si 0 Blessure
**Empoisonné** : Cumule, chaque état nécessite test séparé pour retirer
**Sonné** : Cumule, Test Résistance fin Round retire 1 + DR états
**Exténué** : Cumule, -10 par état

### États non-cumulatifs (booléens)
**À Terre** : Soit au sol, soit debout (pas de degrés)
**Inconscient** : Soit conscient, soit inconscient
**Surpris** : Soit surpris, soit pas surpris (même si surpris plusieurs fois dans Round)

## Relations avec autres tables

### 1. Relation avec Traits (infligent états)
**Constricteur** : Inflige État Empêtré
**Toile** : Inflige État Empêtré avec Force
**Venin** : Inflige État Empoisonné
**Souffle (Feu)** : Inflige État En flammes

**Voir** : [traits.md] pour traits créatures

### 2. Relation avec Caractéristiques (tests récupération)
**Endurance (E)** : Calcul Bonus E pour réduction dégâts feu/poison, délai mort Empoisonné
**Force Mentale (FM)** : Test Calme (basé FM) pour retirer Brisé
**Agilité (Ag)** : Test Athlétisme (basé Ag) pour retirer En flammes
**Force (F)** : Test Force opposé pour retirer Empêtré
**Résistance** : Test Résistance pour retirer Empoisonné/Sonné

**Voir** : [characteristics.md] pour caractéristiques et tests

### 3. Relation avec Skills (tests récupération)
**Calme** : Retirer Brisé (Test Calme variable selon contexte)
**Athlétisme** : Retirer En flammes (Test Athlétisme ajusté terrain)
**Guérison** : Retirer Hémorragique/Empoisonné (Test Guérison retire 1 + DR états)

**Voir** : [skills.md] pour compétences

### 4. Relation avec Spells (peuvent causer/soigner états)
Sorts divins et arcanes peuvent infliger ou retirer états. Exemple : sorts guérison retirent Hémorragique/Empoisonné.

**Voir** : [spells.md] pour sorts

### 5. Relation avec Points de Blessure (système combat)
**Hémorragique** : Perte 1 Blessure/Round, bloque soins si 0 Blessure
**Empoisonné** : Perte 1 Blessure/Round, bloque soins si 0 Blessure, mort si Inconscient après Bonus E Rounds
**En flammes** : Perte 1d10+états-1 Blessures/Round (après E et PA)
**Inconscient** : Déclenché si 0 Blessure ou traumatisme

## Cas d'usage métier

### Application états combat
**Contexte** : Résolution actions combat (attaques, sorts, traits)
**Déclencheurs** : Dégâts critiques, attaques spéciales, sorts, échecs tests
**Processus** : Ajouter états au personnage, appliquer effets immédiats (pénalités), déclencher récupération fin Round

### Gestion récupération
**Contexte** : Fin de chaque Round combat
**Processus** :
1. Tests automatiques (états retirent seuls : Assourdi, Aveuglé, Surpris)
2. Tests volontaires (Calme, Résistance, Guérison si possible)
3. Dégâts périodiques (Hémorragique, Empoisonné, En flammes)
4. États consécutifs (Exténué après récupération complète)

### États transitoires
**Brisé → Exténué** : Récupération complète ajoute 1 Exténué
**Empoisonné → Exténué** : Récupération complète ajoute 1 Exténué
**Sonné → Exténué** : Récupération complète ajoute 1 Exténué (si aucun)
**Hémorragique → Exténué** : Récupération complète ajoute 1 Exténué
**Inconscient → À Terre + Exténué** : Récupération ajoute les deux

## Tests de cohérence

### Intégrité référentielle
**Test 1** : Tous book référencent "LDB"
**Test 2** : Toutes pages entre 167-169
**Test 3** : Tous index 0-11 uniques
**Test 4** : Tous labels uniques

### Validations structure description
**Test 5** : desc contient balises HTML bien formées
**Test 6** : desc mentionne effets mécaniques (modificateurs chiffrés)
**Test 7** : desc mentionne conditions récupération ou "ne se cumule pas" si non-cumulatif
**Test 8** : Références pages internes valides (ex: "page 159", "page 172", "page 163")

### Cohérence cumul
**Test 9** : États marqués non-cumulatifs dans desc ont mention explicite
**Test 10** : États cumulatifs mentionnent récupération par état ou DR

### Cohérence métier
**Test 11** : Inconscient mentionne traumatisme page 172
**Test 12** : Hémorragique mentionne traumatisme page 172
**Test 13** : États mentionnent caractéristiques/skills existants pour tests récupération
**Test 14** : Modificateurs cohérents (-10, -20, +10, +20 standards Warhammer)

## Validation des données

### Champs obligatoires
**index** : Unique, entier, 0-11
**label** : Unique, string, 5-20 caractères
**book** : Valeur autorisée : "LDB"
**page** : Entier, 167-169
**desc** : String non vide, HTML valide

### Règles inter-champs
**Règle 1** : desc doit mentionner au moins un modificateur chiffré ou "ne se cumule pas"
**Règle 2** : desc doit mentionner condition récupération (Test, fin Round, repos, etc.)
**Règle 3** : États mentionnant états consécutifs doivent référencer états existants
**Règle 4** : Références pages internes cohérentes avec livre source

### Messages d'erreur métier
**HTML invalide** : "Description HTML mal formée pour {label}"
**Modificateur manquant** : "{label} doit mentionner effets mécaniques chiffrés"
**Récupération manquante** : "{label} doit mentionner condition de récupération"
**Référence état invalide** : "{label} référence état inexistant : {état}"
**Référence page invalide** : "{label} référence page {page} hors plage LDB"
