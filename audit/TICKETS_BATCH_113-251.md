# GÉNÉRATION BATCH TICKETS #113-#251

Ce document liste tous les tickets à créer. Chaque section sera transformée en fichiers individuels.

---

## WIZARD STEP 5: SKILLS (#113-#120)

### #113: Wizard Skills - Affichage compétences espèce
- **Path**: wizard/skills-species
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 086]
- **Source**: StepSkills.html
- **Objective**: l'affichage des compétences héritées de l'espèce
- **In scope**:
  - Compétences raciales de l'espèce sélectionnée
  - Spécialisations incluses dans l'espèce
  - Affichage avec valeur de base (carac + avances)
  - Source affichée (espèce)
  - Exemples Warhammer par espèce

### #114: Wizard Skills - Affichage compétences carrière
- **Path**: wizard/skills-career
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 091]
- **Source**: StepSkills.html
- **Objective**: l'affichage des compétences du niveau 1 de carrière
- **In scope**:
  - Compétences du niveau 1 de carrière
  - Avances fournies par la carrière
  - Compétences Basic vs Advanced
  - Source affichée (carrière)
  - Cumul avec compétences espèce
  - Exemples Warhammer par carrière

### #115: Wizard Skills - Gestion spécialisations
- **Path**: wizard/skills-specialization
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 113]
- **Source**: StepSkills.html
- **Objective**: la gestion des spécialisations de compétences (ex: Métier (Charpentier))
- **In scope**:
  - Compétences nécessitant spécialisation
  - Sélection de la spécialisation
  - Spécialisation libre vs liste fermée
  - Affichage compétence avec spécialisation
  - Exemples Warhammer (Métier, Langue, Connaissance, etc.)

### #116: Wizard Skills - Sélection 'Au choix'
- **Path**: wizard/skills-choice
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 114]
- **Source**: StepSkills.html
- **Objective**: la sélection des compétences marquées 'Au choix' dans la carrière
- **In scope**:
  - Parsing 'Au choix' dans compétences carrière
  - Interface de sélection parmi options
  - Validation nombre de choix
  - Gestion spécialisations dans choix
  - Exemples Warhammer

### #117: Wizard Skills - Calcul avances
- **Path**: wizard/skills-advances
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 114]
- **Source**: StepSkills.html
- **Objective**: le calcul des avances de compétences selon leur source
- **In scope**:
  - Avances initiales (selon source)
  - Cumul avances de sources multiples
  - Avances Basic vs Advanced
  - Affichage avances par source
  - Exemples de calculs Warhammer

### #118: Wizard Skills - Calcul valeurs finales
- **Path**: wizard/skills-values
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 018, 117]
- **Source**: StepSkills.html
- **Objective**: le calcul des valeurs finales de compétences (Carac + Avances)
- **In scope**:
  - Formule: Valeur = Caractéristique liée + Avances
  - Mise à jour temps réel si carac change
  - Affichage Valeur et Bonus (+X/10)
  - Calculs pour toutes compétences acquises
  - Exemples de calculs Warhammer

### #119: Wizard Skills - Groupement
- **Path**: wizard/skills-grouping
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [005, 113]
- **Source**: StepSkills.html
- **Objective**: le groupement et organisation des compétences (Basic/Advanced, par caractéristique)
- **In scope**:
  - Groupement Basic vs Advanced
  - Organisation par caractéristique liée
  - Ordre alphabétique dans chaque groupe
  - Affichage regroupé lisible
  - Exemples d'organisation Warhammer

### #120: Wizard Skills - Validation cohérence
- **Path**: wizard/skills-validation
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [005, 118]
- **Source**: StepSkills.html
- **Objective**: la validation de la cohérence des compétences sélectionnées
- **In scope**:
  - Validation spécialisations saisies
  - Détection compétences en double
  - Validation pré-requis compétences Advanced
  - Messages d'erreur explicites
  - Exemples de cas invalides Warhammer

---

## WIZARD STEP 6: TRAPPINGS (#121-#126)

### #121: Wizard Trappings - Affichage équipement carrière
- **Path**: wizard/trappings-career
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [007, 091]
- **Source**: StepTrappings.html
- **Objective**: l'affichage de l'équipement fourni par le niveau 1 de carrière
- **In scope**:
  - Liste équipement du niveau carrière
  - Armes, armures, objets divers
  - Quantités par défaut
  - Équipement de base inclus
  - Exemples Warhammer par carrière

### #122: Wizard Trappings - Sélection 'Au choix'
- **Path**: wizard/trappings-choice
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [007, 121]
- **Source**: StepTrappings.html
- **Objective**: la sélection de l'équipement marqué 'Au choix' dans la carrière
- **In scope**:
  - Parsing 'Au choix' dans trappings carrière
  - Interface de sélection parmi options
  - Validation nombre de choix
  - Équipement alternatif
  - Exemples Warhammer

### #123: Wizard Trappings - Ajout manuel
- **Path**: wizard/trappings-manual
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [007, 121]
- **Source**: StepTrappings.html
- **Objective**: l'ajout manuel d'équipement supplémentaire
- **In scope**:
  - Recherche dans table trappings
  - Ajout équipement personnalisé
  - Saisie quantité
  - Modification équipement existant
  - Exemples Warhammer

### #124: Wizard Trappings - Calcul encombrement
- **Path**: wizard/trappings-encumbrance
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [007, 121]
- **Source**: StepTrappings.html
- **Objective**: le calcul de l'encombrement total de l'équipement porté
- **In scope**:
  - Formule encombrement par objet (enc x quantité)
  - Somme totale encombrement
  - Limite encombrement (Force/Endurance)
  - Indicateur dépassement limite
  - Exemples de calculs Warhammer

### #125: Wizard Trappings - Organisation catégories
- **Path**: wizard/trappings-categories
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: [007, 121]
- **Source**: StepTrappings.html
- **Objective**: l'organisation de l'équipement par catégories
- **In scope**:
  - Catégories (Armes, Armures, Vêtements, Outils, etc.)
  - Groupement automatique par catégorie
  - Affichage regroupé
  - Ordre dans chaque catégorie
  - Exemples Warhammer

### #126: Wizard Trappings - Validation encombrement
- **Path**: wizard/trappings-validation
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [124]
- **Source**: StepTrappings.html
- **Objective**: la validation de l'encombrement vs limite du personnage
- **In scope**:
  - Calcul limite encombrement (Force + Endurance)
  - Comparaison encombrement total vs limite
  - Pénalités si dépassement
  - Messages d'avertissement
  - Exemples Warhammer

