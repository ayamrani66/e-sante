import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true;
    login = { email: '', motdepasse: '' };
  register = { nom: '', prenom: '', sexe: '', dateNaissance: '', email: '', motdepasse: '' };
  error = '';

  constructor(private authService: AuthService, private router: Router, private patientService: PatientService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register') {
        this.isLoginMode = false;
      }
    });
  }
  
  onSubmit() {
    this.authService.login(this.login.email, this.login.motdepasse).subscribe({
  next: (user) => {
    if (user.role === 'MEDECIN') {
      this.router.navigate(['/dashboard']);
    } else if (user.role === 'PATIENT') {
      this.router.navigate([`/dashboardPatient`]);
    }
  },
  error: (err) => {
    alert(err.error);
  }
});

  }
  onRegister() {

  // Préparer l'objet exactement comme attendu par UserController
  const payload = {
    email: this.register.email,
    motdepasse: this.register.motdepasse,
    patient: {
      nom: this.register.nom,
      prenom: this.register.prenom,
      sexe: this.register.sexe,
      dateNaissance: this.register.dateNaissance // yyyy-MM-dd
    }
  };

  this.authService.register(payload).subscribe({
    next: (patient) => {

      localStorage.setItem('user', JSON.stringify({
        id: patient.id,
        email: this.register.email,
        role: "PATIENT"
      }));
      
      this.router.navigate(['/patient', patient.id, 'consultation', 'new']);
    },
    error: (err) => {
      console.error(err);
      this.error = err.error || "Erreur lors de l'inscription";
    }
  });
}



  }

