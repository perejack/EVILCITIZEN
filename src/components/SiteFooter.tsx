import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <img src="https://accounts.ecitizen.go.ke/en/images/logo.svg" alt="eCitizen Kenya" className="h-10 w-auto" />
            </div>
            <p className="mt-4 text-white/70 max-w-md">
              Giving Kenyans easy access to online government services. One login, every service, simplified.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/national" className="hover:text-white transition-colors">National</Link></li>
              <li><Link to="/counties" className="hover:text-white transition-colors">Counties</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-white/70">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /><span>support@ecitizen.go.ke</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /><span>0709 123 456</span></li>
              <li className="text-sm pt-2">Customer support available<br />Monday – Friday, 8am – 5pm EAT</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Republic of Kenya. All rights reserved.</p>
          <div className="h-1 w-32 kenya-stripe rounded-full" />
        </div>
      </div>
    </footer>
  );
}
