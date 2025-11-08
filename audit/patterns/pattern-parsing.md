# Pattern: Parsing de chaînes

## Format général
```
[Signe+Valeur] Nom [(Paramètre)] [Valeur]
```

Composants (seul Nom obligatoire) :
- **Nom** : peut contenir espaces ("Corps à corps")
- **Signe+Valeur** : modificateur (+7, -3)
- **Paramètre** : entre parenthèses
- **Valeur** : nombre sans signe

---

## Séparateurs

**", " entre items** : sépare items distincts
```
"Calme, Charme, Commandement" → 3 items
```

**", " dans paramètre** : énumération pour UN item
```
"Dressé (Dompté, Garder)" → 1 item, 2 valeurs
```

**" ou "** : choix exclusif
```
"Perspicace ou Affable" → choix entre 2
"Animosité (Nains ou Elfes)" → choix dans paramètre
```

---

## 8 Formats

**1. Nom**
```
"Calme" → {nom: "Calme"}
```

**2. Nom (Paramètre)**
```
"Corps à corps (Base)" → {nom: "Corps à corps", param: "Base"}
"Dressé (A, B, C)" → {nom: "Dressé", param: ["A", "B", "C"]}
"Chiffon (1d10)" → {nom: "Chiffon", quantité: "1d10"}
```

Types de paramètres :
- Fixe : `(Base)`
- Choix : `(Au choix)`, `(A ou B)`
- Énumération : `(A, B, C)`
- Quantité : `(3)`, `(1d10)`

**3. Signe+Valeur Nom**
```
"+7 Arme" → {nom: "Arme", modificateur: +7}
```

**4. Signe+Valeur Nom (Paramètre)**
```
"+8 À distance (50)" → {nom: "À distance", modificateur: +8, param: "50"}
```

**5. Nom (Paramètre) Signe+Valeur**
```
"Arme (Bâton) +7" → {nom: "Arme", param: "Bâton", modificateur: +7}
```

**6. Nom Valeur**
```
"Esquive 48" → {nom: "Esquive", valeur: 48}
```
Valeur SANS signe.

**7. Nom (Paramètre) Valeur**
```
"Corps à corps (Base) 52" → {nom: "Corps à corps", param: "Base", valeur: 52}
```

**8. N Talent aléatoire**
```
"3 Talent aléatoire" → {type: "random_talent", quantité: 3}
```

---

## Algorithme

1. Détecter "X Talent aléatoire" → format 8
2. Détecter signe initial (+/-nombre) → extraire modificateur
3. Extraire paramètre entre () → parser " ou " / ", "
4. Extraire nom (avant () ou avant valeur finale)
5. Détecter valeur finale (nombre) → si signe: modificateur, sinon: valeur

Parser gauche → droite. Signe peut être au début ou après paramètre.

---

## Validation

**Nom** : doit exister dans table cible, trimmer espaces

**Paramètre** :
- `(Au choix)` : accepter
- Spécialisation : vérifier liste valide
- Quantité : `1-999` ou `XdY`
- Énumération/Choix : valider chaque élément

**Valeurs** :

| Type | Plage | Table |
|------|-------|-------|
| Modificateur charac | -100 à +100 | Stars |
| Modificateur trait | -20 à +20 | Creatures |
| Niveau | 0-100 | Skills |
| Valeur trait | 1-999 | Creatures |
| Quantité | 1-999 | Trappings |

**Règles spéciales** :
- Stars : signe obligatoire
- Species : "N Talent aléatoire" possible
- CareerLevels characteristics : noms uniquement

---

## Exemples par table

**Species.skills**
```
"Calme, Corps à corps (Base), Langue (Bretonnien)"
→ ["Calme", "Corps à corps (Base)", "Langue (Bretonnien)"]
```

**Species.talents**
```
"Perspicace ou Affable, Destinée, 3 Talent aléatoire"
→ [choix("Perspicace", "Affable"), "Destinée", random(3)]
```

**Creatures.traits**
```
"Arme +7, Taille (Grande), Dressé (Dompté, Garder)"
→ ["Arme +7", "Taille (Grande)", "Dressé (Dompté, Garder)"]
```

**Creatures.skills**
```
"Esquive 48, Corps à corps (Base) 52"
→ ["Esquive 48", "Corps à corps (Base) 52"]
```

**Stars.characteristics**
```
"+2 Force, -3 Intelligence"
→ ["+2 Force", "-3 Intelligence"]
```

---

## Tables concernées

| Table | Champs |
|-------|--------|
| Species | skills, talents |
| CareerLevels | skills, talents, trappings, characteristics |
| Creatures | traits, optionals, skills, talents |
| Stars | characteristics |

---

## Voir aussi
- [pattern-specialisations.md](./pattern-specialisations.md)
- [pattern-talent-aleatoire.md](./pattern-talent-aleatoire.md)
- [pattern-validation-references.md](./pattern-validation-references.md)
