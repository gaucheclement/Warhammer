# Table Skills - Base de Connaissances

## Vue d'ensemble

La table Skills contient toutes les compétences disponibles dans Warhammer Fantasy Roleplay 4e édition. Chaque compétence représente un domaine d'expertise qu'un personnage peut développer et utiliser en jeu.

## Structure des données

### Champs principaux

**index** (numéro)
- Identifiant unique de la compétence
- Séquentiel de 0 à N
- Exemple : 0 pour "Art", 8 pour "Corps à corps"

**label** (texte)
- Nom de la compétence en français
- Unique dans la table
- Exemples : "Art", "Athlétisme", "Charme", "Corps à corps"

**characteristic** (texte)
- Caractéristique associée à la compétence pour les tests
- Valeurs possibles : Dextérité, Agilité, Intelligence, Force Mentale, Sociabilité, Capacité de Combat, Capacité de Tir, Force, Initiative, Endurance
- Définit quel attribut du personnage sert de base aux tests
- Exemple : "Art" utilise "Dextérité", "Calme" utilise "Force Mentale"

**desc** (HTML)
- Description complète de la compétence
- Contient les règles d'utilisation
- Inclut des balises HTML (br, table, ul, li, b, i)
- Peut être très long (plusieurs paragraphes)
- Explique : utilisation générale, tests requis, utilisation en combat

**type** (texte)
- Classification de la compétence
- Valeurs : "base" ou "avancée"
- **Compétence de base** : accessible à tous, utilisable sans formation spéciale
- **Compétence avancée** : requiert une formation, listée dans les carrières
- Exemples base : "Athlétisme", "Calme", "Charme", "Esquive"
- Exemples avancée : "Crochetage", "Guérison", "Focalisation", "Langue"

**example** (texte)
- Exemple concret d'utilisation en jeu
- Souvent vide pour les compétences simples
- Exemple pour "Art" : Irina doit peindre un portrait noble nécessitant un test étendu de 10 DR
- Exemple pour "Commandement" : Lord Ludwig utilise 5 DR pour distribuer des Avantages à ses gardes

**specs** (texte)
- Liste des spécialisations possibles séparées par virgules
- Vide si la compétence n'est pas groupée
- Transformé en tableau pour l'utilisation
- Exemples :
  - "Art" : "Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage"
  - "Corps à corps" : "Armes d'hast, À deux mains, Bagarre, Base, Cavalerie, Escrime, Fléau, Parade"
  - "Focalisation" : "Aqshy, Azyr, Chamon, Dhar, Ghur, Ghyran, Hysh, Shyish, Ulgu" (Vents de Magie)
  - "Discrétion" : "Rurale, Souterrains, Urbaine"

**book** (texte)
- Référence du livre source
- Valeurs : "LDB" (Livre De Base), "VDLM" (Vent De La Magie)
- Permet de tracer l'origine de la compétence

**page** (numéro)
- Numéro de page dans le livre source
- Référence pour consulter les règles officielles

## Logique métier

### Compétences groupées vs non groupées

**Compétence groupée** (avec spécialisations)
- Le champ specs contient une liste de spécialisations
- Le personnage doit choisir une spécialisation à l'acquisition
- Chaque spécialisation est une compétence distincte
- Exemples : "Art (Peinture)", "Corps à corps (Escrime)", "Langue (Bretonnien)"

**Compétence non groupée**
- Le champ specs est vide
- S'acquiert une seule fois
- Exemples : "Athlétisme", "Calme", "Esquive"

**Cas particulier : Focalisation**
- À la fois groupée (avec spécialisations de Vents de Magie) pour les mages formés
- Et non groupée pour ceux qui ne sont pas formés à la magie
- Seule compétence avec ce double statut

### Progression et avancées

**Acquisition**
- Les compétences de base peuvent être apprises par tout personnage
- Les compétences avancées nécessitent qu'elles soient dans la carrière actuelle ou passée
- Les carrières définissent quelles compétences sont accessibles (voir audit/database/careers.md)

**Avancées**
- Chaque compétence peut être avancée de 0 à N fois
- Chaque avancée coûte de l'XP (voir audit/business-rules/calculs-xp-progression.md)
- Les avancées augmentent la valeur de test de la compétence
- Calcul : Caractéristique de base + Avancées

**Exemple**
- Personnage avec Dextérité 35 et Art (Peinture) +10
- Valeur de test = 35 + 10 = 45%
- Lance 1d100, doit faire ≤ 45 pour réussir

### Utilisation en combat

**Directes** : Corps à corps, Projectiles, Esquive
**Tactiques** : Commandement, Intimidation, Intuition, Charme
**Situationnelles** : Athlétisme, Escalade, Chevaucher, Discrétion
**Tests opposés** : Charme/Intimidation vs Calme, Discrétion/Escamotage vs Perception

## Relations avec autres tables

