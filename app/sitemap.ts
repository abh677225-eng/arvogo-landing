import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.arvogo.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/house`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/house/questions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/house/position`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/house/nextstep`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/house/path`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/serviceability`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/business`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/business/questions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/business/position`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/business/nextstep`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/business/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/visa`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/visa/questions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/visa/position`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/visa/points`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/visa/nextstep`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/visa/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
