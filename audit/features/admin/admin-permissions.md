# Admin - Permissions

## Vue d'ensemble

Gestion permissions accès interface admin et contrôle actions.

## Authentification

Protection routes : Accès réservé admins authentifiés, redirection login si non valide.

Page login : Formulaire email/password, validation serveur, pas récupération mot de passe auto.

Durée session : Active pendant utilisation, timeout inactivité, ré-authentification si expirée.

## Niveaux autorisation

Admin complet : Accès toutes fonctionnalités (création, modification, suppression toutes tables).

Pas distinction granulaire : Un seul niveau admin = accès total.

## Contrôle

Édition tables : Admin accès formulaires toutes tables.

Import/Export : Admin accès import/export JSON complet.

Gestion homebrew : Admin création/modification contenu personnalisé.

## Joueurs vs Admins

Joueurs : Aucun accès admin, accès personnages uniquement.

Admins : Accès complet admin + personnages.

MJ : Statut joueur + validation homebrew (hors système).

## Validation serveur

Vérification session : Chaque requête vérifie session valide.

Protection CSRF : Token validation requêtes modification.

Validation origine : Vérification domaine, rejection cross-origin.

## Sécurité données

Backup automatique : Copie avant modification, rollback si erreur.

Un seul backup : Écrasé chaque sauvegarde, pas historique.

Protection sensibles : Pas mots de passe clair (hachage serveur).

## Limites

Pas permissions granulaires, pas gestion utilisateurs, pas audit trail, pas logs accès, pas 2FA, pas révocation session, backup unique.

## Voir aussi

- [admin-ui.md](./admin-ui.md)
- [admin-validation.md](./admin-validation.md)
- [admin-edit-entities.md](./admin-edit-entities.md)
