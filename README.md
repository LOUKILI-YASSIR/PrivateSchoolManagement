# 🏫 YLSCHOOL — Plateforme de gestion d’un établissement scolaire privé

**YLSCHOOL** est une plateforme web complète dédiée à la **gestion administrative et pédagogique d’un établissement scolaire privé**.

L’objectif principal du projet est de **centraliser, moderniser et automatiser** les différentes opérations liées à la gestion d’une école à travers une interface web moderne, intuitive, sécurisée et évolutive.

La plateforme permet de gérer les **étudiants, professeurs, niveaux, groupes, salles, matières, années scolaires, évaluations et emplois du temps**, tout en proposant des outils avancés de recherche, filtrage, exportation et gestion des utilisateurs.

---

## 📌 Présentation du projet

Dans un établissement scolaire, la gestion des informations administratives et pédagogiques peut devenir complexe lorsque les données sont nombreuses et réparties entre plusieurs systèmes ou fichiers.

**YLSCHOOL** a été conçu pour répondre à cette problématique en proposant une solution centralisée permettant aux différents utilisateurs d'accéder aux fonctionnalités correspondant à leur rôle.

La plateforme repose principalement sur trois profils :

* 👨‍💼 **Administrateur**
* 👨‍🏫 **Professeur**
* 👨‍🎓 **Étudiant**

Chaque utilisateur dispose d'un espace adapté à ses responsabilités et à ses permissions.

L'administrateur possède une vision globale de l'établissement, tandis que les professeurs et les étudiants disposent uniquement des informations et fonctionnalités qui leur sont nécessaires.

---

# 🎯 Objectifs du projet

Les principaux objectifs de YLSCHOOL sont :

* Centraliser les données de l'établissement.
* Simplifier la gestion administrative.
* Faciliter la gestion pédagogique.
* Automatiser certaines tâches répétitives.
* Réduire les erreurs liées à la gestion manuelle.
* Faciliter la consultation des informations.
* Améliorer la gestion des emplois du temps.
* Assurer une gestion sécurisée des utilisateurs.
* Fournir des outils avancés de recherche et de filtrage.
* Permettre l'exportation des données dans plusieurs formats.
* Offrir une interface multilingue.
* Préparer l'application à une évolution future.

---

# 🚀 Fonctionnalités principales

## 👨‍💼 Gestion des utilisateurs et des rôles

YLSCHOOL utilise un système de gestion des rôles permettant de contrôler l'accès aux différentes fonctionnalités de l'application.

### Administrateur

L'administrateur peut gérer l'ensemble des données de l'établissement :

* Étudiants
* Professeurs
* Niveaux
* Groupes
* Salles
* Matières
* Années scolaires
* Évaluations
* Emplois du temps
* Utilisateurs et profils

Il dispose également des outils de recherche, filtrage, sélection, suppression et exportation.

### Professeur

Le professeur peut notamment consulter :

* Son emploi du temps.
* Ses groupes.
* Ses étudiants.
* Les informations pédagogiques qui lui sont associées.
* Les évaluations liées à ses enseignements.

### Étudiant

L'étudiant dispose d'un espace permettant notamment de consulter :

* Ses matières.
* Ses évaluations.
* Ses résultats.
* Son emploi du temps.
* Les informations de son profil.

---

# 🔐 Authentification et sécurité

La sécurité constitue une partie importante de l'application.

Le système prend en charge :

* Authentification des utilisateurs.
* Connexion via plusieurs informations d'identification.
* Gestion des rôles et des permissions.
* Protection des routes de l'application.
* Authentification API avec **Laravel Sanctum**.
* Réinitialisation du mot de passe.
* Authentification à deux facteurs (**2FA**).
* Gestion des préférences de sécurité du profil.

Le mécanisme de réinitialisation du mot de passe peut utiliser plusieurs méthodes selon la configuration du système, notamment :

* Email
* SMS
* Google Authenticator
* Code administrateur

L'accès aux fonctionnalités est contrôlé en fonction du rôle de l'utilisateur.

---

# 🎓 Gestion des étudiants

Le module des étudiants permet à l'administration de centraliser les informations relatives aux étudiants.

Les opérations disponibles comprennent notamment :

* Ajouter un étudiant.
* Modifier les informations d'un étudiant.
* Consulter les informations.
* Supprimer un ou plusieurs étudiants.
* Rechercher un étudiant.
* Filtrer les données.
* Sélectionner plusieurs lignes.
* Exporter les données.

