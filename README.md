Extrais le fichier ZIP sur ton ordinateur

2. Installer Node.js
   
Va sur le site officiel de Node.js : https://nodejs.org/.
Télécharge la version recommandée (LTS), par exemple, Node.js 20.x ou 22.x 
Installe Node.js en suivant les instructions (sur Windows, macOS, ou Linux).
vérifie que Node.js est bien installé, ouvre un terminal et tape :

Copier
node -v

Cela devrait afficher la version de Node.js (par exemple, v22.14.0).
Vérifie aussi que npm (le gestionnaire de packages de Node.js) est installé :

Copier
npm -v

ça devrait afficher la version de npm (exemple, 10.8.1).

3. Naviguer vers le dossier du projet
Ouvre un terminal (par exemple, PowerShell ou CMD).
Navigue vers le dossier où le projet a été extrait ou cloné.

Par exemple :

bash :

cd C:\Users\Utilisateur\Projets\ticketbot

4. Installe les dépendances
   
Tu dois installer les dépendances avec npm.

Dans le terminal, tape :
bash

Copier
npm install

Cela va lire le fichier package.json et installer toutes les dépendances listées dans le dossier node_modules/. Le fichier package-lock.json garantit que les versions exactes des dépendances sont installées.

5. Configurer le fichier .env

Copier : 

DISCORD_TOKEN=ton_nouveau_token_ici
