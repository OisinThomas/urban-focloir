/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/search',
            destination: '/',
            permanent: true,
          },
          {
            source: '/search/:term',
            destination: '/',
            permanent: true,
          }
        ]
      },
};

module.exports = nextConfig;
