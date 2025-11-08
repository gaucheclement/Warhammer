# Export JSON Standard

## Contexte

Export personnage format JSON interne application (non-Foundry). Sauvegarde locale, backup, partage entre utilisateurs app, ou migration versions futures.

## Différence vs Foundry Export

**Foundry Export** : Transformation vers format spécifique Foundry VTT (mapping, structure Actor)
**JSON Export** : Sérialisation directe objet Character application (format natif)

**Avantage JSON Standard** : Pas de perte information, réimport exact, plus simple

## Format Export

### Structure

```
{
  character: { ... },
  version: "1.0",
  exportDate: "2025-01-15T10:30:00Z",
  metadata: {
    application: "Warhammer Character Generator",
    format: "Standard JSON"
  }
}
```

**Racine** : Objet wrapper avec metadata
**character** : Objet complet sérialisé via character.save(null)

### Options Export

**Export Complet** (avec champ `data`) :
- Inclut data référence complet (species.data, skills.data, etc.)
- Fichier volumineux (~50-100 KB)
- Réimport sans lookup tables nécessaire

**Export Léger** (sans champ `data`) :
- Seulement IDs et valeurs personnage
- Fichier compact (~5-10 KB)
- Réimport nécessite tables référence (comme sheets-load)

**V1** : Export complet commenté, pas implémenté

## Process Export

1. **Sérialisation** : `character.save(null)` (null = pas incrémentation stepIndex)
2. **Wrapper** : Création objet racine avec metadata
3. **Formatage** : `JSON.stringify(data, null, 2)` (pretty-print indentation 2 espaces)
4. **Blob** : `new Blob([json], {type: "application/json"})`
5. **Téléchargement** : Création lien `<a download="character.json">` + click()

## Nom Fichier

**Format** : `{nom}_{espece}_{carriere}.json`
**Exemple** : `Franz-Gruber_Humain_Agitateur.json`
**Fallback** : `character_{timestamp}.json` (si nom vide)
**Normalisation** : Remplacement espaces par tirets, suppression caractères spéciaux

## Cas d'Usage

**Backup local** : Sauvegarde personnelle hors cloud Google Sheets
**Partage** : Envoi personnage MJ/joueurs (email, Discord, etc.)
**Version control** : Historique Git personnages campagne
**Migration** : Import dans V2 future application
**Analyse** : Scripts externes parsing stats, génération rapports

## Exemples Concrets

### Export Personnage Complet

**Déclencheur** : Bouton "Exporter JSON" Resume
**Données** : Personnage stepIndex -1 (validé)
**Fichier** : `Johann-Schmidt_Humain_Agitateur.json` (78 KB)
**Contenu** : JSON formatté, lisible, réimportable exactement

### Export Personnage Intermédiaire

**Déclencheur** : Export pendant création (step Characteristics)
**Données** : stepIndex 2, seulement specie/career/characteristics
**Fichier** : `character_2025-01-15_10-30.json`
**Utilité** : Backup intermédiaire, reprendre autre machine

## Validation

**JSON valide** : Parsable JSON.parse sans erreur
**Champs requis** : stepIndex présent
**Cohérence** : stepIndex >= 0 implique specie présent

## Voir Aussi

- [json-import.md](./json-import.md) - Import JSON standard
- [foundry-overview.md](./foundry-overview.md) - Export Foundry (alternatif)
- [../save-load/json-export.md](../save-load/json-export.md) - Documentation sauvegarde détaillée
