# Import Données JSON

## Objectif

Import de données JSON en mode admin pour charger contenu externe (homebrew, backups, partages communautaires) dans Google Sheets.

## Fonctionnalités

**Upload fichier**: Interface upload fichier .json local

**Validation format**: Vérification structure JSON conforme schémas

**Aperçu données**: Affichage données avant import effectif

**Modes import**:
- Remplacement complet (écrase table existante)
- Fusion (ajoute entrées, conserve existantes)
- Mise à jour (modifie entrées existantes par index/label)

## Format JSON Attendu

**Structure par table**:
```
{
  "species": [...],
  "careers": [...],
  "talents": [...],
  ...
}
```

**Structure par entrée**: Même format que données existantes Google Sheets

## Processus d'Import

**Étape 1: Upload**
- Sélection fichier .json local
- Lecture contenu fichier
- Parse JSON

**Étape 2: Validation**
- Vérification structure (champs obligatoires)
- Vérification types (number, string, etc.)
- Vérification références (si possible)
- Liste erreurs si invalide

**Étape 3: Aperçu**
- Affichage résumé (nombre entrées par table)
- Détection conflits (index/labels existants)
- Choix mode import

**Étape 4: Import**
- Backup automatique état actuel
- Écriture Google Sheets selon mode choisi
- Rechargement données

**Étape 5: Confirmation**
- Message succès avec détails (X entrées ajoutées, Y modifiées, Z ignorées)

## Gestion des Conflits

**Doublon index**:
- Mode remplacement: Écrase
- Mode fusion: Ignore nouvel import
- Mode mise à jour: Remplace si index identique

**Doublon label**:
- Alerte utilisateur
- Décision manuelle (garder existant, remplacer, renommer)

## Validation Avancée

**Références croisées**: Vérifier que refChar/refCareer/etc. existent

**Cohérence hiérarchies**: Careers parent-enfant valides

**Pas de corruption**: Préservation intégrité données existantes

## Exemples Concrets Warhammer

**Import talents homebrew**:
1. Upload fichier "custom_talents.json" contenant 5 nouveaux talents
2. Validation OK
3. Aperçu: "5 nouveaux talents détectés"
4. Mode fusion sélectionné
5. Import: Ajout des 5 talents à la table existante
6. Confirmation: "5 talents ajoutés avec succès"

**Import backup complet**:
1. Upload "warhammer_backup.json" (toutes tables)
2. Validation OK
3. Mode remplacement
4. Import: Écrasement complet de toutes tables
5. Confirmation: "142 species, 117 careers, 389 talents... importés"

## Relations avec Autres Fonctionnalités

**Dépendances**
- [validation.md](./validation.md) - Validation JSON
- [database/*.md](../../database/) - Schémas tables

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [export-json.md](./export-json.md) - Export complémentaire
- [save.md](./save.md) - Sauvegarde Google Sheets

## Limites et Contraintes

**Pas de rollback partiel**: Si erreur pendant import, rollback complet

**Pas de merge intelligent**: Fusion basique (ajoute ou ignore), pas de merge champ par champ

**Validation limitée**: Références croisées non vérifiées exhaustivement
