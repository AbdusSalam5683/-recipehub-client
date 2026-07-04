// client/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      // ✅ imgBB Support
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.ibb.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'imgbb.com',
        pathname: '**',
      },
      // ✅ Google Images (Google Login Profile Picture)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
      // ✅ Additional Image Hosts
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '**',
      },
    ],
    // Optional: Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  reactStrictMode: true,
  // Optional: Compress images on build
  compress: true,
  // Optional: Enable SWC minification (faster builds)
  swcMinify: true,
};

export default nextConfig;