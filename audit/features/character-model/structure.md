# Character Model - Structure données

## Objectif

Documenter la structure de données du modèle Character, le conteneur central représentant un personnage Warhammer avec toutes ses propriétés, statistiques et progression.

## Contexte Warhammer

Dans Warhammer Fantasy Roleplay, un personnage est défini par:
- Son **espèce** (Humain, Nain, Elfe, Halfling...)
- Sa **carrière** et son niveau dans cette carrière
- Ses **caractéristiques** (Force, Endurance, Agilité...)
- Ses **compétences** apprises
- Ses **talents** acquis
- Son **équipement** (trappings)
- Ses **sorts** s'il est magicien
- Son **expérience** (XP) gagnée et dépensée

## Structure principale

Le modèle Character contient les propriétés de premier niveau suivantes:

### Propriétés de contrôle

**mode**: Type de création
- Valeurs: 'guidé' (wizard) ou 'libre' (free mode)
- Détermine le workflow de création
- Voir [wizard/](../wizard/) pour le mode guidé

**stepIndex**: Indice de l'étape courante
- null = non démarré
- 0-N = étape en cours dans le wizard
- -1 = création terminée

### Propriétés d'identité

**specie**: Espèce du personnage
- Référence vers une espèce (Humain, Nain, Elfe, Halfling)
- Définit caractéristiques de base et talents raciaux
- Voir [database/species.md](../database/species.md)

**careerLevel**: Carrière et niveau
- Référence vers un niveau de carrière (Soldat Niveau 1, Éclaireur Niveau 2...)
- Définit compétences, talents et bonus de carrière
- Historique: peut changer lors de la progression
- Voir [database/career-levels.md](../database/career-levels.md)

**star**: Signe astral
- Détermine bonus aux caractéristiques (+3 à 1 ou 2 caractéristiques)
- Optionnel selon les règles utilisées
- Voir [database/stars.md](../database/stars.md)

**god**: Divinité
- Dieu vénéré (Sigmar, Ulric, Shallya...)
- Déterminé automatiquement par talents "Béni" ou "Invocation"
- null si pas de divinité

**magic**: Domaine magique
- Type de magie pratiquée (null pour non-magiciens)
- Déterminé par les talents de magie acquis

### Collections d'attributs

**characteristics**: Tableau des caractéristiques
- Contient les 10 caractéristiques (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)
- Plus les 5 attributs dérivés (M, BF, BE, PB, Corruption)
- Chaque élément contient: valeur de base, avances, bonus temporaires
- Voir [characteristics.md](./characteristics.md)

**skills**: Tableau des compétences
- Compétences acquises de l'espèce, carrière ou talents
- Inclut spécialisations et avances
- Voir [skills-methods.md](./skills-methods.md)

**talents**: Tableau des talents
- Talents acquis de l'espèce, carrière ou progression
- Gère les rangs multiples et spécialisations
- Voir [talents-methods.md](./talents-methods.md)

**spells**: Tableau des sorts
- Sorts appris (vide pour non-magiciens)
- Organisés par domaine (Arcane, Bénédictions...)
- Voir [spells.md](./spells.md)

**trappings**: Tableau d'équipement
- Items, armes, armures possédés
- Gère quantités et encombrement
- Voir [trappings.md](./trappings.md)

**details**: Tableau de détails personnels
- Âge, taille, couleur des yeux/cheveux, nom
- Informations narratives
- Format: [{type: 'age', value: '25'}, {type: 'name', value: 'Gunther'}...]

### Gestion de l'expérience

**xp**: Objet contenant la gestion XP
```
{
  max: 0,           // XP total disponible
  log: {},          // Historique des dépenses {id: montant}
  used: 0,          // XP déjà dépensé
  tmp_used: 0       // XP dépensé temporairement (non validé)
}
```

Voir [xp.md](./xp.md) pour les détails.

### État aléatoire

**randomState**: Conservation de l'état aléatoire
```
{
  specie: 0,                    // Seed tirage espèce
  imposedSpecie: [],            // Espèces imposées/déjà tirées
  career: 0,                    // Seed tirage carrière
  imposedCareers: [],           // Carrières imposées/déjà tirées
  star: 0,                      // Seed tirage signe astral
  imposedStar: [],              // Signes imposés/déjà tirés
  characteristic: 0,            // Seed tirage caractéristiques
  imposedCharacteristics: {},   // Carac imposées {id: valeur}
  imposedTalents: []            // Talents imposés/déjà tirés
}
```

Permet de reproduire les tirages aléatoires.
Voir [random-state.md](./random-state.md)

## Exemples concrets

### Humain Soldat débutant
- mode: 'guidé', stepIndex: -1
- specie: humain, careerLevel: soldat|1, star: wymund-le-resolu
- characteristics: CC=43 (base30+roll8+advance5), F=32 (base20+roll12)
- skills: Athlétisme (humain), Corps-à-corps Base (soldat|1)
- talents: Résistant (humain)
- spells: [] (non-magicien)
- xp: max=0, used=0

### Nain Prêtre expérimenté
- mode: 'libre', stepIndex: -1
- specie: nain, careerLevel: pretre|3
- god: 'grungni' (détecté via talent Béni)
- characteristics: E=70 (base40+roll10+advance15+talent5)
- talents: Béni (Grungni)
- spells: Bénédiction de Protection, Bénédiction de Force (ajoutés par talent)
- xp: max=2000, used=1850

## Relations entre propriétés

### Dépendances calculées

- **characteristics**: Valeurs impactées par specie (base), star (bonus), talents (modificateurs)
- **skills**: Liste construite depuis specie + careerLevel + talents (qui ajoutent des compétences)
- **spells**: Liste construite depuis talents magiques (Béni, Magie des Arcanes, etc.)
- **god**: Détecté automatiquement depuis talent "Béni" ou "Invocation"
- **magic**: Détecté automatiquement depuis talents de magie

### Cohérence métier

- Si mode='guidé': stepIndex doit progresser séquentiellement
- Si specie présent: characteristics doit avoir les valeurs de base correspondantes
- Si careerLevel présent: skills/talents doivent inclure ceux de la carrière
- Si talents avec addMagic: spells doit contenir les sorts correspondants
- Si talents avec addSkill: skills doit contenir la compétence ajoutée

## Validation

Voir [validation.md](./validation.md) pour les règles de validation complètes.

Contraintes principales:
- mode: obligatoire, valeur 'guidé' ou 'libre'
- specie: obligatoire si stepIndex > 0
- careerLevel: obligatoire si stepIndex > 2
- characteristics: obligatoire, 15 éléments (10 carac + 5 dérivées)
- xp.max >= xp.used + xp.tmp_used

## Voir aussi

- [specie-methods.md](./specie-methods.md) - Méthodes de gestion de l'espèce
- [career-methods.md](./career-methods.md) - Méthodes de gestion de la carrière
- [characteristics.md](./characteristics.md) - Gestion des caractéristiques
- [skills-methods.md](./skills-methods.md) - Gestion des compétences
- [talents-methods.md](./talents-methods.md) - Gestion des talents
- [xp.md](./xp.md) - Gestion de l'expérience
- [save-load.md](./save-load.md) - Sauvegarde et chargement
