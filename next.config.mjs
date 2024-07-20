/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, buildId, dev, webpack }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });
    config.externals = config.externals || {};
    config.externals['QdrantVectorStore'] = 'QdrantVectorStore';
    config.externals['QdrantClient'] = 'QdrantClient';


    return config;
  },
};

export default nextConfig;
