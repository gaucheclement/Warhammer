# Wizard Skills - Sélection "Au choix"

## Contexte

Gestion des compétences marquées "Au choix" dans les listes de skills d'espèce ou de carrière. Le joueur doit sélectionner parmi plusieurs options proposées.

**Objectif métier** : Permettre au joueur de personnaliser son personnage en choisissant les compétences qui correspondent à son concept parmi les options de la carrière ou de l'espèce.

## Périmètre fonctionnel

### Format "Au choix" dans les données

**Parsing du format** (voir [pattern-parsing.md](../../patterns/pattern-parsing.md))
- Opérateur "ou" : "Compétence A ou Compétence B ou Compétence C"
- Exemples : "Art (Au choix) ou Métier (Au choix)", "Animaux ou Charme", "Connaissance (Géologie) ou Connaissance (Métallurgie)"

**Provenance**
- Champ `skills` de la table Species : "Art (Au choix) ou Métier (Au choix), Animaux ou Charme"
- Champ `skills` de la table CareerLevels niveau 1 : "Art (Au choix) ou Métier (Au choix), Langue (Au choix)"

### Logique de sélection

**Affichage des options**
- Toutes les options sont affichées dans la liste des compétences
- Le joueur peut allouer des points à n'importe laquelle des options
- Seules les compétences avec points > 0 sont conservées

**Sélection exclusive vs multiple**
- Format "A ou B" : le joueur peut choisir A, B, ou les deux (pas d'exclusion stricte)
- Dans la pratique : le joueur alloue ses points limités, donc choisit naturellement

**Validation nombre de choix**
- Pas de contrainte explicite sur le nombre de choix
- La limite vient des points disponibles (espèce : 6 skills avec points, carrière : 40 points)

### Gestion spécialisations dans choix

**Combinaison "Au choix" + spécialisation**
- Format : "Art (Au choix)" signifie compétence groupée nécessitant spécialisation
- Le joueur doit : 1) Choisir "Art" parmi "Art ou Métier", 2) Choisir la spécialisation (ex: Peinture)
- Popup de spécialisation affichée lors du premier clic (voir [skills-specialization.md](./skills-specialization.md))

**Exemples**
- "Art (Au choix) ou Métier (Au choix)" → Joueur choisit Métier → Popup pour spécialiser (Forgeron, Charpentier...)
- "Connaissance (Géologie) ou Connaissance (Métallurgie)" → Spécialisations prédéfinies, pas de popup

## Exemples concrets Warhammer

### Humain (Reiklander) - Espèce

**Skills espèce** : "Athlétisme, Calme, Résistance, Langue (Bataille), Art (Au choix) ou Métier (Au choix), Animaux ou Charme, Commerage ou Ragots"

**Options "Au choix"**
1. "Art (Au choix) ou Métier (Au choix)" : 2 options, chacune nécessitant spécialisation
2. "Animaux ou Charme" : 2 options, compétences simples
3. "Commerage ou Ragots" : 2 options, compétences simples

**Scénario 1 : Artiste**
- Choisit "Art (Au choix)" → Popup pour spécialiser → "Peinture"
- Choisit "Charme" parmi "Animaux ou Charme"
- Choisit "Ragots" parmi "Commerage ou Ragots"
- Alloue +5 à Art (Peinture), +3 à Charme, 0 à Ragots (mais skill visible)

**Scénario 2 : Artisan**
- Choisit "Métier (Au choix)" → Popup → "Forgeron"
- Choisit "Animaux" parmi "Animaux ou Charme"
- Choisit "Commerage" parmi "Commerage ou Ragots"
- Alloue +5 à Métier (Forgeron), +3 à Animaux

### Nain - Espèce

**Skills espèce** : "Résistance, Endurance, Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid), Connaissance (Géologie) ou Connaissance (Métallurgie)"

**Options "Au choix"**
- "Connaissance (Géologie) ou Connaissance (Métallurgie)" : 2 options, spécialisations prédéfinies

