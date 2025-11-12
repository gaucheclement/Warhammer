# Interface Dépense XP

## Objectif

Interface dépense XP permet joueurs améliorer personnage en achetant avances. Accessible mode création (wizard step Experience) et post-création (menu advancement).

## Organisation Interface

**Mode création one side**: Panneau gauche uniquement (Description système XP texte règles, Budget XP affiché en haut, 3 sections Caractéristiques/Talents/Compétences, Boutons [Aléatoire]/[Annuler]/[Valider]), Panneau droit (Description aide contextuelle au clic élément)

**Mode post-création two side**: Panneau gauche dans carrière (Budget XP affiché, Caractéristiques dans carrière, Talents dans carrière, Compétences dans carrière), Panneau droit hors carrière (Caractéristiques hors carrière coût ×2, Compétences Basic hors carrière coût ×2), Boutons ([Carrière] changement carrière, [Annuler]/[Valider])

## Affichage Budget XP

**Format**: [150] Points d'Expérience à dépenser

**Mise à jour**: Temps réel après chaque clic +/-

**Couleurs**: Vert XP > 0, Orange XP = 0, Rouge XP < 0 post-création uniquement

## Sélection Amélioration

**Tableaux par catégorie**: Chaque catégorie affiche tableau avec colonnes

**Caractéristiques**: Nom | Base | Aug | Coût | Total | [+] [-]

**Compétences**: Nom | Base | Aug | Coût | Total | [+] [-]

**Talents**: Nom | Rang | Coût | [+] [-]

**Boutons +/-**: Bouton [+] (Ajoute +1 avance/rang, Recalcule coût, Met à jour affichage, Désactivé si budget insuffisant création ou limite atteinte), Bouton [-] (Retire -1 avance/rang, Rembourse XP, Met à jour affichage, Désactivé si avances = 0)

## Affichage Coût

**Coût prochain achat**: Colonne "Coût" affiche coût prochaine avance (Exemple Charme avances actuelles +3: Colonne Coût 10 coût passer +3 → +4 palier 1-5), couleur jaune yellow pour visibilité

**Multiplicateur hors carrière**: Hors carrière panneau droit (Coût affiché = coût base × 2, Label section "hors carrière (coût x2):"), exemple End hors carrière +0 coût affiché 50 (25 × 2)

## Confirmation Achat

**Achat immédiat**: Pas confirmation au clic [+], avantages rapidité/fluidité, inconvénients erreurs possibles clics accidentels

## Mise à Jour Personnage

**Temps réel chaque clic +/-**: Mise à jour avances temporaires élément, recalcul XP dépensé refreshXP, mise à jour affichage budget, mise à jour affichage coûts prochaines avances, mise à jour état boutons +/- activés/désactivés, impact personnage temporaire en mémoire clone()

**Validation finale clic [Valider]**: Consolidation avances temporaires → avances permanentes, mise à jour xp.used, réinitialisation avances temporaires à 0, sauvegarde personnage, fermeture step/modal

**Annulation totale**: Clic [Annuler] retour état initial character original sans avances temporaires

## Aide Contextuelle

**Affichage description**: Mode création (Clic ligne → Affichage description panneau droit, Format getHelpFormat(element)), Mode post-création (Clic ligne → Popup modale description complète, showPopin(description))

**Contenu aide**: Nom élément, description complète HTML, effets pour talents, tests associés pour compétences

## Spécialisations

**Popup spécialisation**: Clic [+] élément groupé sans spec → Liste choix obligatoire (Exemple Métier: Forgeron/Cuisinier/Apothicaire/etc., Exemple Langue: Bretonnien/Eltharin/Khazalid/etc., Exemple Maîtrise: Épées/Armes hast/Armes base/etc.)

**Talents magiques**: Popup sélection sorts (Béni/Invocation/Arcanes) après acquisition talent

**Compétences groupées**: Popup choix spécialisation avant acquisition compétence Advanced groupée

## Bouton Aléatoire (Création)

**Fonctionnalités**: Dépense automatique tout budget XP, répartition aléatoire caractéristiques/compétences/talents, respect limites carrière niveau 1, respect paliers coûts, génération cohérente pas dépassement budget

**Usage**: Joueur pressé ou indécis, génération personnage rapide, respecte contraintes système

## Relations

**Fichiers liés**: xp-budget.md - Budget XP, xp-log.md - Historique dépenses, xp-validation.md - Validation achats, xp-costs.md - Coûts éléments

**Tables database**: Toutes tables database pour affichage données

## Limites et Contraintes

**Blocages silencieux**: Boutons désactivés sans message explication (voir xp-validation.md)

**Pas confirmation achats coûteux**: Pas protection contre clics accidentels talents 100-200 XP

**Pas panneau récapitulatif temps réel**: Pas vue permanente répartition XP pendant achats (uniquement budget total)

**Pas comparaison coûts**: Pas aide optimisation choix (privilégier dans carrière vs hors carrière)

**Pas indicateur visuel économie XP**: Pas affichage économie passer niveau avant acheter hors carrière
