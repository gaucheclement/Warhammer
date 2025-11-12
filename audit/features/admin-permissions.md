# Permissions et Contrôle d'Accès

## Objectif

Gère les permissions d'accès à l'interface d'administration et le contrôle des actions autorisées selon le niveau d'authentification.

## Authentification et Accès

**Protection routes**: Accès interface admin réservé administrateurs authentifiés, redirection automatique page login si session non valide, session maintenue pendant utilisation active

**Page login**: Formulaire authentification simple (email/password), validation identifiants côté serveur Google Apps Script, message erreur si échec authentification, pas système récupération mot de passe automatique (gestion manuelle admin principal)

**Durée session**: Session active pendant utilisation, timeout après inactivité (configurable côté serveur), ré-authentification requise si session expirée

## Niveaux d'Autorisation

**Admin complet (actuellement)**: Accès toutes fonctionnalités (création, modification, suppression toutes tables), pas distinction granulaire permissions, un seul niveau admin = accès total

## Contrôle par Fonctionnalité

**Édition tables**: Admin authentifié accès formulaires édition toutes tables référentielles (species, careers, talents, skills, spells, trappings, autres tables)

**Import/Export**: Admin authentifié accès import fichiers JSON (potentiel écrasement données), admin authentifié accès export fichiers JSON (extraction complète données)

**Gestion homebrew**: Admin authentifié création/modification contenu personnalisé (même permissions que contenu officiel), MJ décision autorisation homebrew dans campagne (hors système)

## Restrictions Actuelles

**Pas de permissions granulaires**: Admin = accès complet, impossible restreindre tables spécifiques ou actions spécifiques

## Gestion Joueurs vs Admins

**Joueurs**: Aucun accès interface admin, accès uniquement interface création/gestion personnages, pas création/modification données référentielles, pas import/export données système

**Admins**: Accès complet interface admin, accès interface création/gestion personnages, création/modification toutes données référentielles, import/export sans restriction

**MJ (Maître du Jeu)**: Statut MJ = statut joueur + autorisation validation homebrew (décision hors système), pas accès interface admin sauf si compte admin séparé

## Validation Côté Serveur

**Vérification session**: Chaque requête Google Apps Script vérifie session valide, rejection automatique si non authentifié, redirection page login

**Protection CSRF**: Token CSRF inclus requêtes modification, validation token côté serveur avant autorisation modification

**Validation origine**: Vérification domaine origine requêtes (même domaine Google Apps), rejection requêtes cross-origin non autorisées

## Sécurité Données

**Backup automatique**: Copie état actuel Google Sheets avant chaque modification (rollback si erreur), backup écrasé chaque nouvelle sauvegarde (pas historique complet)

**Rollback automatique**: Si erreur validation ou écriture Google Sheets, restauration automatique état backup, annulation modification complète (pas modification partielle)

**Protection données sensibles**: Pas stockage mots de passe en clair (hachage côté serveur), pas exposition données sensibles dans logs côté client

## Relations

**Dépendances**: admin-ui.md - Interface admin, admin-validation.md - Validation données

**Fonctionnalités liées**: admin-edit-entities.md - Édition tables, admin-batch.md - Opérations batch sensibles

## Limites et Contraintes

**Pas de permissions granulaires**: Un seul niveau admin = accès complet (impossible restreindre)

**Pas de gestion utilisateurs**: Création/modification comptes admin manuelle (configuration serveur)

**Pas d'audit trail**: Pas traçabilité actions admin (qui modifie quoi quand)

**Pas de logs accès**: Pas enregistrement connexions/déconnexions

**Pas de 2FA**: Authentification simple email/password (risque compromission)

**Pas de révocation session**: Impossible forcer déconnexion utilisateur actif

**Pas de protection CSRF**: Pas token validation requêtes (risque attaque cross-site)

**Backup unique**: Un seul backup automatique (écrasé chaque sauvegarde, pas historique versions)
