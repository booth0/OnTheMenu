import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BanChecker from "@/components/BanChecker";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import "./app.css";

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
      <body>
        <BanChecker />
        <Header isLoggedIn={!!user} username={user?.username} role={user?.role}/>
         {children}
         <Footer/>
      </body>
    </html>
  );
}