**Scénario : Forgeron nain**
- Choisit "Métier (Au choix)" → Popup → "Forgeron"
- Choisit "Connaissance (Métallurgie)" parmi les deux Connaissance
- Alloue +5 à Métier (Forgeron), +3 à Connaissance (Métallurgie)

### Bourgeois - Carrière niveau 1

**Skills carrière** : "Charme, Résistance, Commandement, Ragots, Intuition, Connaissance (Reikland), Art (Au choix) ou Métier (Au choix), Langue (Au choix)"

**Options "Au choix"**
1. "Art (Au choix) ou Métier (Au choix)" : 2 options
2. "Langue (Au choix)" : compétence groupée

**Scénario : Bourgeois cuisinier**
- Choisit "Métier (Au choix)" → Popup → "Cuisine"
- Choisit "Langue (Au choix)" → Popup → "Tiléen"
- Alloue 40 points : Charme +10, Ragots +10, Commandement +10, Métier (Cuisine) +5, Langue (Tiléen) +5

### Agitateur - Carrière niveau 1 (contre-exemple)

**Skills carrière** : "Athlétisme, Esquive, Intuition, Corps à corps (Base), Calme, Charme, Commandement, Ragots"

**Particularité** : Aucune option "Au choix" dans cette carrière

**Comportement** : Toutes les compétences sont fixes, pas de sélection nécessaire

## Relations avec autres composants

**Tables** : Species (skills), CareerLevels (skills), Skills (specs)

**Étapes wizard** : Species Skills et Career Skills

**Patterns** : Parsing (opérateur "ou"), Spécialisations ("(Au choix)")

## Règles métier

### Parsing "ou"

**Identification**
- Recherche de l'opérateur " ou " (espace + ou + espace) dans la chaîne skills
- Séparation en tokens : "A ou B ou C" → ["A", "B", "C"]

**Traitement**
- Chaque token devient une compétence disponible dans la liste
- Le joueur voit toutes les options affichées
- Il alloue des points librement à celles qu'il souhaite

### Validation nombre de choix

**Pas de contrainte stricte**
- Format "A ou B" ne force pas à choisir exactement 1 option
- Le joueur peut choisir A, B, les deux, ou aucun (si 0 points alloués)

**Limite indirecte**
- Espèce : 6 compétences avec points (3×+5, 3×+3) limite naturellement les choix
- Carrière : 40 points à répartir, max 10 par skill

**Filtrage final**
- Seules les compétences avec points > 0 sont conservées dans le personnage
- Les options non sélectionnées (0 points) disparaissent

### Gestion spécialisations

**Compétence groupée avec "Au choix"**
- Format : "Art (Au choix)" indique : 1) Compétence à choisir parmi "ou", 2) Spécialisation à définir
- Ordre : 1) Joueur clique sur "Art (Au choix)", 2) Popup spécialisation, 3) Sélection (Peinture), 4) Allocation points

**Spécialisations prédéfinies**
- Format : "Connaissance (Géologie) ou Connaissance (Métallurgie)"
- Pas de popup, spécialisations déjà fixées
- Joueur alloue directement des points

## Validation et contraintes

### Validation au clic sur "Valider"

**Critère 1 : Spécialisations définies**
- Toutes les compétences "(Au choix)" avec points > 0 doivent avoir une spécialisation
- Popup automatique si manquant

**Critère 2 : Points alloués correctement**
- Espèce : 3×+5 et 3×+3 (exactement 6 skills)
- Carrière : 40 points total, max 10 par skill

**Messages utilisateur**
- Feedback visuel via compteurs
- Popup spécialisation si nécessaire
- Bouton "Valider" désactivé si critères non remplis

## Voir aussi

- [skills-species.md](./skills-species.md) - Compétences d'espèce
- [skills-career.md](./skills-career.md) - Compétences de carrière
- [skills-specialization.md](./skills-specialization.md) - Gestion spécialisations
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing "ou"
- [species.md](../../database/species.md) - Source skills espèce
- [careerLevels.md](../../database/careerLevels.md) - Source skills carrière
