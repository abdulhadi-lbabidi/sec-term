import { Helmet } from 'react-helmet-async';

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
  title = 'Foodie Store - متجر الأطعمة',
  description = 'متجر متخصص في بيع أفضل الأطعمة والمنتجات الغذائية.',
  keywords = 'طعام, متجر, غذاء, foodie, store, food',
  ogImage = '/default-og.jpg', // Replace with a real default image path
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {ogUrl && <meta property="twitter:url" content={ogUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
