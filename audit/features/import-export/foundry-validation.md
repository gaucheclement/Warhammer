# Export Foundry - Validation

## Contexte

Vérifications pré-export garantissant JSON généré est valide, complet, et importable dans Foundry VTT sans erreurs.

## Validation Personnage

**Complétude** : Personnage doit être terminé (stepIndex >= 8) ou au minimum avoir specie + career + characteristics
**Cohérence** : Valeurs caractéristiques dans plages valides (0-100 généralement)
**Données requises** : Nom, espèce, carrière présents

### Checks Obligatoires

- [ ] Specie définie (character.getSpecie() not null)
- [ ] Career défini (character.getCareerLevel() not null)
- [ ] 10 caractéristiques présentes
- [ ] Nom personnage non vide (ou fallback "Unnamed Character")

## Validation Items

**Skills** : Chaque skill a characteristic valide, advances >= 0
**Talents** : Nom mappé Foundry, advances >= 1
**Trappings** : Type déterminé (weapon/armour/trapping), nom mappé
**Spells** : Lore valide, CN >= 0

### Checks Items

- [ ] Aucun item avec name vide
- [ ] Tous skills ont characteristic référençant WS/BS/S/T/I/Ag/Dex/Int/WP/Fel
- [ ] Tous items ont type valide (skill/talent/weapon/armour/spell/trapping/money)

## Validation Mapping

**Noms manquants** : Entités sans correspondance table Foundry génèrent warnings (export continue avec fallback)
**IDs invalides** : Références cassées détectées avant export

### Logs Warnings

Export génère liste warnings :
- "Talent 'X' non mappé, utilisation label FR"
- "Skill 'Y' characteristic inconnue, fallback Ag"
- "Spell 'Z' lore absent mapping, préservation FR"

## Validation JSON

**Syntaxe** : JSON.stringify doit réussir sans exception
**Taille** : Fichier < 10 MB (sécurité, performance Foundry)
**Encodage** : UTF-8 (accents français préservés)

### Tests Structure

Après génération JSON, parser et vérifier :
- JSON.parse(output) ne throw pas
- Objet a propriétés {name, type, data, items}
- items est array
- data.characteristics a 10 clés

## Messages Erreur

**Personnage incomplet** : "Personnage incomplet. Finalisez espèce, carrière et caractéristiques avant export."
**Mapping manquant** : "Attention : 3 entités non mappées (voir logs). Export poursuivi avec noms français."
**Données invalides** : "Erreur : Caractéristique Initiative valeur -10 invalide. Corrigez avant export."

### Blocage vs Warning

**Blocage** : Personnage incomplet, JSON invalide → export annulé
**Warning** : Mappings manquants, specs absentes → export continue avec fallback

## Exemples Concrets

### Export Valide (Agitateur Complet)

- Personnage stepIndex 8
- Toutes données présentes
- Tous mappings trouvés
- Résultat : Export réussit, aucun warning

### Export Warning (Talent Custom)

- Personnage complet
- Talent "Mon Talent Perso" ajouté admin (absent mapping)
- Résultat : Warning logged, export réussit, talent nom FR dans JSON

### Export Bloqué (Incomplet)

- Personnage stepIndex 2 (seulement specie + career)
- Caractéristiques non initialisées
- Résultat : Erreur "Finalisez personnage", export annulé

## Validation Post-Import Foundry

**Test recommandé** : Après export, importer dans Foundry test, vérifier :
- Actor créé sans erreur
- Caractéristiques affichées correctement
- Compétences calculées
- Équipement présent
- Sorts accessibles

## Voir Aussi

- [foundry-format.md](./foundry-format.md) - Structure JSON attendue
- [foundry-mapping.md](./foundry-mapping.md) - Tables mapping
