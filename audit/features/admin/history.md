# Historique Modifications

## Objectif

Historique des modifications admin avec log auteur/date, comparaison versions et possibilité rollback.

## Fonctionnalités Attendues (Non Implémentées)

**Log modifications**:
- Enregistrement chaque modification (qui, quand, quoi)
- Timestamp précis
- Utilisateur admin responsable

**Historique par entrée**:
- Liste modifications pour une entrée spécifique (ex: historique talent "Strike Mighty Blow")
- Chronologie complète modifications

**Comparaison versions**:
- Diff entre version N et N-1
- Affichage champs modifiés (avant → après)
- Visuel type git diff

**Rollback**:
- Restauration version antérieure
- Annulation dernière modification
- Retour à version spécifique (date/version)

## Implémentation Actuelle

**Backup unique**: Un seul backup automatique avant modification (écrasé à chaque sauvegarde)

**Pas de log**: Aucun enregistrement auteur/date/détails

**Pas d'historique**: Impossible voir modifications passées

**Rollback limité**: Uniquement si erreur immédiate (backup auto), sinon impossible

## Données à Logger

**Par modification**:
- Timestamp (YYYY-MM-DD HH:MM:SS)
- User (email/nom admin)
- Table (species, careers, talents, etc.)
- Index/Label de l'entrée
- Type opération (CREATE, UPDATE, DELETE)
- Valeurs avant (snapshot)
- Valeurs après (snapshot)

**Stockage**: Table séparée Google Sheets "admin_history"

## Interface Historique (Proposition)

**Panneau historique**:
- Onglet "Historique" dans interface admin
- Liste modifications récentes (50 dernières)
- Filtres par table, date, utilisateur

**Détail modification**:
- Clic sur entrée historique → affichage détails
- Comparaison avant/après (diff visuel)
- Bouton "Restaurer cette version"

**Confirmation rollback**:
- Popup confirmation avant rollback
- Avertissement impact sur données actuelles

## Exemples Concrets Warhammer (Si Implémenté)

**Exemple 1: Voir historique talent**
1. Sélectionner talent "Strike Mighty Blow"
2. Cliquer "Historique"
3. Liste:
   - 2025-01-08 14:32 - Jean Dupont - UPDATE - Modifié desc
   - 2025-01-05 09:15 - Marie Martin - UPDATE - Modifié max (1 → vide)
   - 2025-01-01 10:00 - Jean Dupont - CREATE - Création initiale

**Exemple 2: Rollback modification erronée**
1. Talent "Acute Sense (Sight)" modifié par erreur
2. Ouvrir historique
3. Sélectionner version précédente (avant erreur)
4. Cliquer "Restaurer"
5. Confirmation → restauration version antérieure

**Exemple 3: Audit modifications campagne**
1. Filtrer historique par table "careers"
2. Voir toutes modifications carrières 7 derniers jours
3. Identifier qui a modifié quoi
4. Vérification cohérence modifications

## Stockage Historique

**Table admin_history (proposition)**:
```
id | timestamp | user | table | entry_index | entry_label | operation | before_json | after_json
```

**Rotation**: Conserver 6 mois historique, archivage au-delà

**Taille**: Estimation 10-50 KB par modification, ~1-5 MB/mois

## Relations avec Autres Fonctionnalités

**Dépendances**
- [save.md](./save.md) - Déclencheur log à chaque sauvegarde
- Google Apps Script - Écriture logs dans Google Sheets

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [validation.md](./validation.md) - Validation avant rollback
- Toutes tables edit-* - Modifications loggées

## Limites et Contraintes

**Non implémenté**: Fonctionnalité complètement absente actuellement

**Backup unique**: Seul mécanisme = backup auto écrasé à chaque sauvegarde

**Pas de traçabilité**: Impossible savoir qui a modifié quoi et quand

**Rollback impossible**: Pas de retour arrière sauf backup externe manuel
