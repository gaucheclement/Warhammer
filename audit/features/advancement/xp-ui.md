# Advancement - Interface dépense XP

## Vue d'ensemble

Interface dépense XP pour améliorer personnage. Accessible création (wizard) et post-création (advancement).

## Organisation

Mode création one side : Panneau gauche (Budget XP, 3 sections Caractéristiques/Talents/Compétences, Boutons), Panneau droit (Aide contextuelle).

Mode post-création two side : Panneau gauche (Dans carrière), Panneau droit (Hors carrière coût ×2), Boutons [Carrière]/[Annuler]/[Valider].

## Budget XP

Format : [150] Points d'Expérience à dépenser.

Mise à jour : Temps réel après chaque clic +/-.

Couleurs : Vert XP > 0, Orange XP = 0, Rouge XP < 0 (post-création uniquement).

## Sélection amélioration

Tableaux par catégorie avec colonnes :
- Caractéristiques : Nom | Base | Aug | Coût | Total | [+] [-]
- Compétences : Nom | Base | Aug | Coût | Total | [+] [-]
- Talents : Nom | Rang | Coût | [+] [-]

Bouton [+] : Ajoute +1, recalcule, désactivé si budget insuffisant ou limite.

Bouton [-] : Retire -1, rembourse, désactivé si avances = 0.

## Affichage coût

Coût prochain achat : Colonne "Coût" affiche coût prochaine avance, couleur jaune.

Multiplicateur hors carrière : Coût ×2 affiché panneau droit.

## Confirmation

Achat immédiat : Pas confirmation au clic [+].

## Mise à jour personnage

Temps réel : Mise à jour avances temporaires, recalcul XP, mise à jour affichage, impact temporaire mémoire.

Validation finale : Consolidation avances temporaires → permanentes, mise à jour xp.used, réinitialisation temporaires, sauvegarde.

Annulation : Clic [Annuler] retour état initial sans avances temporaires.

## Aide contextuelle

Mode création : Clic ligne → Description panneau droit.

Mode post-création : Clic ligne → Popup modale description.

Contenu : Nom, description HTML, effets, tests associés.

## Spécialisations

Popup spécialisation : Clic [+] élément groupé sans spec → Liste choix obligatoire.

Talents magiques : Popup sélection sorts après acquisition.

Compétences groupées : Popup choix spécialisation avant acquisition Advanced.

## Bouton Aléatoire

Dépense automatique tout budget, répartition aléatoire, respect limites carrière, génération cohérente.

## Limites

Blocages silencieux, pas confirmation achats coûteux, pas panneau récapitulatif temps réel, pas comparaison coûts, pas indicateur économie XP.

## Voir aussi

- [xp-budget.md](./xp-budget.md)
- [xp-log.md](./xp-log.md)
- [xp-validation.md](./xp-validation.md)
- [xp-costs.md](./xp-costs.md)
