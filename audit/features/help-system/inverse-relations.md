# Help System - Relations inverses

## Vue d'ensemble

Le système de relations inverses permet d'afficher automatiquement quelles entités référencent une entité donnée. Chaque élément du jeu (talent, sort, compétence, etc.) peut afficher la section "Utilisé par" listant toutes les carrières, espèces, ou autres entités qui le référencent.

## Fonctionnement

### Indexation au chargement

Lors du chargement des données JSON, le système parcourt toutes les entités et enregistre les relations dans l'index global CharGen.match. Pour chaque relation texte-vers-entité détectée dans une description ou liste:

1. L'entité source (ex: Carrière "Agitateur") référence une entité cible (ex: Talent "Éloquence")
2. La relation est enregistrée dans l'index sous l'entité cible
3. L'enregistrement inclut: type de source, label de source, ID, texte original

### Structure des relations

L'index stocke pour chaque entité cible:
- **Type de l'entité cible** (talent, spell, skill, etc.)
- **Label de l'entité cible**
- **Type(s) des entités sources** qui la référencent
- **Labels des entités sources** avec métadonnées

### Relations multi-niveaux

Certaines relations incluent un niveau supplémentaire (carrières uniquement):
- Niveau 1 (rang Bronze): Talents et compétences de base
- Niveau 2 (rang Argent): Talents et compétences intermédiaires
- Niveau 3 (rang Or): Talents et compétences avancés
- Niveau 4 (rang Étain): Talents et compétences d'élite

## Exemples concrets

### Talent "Affable"

**Relations enregistrées:**
- **Espèces:** Halfling, Humain
- **Carrières niveau 1:** Artiste (ID: artiste|1, texte: "page 52")
- **Carrières niveau 2:** Charlatan (ID: charlatan|2, texte: "page 67")

### Sort "Arme aethyrique"

**Relations enregistrées:**
- **Domaine magique:** Lumière
- **Talents requis:** Magie des Arcanes (Lumière)

### Compétence "Art (Calligraphie)"

**Relations enregistrées:**
- **Carrières niveau 1:** Scribe (ID: scribe|1)
- **Carrières niveau 2:** Érudit (ID: erudit|2)

### Trapping "Hallebarde"

**Relations enregistrées:**
- **Carrières niveau 1:** Soldat (ID: soldat|1)
- **Carrières niveau 2:** Répurgateur (ID: repurgateur|2)

## Types de relations supportés

### Relations principales

| Type source | Type cible | Exemple |
|-------------|------------|---------|
| Espèce | Talent | Halfling → Affable |
| Espèce | Compétence | Elfe → Perception |
| Carrière | Talent | Agitateur → Éloquence |
| Carrière | Compétence | Agitateur → Charisme |
| Carrière | Trapping | Soldat → Hallebarde |
| Domaine magique | Sort | Lumière → Arme aethyrique |
| Talent | Sort | Magie des Arcanes → Sorts du domaine |
| Talent | Compétence | Linguistique → Langue (Classique) |

### Relations spéciales

- **Livre → Tout type:** Références bibliographiques (voir book-references.md)
- **Talent → Talent:** Talents qui débloquent d'autres talents
- **Sort → Talent:** Sorts qui nécessitent des talents spécifiques

## Affichage des relations

### Section "Utilisé par"

Pour chaque entité, les relations inverses s'affichent groupées par type:

**Format pour Espèces:**
```
Utilisé par:
• Espèces: Halfling, Humain
```

**Format pour Carrières (avec rangs):**
```
Utilisé par:
• Carrières:
  [Bronze] Artiste: page 52
  [Argent] Charlatan: page 67
```

**Format pour Domaines:**
```
Utilisé par:
• Domaine: Lumière
• Talents requis: Magie des Arcanes
```

### Liens cliquables

Tous les labels affichés dans "Utilisé par" sont des liens cliquables permettant de naviguer vers l'entité source (voir bidirectional-navigation.md).

## Règles métier

### Enregistrement des relations

1. **Texte doit être reconnu:** Le système détecte les relations uniquement si le texte correspond exactement à un label d'entité existante
2. **Pas de duplication:** Si une relation existe déjà (même source, même cible), elle n'est pas enregistrée à nouveau
3. **Texte original préservé:** Le texte exact trouvé dans la description est stocké (peut inclure modificateurs: "+5", "(Métallurgie)", etc.)

### Filtrage des relations

Lors de l'affichage:
- **Relations inactives masquées:** Éléments marqués "inactive: 1" n'apparaissent pas dans "Utilisé par"
- **Groupement par type:** Relations du même type sont regroupées ensemble
- **Tri alphabétique:** Éléments listés par ordre alphabétique au sein de chaque groupe

### Cas particuliers

**Carrières multi-niveaux:**
- Une carrière a 4 niveaux de progression
- Chaque niveau peut référencer différents talents/compétences
- L'affichage indique le niveau avec une icône de rang

**Spécialisations:**
- "Art (Calligraphie)" et "Art (Peinture)" sont considérés comme entités distinctes
- Relations enregistrées séparément pour chaque spécialisation
- Texte original inclut la spécialisation: "Art (Calligraphie)"

**Modificateurs de quantité:**
- "+5 en Agilité" enregistre relation vers Agilité avec texte "+5"
- "2× Compétence" enregistre la compétence avec texte "2×"

## Validation

### Intégrité des données

**Vérifications:**
- Toutes les relations pointent vers des entités existantes
- Labels sources correspondent à des IDs valides
- Types sources et cibles sont cohérents avec le schéma

**Erreurs détectées:**
- Console log si relation vers entité inexistante
- Relation ignorée si type incohérent

### Complétude de l'index

**Contrôles:**
- Chaque entité référencée dans une description a une entrée dans CharGen.match
- Pas d'entités orphelines (sans relations entrantes ni sortantes)
- Relations bidirectionnelles cohérentes

## Performance

### Indexation initiale

- Effectuée une seule fois au chargement de l'application
- Toutes les tables parcourues séquentiellement
- Index complet construit en mémoire

### Consultation

- Accès direct par clé: match[type][label]
- Pas de calcul à la volée lors de l'affichage
- Performances constantes quelle que soit la taille des données

## Voir aussi

- [rich-descriptions.md](./rich-descriptions.md) - Transformation texte en liens cliquables
- [bidirectional-navigation.md](./bidirectional-navigation.md) - Navigation entre entités liées
- [global-index.md](./global-index.md) - Structure complète de CharGen.match
- [book-references.md](./book-references.md) - Relations vers livres sources
