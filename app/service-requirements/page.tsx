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
        title="Service Requirements - The Vetted Accelerator"
        description="Military service requirements for The Vetted Accelerator: Combat veteran eligibility criteria for US and Israeli military personnel. Detailed requirements for program participation."
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
          </div>
        </section>

        {/* Service Requirements Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <p className="text-gray-800 text-lg leading-relaxed mb-8">
              To ensure alignment between participants and the program's mission, applicants must meet the following:
            </p>

            <div className="space-y-8">
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Honorable Service:</h2>
                <p className="text-gray-700 leading-relaxed ml-6">
                  Received an honorable discharge or its equivalent from the United States Armed Forces or the Israel Defense Forces (IDF).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Combat Unit Service</h2>
                <p className="text-gray-700 leading-relaxed ml-6 mb-4">
                  Must have served in an officially recognized combat-designated unit:
                </p>
                
                <div className="ml-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Israel (IDF):</h3>
                    <p className="text-gray-700 leading-relaxed ml-6">
                      Infantry brigades (e.g., Golani, Givati, Paratroopers), Special Forces (e.g., Shayetet 13, Sayeret Matkal, Duvdevan, Shaldag, Unit 669), and equivalent combat roles
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">United States:</h3>
                    <p className="text-gray-700 leading-relaxed ml-6">
                      U.S. Special Operations (SEALs, Green Berets, Delta, Rangers, Marine Raiders, PJs, CCTs, SR, TACP). Also eligible: Combat arms from Infantry, Marine Infantry, and equivalent frontline roles
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Primary Combat Role:</h2>
                <p className="text-gray-700 leading-relaxed ml-6">
                  Served in a unit whose core mission involved direct engagement with opposing forces. Examples include infantry, special operations, armor, combat engineering, and field artillery.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned to a Combat Unit:</h2>
                <p className="text-gray-700 leading-relaxed ml-6">
                  Veterans from combat support specialties are eligible if they were formally assigned or attached to a front-line combat unit and routinely operated in a forward, hostile environment as part of their primary duties.
                </p>
              </div>

            </div>

            <hr className="my-12" />

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Documentation Requirements / Verifiable Service Record:</h2>
              <p className="text-gray-700 leading-relaxed">
                Service and unit assignment must be verifiable through official documentation and provided during the application process. Examples include: DD-214 for U.S. veterans, 'Teudat Lochem' or 'Teudat Shichrur' for Israeli veterans which clearly states status as a "לוחם/מת", or other relevant service records which clearly state service in a combat role. Validation of service is mandatory to be admitted to the program. However, if you have privacy or confidentiality concerns around sharing these materials, please contact us directly.
              </p>
            </div>

          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}