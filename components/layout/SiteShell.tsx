"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CallFloat from "./CallFloat";
import CookieBanner from "./CookieBanner";

const FUNNEL_ROUTES = ["/masterclass"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isFunnel = FUNNEL_ROUTES.some((r) => path === r || path.startsWith(r + "/"));

  return (
    <>
      {!isFunnel && <Navbar />}
      <main>{children}</main>
      {!isFunnel && <Footer />}
      {!isFunnel && <CallFloat />}
      {!isFunnel && <CookieBanner />}
    </>
  );
}
