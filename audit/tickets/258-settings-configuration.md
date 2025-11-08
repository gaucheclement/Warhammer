---
id: 258
status: DONE
priority: MEDIUM
domain: features
dependencies: []
phase: 7
---

# Settings - Configuration utilisateur

## Objectif
Créer `audit/features/settings/user-preferences.md` documentant le système de configuration utilisateur global

## Périmètre
**DANS le scope:**
- Sélection livres sources actifs
- Filtrage global contenu par livre
- Préférences affichage (thème clair/sombre)
- Persistance configuration (LocalStorage)
- Règles métier filtrage
- Exemples concrets Warhammer

**HORS scope:**
- Implémentation technique Option.html
- Code UI formulaires
- Synchronisation multi-device

## Critères d'acceptance
- [ ] Fichier créé < 200 lignes
- [ ] Cross-refs OK vers books.md
- [ ] Aucune info technique (QUOI/POURQUOI, pas COMMENT)
- [ ] Exemples concrets Warhammer inclus
- [ ] Relations documentées

## Fichiers à analyser
- C:\Users\gauch\PhpstormProjects\Warhammer\Option.html
- C:\Users\gauch\PhpstormProjects\Warhammer\MainMenu.html
- C:\Users\gauch\PhpstormProjects\Warhammer\Helper.html (getStorage, setStorage)

## Livrables
`audit/features/settings/user-preferences.md`

## Validation finale
- [ ] Tous critères cochés
- [ ] Format template respecté
- [ ] Pas de Future Work
- [ ] Fichier autonome

## Règles métier filtrage livres

**Livre de base (LDB)** : Toujours actif (disabled), contenu fondamental obligatoire

**Livres additionnels** : Optionnels
- Activés → Contenu disponible dans wizard et compendium
- Désactivés → Éléments marqués "inactive", invisibles mais conservés en mémoire

**Catégories livres** :
- Livres de Règle (LDB, AA, VDLM) → Règles et mécaniques
- Cadre de campagne (ADE1, Middenheim, etc.) → Contenu régional
- Scénarios (MSR, PDTC, etc.) → Contenu spécifique aventures

**Impact filtrage** :
- Espèces → Halfling Cuisine (SOC) caché si SOC désactivé
- Carrières → Sorcier du Feu visible uniquement si VDLM activé
- Talents → Certains talents ADE1 exclus si livre désactivé

## Exemple configuration

**Joueur campagne Empire** :
- ✅ LDB (obligatoire)
- ✅ ADE1, ADE2 (campagne Empire)
- ✅ Middenheim (région jeu)
- ❌ Lustria (hors contexte)
- ❌ SOC (pas Halflings)
→ Voit uniquement contenu pertinent Empire

**Joueur campagne Lustria** :
- ✅ LDB
- ✅ Lustria
- ❌ Middenheim (hors région)
→ Voit contenu jungle, Hommes-lézards, etc.
