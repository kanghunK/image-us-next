/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/backapi/:path*",
                    destination: "https://codakcodak.site/backapi/:path*",
                },
            ];
        }
        return [];
    },
    compiler: {
        emotion: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
