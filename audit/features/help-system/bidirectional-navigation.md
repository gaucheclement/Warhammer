# Help System - Navigation bidirectionnelle

## Vue d'ensemble

La navigation bidirectionnelle permet à l'utilisateur de parcourir les entités liées en suivant les liens cliquables, dans les deux sens: de la source vers la cible ET de la cible vers les sources (via "Utilisé par").

## Flux de navigation

### Navigation avant (source → cible)

**Départ:** Utilisateur consulte une fiche (ex: Carrière "Agitateur")
**Action:** Clic sur un lien dans la description (ex: talent "Éloquence")
**Résultat:** Affichage de la fiche du talent "Éloquence"

### Navigation arrière (cible → sources)

**Départ:** Utilisateur consulte une fiche (ex: Talent "Éloquence")
**Section "Utilisé par":** Liste des carrières et espèces utilisant ce talent
**Action:** Clic sur une carrière (ex: "Charlatan")
**Résultat:** Affichage de la fiche de la carrière "Charlatan"

### Navigation en cascade

L'utilisateur peut enchaîner plusieurs navigations:
1. Carrière "Agitateur" → Talent "Éloquence"
2. Talent "Éloquence" → Carrière "Charlatan" (via "Utilisé par")
3. Carrière "Charlatan" → Compétence "Charme" (via description)
4. Compétence "Charme" → Liste des carrières utilisant Charme (via "Utilisé par")

## Exemples de parcours utilisateur

### Parcours 1: Exploration d'une carrière

**Étape 1:** Utilisateur sélectionne Carrière "Agitateur"
**Affichage:** Fiche complète avec talents, compétences, trappings

**Étape 2:** Clic sur talent "Éloquence" dans la liste des talents
**Affichage:** Popup/panel avec description "Éloquence", section "Utilisé par" montrant:
- Espèces: Humain
- Carrières: Agitateur (rang 2), Charlatan (rang 1), Diplomate (rang 3)

**Étape 3:** Clic sur "Charlatan" dans "Utilisé par"
**Affichage:** Fiche Carrière "Charlatan" avec ses propres talents/compétences

**Étape 4:** Clic sur compétence "Charme" dans la liste
**Affichage:** Description "Charme", "Utilisé par" avec autres carrières

### Parcours 2: Exploration magique

**Étape 1:** Sort "Arme aethyrique"
**Affichage:** Description sort, domaine "Lumière", "Utilisé par" → Talent "Magie des Arcanes (Lumière)"

**Étape 2:** Clic sur domaine "Lumière"
**Affichage:** Liste complète des sorts du domaine, "Utilisé par" → Carrières magiques

**Étape 3:** Clic sur carrière "Sorcier"
**Affichage:** Fiche carrière avec progression, sorts par niveau

### Parcours 3: Recherche inversée

**Étape 1:** Talent "Affable"
**Section "Utilisé par":**
- Espèces: Halfling, Humain
- Carrières: Artiste (rang 1), Charlatan (rang 2)

**Étape 2:** Clic sur "Halfling"
**Affichage:** Fiche espèce avec tous talents raciaux, dont "Affable"

**Étape 3:** Depuis Halfling, clic sur autre talent racial
**Affichage:** Nouveau talent, retour possible vers Halfling via "Utilisé par"

## Mécanismes de navigation

### Liens dans descriptions

Transformation automatique des mentions d'entités en liens (voir rich-descriptions.md):
- Détection: Texte correspondant à un label d'entité
- Génération: `<span class="showHelp" data-type="X" data-id="Y">Label</span>`
- Clic: Récupération entité et affichage fiche

### Liens dans "Utilisé par"

Génération de liens pour chaque relation inverse (voir inverse-relations.md):
- Format: `<span class="showHelp" data-type="career" data-id="charlatan">Charlatan</span>`
- Groupement par type (Espèces, Carrières par rang, Domaines, etc.)
- Tous cliquables, menant vers fiche complète de la source

### Gestion du contexte

**Panel latéral (desktop):**
- Navigation met à jour le panel sans fermer l'écran principal
- Utilisateur garde contexte visuel de la page de départ
- Peut revenir facilement au point de départ

**Modal popup (mobile):**
- Chaque navigation ouvre nouvelle popup
- Popup précédente masquée mais mémorisée
- Retour arrière ferme popup actuelle, révèle précédente

## Affichage du contexte

### Indicateurs visuels

**Lien actif:**
- Couleur distinctive (bleu souligné par défaut)
- Survol: Changement de couleur/curseur pointer
- Focus clavier: Bordure visible pour accessibilité

**Chemin de navigation (optionnel):**
- Breadcrumbs montrant: Carrière > Talent > Compétence
- Clic sur élément du chemin revient à cette étape
- Masqué sur mobile par défaut (manque d'espace)

### Préservation du contexte source

Lors d'une navigation, l'entité source reste accessible:
- Desktop: Visible dans zone principale, panel latéral pour cible
- Mobile: Bouton retour explicite ou fermeture popup
- Navigation ne supprime pas l'état précédent

## Historique de navigation

### Mémorisation (optionnel)

Le système peut mémoriser les consultations:
- Liste des entités visitées dans l'ordre
- Boutons précédent/suivant pour navigation historique
- Limite à X dernières consultations (ex: 20)

### Navigation par historique

**Bouton précédent:** Retour à l'entité consultée juste avant
**Bouton suivant:** Avance vers entité consultée après (si retour précédent utilisé)
**Liste historique:** Menu déroulant avec toutes consultations récentes

## Règles métier

### Liens unidirectionnels vs bidirectionnels

**Unidirectionnel:** Carrière → Talent (lien dans description)
**Bidirectionnel:** Talent ← Carrière (lien dans "Utilisé par") ET Talent → Carrière (si talent mentionne carrière)

Dans la pratique, la plupart des relations sont bidirectionnelles grâce à "Utilisé par".

### Évitement des boucles infinies

Pas de risque de boucle car:
- Chaque entité a un état distinct
- Navigation génère nouvelle vue, ne modifie pas l'existante
- Utilisateur contrôle chaque étape explicitement

### Performance

**Chargement à la demande:** Fiche entité chargée uniquement au clic, pas en anticipation
**Mise en cache:** Fiches consultées gardées en mémoire pour consultation rapide si retour
**Limite de cache:** Purge automatique si trop d'entités en mémoire (ex: > 50)

## Validation

**Intégrité liens:** Tous liens pointent vers entités existantes
**Cohérence navigation:** Navigation avant/arrière symétrique (A→B implique B liste A dans "Utilisé par")
**Accessibilité:** Navigation possible au clavier (Tab, Enter), liens visibles au focus

## Voir aussi

- [inverse-relations.md](./inverse-relations.md) - Construction section "Utilisé par"
- [rich-descriptions.md](./rich-descriptions.md) - Génération liens cliquables
- [global-index.md](./global-index.md) - Index match permettant résolution rapide
