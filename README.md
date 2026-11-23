# KazeService

**Plateforme web de services immobiliers et professionnels**

KazeService est une application web destinée à présenter et gérer des services immobiliers et professionnels à travers une interface moderne et responsive.

La plateforme associe un frontend React à une API REST développée avec Laravel.

## Fonctionnalités

- **Gestion immobilière :** consultation, publication et gestion des biens immobiliers.
- **Transactions immobilières :** présentation des offres et services liés à l'achat et à la vente.
- **Gestion locative :** services d'accompagnement et de gestion des locations.
- **Estimation et vente :** demandes d'estimation et accompagnement des propriétaires.
- **Formations :** présentation et gestion des formations.
- **Placement de personnel :** présentation des services de placement.
- **Services informatiques :** présentation des prestations informatiques.
- **Gestion des rendez-vous :** réception et suivi des demandes.
- **Gestion des messages :** centralisation des demandes des visiteurs.
- **Gestion des partenaires et agences :** administration des informations associées.
- **Espace d'administration :** gestion des contenus, des utilisateurs et des permissions.

## Architecture technique

Le projet est organisé en deux applications indépendantes :

| Application | Technologies |
|---|---|
| Frontend | React 19, Vite, JavaScript, CSS |
| Backend | Laravel 12, PHP |
| Base de données | MySQL |
| API | REST |
| Authentification API | Laravel Sanctum |

### Structure du projet

```text
kazeservices/
│
├── kazeservice-react/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── kazeservice-laravel/
│   ├── app/
│   │   ├── Console/
│   │   ├── Http/
│   │   └── Models/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## Prérequis

Installer les outils suivants :

- PHP 8.2 ou supérieur, avec les extensions nécessaires à Laravel.
- Composer.
- MySQL ou MariaDB.
- Node.js et npm, dans des versions compatibles avec Vite.
- Git.

## Installation

### 1. Récupérer le projet

```bash
git clone URL_DU_DEPOT
cd kazeservices
```

Remplacer `URL_DU_DEPOT` par l'adresse du dépôt GitHub.

### 2. Installer le backend Laravel

```bash
cd kazeservice-laravel
composer install
```

Créer le fichier d'environnement :

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Générer la clé de l'application :

```bash
php artisan key:generate
```

Configurer ensuite les paramètres de connexion à MySQL dans le fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kazeservice_db
DB_USERNAME=root
DB_PASSWORD=
```

Créer au préalable la base de données MySQL, puis exécuter les migrations :

```bash
php artisan migrate
```

Pour créer les comptes de démonstration en environnement local uniquement :

```bash
php artisan db:seed --class=UserSeeder
```

Créer le lien symbolique du stockage public :

```bash
php artisan storage:link
```

Démarrer le serveur Laravel :

```bash
php artisan serve
```

Le backend sera accessible par défaut à l'adresse :

`http://127.0.0.1:8000`

### 3. Installer le frontend React

Ouvrir un autre terminal depuis le dossier racine du projet :

```bash
cd kazeservice-react
npm install
```

Créer le fichier d'environnement :

```powershell
Copy-Item .env.example .env
```

Vérifier l'adresse de l'API dans `.env` :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Démarrer le serveur de développement :

```bash
npm run dev
```

Le frontend sera accessible à l'adresse indiquée par Vite dans le terminal, généralement :

`http://localhost:5173`

## Compilation pour la production

Depuis le dossier `kazeservice-react` :

```bash
npm run build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

Pour le backend, préparer l'environnement de production conformément aux recommandations de Laravel.

## Sécurité

Quelques règles importantes :

- Ne jamais publier les fichiers `.env`.
- Ne jamais intégrer de véritables mots de passe, clés API ou tokens dans le code source.
- Utiliser des identifiants spécifiques à chaque environnement.
- Désactiver le mode debug en production (`APP_DEBUG=false`).
- Configurer correctement les domaines autorisés par Sanctum et les règles CORS.
- Ne jamais exécuter les seeders de démonstration en production.
- Protéger les sauvegardes de bases de données et les fichiers téléversés.

## Documentation complémentaire

Les documentations propres à chaque application sont disponibles dans leurs dossiers respectifs :

- `kazeservice-react/README.md`
- `kazeservice-laravel/README.md`
- `kazeservice-laravel/CONFIGURATION_EMAIL.md`

Les rapports techniques et linguistiques sont également disponibles dans le frontend.

## Licence et utilisation

Projet KazeService.

Les droits d'utilisation, de modification et de redistribution doivent être définis avec le titulaire des droits avant toute réutilisation ou redistribution du projet.