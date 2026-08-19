/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        // The console has no landing page of its own; the overview is home.
        // Temporary rather than permanent, so a browser never caches a stale
        // destination if this ever moves again.
        source: "/",
        destination: "/overview",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
