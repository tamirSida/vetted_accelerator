'use client';

import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';

export default function ServiceRequirementsPage() {
  useUrlAdminAccess();

  return (
    <>
      <SEOHead
        title="Service Requirements - Alpha-Bet Program"
        description="Military service requirements for Alpha-Bet: Combat veteran eligibility criteria for US and Israeli military personnel. Detailed requirements for program participation."
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
              Service Requirements
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Military service criteria for Alpha-Bet program eligibility
            </p>
            <div className="mt-8 text-sm text-gray-600">
              Last Updated: August 29, 2025
            </div>
          </div>
        </section>

        {/* Service Requirements Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Program Eligibility</h2>
              <p className="text-blue-800 mb-0">
                To ensure alignment between participants and the program's mission, applicants must meet the following service requirements.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Honorable Service</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed">
                    Received an honorable discharge or its equivalent from the <strong>United States Armed Forces</strong> or the <strong>Israel Defense Forces (IDF)</strong>.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Combat Unit Service</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Must have served in an officially recognized combat-designated unit:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">a) Israel (IDF)</h3>
                      <ul className="ml-6 space-y-1 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Infantry brigades:</strong> Golani, Givati, Paratroopers</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Special Forces:</strong> Shayetet 13, Sayeret Matkal, Duvdevan, Shaldag, Unit 669</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Equivalent combat roles</strong> in officially designated combat units</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">b) United States</h3>
                      <ul className="ml-6 space-y-1 text-gray-700">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>U.S. Special Operations:</strong> SEALs, Green Berets, Delta, Rangers, Marine Raiders, PJs, CCTs, SR, TACP</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Combat Arms:</strong> Infantry, Marine Infantry, and equivalent frontline roles</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Primary Combat Role</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Served in a unit whose core mission involved direct engagement with opposing forces. Examples include:
                  </p>
                  <ul className="ml-6 space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Infantry</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Special operations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Armor</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Combat engineering</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Field artillery</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Assigned to a Combat Unit</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed">
                    Veterans from combat support specialties are eligible if they were <strong>formally assigned or attached</strong> to a front-line combat unit and routinely operated in a forward, hostile environment as part of their primary duties.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Active Reserve Status (Israel Specific Requirement)</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed">
                    Israeli applicants must be currently serving as a combat-designated reservist or equivalent active reserve status.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Entrepreneurial Alignment</h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Commitment to applying combat-honed leadership, resilience, and problem-solving skills to entrepreneurial ventures. Participants should demonstrate genuine interest in:
                  </p>
                  <ul className="ml-6 space-y-1 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Translating military leadership experience into business contexts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Building innovative solutions and startups</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Contributing to the veteran entrepreneurship community</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Continuous learning and professional development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <hr className="my-8" />

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-2">Documentation Requirements / Verifiable Service Record:</h3>
              <p className="text-amber-800 mb-2">
                Service and unit assignment must be verifiable through official documentation (e.g., DD-214 for U.S. veterans, 'Teudat Shichrur' for Israeli veterans, or other relevant service records) and provided during the application process.
              </p>
              <p className="text-amber-800 mb-0">
                <strong>Note:</strong> Service records will be kept confidential and used solely for program eligibility verification.
              </p>
            </div>

            <h2>Contact for Questions</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">For questions about service requirements or eligibility:</p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> <span className="text-blue-600">info@vbv.vc</span></li>
              </ul>
            </div>

            <hr className="my-8" />
            
            <div className="text-center text-gray-600">
              <p>
                These requirements ensure that Alpha-Bet serves those who have demonstrated the courage, 
                discipline, and leadership that comes from frontline military service, creating a cohort 
                united by shared experiences and values.
              </p>
            </div>

          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}