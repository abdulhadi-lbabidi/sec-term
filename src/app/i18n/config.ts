import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enClient from "../assets/locales/en/client.json";
import enAdmin from "../assets/locales/en/admin.json";
import arClient from "../assets/locales/ar/client.json";
import arAdmin from "../assets/locales/ar/admin.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...enClient, admin: enAdmin } },
      ar: { translation: { ...arClient, admin: arAdmin } },
    },
    lng: localStorage.getItem('lang') || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