**Characteristics** (voir audit/database/characteristics.md) : Chaque skill liée à 1 caractéristique définissant valeur de base (10 possibles)

**Species** (voir audit/database/species.md) : Espèce donne compétences de départ avec specs prédéfinies ou au choix

**Careers/CareerLevels** (voir audit/database/careers.md, careerLevels.md) : Niveaux listent compétences accessibles, déterminent coût XP

**Talents** (voir audit/database/talents.md) : Modifient compétences, ajoutent skills (ex: "Mage Mineur" → Focalisation + Langue Magick)

**Spells/Lores** (voir audit/database/lores.md) : Focalisation + Langue (Magick) requises pour sorts, chaque spec Focalisation = 1 Vent

## Exemples de données

**Art** : base, Dextérité, groupée (Calligraphie, Peinture, Sculpture...) - créer des œuvres

**Athlétisme** : base, Agilité, non groupée - courir, sauter, détermine le Mouvement en combat

**Focalisation** : avancée, Force Mentale, 9 Vents de Magie - seule compétence groupée ET non groupée, requise pour lancer des sorts

**Corps à corps** : base, Capacité de Combat, groupée (Bagarre, Escrime, Parade...) - combat rapproché

**Guérison** : avancée, Intelligence - soigner blessures/maladies, stopper États Hémorragiques

## Validation et cohérence

**Champs obligatoires** : index (unique, séquentiel), label (unique), characteristic (valide), type (base/avancée), desc, example, specs, book, page

**Règles**
- specs non vide = compétence groupée nécessitant spécialisation (format : "Item1, Item2, Item3")
- specs vide = compétence non groupée
- characteristic doit exister dans table Characteristics
- Type base = accessible à tous, type avancée = nécessite carrière
- Cohérence : compétences martiales sur CC/CT, sociales sur Soc/FM, mentales sur Int/FM

## Notes de conception

**Format HTML** : Descriptions avec balises HTML (tables, listes, emphase). Voir [../patterns/pattern-descriptions-html.md](../patterns/pattern-descriptions-html.md)

**Références croisées** : Descriptions mentionnent compétences/talents/états, transformables en liens pour navigation UI

## Tests de cohérence

**Intégrité** : Index uniques et séquentiels (0→N), champs obligatoires présents, labels uniques, type "base"/"avancée" uniquement

**Relations** : characteristic existe dans Characteristics (Agilité, CC, CT, Dex, End, FM, F, I, Int, Soc), specs format "Item1, Item2" (virgule+espace), skills référencées dans species/careerLevels/talents existent

**Logique métier** : Skills universelles en type "base" (Athlétisme, Calme, Esquive, Perception), skills spécialisées en "avancée" (Crochetage, Focalisation, Guérison, Langue), cohérence characteristic-compétence (combat→CC/CT, social→Soc/FM, physique→Ag/F/E, mental→Int/I), Focalisation a exactement 9 Vents (Aqshy, Azyr, Chamon, Dhar, Ghur, Ghyran, Hysh, Shyish, Ulgu), desc non vide (>50 car) et HTML valide

**Limites** : label 3-50 car, desc 50-5000 car, pas caractères spéciaux invalides, book/page cohérents (LDB, VDLM)

**Complétude** : Compétences essentielles présentes (Athlétisme, Calme, Charme, Corps à corps, Esquive, Intuition, Perception, Projectiles, Résistance), chaque characteristic utilisée au moins 1×, specs raisonnables (<100, Métier 30-50)

## Validation des données

**Champ index** : Entier ≥ 0, unique, pas de trous dans la séquence. Erreur: "Index {N} invalide ou dupliqué"

**Champ label** : Texte 3-50 car, unique (insensible casse), lettres/espaces/apostrophes/tirets uniquement. Erreur: "Label '{label}' invalide (longueur, caractères ou doublon)"

**Champ characteristic** : Doit exister dans table Characteristics (10 valeurs possibles). Erreur: "Caractéristique '{char}' inconnue"

**Champ type** : "base" ou "avancée" uniquement. Erreur: "Type '{type}' invalide, attendu 'base' ou 'avancée'"

**Champ desc** : Texte 50-5000 car, HTML valide (balises équilibrées). Erreur: "Description trop courte/longue ou HTML malformé"

**Champ example** : Texte 0-2000 car, peut être vide. Erreur: "Exemple trop long (>{N} caractères)"

**Champ specs** : Vide OU liste format "Item1, Item2, Item3", pas de doublons. Erreur: "Format spécialisations invalide ou doublons détectés"

**Champ book** : Référence valide (LDB, VDLM, etc.). Erreur: "Référence livre '{book}' inconnue"

**Champ page** : Entier > 0. Erreur: "Numéro page invalide"

**Cohérence métier** : Skills universelles → type "base", skills spécialisées → type "avancée", Focalisation → 9 Vents exactement. Erreur: "Incohérence métier: {détail}"
