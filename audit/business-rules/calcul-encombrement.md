# Système d'encombrement

## Vue d'ensemble

Chaque objet possède une valeur d'encombrement (poids + volume). Le total détermine la capacité de transport et les pénalités éventuelles.

## Champ enc

**Type :** Nombre (peut être 0 ou décimal)
**Unité :** Points d'encombrement abstraits
**Stockage :** Champ `enc` dans chaque entrée Trappings

**Échelle de valeurs :**
- 0 : Objets légers (calotte cuir, carreaux)
- 1-2 : Moyens (sac, arbalète)
- 3-4 : Lourds (hallebarde, pique)
- 6+ : Très lourds (baril)
- 10+ : Véhicules (charrette)

## Calcul de l'encombrement total

**Formule : Somme de tous les `enc` des trappings possédés**

Chaque objet dans `character.trappings[]` contribue sa valeur `enc` au total.

### Cas particuliers

**Encombrement 0 :**
- Ne compte pas dans le total
- Quantité illimitée possible
- Ex : munitions, bijoux

**Objets contenants (champ `carry`) :**
- Ont leur propre `enc`
- Contiennent jusqu'à `carry` points
- Le contenu compte AUSSI dans le total personnage
- Exemple : Sac (enc 1, carry 2) + 2 objets (enc 1 chacun) = Total 3

## Limites de portage

### Capacité maximale

**Limite = Bonus de Force (BF) × 10**

- BF = Force ÷ 10 (arrondi inférieur)
- Ex : Force 35 → BF 3 → Limite 30

### Seuils de pénalités

| Encombrement | État | Effets |
|--------------|------|--------|
| ≤ BF × 10 | Normal | Aucune pénalité |
| > BF × 10 | Surchargé | Mouvement réduit, malus Agilité, pas de course |
| > BF × 20 | Immobilisé | Déplacement impossible |

### Modificateurs

**Montures :**
- Cheval de selle : ~100 points (cavalier + équipement)
- Cheval de trait : 150-200 points

**Véhicules :**
- Capacité = champ `carry`
- Traction = champ `mode` (ex : "2 C" = 2 chevaux)

**Talents :**
- Peuvent augmenter limite ou réduire pénalités

**État :**
- Blessures graves : réduction capacité
- Fatigue : pénalités additionnelles

## Règles de transport

### Portage personnel

- Tout dans `trappings` compte
- Distinction "porté/rangé" : esthétique uniquement
- Arme en main ou armure portée : compte normalement
- Pas de réduction pour équipement "actif"

### Contenants

**Principe :** Organisent mais ne réduisent pas le poids réel.

Le champ `carry` indique capacité, mais :
- Sac (enc 1, carry 2) + contenu (enc 2) = Total personnage 3
- Pas de soustraction magique
- Usage : organisation, accès rapide (narratif)

## Exemples

### Guerrier (Force 35, BF 3, Limite 30)
```
Hallebarde (3) + Armure cuir complète (3) + Sac (1)
+ Provisions (1) + Corde (1) + Outre (0)
= 9 points → Normal
```

### Marchand (Force 30, BF 3, Limite 30)
```
Bâton (1) + Sac (1) + Marchandises (12) + Coffre (6)
+ Contenu coffre (5) + Livre (1)
= 26 points → Normal, proche limite
```

### Explorateur (Force 40, BF 4, Limite 40)
```
Arbalète (2) + Épée (1) + Armure cuir (2) + Sac (1)
+ Rations (2) + Corde (1) + Pied-de-biche (1) + Couverture (1)
+ Carreaux (0) + Outre (0) + Torches (0)
= 11 points → Normal, grande marge
```

### Surchargé (Force 25, BF 2, Limite 20)
```
Lance (2) + Bouclier (2) + Armure plates partielle (5) + Sac (1)
+ Provisions (2) + Baril (6) + Outils (3)
= 21 points → SURCHARGÉ (21 > 20)
Effets : Mouvement réduit, malus Agilité, pas de course
```

### Calcul avec contenants
```
Force 30 (BF 3, Limite 30)

Sac à dos : enc 1, carry 2
- Rations : enc 1
- Corde : enc 1

Baril : enc 6, carry 12
- Provisions : enc 8

Arme : enc 3

Total = 1 (sac) + 1 (rations) + 1 (corde) + 6 (baril) + 8 (provisions) + 3 (arme)
Total = 20 points → Normal

Note : Les contenants "portent" mais le poids compte quand même !
```

## Relations

**Avec Trappings :** Champs `enc` et `carry` définis dans `audit/database/trappings.md`

**Avec Characteristics :** Le Bonus de Force détermine la limite

**Avec Talents :** Peuvent modifier capacité ou pénalités
