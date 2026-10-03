import React from 'react';
import { ArrowRight, Heart, Leaf, Share2, Shield, Users } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

export default function LandingPage({ onLoginDonor, onLoginNgo }) {
  const steps = [
    {
      title: "List Surplus Food",
      description: "Quickly post details about excess food from your restaurant, event, or store.",
      icon: Leaf,
    },
    {
      title: "Match with NGOs",
      description: "Nearby verified organizations are instantly notified of your available donation.",
      icon: Share2,
    },
    {
      title: "Track Pickup & Impact",
      description: "Organizations claim and pick up the food. You track your total environmental impact.",
      icon: Heart,
    }
  ];

  const benefits = [
    {
      title: "Zero Waste Goals",
      description: "Significantly reduce your organization's carbon footprint and food waste.",
      icon: Shield,
    },
    {
      title: "Community Support",
      description: "Directly provide nutritious meals to vulnerable populations in your city.",
      icon: Users,
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLoginNgo} className="hidden sm:inline-flex font-semibold text-gray-600 hover:text-emerald-700">For NGOs</Button>
            <Button onClick={onLoginDonor} className="shadow-emerald-500/20 shadow-lg px-6">
              Donor Login
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-[#FDFDFC] to-white -z-10"></div>
          
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now connecting donors and NGOs in real-time
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
              Turn surplus food into <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">shared meals.</span>
            </h1>
            
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              A professional platform for restaurants, grocers, and events to seamlessly donate excess food to local organizations fighting hunger.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button onClick={onLoginDonor} size="lg" className="w-full sm:w-auto text-base px-8 h-14 shadow-emerald-500/20 shadow-xl group">
                Join as a Donor
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
              <Button variant="secondary" onClick={onLoginNgo} size="lg" className="w-full sm:w-auto text-base px-8 h-14 bg-white">
                NGO Portal
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white border-y border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">How It Works</h2>
              <p className="text-lg text-gray-500">Three simple steps to make a difference in your community.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 -z-10"></div>
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center mb-8 group-hover:border-emerald-200 group-hover:shadow-emerald-500/10 transition-all duration-300 group-hover:-translate-y-1 relative">
                      <div className="absolute inset-0 bg-emerald-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Icon size={32} className="text-emerald-600 relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-sm">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-[#FBFBFA]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-emerald-900 rounded-[3rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center p-12 lg:p-20 relative z-10">
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
                    Making an impact,<br/>one meal at a time.
                  </h2>
                  <p className="text-emerald-100 text-lg mb-10 leading-relaxed max-w-lg">
                    Join hundreds of businesses that have committed to zero waste and community support. By donating your surplus food, you're building a sustainable future.
                  </p>
                  
                  <div className="space-y-6">
                    {benefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center flex-shrink-0 text-emerald-400">
                            <Icon size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                            <p className="text-emerald-200/80 text-sm leading-relaxed">{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square rounded-[2rem] bg-emerald-800 border border-emerald-700 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8">
                      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/50 text-white">
                        <Leaf size={40} />
                      </div>
                      <div className="text-5xl font-bold text-white mb-2">10,000+</div>
                      <div className="text-emerald-200 font-medium tracking-wide uppercase text-sm">Meals Shared</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo compact />
          <p className="text-sm text-gray-400 font-medium">© {new Date().getFullYear()} Surplus Food Donation Network.</p>
        </div>
      </footer>
    </div>
  );
}
