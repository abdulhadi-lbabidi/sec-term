import { useTranslation } from 'react-i18next';

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">{t('header.blog', 'Blog')}</h1>
      <p className="text-xl text-muted-foreground max-w-md">
        Coming soon! Stay tuned for delicious recipes and bakery news.
      </p>
    </div>
  );
}
