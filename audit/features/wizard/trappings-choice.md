# Wizard Trappings - Sélection 'Au choix'

## Vue d'ensemble

Certains équipements de départ proposent plusieurs options séparées par " ou ". Le personnage doit choisir une option unique parmi les propositions avant de valider le step.

## Format de parsing

### Opérateur "ou"

**Séparateur :** " ou " (espace+ou+espace)
**Algorithme :** Split sur " ou " pour obtenir tableau d'options

Exemples :
```
"Chapeau ou Bonnet"           → ["Chapeau", "Bonnet"]
"Bouclier ou Arme de mêlée"   → ["Bouclier", "Arme de mêlée"]
"Dague ou Gourdin"            → ["Dague", "Gourdin"]
```

### Choix imbriqués

**Format :** Parenthèses pour sous-groupes

Exemple :
```
"Armure légère (Armure de cuir ou Armure de cuir souple avec Gilet de mailles ou Veste de cuir clouté)"
```

**Parsing :**
1. Extraction parenthèses → sous-choix
2. Split " ou " dans sous-groupe
3. Affichage liste options complètes

Voir : [pattern-parsing.md](../../patterns/pattern-parsing.md)

## Interface de sélection

### Panneau gauche

**Titre :** "X Possessions à choisir"
**Contenu :** Liste cliquable des options pour le choix en cours

**Affichage :**
- Une ligne par option disponible
- Bouton ou lien cliquable par option
- Icône aide si objet existe dans table Trappings avec description

**Traitement séquentiel :**
Le wizard traite un choix à la fois. Une fois sélectionné, passage automatique au choix suivant (si existe).

### Panneau droit

**Partie haute :** Description générale ("Vos Possessions sont constituées...")
**Partie basse :** Liste équipement déjà confirmé (automatiques + choix faits)

**Format liste :**
- Objets automatiques : Affichés grisés (pas de bouton suppression)
- Choix déjà faits : Affichés normalement avec bouton suppression

### Aide contextuelle

**Déclencheur :** Clic icône aide sur option
**Contenu popup :** `Helper.getHelpFormat(trapp, CharGen)`

Affiche :
- Nom complet objet
- Type (arme, armure, objet)
- Caractéristiques (dégâts, PA, enc, prix)
- Description narrative

Permet choix éclairé entre options.

## Logique de sélection

### Algorithme itératif

```
Pour chaque position dans character.trappings[] :
  Si character.trappings[position] est null ET allTrappingsToChoose[position] contient " ou " :
    1. Afficher titre "X Possessions à choisir"
    2. Afficher liste options du choix actuel
    3. Attendre sélection utilisateur
    4. Stocker choix dans character.trappings[position]
    5. Appeler récursivement showTrappings(position + 1)
  Sinon si trapping automatique :
    character.trappings[position] = valeur automatique
  Sinon :
    Continuer position suivante
```

### Stockage du choix

**Cible :** `character.trappings[index]`
**Valeur :** Label texte de l'option sélectionnée (string)

Exemple :
```
allTrappingsToChoose[0] = "Chapeau ou Bonnet"
→ Utilisateur clique "Chapeau"
→ character.trappings[0] = "Chapeau"
```

### Annulation d'un choix

**Bouton suppression** : Présent sur objets déjà choisis (panneau droit)
**Action :**
1. `character.trappings[index] = null`
2. Redémarrage affichage à `showTrappings(0)`

Permet correction d'erreurs.

## Validation nombre de choix

### Compteur restants

**Calcul :** Nombre de positions avec " ou " ET `character.trappings[index] === null`

**Affichage :** "X Possessions à choisir" dans panneau gauche

Si 0 choix restants :
- Panneau gauche vide
- Bouton "Valider" activé

### Blocage validation

**Condition :** `remaining !== 0`
**Effet :** Bouton "Valider" désactivé (`disabled: true`)

Empêche progression si choix incomplets.

## Exemples concrets

### Cas simple : Agitateur (Citadins)

**Trappings classe :** "Chapeau ou Bonnet, Bourse, Vêtements de bonne facture, Cape, 2 CO"

**Étapes :**
1. Position 0 : "Chapeau ou Bonnet" → Choix requis
2. Affichage panneau gauche : ["Chapeau", "Bonnet"]
3. Utilisateur clique "Chapeau"
4. character.trappings[0] = "Chapeau"
5. Positions 1-4 : Automatiques (Bourse, Vêtements, Cape, 2 CO)
6. Validation activée

### Cas multiple : Soldat (Guerriers)

**Trappings :** "Arme de mêlée, Bouclier ou Arme de mêlée, Bourse, Vêtements, Cape, 18 SB"

**Étapes :**
1. Position 0 : "Arme de mêlée" → Automatique
2. Position 1 : "Bouclier ou Arme de mêlée" → Choix requis
3. Affichage : ["Bouclier", "Arme de mêlée"]
4. Utilisateur clique "Bouclier"
5. character.trappings[1] = "Bouclier"
6. Positions 2-5 : Automatiques
7. **+ Choix carrière** (armure légère) → 2e cycle de sélection
8. Validation activée après tous choix

### Cas imbriqué : Recrue (armure légère)

**Trappings :** "Armure légère (Armure de cuir ou Armure de cuir souple avec Gilet de mailles ou Veste de cuir clouté), Arme de mêlée, Dague"

**Parsing :**
- Détection parenthèses
- Extraction : "Armure de cuir ou Armure de cuir souple avec Gilet de mailles ou Veste de cuir clouté"
- Split " ou " → 3 options

**Affichage panneau gauche :**
1. Armure de cuir
2. Armure de cuir souple avec Gilet de mailles
3. Veste de cuir clouté

**Sélection :** Une option complète stockée

## Règles métier

### Obligatoire
Tous les choix " ou " doivent être résolus avant validation.

### Un seul choix
L'utilisateur sélectionne exactement une option par groupe " ou ".

### Ordre préservé
Les choix sont traités dans l'ordre d'apparition dans la liste trappings.

### Traçabilité
Chaque choix stocké dans `character.trappings[]` à position exacte.

## Relations

**Avec database :**
- [trappings.md](../../database/trappings.md) : Résolution labels, aide contextuelle

**Avec patterns :**
- [pattern-parsing.md](../../patterns/pattern-parsing.md) : Parsing " ou ", parenthèses

**Avec autres features wizard :**
- [trappings-career.md](./trappings-career.md) : Source listes choix
- [trappings-manual.md](./trappings-manual.md) : Ajout supplémentaire après choix