---

## WIZARD STEP 7: DETAIL (#127-#132)

### #127: Wizard Detail - Calcul âge
- **Path**: wizard/detail-age
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [001, 011]
- **Source**: StepDetail.html
- **Objective**: le calcul de l'âge du personnage selon formule espèce
- **In scope**:
  - Formule par espèce (Base + Xd10)
  - Génération aléatoire
  - Saisie manuelle
  - Limites min/max par espèce
  - Exemples Warhammer par espèce

### #128: Wizard Detail - Calcul taille
- **Path**: wizard/detail-height
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [001, 011]
- **Source**: StepDetail.html
- **Objective**: le calcul de la taille du personnage selon formule espèce
- **In scope**:
  - Formule par espèce (Base + Xd10)
  - Génération aléatoire
  - Saisie manuelle
  - Limites min/max par espèce
  - Impact sur Blessures
  - Exemples Warhammer par espèce

### #129: Wizard Detail - Couleurs yeux
- **Path**: wizard/detail-eyes
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: [001, 022]
- **Source**: StepDetail.html
- **Objective**: la détermination de la couleur des yeux selon table 2d10
- **In scope**:
  - Table 2d10 par espèce
  - Génération aléatoire
  - Sélection manuelle
  - Couleurs spécifiques à chaque espèce
  - Exemples Warhammer

### #130: Wizard Detail - Couleurs cheveux
- **Path**: wizard/detail-hairs
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: [001, 023]
- **Source**: StepDetail.html
- **Objective**: la détermination de la couleur des cheveux selon table 2d10
- **In scope**:
  - Table 2d10 par espèce
  - Génération aléatoire
  - Sélection manuelle
  - Couleurs spécifiques à chaque espèce
  - Exemples Warhammer

### #131: Wizard Detail - Nom et ambitions
- **Path**: wizard/detail-name
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: []
- **Source**: StepDetail.html
- **Objective**: la saisie du nom et des ambitions du personnage
- **In scope**:
  - Nom du personnage (texte libre)
  - Ambitions courtes/longues
  - Validation saisie (longueur)
  - Champs optionnels vs obligatoires
  - Exemples Warhammer

### #132: Wizard Detail - Dieu patron
- **Path**: wizard/detail-god
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [001, 010]
- **Source**: StepDetail.html
- **Objective**: la sélection du dieu patron du personnage
- **In scope**:
  - Liste des dieux par espèce/région
  - Sélection manuelle vs aléatoire
  - Filtrage selon espèce et région
  - Description du dieu
  - Exemples Warhammer

---

## WIZARD STEP 8: EXPERIENCE (#133-#139)

### #133: Wizard Experience - Budget XP
- **Path**: wizard/experience-budget
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: []
- **Source**: StepExperience.html
- **Objective**: la définition du budget XP disponible pour la création
- **In scope**:
  - Saisie XP disponible (0-2000 typique)
  - Validation budget
  - Affichage XP total vs dépensé vs restant
  - Présets XP courants
  - Exemples Warhammer

### #134: Wizard Experience - XP caractéristiques
- **Path**: wizard/experience-characteristics
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [018, 133]
- **Source**: StepExperience.html
- **Objective**: la dépense XP pour améliorer les caractéristiques
- **In scope**:
  - Coût XP caractéristiques (formule progressive)
  - Sélection caractéristique à améliorer
  - Calcul coût selon valeur actuelle
  - Avances achetables (+1/+5/+10)
  - Historique achats
  - Exemples Warhammer

### #135: Wizard Experience - XP compétences
- **Path**: wizard/experience-skills
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 133]
- **Source**: StepExperience.html
- **Objective**: la dépense XP pour améliorer les compétences
- **In scope**:
  - Coût XP compétences Basic vs Advanced
  - Compétences dans carrière vs hors carrière (coût double)
  - Acquisition nouvelle compétence
  - Avances supplémentaires (+1 à +20)
  - Historique achats
  - Exemples Warhammer

### #136: Wizard Experience - XP talents
- **Path**: wizard/experience-talents
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [004, 133]
- **Source**: StepExperience.html
- **Objective**: la dépense XP pour acquérir des talents
- **In scope**:
  - Coût XP talents (fixe + rangs)
  - Talents dans carrière vs hors carrière (coût double)
  - Acquisition rangs supplémentaires
  - Validation pré-requis
  - Historique achats
  - Exemples Warhammer

### #137: Wizard Experience - Historique dépenses
- **Path**: wizard/experience-history
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [133]
- **Source**: StepExperience.html
- **Objective**: l'historique des dépenses XP effectuées
- **In scope**:
  - Log de toutes les dépenses
  - Affichage par catégorie (carac/skills/talents)
  - Annulation dernière dépense
  - Remboursement XP
  - Total par catégorie
  - Exemples Warhammer

### #138: Wizard Experience - Validation budget
- **Path**: wizard/experience-validation
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [133]
- **Source**: StepExperience.html
- **Objective**: la validation du budget XP disponible vs dépenses
- **In scope**:
  - Calcul XP total dépensé
  - Comparaison avec budget
  - Blocage si budget dépassé
  - Messages d'erreur
  - Exemples Warhammer

### #139: Wizard Experience - Récapitulatif
- **Path**: wizard/experience-summary
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [133, 137]
- **Source**: StepExperience.html
- **Objective**: les calculs récapitulatifs des dépenses XP
- **In scope**:
  - Total XP dépensé par catégorie
  - XP restant disponible
  - Statistiques dépenses
  - Graphique ou tableau récapitulatif
  - Exemples Warhammer

---

## WIZARD STEP 9: RESUME (#140-#144)

### #140: Wizard Resume - Récapitulatif complet
- **Path**: wizard/resume-display
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [086, 091, 097, 106, 113, 121, 127, 133]
- **Source**: StepResume.html
- **Objective**: le récapitulatif complet du personnage créé
- **In scope**:
  - Affichage toutes sections
  - Détails complets
  - Mise en page lisible
  - Calculs finaux
  - Exemples Warhammer

### #141: Wizard Resume - Vérification cohérence
- **Path**: wizard/resume-validation
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [140]
- **Source**: StepResume.html
- **Objective**: la vérification de la cohérence globale du personnage
- **In scope**:
  - Validation toutes sections complétées
  - Cohérence inter-sections
  - Détection erreurs/incohérences
  - Messages d'avertissement
  - Blocage si invalide
  - Exemples de validations Warhammer

