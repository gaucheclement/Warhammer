# Magie - Validation magie

## Vue d'ensemble

Validation regles magie verifie acces domaines, prerequis talents, restrictions carrieres et coherence sorts connus.

**References** : [domains.md](domains.md), [talent-prerequisites.md](talent-prerequisites.md), [career-restrictions.md](career-restrictions.md)

## Validations prerequis

### Talents requis
- Arcanes → "Arcane Magic (Domaine)" possede
- Divine → "Bless" ou "Invoke (Dieu)" possede
- Chaos → "Chaos Magic (Dieu)" possede
- Petty → Au moins un talent magie

**Erreurs** : "Sort {nom} necessite talent {type}"

### Domaine correspond (Arcanes)
- Sort subType correspond talent domaine
- Pas melange domaines (corruption)

**Erreurs** : "Melange domaines interdit", "Sort domaine {X} inaccessible (talent {Y})"

### Dieu correspond (Divine)
- Miracle subType correspond talent Invoke

**Erreurs** : "Miracle {dieu} necessite Invoke ({dieu})"

## Validations carrieres

### Acces carriere
- Repurgateur/Soldat → Aucune magie
- Apprenti/Initie → Sorts domaine OK
- Autres → Hors carriere (cout double)

**Erreurs** : "Carriere {nom} interdit magie", "Cout double hors carriere"

### Changement carriere
- Sorts connus conserves
- Nouveaux sorts cout nouvelle carriere
- Domaine Arcanes fixe (pas changement)

## Validations coherence

### Exclusivite Arcanes
- Maximum 1 domaine Arcanes
- Verifier talent correspond

**Erreurs** : "Plusieurs domaines : {liste}", "Melange Vents = corruption"

### Multi-dieux Divine
- Verifier talent Invoke par dieu
- Benedictions universelles OK

**Erreurs** : "Miracle sans talent Invoke"

## Validations composants

### Naturelle obligatoires
- Composants requis inventaire
- Cout 5 sous cuivre ou Herboristerie

**Erreurs** : "Sort impossible sans composants"

### Sorcellerie penalites
- Sans composants → Imparfaites Mineures
- Alerter risque Corruption

**Avertissements** : "Imparfaites automatiques", "+1 Corruption/Imparfaite"

## Validations CN et progression

### CN accessible
- Debutant : CN 0-3
- Confirme : CN 4-7
- Expert : CN 8+

**Avertissements** : "CN eleve pour niveau"

### Progression coherente
- Petty avant sorts puissants recommande

**Avertissements** : "Progression atypique"

## Validations XP

### Couts corrects
- Arcanes : CN × 10 (carriere) / CN × 20 (hors)
- Divine : 50 (benedictions) / 100 (miracles)

**Erreurs** : "Cout XP incorrect : {depense} vs {attendu}"

### Budget XP
- Verifier XP disponibles
- Soustraire couts appris

**Erreurs** : "XP insuffisants : {requis} vs {disponible}"

## Messages types

**Bloquants** :
- Talent manquant
- Domaine interdit
- Carriere interdit
- XP insuffisants

**Avertissements** :
- CN eleve
- Progression atypique
- Composants manquants

**Informations** :
- Cout hors carriere
- Multi-dieux possible
- Composants optionnels

## Exemples validations

**Sorcier Feu → "Forme Bete"** :
- Validation : ECHEC (Bete ≠ Feu)
- Message : "Melange domaines interdit"
- Blocage : Inaccessible

**Erudit → Sort Feu** :
- Talent : OK
- Carriere : Hors carriere
- Message : "Cout double (CN × 20)"
- Autorisation : Accessible, cout augmente

**Repurgateur → Magie** :
- Carriere : ECHEC
- Message : "Carriere interdit magie"
- Blocage : Aucune magie

**Pretre Sigmar + Ulric** :
- Talents : "Invoke (Sigmar)" + "Invoke (Ulric)"
- Validation : OK (talents distincts)
- Acces : Miracles deux dieux + benedictions

## Regles coeur

1. Talent prerequis absolu
2. Domaine Arcanes exclusif (un seul)
3. Carriere determine acces
4. Composants Naturelle obligatoires
5. XP coherents validation
6. Multi-dieux Divine OK si talents
7. Messages clairs erreurs/avertissements

## Relations

**Domains** → Validation domaine unique (domains.md)
**Talents** → Prerequis (talent-prerequisites.md)
**Careers** → Acces carriere (career-restrictions.md)
**XP** → Couts (xp-cost.md)

---

**Navigation** : [domains.md](domains.md) | [talent-prerequisites.md](talent-prerequisites.md) | [Index Features](../README.md)
