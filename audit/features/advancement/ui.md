# Advancement - Interface Dépense XP

## Contexte

L'interface de dépense XP permet aux joueurs d'améliorer leur personnage en achetant des avances. Elle est accessible en mode création (wizard step Experience) et post-création (menu advancement).

## Organisation Interface

### Mode Création (One Side)

**Panneau gauche uniquement:**
- Description système XP (texte règles)
- Budget XP affiché en haut
- 3 sections: Caractéristiques, Talents, Compétences
- Boutons [Aléatoire], [Annuler], [Valider]

**Panneau droit:**
- Description aide contextuelle (au clic élément)

### Mode Post-Création (Two Side)

**Panneau gauche (Dans carrière):**
- Budget XP affiché
- Caractéristiques dans carrière
- Talents dans carrière
- Compétences dans carrière

**Panneau droit (Hors carrière):**
- Caractéristiques hors carrière (coût ×2)
- Compétences Basic hors carrière (coût ×2)

**Boutons:**
- [Carrière] (changement carrière)
- [Annuler], [Valider]

## Affichage Budget XP

**Format:** `[150] Points d'Expérience à dépenser`

**Mise à jour:** Temps réel après chaque clic +/-

**Couleurs (V2):**
- Vert: XP > 0
- Orange: XP = 0
- Rouge: XP < 0 (post-création uniquement)

## Sélection Amélioration

### Tableaux par Catégorie

Chaque catégorie affiche un tableau avec colonnes:

**Caractéristiques:**
| Nom | Base | Aug | Coût | Total | [+] [-] |

**Compétences:**
| Nom | Base | Aug | Coût | Total | [+] [-] |

**Talents:**
| Nom | Rang | Coût | [+] [-] |

### Boutons +/-

**Bouton [+]:**
- Ajoute +1 avance/rang
- Recalcule coût
- Met à jour affichage
- Désactivé si budget insuffisant (création) ou limite atteinte

**Bouton [-]:**
- Retire -1 avance/rang
- Rembourse XP
- Met à jour affichage
- Désactivé si avances = 0

## Affichage Coût

### Coût Prochain Achat

La colonne "Coût" affiche le **coût de la prochaine avance**:

**Exemple Charme (avances actuelles: +3):**
- Colonne Coût: **10** (coût pour passer de +3 à +4, palier 1-5)

**Couleur:** Jaune (yellow) pour visibilité

### Multiplicateur Hors Carrière

**Hors carrière (panneau droit):**
- Coût affiché = coût de base **× 2**
- Label section: "hors carrière (coût x2):"

**Exemple End hors carrière (+0):**
- Coût affiché: **50** (25 × 2)

## Confirmation Achat

### Immédiat (V1)

**V1:** Pas de confirmation, achat immédiat au clic [+]

**Avantages:** Rapidité, fluidité
**Inconvénients:** Erreurs possibles (clics accidentels)

### Avec Confirmation (V2 Option)

**V2:** Popup confirmation pour achats > 100 XP

**Message:** "Acheter +1 Sociabilité pour 150 XP?"
**Boutons:** [Confirmer] [Annuler]

## Mise à Jour Personnage

### Temps Réel

**Chaque clic +/-:**
1. Mise à jour tmpadvance élément
2. Recalcul XP dépensé (refreshXP)
3. Mise à jour affichage budget
4. Mise à jour affichage coûts prochaines avances
5. Mise à jour état boutons (+/- activés/désactivés)

**Impact:** Personnage **temporaire** en mémoire (character.clone())

### Validation Finale

**Clic [Valider]:**
1. Consolidation tmpadvance → avances permanentes
2. Mise à jour character.xp.used
3. Réinitialisation tmpadvance à 0
4. Sauvegarde personnage
5. Fermeture step/modal

**Annulation totale:**
- Clic [Annuler]: Retour état initial (character original sans tmpadvance)

## Aide Contextuelle

### Affichage Description

**Mode création:**
- Clic sur ligne → Affichage description dans panneau droit
- Format: Helper.getHelpFormat(element)

**Mode post-création:**
- Clic sur ligne → Popup modale avec description complète
- Helper.showPopin(description)

**Contenu:**
- Nom élément
- Description complète (HTML)
- Effets (pour talents)
- Tests associés (pour compétences)

## Spécialisations

### Spécialisations et Aléatoire

**Popup spécialisation:** Clic [+] sur élément groupé sans spec → Liste choix obligatoire
**Talents magiques:** Popup sélection sorts (Béni/Invocation/Arcanes)
**Bouton Aléatoire (création):** Dépense automatique tout budget XP, répartition aléatoire, respect limites

## Validation

### Contraintes UI

1. **Budget affiché** toujours synchronisé
2. **Boutons +/-** activés/désactivés selon contraintes
3. **Coûts affichés** corrects (paliers, ×2)
4. **Spécialisations** demandées si requises
5. **Aide contextuelle** fonctionnelle

### Messages Erreur (V2)

**V1:** Blocages silencieux (boutons désactivés)
**V2:** Tooltips et messages explicites

## Relations

### Fichiers Liés

- [xp-budget.md](./xp-budget.md) - Budget XP
- [xp-log.md](./xp-log.md) - Historique
- [validation.md](./validation.md) - Validation achats
- [cost-characteristics.md](./cost-characteristics.md) - Coûts caractéristiques
- [cost-skills-basic.md](./cost-skills-basic.md) - Coûts compétences
- [cost-talents.md](./cost-talents.md) - Coûts talents
