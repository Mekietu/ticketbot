élécharger et extraire le projet
La personne doit d'abord cloner ou télécharger le dépôt GitHub. Puisqu'il est privé, tu devras lui donner un accès (via GitHub, en l'ajoutant comme collaborateur).
Si elle clone le dépôt :
bash


git clone <URL_DU_DEPOT>

Remplace <URL_DU_DEPOT> par l'URL de ton dépôt GitHub (par exemple, https://github.com/Mekietu/ticketbot.git).

Si elle télécharge le dépôt :

Clique sur le bouton vert "Code" sur GitHub, puis sur "Download ZIP".

Extrais le fichier ZIP sur son ordinateur (par exemple, dans un dossier comme C:\Users\Utilisateur\Projets\ticketbot).

2. Installer Node.js
   
Ton bot est écrit en JavaScript et utilise Node.js. tu doit donc installer Node.js si ce n'est pas déjà fait.
Va sur le site officiel de Node.js : https://nodejs.org/.
Télécharge la version recommandée (LTS), par exemple, Node.js 20.x ou 22.x 
Installe Node.js en suivant les instructions (sur Windows, macOS, ou Linux).
Pour vérifier que Node.js est bien installé, ouvre un terminal et tape :

Copier
node -v

Cela devrait afficher la version de Node.js (par exemple, v22.14.0).
Vérifie aussi que npm (le gestionnaire de packages de Node.js) est installé :


Copier
npm -v

Cela devrait afficher la version de npm (par exemple, 10.8.1).

3. Naviguer vers le dossier du projet
Ouvre un terminal (par exemple, PowerShell ou CMD sur Windows, Terminal sur macOS/Linux).
Navigue vers le dossier où le projet a été extrait ou cloné.
Par exemple :

bash :

cd C:\Users\Utilisateur\Projets\ticketbot

4. Installer les dépendances
   
Le projet inclut un fichier package.json qui liste les dépendances nécessaires (discord.js, better-sqlite3, dotenv). Tu dois installer ces dépendances avec npm.
Dans le terminal, tape :
bash

Copier
npm install

Cela va lire le fichier package.json et installer toutes les dépendances listées dans le dossier node_modules/. Le fichier package-lock.json garantit que les versions exactes des dépendances sont installées.

5. Configurer le fichier .env

Copier
DISCORD_TOKEN=ton_nouveau_token_ici
