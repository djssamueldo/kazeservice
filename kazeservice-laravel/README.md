# KazeService — Backend API Laravel

Backend REST API de la plateforme immobilière KazeService.

Technologies : Laravel 11, PHP, MySQL.

## Prérequis

- PHP >= 8.2
- Composer
- MySQL ou MariaDB
- Node.js et npm (pour le frontend React)

## Installation

### 1. Accéder au dossier du backend

```bash
cd kazeservice-laravel
```

### 2. Installer les dépendances

```bash
composer install
```

### 3. Configurer l'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Générez la clé de l'application :

```bash
php artisan key:generate
```

### 4. Configurer la base de données

Créez une base de données MySQL nommée `kazeservice_db`, puis configurez le fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kazeservice_db
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

Adaptez les identifiants à votre installation locale.

### 5. Exécuter les migrations

```bash
php artisan migrate
```

### 6. Créer les comptes de test locaux

Pour créer les comptes de démonstration :

```bash
php artisan db:seed --class=UserSeeder
```

**Attention :** ces comptes sont exclusivement réservés au développement local. Ils ne doivent jamais être utilisés en production.

### 7. Configurer le stockage des fichiers

```bash
php artisan storage:link
```

### 8. Démarrer le serveur

```bash
php artisan serve
```

L'API sera accessible à l'adresse :

`http://localhost:8000`

## Principaux modèles Eloquent

- `User` — Utilisateurs, rôles et permissions
- `Property` — Biens immobiliers
- `Formation` — Formations
- `Appointment` — Rendez-vous
- `Message` — Messages de contact
- `Partner` — Partenaires
- `Agency` — Agences
- `SiteSetting` — Paramètres du site

## Contrôleurs API

Les contrôleurs sont situés dans `app/Http/Controllers/Api/` :

- `AuthController` — Authentification
- `PropertyController` — Gestion des biens
- `FormationController` — Gestion des formations
- `AppointmentController` — Gestion des rendez-vous
- `MessageController` — Gestion des messages
- `PartnerController` — Gestion des partenaires
- `AgencyController` — Gestion des agences
- `ProfileController` — Gestion des profils
- `SettingController` — Paramètres du site

## Routes API

Les routes sont définies dans `routes/api.php`.

Principaux endpoints :

- `/api/auth/*`
- `/api/properties/*`
- `/api/formations/*`
- `/api/appointments/*`
- `/api/messages/*`
- `/api/partners/*`
- `/api/agencies/*`
- `/api/profiles/*`
- `/api/settings`

## Sécurité

- Les variables sensibles doivent rester dans le fichier `.env`.
- Ne publiez jamais vos identifiants de base de données ou clés API.
- Les comptes de test sont réservés à l'environnement local.
- Le fichier `.env.example` sert uniquement de modèle de configuration.