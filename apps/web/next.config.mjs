import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default withNextIntl(nextConfig);
