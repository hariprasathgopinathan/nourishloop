import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Truck, ShieldCheck, Heart, Building2, Store, Users, Leaf, Clock, ArrowUpRight, ChevronDown } from 'lucide-react';
import Logo from '../components/ui/Logo';

const faqs = [
  {
    question: "Who can donate food?",
    answer: "Any registered food business, including restaurants, supermarkets, and catering services, can donate their surplus food. We ensure all donors meet basic food safety guidelines."
  },
  {
    question: "Is there a cost to participate?",
    answer: "No, NourishLoop is completely free for both donors and NGOs. Our mission is to eliminate barriers to food redistribution."
  },
  {
    question: "How do NGOs claim the food?",
    answer: "Verified NGOs receive real-time alerts when food becomes available nearby. They can claim it instantly through their dashboard and coordinate pickup directly."
  },
  {
    question: "What types of food can be donated?",
    answer: "We accept prepared meals, fresh produce, packaged goods, and baked items. All food must be safe for consumption and within its expiration window."
  }
];

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-brand-border/60 last:border-0">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none"
      >
        <span className={`text-[18px] font-bold transition-colors ${isOpen ? 'text-brand-donor' : 'text-brand-text group-hover:text-brand-donor'}`}>
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-brand-donor/10 text-brand-donor rotate-180' : 'bg-brand-neutral text-brand-text-muted group-hover:bg-brand-donor/10 group-hover:text-brand-donor'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[16px] text-brand-text-muted leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const directions = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
    none: { opacity: 0 }
  };

  return (
    <motion.div
      initial={directions[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage({ onLoginDonor, onLoginNgo }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#FDFDFC] font-sans text-brand-text overflow-hidden">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-donor/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-brand-ngo/5 rounded-full blur-[150px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 py-4 bg-amber-50/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all duration-300">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Logo className="h-16 md:h-20 w-auto shrink-0 hover:scale-105 transition-transform" />
          <nav className="hidden md:flex items-center gap-12 lg:gap-16 text-[15px] font-semibold">
            <a href="#about" className="text-brand-text/90 hover:text-brand-donor transition-colors relative group py-2">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-donor transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#description" className="text-brand-text/90 hover:text-brand-donor transition-colors relative group py-2">
              Mission
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-donor transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-brand-text/90 hover:text-brand-donor transition-colors relative group py-2">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-donor transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="flex items-center gap-5">
            <button 
              onClick={onLoginDonor} 
              className="px-6 py-3 rounded-full border border-gray-200 bg-white shadow-sm text-[15px] font-semibold text-brand-text hover:border-brand-donor hover:text-brand-donor transition-all hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={onLoginDonor}
              className="bg-brand-donor text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-donor-hover hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-col">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 px-6">
          <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center gap-12">
            
            {/* LEFT: Text & Buttons */}
            <div className="flex-1 text-center lg:text-left">
              <FadeIn direction="up" delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-brand-border/60 rounded-full shadow-sm mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-brand-donor"></span>
                  <span className="text-[13px] font-bold text-brand-text tracking-wide uppercase">Tackling Food Waste in 2026</span>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <h1 className="text-[50px] md:text-[70px] lg:text-[84px] font-extrabold tracking-tight mb-8 leading-[1.05] text-brand-text">
                  Keep Good Food <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-donor to-emerald-400">
                    in the Loop.
                  </span>
                </h1>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <p className="text-[18px] md:text-[20px] text-brand-text-muted mb-12 leading-relaxed max-w-[600px] mx-auto lg:mx-0">
                  A modern logistical network connecting surplus food from restaurants and supermarkets with nearby NGOs, instantly.
                </p>
              </FadeIn>

              <FadeIn direction="up" delay={0.4} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full z-10">
                <button
                  onClick={onLoginDonor}
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-brand-text text-white px-8 py-4 rounded-full font-semibold text-[16px] hover:bg-black hover:scale-105 transition-all shadow-xl"
                >
                  <Store className="w-[20px] h-[20px]" />
                  I want to Donate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onLoginNgo}
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white border border-brand-border text-brand-text px-8 py-4 rounded-full font-semibold text-[16px] hover:border-brand-ngo hover:text-brand-ngo hover:scale-105 transition-all shadow-sm"
                >
                  <Building2 className="w-[20px] h-[20px]" />
                  I am an NGO
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </FadeIn>
            </div>
            
            {/* RIGHT: HERO IMAGE SHOWCASE */}
            <div className="flex-1 w-full relative">
              <FadeIn direction="left" delay={0.6}>
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-brand-border/40 aspect-[4/3] bg-gray-100">
                  <img 
                    src="/images/hero.jpg" 
                    alt="Chef donating food to NGO" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            </div>

          </div>
        </section>

        {/* DESCRIPTION / MISSION */}
        <section id="description" className="py-16 px-6 relative z-10">
          <div className="max-w-[1000px] mx-auto text-center">
            <FadeIn>
              <h2 className="text-[40px] md:text-[56px] font-extrabold tracking-tight leading-[1.1] text-brand-text mb-8">
                Good food belongs to <span className="italic font-serif text-brand-donor">people</span>,<br />not landfills.
              </h2>
              <p className="text-[18px] md:text-[22px] text-brand-text-muted leading-relaxed max-w-[800px] mx-auto">
                Every day, perfectly good surplus food is discarded while local communities go hungry. NourishLoop exists to bridge this gap through a real-time, localized technological infrastructure. We empower food businesses to donate seamlessly and equip NGOs with the visibility to claim and distribute it efficiently.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ABOUT BENTO GRID */}
        <section id="about" className="py-16 px-6 bg-white border-t border-brand-border/40">
          <div className="max-w-[1240px] mx-auto">
            <div className="mb-16">
              <FadeIn>
                <h2 className="text-[36px] font-bold text-brand-text mb-4">About NourishLoop</h2>
                <p className="text-brand-text-muted text-[18px] max-w-[600px]">A completely transparent ecosystem designed to maximize social impact through logistics.</p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <FadeIn delay={0.1} className="md:col-span-2 bg-[#F8FAFC] rounded-[32px] p-8 md:p-12 border border-brand-border/50">
                <div className="w-[48px] h-[48px] bg-white rounded-xl flex items-center justify-center text-brand-donor shadow-sm mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-[28px] font-bold text-brand-text mb-4">Real-Time Geolocation</h3>
                <p className="text-[16px] text-brand-text-muted leading-relaxed max-w-[800px]">
                  Our platform maps available donations against nearby NGOs. When a restaurant posts surplus food, local verified organizations are instantly notified, ensuring rapid response times before food perishes.
                </p>
              </FadeIn>

              {/* Feature 2 */}
              <FadeIn delay={0.2} className="bg-brand-donor text-white rounded-[32px] p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-[48px] h-[48px] bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-[28px] font-bold mb-4">Verified Network</h3>
                </div>
                <p className="text-[16px] text-white/80 leading-relaxed mt-12">
                  Trust is our foundation. Every NGO on our platform undergoes a verification process, guaranteeing that your donations reach legitimate community organizations.
                </p>
              </FadeIn>

              {/* Feature 3 */}
              <FadeIn delay={0.3} className="bg-[#FFF4ED] text-orange-950 rounded-[32px] p-8 md:p-12">
                <div className="w-[48px] h-[48px] bg-orange-200/50 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-[24px] font-bold mb-4">Zero Food Waste</h3>
                <p className="text-[16px] text-orange-900/70 leading-relaxed">
                  We track the lifecycle of every donation, providing actionable environmental impact metrics for businesses.
                </p>
              </FadeIn>

              {/* Feature 4 */}
              <FadeIn delay={0.4} className="md:col-span-2 bg-[#F8FAFC] rounded-[32px] p-8 md:p-12 border border-brand-border/50">
                <div className="w-[48px] h-[48px] bg-white rounded-xl flex items-center justify-center text-brand-ngo shadow-sm mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-[28px] font-bold text-brand-text mb-4">Smart Logistics</h3>
                <p className="text-[16px] text-brand-text-muted leading-relaxed mb-6 max-w-[800px]">
                  Optimized routing and real-time pickup status ensure minimal friction between claim and delivery.
                </p>
                <a href="#how-it-works" className="inline-flex items-center gap-2 font-bold text-brand-ngo hover:underline">
                  See how it works <ArrowUpRight className="w-4 h-4" />
                </a>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 px-6 bg-brand-surface relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto relative z-10">
            <FadeIn>
              <div className="text-center mb-20">
                <h2 className="text-[36px] font-bold text-brand-text mb-4">The Loop in Action</h2>
                <p className="text-[18px] text-brand-text-muted">Four simple steps to make a difference.</p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { title: '01', subtitle: 'Post Surplus', desc: 'Donors upload food details, quantity and timeframe.', icon: Store, color: 'text-brand-donor', bg: 'bg-brand-donor/10', border: 'hover:border-brand-donor/50' },
                { title: '02', subtitle: 'Notify Local', desc: 'Nearby verified NGOs are instantly alerted.', icon: MapPin, color: 'text-brand-donor', bg: 'bg-brand-donor/10', border: 'hover:border-brand-donor/50' },
                { title: '03', subtitle: 'Claim & Route', desc: 'NGO secures the donation and assigns a driver.', icon: Truck, color: 'text-brand-donor', bg: 'bg-brand-donor/10', border: 'hover:border-brand-donor/50' },
                { title: '04', subtitle: 'Nourish', desc: 'Food reaches the community safely.', icon: Users, color: 'text-brand-donor', bg: 'bg-brand-donor/10', border: 'hover:border-brand-donor/50' }
              ].map((step, i) => (
                <FadeIn key={i} delay={0.1 * i} className="relative group">
                  <div className={`bg-white hover:bg-brand-donor/5 rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,138,75,0.12)] border border-brand-border/40 ${step.border} hover:-translate-y-2 transition-all duration-300 h-full`}>
                    <div className={`w-[64px] h-[64px] rounded-2xl flex items-center justify-center ${step.bg} mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                      <step.icon className={`w-[32px] h-[32px] ${step.color}`} />
                    </div>
                    <div className="mb-2">
                      <span className="text-[14px] font-black text-brand-donor/60 block mb-2 tracking-widest">{step.title}</span>
                      <h4 className="font-bold text-[20px] text-brand-text group-hover:text-brand-donor transition-colors">{step.subtitle}</h4>
                    </div>
                    <p className="text-[15px] text-brand-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Connector Line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-brand-donor/20 -translate-y-1/2 z-0" />
                  )}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 px-6 bg-white border-t border-brand-border/40">
          <div className="max-w-[800px] mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-[36px] font-bold text-brand-text mb-4">Frequently Asked Questions</h2>
                <p className="text-[18px] text-brand-text-muted">Everything you need to know about how the platform works.</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="bg-brand-surface rounded-[24px] p-6 md:p-8 border border-brand-border/60 shadow-sm">
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openFaq === index} 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)} 
                />
              ))}
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-[1000px] mx-auto bg-brand-text rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent blur-2xl" />
            
            <FadeIn className="relative z-10">
              <h2 className="text-[40px] md:text-[56px] font-extrabold text-white mb-6 leading-tight">
                Ready to join the loop?
              </h2>
              <p className="text-[18px] text-white/70 mb-12 max-w-[500px] mx-auto">
                Whether you have food to give, or a community to feed, your platform awaits.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onLoginDonor}
                  className="w-full sm:w-auto bg-brand-donor text-white px-8 py-4 rounded-full font-bold text-[16px] hover:bg-brand-donor-hover hover:scale-105 transition-all shadow-lg"
                >
                  Join as Donor
                </button>
                <button
                  onClick={onLoginNgo}
                  className="w-full sm:w-auto bg-white text-brand-text px-8 py-4 rounded-full font-bold text-[16px] hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                >
                  Join as NGO
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* MINIMALIST FOOTER */}
        <footer className="border-t border-brand-border/60 py-8 px-6 bg-white text-center">
          <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo className="h-6 w-auto grayscale opacity-70" />
            </div>
            <div className="text-[13px] text-brand-text-muted font-medium">
              © {new Date().getFullYear()} NourishLoop. All rights reserved.
            </div>
          </div>
        </footer>
      </main>


    </div>
  );
}
