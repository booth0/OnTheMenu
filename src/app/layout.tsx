import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BanChecker from "@/components/BanChecker";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Nunito } from "next/font/google";
import type { Metadata } from "next";
import "./app.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "OnTheMenu",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (user) {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isBanned: true },
    });
    if (fullUser?.isBanned) {
      redirect('/api/auth/force-logout');
    }
  }

  return (
    <html lang="en">
      <body className={nunito.className}>
        <BanChecker />
        <Header isLoggedIn={!!user} username={user?.username} role={user?.role}/>
         {children}
         <Footer/>
      </body>
    </html>
  );
}
