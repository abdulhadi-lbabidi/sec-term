import { MetaTags } from './MetaTags';
import { ProductSchema, ProductSchemaData } from './ProductSchema';
import { BreadcrumbSchema, BreadcrumbItem } from './BreadcrumbSchema';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  product?: ProductSchemaData;
  breadcrumbs?: BreadcrumbItem[];
  image?: string;
}

export const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  ogType,
  product,
  breadcrumbs,
}: SEOProps) => {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogUrl={ogUrl}
        ogType={ogType}
      />
      {product && <ProductSchema product={product} />}
      {breadcrumbs && <BreadcrumbSchema items={breadcrumbs} />}
    </>
  );
};
