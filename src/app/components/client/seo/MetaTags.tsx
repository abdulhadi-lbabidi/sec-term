import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
}

export const MetaTags = ({
  title,
  description,
  keywords,
  ogImage = '/default-og.jpg',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: MetaTagsProps) => {
  const { t } = useTranslation();

  const finalTitle = title || t('metaDefaultTitle');
  const finalDescription = description || t('metaDefaultDesc');
  const finalKeywords = keywords || t('metaDefaultKeywords');

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {ogUrl && <meta property="twitter:url" content={ogUrl} />}
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
