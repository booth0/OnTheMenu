import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import "./app.css";

export const metadata: Metadata = {
  title: "OnTheMenu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header/>
         {children}
         <Footer/>
      </body>
    </html>
  );
}
