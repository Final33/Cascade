/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer, dev }) {

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle Mapbox GL - exclude from transpilation as per Mapbox docs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      
      // Exclude mapbox-gl from babel/transpilation
      config.module.rules.forEach((rule) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('babel-loader')) {
              if (!use.options) use.options = {};
              if (!use.options.ignore) use.options.ignore = [];
              use.options.ignore.push('./node_modules/mapbox-gl/dist/mapbox-gl.js');
            }
          });
        }
      });
    }

    return config;
  },
};

export default nextConfig;
