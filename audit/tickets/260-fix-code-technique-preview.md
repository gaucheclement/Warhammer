---
id: 260
status: TODO
priority: CRITICAL
domain: meta
dependencies: [259]
phase: 9
---

# Meta - Correction code technique dans preview.md

## Objectif
Supprimer le code JavaScript technique dans audit/features/admin/preview.md (lignes 50-63) et le remplacer par une description fonctionnelle

## Périmètre
**DANS le scope:**
- Suppression code JavaScript (lignes 50-63)
- Réécriture en description fonctionnelle métier
- Respect règle "Zéro code technique"

**HORS scope:**
- Modification autres fichiers
- Ajout nouvelles fonctionnalités

## Critères d'acceptance
- [ ] Code JavaScript supprimé (lignes 50-63)
- [ ] Description fonctionnelle rédigée (comportement bouton Prévisualiser)
- [ ] Aucun code technique restant
- [ ] Fichier < 200 lignes
- [ ] Validation grep aucun code technique détecté

## Détails technique (depuis rapport consolidation)

**Code à supprimer (lignes 50-63)** :
```javascript
oThat.otherAction = function (el) {
    el.html('Prévisualiser');
    el.off('click').on('click', function () {
        if ($('.right_panel').find('[name="Description"]:visible').val()) {
            const regex = /(\n)+/gmi;
            Helper.showPopin($('.right_panel').find('[name="Description"]').val().trim()
                .replace(new RegExp("[\n]+$", 'gmi'), "")
                .replace(regex, "<br><br>")
                .replace(''', "'"), CharGen);
        }
    });
};
```

**Remplacement par** :
Description fonctionnelle du comportement :
- Bouton "Prévisualiser" dans panel d'édition
- Clic → affichage popup avec description formatée
- Traitement : suppression retours à la ligne multiples, conversion en HTML
- Condition : champ Description doit être rempli

## Effort estimé
30 minutes

## Validation finale
- [ ] grep -r "function\|const\|class\|=>" audit/features/admin/preview.md retourne vide
- [ ] Fichier lisible et description claire
- [ ] Commit avec message explicite
