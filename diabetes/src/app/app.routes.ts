import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPatientComponent } from './dashboard-patient/dashboard-patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { ConsultationFormComponent } from './consultation-form/consultation-form.component';
import { ConseilsPersonnalisesComponent } from './conseils-personnalises/conseils-personnalises.component';
import { ReadingFormComponent } from './reading-form/reading-form.component';
import { ReadingHistoryComponent } from './reading-history/reading-history.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertesComponent } from './alertes/alertes.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Dashboards
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboardPatient', component: DashboardPatientComponent },

  // Patients
  { path: 'patient', component: PatientListComponent },
  { path: 'patient/:id', component: PatientDetailComponent },

  // Consultation / saisie mesures médecin
  { path: 'patient/:id/consultation/new', component: ConsultationFormComponent },

  // Saisie quotidienne readings patient
  { path: 'patient/:id/reading/new', component: ReadingFormComponent },

  // Historique readings patient
  { path: 'patient/:id/readings', component: ReadingHistoryComponent },

  // Conseils personnalisés
  { path: 'patient/:id/conseils', component: ConseilsPersonnalisesComponent },

  { path: 'patient/:id/profile', component: ProfileComponent },
  { path: 'alerts', component: AlertesComponent },
];
