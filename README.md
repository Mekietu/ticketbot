# TicketBot

Un bot Discord pour gérer un système de tickets avec un menu déroulant personnalisé.

## Prérequis

- [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
- Un compte Discord et une application bot (voir [Discord Developer Portal](https://discord.com/developers/applications))

## Installation

### 1. Télécharger et extraire le projet

- Si tu as téléchargé le projet sous forme de fichier ZIP depuis GitHub :
  - Extrais le fichier ZIP sur ton ordinateur (par exemple, dans un dossier comme `C:\Users\Utilisateur\Projets\ticketbot`).

- Si tu as cloné le dépôt avec Git :
  ```bash
  git clone <URL_DU_DEPOT>
  ```
  Remplace `<URL_DU_DEPOT>` par l'URL de ton dépôt GitHub (par exemple, `https://github.com/Mekietu/ticketbot.git`).

### 2. Installer Node.js

1. Va sur le site officiel de Node.js : [https://nodejs.org/](https://nodejs.org/).
2. Télécharge la version recommandée (LTS), par exemple, Node.js 20.x ou 22.x.
3. Installe Node.js en suivant les instructions pour ton système d'exploitation (Windows, macOS, ou Linux).
4. Pour vérifier que Node.js est bien installé, ouvre un terminal et tape :
   ```bash
   node -v
   ```
   Cela devrait afficher la version de Node.js (par exemple, `v22.14.0`).
5. Vérifie aussi que `npm` (le gestionnaire de packages de Node.js) est installé :
   ```bash
   npm -v
   ```
   Cela devrait afficher la version de npm (par exemple, `10.8.1`).

### 3. Naviguer vers le dossier du projet

1. Ouvre un terminal :
   - Sur Windows : utilise PowerShell ou CMD.
   - Sur macOS/Linux : utilise le Terminal.
2. Navigue vers le dossier où le projet a été extrait ou cloné. Par exemple :
   ```bash
   cd C:\Users\Utilisateur\Projets\ticketbot
   ```

### 4. Installer les dépendances

Tu dois installer les dépendances listées dans le fichier `package.json` avec `npm`.

1. Dans le terminal, tape :
   ```bash
   npm install
   ```
2. Cela va lire le fichier `package.json` et installer toutes les dépendances dans le dossier `node_modules/`. Le fichier `package-lock.json` garantit que les versions exactes des dépendances sont installées.

### 5. Configurer le fichier `.env`

Le fichier `.env` contient les variables d'environnement nécessaires pour faire fonctionner le bot, notamment le token Discord.

1. Ouvre le fichier `.env` dans le dossier du projet avec un éditeur de texte (par exemple, Notepad, Visual Studio Code).
2. Ajoute ou remplace la ligne suivante avec le token de ton bot Discord :
   ```
   DISCORD_TOKEN=ton_nouveau_token_ici
   ```
   - Pour obtenir un token :
     1. Va sur le [Discord Developer Portal](https://discord.com/developers/applications).
     2. Crée une nouvelle application et ajoute un bot.
     3. Copie le token et ajoute-le au fichier `.env`.
3. Enregistre le fichier `.env`.

## Prochaines étapes

Pour continuer la configuration et démarrer le bot, suis les étapes supplémentaires suivantes (non incluses dans cet extrait) :

- Mettre à jour l'ID du bot dans `events/ready.js`.
- Activer les intents privilégiés dans le Discord Developer Portal.
- Inviter le bot sur un serveur Discord.
- Démarrer le bot avec `node index.js`.

Consulte la section complète dans le fichier `README.md` pour toutes les instructions.

## Problèmes courants

- **Erreur "Error [TokenInvalid]: An invalid token was provided"** : Vérifie que le token dans `.env` est correct et non révoqué.
- **Erreur "Used disallowed intents"** : Active les intents privilégiés dans le Discord Developer Portal.

## Contribution

Si tu veux contribuer, ouvre une issue ou une pull request sur GitHub.

## Licence

Ce projet est sous licence MIT.
