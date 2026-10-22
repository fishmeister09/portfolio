export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://fishmeister09.netlify.app/sitemap.xml",
  };
}
