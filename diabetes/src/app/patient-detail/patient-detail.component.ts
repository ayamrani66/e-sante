import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { PatientService } from '../services/patient.service';
import { ConsultationService } from '../services/consultation.service';
import { RouterModule } from '@angular/router';
import { PredictionService } from '../services/prediction.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, AfterViewInit {
[x: string]: any;
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);
  private predictionService = inject(PredictionService);
  private http = inject(HttpClient);
  private router = inject(Router);

  patient: any;
  consultations: any[] = [];
  patientRisk: any;
  lastReading: any;

  editMode: boolean = false;
consultationToEdit: any = null;

  @ViewChild('hba1cChart') hba1cChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imcChart') imcChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('riskChart') riskChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('glycemieChart') glycemieChart!: ElementRef<HTMLCanvasElement>;

  hba1cChart: Chart | null = null;
  imcChart: Chart | null = null;
  riskChart: Chart | null = null;
  private lastReadingChartInstance: Chart | null = null;

  @ViewChild('pdfContent') pdfContent!: ElementRef;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getById(id).subscribe(p => this.patient = p);

    this.consultationService.getByPatientId(id).subscribe(cs => {
      // Tri par date décroissante (dernière consultation en premier)
      this.consultations = cs.sort((a, b) => new Date(b.dateConsultation).getTime() - new Date(a.dateConsultation).getTime());
      if (this.lastReading) this.updateCharts();
    });
    this.http.get<any[]>(`http://localhost:8080/api/readings/${id}`).subscribe(rs => {
    if(rs && rs.length > 0) {
      // tri décroissant pour garder le dernier
      rs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.lastReading = rs[0];
      if (this.consultations.length > 0) this.updateCharts();
    }
  });
  }
goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  ngAfterViewInit() {
  if (this.consultations.length > 0 && this.patient) {
    this.updateCharts();
  }
}

  private updateCharts() {
    if (!this.hba1cChartCanvas?.nativeElement || 
      !this.imcChartCanvas?.nativeElement || 
      !this.riskChartCanvas?.nativeElement) return;

  if (!this.consultations?.length || !this.patient?.id) return;
  if (!this.lastReading || !this.glycemieChart?.nativeElement) return;

    const consultationsSortedForChart = [...this.consultations].sort(
    (a, b) => new Date(a.dateConsultation).getTime() - new Date(b.dateConsultation).getTime()
  );
    const normalHba1c = 5.7;
    const normalImc = 22;
    if (!consultationsSortedForChart || consultationsSortedForChart.length === 0) return;
    const labels = consultationsSortedForChart.map(c => c.dateConsultation);

    const glycLabels = [
  "Avant petit-déjeuner",
  "Après petit-déjeuner",
  "Avant déjeuner",
  "Après déjeuner",
  "Avant dîner",
  "Après dîner"
];

const glycKeys = [
  "glycAvantPetitDejeuner",
  "glycApresPetitDejeuner",
  "glycAvantDejeuner",
  "glycApresDejeuner",
  "glycAvantDiner",
  "glycApresDiner"
];
    const glycValues = glycKeys.map(k => this.lastReading[k]);

if (this.lastReadingChartInstance) this.lastReadingChartInstance.destroy();
this.lastReadingChartInstance = new Chart(this.glycemieChart.nativeElement, {
  type: 'bar',
    data: {
      labels: glycLabels,
      datasets: [{
        label: "Dernier contrôle glycémie (mg/dL)",
        data: glycValues,
        backgroundColor: glycValues.map(v => v && v > 180 ? '#ef4444' : '#10b981')
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw ?? 'N/A'}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
    // --- HbA1c line chart ---
    const hba1cData = consultationsSortedForChart.map(c => c.hba1c);
    if (this.hba1cChart) this.hba1cChart.destroy();
    this.hba1cChart = new Chart(this.hba1cChartCanvas.nativeElement, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'HbA1c (%)',
        data: hba1cData,
        borderColor: '#f87171',
        backgroundColor: '#f8717133',
        fill: false,
        tension: 0.2
      },
      {
        label: 'Valeur normale',
        data: Array(labels.length).fill(normalHba1c),
        borderColor: '#10b981',
        borderDash: [5,5],
        fill: false
      }
    ]
  },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, max: 20 } }
      }
    });

    // --- IMC line chart ---
    const imcData = consultationsSortedForChart.map(c => c.imc);
    if (this.imcChart) this.imcChart.destroy();
    this.imcChart = new Chart(this.imcChartCanvas.nativeElement, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'IMC',
        data: imcData,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa33',
        fill: false,
        tension: 0.2
      },
      {
        label: 'Valeur normale',
        data: Array(labels.length).fill(normalImc),
        borderColor: '#10b981',
        borderDash: [5,5],
        fill: false
      }
    ]
  },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
    
    this.predictionService.getLastRisk(this.patient.id).subscribe(risk => {
  if (!risk) return;

  const riskLabels = ['Rétinopathie', 'Neuropathie', 'Maladies Cardiaques', 'Néphropathie'];
  const riskValues = [
    risk.retinopathie ? 1 : 0,
    risk.neuropathie ? 1 : 0,
    risk.cardiovasculaire ? 1 : 0,
    risk.nephropathie ? 1 : 0
  ];

  const scatterData = riskValues.map((v, i) => ({
    x: i + 1,   // décaler de 1 pour lisibilité
    y: v,
    backgroundColor: v ? '#f87171' : '#10b981',
    label: riskLabels[i] // label pour chaque point
  }));

  if (this.riskChart) this.riskChart.destroy();
  this.riskChart = new Chart(this.riskChartCanvas.nativeElement, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Risques',
        data: scatterData.map(p => ({ x: p.x, y: p.y, r: 12 })), // points un peu plus gros
        backgroundColor: scatterData.map(p => p.backgroundColor)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const idx = context.dataIndex;
              return `${riskLabels[idx]}: ${riskValues[idx] ? 'Présent' : 'Absent'}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.5,
          max: riskLabels.length + 0.5,
          ticks: {
            stepSize: 1,
            callback: function(value: number | string) {
              const idx = Number(value) - 1;
              return riskLabels[idx] ?? '';
            }
          }
        },
        y: {
          min: -1,
          max: 2,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
});

  }
  generatePDF() {
    const DATA = this.pdfContent.nativeElement;
    
    html2canvas(DATA).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`patient-${new Date().getTime()}.pdf`);
    });
  }
}