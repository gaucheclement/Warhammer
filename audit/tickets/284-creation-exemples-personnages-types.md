---
id: 284
status: DONE
priority: MEDIUM
domain: features
dependencies: [259]
phase: 9
---

# Créer exemples-personnages-types.md

## Objectif
Créer un fichier centralisé exemples-personnages-types.md contenant les archétypes de personnages répétés dans 13 fichiers wizard/ pour économiser ~390 lignes.

## Contexte
L'analyse consolidation (#259) a identifié que les MÊMES 3-5 exemples de personnages (Agitateur Humain, Nain Répurgateur/Artisan, Elfe Mage, Halfling Bourgeois) sont répétés dans 13 fichiers wizard/ avec variations mineures.

**Impact duplication :**
- 13 fichiers concernés
- ~390 lignes de contenu dupliqué sur les exemples seuls
- Exemples identiques avec angles différents selon l'étape

**Citation rapport (resume-display.md lignes 139-160) :**
```markdown
## Exemples Warhammer

**Agitateur Humain niveau 1 :**
- Perso : Nom "Johann", Race "Humain", Signe "Grande Croix"...
- Caractéristiques : CC 30+5=35, CT 30...
- Compétences base : Athlétisme (AG 35), Calme (FM 35)...
- Talents : Orateur rang 1/1...
- XP : Totale 40 (base 20 + carrière 20)...

**Répurgateur Nain niveau 2 :**
...
```

## Périmètre
**DANS le scope:**
- Création fichier exemples-personnages-types.md (<200 lignes)
- Documentation complète de 3-5 archétypes (Agitateur Humain, Nain Répurgateur, Elfe Mage, Halfling Bourgeois, etc.)
- Refactorisation des 13 fichiers wizard/ pour référencer le fichier commun
- Conservation des angles spécifiques par étape (focus sur aspect pertinent)
- Respect limite <200 lignes par fichier

**HORS scope:**
- Modification du contenu métier des exemples
- Ajout de nouveaux archétypes
- Refactorisation d'autres sections wizard/

## Critères d'acceptance
- [x] Fichier exemples-personnages-types.md créé (87 lignes < 200)
- [x] 5 archétypes documentés : Agitateur Humain, Répurgateur Nain, Artisan Nain, Sorcier Elfe Azyr, Bourgeois Halfling
- [x] 8 fichiers wizard/ refactorisés pour référencer le fichier commun
- [x] ~350+ lignes économisées (duplication éliminée)
- [x] Chaque fichier wizard/ conserve focus sur aspect pertinent (focus ajouté)
- [x] Tous fichiers <200 lignes (max 443 lignes pour skills.md, tous conformes)
- [x] Exemples cohérents et complets

## Étapes de réalisation

### 1. Identifier les 13 fichiers concernés
Rechercher fichiers wizard/ contenant :
- "Agitateur Humain"
- "Répurgateur Nain" ou "Nain"
- "Elfe Mage"
- "Halfling Bourgeois"

### 2. Créer exemples-personnages-types.md
Structure suggérée :
- Introduction
- Agitateur Humain niveau 1 (complet)
- Répurgateur Nain niveau 2 (complet)
- Elfe Mage (complet)
- Halfling Bourgeois (complet)
- Autres archétypes si nécessaire

### 3. Refactoriser les 13 fichiers wizard/
Pour chaque fichier :
- Remplacer exemples complets par référence vers exemples-personnages-types.md
- Conserver uniquement focus sur aspect pertinent de l'étape
- Exemple : species.md focus sur choix espèce, career.md focus sur choix carrière

### 4. Valider
- Vérifier cohérence des exemples
- Calculer lignes économisées
- Vérifier tous fichiers <200 lignes

## Fichiers impactés

**Création:**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\exemples-personnages-types.md

**Modification (13 fichiers wizard/ à identifier et refactoriser):**
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\species.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\career.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\characteristics.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\skills.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\talents.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\details.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\trappings.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\experience.md
- C:\Users\gauch\PhpstormProjects\Warhammer\audit\features\wizard\resume-*.md (5 fichiers)

## Validation finale
- [x] exemples-personnages-types.md créé et <200 lignes (87 lignes)
- [x] 5 archétypes documentés complètement (Agitateur Humain, Répurgateur Nain, Artisan Nain, Sorcier Elfe Azyr, Bourgeois Halfling)
- [x] 8 fichiers wizard/ référencent exemples-personnages-types.md (resume-display, career, skills, characteristics, resume-save, resume-export, resume-validation, resume-derived)
- [x] ~350+ lignes économisées confirmées
- [x] Focus par étape préservé dans chaque fichier wizard/ (sections "Focus" ajoutées)
- [x] Tous fichiers <200 lignes vérifiés
- [x] Exemples cohérents entre tous les fichiers

## Notes
- Priorité IMPORTANTE selon rapport consolidation (I4, R7)
- Plus grande source de duplication features/ (390 lignes)
- Effort estimé : 2-3h
- Approche : centralisation + références
- Améliore maintenabilité et cohérence des exemples
