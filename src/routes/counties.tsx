import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Counties } from "@/components/Counties";

export default function CountiesPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-x-hidden">
        <section className="bg-gradient-hero text-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              All 47 <span className="italic font-light">counties</span>, one place
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              Pay land rates, apply for permits, access local government services from anywhere.
            </p>
          </div>
        </section>
        <Counties />
      </main>
      <SiteFooter />
    </div>
  );
}
