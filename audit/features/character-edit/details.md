# Character Edit - Modification Détails

## Vue d'ensemble

La modification des détails permet d'éditer les informations personnelles et descriptives du personnage : nom, âge, taille, apparence, religion, ambitions, etc. Ces informations sont stockées dans le tableau `details` et peuvent être modifiées librement sans impact sur les règles du jeu.

## Structure des détails

### Stockage

Le personnage possède un tableau `details` qui contient les informations descriptives. Dans le code fourni :
- Lors de la sauvegarde : `this.details` est conservé
- Lors du chargement : `this.details = data.details` restaure les informations

### Champs disponibles

Les détails typiques d'un personnage Warhammer incluent :
- **Nom** : Nom complet du personnage
- **Âge** : En années
- **Sexe** : Masculin, Féminin, Autre
- **Taille** : En cm ou pieds/pouces
- **Couleur des yeux** : Description
- **Couleur des cheveux** : Description
- **Signes distinctifs** : Cicatrices, tatouages, etc.
- **Ambitions à court terme** : Objectifs immédiats
- **Ambitions à long terme** : Rêves et aspirations

## Édition du nom

### Modification libre

Le nom peut être changé à tout moment. Il s'agit d'un simple champ texte sans validation particulière.

### Noms générés

Lors de la création, un nom peut être généré aléatoirement selon l'espèce et la région. L'utilisateur peut ensuite le modifier à sa guise.

## Modification de l'âge et de la taille

### Âge

L'âge peut être ajusté manuellement. Il n'a généralement pas d'impact mécanique dans Warhammer 4e édition mais enrichit le roleplay.

### Taille

La taille peut être éditée. Elle peut influencer certaines situations narratives (passer dans un espace étroit, atteindre un objet haut, etc.) mais n'a pas de règles mécaniques directes.

### Valeurs aléatoires initiales

À la création, âge et taille peuvent être tirés aléatoirement selon les tables de l'espèce, puis modifiés par l'utilisateur.

## Changement de dieu/signe astrologique

### Dieu

Le personnage peut changer de divinité vénérée. Cette information est utilisée pour :
- Déterminer les bénédictions accessibles (si talent "Béni")
- Définir le roleplay du personnage

La méthode `getGod()` récupère le dieu via le talent "Béni" ou "Invocation" possédé. Si le talent change, le dieu change automatiquement.

### Signe astrologique (étoile)

Le signe est normalement défini à la création et influence les caractéristiques via des bonus. Il est stocké dans `this.star` et non dans `details`.

Modification du signe :
- `setStar(star)` : Change le signe
- Impact : Recalcul automatique des bonus de caractéristiques via `getStar()`

## Modification de l'apparence

### Couleur des yeux

Champ texte libre pour décrire la couleur des yeux. Peut être tiré aléatoirement à la création selon l'espèce puis modifié.

### Couleur des cheveux

Champ texte libre pour décrire la couleur et le style des cheveux.

### Signes distinctifs

Description libre de cicatrices, tatouages, marques de naissance, etc. Ces éléments enrichissent l'identité visuelle du personnage.

## Ambitions

### Ambitions à court terme

Objectifs immédiats du personnage :
- Gagner de l'argent
- Venger un proche
- Obtenir un objet spécifique
- Accomplir une mission

Ces ambitions guident le jeu à court terme et peuvent changer fréquemment.

### Ambitions à long terme

Rêves et aspirations majeurs :
- Devenir riche et célèbre
- Fonder une famille
- Maîtriser un art
- Changer le monde

Ces ambitions définissent l'arc narratif du personnage sur le long terme.

### Édition libre

Les ambitions peuvent être modifiées à tout moment par l'utilisateur pour refléter l'évolution du personnage.

## Autres informations personnelles

### Lieu de naissance

Région ou ville d'origine. Peut influencer l'accent, les contacts, et les connaissances du personnage.

### Classe sociale

Classe sociale d'origine (noble, bourgeois, peuple, hors-la-loi). Détermine le contexte social du personnage.

### Famille

Informations sur la famille : parents vivants, frères et sœurs, statut marital, enfants, etc.

### Histoire personnelle

Résumé du passé du personnage, événements marquants, formation, etc.

## Validation

### Champs libres

La plupart des champs de détails sont libres sans validation stricte. L'utilisateur peut saisir ce qu'il souhaite.

### Cohérence suggérée

Bien que non imposée par le code, la cohérence avec l'espèce et la carrière est recommandée :
- Un Halfling ne mesure généralement pas 2 mètres
- Un prêtre de Sigmar ne vénère pas Ulric
- L'âge devrait être dans une fourchette raisonnable

Ces vérifications relèvent du bon sens et du jugement du joueur/MJ.

## Exemple concret

### Scénario : Modification du nom et des ambitions

**État initial**
- Nom : "Johann Schmidt"
- Ambition court terme : "Gagner 100 couronnes d'or"
- Ambition long terme : "Ouvrir une taverne"

**Modification**
L'utilisateur édite les champs :
- Nom → "Johann le Brave"
- Ambition court terme → "Retrouver l'épée de mon père"
- Ambition long terme → "Devenir chevalier de l'Empire"

**Application**
1. Modification directe de `details.nom`
2. Modification de `details.ambition_court_terme`
3. Modification de `details.ambition_long_terme`
4. Pas de recalcul nécessaire, pas d'impact sur les mécaniques

**Sauvegarde**
Lors de `save()`, le tableau `details` est conservé avec les nouvelles valeurs.

## Relations avec autres composants

- **[Espèce](../wizard/species.md)** : Détermine les valeurs par défaut (taille, âge, apparence)
- **[Étoile](../wizard/star.md)** : Signe astrologique (stocké séparément de details)
- **[Talents](./talents.md)** : Le dieu est déterminé par "Béni" ou "Invocation"
- **[Création](../wizard/details.md)** : Génération initiale des détails
