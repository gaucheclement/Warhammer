# Character Edit - Gestion Équipement

## Vue d'ensemble

La gestion de l'équipement permet d'ajouter, de supprimer et de modifier les objets possédés par le personnage. L'équipement inclut les armes, armures, et objets divers (trappings). Le code actuel stocke l'équipement de manière simple dans le tableau `trappings`.

## Structure de l'équipement

### Stockage

Le personnage possède un tableau `trappings` qui contient la liste de tous les objets possédés. Dans le code fourni, ce tableau est géré de manière simple :
- Lors de la sauvegarde : `this.trappings` est conservé tel quel
- Lors du chargement : `this.trappings = data.trappings` restaure la liste

### Format des données

Chaque objet dans `trappings` peut contenir :
- **Nom** : Désignation de l'objet
- **Quantité** : Nombre d'exemplaires
- **État** : Porté, équipé, rangé, etc.
- **Encombrement** : Poids ou volume (selon règles Warhammer)
- **Catégorie** : Type d'objet (arme, armure, outil, etc.)

Le format exact dépend des règles métier mais n'est pas détaillé dans le code fourni.

## Ajout d'équipement

### Trappings de carrière

Lors de la création du personnage, la carrière fournit une liste d'équipement de départ. Cet équipement peut être ajouté automatiquement ou nécessiter des choix de l'utilisateur.

### Ajout manuel

L'utilisateur peut ajouter manuellement des objets à tout moment en éditant le personnage. Les objets peuvent provenir :
- D'achats
- De trouvailles
- De récompenses
- De fabrication

### Choix et alternatives

Certains équipements de carrière proposent des choix (ex: "Arme de mêlée OU Bouclier"). L'interface permet de sélectionner l'option souhaitée.

## Suppression d'équipement

### Retrait manuel

L'utilisateur peut retirer un objet de la liste à tout moment (vente, perte, don, destruction).

### Gestion des quantités

Si un objet existe en plusieurs exemplaires, la suppression peut :
- Réduire la quantité de 1
- Retirer complètement l'objet si quantité atteint 0

## Modification de quantités

### Incrémentation/Décrémentation

L'interface permet d'ajuster le nombre d'exemplaires d'un objet :
- Achat/trouvaille : +1 ou +N
- Utilisation/perte : -1 ou -N

### Objets consommables

Certains objets sont consommables (munitions, potions, rations). Leur quantité diminue lors de l'utilisation.

## Gestion des états

### États possibles

Un objet peut avoir différents états :
- **Porté** : Sur le personnage, compte pour l'encombrement
- **Équipé** : Utilisé activement (arme en main, armure portée)
- **Rangé** : Dans le sac, non immédiatement accessible
- **Stocké** : Ailleurs (monture, logement), ne compte pas pour l'encombrement

### Changement d'état

L'utilisateur peut changer l'état d'un objet selon les besoins (équiper une arme, ranger une armure, etc.).

## Calcul de l'encombrement

### Encombrement total

L'encombrement total est la somme des encombrements de tous les objets portés/équipés :

**Encombrement total** = Σ (encombrement objet × quantité) pour objets portés/équipés

### Limite d'encombrement

La limite d'encombrement dépend de la Force ou de l'Endurance du personnage selon les règles :
- **Limite** = Bonus de Force × multiplicateur (souvent 10)

Si l'encombrement dépasse la limite, le personnage subit des malus.

### Impact sur le mouvement

Un encombrement élevé réduit le Mouvement du personnage :
- **Léger** : Mouvement normal
- **Moyen** : Mouvement réduit
- **Lourd** : Mouvement très réduit
- **Surchargé** : Déplacement impossible

## Catégories d'équipement

### Organisation

Les objets peuvent être classés par catégorie pour faciliter la gestion :
- **Armes de mêlée** : Épées, haches, masses, etc.
- **Armes à distance** : Arcs, arbalètes, armes à poudre
- **Armures** : Armures légères, moyennes, lourdes
- **Boucliers** : Boucliers de différentes tailles
- **Munitions** : Flèches, carreaux, balles
- **Vêtements** : Habits ordinaires ou de qualité
- **Outils** : Matériel de métier
- **Provisions** : Nourriture, boisson
- **Divers** : Autres objets

### Filtrage

L'interface peut filtrer l'affichage par catégorie pour faciliter la recherche d'un objet.

## Validation

### Vérifications

Lors de la modification de l'équipement, le système vérifie :
- **Quantité positive** : Pas de quantité négative
- **Encombrement valide** : Calcul cohérent
- **État cohérent** : Un objet ne peut pas être à la fois rangé et équipé

### Avertissements

Si l'encombrement dépasse la limite, un avertissement est affiché mais la modification n'est pas bloquée (le personnage peut choisir d'être surchargé).

## Exemple concret

### Scénario : Ajout d'une épée

**Situation initiale**
Le personnage n'a pas d'épée.

**Ajout**
1. L'utilisateur sélectionne "Ajouter équipement"
2. Choix de l'objet : "Épée"
3. Définition :
   - Quantité : 1
   - État : Équipée
   - Encombrement : 5 (exemple)
   - Catégorie : Arme de mêlée
4. Ajout au tableau trappings

**Calcul encombrement**
- Avant : 20 (autres objets)
- Après : 25 (20 + 5)
- Limite : 40 (Bonus de Force = 4 × 10)
- Statut : Acceptable (25 < 40)

**Modification quantité**
L'utilisateur achète une 2e épée :
- Quantité passe à 2
- Encombrement : 30 (20 + 5 × 2)
- Toujours acceptable

**Changement d'état**
L'utilisateur range la 2e épée :
- Épée 1 : Équipée, encombrement 5
- Épée 2 : Rangée, encombrement 5
- Total : 30 (inchangé, les deux comptent)

**Suppression**
Vente de l'épée 2 :
- Quantité : 1
- Encombrement : 25

## Relations avec autres composants

- **[Carrière](../wizard/career.md)** : Fournit l'équipement de départ
- **[Caractéristiques](./characteristics.md)** : Déterminent la limite d'encombrement
- **Référentiel équipement** : Base de données des objets disponibles
