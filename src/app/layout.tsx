import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GrowthStarter - Launch Your Vision with Crowdfunding",
  description: "GrowthStarter is your integrated crowdfunding platform to launch campaigns, connect with backers, and raise funds for your innovative projects.",
  keywords: ["crowdfunding", "startup", "funding", "campaign", "backers", "innovation"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
      >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
