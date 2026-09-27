import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { PatientService } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AlerteService } from '../services/alertes.service';

  Chart.register(ChartDataLabels);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  private authService = inject(AuthService);
  private alerteService = inject(AlerteService);
  private router = inject(Router);

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  
  patients: any[] = [];
  alertes: any[] = [];

  // Statistiques
  totalPatients = 0;
  diabeticCount = 0;
  nonDiabeticCount = 0;

  currentUser: any;
  role: string = '';

  // Références aux graphiques pour éviter les doublons
  pieChart: Chart | null = null;
  barChart: Chart | null = null;

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.role = user?.role || '';

      this.alerteService.getAlertesNonResolues().subscribe(data => {
      this.alertes = data;
    });
      if (this.role === 'MEDECIN') {
        // Médecin → récupérer tous les patients
        this.patientService.getAll().subscribe(p => {
          this.patients = p;
          this.updateStats();
          this.drawCharts();
        });
      } else if (this.role === 'PATIENT') {
        // Patient → récupérer uniquement son patient
        if (user.patientId) {
          this.patientService.getById(user.patientId).subscribe(p => {
            this.patients = [p];
            this.updateStats();
            this.drawCharts();
          });
        }
      }
    });
  }
  updateStats() {
    this.totalPatients = this.patients.length;
    this.diabeticCount = this.patients.filter(p => p.prediction?.estDiabetique).length;
    this.nonDiabeticCount = this.totalPatients - this.diabeticCount;
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  drawCharts() {
    if (this.patients.length === 0 || !this.pieCanvas || !this.barCanvas) return;

    let type1 = 0, type2 = 0, non = 0;

    const type1Patients: string[] = [];
    const type2Patients: string[] = [];
    const nonDiabeticPatients: string[] = [];

    this.patients.forEach(p => {
      const pred = p.prediction;
      const fullName = `${p.nom} ${p.prenom}`;
      
      if (!pred || !pred.estDiabetique) { non++; return; }
      const type = pred.typeDiabete || pred.type;
      if (type === '1') {
        type1++;
        type1Patients.push(fullName);
      } else if (type === '2') {
        type2++;
        type2Patients.push(fullName);
      } else {
        non++;
        nonDiabeticPatients.push(fullName);
      }
    });

    // Détruire anciens graphiques s'ils existent
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();

    // Pie chart
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
  type: 'pie',
  data: {
    labels: ['Type 1', 'Type 2', 'Non diabétique'],
    datasets: [{
      data: [type1, type2, non],
      backgroundColor: ['#f87171', '#60a5fa', '#34d399'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value, ctx) => {
          const data = ctx.chart.data.datasets[0].data;
          const sum = data.reduce((a, b) => {
            const aNum = typeof a === 'number' ? a : 0;
            const bNum = typeof b === 'number' ? b : 0;
            return aNum + bNum;
          }, 0);
          const numericValue = typeof value === 'number' ? value : 0;
          const numericSum = typeof sum === 'number' && !isNaN(sum) ? sum : 1;
          const percentage = ((numericValue / numericSum) * 100).toFixed(1) + '%';
          return percentage;
        },
        anchor: 'center',      // centré sur la part
        align: 'center'
      }
    }
  },
  plugins: [ChartDataLabels]
});

    // Top 5 patients à risque
    const topRisk = this.patients
  .map(p => {
    const lastConsult = p.consultations?.slice(-1)[0]; // dernière consultation
    return { ...p, hba1c: lastConsult?.hba1c };
  })
  .filter(p => p.hba1c !== undefined)
  .sort((a, b) => b.hba1c - a.hba1c)
  .slice(0, 5);

const barLabels = topRisk.map(p => `${p.nom} ${p.prenom}`);
const barData = topRisk.map(p => p.hba1c);


    this.barChart = new Chart(this.barCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [{
        label: 'HbA1c (%)',
        data: barData,
        backgroundColor: '#facc15'
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 15 } } // max ajustable
    }
  });
  }

  selectedPatients: any[] = [];   // Contient la liste filtrée
showPatientList = false;         // Pour afficher ou cacher la liste

filterPatients(type: 'all' | 'diabetic' | 'nonDiabetic') {
  if (type === 'all') {
    this.selectedPatients = this.patients;
  } else if (type === 'diabetic') {
    this.selectedPatients = this.patients.filter(p => p.prediction?.estDiabetique);
  } else if (type === 'nonDiabetic') {
    this.selectedPatients = this.patients.filter(p => !p.prediction?.estDiabetique);
  }
  this.showPatientList = true;  // active l'affichage de la liste
}
}