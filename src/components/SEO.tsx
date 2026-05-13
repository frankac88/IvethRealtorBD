import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "product";
  noindex?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  structuredData?: Record<string, any>;
}

export const SEO = ({
  title,
  description = siteConfig.brand.description,
  canonicalUrl,
  ogImage = "https://www.ivethcollrealtor.com/iveth-social-share.jpg",
  ogType = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${siteConfig.brand.name} — Miami & Orlando`
    : `${siteConfig.brand.name} | ${siteConfig.brand.descriptor} — Miami & Orlando`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteConfig.brand.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
