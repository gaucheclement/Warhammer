# Design : Audit et Préparation à la Migration

## Contexte

Cette application Warhammer a échoué 2 migrations précédentes. Les causes :
- Claude perdait le contexte et oubliait ses propres créations
- Réinvention continue de composants déjà créés
- Surdev sur tâches simples ou tickets incomplets marqués DONE avec "Future Work"
- Manque de discipline et de référentiel métier

**Objectif** : Créer une base de connaissance (KB) métier exhaustive permettant à Claude Code de réussir une 3ème tentative de migration vers une stack à déterminer.

## Contraintes

- Pas de documentation existante (extraction pure du code)
- KB optimisée pour LLM uniquement (pas de livrables humains)
- Fichiers atomiques < 200 lignes (éviter saturation contexte)
- Analyse fonctionnelle pure : QUOI et POURQUOI, jamais COMMENT
- Aucun code technique dans la KB (éviter d'influencer la migration)
- Base de données complexe avec logique encodée (flags, relations string, etc.)

## Architecture de la Base de Connaissance

### Structure de dossiers

```
audit/
├── database/           # 1 fichier par table DB
│   ├── _index.md      # Liste tables avec résumé 1 ligne
│   └── [table].md     # Documentation métier par table
├── features/          # Fonctionnalités par domaine
│   ├── _index.md      # Liste domaines principaux
│   └── [domain]/
│       ├── _overview.md
│       └── [feature].md
└── business-rules/    # Règles transverses
    ├── _index.md
    └── [rule].md
```

### Format : Fichiers Database

Chaque `database/[table].md` :

```markdown
# [Nom table]

## Rôle métier
Ce que représente cette table dans le domaine Warhammer.

## Champs
Pour chaque champ :
- Type de donnée
- Usage métier
- Règles et contraintes
- Relations (même implicites via strings)
- Exemples de valeurs

## Relations avec autres tables
Explicites et implicites (via strings avec "et", "ou", ",")

## Patterns d'utilisation
- Combinaisons de champs requises
- Flags conditionnels
- Logique encodée

## Notes spéciales
Pièges, cas particuliers, bizarreries avec raison métier
```

### Format : Fichiers Features

**Fichier `_overview.md`** (par domaine) :
- Périmètre du domaine
- Liste des fonctionnalités (avec liens)
- Tables DB principales
- Règles métier transverses

**Fichier fonctionnalité** :
```markdown
# [Nom fonctionnalité]

## Objectif utilisateur
Ce que veut accomplir l'utilisateur

## Flux fonctionnel
Étapes en langage métier (pas implémentation)

## Règles métier
Règles spécifiques + liens vers business-rules/ si partagées

## Données manipulées
Tables et champs avec liens vers database/

## Cas particuliers
Edge cases, validations spéciales
```

### Format : Fichiers Business Rules

```markdown
# [Nom règle]

## Description
Énoncé clair en 1-2 phrases

## Contexte d'application
Fonctionnalités et tables concernées (avec liens)

## Logique détaillée
Conditions, calculs, résultats

## Exceptions
Cas où la règle change ou ne s'applique pas

## Validations
Comment vérifier le respect de la règle

## Exemples concrets
2-3 cas réels Warhammer
```

## Système de Ticketing

### Structure

```
audit/tickets/
├── _status.md              # Dashboard avancement
└── [NNN]-[titre].md        # Tickets numérotés
```

### Format ticket

```markdown
---
id: NNN
status: TODO | IN_PROGRESS | DONE
priority: HIGH | MEDIUM | LOW
domain: database | features | business-rules
dependencies: [liste IDs]
---

# [Titre]

## Objectif
Quel fichier KB créer/compléter

## Périmètre
Ce qui EST / N'EST PAS dans ce ticket

## Critères d'acceptance
- [ ] Liste vérifiable
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK
- [ ] Aucune info technique

## Fichiers à analyser
Liste fichiers source

## Livrables
Chemin exact du fichier KB

## Validation finale
Checklist avant DONE (pas de Future Work)
```

## Processus de Travail

### Phase 1 : Initialisation

1. Créer structure `audit/`
2. Créer fichiers `_index.md` et `_status.md`
3. Scanner code pour identifier :
   - Toutes tables DB
   - Tous domaines fonctionnels
4. Générer liste complète tickets (numérotés, priorisés)

### Phase 2 : Exécution

Pour chaque ticket :

1. **Prendre** : marquer IN_PROGRESS
2. **Lire** : uniquement fichiers listés
3. **Extraire** : logique métier (QUOI, pas COMMENT)
4. **Créer** : fichier KB selon template
5. **Vérifier** : tous critères cochés
6. **Marquer DONE** : seulement si 100% complet
7. **Update** : `_status.md`

### Règles absolues

- ❌ Pas de "Future Work" dans tickets DONE
- ❌ Pas de code technique dans KB
- ❌ Pas de fichier > 200 lignes
- ✅ Un ticket = un livrable précis
- ✅ Respecter dépendances
- ✅ Validation rigoureuse

## Utilisation Future (Migration)

Lors de la migration, chaque ticket dev référencera explicitement la KB :

```markdown
## Contexte métier
- Fonctionnalité : [audit/features/...]
- Règles métier : [audit/business-rules/...]
- Tables DB : [audit/database/...]

## Critères d'acceptance
- Toutes règles KB implémentées
- Toutes validations DB respectées
- Tous cas particuliers gérés
```

**Avantages** :
- Claude ne peut plus oublier (c'est dans la KB)
- Claude ne peut plus inventer (il suit la spec)
- Claude ne peut plus dupliquer (il cross-référence)
- Pas de Future Work (KB = scope complet)

## Prochaines Étapes

1. Créer structure de dossiers `audit/`
2. Scanner codebase pour inventaire complet
3. Générer tickets d'audit
4. Exécuter phase 2 (ticket par ticket)
5. Validation finale de la KB
6. Prêt pour migration
