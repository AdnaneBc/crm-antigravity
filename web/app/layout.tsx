import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactQueryProvider } from "@/contexts/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PharmaFlow CRM",
  description: "Plateforme CRM pour la gestion des ventes pharmaceutiques",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
