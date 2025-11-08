# Magie - Affichage sorts

## Vue d'ensemble

Affichage sorts personnage organise par lore/dieu, presente details CN/portee/duree, distingue sorts connus/disponibles.

**References** : [domains.md](domains.md), [database/spells.md](../../database/spells.md)

## Organisation affichage

### Groupement par tradition

**Arcanes** : Grouper par domaine (Feu, Cieux, Bete, etc.)
**Divine** : Grouper par type (Benedictions universelles / Miracles par dieu)
**Mineurs** : Section separee (Petty Magic)
**Autres** : Naturelle, Sorcellerie sections propres

**Exemple** :
```
SORTS MINEURS (PETTY MAGIC)
- Alerte (CN 0)
- Choc (CN 0)
- Lumiere (CN 0)

MAGIE DES ARCANES - FEU
- Arme Enflammee (CN 3)
- Boule Feu (CN 5)
- Lames Ardentes (CN 7)

BENEDICTIONS (DIVINE)
- Benediction Bataille
- Benediction Courage

MIRACLES SIGMAR
- Courroux Sigmar
- Protection Divine
```

### Tri sorts

**Par CN croissant** : CN 0 → CN 2 → CN 5 → CN 8+
**Par alphabetique** : Si meme CN
**Separer connus/disponibles** : Distinction visuelle claire

## Details sorts affiches

### Informations essentielles
- **Nom** : Label sort
- **CN** : Casting Number (sauf Divine)
- **Portee** : Contact, 6m, (FM) metres, etc.
- **Cible** : Nombre ou description
- **Duree** : Instantanee, Rounds, Heures, etc.

### Informations additionnelles
- **Type/SubType** : Tradition et domaine/dieu
- **Cout XP** : Si non appris
- **Description courte** : Resume effet principal
- **Composants** : Si requis (Naturelle) ou optionnels (Arcanes)

**Format compact** :
```
Boule Feu (CN 5)
Portee: 12m | Cible: 1 | Duree: Instantanee
Degats zone, +1 En flammes
Cout: 50 XP (carriere) / 100 XP (hors)
```

## Distinction connus/disponibles

### Sorts connus
- Affiches prominent (gras, couleur, icone)
- Details complets visibles
- Acces description complete

### Sorts disponibles
- Affiches secondaire (gris, italique)
- Resume uniquement
- Cout XP visible
- Prerequis indiques si manquants

### Sorts inaccessibles
- Masques OU affiches grises verrouillees
- Message prerequis manquants
- Exemples : Autres domaines Arcanes, Miracles autres dieux

## Filtres et recherche

### Filtres disponibles
- Par tradition (Arcanes, Divine, etc.)
- Par domaine/dieu
- Par CN (plages)
- Par appris/non-appris
- Par dans-carriere/hors-carriere

### Recherche texte
- Nom sort
- Description
- Effets

Voir [search.md](search.md) pour details.

## Informations contextuelles

### Attributs domaine
Afficher attribut domaine Arcanes avec sorts :
- Feu : "+1 En flammes automatique"
- Cieux : "Ignore PA metal, frappe 2m"
- Bete : "Peur 1 ennemis"

### Environnements favorables
- Feu : "+10 si En flammes proximite"
- Vie : "+10 rural/sauvage"

### Prerequis manquants
- Talent requis manquant : "Necessite Arcane Magic (Domaine)"
- Carriere interdite : "Interdit carriere actuelle"
- XP insuffisants : "Requis {X} XP, disponible {Y}"

## Exemples affichage

### Sorcier Feu
```
SORTS MINEURS
[X] Alerte (CN 0) - Detecte danger
[X] Choc (CN 0) - 1 Sonne contact
[ ] Lumiere (CN 0) - 30 XP

FEU (Attribut: +1 En flammes)
[X] Arme Enflammee (CN 3)
[X] Boule Feu (CN 5)
[ ] Lames Ardentes (CN 7) - 70 XP
[ ] Mur Flammes (CN 9) - 90 XP

AUTRES DOMAINES
[VERROUILLE] Bete, Cieux, Lumiere, Metal, Mort, Ombres, Vie
(Melange domaines = corruption)
```

### Pretre Sigmar
```
BENEDICTIONS (Universelles)
[X] Benediction Bataille
[X] Benediction Courage
[ ] Benediction Protection - 50 XP

MIRACLES SIGMAR
[X] Courroux Sigmar
[ ] Protection Divine - 100 XP
[ ] Guerison Miraculeuse - 100 XP

AUTRES DIEUX
[ ] Manann, Ulric, Ranald...
(Necessitent talents Invoke distincts)
```

## Regles coeur

1. Groupement par tradition/domaine/dieu
2. Tri CN croissant puis alphabetique
3. Distinction visuelle connus/disponibles/inaccessibles
4. Details CN, portee, cible, duree
5. Cout XP si non appris
6. Attributs domaine affiches
7. Prerequis manquants indiques
8. Filtres et recherche disponibles

## Relations

**Domains** → Groupement et attributs (domains.md)
**Spells** → Details sorts (database/spells.md)
**Learning** → Couts XP (learning.md)
**Search** → Filtrage et recherche (search.md)

---

**Navigation** : [domains.md](domains.md) | [search.md](search.md) | [Index Features](../README.md)
