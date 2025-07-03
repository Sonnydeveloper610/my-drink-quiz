import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './ko.json';
import en from './en.json';
import es from './es.json';

const resources = { ko: { translation: ko }, en: { translation: en }, es: { translation: es } };

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('es') ? 'es'
      : navigator.language.startsWith('en') ? 'en'
      : 'ko',
    fallbackLng: 'ko',
    interpolation: { escapeValue: false }
  });

export default i18n;
