import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './json/en.json';
import fr from './json/fr.json';
import es from './json/es.json';
import de from './json/de.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de }
  },
  lng: 'fr', // default language
  fallbackLng: 'fr', // fallback language
  interpolation: {
    escapeValue: false // React already escapes values to prevent XSS
  }
});

export default i18n;
