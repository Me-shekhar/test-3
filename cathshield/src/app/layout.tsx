import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CathShield.ai - Hospital-Grade Medical Safety System",
  description: "Secure central line monitoring and clinical decision support",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