### #142: Wizard Resume - Calculs dérivés finaux
- **Path**: wizard/resume-derived
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [140]
- **Source**: StepResume.html
- **Objective**: le calcul des attributs dérivés finaux du personnage
- **In scope**:
  - Mouvement final
  - Blessures finales
  - Destin/Résolution/Fortune
  - Encombrement final
  - Autres calculs dérivés
  - Exemples Warhammer

### #143: Wizard Resume - Export/impression
- **Path**: wizard/resume-export
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [140]
- **Source**: StepResume.html
- **Objective**: l'export et impression de la feuille de personnage
- **In scope**:
  - Export PDF
  - Impression directe
  - Format feuille officielle
  - Mise en page optimisée
  - Exemples Warhammer

### #144: Wizard Resume - Sauvegarde
- **Path**: wizard/resume-save
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [141]
- **Source**: StepResume.html
- **Objective**: la validation finale et la sauvegarde du personnage créé
- **In scope**:
  - Validation finale toutes sections
  - Sauvegarde personnage
  - Confirmation sauvegarde
  - Redirection vers feuille personnage
  - Exemples Warhammer

---

## CHARACTER MODEL (#145-#159)

### #145: Character Model - Structure données
- **Path**: character-model/structure
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: []
- **Source**: Character.html
- **Objective**: la structure de données du modèle Character
- **In scope**:
  - Propriétés principales (mode, stepIndex, specie, careerLevel)
  - Tableaux (characteristics, skills, talents, spells, trappings)
  - Détails (details, god, star, magic)
  - XP (max, log, used, tmp_used)
  - État aléatoire (randomState)
  - Exemples de structure Warhammer

