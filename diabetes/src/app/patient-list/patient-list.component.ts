import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})

export class PatientListComponent {
  private service = inject(PatientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchTerm: string = '';

  selectedPatient: any = null;

  ngOnInit() {
    this.service.getAll().subscribe(data => {
      this.patients = data;

      const filter = this.route.snapshot.queryParamMap.get('filter') || 'all';
      this.applyFilter(filter);
    });
  }
goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  applyFilter(filter: string) {
    if (filter === 'diabetic') {
      this.filteredPatients = this.patients.filter(p => p.prediction?.estDiabetique);
    } else if (filter === 'nonDiabetic') {
      this.filteredPatients = this.patients.filter(p => !p.prediction?.estDiabetique);
    } else {
      this.filteredPatients = this.patients;
    }
  }

  applySearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.filteredPatients.filter(p =>
      p.nom.toLowerCase().includes(term) || p.prenom.toLowerCase().includes(term)
    );
  }

  editPatient(patient: any) {
    // Créer une copie pour éviter de modifier directement la liste
    this.selectedPatient = { ...patient };
  }

  savePatient() {
    this.service.update(this.selectedPatient.id, this.selectedPatient).subscribe(updated => {
      // Mettre à jour la liste locale
      const index = this.patients.findIndex(p => p.id === updated.id);
      if (index !== -1) this.patients[index] = updated;

      this.applySearch(); // réappliquer le filtre
      this.selectedPatient = null; // fermer le formulaire
    });
  }

  cancelEdit() {
    this.selectedPatient = null;
  }
}
