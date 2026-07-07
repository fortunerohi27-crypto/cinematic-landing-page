/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native modules (.node binaries, sharp, etc.) must not be bundled by webpack.
  // They are loaded at runtime via Node's require().
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@node-rs/argon2": "commonjs @node-rs/argon2",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