Les formulaires sont organisés afin de faciliter la saisie et la gestion des informations.

---

# 👨‍🏫 Gestion des professeurs

Le système permet également de gérer les informations des professeurs.

L'administration peut :

* Ajouter un professeur.
* Modifier ses informations.
* Consulter son profil.
* Gérer ses affectations.
* Consulter ses groupes.
* Consulter son emploi du temps.
* Supprimer un ou plusieurs professeurs.
* Rechercher et filtrer les données.
* Exporter les informations.

---

# 🏫 Gestion des niveaux et des groupes

YLSCHOOL permet de structurer l'établissement à travers :

* Les années scolaires.
* Les niveaux.
* Les groupes/classes.

Cette organisation permet d'associer correctement :

**Niveau → Groupe → Étudiants → Professeurs → Matières → Emploi du temps**

Cette structure facilite ainsi la gestion globale de l'établissement.

---

# 📚 Gestion des matières

Le module des matières permet de gérer les différentes matières enseignées dans l'établissement.

Les matières peuvent ensuite être utilisées dans :

* Les groupes.
* Les enseignements des professeurs.
* Les évaluations.
* Les emplois du temps.

---

# 🏢 Gestion des salles

Le système permet de gérer les salles disponibles dans l'établissement.

Les informations relatives aux salles peuvent être utilisées lors de la création et de la génération des emplois du temps.

Une contrainte importante prise en compte est la **capacité de la salle par rapport au nombre d'étudiants du groupe**.

---

# 📅 Gestion des années scolaires

La plateforme permet de gérer les différentes années scolaires.

Cette fonctionnalité permet de conserver une organisation cohérente des données scolaires en fonction de l'année concernée.

Les informations peuvent ainsi être associées à une année scolaire spécifique.

---

# 📝 Gestion des évaluations

Le système intègre également la gestion des évaluations et des résultats.

Les évaluations peuvent être associées aux différents éléments pédagogiques de l'établissement.

Le système permet ainsi aux utilisateurs autorisés de consulter les informations correspondant à leur rôle.

Les étudiants peuvent consulter leurs propres évaluations et résultats depuis leur espace.

---

# 🗓️ Gestion intelligente des emplois du temps

L'une des fonctionnalités importantes de **YLSCHOOL** est la gestion des emplois du temps.

Le système propose deux approches :

### ⚙️ Génération automatique

L'administrateur peut générer automatiquement un emploi du temps en utilisant un **algorithme génétique**.

La génération prend en compte plusieurs contraintes, notamment :

* Disponibilité des professeurs.
* Disponibilité des groupes.
* Disponibilité des salles.
* Capacité des salles.
* Nombre d'étudiants dans les groupes.
* Contraintes horaires.
* Nombre maximal de séances par jour pour un professeur.
* Nombre maximal de séances par semaine pour une matière.
* Évitement des conflits entre les différentes ressources.

L'objectif est de produire un emploi du temps respectant au maximum les contraintes définies.

### 🖱️ Création manuelle

L'administrateur peut également créer ou modifier un emploi du temps manuellement grâce à une interface interactive basée sur le **drag & drop**.

Cette approche permet de déplacer facilement les séances et d'ajuster l'organisation des horaires.

### 👨‍🏫 Vue professeur

Le professeur peut consulter son propre emploi du temps.

### 👨‍🎓 Vue étudiant

L'étudiant peut consulter son emploi du temps correspondant à son groupe.

---

# 📊 Tableaux de données avancés

L'application utilise des tableaux interactifs permettant de manipuler efficacement un grand nombre de données.

Les fonctionnalités comprennent notamment :

* Recherche globale.
* Recherche par colonne.
* Filtres avancés.
* Pagination.
* Sélection des lignes.
* Réorganisation des colonnes.
* Redimensionnement des colonnes.
* Colonnes fixes (*sticky columns*).
* Mode plein écran.
* Suppression multiple.
* Consultation et modification des données.

Ces fonctionnalités permettent de rendre la gestion administrative plus rapide et plus pratique.

---

# 📤 Exportation des données

YLSCHOOL permet également d'exporter les données administratives.

Les formats pris en charge comprennent notamment :

* **CSV**
* **Excel**
* **PDF**

