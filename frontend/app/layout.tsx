// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Font used in Stakent dashboard
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Alternative: Inter (also commonly used in modern dashboards)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Liqtra Finance - AI DeFi Portfolio Manager",
  description:
    "Smart liquidity management and DeFi portfolio optimization powered by AI",
  keywords: [
    "DeFi",
    "AI",
    "Staking",
    "Ethereum",
    "Yield",
    "Liquidity",
    "Portfolio Management",
  ],
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-jakarta antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
