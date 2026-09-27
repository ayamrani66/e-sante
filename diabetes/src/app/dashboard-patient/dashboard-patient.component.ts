// dashboard-patient.component.ts
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { ConsultationService } from '../services/consultation.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard-patient',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css']
})
export class DashboardPatientComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);
  private authService = inject(AuthService);

  @ViewChild('imcChart') imcChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hba1cChart') hba1cChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  imcChartInstance: Chart | null = null;
  hba1cChartInstance: Chart | null = null;
  patient: any;
  consultations: any[] = [];
  lastConsultation: any;

  viewInitialized = false;
dataReady = false;

constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd && this.viewInitialized && this.dataReady) {
      this.drawCharts();
    }
  });
}
  ngAfterViewInit(): void {
  }
 goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (!user) return;

    const id = user.patientId; // prend l'id du patient connecté
    this.patientService.getById(id).subscribe(p => this.patient = p);

    this.consultationService.getByPatientId(id).subscribe(cs => {
      if (!cs || cs.length === 0) return;

      // ✅ Tri par date croissante
      this.consultations = cs.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      this.lastConsultation = this.consultations[this.consultations.length - 1];

      // Attendre que la vue soit prête avant de dessiner
      setTimeout(() => this.drawCharts(), 0);
    });
  });
}

  drawCharts() {
    if (!this.imcChart?.nativeElement || !this.hba1cChart?.nativeElement) return;
    if (this.consultations.length === 0) return;

  const labels = this.consultations.map(c => 
  new Date(c.dateConsultation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
);
    const imc = this.consultations.map(c => c.imc);
    const hba1c = this.consultations.map(c => c.hba1c);
    const normalImc = 22;
    const normalHba1c = 5.7;

if (this.imcChartInstance) this.imcChartInstance.destroy();

this.imcChartInstance = new Chart(this.imcChart.nativeElement, {
  type: 'line',
  data: {
    labels,
    datasets: [
      {
        label: 'IMC',
        data: imc,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa33',
        fill: false,
        tension: 0.2
      },
      {
        label: 'Valeur normale',
        data: Array(labels.length).fill(normalImc),
        borderColor: '#10b981',
        borderDash: [5, 5],
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

if (this.hba1cChartInstance) this.hba1cChartInstance.destroy();
    this.hba1cChartInstance = new Chart(this.hba1cChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "HbA1c",
          data: hba1c,
          borderColor: "#ef4444",
          fill: false,
          tension:0.3
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
  }

  // Renvoie une classe de couleur pour indicateurs
  getIndicatorClass(val: number, type: 'glycemie' | 'hba1c' | 'imc') {
    if (type === 'glycemie') {
      if (val < 140) return 'green';
      if (val < 180) return 'orange';
      return 'red';
    }
    if (type === 'hba1c') {
      if (val < 6) return 'green';
      if (val < 7) return 'orange';
      return 'red';
    }
    if (type === 'imc') {
      if (val < 18.5) return 'orange';
      if (val < 25) return 'green';
      return 'red';
    }
    return '';
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
