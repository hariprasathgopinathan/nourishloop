import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I update my organization location?",
    answer: "You can update your organization location by going to the 'Find Donations' page if you haven't set it yet. We use this to show you nearby donations."
  },
  {
    question: "What happens after I claim a donation?",
    answer: "Once you claim a donation, the donor is notified. You will need to coordinate pickup using the provided contact details. Make sure to mark it as 'Picked Up' in the 'My Claims' section once you have received the food."
  },
  {
    question: "Can I cancel a claim?",
    answer: "Currently, claims cannot be cancelled directly through the app to prevent food waste. If you cannot make it, please contact the donor immediately using the phone number provided in the claim details."
  },
  {
    question: "How are impact metrics calculated?",
    answer: "Impact metrics are calculated based on the weight (in kg) of the food you have successfully donated or claimed. We use a standard formula to convert this into meals served and CO2 emissions saved."
  }
];

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="max-w-4xl mx-auto pt-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-brand-border shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-brand-text mb-2">Frequently Asked Questions</h2>
            <p className="text-brand-text-muted mb-8">Find quick answers to common questions.</p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-brand-border rounded-2xl overflow-hidden bg-brand-surface">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none hover:bg-brand-neutral transition-colors"
                  >
                    <span className="font-semibold text-brand-text">{faq.question}</span>
                    <ChevronDown size={20} className={`text-brand-text-muted transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-[14px] text-brand-text-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="bg-gradient-to-br from-brand-donor to-emerald-700 rounded-[24px] shadow-sm p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need more help?</h3>
              <p className="text-emerald-50 mb-6 text-sm">
                Our support team is available 24/7 to assist you with any issues.
              </p>
              
              <button className="w-full py-3 bg-white text-brand-donor font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <Mail size={18} />
                Contact Support
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-brand-border shadow-sm p-6">
            <h4 className="text-[13px] font-bold text-brand-text-muted uppercase tracking-wider mb-4">Other Ways to Connect</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-brand-text-muted">Toll Free</p>
                  <p className="text-[14px] font-medium text-brand-text">1-800-SURPLUS</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-neutral flex items-center justify-center text-brand-text-muted">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-brand-text-muted">Email</p>
                  <p className="text-[14px] font-medium text-brand-text">support@surplusfood.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
