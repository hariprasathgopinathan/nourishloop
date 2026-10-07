import React from 'react';
import { ArrowRight, Leaf, MapPin, Truck, RefreshCw, ShieldCheck, Heart, Clock } from 'lucide-react';
import Logo from '../components/ui/Logo';
import heroImage from '../assets/hero.png';
export default function LandingPage({ onLoginDonor, onLoginNgo }) {
  return (
    <div className="min-h-screen bg-brand-neutral font-sans selection:bg-brand-green/20 selection:text-brand-dark-green text-brand-text flex flex-col">
      {/* A. HEADER */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className="h-16 w-auto " />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-brand-green transition-colors">How it Works</a>
            <a href="#about" className="hover:text-brand-green transition-colors">About</a>
            <button onClick={onLoginDonor} className="hover:text-brand-green transition-colors font-bold text-gray-900">
              Login
            </button>
            <button
              onClick={onLoginDonor}
              className="bg-brand-green text-white px-5 py-2.5 rounded-full hover:bg-brand-darkGreen transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* B. HERO */}
        <section className="pt-20 pb-24 px-6 relative bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 font-semibold text-xs tracking-widest rounded-full mb-6 uppercase">
                Donor Portal
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-brand-text leading-[1.1]">
                Keep Good Food <br/><span className="text-brand-green">in the Loop.</span>
              </h1>
  
              <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                Connect surplus food donors with nearby NGOs so good food reaches communities before it becomes waste.
              </p>
  
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
                <button
                  onClick={onLoginDonor}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-darkGreen transition-all shadow-sm hover:shadow-md"
                >
                  <Leaf className="w-5 h-5" />
                  Donor Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
  
                <button
                  onClick={onLoginNgo}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#1d4ed8] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
                >
                  <Heart className="w-5 h-5" />
                  NGO Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    Local Communities<br/><span className="text-gray-500 font-normal">in Chennai & Tamil Nadu</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    Verified NGOs<br/><span className="text-gray-500 font-normal">and community organizations</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    Secure & Protected<br/><span className="text-gray-500 font-normal">pickup information</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                <img src={heroImage} alt="People serving food" className="w-full h-auto object-cover" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Good Food</div>
                    <div className="text-sm text-gray-500">Stronger Communities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. HOW NOURISHLOOP WORKS */}
        <section id="how-it-works" className="py-20 px-6 bg-brand-neutral border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600">A seamless process to redirect surplus food.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gray-300 -z-10"></div>

              {[
                { title: '01', subtitle: 'Post Food', desc: 'Add food details, quantity and pickup location.', icon: Leaf, color: 'text-brand-green', bg: 'bg-green-50' },
                { title: '02', subtitle: 'Discover Nearby', desc: 'NGOs find available food within their area.', icon: RefreshCw, color: 'text-[#1d4ed8]', bg: 'bg-blue-50' },
                { title: '03', subtitle: 'Claim Donation', desc: 'NGO claims the donation and coordinates pickup.', icon: Heart, color: 'text-brand-green', bg: 'bg-green-50' },
                { title: '04', subtitle: 'Pickup', desc: 'Food is collected and reaches communities.', icon: Truck, color: 'text-[#1d4ed8]', bg: 'bg-blue-50' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative shadow-sm border border-white ${step.bg}`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <h3 className="font-bold text-xs tracking-widest text-gray-400 mb-1">{step.title}</h3>
                  <h4 className="font-bold text-gray-900 mb-2">{step.subtitle}</h4>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* D. TWO-SIDED PLATFORM */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="p-8 md:p-12 rounded-2xl bg-brand-green/5 border border-brand-green/10">
              <h3 className="text-sm font-bold tracking-widest text-brand-green mb-3 uppercase">Donors</h3>
              <h2 className="text-2xl font-bold mb-4">Have surplus food?</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Post available food and arrange pickup. Whether you represent a restaurant, grocery store, or an event, you can ensure that perfectly good food doesn't go to waste.
              </p>
              <button
                onClick={onLoginDonor}
                className="text-brand-green font-medium flex items-center gap-2 hover:text-brand-darkGreen transition-colors"
              >
                Go to Donor Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 md:p-12 rounded-2xl bg-brand-teal/5 border border-brand-teal/10">
              <h3 className="text-sm font-bold tracking-widest text-brand-teal mb-3 uppercase">NGOs</h3>
              <h2 className="text-2xl font-bold mb-4">Need available food?</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Find nearby donations and coordinate pickup. Claim fresh, nutritious food from local businesses and redistribute it to communities in need safely and efficiently.
              </p>
              <button
                onClick={onLoginNgo}
                className="text-brand-teal font-medium flex items-center gap-2 hover:text-brand-darkTeal transition-colors"
              >
                Go to NGO Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* E. WHY NOURISHLOOP & F. TRUST */}
        <section className="py-20 px-6 bg-brand-neutral border-t border-gray-200/60">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold mb-6">Why NourishLoop</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Food waste is a logistical problem, not a lack of supply. When businesses have surplus food, it often perishes because there is no fast, reliable way to connect with local organizations that can distribute it immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                NourishLoop provides the real-time infrastructure needed to bridge this gap, ensuring that good food reaches those who need it, exactly when it's available.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Platform Trust</h2>
              <ul className="space-y-4">
                {[
                  { icon: ShieldCheck, text: "Verified application profiles & role-based access" },
                  { icon: MapPin, text: "Protected pickup information before claim" },
                  { icon: Clock, text: "Secure, real-time donation workflow" },
                  { icon: Heart, text: "Firebase-authenticated secure infrastructure" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-brand-text/60 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* G. FINAL CTA */}
        <section className="py-24 px-6 bg-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-brand-text">
              Keep Good Food in the Loop.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLoginDonor}
                className="w-full sm:w-auto bg-brand-green text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-darkGreen transition-colors shadow-sm"
              >
                Donor Portal
              </button>
              <button
                onClick={onLoginNgo}
                className="w-full sm:w-auto bg-brand-teal text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-darkTeal transition-colors shadow-sm"
              >
                NGO Portal
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* H. FOOTER */}
      <footer className="bg-brand-neutral border-t border-gray-200/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo className="h-16 w-auto " />
            <p className="text-sm text-gray-500 font-medium">Keep Good Food in the Loop.</p>
          </div>

          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Surplus Food Donation Network
          </div>
        </div>
      </footer>
    </div>
  );
}
