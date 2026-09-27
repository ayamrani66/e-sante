import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, Router } from '@angular/router';
import { AlerteService } from '../services/alertes.service'; 
import { ConseilsService } from '../services/conseils.service'; 
import { ConsultationService } from '../services/consultation.service'; 
import { PatientData, PatientRisks, PredictionService } from '../services/prediction.service'; 

@Component({ 
  selector: 'app-conseils-personnalises', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './conseils-personnalises.component.html', 
  styleUrls: ['./conseils-personnalises.component.css'] }) 

  export class ConseilsPersonnalisesComponent implements OnInit { 
    private route = inject(ActivatedRoute); 
    private consultationService = inject(ConsultationService); 
    private conseilsService = inject(ConseilsService); 
    private predictionService = inject(PredictionService); 
    private AlerteService = inject(AlerteService);
    private router = inject(Router);
    
    dernieresMesures: any; 
    conseils: any[] = [];
    alertes: any[] = [];
    patientId!: number; 
    risks!: PatientRisks | null; riskKeys: (keyof PatientRisks)[] = ['cardiovasculaire','nephropathie','neuropathie','retinopathie']; 
    goToDashboard() {
    this.router.navigate(['/dashboardPatient']);
  }
    ngOnInit() { 
      this.patientId = Number(this.route.snapshot.paramMap.get('id')); 
      this.loadDernieresMesuresEtConseils(); // 🔹 Sur ajout de consultation : recharger 
      this.loadAlertes();
      this.consultationService.consultationAdded.subscribe(id => { if (id === this.patientId) 
        { this.loadDernieresMesuresEtConseils(); 
        this.loadAlertes();
        } }); } 
        loadDernieresMesuresEtConseils(doPrediction: boolean = false) { 
          this.consultationService.getByPatientId(this.patientId).subscribe(cs => { 
            if (cs.length > 0) { 
              this.dernieresMesures = cs[cs.length - 1]; // dernière consultation // Charger conseils classiques 
              this.conseilsService.getConseils(this.patientId) .subscribe(c => this.conseils = c || []); // 👉 Lancer prédiction uniquement après saisie consultation 
              if (doPrediction) { 
                const inputData = { 
                  glycemieajeun: this.dernieresMesures.glycemieAJeun, 
                  hba1c: this.dernieresMesures.hba1c, 
                  heart_disease: this.dernieresMesures.heartDisease, 
                  imc: this.dernieresMesures.imc, 
                  tabac: this.dernieresMesures.tabac, 
                  tension: this.dernieresMesures.tension }; 
                  this.predictionService.getRisks(this.patientId, inputData) .subscribe(result => { 
                    if (result && (result as any).risks) { 
                      this.risks = { 
                        cardiovasculaire: (result as any).risks.cardiac_complication, 
                        
                        nephropathie: (result as any).risks.nephropathy, 
                        neuropathie: (result as any).risks.neuropathy, 
                        retinopathie: (result as any).risks.retinopathy 
                      }; 
                    } 
                  }); 
              } 
              this.updateConseils(); 
            } 
          }); 
        } 

    updateConseils() { 
      if (!this.dernieresMesures) return; 

      // 1. Conseils classiques 
      this.conseilsService.getConseils(this.patientId) 
        .subscribe(c => this.conseils = c); 

      // 2. Derniers risques depuis la BDD 
      this.predictionService.getLastRisk(this.patientId) 
        .subscribe(result => { 
          this.risks = { 
            cardiovasculaire: result.cardiovasculaire, 
            nephropathie: result.nephropathie, 
            neuropathie: result.neuropathie, 
            retinopathie: result.retinopathie 
          }; 
        }); 
    } 

    private mapRisks(result: any) { 
      if (!result || !result.risks) { 
        this.risks = null; 
        return; 
      } 
      this.risks = { 
        cardiovasculaire: result.risks.cardiac_complication, 
        nephropathie: result.risks.nephropathy, 
        neuropathie: result.risks.neuropathy, 
        retinopathie: result.risks.retinopathy 
      }; 
    } 

    loadAlertes() {
    this.AlerteService.getAlertesByPatient(this.patientId).subscribe(data => {
      this.alertes = data;
    });
  }
  get alertesAvecConseil(): any[] {
  return this.alertes.filter(a => a.conseilMedecin && a.conseilMedecin.trim() !== '');
}
isDanger(conseil: any): boolean {
  // Si c'est un conseil issu d'une alerte non résolue ou niveau DANGER
  if (conseil.niveau === 'DANGER') return true;

  // Si c'est un conseil basé sur les mesures critiques
  if (conseil.titre === 'HbA1c' && this.dernieresMesures?.hba1c > 7) return true;
  if (conseil.titre === 'Glycémie' && this.dernieresMesures?.glycemieAJeun > 180) return true;
  if (conseil.titre === 'Activité physique' && this.dernieresMesures?.imc >= 25) return true;

  return false;
}


    getColorClass(value: number | boolean | string, type: string): string {
  const num = Number(String(value).replace(',', '.').trim());

  switch(type) {
    case 'hba1c':
      return !isNaN(num) ? (num < 7 ? 'green' : 'red') : 'green';

    case 'glycemie':
      if (!isNaN(num)) {
        if (num < 70) return 'orange';
        if (num > 180) return 'red';
        return 'green';
      }
      return 'green';

    case 'tension':
      return Boolean(value) ? 'red' : 'green';

    case 'imc':
      if (!isNaN(num)) {
        if (num < 18.5) return 'orange';
        if (num >= 25) return 'red';
        return 'green';
      }
      return 'green';

    default:
      return 'green';
  }
}
  }