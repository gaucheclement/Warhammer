# Wizard Skills - Compétences de Carrière

## Contexte

Deuxième partie de l'étape Skills du wizard de création de personnage. Après avoir sélectionné les compétences raciales, le joueur répartit 40 points d'augmentation parmi les compétences du niveau 1 de carrière.

**Objectif métier** : Permettre au joueur de personnaliser les compétences de sa carrière en allouant librement 40 points d'augmentation.

## Périmètre fonctionnel

### Compétences du niveau 1 de carrière

**Source des compétences**
- Proviennent du champ `skills` de la table CareerLevels pour le niveau 1 (voir [careerLevels.md](../../database/careerLevels.md))
- Format texte nécessitant parsing (voir [pattern-parsing.md](../../patterns/pattern-parsing.md))
- Exemples : "Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots"

**Quantité**
- Généralement 8-10 compétences pour le niveau 1 de carrière
- Peut inclure des compétences "Au choix" parmi plusieurs options

**Type de compétences**
- **Compétences Basic** : Accessibles à tous (Athlétisme, Calme, Esquive)
- **Compétences Advanced** : Spécifiques à certaines carrières (Guérison, Crochetage, Navigation)

### Système d'allocation de 40 points

**Règles de répartition**
- Total de 40 points à répartir librement
- Limite : Maximum 10 points par compétence
- Pas de minimum : une compétence peut rester à 0

**Validation**
- Tous les 40 points doivent être alloués pour valider l'étape
- Compteur dynamique affiche les points restants
- Bouton "Valider" désactivé si points restants ≠ 0

### Cumul avec compétences d'espèce

