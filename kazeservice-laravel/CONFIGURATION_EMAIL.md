# Configuration de l'envoi d'emails Laravel

## Problème
Les emails de vérification et de réinitialisation de mot de passe ne sont pas envoyés.

## Solution
Configurer le fichier `.env` de Laravel pour utiliser un serveur SMTP.

## Étapes

### 1. Ouvrir le fichier `.env`
Le fichier se trouve à la racine du projet Laravel :
```
kazeservice-laravel/.env
```

### 2. Configurer les variables d'envoi d'emails

Ajoutez ou modifiez les lignes suivantes dans votre fichier `.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Options de configuration selon votre fournisseur

#### Services SMTP Professionnels (Recommandé pour PRODUCTION)

Pour un site immobilier avec plusieurs utilisateurs, utilisez un service SMTP professionnel :

**SendGrid** (Recommandé - Gratuit jusqu'à 100 emails/jour)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.votre-clé-api
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="Kazeservice"
```

**Pour configurer SendGrid :**
1. Créer un compte sur [sendgrid.com](https://sendgrid.com)
2. Allez dans Settings > API Keys
3. Créez une API Key avec "Mail Send" permissions
4. Copiez la clé (commence par "SG.")
5. Configurez le `.env` avec cette clé

**Brevo (ex Sendinblue)** (Gratuit jusqu'à 300 emails/jour)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=votre-login-brevo
MAIL_PASSWORD=votre-clé-smtp
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="Kazeservice"
```

**Pour configurer Brevo :**
1. Créer un compte sur [brevo.com](https://brevo.com)
2. Allez dans SMTP & API > SMTP
3. Créez une clé SMTP
4. Copiez les identifiants
5. Configurez le `.env`

**Mailgun** (Gratuit jusqu'à 5000 emails/mois)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@votre-domaine.com
MAIL_PASSWORD=votre-clé-smtp
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="Kazeservice"
```

**Amazon SES** (Très économique pour gros volumes)
```env
MAIL_MAILER=smtp
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=VOTRE_ACCESS_KEY_ID
MAIL_PASSWORD=VOTRE_SECRET_ACCESS_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="Kazeservice"
```

**SMTP de votre hébergeur** (Souvent gratuit)
Si vous avez un hébergement (OVH, Hostinger, etc.), ils fournissent souvent un serveur SMTP :
1. Connectez-vous à votre panneau d'hébergement
2. Trouvez la section "Emails" ou "SMTP"
3. Créez une adresse email (ex: noreply@votre-domaine.com)
4. Copiez les identifiants SMTP
5. Configurez le `.env`

#### Services pour Développement/Test

**Mailtrap** (Pour tests uniquement - emails ne sont pas réellement envoyés)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre-username-mailtrap
MAIL_PASSWORD=votre-password-mailtrap
MAIL_ENCRYPTION=tls
```

**Gmail** (Pour tests uniquement - Pas recommandé en production)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_ENCRYPTION=tls
```

**Important pour Gmail :**
- Vous devez activer la "Vérification en 2 étapes" sur votre compte Google
- Générer un "Mot de passe d'application" dans les paramètres de sécurité Google
- Utiliser ce mot de passe d'application (pas votre mot de passe habituel)
- Limite de 500 emails/jour - Pas adapté pour la production

### 4. Après modification du fichier `.env`

Exécutez les commandes suivantes dans le terminal Laravel :

```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

### 5. Tester l'envoi d'emails

Vous pouvez tester l'envoi d'emails avec cette commande Artisan :

```bash
php artisan tinker
```

Puis dans Tinker :
```php
\Mail::raw('Test email', function($message) {
    $message->to('votre-email@example.com')->subject('Test Email');
});
```

### 6. Vérifier les logs Laravel

Si les emails ne s'envoient toujours pas, vérifiez les logs :
```
storage/logs/laravel.log
```

## Pourquoi utiliser un service SMTP professionnel ?

**Avantages pour un site immobilier :**
- ✅ Fiabilité élevée (emails ne tombent pas en spam)
- ✅ Pas de limite stricte (ou limites élevées)
- ✅ Statistiques de livraison
- ✅ Gestion des bounces automatique
- ✅ Scalable (des milliers d'emails)
- ✅ Conformité RGPD
- ✅ Templates d'emails personnalisables

**Inconvénients de Gmail en production :**
- ❌ Limite de 500 emails/jour
- ❌ Bloque souvent les envois massifs
- ❌ Nécessite un mot de d'application
- ❌ Pas de statistiques de livraison
- ❌ Risque de blocage du compte

## Sécurité

**IMPORTANT :**
- Ne commitez jamais le fichier `.env` dans Git
- Ne partagez jamais vos mots de passe ou clés API
- Utilisez des clés API spécifiques (pas vos mots de passe habituels)
- En production, utilisez des variables d'environnement sur votre serveur
- Limitez les permissions des clés API (seulement "Mail Send")

## Dépannage

### Erreur : "Connection could not be established"
- Vérifiez que les identifiants SMTP sont corrects
- Vérifiez que le port n'est pas bloqué par votre firewall
- Essayez de changer le port (587 pour TLS, 465 pour SSL)

### Erreur : "Username and Password not accepted"
- Vérifiez que vous utilisez une clé API ou mot de passe correct
- Vérifiez que l'adresse email est correcte
- Pour SendGrid : vérifiez que la clé commence par "SG."

### Erreur : "Email not sent"
- Vérifiez que le service SMTP est actif
- Vérifiez les logs Laravel pour plus de détails
- Vérifiez que le domaine d'envoi est vérifié (pour certains services)

### Erreur : "Rate limit exceeded"
- Vous avez atteint la limite d'emails du service gratuit
- Passez à un plan payant ou changez de service
