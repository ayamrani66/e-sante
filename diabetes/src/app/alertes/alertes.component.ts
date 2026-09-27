import { Component, OnInit } from '@angular/core';
import { AlerteService } from '../services/alertes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alertes',
  standalone: true,
  templateUrl: './alertes.component.html',
  styleUrls: ['./alertes.component.css'],
  imports: [FormsModule,CommonModule]
})
export class AlertesComponent implements OnInit {
  alertes: any[] = [];

  constructor(private alerteService: AlerteService, private router: Router) {}

  goToDashboard() {
  this.router.navigate(['/dashboard']);
}

  ngOnInit() {
    this.loadAlertes();
  }

  loadAlertes() {
    this.alerteService.getAlertesNonResolues().subscribe(data => {
      this.alertes = data;
    });
  }

  envoyerConseil(alerte: any) {
    this.alerteService.repondreAlerte(alerte.id, alerte.conseilMedecin)
      .subscribe(() => {
        alert("Conseil envoyé ✅");
        this.loadAlertes();
      });
  }
}
