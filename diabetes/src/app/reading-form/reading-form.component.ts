import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reading-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reading-form.component.html',
  styleUrls: ['./reading-form.component.css']
})
export class ReadingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  patientId!: number;

  reading: any = {
    glycAvantPetitDejeuner: null,
    glycApresPetitDejeuner: null,
    glycAvantDejeuner: null,
    glycApresDejeuner: null,
    glycAvantDiner: null,
    glycApresDiner: null
  };

  apiUrl = 'http://localhost:8080/api/readings';
  
  goToDashboard() {
    this.router.navigate(['/dashboardPatient']);
  }

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  save() {
    if(!this.patientId) {
      alert("❌ Patient ID introuvable");
      return;
    }

    this.http.post(`${this.apiUrl}/${this.patientId}`, this.reading)
      .subscribe({
        next: () => {
          alert("✅ Reading enregistré !");
          this.router.navigate(['/dashboardPatient']);
        },
        error: err => {
          console.error(err);
          alert("❌ Erreur lors de l'enregistrement");
        }
      });
  }
}
