import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultationService } from '../services/consultation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css'],
})
export class ConsultationFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ConsultationService);
    private auth = inject(AuthService);

  consultation: any = {
    glycemieAJeun: null,
    hba1c: null,
    poids: null,
    taille: null,
    tabac: '',
    tension: false,
    heartDisease: false,
  };

  patientId!: number;
  dernieresMesures: any;

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  save() {
    if (!this.patientId) {
      alert("❌ Patient ID introuvable");
      return;
    }

    // Calcule automatiquement l'IMC si poids et taille sont valides
    if (this.consultation.poids && this.consultation.taille) {
      const tailleM = this.consultation.taille / 100;
      this.consultation.imc = +(this.consultation.poids / (tailleM * tailleM)).toFixed(2);
    }

    this.service.create(this.patientId, this.consultation).subscribe({
    next: (saved) => {
      alert("✅ Consultation enregistrée");

      this.auth.currentUser.subscribe(user => {
      const role = user?.role?.toUpperCase(); // Ex: "PATIENT" ou "MEDECIN"

        if (role === "PATIENT") {
          this.router.navigate(['/dashboardPatient']);
        } else if (role === "MEDECIN") {
          this.service.consultationAdded.next(this.patientId);
          this.router.navigate(['/patient', this.patientId]);
        } else {
          this.router.navigate(['/']); // fallback sécurité
        }
      });
      },
    error: () => alert("❌ Erreur lors de l'enregistrement")
      
  });
  }

  updateConseils() {
    console.log("✅ Conseils mis à jour pour la consultation :", this.dernieresMesures);
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
