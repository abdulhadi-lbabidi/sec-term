import { useTranslation } from 'react-i18next';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const isRTL = i18n.language === 'ar';

  return {
    t,
    i18n,
    toggleLanguage,
    isRTL,
    currentLanguage: i18n.language
  };
};
