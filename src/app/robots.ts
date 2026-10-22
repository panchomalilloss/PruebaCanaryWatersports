import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.canarywatersports.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/checkout", "/cart", "/my-account", "/es/checkout", "/es/cart", "/de/checkout", "/de/cart"] },
    sitemap: `${site}/sitemap.xml`,
  };
}
