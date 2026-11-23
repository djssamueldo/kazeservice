# Kazeservices — Site React + Laravel Backend

## Démarrer le projet

Dans le dossier `kazeservice-react`, exécutez :

```bash
npm install
npm run dev
```

## Connecter le backend Laravel

1. Copiez `.env.example` vers `.env` à la racine du projet React.
2. Configurez l'URL de l'API Laravel :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

3. Assurez-vous que le serveur Laravel est démarré (voir le README Laravel).

Tant que `.env` n'est pas configuré, le site peut fonctionner avec les données de démonstration disponibles dans `src/data/`.

## Comptes de test — Développement local uniquement

Pour créer les comptes de test, démarrez le backend Laravel, ouvrez un terminal dans le dossier `kazeservice-laravel` et exécutez :

```bash
php artisan db:seed
```

Les comptes suivants sont réservés aux tests en environnement local :

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@kazeservice.com | admin123 |
| Staff | staff@kazeservice.com | staff123 |
| Agent | agent@kazeservice.com | agent123 |
| Client | client@test.com | client123 |

**Attention :** ces identifiants sont publics et ne doivent jamais être utilisés en production. Avant tout déploiement, configurez une procédure de création d'administrateur avec un mot de passe sécurisé.

## Donner un accès limité à un deuxième profil (staff)

Un compte avec `role = 'client'` peut recevoir des permissions ciblées, page par page, sans accéder aux pages Biens et Partenaires, qui restent réservées au rôle `admin`.

Deux méthodes permettent d'attribuer ces permissions :

- **Depuis l'administration :** connectez-vous avec le compte administrateur principal, ouvrez l'onglet Accès et cochez les pages autorisées pour le profil concerné (Agences, Formations, Rendez-vous, Messages, Réglages).
- **Manuellement dans la base de données :** modifiez la colonne `permissions` de la table `users`.

Exemple :

```json
{"agences": true, "formations": true}
```

## Structure du projet

```text
src/
├── api/          → logique de communication avec l'API Laravel
├── data/         → données de démonstration
├── components/   → composants partagés
├── pages/        → pages de l'application
└── lib/          → client API centralisé
```

## Build de production

Pour générer la version de production :

```bash
npm run build
```

Les fichiers générés sont placés dans le dossier `dist/`.