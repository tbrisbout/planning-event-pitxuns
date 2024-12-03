import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pitxuns - Planning Event",
  description: "Site pour la vue du planning des evenements de l'APE les Pitxuns - Thermes Salins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
