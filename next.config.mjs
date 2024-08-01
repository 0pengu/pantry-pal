/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pcckg7vc4l1sejmw.public.blob.vercel-storage.com",
        pathname: "**",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = {
      layers: true,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;
