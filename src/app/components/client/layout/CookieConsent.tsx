import { useState, useEffect } from 'react';
import { useLocalization } from '@/app/hooks/useLocalization';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';

export const CookieConsent = () => {
  const { t } = useLocalization();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 start-0 end-0 z-[100] p-4 md:p-6 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-foreground">
            {t('cookies.title')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('cookies.description')}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button variant="outline" className="flex-1 md:flex-none whitespace-nowrap" onClick={declineCookies}>
            {t('cookies.decline')}
          </Button>
          <Button className="flex-1 md:flex-none whitespace-nowrap" onClick={acceptCookies}>
            {t('cookies.accept')}
          </Button>
          <button
            onClick={declineCookies}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors ml-2 hidden md:block"
            aria-label={t('cookies.close')}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
