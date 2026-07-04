// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'ui-avatars.com',
      'via.placeholder.com',
      'res.cloudinary.com'
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;