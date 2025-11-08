# Sauvegarde Modifications Admin

## Objectif

Processus de sauvegarde des modifications admin dans Google Sheets avec backup, validation et restauration interface.

## Processus de Sauvegarde

**Étape 1: Collecte données formulaire**
- `EditHelper.prepareData()` parcourt tous champs `[name]`
- Conversion structures imbriquées (arrays) en format texte
- Nettoyage valeurs (trim, remplacement caractères spéciaux ' → ')

**Étape 2: Validation**
- Voir [validation.md](./validation.md)
- Si erreur, blocage sauvegarde + affichage messages

**Étape 3: Backup automatique**
- Copie état actuel Google Sheets avant modification
- Permet rollback si erreur

**Étape 4: Écriture Google Sheets**
- `google.script.run.saveData(JSON.stringify(el))`
- Appel asynchrone Google Apps Script
- Écriture ligne correspondant à index dans sheet approprié

**Étape 5: Rechargement partiel**
- `CharacterGenerator().loadPartialDataAndDisplay(data)`
- Rechargement uniquement données modifiées (optimisation)
- Mise à jour affichage sans full reload

**Étape 6: Restauration interface**
- Retour au même onglet (tabs-X)
- Restauration position scroll
- Restauration filtre recherche
- Ré-sélection élément modifié

## Feedback Utilisateur

**Loader**: Overlay "body" avec icône chargement pendant sauvegarde

**Durée**: Généralement < 2 secondes

**Confirmation**: Retour automatique à l'élément modifié = confirmation implicite

**Pas de message explicite**: Si succès, interface se restaure silencieusement

## Gestion des Erreurs

**Erreur validation**: Blocage avant envoi, affichage erreurs

**Erreur réseau**: Timeout après 30 secondes, message erreur générique

**Erreur serveur**: Rollback automatique, état Google Sheets restauré, message erreur

**Erreur parsing**: Retour erreur JSON malformé

## Format Données Sauvegardées

**Structure JSON**:
```
{
  "typeItem": "species",
  "index": 5,
  "label": "Humains (Reiklander)",
  "book": "LDB",
  "page": 12,
  ...autres champs...
}
```

**Arrays convertis**: `[{label: "Skill1"}, {label: "Skill2"}]` → `"Skill1, Skill2"`

**Valeurs nettoyées**: Trim, ' → ', sauts ligne normalisés

## Optimisations

**Rechargement partiel**: Seule table modifiée rechargée

**Pas de full reload**: Évite rechargement complet application

**Conservation état**: Position, filtres, sélection préservés

## Exemples Concrets Warhammer

**Exemple 1: Modifier species**
1. Éditer "Humains (Reiklander)", modifier desc
2. Cliquer "Valider"
3. Loader affiché
4. Sauvegarde Google Sheets (species row index 0)
5. Rechargement table species uniquement
6. Retour à "Humains (Reiklander)" sélectionné, position conservée

**Exemple 2: Créer talent (duplication)**
1. Dupliquer "Acute Sense (Sight)"
2. Modifier label en "Acute Sense (Taste)"
3. Valider
4. Insertion nouvelle ligne dans talents sheet
5. Rechargement table talents
6. "Acute Sense (Taste)" sélectionné automatiquement

## Relations avec Autres Fonctionnalités

**Dépendances**
- [validation.md](./validation.md) - Validation pré-sauvegarde
- Google Apps Script backend - Écriture Google Sheets

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- Toutes les tables edit-* - Formulaires sources

## Limites et Contraintes

**Pas de mode brouillon**: Sauvegarde immédiate, pas d'annulation possible après

**Pas de versionning**: Pas d'historique modifications (voir [history.md](./history.md))

**Pas de détection conflits**: Si modification concurrente, dernière écrasement précédente

**Backup unique**: Un seul backup automatique, écrasé à chaque sauvegarde
