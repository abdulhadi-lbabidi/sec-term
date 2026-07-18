import { Helmet } from 'react-helmet-async';

export interface ProductSchemaData {
  name: string;
  image: string;
  description: string;
  sku?: string;
  brand?: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
}

interface ProductSchemaProps {
  product: ProductSchemaData;
}

export const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Foodie Store',
    },
    offers: {
      '@type': 'Offer',
      url: window?.location?.href,
      priceCurrency: product.currency || 'SAR',
      price: product.price,
      availability:
        product.availability === 'InStock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
