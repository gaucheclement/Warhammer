# Wizard Career - Filtrage par classe

## Vue d'ensemble

Le système de filtrage par classe organise les carrières en catégories sociales, facilitant la navigation et reflétant la structure sociale de Warhammer. Les carrières accessibles sont regroupées par classe pour améliorer l'expérience utilisateur.

**Objectif métier** : Structurer l'affichage des carrières selon leur appartenance sociale, permettant au joueur de comprendre rapidement le statut et le type de profession.

## Les classes sociales

### Classes jouables (9)

**Citadins** : Classe moyenne urbaine (Agitateur, Artisan, Bourgeois, Enquêteur, Marchand, Milicien).

**Courtisans** : Statut élevé, services spécialisés (Artiste, Avocat, Noble, Politicien, Serviteur).

**Guerriers** : Combattants professionnels (Soldat, Mercenaire, Chevalier, Pistolier, Tueur de Trolls).

**Itinérants** : Voyageurs des routes (Charlatan, Colporteur, Messager, Patrouilleur).

**Lettrés** : Érudits sachant lire/écrire (Apprenti sorcier, Érudit, Ingénieur, Médecin, Prêtre).

**Riverains** : Travailleurs fluviaux (Batelier, Contrebandier, Pêcheur, Smuggler).

**Seafarers** : Marins (Matelot, Capitaine, Navigateur).

**Roublards** : Activités illégales (Criminel, Escroc, Receleur, Voleur).

**Ruraux** : Habitants des campagnes (Chasseur, Éleveur, Herboriste, Paysan, Villageois).

### Classe non-jouable (1)

**Chaos** : Carrières interdites liées au Chaos. Jamais affichées en création standard.

## Organisation hiérarchique

**Niveau 1 - Classes** : En-têtes non sélectionnables (`listchild1`), séparateurs visuels.

**Niveau 2 - Carrières** : Items sélectionnables (`listchild2`) avec label + seuil (ex: "Artisan 2-3").

**Niveau 3 - Levels** : Masqués en création (`hide()`), utilisés uniquement en mode avancement.

## Mécanisme de filtrage

### Construction de la liste

**Processus** :
1. Parcours de toutes les carrières (`CharGen.data.career.all`)
2. Pour chaque carrière, vérification `rand[espèce]` numérique
3. Si nouvelle classe détectée, ajout header de classe
4. Ajout carrière sous la classe correspondante
5. Calcul et affichage seuils aléatoires

### Exemple : Nain

**Citadins** (header)
- Artisan 2-8 (sélectionnable)
- Bourgeois 9-14 (sélectionnable)
- Enquêteur 15-16 (sélectionnable)
- Marchand 17-20 (sélectionnable)
- Milicien 21-24 (sélectionnable)

**Guerriers** (header)
- Soldat 25-30 (sélectionnable)
- Mercenaire 31-35 (sélectionnable)
- Tueur de Trolls 95-100 (sélectionnable)

**Lettrés** (header)
- Ingénieur 40-45 (sélectionnable)

**Classes absentes** : Pas de Roublards (peu de carrières naines), pas de Chaos.

### Exemple : Elfe Sylvain

**Guerriers** (header)
- Éclaireur 10-15 (sélectionnable)
- Garde forestier 16-20 (sélectionnable)

**Lettrés** (header)
- Mage 80-90 (sélectionnable)

**Courtisans** (header)
- Artiste 5-14 (sélectionnable)

**Classes limitées** : Elfes ont accès à peu de classes (exclusion culturelle).

## Affichage et interaction

### État initial

**Toutes carrières désactivées** : Headers visibles, carrières grisées (classe CSS `disabled`).

**Boutons actifs** : Seuls "Lancer" (génération aléatoire) et "Choisir" (sélection manuelle) cliquables.

### Après génération aléatoire

**Carrières proposées activées** : Système déverrouille uniquement les carrières tirées (3 max).

**Autres restent grisées** : Joueur ne peut choisir que parmi les propositions.

### Après clic "Choisir"

**Toutes carrières activées** : Suppression classe `disabled` sur tous items `listchild2`.

**Sélection libre** : Joueur peut cliquer n'importe quelle carrière compatible espèce.

## Calcul des seuils affichés

### Format affiché

Chaque carrière montre son **range de tirage** : `"Label Min-Max"` ou `"Label Min"` (si min = max).

**Exemples** :
- Agitateur 1 (seuil 1, aucun précédent)
- Artisan 2-3 (range entre seuil précédent 2 et seuil actuel 3)
- Marchand 17-20 (range 17 à 20)

### Algorithme

**Variables** :
- `previousRand` : Seuil de la carrière précédente + 1
- `previousPreviousRand` : Seuil de l'avant-dernière carrière + 1

**Calcul min/max** :
- `min` = `rand[espèce] >= previousRand ? previousRand : previousPreviousRand`
- `max` = `min !== rand[espèce] ? '-' + rand[espèce] : ''`

**Raison** : Gestion carrières même seuil (affichage min sans max si identiques).

## Regroupement dynamique

### Principe

Seules les classes **contenant au moins une carrière accessible** sont affichées.

**Exemple Ogre** :
- Guerriers (Mercenaire, Boucher)
- PAS de Lettrés (aucune carrière accessible)
- PAS de Courtisans (exclus culturellement)

### Ordre d'apparition

Les classes apparaissent dans l'ordre du fichier `careers.json`, pas alphabétique.

**Ordre type** : Citadins, Courtisans, Guerriers, Itinérants, Lettrés, Riverains, Roublards, Ruraux.

## Mode libre et cas particuliers

### Mode libre (MJ)

**Toutes classes affichées** : Même celles normalement interdites (Chaos inclus).

**Tous items activés** : Ignore `rand`, permet sélection Nain Sorcier, Elfe Mendiant, etc.

### Filtrage régional combiné

**Intersection filtres** : Carrières doivent avoir `rand[espèce]` ET `rand[région]` numériques.

**Impact affichage** : Certaines classes peuvent disparaître si aucune carrière ne passe les deux filtres.

**Exemple** : Nain de Nordland peut avoir moins de classes affichées qu'un Nain sans région.

## Interactions avec génération aléatoire

### Tirage et activation

**Tirage 1** : Génère 1 carrière. Système scroll jusqu'à sa classe, active uniquement cette carrière.

**Tirage 2** : Génère 2 carrières supplémentaires. Active les 3 carrières (peuvent être dans classes différentes).

**Animation** : Carrière générée clignote en orange (`backgroundColor: #F39814`) puis revient normale.

### Scroll automatique

Lors de la génération, système scroll jusqu'au **header de classe** de la carrière générée.

**Fonction** : `Helper.scrollToElement($el.prevAll('.listchild1').first(), ...)`

**Raison** : Joueur voit immédiatement la classe sociale de la carrière proposée.

## Références croisées

- [careers.md](../../database/careers.md) - Table carrières
- [classes.md](../../database/classes.md) - Table classes
- [career-selection.md](./career-selection.md) - Sélection carrière globale
- [career-random.md](./career-random.md) - Génération aléatoire
