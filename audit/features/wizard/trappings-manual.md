# Wizard Trappings - Ajout manuel

## Vue d'ensemble

Au-delà de l'équipement de départ fourni par classe et carrière, le joueur peut ajouter manuellement des objets supplémentaires. Cette fonctionnalité permet de personnaliser l'inventaire initial selon l'historique du personnage.

**Note :** Fonctionnalité non implémentée dans V1. Documentation basée sur besoins métier cohérents avec autres steps.

## Objectif métier

### Cas d'usage

**Richesse initiale :** Personnage fortuné ayant acheté équipement supplémentaire
**Background :** Héritage familial, butin, cadeaux
**Optimisation :** Achat stratégique d'objets utiles (cordes, lanternes, outils)
**Remplacement :** Échanger objets de départ contre alternatives meilleures

### Limites

**Budget :** Argent de départ (classe + carrière)
**Disponibilité :** Objets accessibles selon région/contexte
**Encombrement :** Limite de portage (Bonus Force × 10)

## Interface de sélection

### Panneau de recherche

**Champ recherche :** Filtrage textuel dans table Trappings
**Critères :** Label, type, subType

**Filtres additionnels :**
- Par type (Armes, Armures, Véhicules, Objets)
- Par disponibilité (Commune, Limitée, Rare)
- Par prix (≤ argent disponible)

### Liste résultats

**Affichage :** Table triable avec colonnes :
- Label
- Type/SubType
- Encombrement
- Prix
- Disponibilité

**Action :** Clic → Ajout à l'inventaire

### Détail objet

**Popup aide :** `Helper.getHelpFormat(trapp, CharGen)`

Affiche caractéristiques complètes :
- Description narrative
- Statistiques (dégâts, PA, portée)
- Qualités (Défensive, Empaleuse, etc.)
- Règles d'utilisation

## Gestion quantité

### Saisie quantité

**Champ numérique :** Entier ≥ 1
**Par défaut :** 1
**Maximum :** Limité par argent disponible et encombrement

Exemples :
- 1 Épée (objet unique)
- 10 Clous (petits objets)
- 20 Carreaux (munitions)

### Calculs automatiques

**Prix total :** Quantité × Prix unitaire
**Encombrement total :** Quantité × Enc unitaire

Mise à jour compteurs argent et encombrement en temps réel.

## Modification équipement existant

### Liste inventaire actuel

**Panneau droit :** Tous trappings (carrière + manuels)

**Distinction visuelle :**
- Carrière : Grisé, pas de suppression
- Manuels : Normal, boutons édition/suppression

### Actions disponibles

**Éditer quantité :** Modifier nombre d'exemplaires
**Supprimer :** Retrait complet (remboursement prix)
**Dupliquer :** Ajouter exemplaires supplémentaires

## Gestion budget

### Argent disponible

**Source initiale :**
- Classe : Montant fixe (ex: 2 CO, 18 SB)
- Carrière : Montant additionnel si spécifié

**Conversion :** 1 CO = 20 PA = 240 SB

**Affichage :** Solde restant en temps réel

### Validation achat

**Prérequis :** Prix total ≤ Argent disponible

**Blocage :** Bouton "Ajouter" désactivé si insuffisant

**Message erreur :** "Fonds insuffisants : il vous manque X SB"

### Remboursement

Si suppression objet manuel : Argent recrédité

## Contraintes encombrement

### Calcul limite

**Formule :** Bonus Force × 10
**Exemple :** Force 35 → BF 3 → Limite 30

Voir : [trappings-encumbrement.md](./trappings-encumbrement.md)

### Indicateur visuel

**Jauge :** Encombrement actuel / Limite max
**Couleur :**
- Vert : ≤ 70% limite
- Orange : 71-100%
- Rouge : > 100% (surchargé)

### Avertissement dépassement

**Message :** "Attention : Encombrement dépasse limite ! Pénalités : Mouvement réduit, malus Agilité"

**Autorisé :** Oui, mais avec avertissement visible

## Exemples concrets

### Guerrier (18 SB initial)
**Achats :** Corde (3 SB, enc 1) + Outre (6 SB) + Sac (9 SB, enc 1)
**Solde final :** 0 SB, +2 enc

### Érudit (2 CO = 480 SB initial)
**Achats :** 2 Livres (240 SB, enc 2) + Lanterne (30 SB, enc 1) + 2 Huiles (16 SB)
**Solde final :** 194 SB, +3 enc

### Roublard (1 CO = 240 SB initial)
**Achats :** Corde (3 SB) + Pied-de-biche (15 SB) + 10 Clous (1 SB) + Marteau (5 SB)
**Solde final :** 216 SB, +2 enc

## Règles métier

### Optionnel
L'ajout manuel n'est pas obligatoire. Le joueur peut valider avec uniquement équipement carrière.

### Budget strictement limité
Impossible de dépenser plus que l'argent initial. Pas de dette.

### Encombrement conseillé
Dépassement limite autorisé mais déconseillé (pénalités en jeu).

### Cohérence disponibilité
Objets Rares/Exotiques/Uniques : Nécessitent justification narrative ou interdits en création.

## Validation

**Prérequis pour valider step :**
- Budget ≥ 0 (pas de dette)
- Tous choix "ou" résolus (voir [trappings-choice.md](./trappings-choice.md))

**Aucune contrainte encombrement bloquante** : Validation possible même si surchargé.

## Relations

**Avec database :**
- [trappings.md](../../database/trappings.md) : Catalogue objets disponibles
- [classes.md](../../database/classes.md) : Argent initial classe

**Avec business-rules :**
- [prix-disponibilite-trappings.md](../../business-rules/prix-disponibilite-trappings.md) : Système monétaire
- [calcul-encombrement.md](../../business-rules/calcul-encombrement.md) : Limites portage

**Avec autres features wizard :**
- [trappings-career.md](./trappings-career.md) : Équipement de base
- [trappings-encumbrement.md](./trappings-encumbrance.md) : Affichage limite
- [trappings-validation.md](./trappings-validation.md) : Validation finale
