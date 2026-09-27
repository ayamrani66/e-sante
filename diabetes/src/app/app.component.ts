import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LangService, TranslationKey } from './services/translation.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'diabetes';
  constructor(private langService: LangService, private authService: AuthService, private router: Router) {}

  setLang(lang: 'fr' | 'ar') {
    this.langService.setLang(lang);
  }

  t(key: TranslationKey): string {
    return this.langService.translate(key);
  }
  goToDashboard() {
    const user = this.authService.getRole(); // récupère l'utilisateur connecté
    if (!user) return;

    if (user === 'PATIENT') {
      this.router.navigate(['/dashboardPatient']);
    } else if (user === 'MEDECIN') {
      this.router.navigate(['/dashboard']);
    }
  }
}
