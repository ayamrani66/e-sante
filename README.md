# E-Santé — Plateforme de Prédiction et Suivi du Diabète

Application e-santé complète pour la prédiction du risque de diabète et le suivi de patients, combinant un modèle de Machine Learning, une API de gestion métier et une interface web.

## Architecture

Le projet est composé de trois briques indépendantes :

```
e-sante/
├── app.py                 # API Flask — sert les modèles ML (prédiction)
├── Models/                 # Modèles entraînés (.pkl) — voir section "Modèles ML"
├── PFA_Diabete/            # Backend Spring Boot (Java) — logique métier, base de données
└── diabetes/                # Frontend Angular — interface patient / médecin
```

**Flux de données** : Angular (`diabetes/`) → Spring Boot (`PFA_Diabete/`) → Flask (`app.py`) pour la prédiction ML → réponse renvoyée jusqu'au frontend.

## Fonctionnalités

- Prédiction du risque de diabète (binaire), du type de diabète et des risques associés (cardiovasculaire, néphropathie, rétinopathie, neuropathie...)
- Gestion des patients, consultations et relevés (glycémie, HbA1c, IMC, tension...)
- Système d'alertes automatiques selon les valeurs de santé
- Conseils personnalisés et tableau de bord médecin / patient
- Authentification avec rôles (Médecin / Patient)

## Stack technique

| Composant | Technologies |
|---|---|
| Frontend | Angular 19, Chart.js, jsPDF |
| Backend | Spring Boot 3.5.4, Spring Data JPA, MySQL |
| ML API | Flask, scikit-learn, pandas, joblib |
| Base de données | MySQL |

## Prérequis

- Node.js + Angular CLI
- Java 17+ et Maven
- Python 3.9+
- MySQL 8+

## Installation

### 1. Base de données
Créer une base `pfa_diabete` dans MySQL et importer le schéma (voir `pfa_diabete.sql`).

### 2. API Flask (prédiction ML)
```bash
cd e-sante
pip install flask flask-cors pandas joblib scikit-learn
python app.py
```
L'API démarre sur `http://localhost:5000`.

> **Modèles ML non inclus dans le repo** : `Models/model_type.pkl` dépasse la limite de taille GitHub. Télécharger les 3 fichiers `.pkl` depuis [lien à compléter] et les placer dans `e-sante/Models/` avant de lancer l'API.

### 3. Backend Spring Boot
```bash
cd PFA_Diabete
./mvnw spring-boot:run
```
Configurer `src/main/resources/application.properties` avec vos identifiants MySQL. L'API démarre sur `http://localhost:8080`.

### 4. Frontend Angular
```bash
cd diabetes
npm install
ng serve
```
L'application est accessible sur `http://localhost:4200`.

## Structure du backend (`PFA_Diabete`)

- `Controller/` — endpoints REST (patients, consultations, relevés, alertes, prédictions, risques, recommandations, utilisateurs)
- `entities/` — modèles JPA (Patient, Consultation, Reading, Alert, Risk, Recommandation, User, Prediction)
- `repositories/` — accès aux données (Spring Data JPA)

## Structure du frontend (`diabetes`)

- `login/` — authentification
- `dashboard` / `dashboard-patient/` — tableaux de bord médecin et patient
- `patient-list/`, `patient-detail/` — gestion des patients
- `consultation-form/`, `reading-form/`, `reading-history/` — suivi médical
- `prediction/` — interface de prédiction du risque
- `alertes/`, `conseils-personnalises/` — alertes et recommandations
- `services/` — appels API (auth, patient, prédiction, alertes, conseils, traduction)

## Auteure

Aya Mrani Alaoui — Projet académique (e-santé)

## Licence

Projet académique — usage personnel/pédagogique.
