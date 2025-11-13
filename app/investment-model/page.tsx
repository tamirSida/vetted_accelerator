'use client';

import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';

export default function InvestmentModelPage() {
  useUrlAdminAccess();

  return (
    <>
      <SEOHead
        title="Investment Model - Vetted Accelerator"
        description="Learn about Vetted's founder-first investment model: 2% equity for full accelerator experience, potential $500K follow-on investment. Zero cash cost to participants."
        noindex={true}
      />
      <div className="relative">
        <DiscreteAdminAccess />
        <DiscreteAdminDot />
        <SimpleAdminToggle />
        
        {/* Header */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-r from-white via-white to-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Investment Model
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              A founder-first partnership designed to give you an unfair advantage
            </p>
            <div className="mt-8 text-sm text-gray-600">
              Last Updated: November 13, 2025
            </div>
          </div>
        </section>

        {/* Investment Model Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-2">Investment Overview</h2>
              <p className="text-green-800 mb-0">
                Our model is a true partnership designed to give you an unfair advantage. We invest in every company we back, providing significant resources, capital, and our global network.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Founder-First Investment Model</h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our model is a true partnership, designed to give you an unfair advantage. We invest in every company we back, providing significant resources, capital, and our global network.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Your acceptance into Vetted unlocks the most immersive accelerator experience you'll find anywhere, which includes all of the following at zero cash cost to you:
            </p>

            <ul className="space-y-4 mb-12 text-gray-700 text-lg">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <div>
                  <strong>Direct Mentorship from Proven Founders:</strong> You'll be matched directly with successful entrepreneurs from our network of high-caliber mentors who have built and scaled companies themselves. See our full mentor list <a href="/team" className="text-blue-600 underline hover:text-blue-800">here</a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <div>
                  <strong>Global Immersion & All-Inclusive Travel:</strong> We cover all your major travel and living expenses during the bootcamps, including international and domestic flights (Israel & U.S.), hotels, ground transportation, and most meals.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <div>
                  <strong>Unforgettable Strategic Experiences:</strong> This isn't just a business trip. We curate experiences that build bonds and broaden perspectives, from tours of the Old City of Jerusalem to private visits with innovation leaders at companies like Google X and Meta.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">•</span>
                <div>
                  <strong>Battle-Tested Workshops:</strong> Our curriculum is built by combat veterans, for combat veterans. You'll participate in expert-led workshops on critical skills like fundraising, negotiation, and storytelling, all tailored to translate your military experience into a powerful business narrative.
                </div>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Investment Commitment</h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Securing your place in the Vetted program comes in exchange for <strong>2% equity</strong> in your company. This initial stake covers the full cost of the immersive accelerator experience detailed above, ensuring you can participate at zero cash cost.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              From there, we have the ability to invest <strong>up to $500,000</strong> for additional equity in our most promising companies by the end of the program. Our decision to invest further is based on what matters most: your progress, traction, and execution.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Unlike other accelerators, we don't run a high-volume model. We go deep. We build a unique accelerator experience for each company, tailoring our support to your specific needs. Our goal is simple: to give you the best possible platform to win, and to invest more when you do.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Questions About Our Investment Model?</h3>
              <p className="text-blue-800 mb-0">
                Contact us at <a href="mailto:info@thevetted.vc" className="text-blue-600 underline hover:text-blue-800">info@thevetted.vc</a> or check out our <a href="/#faq" className="text-blue-600 underline hover:text-blue-800">FAQ section</a> for more details.
              </p>
            </div>
            
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}