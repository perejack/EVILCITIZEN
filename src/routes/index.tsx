import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";
import { CtaBanner } from "@/components/CtaBanner";
import { StatsBanner } from "@/components/StatsBanner";
import { Agencies } from "@/components/Agencies";
import { Counties } from "@/components/Counties";
import { Features } from "@/components/Features";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "eCitizen Kenya — Government Services Simplified" },
      { name: "description", content: "Access over 22,000 Kenya government services from 100+ ministries, counties and agencies. One login. Unified citizen profile." },
      { property: "og:title", content: "eCitizen Kenya — Government Services Simplified" },
      { property: "og:description", content: "One login for every government service. Search, apply and pay online." },
    ],
  }),
  component: Index,
});

function Index() {
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
