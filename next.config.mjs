/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cyprusvipestates.com',
        pathname: '**',
        port: '',
      },
      // localhost images
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
        port: '3333',
      },
    ],
  },
};

export default nextConfig;
