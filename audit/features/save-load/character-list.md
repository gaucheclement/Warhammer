# Save/Load - Liste Personnages

## Contexte

Gestion d'une liste de personnages sauvegardés permettant visualisation, chargement, suppression. Interface centralisée pour gérer tous les personnages d'un joueur stockés dans Google Sheets ou exports locaux.

## Source des Données

### Liste depuis Google Sheets

**Feuille Save** : Colonnes A:B
- Colonne A : Liste des saveName (tous les codes)
- Colonne B : JSON personnages complets

**Extraction métadonnées** :
- Parse JSON de chaque ligne
- Extraction : nom, espèce, carrière, niveau, stepIndex, xp
- Construction liste affichable sans chargement complet

**Performance** :
- Lecture batch complète feuille Save
- Parsing minimal (metadata uniquement, pas reconstruction complète)
- Tri/filtrage côté client

### Liste depuis LocalStorage (Alternative)

**V1 commenté** : Système LocalStorage prévu mais non utilisé
**Structure** : `{ saveName: character, ... }` (object clé-valeur)
**Avantage** : Accès instantané, pas de requête réseau
**Inconvénient** : Stockage limité (~5-10 MB), pas de sync multi-device

## Affichage Liste

### Informations Affichées par Personnage

**Colonnes principales** :
- Nom (ou "Sans nom" si vide)
- Espèce (Humain, Nain, Elfe, etc.)
- Carrière (Agitateur, Artisan, etc.)
- Niveau carrière (1-4)
- Statut (En création, Validé)
- Date dernière modification (si disponible)

**Indicateurs visuels** :
- stepIndex -1 : Badge "Validé" (vert)
- stepIndex 0-9 : Badge "En création" + étape actuelle (orange)
- XP : Affichage "150/200 XP"

**Tri** :
- Par défaut : Date modification (plus récent en premier)
- Options : Nom alphabétique, Espèce, Carrière, XP

**Filtrage** :
- Par espèce (Humain, Nain, etc.)
- Par statut (En création, Validé)
- Par carrière
- Recherche textuelle (nom)

## Actions Disponibles

### Charger Personnage

**Déclencheur** : Click sur ligne ou bouton "Charger"
**Action** : Appel `load(saveName)` → `character.load(data)` → Wizard stepIndex
**Résultat** : Ouverture wizard à l'étape sauvegardée

### Supprimer Personnage

**Déclencheur** : Bouton "Supprimer" (icône poubelle)
**Confirmation** : Dialogue "Êtes-vous sûr ?" avec nom personnage
**Action** : Suppression ligne dans feuille Save (shift rows)
**Résultat** : Rafraîchissement liste, personnage disparu

**Gestion Google Sheets** :
- Recherche ligne par saveName
- `deleteRow(rowIndex)`
- Pas de récupération possible (suppression définitive)

### Dupliquer Personnage

**Déclencheur** : Bouton "Dupliquer"
**Action** :
1. Chargement personnage
2. Génération nouveau saveName
3. Sauvegarde avec nouveau code
4. Ajout liste

**Utilité** : Créer variante, backup avant modification

### Export Batch

**Déclencheur** : Sélection multiple + bouton "Exporter sélection"
**Action** : Téléchargement ZIP contenant tous JSON
**Format** : `characters_export_{date}.zip`

## Gestion Vide

**Liste vide** :
- Message : "Aucun personnage sauvegardé"
- Bouton : "Créer nouveau personnage" → Wizard step 0
- Suggestion : "Importez un personnage existant"

## Synchronisation

**Rafraîchissement** :
- Automatique au chargement page
- Manuel : Bouton "Actualiser" (⟳)
- Après chaque modification (save/delete/duplicate)

**Optimisation** :
- Cache liste côté client (évite reload constant)
- Invalidation cache après action modifiant données
- Loader pendant chargement

## Cas d'Usage

**Gestion multi-personnages** : Joueur avec plusieurs PJs (campagne, one-shots)
**Sélection rapide** : MJ charge PNJs pré-créés
**Nettoyage** : Suppression brouillons, personnages test
**Archivage** : Export batch saison terminée

## Exemples Concrets

### Exemple 1 : Liste 5 Personnages

**Affichage** :
```
| Nom           | Espèce | Carrière    | Niveau | Statut      | XP      |
|---------------|--------|-------------|--------|-------------|---------|
| Franz Gruber  | Humain | Agitateur   | 1      | Validé      | 150/200 |
| Thorin        | Nain   | Artisan     | 2      | Validé      | 250/300 |
| Sans nom      | Elfe   | Érudit      | 1      | En création | 0/175   |
| Gunther       | Humain | Guerrier    | 3      | Validé      | 450/500 |
| Test          | Halfling | Voleur   | 1      | En création | 50/180  |
```

**Actions** : Click "Franz Gruber" → Wizard Resume (stepIndex -1)

### Exemple 2 : Suppression Personnage Test

**Action** : Click poubelle sur "Test"
**Confirmation** : "Supprimer définitivement 'Test' (Halfling Voleur) ?"
**Résultat** : Ligne supprimée feuille Save, liste rafraîchie (4 personnages)

### Exemple 3 : Filtrage par Espèce

**Action** : Sélection filtre "Nain"
**Résultat** : Affichage "Thorin" uniquement (1/5 personnages)
**Reset** : Click "Tous" → Affichage complet

### Exemple 4 : Export Batch

**Action** : Sélection Franz + Thorin + Gunther → "Exporter sélection"
**Résultat** : Téléchargement `characters_export_2025-11-08.zip` (3 fichiers JSON)

## Pagination

**Si > 20 personnages** :
- Pagination 20 par page
- Navigation : « Précédent | 1 2 3 | Suivant »
- Affichage : "Personnages 1-20 sur 47"

## Voir Aussi

- [sheets-save.md](./sheets-save.md) - Sauvegarde personnages
- [sheets-load.md](./sheets-load.md) - Chargement personnages
- [json-export.md](./json-export.md) - Export JSON
