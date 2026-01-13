import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen-Z Fashion Store - Trendy Fashion for Gen-Z",
  description: "Discover the latest fashion trends with our Gen-Z focused e-commerce platform. Shop trendy clothes, accessories, and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
