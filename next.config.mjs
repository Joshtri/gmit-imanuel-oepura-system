/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Fix untuk messaging timeout issues
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  
  // WebSocket configuration untuk development
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Optimisasi untuk development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.nevaobjects.id',
        port: '',
        pathname: '/files-bucket/**',
      },
    ],
  },
};

export default nextConfig;
