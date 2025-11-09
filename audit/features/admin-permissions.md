# Permissions et Contrôle d'Accès

## Objectif

Gère les permissions d'accès à l'interface d'administration et le contrôle des actions autorisées selon le niveau d'authentification.

## Authentification et Accès

**Protection routes**: Accès interface admin réservé administrateurs authentifiés, redirection automatique page login si session non valide, session maintenue pendant utilisation active

**Page login**: Formulaire authentification simple (email/password), validation identifiants côté serveur Google Apps Script, message erreur si échec authentification, pas système récupération mot de passe automatique (gestion manuelle admin principal)

**Durée session**: Session active pendant utilisation, timeout après inactivité (configurable côté serveur), ré-authentification requise si session expirée

## Niveaux d'Autorisation

**Admin complet (V1 actuel)**: Accès toutes fonctionnalités (création, modification, suppression toutes tables), pas distinction granulaire permissions, un seul niveau admin = accès total

**Permissions granulaires (V2 proposé)**: Admin lecture seule (consultation sans modification), admin édition (modification tables spécifiques), admin complet (toutes opérations toutes tables), admin super (gestion utilisateurs + toutes opérations)

## Contrôle par Fonctionnalité

**Édition tables**: Admin authentifié accès formulaires édition toutes tables référentielles (species, careers, talents, skills, spells, trappings, autres tables)

**Import/Export**: Admin authentifié accès import fichiers JSON (potentiel écrasement données), admin authentifié accès export fichiers JSON (extraction complète données)

**Gestion homebrew**: Admin authentifié création/modification contenu personnalisé (même permissions que contenu officiel), MJ décision autorisation homebrew dans campagne (hors système)

**Historique (non implémenté)**: Consultation logs modifications (admin complet), rollback versions précédentes (admin complet ou super uniquement)

**Gestion utilisateurs (non implémenté)**: Création comptes admin (admin super uniquement), modification permissions (admin super uniquement), suppression comptes (admin super uniquement)

## Restrictions Actuelles

**Pas de permissions granulaires**: Admin = accès complet, impossible restreindre tables spécifiques ou actions spécifiques

**Pas de gestion utilisateurs**: Pas interface création/modification/suppression comptes admin, gestion manuelle configuration serveur

**Pas de logs accès**: Pas traçabilité qui accède quand à quelles données (voir admin-ui.md section Historique)

**Pas d'audit trail**: Pas enregistrement actions sensibles (suppression données, import remplacement complet)

## Gestion Joueurs vs Admins

**Joueurs**: Aucun accès interface admin, accès uniquement interface création/gestion personnages, pas création/modification données référentielles, pas import/export données système

**Admins**: Accès complet interface admin, accès interface création/gestion personnages, création/modification toutes données référentielles, import/export sans restriction

**MJ (Maître du Jeu)**: Statut MJ = statut joueur + autorisation validation homebrew (décision hors système), pas accès interface admin sauf si compte admin séparé

## Validation Côté Serveur

**Vérification session**: Chaque requête Google Apps Script vérifie session valide, rejection automatique si non authentifié, redirection page login

**Protection CSRF**: Token CSRF inclus requêtes modification (V2 recommandé), validation token côté serveur avant autorisation modification

**Validation origine**: Vérification domaine origine requêtes (même domaine Google Apps), rejection requêtes cross-origin non autorisées

## Sécurité Données

**Backup automatique**: Copie état actuel Google Sheets avant chaque modification (rollback si erreur), backup écrasé chaque nouvelle sauvegarde (pas historique complet)

**Rollback automatique**: Si erreur validation ou écriture Google Sheets, restauration automatique état backup, annulation modification complète (pas modification partielle)

**Protection données sensibles**: Pas stockage mots de passe en clair (hachage côté serveur), pas exposition données sensibles dans logs côté client

## Recommandations V2

**Permissions granulaires**: Implémentation rôles (lecture, édition tables spécifiques, édition complète, super admin), configuration permissions par utilisateur ou groupe

**Audit trail complet**: Log toutes actions admin (création, modification, suppression, import, export), traçabilité qui/quand/quoi/pourquoi, consultation logs interface admin

**Gestion utilisateurs**: Interface création/modification comptes admin, attribution permissions granulaires, désactivation comptes (pas suppression pour préserver audit)

**2FA (Two-Factor Authentication)**: Authentification deux facteurs (email + code temporaire), protection comptes admin contre compromission mot de passe

**Session sécurisée**: Token session JWT (JSON Web Token), expiration automatique après inactivité, révocation manuelle possible

**Protection CSRF**: Token CSRF toutes requêtes modification, validation côté serveur systématique

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
