/** @type {import('next').NextConfig} */
const nextConfig = {
  // Everything except project pages now lives on the home receipt; keep old
  // links working.
  async redirects() {
    return [
      { source: "/links", destination: "/#contact", permanent: true },
      { source: "/resume", destination: "/#experience", permanent: true },
      { source: "/miscellaneous", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
