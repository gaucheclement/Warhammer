# Character Edit - Historique XP

## Vue d'ensemble

L'historique XP (expérience) trace toutes les acquisitions et dépenses de points d'expérience du personnage. Il permet de suivre la progression, de comprendre comment les points ont été utilisés, et d'annuler des dépenses si nécessaire.

## Structure de l'XP

### Objet XP

Le personnage possède un objet `xp` avec :
- **max** : Total de points XP gagnés depuis la création
- **used** : Total de points XP dépensés
- **tmp_used** : Points XP des modifications temporaires (non validées)
- **log** : Dictionnaire des entrées d'historique

### Calculs

**XP disponible** = max - used

**XP en attente** = tmp_used (modifications temporaires)

**XP restant après validation** = max - (used + tmp_used)

## Affichage du log XP

### Format des entrées

Chaque entrée du log a un ID unique et une valeur :
- **ID positif** : Gain d'XP (ex: "Session du 15/03/2024")
- **ID négatif** : Dépense d'XP (ex: "Compétence: Commandement 0 => 5")
- **Valeur** : Nombre de points (positif pour gain, négatif pour dépense)

Exemple de log :
```
{
  "Session du 15/03/2024": 100,
  "0_Caractéristique: Capacité de Combat 10 => 15": -50,
  "1_Compétence: Commandement 0 => 5": -100,
  "Récompense quête": 50
}
```

### Tri chronologique

Les entrées sont stockées dans l'ordre d'ajout. Le préfixe numérique (ex: "0_", "1_") assure l'ordre des dépenses si le dictionnaire est parcouru.

### Affichage visuel

L'interface liste les entrées en distinguant :
- **Gains** (vert) : +100 XP - Session du 15/03/2024
- **Dépenses** (rouge) : -50 XP - Caractéristique: Capacité de Combat 10 => 15

## Ajout d'entrée XP

### Méthode `addXP(id, value, uniqueId)`

Paramètres :
- **id** : Description de l'entrée
- **value** : Montant (positif = gain, négatif = dépense)
- **uniqueId** : Si true, empêche les doublons (pour gains ponctuels)

Comportement :
- Si `value > 0` : Augmente `xp.max` (gain)
- Si `value < 0` : Augmente `xp.used` (dépense)
- Ajoute l'entrée au log avec clé : `(uniqueId ? "" : log.length + "_") + id`

### Prévention des doublons

Si `uniqueId = true` et que `this.xp.log[id]` existe déjà, l'ajout est refusé. Cela évite de compter deux fois la même récompense.

### Ajouts automatiques

Les dépenses sont ajoutées automatiquement lors de `saveAdvance()` pour chaque amélioration validée :
- Type (Compétence/Caractéristique/Talent)
- Nom avec spécialisation
- Progression (ancienne => nouvelle valeur)
- Coût

Exemple : `"Compétence: Commandement 0 => 5" : -100`

## Annulation de dépense

### Modification manuelle

L'utilisateur peut annuler une dépense en :
1. Identifiant l'entrée dans le log
2. Supprimant l'entrée du dictionnaire
3. Ajustant `xp.used` en conséquence
4. Réinitialisant les avances correspondantes sur le personnage

### Pas d'annulation automatique

Le code actuel n'implémente pas de mécanisme d'annulation automatique. C'est une opération manuelle qui nécessite de :
- Retirer l'entrée du log
- Diminuer xp.used
- Retirer les avances du composant concerné

## Statistiques XP

### Totaux

L'interface peut afficher :
- **XP total gagné** : xp.max
- **XP total dépensé** : xp.used
- **XP disponible** : max - used

### Répartition par type

En parcourant le log, on peut calculer :
- XP dépensé en caractéristiques
- XP dépensé en compétences
- XP dépensé en talents
- XP dépensé en "Modification" (ajustements divers)

### Répartition par période

Si les gains sont datés, on peut visualiser l'XP gagné par session ou par période.

## Validation des modifications temporaires

### Workflow

1. L'utilisateur modifie des avances (tmpadvance)
2. Le système calcule le coût → stocké dans `tmp_used`
3. Affichage : "Si vous validez, cela coûtera X XP"
4. Validation : `saveAdvance()` transfère tmp_used vers used et tmpadvance vers advance
5. Chaque modification génère une entrée dans le log

### Méthode `saveAdvance()`

Pour chaque élément avec tmpadvance > 0 :
1. Calcul du coût : `Helper.getXPCost(el, ancienne_valeur, nouvelle_valeur) × multiplicateur`
2. Ajout au log : `addXP(description, -cout)`
3. Transfert : `el.advance += el.tmpadvance`
4. Réinitialisation : `el.tmpadvance = 0`

Si des XP de tmp_used n'ont pas été attribués (modifications diverses), ils sont enregistrés comme "Modification".

## Exemple concret

### Scénario : Session de jeu et amélioration

**Gain XP**
Le MJ accorde 100 XP :
- `addXP("Session du 20/11/2025", 100, true)`
- xp.max : 500 → 600
- xp.used : 300 (inchangé)
- XP disponible : 300

**Modifications temporaires**
Le joueur améliore :
- Commandement : 0 → 5 (coût : 100 XP hors carrière)
- CC : 35 → 40 (coût : 50 XP en carrière)
- tmp_used = 150

**Vérification**
XP disponible après validation : 300 - 150 = 150 (acceptable)

**Validation**
`saveAdvance()` :
1. Commandement : log "Compétence: Commandement 0 => 5" : -100
2. CC : log "Caractéristique: Capacité de Combat 35 => 40" : -50
3. xp.used : 300 → 450
4. tmp_used : 0
5. XP disponible : 150

**État final du log**
```
{
  "Session du 20/11/2025": 100,
  "2_Compétence: Commandement 0 => 5": -100,
  "3_Caractéristique: Capacité de Combat 35 => 40": -50
}
```

## Relations avec autres composants

- **[Caractéristiques](./characteristics.md)** : Dépense XP pour amélioration
- **[Compétences](./skills.md)** : Dépense XP pour amélioration
- **[Talents](./talents.md)** : Dépense XP pour acquisition
- **[Validation](./validation.md)** : Vérification de disponibilité XP
