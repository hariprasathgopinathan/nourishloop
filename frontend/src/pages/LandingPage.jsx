import React from 'react';
import { ArrowRight, MapPin, Truck, ShieldCheck, Heart, Building2, Store } from 'lucide-react';
import Logo from '../components/ui/Logo';
import heroImage from '../assets/hero.png';

export default function LandingPage({ onLoginDonor, onLoginNgo }) {
  return (
    <div className="min-h-screen bg-brand-surface font-sans text-brand-text flex flex-col">
      {/* HEADER */}
      <header className="border-b border-brand-border bg-brand-surface sticky top-0 z-50">
        <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Logo className="h-8 w-auto mix-blend-multiply" />
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-brand-text">
            <a href="#how-it-works" className="hover:text-brand-donor transition-colors">How It Works</a>
            <a href="#about" className="hover:text-brand-donor transition-colors">About</a>
            <button onClick={onLoginDonor} className="font-semibold hover:text-brand-donor transition-colors">
              Login
            </button>
            <button
              onClick={onLoginDonor}
              className="bg-brand-donor text-white px-5 py-2.5 rounded-[8px] font-semibold hover:bg-brand-donor-hover transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-16 pb-20 px-6 relative bg-brand-surface">
          <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <div className="inline-block px-3 py-1 bg-brand-donor-light text-brand-donor font-semibold text-[11px] tracking-widest rounded-full mb-6 uppercase">
                Donor Portal
              </div>
              <h1 className="text-[52px] md:text-[60px] font-bold tracking-tight mb-6 text-brand-text leading-[1.1]">
                Keep Good Food <br/>
                <span className="text-brand-donor">in the Loop.</span>
              </h1>
  
              <p className="text-[16px] text-brand-text-muted mb-10 max-w-[500px] leading-relaxed">
                Connect surplus food donors with nearby NGOs so good food reaches communities before it becomes waste.
              </p>
  
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
                <button
                  onClick={onLoginDonor}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-brand-donor text-white px-6 py-3.5 rounded-[10px] font-semibold hover:bg-brand-donor-hover transition-all"
                >
                  <Store className="w-[18px] h-[18px]" />
                  Donor Portal
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
  
                <button
                  onClick={onLoginNgo}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-brand-ngo text-white px-6 py-3.5 rounded-[10px] font-semibold hover:bg-brand-ngo-hover transition-all"
                >
                  <Building2 className="w-[18px] h-[18px]" />
                  NGO Portal
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
 
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-brand-ngo-light flex items-center justify-center text-brand-ngo shrink-0">
                    <MapPin className="w-[18px] h-[18px]" />
                  </div>
                  <div className="text-[13px] font-semibold text-brand-text leading-[1.3]">
                    Local Communities<br/><span className="text-brand-text-muted font-normal">in Chennai & Tamil Nadu</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-brand-ngo-light flex items-center justify-center text-brand-ngo shrink-0">
                    <ShieldCheck className="w-[18px] h-[18px]" />
                  </div>
                  <div className="text-[13px] font-semibold text-brand-text leading-[1.3]">
                    Verified NGOs<br/><span className="text-brand-text-muted font-normal">and community organizations</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-brand-ngo-light flex items-center justify-center text-brand-ngo shrink-0">
                    <ShieldCheck className="w-[18px] h-[18px]" />
                  </div>
                  <div className="text-[13px] font-semibold text-brand-text leading-[1.3]">
                    Secure & Protected<br/><span className="text-brand-text-muted font-normal">pickup information</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[580px]">
              <div className="rounded-[20px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative">
                <img src={heroImage} alt="People serving food" className="w-full h-auto object-cover" />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-[12px] p-3 shadow-lg flex items-center gap-3 border border-white/20">
                  <div className="w-[42px] h-[42px] bg-orange-100 rounded-[8px] flex items-center justify-center text-orange-600">
                    <Heart className="w-[20px] h-[20px]" />
                  </div>
                  <div className="pr-2">
                    <div className="text-[14px] font-bold text-brand-text leading-tight">Good Food</div>
                    <div className="text-[12px] text-brand-text-muted">Stronger Communities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW NOURISHLOOP WORKS */}
        <section id="how-it-works" className="py-20 px-6 bg-brand-surface border-y border-brand-border">
          <div className="max-w-[1240px] mx-auto">
            <div className="mb-14">
              <h2 className="text-[28px] font-bold mb-2">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: '01', subtitle: 'Post Food', desc: 'Add food details, quantity and pickup location.', icon: Store, color: 'text-brand-donor', bg: 'bg-brand-donor-light' },
                { title: '02', subtitle: 'Discover Nearby', desc: 'NGOs find available food within their area.', icon: Building2, color: 'text-brand-ngo', bg: 'bg-brand-ngo-light' },
                { title: '03', subtitle: 'Claim Donation', desc: 'NGO claims the donation and coordinates pickup.', icon: Heart, color: 'text-brand-donor', bg: 'bg-brand-donor-light' },
                { title: '04', subtitle: 'Pickup', desc: 'Food is collected and reaches communities.', icon: Truck, color: 'text-brand-ngo', bg: 'bg-brand-ngo-light' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col bg-brand-surface border border-brand-border rounded-[14px] p-6 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-[48px] h-[48px] rounded-[10px] flex items-center justify-center ${step.bg}`}>
                      <step.icon className={`w-[22px] h-[22px] ${step.color}`} />
                    </div>
                  </div>
                  <div className="mb-1">
                    <span className="text-[12px] font-bold text-brand-text-muted mr-2">{step.title}</span>
                    <span className="font-bold text-[15px] text-brand-text">{step.subtitle}</span>
                  </div>
                  <p className="text-[13px] text-brand-text-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-surface border-t border-brand-border py-8 px-6">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto mix-blend-multiply" />
            <span className="text-[13px] text-brand-text-muted font-medium">Keep Good Food in the Loop.</span>
          </div>
          <div className="text-[12px] text-brand-text-muted">
            © 2024 NourishLoop
          </div>
        </div>
      </footer>
    </div>
  );
}
