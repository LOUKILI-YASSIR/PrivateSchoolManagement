# Système de Gestion d'École Privée

## Introduction

Le système de gestion d'école privée est un projet complet basé sur des technologies modernes pour offrir un environnement de gestion avancé aux écoles privées. Il permet la gestion des étudiants, des enseignants, des cours et de nombreuses autres fonctionnalités.

## Composants du projet

Le projet est composé de trois parties principales :

1. **Frontend (React)** : Construit avec React et Tailwind CSS pour offrir une expérience utilisateur fluide et moderne.
2. **Backend (Laravel)** : Basé sur le framework Laravel avec MySQL pour gérer les données et fournir une API RESTful.
3. **Serveur API supplémentaire (Express.js)** : Un serveur Node.js utilisant Express.js, souvent utilisé pour traiter des requêtes rapides ou intégrer d'autres services.

## Prérequis

Pour exécuter le projet localement, assurez-vous d'installer les logiciels suivants :

- **Node.js** (pour le frontend React et le serveur Express)
- **Composer** (pour gérer les dépendances Laravel)
- **PHP** (pour exécuter Laravel)
- **MySQL** (base de données principale du projet)

## Installation et exécution

### 1. Lancer le frontend (React)

```sh
cd ReactFrontEnd
npm install
npm run dev
```

### 2. Lancer le backend (Laravel)

```sh
cd LaravelBackEnd
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3. Lancer le serveur Express (optionnel)

```sh
cd ExpressBackEnd
npm install
node src/server.js
```

## Fonctionnalités principales

- Gestion des utilisateurs (étudiants, enseignants, administrateurs)
- Authentification et autorisation
- Gestion des cours et des classes
- Téléchargement d'images et de fichiers
- Support multilingue (arabe, anglais, français, ...)

## Structure des dossiers

```
PrivateSchoolManagement-main/
│── ReactFrontEnd/        # Frontend React
│── LaravelBackEnd/       # Backend Laravel
│── ExpressBackEnd/       # Serveur supplémentaire Express.js
```

## Contributeurs

Contributeur principal : **Loukili Yassir**

## Licence

Ce projet est open-source et peut être utilisé librement sous la licence [MIT](LICENSE).