L'utilisateur peut choisir les données à exporter, par exemple :

* Tous les enregistrements.
* La page courante.
* Les résultats filtrés.
* Les lignes sélectionnées.
* Certaines colonnes sélectionnées.

Cette fonctionnalité est particulièrement utile pour les opérations administratives et la production de documents.

---

# 📊 Dashboard et statistiques

Chaque utilisateur dispose d'un environnement adapté à son rôle.

### Dashboard Administrateur

L'administrateur bénéficie d'une vue globale permettant d'accéder aux différents modules de gestion de l'établissement.

### Dashboard Professeur

Le professeur dispose d'un espace centré sur :

* Son emploi du temps.
* Ses groupes.
* Ses étudiants.
* Ses évaluations.

### Dashboard Étudiant

L'étudiant dispose d'un espace permettant notamment de consulter :

* Ses matières.
* Ses évaluations.
* Ses résultats.
* Son emploi du temps.

---

# 🌍 Support multilingue

L'application intègre un système d'internationalisation basé sur **react-i18next**.

Les langues prévues dans le projet sont :

* 🇫🇷 Français
* 🇬🇧 English
* 🇩🇪 Deutsch
* 🇪🇸 Español

L'utilisateur peut donc utiliser l'interface dans différentes langues.

---

# 🎨 Interface utilisateur

L'interface a été conçue avec plusieurs bibliothèques modernes de composants et de styles.

Le projet utilise notamment :

* **Material UI**
* **Ant Design**
* **Tailwind CSS**

L'application comprend également des fonctionnalités liées aux préférences d'affichage, notamment les modes clair et sombre.

L'objectif est de proposer une interface moderne, organisée et adaptée aux différents profils d'utilisateurs.

---

# 👤 Gestion du profil

Chaque utilisateur dispose d'un espace de profil permettant de gérer ses informations personnelles et certaines préférences.

Le profil regroupe notamment :

* Informations personnelles.
* Préférences d'interface.
* Paramètres de sécurité.
* Informations liées au compte.

---

# 🖼️ Gestion des images

Le projet comprend également un système dédié à la gestion et à l'importation des images.

Un microservice basé sur **Node.js / Express.js** est utilisé pour certaines opérations liées aux fichiers et aux images.

Le projet utilise notamment **Multer** pour la gestion des fichiers uploadés.

---

# 🏗️ Architecture du projet

YLSCHOOL adopte une architecture de type **client-serveur**.

L'application est organisée autour de plusieurs parties principales :

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│  UI / Routing / State / API  │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       Laravel Backend        │
│                              │
│ Authentication / Business    │
│ Logic / Services / API       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           MySQL              │
│                              │
│        Base de données       │
└──────────────────────────────┘

               │
               │
               ▼
┌──────────────────────────────┐
│   Express.js / Node.js       │
│      Microservice            │
│                              │
│ Gestion des fichiers/images  │
└──────────────────────────────┘
```

Cette séparation permet de distinguer clairement :

* L'interface utilisateur.
* La logique métier.
* L'accès aux données.
* Certains traitements spécialisés.

---

# 💻 Technologies utilisées

## Frontend

Le frontend est développé avec :

* **React 18.3.1**
* **Material UI**
* **Ant Design**
* **React Router**
* **Redux Toolkit**
* **TanStack React Query**
* **Tailwind CSS**
* **react-i18next**
* **React Dropzone**
* **browser-image-compression**
* **Recharts**
* **@hello-pangea/dnd**
* **MUI Date Pickers**
* **react-datepicker**
* **Material React Table**

---

## Backend

Le backend repose principalement sur :

* **Laravel**
* **PHP**
* **REST API**
* **Laravel Sanctum**
* **MySQL**

Laravel assure notamment :

* La logique métier.
* Les API REST.
* L'authentification.
* La gestion des données.
* Les services applicatifs.
* La génération des emplois du temps.

---

## Microservice

Une partie du système repose également sur :

* **Node.js**
* **Express.js**
* **Multer**

Ce microservice est principalement utilisé pour certaines opérations liées à la gestion des images et des fichiers.

---

# 🧠 Algorithme génétique

Une partie particulièrement importante du projet concerne la génération automatique des emplois du temps.

Un **algorithme génétique** est utilisé afin de rechercher une organisation des séances respectant les différentes contraintes définies par l'établissement.

Le principe consiste à générer et évaluer différentes solutions possibles afin de rechercher progressivement une solution satisfaisante.

Les contraintes peuvent concerner :

```text
Professeurs
    │
    ├── Disponibilités
    ├── Nombre de séances/jour
    └── Nombre de séances/semaine
             │
             ▼
