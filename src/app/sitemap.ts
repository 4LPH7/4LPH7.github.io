import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://4lph7.me", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://4lph7.me/resume/", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
