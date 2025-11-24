'use client';

import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import Link from 'next/link';

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
        <section className="py-16 sm:py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-white via-white to-gray-200">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Our Founder-First Investment Model
            </h1>
          </div>
        </section>

        {/* Investment Model Content */}
        <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-5xl mx-auto prose prose-lg max-w-none">
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our model is a true partnership, designed to give you an unfair advantage. We invest massive time and effort in every company we back, providing significant resources and our global network.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Your acceptance into Vetted unlocks the most immersive accelerator experience you'll find anywhere, which includes all of the following at zero cash cost to you:
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <strong>Direct Mentorship from Proven Founders:</strong> You'll be matched directly with successful entrepreneurs from our network of high-caliber mentors who have built and scaled companies themselves. See our full mentor list <Link href="/team#mentors" className="text-blue-600 underline hover:text-blue-800">here</Link>
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <strong>Global Immersion & All-Inclusive Travel:</strong> We cover all your major travel and living expenses during the bootcamps, including international and domestic flights (Israel & U.S.), hotels, ground transportation, and most meals.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <strong>Unforgettable Strategic Experiences:</strong> This isn't just a business trip. We curate experiences that build bonds and broaden perspectives, from tours of the Old City of Jerusalem to private visits with innovation leaders at companies like Google X and Meta.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              <strong>Battle-Tested Workshops:</strong> Our curriculum is built by combat veterans, for combat veterans. You'll participate in expert-led workshops on critical skills like fundraising, negotiation, and storytelling, all tailored to translate your military experience into a powerful business narrative.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Our Investment Commitment</h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Securing your place in the Vetted program comes in exchange for 2% equity in your company. This initial stake covers the full cost of the immersive accelerator experience detailed above, ensuring you can participate at zero cash cost.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              From there, we have the ability to invest up to $500,000 for additional equity in our most promising companies by the end of the program. Our decision to invest further is based on what matters most: your progress, traction, and execution. Unlike other accelerators, we don't run a high-volume model. We go deep. We build a unique accelerator experience for each company, tailoring our support to your specific needs. Our goal is simple: to give you the best possible platform to win, and to invest more when you do.
            </p>
            
          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}