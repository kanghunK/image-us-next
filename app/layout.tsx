"use client";

import { RootLayoutChildren } from "@/lib/types";
import "./globals.css";

export default function RootLayout({ children }: RootLayoutChildren) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>ImageUs</title>
            </head>
            <body>{children}</body>
        </html>
    );
}