### #146: Character Model - Méthodes specie
- **Path**: character-model/specie-methods
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [001, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion de l'espèce dans le modèle Character
- **In scope**:
  - setSpecie(specie): définir l'espèce
  - getSpecie(): récupérer l'espèce
  - Application caractéristiques de base
  - Application talents/skills raciaux
  - Exemples Warhammer

### #147: Character Model - Méthodes carrière
- **Path**: character-model/career-methods
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [003, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion du niveau de carrière dans le modèle Character
- **In scope**:
  - setCareerLevel(careerLevel): définir carrière+niveau
  - getCareerLevel(): récupérer carrière+niveau
  - Application avantages niveau
  - Historique carrières
  - Exemples Warhammer

### #148: Character Model - Gestion characteristics
- **Path**: character-model/characteristics
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [018, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion des caractéristiques dans le modèle Character
- **In scope**:
  - getCharacteristics(): récupérer toutes carac
  - setCharacteristic(name, value): définir une carac
  - calculateCharacteristic(name): calculer valeur finale
  - Application avances
  - Exemples Warhammer

### #149: Character Model - Méthodes skills
- **Path**: character-model/skills-methods
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [005, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion des compétences dans le modèle Character
- **In scope**:
  - addSkills(skills, source): ajouter compétences
  - getSkills(): récupérer toutes compétences
  - Parsing skills (specs, avances)
  - Merge sources multiples
  - Calcul valeurs finales
  - Exemples Warhammer

### #150: Character Model - Méthodes talents
- **Path**: character-model/talents-methods
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [004, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion des talents dans le modèle Character
- **In scope**:
  - addTalents(talents, source): ajouter talents
  - getTalents(): récupérer tous talents
  - Parsing talents (specs, rangs)
  - Merge sources multiples
  - Gestion rangs multiples
  - Exemples Warhammer

### #151: Character Model - Application talent
- **Path**: character-model/apply-talent
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [004, 150]
- **Source**: Character.html
- **Objective**: la méthode d'application des effets d'un talent
- **In scope**:
  - applyTalent(talent): appliquer effets
  - Types d'effets (addSkill, addMagic, addCharacteristic, addTalent)
  - Application automatique
  - Chaînes de talents
  - Exemples Warhammer

### #152: Character Model - Gestion spells
- **Path**: character-model/spells
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion des sorts dans le modèle Character
- **In scope**:
  - addSpells(spells, source): ajouter sorts
  - getSpells(): récupérer tous sorts
  - Filtrage par domaine/lore
  - Organisation sorts
  - Exemples Warhammer

### #153: Character Model - Gestion trappings
- **Path**: character-model/trappings
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [007, 145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion de l'équipement dans le modèle Character
- **In scope**:
  - addTrappings(trappings): ajouter équipement
  - getTrappings(): récupérer tout équipement
  - Gestion quantités
  - Calcul encombrement
  - Exemples Warhammer

### #154: Character Model - Save/Load
- **Path**: character-model/save-load
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: les méthodes de sauvegarde et chargement du personnage
- **In scope**:
  - save(): sauvegarder personnage
  - load(id): charger personnage
  - Sérialisation complète
  - Gestion erreurs
  - Exemples Warhammer

### #155: Character Model - Delete empty
- **Path**: character-model/delete-empty
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: la méthode de nettoyage des propriétés vides
- **In scope**:
  - deleteEmpty(): supprimer propriétés vides
  - Nettoyage tableaux vides
  - Nettoyage chaînes vides
  - Optimisation stockage
  - Exemples Warhammer

### #156: Character Model - Calculs dérivés
- **Path**: character-model/derived
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: les méthodes de calcul des attributs dérivés
- **In scope**:
  - calculateMovement(): calcul mouvement
  - calculateWounds(): calcul blessures
  - calculateEncumbrance(): calcul encombrement
  - Autres calculs dérivés
  - Exemples Warhammer

### #157: Character Model - Gestion XP
- **Path**: character-model/xp
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: les méthodes de gestion de l'XP dans le modèle Character
- **In scope**:
  - setXPMax(xp): définir XP max
  - spendXP(amount, category): dépenser XP
  - getXPAvailable(): XP disponible
  - Log historique XP
  - Exemples Warhammer

### #158: Character Model - Validation
- **Path**: character-model/validation
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: les méthodes de validation de la cohérence du personnage
- **In scope**:
  - validate(): validation globale
  - Validation pré-requis
  - Validation limites
  - Messages d'erreur
  - Exemples Warhammer

### #159: Character Model - Random state
- **Path**: character-model/random-state
- **Priority**: LOW
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: la gestion de l'état aléatoire du personnage
- **In scope**:
  - randomState: conservation état aléatoire
  - Reproductibilité génération
  - Sauvegarde état
  - Restauration état
  - Exemples Warhammer

---

## SAUVEGARDE/CHARGEMENT (#160-#164)

### #160: Save/Load - Google Sheets save
- **Path**: save-load/sheets-save
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Code.js
- **Objective**: la sauvegarde d'un personnage dans Google Sheets
- **In scope**:
  - Sérialisation JSON personnage
  - Écriture dans feuille Save
  - Format sauvegarde
  - Gestion ID unique
  - Exemples Warhammer

### #161: Save/Load - Google Sheets load
- **Path**: save-load/sheets-load
- **Priority**: HIGH
- **Phase**: 2
- **Dependencies**: [145, 160]
- **Source**: Code.js
- **Objective**: le chargement d'un personnage depuis Google Sheets
- **In scope**:
  - Lecture feuille Save
  - Désérialisation JSON
  - Reconstruction objet Character
  - Gestion erreurs
  - Exemples Warhammer

### #162: Save/Load - JSON export
- **Path**: save-load/json-export
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [145]
- **Source**: Code.js
- **Objective**: l'export complet du personnage en JSON
- **In scope**:
  - Sérialisation complète JSON
  - Format standard
  - Téléchargement fichier
  - Validation format
  - Exemples Warhammer

### #163: Save/Load - JSON import
- **Path**: save-load/json-import
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [145, 162]
- **Source**: Code.js
- **Objective**: l'import d'un personnage depuis JSON
- **In scope**:
  - Upload fichier JSON
  - Validation format
  - Désérialisation
  - Reconstruction personnage
  - Gestion erreurs
  - Exemples Warhammer

### #164: Save/Load - Liste personnages
- **Path**: save-load/character-list
- **Priority**: MEDIUM
- **Phase**: 2
- **Dependencies**: [160]
- **Source**: Code.js
- **Objective**: la gestion d'une liste de personnages sauvegardés
- **In scope**:
  - Liste personnages sauvegardés
  - Chargement par ID
  - Suppression personnage
  - Recherche/filtrage
  - Exemples Warhammer

---

## FEUILLE PERSONNAGE (#165-#170)

### #165: Character Sheet - Section identité
- **Path**: character-sheet/identity
- **Priority**: MEDIUM
- **Phase**: 3
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: l'affichage de la section identité de la feuille de personnage
- **In scope**:
  - Nom, espèce, carrière
  - Âge, taille, yeux, cheveux
  - Dieu patron, signe
  - Ambitions
  - Exemples Warhammer

### #166: Character Sheet - Caractéristiques et compétences
- **Path**: character-sheet/characteristics-skills
- **Priority**: HIGH
- **Phase**: 3
- **Dependencies**: [145, 148, 149]
- **Source**: Character.html
- **Objective**: l'affichage des caractéristiques et compétences de la feuille
- **In scope**:
  - Caractéristiques avec bonus
  - Compétences avec valeurs
  - Calculs dérivés (Mouvement, Blessures)
  - Mise en page tableau
  - Exemples Warhammer

### #167: Character Sheet - Talents et sorts
- **Path**: character-sheet/talents-spells
- **Priority**: MEDIUM
- **Phase**: 3
- **Dependencies**: [145, 150, 152]
- **Source**: Character.html
- **Objective**: l'affichage des talents et sorts de la feuille
- **In scope**:
  - Liste talents avec rangs
  - Liste sorts avec CN
  - Effets talents actifs
  - Organisation lisible
  - Exemples Warhammer

### #168: Character Sheet - Équipement
- **Path**: character-sheet/equipment
- **Priority**: MEDIUM
- **Phase**: 3
- **Dependencies**: [145, 153]
- **Source**: Character.html
- **Objective**: l'affichage de l'équipement de la feuille
- **In scope**:
  - Armes avec stats
  - Armures avec PA
  - Équipement divers
  - Encombrement total
  - Exemples Warhammer

### #169: Character Sheet - Mode impression
- **Path**: character-sheet/print
- **Priority**: LOW
- **Phase**: 3
- **Dependencies**: [165, 166, 167, 168]
- **Source**: Character.html
- **Objective**: le mode impression/PDF de la feuille de personnage
- **In scope**:
  - Format imprimable
  - CSS print
  - Export PDF
  - Mise en page optimisée
  - Exemples Warhammer

### #170: Character Sheet - Mise à jour temps réel
- **Path**: character-sheet/live-update
- **Priority**: MEDIUM
- **Phase**: 3
- **Dependencies**: [165]
- **Source**: Character.html
- **Objective**: la mise à jour temps réel de la feuille lors des modifications
- **In scope**:
  - Recalcul automatique
  - Mise à jour affichage
  - Réactivité
  - Performance
  - Exemples Warhammer

---

## ÉDITION PERSONNAGE (#171-#179)

### #171: Character Edit - Modification caractéristiques
- **Path**: character-edit/characteristics
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [148]
- **Source**: Character.html
- **Objective**: la modification des caractéristiques d'un personnage existant
- **In scope**:
  - Edition inline valeurs
  - Validation limites
  - Recalcul bonus
  - Historique modifications
  - Exemples Warhammer

### #172: Character Edit - Ajout/suppression compétences
- **Path**: character-edit/skills
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [149]
- **Source**: Character.html
- **Objective**: l'ajout et la suppression de compétences
- **In scope**:
  - Ajout nouvelle compétence
  - Suppression compétence
  - Modification avances
  - Gestion spécialisations
  - Exemples Warhammer

### #173: Character Edit - Ajout/suppression talents
- **Path**: character-edit/talents
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [150]
- **Source**: Character.html
- **Objective**: l'ajout et la suppression de talents
- **In scope**:
  - Ajout nouveau talent
  - Suppression talent
  - Gestion rangs
  - Validation pré-requis
  - Exemples Warhammer

### #174: Character Edit - Ajout/suppression sorts
- **Path**: character-edit/spells
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [152]
- **Source**: Character.html
- **Objective**: l'ajout et la suppression de sorts
- **In scope**:
  - Ajout nouveau sort
  - Suppression sort
  - Filtrage par lore
  - Validation restrictions
  - Exemples Warhammer

### #175: Character Edit - Gestion équipement
- **Path**: character-edit/equipment
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [153]
- **Source**: Character.html
- **Objective**: la gestion de l'équipement du personnage
- **In scope**:
  - Ajout/suppression équipement
  - Modification quantités
  - Gestion états
  - Calcul encombrement
  - Exemples Warhammer

### #176: Character Edit - Modification détails
- **Path**: character-edit/details
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [145]
- **Source**: Character.html
- **Objective**: la modification des détails du personnage (nom, âge, etc.)
- **In scope**:
  - Édition nom
  - Modification âge/taille
  - Changement dieu/signe
  - Ambitions
  - Exemples Warhammer

### #177: Character Edit - Historique XP
- **Path**: character-edit/xp-history
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [157]
- **Source**: Character.html
- **Objective**: la visualisation et gestion de l'historique XP
- **In scope**:
  - Affichage log XP
  - Ajout entrée XP
  - Annulation dépense
  - Stats XP
  - Exemples Warhammer

### #178: Character Edit - Progression carrière
- **Path**: character-edit/career-progression
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [147]
- **Source**: Character.html
- **Objective**: la gestion de la progression dans la carrière
- **In scope**:
  - Passage niveau supérieur
  - Changement carrière
  - Validation pré-requis
  - Application avantages
  - Exemples Warhammer

### #179: Character Edit - Validation modifications
- **Path**: character-edit/validation
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [158]
- **Source**: Character.html
- **Objective**: la validation des modifications apportées au personnage
- **In scope**:
  - Validation cohérence globale
  - Détection erreurs
  - Messages d'avertissement
  - Blocage si invalide
  - Exemples Warhammer

---

## AVANCEMENT XP (#180-#194)

### #180: Advancement - Coût XP caractéristiques
- **Path**: advancement/cost-characteristics
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [148]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour améliorer une caractéristique
- **In scope**:
  - Formule progressive (25 x rang actuel)
  - Paliers +1, +5, +10
  - Variations selon source
  - Exemples de coûts Warhammer
  - Tables de référence

### #181: Advancement - Coût XP compétences Basic
- **Path**: advancement/cost-skills-basic
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [149]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour les compétences Basic
- **In scope**:
  - Coût acquisition (10 XP dans carrière, 20 hors)
  - Coût avances (+5/+10/+20: 15 XP chacune)
  - Formule complète
  - Exemples Warhammer

### #182: Advancement - Coût XP compétences Advanced
- **Path**: advancement/cost-skills-advanced
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [149]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour les compétences Advanced
- **In scope**:
  - Coût acquisition (20 XP dans carrière, 40 hors)
  - Coût avances (+5/+10/+20: 20 XP chacune)
  - Formule complète
  - Exemples Warhammer

### #183: Advancement - Coût XP talents
- **Path**: advancement/cost-talents
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [150]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour acquérir un talent
- **In scope**:
  - Coût base (100 XP dans carrière, 200 hors)
  - Coût rangs supplémentaires
  - Talents à rangs multiples
  - Exemples Warhammer

### #184: Advancement - Coût XP sorts
- **Path**: advancement/cost-spells
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [152]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour apprendre un sort
- **In scope**:
  - Coût selon CN du sort
  - Sorts mineurs vs sorts
  - Coût dans/hors domaine
  - Exemples Warhammer

### #185: Advancement - Restrictions carrière
- **Path**: advancement/career-restrictions
- **priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [147]
- **Source**: StepExperience.html
- **Objective**: les restrictions d'avancement selon la carrière
- **In scope**:
  - Achats dans carrière vs hors carrière
  - Limites par niveau carrière
  - Complétion niveau avant passage
  - Exemples Warhammer

### #186: Advancement - Achats hors carrière
- **Path**: advancement/out-of-career
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [180]
- **Source**: StepExperience.html
- **Objective**: les règles d'achat hors carrière (coût double)
- **In scope**:
  - Coût double pour achats hors carrière
  - Détermination "dans/hors" carrière
  - Restrictions supplémentaires
  - Exemples Warhammer

### #187: Advancement - Historique dépenses XP
- **Path**: advancement/xp-log
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [157]
- **Source**: StepExperience.html
- **Objective**: la gestion de l'historique des dépenses XP
- **In scope**:
  - Log chronologique dépenses
  - Catégorisation (carac/skills/talents/spells)
  - Annulation possible
  - Export historique
  - Exemples Warhammer

### #188: Advancement - Budget XP disponible
- **Path**: advancement/xp-budget
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [157]
- **Source**: StepExperience.html
- **Objective**: la gestion du budget XP disponible vs dépensé
- **In scope**:
  - XP total gagné
  - XP dépensé
  - XP disponible
  - Affichage en temps réel
  - Exemples Warhammer

### #189: Advancement - Validation achats
- **Path**: advancement/validation
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [188]
- **Source**: StepExperience.html
- **Objective**: la validation des achats XP avant confirmation
- **In scope**:
  - Validation budget suffisant
  - Validation pré-requis
  - Validation restrictions carrière
  - Messages d'erreur
  - Exemples Warhammer

### #190: Advancement - Changement carrière
- **Path**: advancement/career-change
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [147, 185]
- **Source**: StepCareers.html
- **Objective**: les règles de changement de carrière
- **In scope**:
  - Conditions changement carrière
  - Conservation acquis précédents
  - Nouveaux avantages carrière
  - Coûts XP associés
  - Exemples Warhammer

### #191: Advancement - Progression niveaux carrière
- **Path**: advancement/career-levels
- **Priority**: HIGH
- **Phase**: 5
- **Dependencies**: [147, 185]
- **Source**: StepCareers.html
- **Objective**: la progression entre les niveaux d'une carrière (Bronze → Silver → Gold)
- **In scope**:
  - Complétion niveau actuel (tous avantages)
  - Passage niveau supérieur
  - Application nouveaux avantages
  - Restrictions
  - Exemples Warhammer

### #192: Advancement - Tests avancement
- **Path**: advancement/tests
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [191]
- **Source**: StepExperience.html
- **Objective**: les tests nécessaires pour progresser dans la carrière
- **In scope**:
  - Tests de compétences
  - Conditions narratives
  - Validation MJ
  - Règles WFRP
  - Exemples Warhammer

### #193: Advancement - Interface dépense XP
- **Path**: advancement/ui
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [180, 188]
- **Source**: StepExperience.html
- **Objective**: l'interface de dépense XP pour améliorer le personnage
- **In scope**:
  - Sélection amélioration
  - Affichage coût
  - Confirmation achat
  - Mise à jour personnage
  - Exemples Warhammer

### #194: Advancement - Récapitulatif XP
- **Path**: advancement/summary
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [187, 188]
- **Source**: StepExperience.html
- **Objective**: le récapitulatif des dépenses XP par catégorie
- **In scope**:
  - Total par catégorie
  - Statistiques dépenses
  - Graphiques
  - Export rapport
  - Exemples Warhammer

---

## MAGIE (#195-#207)

### #195: Magic - Domaines magie
- **Path**: magic/domains
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006, 008]
- **Source**: DataLore.html
- **Objective**: les domaines de magie (Arcane/Divine/Chaos)
- **In scope**:
  - 3 domaines principaux
  - Caractéristiques chaque domaine
  - Restrictions d'accès
  - Lores par domaine
  - Exemples Warhammer

### #196: Magic - Apprentissage sorts par domaine
- **Path**: magic/learning
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006, 195]
- **Source**: DataSpell.html
- **Objective**: l'apprentissage de sorts selon le domaine
- **In scope**:
  - Règles apprentissage par domaine
  - Coût XP
  - Pré-requis domaine
  - Progression lore
  - Exemples Warhammer

### #197: Magic - Restrictions carrière magie
- **Path**: magic/career-restrictions
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [003, 195]
- **Source**: StepCareers.html
- **Objective**: les restrictions de carrière pour la magie
- **In scope**:
  - Carrières magiques vs non-magiques
  - Accès domaines selon carrière
  - Restrictions lores
  - Exemples Warhammer

### #198: Magic - Pré-requis talents magiques
- **Path**: magic/talent-prerequisites
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [004, 195]
- **Source**: DataTalent.html
- **Objective**: les pré-requis de talents pour pratiquer la magie
- **In scope**:
  - Talents requis par domaine
  - Petty Magic, Arcane Magic, etc.
  - Hiérarchie talents magiques
  - Validation pré-requis
  - Exemples Warhammer

### #199: Magic - Coût XP sorts
- **Path**: magic/xp-cost
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [184, 195]
- **Source**: StepExperience.html
- **Objective**: le calcul du coût XP pour apprendre un sort
- **In scope**:
  - Formule selon CN
  - Sorts mineurs (Petty)
  - Sorts normaux
  - Coût dans/hors lore
  - Exemples Warhammer

### #200: Magic - Gestion lores multiples
- **Path**: magic/multiple-lores
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [195]
- **Source**: DataLore.html
- **Objective**: la gestion de l'apprentissage de plusieurs lores
- **In scope**:
  - Apprentissage lores multiples
  - Restrictions combinaisons
  - Coûts additionnels
  - Règles WFRP
  - Exemples Warhammer

### #201: Magic - Sorts mineurs vs sorts
- **Path**: magic/petty-vs-spells
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006, 195]
- **Source**: DataSpell.html
- **Objective**: la distinction entre sorts mineurs (Petty) et sorts normaux
- **In scope**:
  - Sorts mineurs (CN 0-2)
  - Sorts normaux (CN 3+)
  - Règles différentes
  - Coûts XP différents
  - Exemples Warhammer

### #202: Magic - Ingrédients sorts
- **Path**: magic/ingredients
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [006]
- **Source**: DataSpell.html
- **Objective**: la gestion des ingrédients pour l'incantation
- **In scope**:
  - Ingrédients par sort
  - Disponibilité ingrédients
  - Bonus avec ingrédients
  - Exemples Warhammer

### #203: Magic - Tests incantation
- **Path**: magic/casting-tests
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [006, 195]
- **Source**: DataSpell.html
- **Objective**: les règles de tests d'incantation
- **In scope**:
  - Test de Langue (Magick)
  - CN du sort
  - Modificateurs
  - Échecs et fumbles
  - Exemples Warhammer

### #204: Magic - CN (Casting Number)
- **Path**: magic/casting-number
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006]
- **Source**: DataSpell.html
- **Objective**: le CN (Casting Number) des sorts
- **In scope**:
  - Définition CN
  - CN par sort
  - Impact sur difficulté
  - Impact sur coût XP
  - Exemples Warhammer

### #205: Magic - Validation magie
- **Path**: magic/validation
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [195, 198]
- **Source**: DataSpell.html
- **Objective**: la validation des règles de magie
- **In scope**:
  - Validation accès domaine
  - Validation pré-requis talents
  - Validation restrictions carrière
  - Messages d'erreur
  - Exemples Warhammer

### #206: Magic - Affichage sorts
- **Path**: magic/display
- **Priority**: MEDIUM
- **Phase**: 5
- **Dependencies**: [006, 195]
- **Source**: DataSpell.html
- **Objective**: l'affichage des sorts du personnage
- **In scope**:
  - Liste sorts connus
  - Groupement par lore
  - Détails sorts (CN, range, etc.)
  - Organisation lisible
  - Exemples Warhammer

### #207: Magic - Recherche sorts
- **Path**: magic/search
- **Priority**: LOW
- **Phase**: 5
- **Dependencies**: [006]
- **Source**: DataSpell.html
- **Objective**: la recherche et filtrage de sorts
- **In scope**:
  - Recherche par nom
  - Filtrage par lore/domaine
  - Filtrage par CN
  - Tri sorts
  - Exemples Warhammer

---

## ÉQUIPEMENT (#208-#221)

### #208: Equipment - Inventaire
- **Path**: equipment/inventory
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [007, 153]
- **Source**: Character.html
- **Objective**: la gestion de l'inventaire du personnage
- **In scope**:
  - Liste équipement
  - Quantités
  - États (porté/stocké)
  - Organisation
  - Exemples Warhammer

### #209: Equipment - Armes
- **Path**: equipment/weapons
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [007, 208]
- **Source**: DataTrapping.html
- **Objective**: la gestion des armes (dégâts, allonge, groupe)
- **In scope**:
  - Stats armes (dégâts, allonge)
  - Groupes armes (Basic/Cavalry/Fencing/etc.)
  - Qualités armes
  - Exemples Warhammer

### #210: Equipment - Qualités armes
- **Path**: equipment/weapon-qualities
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [007, 209]
- **Source**: DataQuality.html
- **Objective**: les qualités d'armes (Équilibrée, Tranchante, etc.)
- **In scope**:
  - Liste qualités armes
  - Effets qualités
  - Application en combat
  - Exemples Warhammer

### #211: Equipment - Armures
- **Path**: equipment/armour
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [007, 208]
- **Source**: DataTrapping.html
- **Objective**: les armures et PA (Points d'Armure) par zone corporelle
- **In scope**:
  - Zones corporelles (Tête/Torse/Bras/Jambes)
  - PA par zone
  - Armures complètes vs pièces
  - Calcul PA total
  - Exemples Warhammer

### #212: Equipment - Qualités armures
- **Path**: equipment/armour-qualities
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [007, 211]
- **Source**: DataQuality.html
- **Objective**: les qualités d'armures
- **In scope**:
  - Liste qualités armures
  - Effets qualités
  - Modification PA
  - Exemples Warhammer

### #213: Equipment - Calcul encombrement total
- **Path**: equipment/encumbrance-calc
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [007, 208]
- **Source**: Character.html
- **Objective**: le calcul de l'encombrement total de l'équipement
- **In scope**:
  - Formule: Somme (enc x quantité)
  - Équipement porté vs stocké
  - Encombrement par catégorie
  - Affichage total
  - Exemples Warhammer

### #214: Equipment - Limite encombrement
- **Path**: equipment/encumbrance-limit
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [213]
- **Source**: Character.html
- **Objective**: la limite d'encombrement selon Force/Endurance
- **In scope**:
  - Formule limite (Force + Endurance)
  - Comparaison avec encombrement porté
  - Affichage limite vs actuel
  - Indicateur dépassement
  - Exemples Warhammer

### #215: Equipment - Pénalités encombrement
- **Path**: equipment/encumbrance-penalties
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [214]
- **Source**: Character.html
- **Objective**: les pénalités si encombrement dépassé
- **In scope**:
  - Paliers de pénalités
  - Modificateurs Mouvement
  - Modificateurs compétences
  - Application automatique
  - Exemples Warhammer

### #216: Equipment - Catégorisation
- **Path**: equipment/categorization
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [208]
- **Source**: DataTrapping.html
- **Objective**: la catégorisation de l'équipement
- **In scope**:
  - Catégories (Armes/Armures/Vêtements/Outils/etc.)
  - Attribution catégorie par type
  - Affichage regroupé
  - Exemples Warhammer

### #217: Equipment - Prix et disponibilité
- **Path**: equipment/pricing
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [007]
- **Source**: DataTrapping.html
- **Objective**: la gestion des prix et disponibilité de l'équipement
- **In scope**:
  - Prix en CO/PA/S
  - Disponibilité (Common/Scarce/Rare/Exotic)
  - Variations régionales
  - Exemples Warhammer

### #218: Equipment - Équipement porté vs stocké
- **Path**: equipment/worn-vs-stored
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [208]
- **Source**: Character.html
- **Objective**: la distinction entre équipement porté et stocké
- **In scope**:
  - État porté/équipé
  - État stocké/dans le sac
  - Impact sur encombrement
  - Changement état
  - Exemples Warhammer

### #219: Equipment - Monnaie
- **Path**: equipment/money
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [208]
- **Source**: Character.html
- **Objective**: la gestion de la monnaie (CO/PA/S)
- **In scope**:
  - 3 types monnaie (Couronne Or/Pistole Argent/Sou)
  - Conversions
  - Poids monnaie
  - Affichage
  - Exemples Warhammer

### #220: Equipment - Validation équipement
- **Path**: equipment/validation
- **Priority**: LOW
- **Phase**: 4
- **Dependencies**: [208, 214]
- **Source**: Character.html
- **Objective**: la validation des règles d'équipement
- **In scope**:
  - Validation encombrement
  - Validation équipement porté (limite armures, etc.)
  - Messages d'avertissement
  - Exemples Warhammer

### #221: Equipment - Affichage inventaire
- **Path**: equipment/display
- **Priority**: MEDIUM
- **Phase**: 4
- **Dependencies**: [208]
- **Source**: Character.html
- **Objective**: l'affichage de l'inventaire du personnage
- **In scope**:
  - Liste équipement organisée
  - Détails par objet
  - Quantités et états
  - Encombrement affiché
  - Exemples Warhammer

---

## ADMINISTRATION (#222-#236)

### #222: Admin - Interface admin
- **Path**: admin/interface
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: []
- **Source**: Admin.html
- **Objective**: l'interface d'administration avec authentification
- **In scope**:
  - Page login admin
  - Authentification
  - Menu admin
  - Protection routes
  - Exemples Warhammer

### #223: Admin - Édition table species
- **Path**: admin/edit-species
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [001, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table species en mode admin
- **In scope**:
  - Interface édition species
  - Ajout/modification/suppression
  - Validation données
  - Sauvegarde
  - Exemples Warhammer

### #224: Admin - Édition table careers
- **Path**: admin/edit-careers
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [002, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table careers en mode admin
- **In scope**:
  - Interface édition careers
  - Ajout/modification/suppression
  - Validation données
  - Sauvegarde
  - Exemples Warhammer

### #225: Admin - Édition table talents
- **Path**: admin/edit-talents
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [004, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table talents en mode admin
- **In scope**:
  - Interface édition talents
  - Ajout/modification/suppression
  - Gestion effets talents
  - Validation données
  - Exemples Warhammer

### #226: Admin - Édition table skills
- **Path**: admin/edit-skills
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [005, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table skills en mode admin
- **In scope**:
  - Interface édition skills
  - Ajout/modification/suppression
  - Validation données
  - Exemples Warhammer

### #227: Admin - Édition table spells
- **Path**: admin/edit-spells
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [006, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table spells en mode admin
- **In scope**:
  - Interface édition spells
  - Ajout/modification/suppression
  - Gestion lores
  - Validation données
  - Exemples Warhammer

### #228: Admin - Édition table trappings
- **Path**: admin/edit-trappings
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [007, 222]
- **Source**: EditHelper.html
- **Objective**: l'édition de la table trappings en mode admin
- **In scope**:
  - Interface édition trappings
  - Ajout/modification/suppression
  - Gestion qualités
  - Validation données
  - Exemples Warhammer

### #229: Admin - Édition autres tables
- **Path**: admin/edit-other-tables
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: l'édition des autres tables de données en mode admin
- **In scope**:
  - Interface édition tables simples
  - Lores, Gods, Stars, etc.
  - Ajout/modification/suppression
  - Validation données
  - Exemples Warhammer

### #230: Admin - Validation données admin
- **Path**: admin/validation
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: la validation des modifications admin avant sauvegarde
- **In scope**:
  - Validation schémas JSON
  - Validation cohérence données
  - Détection doublons
  - Messages d'erreur
  - Exemples Warhammer

### #231: Admin - Sauvegarde modifications
- **Path**: admin/save
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [222, 230]
- **Source**: EditHelper.html
- **Objective**: la sauvegarde des modifications admin dans les tables
- **In scope**:
  - Écriture Google Sheets
  - Backup avant modification
  - Confirmation sauvegarde
  - Rollback si erreur
  - Exemples Warhammer

### #232: Admin - Import données JSON
- **Path**: admin/import-json
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: l'import de données JSON en mode admin
- **In scope**:
  - Upload fichiers JSON
  - Validation format
  - Import données
  - Fusion avec existant
  - Exemples Warhammer

### #233: Admin - Export données JSON
- **Path**: admin/export-json
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: l'export des données en JSON depuis l'admin
- **In scope**:
  - Export tables complètes
  - Export sélection
  - Format JSON
  - Téléchargement
  - Exemples Warhammer

### #234: Admin - Gestion contenu personnalisé
- **Path**: admin/custom-content
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: la gestion du contenu personnalisé (homebrew)
- **In scope**:
  - Création contenu custom
  - Distinction officiel/homebrew
  - Partage contenu
  - Validation
  - Exemples Warhammer

### #235: Admin - Prévisualisation modifications
- **Path**: admin/preview
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222]
- **Source**: EditHelper.html
- **Objective**: la prévisualisation des modifications avant sauvegarde
- **In scope**:
  - Mode prévisualisation
  - Affichage avant/après
  - Test modifications
  - Validation visuelle
  - Exemples Warhammer

### #236: Admin - Historique modifications
- **Path**: admin/history
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [222, 231]
- **Source**: EditHelper.html
- **Objective**: l'historique des modifications admin
- **In scope**:
  - Log modifications
  - Auteur et date
  - Comparaison versions
  - Rollback possible
  - Exemples Warhammer

---

## IMPORT/EXPORT (#237-#250)

### #237: Import/Export - Export Foundry vue d'ensemble
- **Path**: import-export/foundry-overview
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [145]
- **Source**: FoundryHelper.html
- **Objective**: la vue d'ensemble de l'export Foundry VTT
- **In scope**:
  - Format Foundry VTT
  - Structure données
  - Compatibilité versions
  - Processus export
  - Exemples Warhammer

### #238: Import/Export - Mapping IDs Foundry
- **Path**: import-export/foundry-mapping
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237]
- **Source**: FoundryHelper.html
- **Objective**: le mapping des IDs entre l'app et Foundry VTT
- **In scope**:
  - Table mapping IDs
  - Correspondances entités
  - Résolution conflits
  - Génération nouveaux IDs
  - Exemples Warhammer

### #239: Import/Export - Export caractéristiques Foundry
- **Path**: import-export/foundry-characteristics
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237, 148]
- **Source**: FoundryHelper.html
- **Objective**: l'export des caractéristiques au format Foundry
- **In scope**:
  - Mapping caractéristiques
  - Format Foundry
  - Calculs préservés
  - Exemples Warhammer

### #240: Import/Export - Export compétences Foundry
- **Path**: import-export/foundry-skills
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237, 149]
- **Source**: FoundryHelper.html
- **Objective**: l'export des compétences au format Foundry
- **In scope**:
  - Mapping compétences
  - Spécialisations
  - Avances
  - Format Foundry
  - Exemples Warhammer

### #241: Import/Export - Export talents Foundry
- **Path**: import-export/foundry-talents
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237, 150]
- **Source**: FoundryHelper.html
- **Objective**: l'export des talents au format Foundry
- **In scope**:
  - Mapping talents
  - Rangs
  - Effets
  - Format Foundry
  - Exemples Warhammer

### #242: Import/Export - Export équipement Foundry
- **Path**: import-export/foundry-equipment
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237, 153]
- **Source**: FoundryHelper.html
- **Objective**: l'export de l'équipement au format Foundry
- **In scope**:
  - Mapping trappings
  - Armes/armures
  - Quantités
  - Format Foundry
  - Exemples Warhammer

### #243: Import/Export - Export sorts Foundry
- **Path**: import-export/foundry-spells
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [237, 152]
- **Source**: FoundryHelper.html
- **Objective**: l'export des sorts au format Foundry
- **In scope**:
  - Mapping spells
  - Lores
  - CN
  - Format Foundry
  - Exemples Warhammer

### #244: Import/Export - Format JSON Foundry
- **Path**: import-export/foundry-format
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [237]
- **Source**: FoundryHelper.html
- **Objective**: le format JSON complet pour Foundry VTT
- **In scope**:
  - Structure JSON Foundry
  - Champs requis
  - Champs optionnels
  - Validation format
  - Exemples Warhammer

### #245: Import/Export - Validation export Foundry
- **Path**: import-export/foundry-validation
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [244]
- **Source**: FoundryHelper.html
- **Objective**: la validation de l'export Foundry avant téléchargement
- **In scope**:
  - Validation format JSON
  - Validation données complètes
  - Détection erreurs
  - Messages d'erreur
  - Exemples Warhammer

### #246: Import/Export - Import depuis Foundry
- **Path**: import-export/foundry-import
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [237]
- **Source**: FoundryHelper.html
- **Objective**: l'import d'un personnage depuis Foundry VTT
- **In scope**:
  - Upload JSON Foundry
  - Parsing format Foundry
  - Reconstruction personnage
  - Mapping inverse
  - Exemples Warhammer

### #247: Import/Export - Export JSON standard
- **Path**: import-export/json-export
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [145]
- **Source**: Code.js
- **Objective**: l'export JSON standard (non-Foundry) du personnage
- **In scope**:
  - Format JSON simple
  - Structure complète
  - Téléchargement fichier
  - Exemples Warhammer

### #248: Import/Export - Import JSON standard
- **Path**: import-export/json-import
- **Priority**: MEDIUM
- **Phase**: 6
- **Dependencies**: [247]
- **Source**: Code.js
- **Objective**: l'import JSON standard (non-Foundry) d'un personnage
- **In scope**:
  - Upload JSON
  - Validation format
  - Reconstruction personnage
  - Gestion erreurs
  - Exemples Warhammer

### #249: Import/Export - Compatibilité versions
- **Path**: import-export/version-compatibility
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [247]
- **Source**: Code.js
- **Objective**: la gestion de la compatibilité entre versions
- **In scope**:
  - Versioning format
  - Migration données
  - Compatibilité ascendante
  - Messages d'avertissement
  - Exemples Warhammer

### #250: Import/Export - Tests import/export
- **Path**: import-export/tests
- **Priority**: LOW
- **Phase**: 6
- **Dependencies**: [247, 248]
- **Source**: Code.js
- **Objective**: les tests d'import/export pour valider l'intégrité
- **In scope**:
  - Tests round-trip
  - Validation intégrité
  - Tests cas limites
  - Rapports de test
  - Exemples Warhammer

---

FIN DU FICHIER - 251 tickets définis
