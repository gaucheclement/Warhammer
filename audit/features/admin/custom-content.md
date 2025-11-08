# Gestion Contenu Personnalisé (Homebrew)

## Objectif

Gestion du contenu personnalisé (homebrew) créé par utilisateurs, avec distinction clair officiel vs personnalisé, partage communautaire et validation.

## Distinction Officiel vs Homebrew

**Marquage source**:
- Champ "book" indique source
- Books officiels: LDB, Middenheim, AA, ADE3, SOC, Salzemund, etc.
- Homebrew: "Homebrew", "Custom", "Community", etc.

**Affichage visuel**:
- Icône ou badge "Homebrew" sur contenu personnalisé
- Filtre affichage (officiels only, homebrew only, all)
- Tri par source

## Création Contenu Personnalisé

**Via duplication**: Dupliquer entrée officielle, modifier book → "Homebrew"

**Via création manuelle**: Créer nouvelle entrée, définir book = "Homebrew"

**Catégories**:
- Species homebrew (races personnalisées)
- Careers homebrew (carrières custom)
- Talents homebrew (nouveaux talents)
- Spells homebrew (sorts personnalisés)
- Trappings homebrew (équipement custom)

## Partage Communautaire

**Export sélectif**: Exporter uniquement contenu homebrew → homebrew_pack.json

**Import partage**: Importer pack homebrew d'autres utilisateurs

**Attribution**: Champ "author" optionnel pour créditer créateur

**Validation communautaire**: Pas de système validation intégré (manuel)

## Validation Homebrew

**Même validation que officiel**: Schémas JSON, cohérence données

**Équilibrage**: Non vérifié automatiquement (responsabilité créateur/MJ)

**Compatibilité**: Références vers contenu officiel autorisées (ex: career homebrew utilise skills officiels)

## Exemples Concrets Warhammer

**Exemple 1: Nouvelle race Skaven (homebrew)**
1. Dupliquer "Nains"
2. Label → "Skaven"
3. Book → "Homebrew"
4. Modifier desc, skills, talents pour Skaven
5. Créer refChar "Skaven" (stats différentes)
6. Valider et sauvegarder

**Exemple 2: Career "Witch Hunter Apprentice" (homebrew)**
1. Dupliquer "Witch Hunter" officiel
2. Label → "Witch Hunter Apprentice"
3. Book → "Homebrew - Community Pack"
4. Ajuster level, skills pour version junior
5. Valider et sauvegarder

**Exemple 3: Partage pack talents**
1. Créer 10 talents homebrew
2. Export sélectif → "custom_talents_pack.json"
3. Partage sur forum/discord
4. Autres utilisateurs importent le pack

## Gestion Permissions

**Admin uniquement**: Création/modification homebrew réservée aux admins

**Validation MJ**: MJ décide quel homebrew autoriser dans sa campagne

**Pas de soumission joueurs**: Joueurs ne peuvent pas créer homebrew (admin/MJ only)

## Relations avec Autres Fonctionnalités

**Dépendances**
- Toutes tables database - Homebrew suit mêmes schémas
- [pattern-book-page.md](../../patterns/pattern-book-page.md) - Marquage source

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [import-json.md](./import-json.md) - Import packs homebrew
- [export-json.md](./export-json.md) - Export packs homebrew
- [validation.md](./validation.md) - Validation homebrew

## Limites et Contraintes

**Pas de sandboxing**: Homebrew mélangé avec officiel dans mêmes tables

**Pas de versionning**: Modifications homebrew écrasent précédentes

**Pas de validation équilibrage**: Responsabilité créateur

**Pas de système rating**: Pas de notes/commentaires communautaires
