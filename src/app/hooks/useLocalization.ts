import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    queryClient.invalidateQueries();
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

