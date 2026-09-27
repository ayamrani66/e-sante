import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TranslationKey = 'DASHBOARD' | 'PROFILE' | 'PATIENTS' | 'ALERTS' | 'LOGIN' | 'REGISTER';

@Injectable({ providedIn: 'root' })
export class LangService {
  private lang = new BehaviorSubject<'fr' | 'ar'>('fr');
  lang$ = this.lang.asObservable();

  private translations: Record<'fr' | 'ar', Record<TranslationKey, string>> = {
    fr: {
      DASHBOARD: 'Tableau de bord',
      PROFILE: 'Profil',
      PATIENTS: 'Patients',
      ALERTS: 'Alertes',
      LOGIN: 'Connexion',
      REGISTER: 'Inscription'
      // ajoute tout ce que tu veux
    },
    ar: {
      DASHBOARD: 'لوحة التحكم',
      PROFILE: 'الملف الشخصي',
      PATIENTS: 'المرضى',
      ALERTS: 'التنبيهات',
      LOGIN: 'تسجيل الدخول',
      REGISTER: 'إنشاء حساب'
    }
  };

  setLang(lang: 'fr' | 'ar') {
    this.lang.next(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: TranslationKey): string {
    const current = this.lang.getValue();
    return this.translations[current][key] || key;
  }
}