Groupes
    │
    ├── Disponibilités
    └── Effectif
             │
             ▼
Salles
    │
    ├── Disponibilités
    └── Capacité
             │
             ▼
Matières
    │
    └── Nombre de séances/semaine
             │
             ▼
      EMPLOI DU TEMPS
```

Cette fonctionnalité permet d'automatiser une tâche qui peut devenir très complexe lorsqu'un établissement possède plusieurs groupes, professeurs, matières et salles.

---

# 🔄 Gestion des données

Les différentes pages de gestion proposent des opérations CRUD :

* **Create** — Création
* **Read** — Consultation
* **Update** — Modification
* **Delete** — Suppression

Les modules disposent également de fonctionnalités supplémentaires :

* Recherche.
* Filtrage.
* Pagination.
* Sélection multiple.
* Suppression multiple.
* Exportation.
* Gestion des colonnes.

---

# 🧪 Tests et qualité du code

Le projet comprend une stratégie de tests couvrant les différentes parties de l'application.

### Frontend

Les tests utilisent notamment :

* **Jest**
* **React Testing Library**

### Backend Laravel

Les tests utilisent :

* **PHPUnit**

### Microservice

Les tests utilisent notamment :

* **Jest**
* **Supertest**

### Qualité

Le projet utilise également :

* **SonarQube**
* **GitHub Actions**

pour contribuer à l'amélioration de la qualité du code et à l'automatisation des processus.

Le rapport indique qu'après les corrections et améliorations, le projet atteint environ **88 % de couverture de tests**.

---

# ⚡ Performance

Le projet prend également en compte la problématique des grandes quantités de données.

Plusieurs mécanismes sont utilisés afin d'améliorer les performances :

* Pagination côté serveur.
* Cache avec React Query.
* Optimisation du rendu des grandes listes.
* Utilisation de `react-window` pour certaines grandes tables/listes.
* Gestion optimisée des requêtes API.

L'objectif est de maintenir une interface fluide même lorsque le volume de données augmente.

---

# 🔒 Gestion des permissions

L'accès aux différentes ressources est contrôlé en fonction du rôle de l'utilisateur.

Le backend utilise notamment un mécanisme de middleware permettant de vérifier le rôle de l'utilisateur avant d'autoriser l'accès à certaines fonctionnalités.

Le frontend utilise également l'état global de l'application pour adapter l'interface et les fonctionnalités disponibles.

---

# 📱 Responsive Design

L'application a été pensée pour être utilisable sur différents formats d'écran.

Le projet dispose notamment d'une adaptation pour les écrans de type tablette.

Cependant, certaines limitations restent présentes sur les smartphones et font partie des améliorations prévues pour les futures versions.

---

# 📂 Organisation fonctionnelle

Les principaux modules de YLSCHOOL peuvent être représentés ainsi :

```text
YLSCHOOL
│
├── 🔐 Authentification & Sécurité
│
├── 👨‍💼 Utilisateurs
│
├── 🎓 Étudiants
│
├── 👨‍🏫 Professeurs
│
├── 🏫 Niveaux
│
├── 👥 Groupes
│
├── 🏢 Salles
│
├── 📚 Matières
│
├── 📅 Années scolaires
│
├── 📝 Évaluations
│
├── 🗓️ Emplois du temps
│
├── 📊 Dashboard & statistiques
│
├── 📤 Exportations
│
├── 🌍 Internationalisation
│
└── 👤 Gestion des profils
```

---

# 🔄 Flux général de l'application

Le fonctionnement général peut être résumé comme suit :

```text
Utilisateur
     │
     ▼
Authentification
     │
     ▼
Vérification du rôle
     │
     ├───────────────┐
     │               │
     ▼               ▼
Administrateur    Professeur / Étudiant
     │               │
     ▼               ▼
Gestion globale    Consultation
     │
     ├── Étudiants
     ├── Professeurs
     ├── Groupes
     ├── Niveaux
     ├── Salles
     ├── Matières
     ├── Évaluations
     └── Emplois du temps
             │
             ▼
     Génération automatique
       ou modification
          manuelle
