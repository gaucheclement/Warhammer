# Pattern: Spécialisations

## Contexte
Liste des spécialisations possibles pour une compétence ou talent.
Définit les variantes acceptées d'une même base.

---

## 1. Champ specs (Liste de spécialisations)

### Format
Champ "specs" contenant une liste séparée par ", " ou chaîne vide "".

### Exemples

**Compétences avec spécialisations :**
```
Corps à corps → specs:
"Armes d'hast, À deux mains, Bagarre, Base, Cavalerie, Escrime, Fléau, Parade"

Langue → specs:
"Bretonnien, Classique, Eltharin, Grumbarth, Guilderien, Halfling, Khazalid, Kislevien, Mootlandais, Norse, Reikspiel, Tiléen, Wastelander"
```

**Sans spécialisations :**
```
Calme → specs: ""
```

### Extraction

Le parsing consiste à découper la chaîne "specs" sur le séparateur ", " pour obtenir la liste des spécialisations possibles.

Si "specs" est vide, aucune spécialisation n'est possible.

### Validation spécialisation

Lors de la création d'un personnage, si une compétence ou talent a une spécialisation (ex: "Corps à corps (Base)"), la spécialisation fournie ("Base") doit être présente dans la liste "specs" de cette compétence.

### Utilisation

**Création de personnage :**
Quand une espèce donne "Corps à corps (Base)", on vérifie que "Base" est bien dans la liste des specs de la compétence "Corps à corps".

**Affichage sélecteur :**
Lors du choix d'une spécialisation "(Au choix)", présenter la liste complète des specs au joueur.

### Validation

**Pas de doublons :**
Vérifier qu'aucune spécialisation n'apparaît deux fois dans la liste.

**Format cohérent :**
Vérifier que le séparateur ", " est bien utilisé (virgule + espace).

**Erreurs possibles :**
- `SPEC_DUPLICATE` : "Specs contient 'Base' deux fois"
- `SPEC_FORMAT` : "Séparateur invalide (manque espace)"
- `SPEC_EMPTY` : "Spec vide dans la liste"

---

## 2. Valeur spéciale "(Au choix)"

### Format
```
"Nom (Au choix)"
```

### Exemples
```
"Métier (Au choix)"
"Langue (Au choix)"
"Divertissement (Au choix)"
"Savoir (Au choix)"
```

### Détection
Détecter si la spécialisation est exactement "Au choix".

### Résolution

Processus en 4 étapes :

**Étape 1 : Identifier compétence/talent**
Parser le nom pour extraire "Métier" de "Métier (Au choix)".

**Étape 2 : Obtenir spécialisations valides**
Trouver la compétence/talent dans la table et extraire sa liste de spécialisations.

**Étape 3 : Présenter au joueur**
Afficher une liste déroulante avec toutes les spécialisations possibles.

**Étape 4 : Saisie libre (optionnel)**
Si la liste est trop longue (>20 options), permettre une saisie libre avec validation.

### Différence avec "(Spé1 ou Spé2)"

**"(Au choix)" - Choix libre :**
N'IMPORTE QUELLE spécialisation de la compétence (peut être 30+ options).

**"(Spé1 ou Spé2)" - Choix limité :**
UNIQUEMENT les options listées (généralement 2-5 options).

### Utilisation métier

**Création de personnage :**
Présenter soit :
- Toutes les spécialisations valides (si <20)
- Un champ de saisie libre avec validation (si >20)

### Validation
Vérifier que la spécialisation choisie existe bien dans la liste des spécialisations de la compétence/talent.

### Cas d'usage courants

**Métier :**
Personnage artisan, choix libre selon background imaginé.

**Langue :**
Personnage polyglotte, choix selon région d'origine.

**Savoir :**
Érudit spécialisé, choix selon expertise.

**Divertissement :**
Artiste, choix selon talent artistique.

---

## Combinaisons

### Spécialisation avec choix exclusifs
```
"Langue (Bretonnien ou Tiléen)"
```

Nécessite parsing supplémentaire avec le pattern " ou ".

Résolution :
1. Parser "Langue (Bretonnien ou Tiléen)"
2. Extraire nom : "Langue"
3. Extraire spec : "Bretonnien ou Tiléen"
4. Parser spec avec " ou " → ["Bretonnien", "Tiléen"]
5. Présenter ces 2 options au joueur

---

## Tables concernées

- Skills (specs)
- Talents (specs, rare)
- Species (skills, talents utilisant specs)
- CareerLevels (skills, talents utilisant specs)

---

## Voir aussi

- [pattern-parsing.md](./pattern-parsing.md) - Parsing "Nom (Spec)"
- [pattern-talent-aleatoire.md](./pattern-talent-aleatoire.md) - "X Talent aléatoire"
