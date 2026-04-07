import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAuthUser } from "@/lib/auth";
import type { Metadata } from "next";
import "./app.css";

export const metadata: Metadata = {
  title: "OnTheMenu",
  icons: {
    icon: "/images/OnTheMenu.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <html lang="en">
      <body>
        <Header isLoggedIn={!!user} username={user?.username}/>
         {children}
         <Footer/>
      </body>
    </html>
  );
}