```

---

# 🛠️ Installation

## Prérequis

Avant d'exécuter le projet, il est nécessaire d'avoir notamment :

* **Node.js**
* **npm**
* **PHP**
* **Composer**
* **MySQL**
* Un serveur local compatible avec Laravel

---

## Installation du frontend

```bash
npm install
```

Puis lancer le serveur de développement :

```bash
npm run dev
```

---

## Installation du backend Laravel

Installer les dépendances :

```bash
composer install
```

Créer et configurer le fichier `.env` :

```bash
cp .env.example .env
```

Générer la clé de l'application :

```bash
php artisan key:generate
```

Configurer ensuite les informations de connexion à la base de données MySQL dans `.env`.

Exécuter les migrations :

```bash
php artisan migrate
```

Ou, pour recréer complètement la base de données avec les données initiales :

```bash
php artisan migrate:fresh --seed
```

Lancer le serveur Laravel :

```bash
php artisan serve
```

---

# 🔌 Communication Frontend / Backend

Le frontend React communique avec le backend Laravel à travers une **API REST**.

Le principe général est :

```text
React
  │
  │ HTTP Requests
  ▼
Laravel REST API
  │
  │ Business Logic
  ▼
MySQL
```

Cette architecture permet de séparer l'interface utilisateur de la logique métier et de la base de données.

---

# 🧩 Principales fonctionnalités techniques

Le projet met en œuvre plusieurs concepts importants du développement web moderne :

* Architecture client-serveur.
* API REST.
* Authentification.
* Autorisation par rôles.
* CRUD.
* Gestion d'état global.
* Gestion du cache.
* Pagination serveur.
* Upload de fichiers.
* Compression d'images.
* Internationalisation.
* Génération automatique d'emploi du temps.
* Algorithme génétique.
* Drag & Drop.
* Export CSV/Excel/PDF.
* Tests unitaires et d'intégration.
* Analyse statique du code.
* CI/CD.

---

# 🔮 Améliorations futures

Plusieurs évolutions sont envisagées pour les prochaines versions du projet :

* Amélioration complète du responsive design pour smartphones.
* Développement d'une application mobile avec **React Native**.
* Ajout de notifications en temps réel avec **WebSockets**.
* Augmentation de la couverture des tests end-to-end.
* Amélioration de la gestion des absences.
* Optimisation des grands exports PDF.
* Réduction de la dépendance aux services externes d'email et SMS.
* Ajout de nouvelles fonctionnalités pédagogiques et administratives.

---

# 📈 Avantages de la solution

YLSCHOOL permet notamment de :

✅ Centraliser les informations de l'établissement.

✅ Réduire les opérations administratives répétitives.

✅ Faciliter la gestion des étudiants et professeurs.

✅ Simplifier la gestion des groupes, salles et matières.

✅ Automatiser la génération des emplois du temps.

✅ Réduire les conflits liés à l'organisation des horaires.

✅ Faciliter la recherche et le filtrage des données.

✅ Exporter facilement les informations.

✅ Sécuriser l'accès aux différentes fonctionnalités.

✅ Proposer une interface multilingue.

✅ Fournir une architecture moderne et évolutive.

---

# 🎓 Contexte académique

**YLSCHOOL** a été réalisé dans le cadre d'un **Projet de Fin d'Études (PFE)**.

Le projet combine plusieurs domaines du développement informatique :

* Développement Frontend.
* Développement Backend.
* Conception de bases de données.
* Développement d'API REST.
* Authentification et sécurité.
* Architecture logicielle.
* Algorithmique.
* Tests logiciels.
* Optimisation des performances.
* CI/CD.
* Conception d'interfaces utilisateur.

---

# 👨‍💻 Auteur

**Loukili Yassir**

Projet de fin d'études — **YLSCHOOL**

**Spécialité : Développement Web Full Stack**

---

# 📄 Licence

Ce projet a été développé dans un contexte académique et professionnel.

Les conditions d'utilisation, de modification et de distribution peuvent être définies selon les besoins du projet.

---

## ⭐ YLSCHOOL

**YLSCHOOL** est une solution de gestion scolaire conçue pour réunir dans une seule plateforme les principales opérations administratives et pédagogiques d'un établissement privé, tout en combinant **React, Laravel, MySQL, Express.js, sécurité, automatisation et algorithmes d'optimisation**.
