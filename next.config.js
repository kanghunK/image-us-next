/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/:path*",
                    destination: "https://codakcodak.site/:path*",
                },
            ];
        }
    },
};

module.exports = nextConfig;
