import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "AutoFlow",
  description: "Precision Vehicle Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
