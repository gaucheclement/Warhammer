# Table Qualities - Documentation

## Vue d'ensemble

Contient 32 qualités (traits/défauts) applicables aux équipements Warhammer Fantasy. Chaque qualité modifie comportement d'armes ou armures avec effets mécaniques spécifiques.

**Fichier**: `data/qualities.json` (23 KB)

## Structure

### Champs clés

| Champ | Type | Description | Exemples |
|-------|------|-------------|----------|
| index | Nombre | ID unique | 0-31 |
| label | Texte | Nom qualité | "Empaleuse", "Flexible" |
| type | Texte | Nature | "Atout", "Défaut" |
| subType | Texte | Application | "Arme", "Armure" |
| prefix | Texte | Valeur requise | "", "(Indice)" |
| desc | HTML | Effets mécaniques | Texte formaté |
| book/page | Texte/Nombre | Source | "LDB" p.297-300 |

### Catégories

**Atouts d'Arme** (20): Empaleuse, Précise, Rapide, Percutante, Défensive, Perforante, Pointue, Dévastatrice, Assommante, À Poudre noire, À Répétition, À Enroulement, À Explosion, Immobilisante, Incassable, Perturbante, Piège-lame, Pistolet, Protectrice, Taille

**Défauts d'Arme** (6): Dangereuse, Épuisante, Imprécise, Inoffensive, Lente, Recharge

**Atouts d'Armure** (2): Flexible, Impénétrable | **Défauts d'Armure** (4): Partielle, Points faibles, % en discretion, % en perception

### Système prefix

- **Vide** (""): qualité binaire (27 entrées)
- **"(Indice)"**: nécessite valeur numérique (5 entrées: À Répétition, À Explosion, Protectrice, Recharge)

**Règle métier**: `prefix` non vide active `canHaveSpec` = spécialisation obligatoire

**Format affichage**: `{type}s d'{subType}` (ex: "Atouts d'Arme", "Défauts d'Armure")

## Effets mécaniques

### Armes - Précision/Dégâts

| Qualité | Effet |
|---------|-------|
| Précise | +10 aux Tests |
| Pointue | +1 DR si succès |
| Défensive | +1 DR Tests opposés |
| Imprécise | -1 DR attaques |
| Percutante | +dé unités aux Dégâts |
| Dévastatrice | choix max(DR, dé unités) |
| Inoffensive | PA doublés, pas min 1 Blessure |

### Armes - Combat

**Critiques**: Empaleuse (Critique sur multiples 10 ET doubles ≤ Test) | Assommante (Tête touchée → Test Force/Résistance → Sonné)

**Initiative**: Rapide (frappe hors ordre, défense -10) | Lente (frappe dernier, défense ennemie +1 DR)

**États**: Immobilisante (État Empêtré Force attaquant) | À Poudre noire (cible rate → Test Calme +20 sinon Brisé)

**Armure**: Perforante (ignore PA non-métalliques, -1 métalliques) | Taille (endommage armure -1 PA permanent)

**Spéciaux**: Pistolet (combat rapproché) | Perturbante (recul 1m/DR) | Piège-lame (Critique défense → désarme/brise)

### Armes - Indexées

**À Répétition (Indice)**: Indice munitions auto-rechargées après tir

**À Explosion (Indice)**: tous à Indice mètres subissent DR + Dégâts + États

**Protectrice (Indice)**: Indice PA tous endroits en défense. Si ≥2, oppose projectiles

**Recharge (Indice)**: Test étendu Projectiles nécessite Indice DR cumulés

### Armures

**Protection**: Impénétrable (ignore Critiques nombres impairs) | Flexible (portée sous autre armure, PA cumulatifs)

**Vulnérabilités**: Partielle (nombre pair/Critique → ignore PA) | Points faibles (arme Empaleuse + Critique → ignore PA) | % en discretion/perception (pénalités Tests)

### Interactions exclusions

Défaut prime sur atout: Inoffensive annule Dévastatrice/Percutante | Lente annule Rapide | Imprécise annule Précise

## Relations tables

### Directes

**→ Équipements** (trappings.json): champ `quality` virgule-séparées ("Empaleuse, Rapide") ou indexées ("À Répétition (6)")

**→ États** (etats.json): Sonné, Brisé, Empêtré | **→ Compétences** (skills.json): Corps à corps, Projectiles, Calme, Guérison

**→ Caractéristiques** (characteristics.json): Force, Résistance, Calme | **→ Livres** (books.json): book + page

### Implicites

**Talents**: modifient/ajoutent qualités | **Créatures**: armes naturelles | **Domaines magie**: sorts temporaires

## Types SQL

| Champ | Type | Contraintes |
|-------|------|-------------|
| index | INTEGER | PK, NOT NULL |
| label | VARCHAR(50) | NOT NULL, UNIQUE |
| type | VARCHAR(20) | NOT NULL, CHECK IN ('Atout','Défaut') |
| subType | VARCHAR(20) | NOT NULL, CHECK IN ('Arme','Armure') |
| prefix | VARCHAR(20) | DEFAULT '' |
| desc | TEXT | NOT NULL |
| book | VARCHAR(20) | NOT NULL |
| page | INTEGER | NOT NULL |

## Validation données

### Contraintes champs

**label**: unique, non vide, max 50. Tous uniques, aucun doublon

**type**: "Atout" (26) ou "Défaut" (6) uniquement

**subType**: "Arme" (26) ou "Armure" (6) uniquement

**prefix**: "" (27) ou "(Indice)" (5). Cohérent avec qualités indexées

**desc**: HTML valide, références cohérentes (États, Compétences, Caractéristiques), min 50 caractères

**book**: "LDB" 100% | **page**: 297-300 (section Armes/Armures LDB)

### Règles intégrité

**Combinaisons type/subType**: Atout+Arme (20) | Atout+Armure (2) | Défaut+Arme (6) | Défaut+Armure (4)

**Prefix selon subType**: Armes 5/26 indexées | Armures 0/6 indexées

**Exclusions mutuelles**: vérifier Inoffensive vs Dévastatrice/Percutante, Lente vs Rapide, Imprécise vs Précise

### Messages erreur

**Label doublon**: "La qualité '{label}' existe déjà"

**Type invalide**: "Type doit être 'Atout' ou 'Défaut', reçu '{type}'"

**SubType invalide**: "SubType doit être 'Arme' ou 'Armure', reçu '{subType}'"

**Prefix malformé**: "Prefix doit être vide ou '(Indice)', reçu '{prefix}'"

**Description vide**: "Description obligatoire pour qualité '{label}'"

**Book/page manquants**: "Référence livre obligatoire (book + page)"

**Exclusion violée**: "'{label1}' incompatible avec '{label2}' sur même équipement"

## Exemples concrets

**Épée estoc** (Empaleuse + Rapide): Critiques 10/20/30/11/22/33 | frappe hors Initiative | adversaire sans Rapide -10 défense

**Gourdin** (Inoffensive + Assommante): PA doublés, pas min 1 Blessure | Tête touchée → Test Force/Résistance → Sonné

**Pistolet répétition** (À Répétition 6 + À Poudre noire): 6 munitions auto | cible ratée → Test Calme +20 sinon Brisé

**Chemise mailles** (Flexible + Impénétrable): portée sous autre armure | ignore Critiques impairs

**Écu** (Protectrice 2 + Défensive): 2 PA virtuels tous endroits | oppose projectiles | +1 DR oppositions
