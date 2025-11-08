# Wizard Trappings - Affichage équipement carrière

## Vue d'ensemble

Le step "Possessions" affiche automatiquement l'équipement de départ fourni par le niveau 1 de la carrière sélectionnée. Cet équipement combine les trappings de la classe sociale et ceux spécifiques au niveau de carrière.

## Source des données

### Équipement de classe

**Source :** Table Classes, champ `trappings`
**Héritage :** Au niveau 1 uniquement
**Format :** Liste séparée par virgules

Équipement de base commun à toutes les carrières de la classe sociale.

Exemples :
- Citadins : "Chapeau ou Bonnet, Bourse, Vêtements de bonne facture, Cape, 2 CO"
- Guerriers : "Arme de mêlée, Bouclier ou Arme de mêlée, Bourse, Vêtements, Cape, 18 SB"

### Équipement de carrière

**Source :** Table CareerLevels (niveau 1), champ `trappings`
**Format :** Liste séparée par virgules
**Parsing :** Voir [pattern-parsing.md](../../patterns/pattern-parsing.md)

Équipement spécifique au métier initial.

## Format des entrées

### Objets simples
Format direct, nom de l'objet tel que défini dans table Trappings.

```
Nécessaire d'écriture
Marteau
Clous
```

### Quantités
**Format :** Quantité numérique avant le nom

```
2 CO          (2 Couronnes d'or)
18 SB         (18 Sous de bronze)
10 Clous      (10 exemplaires)
```

### Choix multiples
**Format :** "Item1 ou Item2"
**Séparateur :** " ou "

```
Chapeau ou Bonnet
Bouclier ou Arme de mêlée
```

Le personnage doit choisir une option parmi les propositions.
Voir : [trappings-choice.md](./trappings-choice.md)

## Règles de cumul

### Niveau 1 = Classe + Carrière

L'équipement total au niveau 1 combine :
1. **Trappings de classe** (hérités une seule fois)
2. **Trappings du niveau 1 de carrière**

**Important :** Pas de dédoublonnage automatique. Si classe et carrière donnent le même objet, le personnage en possède deux.

### Niveaux 2-4

Les niveaux suivants ajoutent uniquement leurs propres trappings.
**Aucun héritage** de classe ou niveaux précédents.

Voir : [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md)

## Affichage

### Panneau gauche

**Titre :** "X Possessions à choisir"
**Contenu :** Liste des objets "ou" nécessitant un choix

Si tous les choix sont faits, le panneau est vide.

### Panneau droit

**Partie haute :** Description générale du système de possessions
**Partie basse :** Liste complète de l'équipement (choisis + automatiques)

Format :
- Objets automatiques : Affichés directement (grisés)
- Objets "ou choix" : Affichés après sélection

### Aide contextuelle

**Icône aide** : Affichée si l'objet existe dans table Trappings avec `desc` non vide
**Contenu popup** : Description complète de l'objet (caractéristiques, prix, utilisation)

Génération via `Helper.getHelpFormat(trapp, CharGen)`.

## Exemples concrets

### Agitateur (Citadins, Pamphlétaire)
**Classe :** Chapeau ou Bonnet, Bourse, Vêtements de bonne facture, Cape, 2 CO
**Carrière :** Nécessaire d'écriture, Marteau, 10 Clous, 10 Tracts
**Total :** 9 items (1 choix requis)

### Soldat (Guerriers, Recrue)
**Classe :** Arme de mêlée, Bouclier ou Arme de mêlée, Bourse, Vêtements, Cape, 18 SB
**Carrière :** Armure légère (sous-choix), Arme de mêlée, Dague
**Total :** 9 items (2 choix requis, doublon Arme de mêlée)

### Érudit (Lettrés, Étudiant)
**Classe :** Dague ou Gourdin, Bourse, Vêtements de bonne facture, Cape, 2 CO
**Carrière :** Grimoire, Nécessaire d'écriture, Sac
**Total :** 8 items (1 choix requis)

## Résolution des objets

**Matching :** `Helper.searchTrapping(label, CharGen)` recherche par label exact dans table Trappings.
Si trouvé : type, enc, prix, desc. Sinon : objet générique sans aide.

**Objets spéciaux :**
- Argent (CO/PA/SB) : Converti en monnaie (1 CO = 20 PA = 240 SB)
- "Vêtements", "Nécessaire de..." : Catégories génériques

## Règles métier

**Obligatoire :** Trappings automatiques ajoutés sans intervention
**Optionnel :** Choix "ou" résolus avant validation
**Cumul :** Pas de dédoublonnage (doublons possibles classe+carrière)
**Monnaie :** Argent classe + carrière cumulé

## Validation

**Prérequis pour passer au step suivant :**
- Tous les choix "ou" résolus
- Liste complète `character.trappings[]` remplie

**Indicateur visuel :** Bouton "Valider" désactivé tant que choix restants > 0

## Relations

**Avec database :**
- [careerLevels.md](../../database/careerLevels.md) : Source trappings carrière
- [classes.md](../../database/classes.md) : Source trappings classe
- [trappings.md](../../database/trappings.md) : Résolution objets

**Avec patterns :**
- [pattern-parsing.md](../../patterns/pattern-parsing.md) : Parsing listes CSV

**Avec autres features wizard :**
- [trappings-choice.md](./trappings-choice.md) : Sélection "ou"
- [trappings-manual.md](./trappings-manual.md) : Ajout personnalisé
- [trappings-encumbrance.md](./trappings-encumbrance.md) : Calcul poids total
