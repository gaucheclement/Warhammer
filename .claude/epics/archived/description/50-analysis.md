---
issue: 50
title: Refactoriser db-descriptions en composants Svelte
analyzed: 2025-11-02T20:27:53Z
estimated_hours: 32
parallelization_factor: 1.14
---

# Parallel Work Analysis: Issue #50

## Overview

Refactoriser complètement le système de descriptions (2152 lignes dans `db-descriptions.js`) pour remplacer la génération HTML par string concatenation par des composants Svelte natifs. Cela implique:

1. Créer des composants Svelte réutilisables de base
2. Refactoriser db-descriptions.js pour retourner des données structurées au lieu de HTML
3. Créer des composants de description spécifiques par type d'entité
4. Intégrer dans EntityDescription.svelte et supprimer `{@html}`
5. Adapter tous les tests existants

Le code actuel génère du HTML via:
- `showHelpText()` - crée des `<span class="showHelp">`
- `toHtmlList()` - crée des `<ul><li>`
- `rankToImg()` - crée des icônes HTML
- Concaténation de strings avec `desc += '<b>Label: </b>' + value`

## Parallel Streams

### Stream A: Composants de base réutilisables
**Scope**: Créer les composants Svelte fondamentaux qui remplaceront les fonctions de génération HTML

**Files**:
- `src/components/descriptions/base/EntityLink.svelte` (remplace showHelpText)
- `src/components/descriptions/base/DescriptionSection.svelte`
- `src/components/descriptions/base/DescriptionList.svelte` (remplace toHtmlList)
- `src/components/descriptions/base/RankIcon.svelte` (remplace rankToImg)
- `src/components/descriptions/base/StatTable.svelte`

**Agent Type**: frontend-specialist

**Can Start**: immediately

**Estimated Hours**: 4h

**Dependencies**: none

**Details**:
- Composants simples, bien définis, isolés
- Peuvent être développés et testés unitairement
- Props clairs: id, type, label, items, etc.
- Émettent des événements (navigate, etc.)
- Styles BEM cohérents avec le reste de l'app

### Stream B: Refactoriser db-descriptions.js
**Scope**: Transformer les fonctions de génération HTML pour retourner des objets structurés

**Files**:
- `src/lib/db-descriptions.js` (modifier ~15 fonctions generate*)

**Functions to refactor**:
- `generateCareerDescription()` (ligne ~700-900)
- `generateTalentDescription()` (ligne ~400-520)
- `generateSkillDescription()` (ligne ~539-650)
- `generateSpellDescription()`
- `generateCreatureDescription()`
- `generateTrappingDescription()`
- Et 8+ autres fonctions similaires

**Agent Type**: backend-specialist

**Can Start**: immediately

**Estimated Hours**: 12h

**Dependencies**: none

**Details**:
- Remplacer les concaténations HTML par des structures de données:
  ```javascript
  // AVANT
  return '<b>Compétences: </b><ul><li>' + items.join('</li><li>') + '</li></ul>'

  // APRÈS
  return {
    sections: [
      {
        type: 'list',
        label: 'Compétences',
        items: items.map(i => ({ id: i.id, type: 'skill', label: i.name }))
      }
    ]
  }
  ```
- Conserver la logique métier (relations, filtres, etc.)
- Ajouter JSDoc pour typage des nouvelles structures
- Ne PAS supprimer showHelpText/toHtmlList/rankToImg tant que Stream C n'est pas fini

### Stream C: Composants de description spécifiques
**Scope**: Créer un composant Svelte par type d'entité qui consomme les nouvelles structures de données

**Files**:
- `src/components/descriptions/entities/CareerDescription.svelte`
- `src/components/descriptions/entities/TalentDescription.svelte`
- `src/components/descriptions/entities/SkillDescription.svelte`
- `src/components/descriptions/entities/SpellDescription.svelte`
- `src/components/descriptions/entities/CreatureDescription.svelte`
- `src/components/descriptions/entities/TrappingDescription.svelte`
- Et 2-3 autres selon les types d'entités

**Agent Type**: fullstack-specialist

**Can Start**: after Streams A AND B complete

**Estimated Hours**: 10h

**Dependencies**: Stream A (utilise EntityLink, DescriptionList, etc.), Stream B (consomme les nouvelles structures)

**Details**:
- Chaque composant :
  - Reçoit `data` (structure retournée par db-descriptions.js)
  - Utilise les composants de base de Stream A
  - Rend l'affichage spécifique au type d'entité
  - Émet événement `navigate` pour la navigation
- Tests unitaires pour chaque composant

### Stream D: Intégration et validation
**Scope**: Intégrer les nouveaux composants dans EntityDescription.svelte et adapter les tests

