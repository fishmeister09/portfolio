import "./globals.css";

import AppWrapper from "./components/AppWrapper";

export const metadata = {
  title: "Portfolio | Arjun Sethi",
  description:
    "Software Engineer with a passion for transforming ideas into functional software.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        <meta
          name="keywords"
          content="fishmeister, Arjun Sethi, full stack developer, software developer, software engineer"
        />
        <meta property="og:title" content="Portfolio | Arjun Sethi" />
        <meta
          property="og:description"
          content="Software Developer with a passion for transforming ideas into functional software."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/fishmeister/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1707516844/profile.jpg"
        />

        {/* <!-- for light mode --> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-light.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32-light.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16-light.png"
          media="(prefers-color-scheme: light)"
        />

        {/* <!-- for dark mode --> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-dark.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32-dark.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16-dark.png"
          media="(prefers-color-scheme: dark)"
        />

        <link
          rel="mask-icon"
          href="/safari-pinned-tab-light.svg"
          color="#7b7b7b"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="msapplication-TileColor" content="#da532c" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
