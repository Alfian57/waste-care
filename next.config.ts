import type { NextConfig } from "next";
import withPWA from "next-pwa";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Suppress source map warnings in development
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  
  // Optimize compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Reduce unused CSS and JS
  modularizeImports: {
    '@maptiler/sdk': {
      transform: '@maptiler/sdk/{{member}}',
    },
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@maptiler/sdk', 'maplibre-gl', '@supabase/supabase-js', '@supabase/auth-js', 'react', 'react-dom'],
    // Enable SWC minification for better tree-shaking
    swcTraceProfiling: false,
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Optimize client-side bundles
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, React-DOM)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 50,
              enforce: true,
              chunks: 'all',
            },
            // Supabase - split into smaller chunks
            supabaseAuth: {
              name: 'supabase-auth',
              test: /[\\/]node_modules[\\/]@supabase[\\/]auth-js[\\/]/,
              priority: 45,
              enforce: true,
            },
            supabaseClient: {
              name: 'supabase-client',
              test: /[\\/]node_modules[\\/]@supabase[\\/](supabase-js|postgrest-js|realtime-js|storage-js)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // MapLibre/MapTiler - heavy library, separate chunk
            maplibre: {
              name: 'maplibre-vendor',
              test: /[\\/]node_modules[\\/](maplibre-gl|@maptiler)[\\/]/,
              priority: 35,
              enforce: true,
            },
            // Common vendor chunk for other node_modules
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2,
            },
            // Common code across pages
            common: {
              name: 'common',
              minChunks: 3,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Add module concatenation for smaller bundles
      config.optimization.concatenateModules = true;
      
      // Improve tree-shaking and eliminate unused code
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
      config.optimization.innerGraph = true;
      config.optimization.providedExports = true;
      
      // Mark packages as side-effect-free for better tree-shaking
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /node_modules[\\/](@maptiler[\\/]sdk|maplibre-gl)/,
        sideEffects: false,
      });
    }
    
    // Remove console logs and minimize in production
    if (!dev) {
      config.optimization.minimize = true;
      
      // Additional minification options
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((minimizer: any) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options = {
              ...minimizer.options,
              terserOptions: {
                ...minimizer.options?.terserOptions,
                compress: {
                  ...minimizer.options?.terserOptions?.compress,
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug'],
                  passes: 2,
                },
                mangle: {
                  safari10: true,
                },
              },
            };
          }
        });
      }
    }
    
    return config;
  },
};

export default bundleAnalyzer({
  dest: "public",
  register: true,
  skipWaiting: false, // Changed to false to support bfcache better
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  // Enable bfcache support
  scope: '/',
  reloadOnOnline: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.maptiler\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "maptiler-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cdn-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
}) as any;
(nextConfig);
