import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "AI Webinar 2026 | Transform Your Future with AI",
  description = "Join our exclusive AI Webinar to master cutting-edge technology. Expert trainers, live sessions, and exclusive resources for the Sri Lankan tech community.",
  keywords = "AI, Artificial Intelligence, Webinar, Sri Lanka, Tech, Developer, Future",
  image = "https://ai.theaob.lk/og-image.jpg",
  url = "https://ai.theaob.lk",
}: SEOProps) {
  const siteTitle = `${title}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
