import "./globals.css";

export const metadata = {
  title: "Reco - AI Barang Bekas Analyzer",
  description: "Analisis kondisi, estimasi harga, dan potensi resale barang bekas dari foto."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
