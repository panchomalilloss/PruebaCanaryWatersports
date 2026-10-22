import type { MetadataRoute } from "next";
import { indexable, withSlash } from "@/content/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.canarywatersports.com";
  const urls: MetadataRoute.Sitemap = [];
  for (const page of indexable) {
    for (const path of Object.values(page.paths)) {
      if (!path) continue;
      const languages: Record<string, string> = {};
      for (const [locale, alt] of Object.entries(page.paths)) {
        if (alt) languages[locale] = site + withSlash(alt);
      }
      urls.push({ url: site + withSlash(path), changeFrequency: "weekly", priority: page.kind === "home" ? 1 : 0.7, alternates: { languages } });
    }
  }
  return urls;
}
