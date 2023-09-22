import { RootLayoutChildren } from "@/lib/types";
import "./globals.css";

export const metadata = {
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }: RootLayoutChildren) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </head>
            <body>{children}</body>
        </html>
    );
}