**Compétences communes**
- Si une compétence est à la fois dans l'espèce ET dans la carrière, les augmentations se cumulent
- Exemple : Un Humain (Athlétisme +5 d'espèce) devenant Agitateur (Athlétisme niveau 1) peut avoir Athlétisme avec Base + 5 (espèce) + 10 (carrière) = Total +15

**Compétences distinctes**
- Les compétences uniquement dans la carrière commencent à 0 augmentation d'espèce
- Les compétences uniquement dans l'espèce ne sont pas modifiables à cette étape

### Gestion des spécialisations

**Spécialisations héritées**
- Si la compétence a déjà été sélectionnée avec spécialisation à l'étape espèce, la spécialisation est conservée
- Exemple : Art (Peinture) choisi à l'étape espèce → Art (Peinture) affiché ici

**Spécialisations à définir**
- Si la carrière liste une compétence groupée sans spécialisation, le joueur doit choisir
- Popup de sélection affichée lors du premier clic
- Exemple : Corps à corps (?) → choix parmi (Bagarre, Escrime, Base, etc.)

**Opérateur "Au choix"**
- Certaines carrières offrent "Compétence A ou Compétence B ou Compétence C"
- Le joueur sélectionne celle(s) qu'il souhaite développer
- Toutes les options sont affichées, seules celles avec points > 0 sont conservées

## Affichage

### Structure de l'interface

**Panneau gauche** : Compteur dynamique affichant points restants (40 → 0)

**Liste compétences** : Tableau (Nom | Base | Augmentation | Total) avec une ligne par skill du niveau 1 de carrière, boutons +/- pour ajuster

### Valeurs

**Nom** : Label avec spécialisation (ex: "Corps à corps (Escrime)", "Athlétisme"). **Base** : Valeur caractéristique liée. **Augmentation** : Cumul espèce + carrière (ex: 5+7=12). **Total** : Base + Augmentation (ex: 30+12=42).

### Contrôles

**Boutons +/-** : Ajustement par incrément de 1, limite 0-10 par skill. **Bouton Valider** : Activé uniquement si les 40 points sont entièrement alloués.

## Exemples concrets Warhammer

### Agitateur (Humain Reiklander)

**Skills carrière** : Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots

**Espèce (rappel)** : Athlétisme +5, Calme +5, Charme +3

**Répartition 40pts** : Athlétisme +5, Calme +5, Charme +10, Commandement +10, Ragots +10

**Résultat** : Athlétisme 25+5+5=35, Calme 32+5+5=42, Charme 35+3+10=48, Commandement 35+10=45, Ragots 35+10=45

### Artisan (Nain)

**Skills carrière** : Calme, Résistance, Métier (Forgeron), Corps à corps (Base), Perception, Marchandage, Ragots, Évaluation

**Espèce (rappel)** : Résistance +5, Métier (Forgeron) +5, Calme +3, Corps à corps (Base) +3

**Répartition 40pts** : Métier (Forgeron) +10, Évaluation +10, Marchandage +10, Perception +10

**Résultat** : Métier (Forgeron) 30+5+10=45, Évaluation 28+10=38, Marchandage 30+10=40, Perception 28+10=38

### Bourgeois (Halfling)

**Skills carrière** : Charme, Résistance, Commandement, Ragots, Intuition, Connaissance (Reikland), Art ou Métier (Au choix), Langue (Au choix)

**Espèce (rappel)** : Charme +5, Ragots +5, Intuition +3. **Choix** : Métier (Cuisine), Langue (Tiléen)

**Répartition 40pts** : Charme +10, Ragots +10, Commandement +10, Métier (Cuisine) +5, Langue (Tiléen) +5

**Résultat** : Charme 30+5+10=45, Ragots 30+5+10=45, Commandement 30+10=40, Métier (Cuisine) 25+5=30, Langue (Tiléen) 25+5=30

## Relations avec autres composants

**Tables** : CareerLevels (skills niveau 1), Skills (characteristic, type, specs), Characteristics (valeurs base)

**Étapes wizard** : Précédente = Species Skills (augmentations espèce), Suivante = Talents

**Patterns** : Parsing (virgule, "ou"), Spécialisations ("(Au choix)", popup)

## Règles métier

### Contraintes

**Total de points**
- Exactement 40 points doivent être alloués
- Validation bloquée si points restants ≠ 0

**Limite par compétence**
- Maximum 10 points par compétence de carrière
- Bouton "+" désactivé si limite atteinte

**Cumul avec espèce**
- Les augmentations d'espèce et de carrière se cumulent
- Affichage : colonne "Augmentation" = espèce + carrière

### Spécialisations

**Héritage**
- Si spécialisation déjà définie à l'étape espèce, elle est conservée automatiquement

**Sélection**
- Popup affichée au premier clic si spécialisation non définie
- Blocage jusqu'à ce que le joueur ait choisi

### Mode Free

**Différence avec mode guidé**
- En mode Free : toutes les compétences disponibles (pas seulement celles de la carrière)
- Les compétences de carrière sont surlignées (class `highlighting`)
- Pas de limite de +10 par compétence
- Validation non bloquante

## Validation et contraintes

### Validation au clic sur "Valider"

**Critère 1 : Total de points**
- Doit être exactement 40 points alloués
- Sinon : bouton "Valider" désactivé

**Critère 2 : Spécialisations définies**
- Toutes les compétences avec "(Au choix)" doivent avoir une spécialisation
- Popup affichée automatiquement si manquant

**Messages utilisateur**
- Compteur visuel mis à jour dynamiquement (points restants)
- Bouton "Valider" grisé si validation échoue
- Pas de message d'erreur explicite (feedback visuel uniquement)

## Voir aussi

- [skills-species.md](./skills-species.md) - Étape précédente (compétences d'espèce)
- [skills-specialization.md](./skills-specialization.md) - Gestion des spécialisations
- [skills-choice.md](./skills-choice.md) - Gestion "Au choix"
- [skills-advances.md](./skills-advances.md) - Calcul des avances
- [skills-values.md](./skills-values.md) - Calcul des valeurs finales
- [careerLevels.md](../../database/careerLevels.md) - Source des compétences de carrière
- [skills.md](../../database/skills.md) - Définition des compétences
