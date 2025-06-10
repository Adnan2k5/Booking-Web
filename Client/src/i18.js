import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import esTranslation from './locales/es.json';
import itTranslation from './locales/it.json';

// Get initial language from localStorage
const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
    de: { translation: deTranslation },
    es: { translation: esTranslation },
    it: { translation: itTranslation },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