**Files**:
- `src/components/descriptions/DescriptionRenderer.svelte` (nouveau routeur de composants)
- `src/components/EntityDescription.svelte` (supprimer {@html}, utiliser DescriptionRenderer)
- `src/lib/db-descriptions.test.js` (adapter pour nouvelles structures)
- Potentiellement d'autres composants utilisant les descriptions

**Agent Type**: fullstack-specialist

**Can Start**: after Stream C completes

**Estimated Hours**: 6h

**Dependencies**: Stream C (tous les composants doivent être prêts)

**Details**:
- Créer DescriptionRenderer qui route vers le bon composant:
  ```svelte
  {#if entityType === 'talent'}
    <TalentDescription {data} on:navigate />
  {:else if entityType === 'skill'}
    <SkillDescription {data} on:navigate />
  ...
  ```
- Dans EntityDescription.svelte:
  - Remplacer `{@html currentTabContent}` par `<DescriptionRenderer {entityType} {data} on:navigate />`
  - Supprimer handleCrossReferenceClick (délégué aux composants)
- Supprimer les anciennes fonctions HTML (showHelpText, toHtmlList, rankToImg) de db-descriptions.js
- Adapter db-descriptions.test.js pour tester les nouvelles structures (pas le HTML)
- Test manuel complet de tous les types d'entités
- Vérifier que 100% des tests passent

## Coordination Points

### Shared Files
- `src/lib/db-descriptions.js` - Stream B modifie, Stream D nettoie
- `src/components/EntityDescription.svelte` - Stream D modifie
- Tests - Stream D adapte après que A, B, C soient terminés

### Sequential Requirements
1. **Streams A et B peuvent démarrer en parallèle** (aucune dépendance)
2. **Stream C démarre quand A ET B sont complétés** (besoin des composants de base + nouvelles structures)
3. **Stream D démarre quand C est complété** (besoin de tous les composants spécifiques)

### Communication Entre Streams
- Stream A doit définir l'interface des composants de base (props, events) tôt
- Stream B doit définir le format des structures de données retournées tôt
- Stream C utilise les deux interfaces définies par A et B
- Document de spécification partagé pour les interfaces

## Conflict Risk Assessment
- **Low Risk**: Streams A et B travaillent sur des fichiers complètement différents
- **Low Risk**: Stream C crée uniquement de nouveaux fichiers
- **Medium Risk**: Stream D modifie EntityDescription.svelte et db-descriptions.js (nettoyage final)
  - Mitigation: Stream D est séquentiel, attend que tout soit prêt

## Parallelization Strategy

**Recommended Approach**: hybrid

**Phase 1 - Parallel** (12h wall time):
- Lancer Stream A et Stream B simultanément
- Stream A termine en 4h, Stream B en 12h
- Temps mural: 12h

**Phase 2 - Sequential** (10h wall time):
- Stream C démarre quand A et B sont terminés
- Temps mural: 10h

**Phase 3 - Sequential** (6h wall time):
- Stream D démarre quand C est terminé
- Temps mural: 6h

## Expected Timeline

**With parallel execution**:
- Wall time: 12h + 10h + 6h = **28 hours**
- Total work: 4h + 12h + 10h + 6h = 32 hours
- Efficiency gain: 12.5%

**Without parallel execution**:
- Wall time: 4h + 12h + 10h + 6h = **32 hours**

**Parallelization factor**: 1.14x (32/28)

## Notes

### Risques Identifiés
1. **Changement de structure de données**: Les structures retournées par db-descriptions.js changent complètement
   - Mitigation: Tests exhaustifs à chaque étape

2. **Régression fonctionnelle**: Risque de perdre des features subtiles
   - Mitigation: Tests manuels complets de chaque type d'entité

3. **Effort sous-estimé**: 2152 lignes de code complexe à refactoriser
   - Mitigation: Découpage en phases, validation incrémentale

### Points d'Attention
- L'application doit rester en français (labels, messages)
- Conserver toutes les features existantes (navigation, onglets, cache, etc.)
- Les performances ne doivent pas régresser
- Les tests doivent passer à 100% avant de considérer l'issue comme terminée

### Définition de "Terminé"
- [ ] Tous les composants de base créés (Stream A)
- [ ] db-descriptions.js retourne données structurées (Stream B)
- [ ] Tous les types d'entités ont leur composant Svelte (Stream C)
- [ ] EntityDescription.svelte n'utilise plus `{@html}` (Stream D)
- [ ] Anciennes fonctions HTML supprimées de db-descriptions.js (Stream D)
- [ ] Tests adaptés et passent à 100% (Stream D)
- [ ] Test manuel complet validé (Stream D)
- [ ] Pas de régression de performance (Stream D)
- [ ] Documentation mise à jour si nécessaire (Stream D)

Next: Start work with `/pm:issue-start 50`
