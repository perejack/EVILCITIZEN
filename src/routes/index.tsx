import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";
import { CtaBanner } from "@/components/CtaBanner";
import { StatsBanner } from "@/components/StatsBanner";
import { Agencies } from "@/components/Agencies";
import { Counties } from "@/components/Counties";
import { Features } from "@/components/Features";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
        <CtaBanner />
        <Agencies />
        <Counties />
        <StatsBanner />
        <Features />
      </main>
      <SiteFooter />
    </div>
  );
}
