'use client';

import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';

export default function TermsOfServicePage() {
  useUrlAdminAccess();

  return (
    <>
      <SEOHead
        title="Terms of Service - Alpha-Bet Program"
        description="Alpha-Bet terms of service: Program requirements, participant responsibilities, and guidelines for our veteran entrepreneurship program. Clear expectations for program participants."
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
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Program guidelines and expectations for Alpha-Bet participants
            </p>
            <div className="mt-8 text-sm text-gray-600">
              Last Updated: August 16, 2025
            </div>
          </div>
        </section>

        {/* Terms of Service Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-2">Program Overview</h2>
              <p className="text-green-800 mb-0">
                Alpha-Bet is a free, 10-week entrepreneurship program designed exclusively for US and Israeli combat veterans. 
                These terms outline the expectations and commitments for program participants.
              </p>
            </div>

            <h2>1. Program Eligibility & Acceptance</h2>
            
            <h3>Eligibility Requirements</h3>
            <ul>
              <li><strong>Military Service:</strong> Must be a combat veteran of US Armed Forces or Israeli Defense Forces</li>
              <li><strong>Commitment:</strong> Able to dedicate 8-10 hours per week for 10 consecutive weeks</li>
              <li><strong>Entrepreneurial Interest:</strong> Genuine interest in starting or growing a business</li>
              <li><strong>Communication:</strong> Proficient in English for program participation</li>
            </ul>

            <h3>Application Process</h3>
            <ul>
              <li>Submission of complete application with accurate information</li>
              <li>Participation in screening interviews if selected</li>
              <li>Acceptance is competitive and at Version Bravo's sole discretion</li>
              <li>Program capacity is limited to ensure quality mentorship</li>
            </ul>

            <h2>2. Participant Responsibilities</h2>
            
            <h3>Time Commitment</h3>
            <ul>
              <li><strong>Weekly Sessions:</strong> Attend live workshops and mentorship sessions</li>
              <li><strong>Assignments:</strong> Complete weekly assignments and projects on time</li>
              <li><strong>Peer Collaboration:</strong> Actively participate in group activities and peer feedback</li>
              <li><strong>Office Hours:</strong> Utilize mentor office hours and one-on-one sessions</li>
            </ul>

            <h3>Professional Conduct</h3>
            <ul>
              <li>Maintain respectful and professional communication with all participants and staff</li>
              <li>Honor the military values of integrity, service, and excellence</li>
              <li>Respect confidentiality of other participants' business ideas and personal information</li>
              <li>Provide constructive feedback and support to fellow participants</li>
            </ul>

            <h3>Intellectual Property</h3>
            <ul>
              <li><strong>Your Ideas:</strong> You retain full ownership of your business ideas and concepts</li>
              <li><strong>Program Materials:</strong> Course content and materials remain property of Version Bravo</li>
              <li><strong>Collaborative Work:</strong> Group project contributions may be shared among team members</li>
              <li><strong>Confidentiality:</strong> Respect and protect the intellectual property of other participants</li>
            </ul>

            <h2>3. Program Benefits & Services</h2>
            
            <h3>What's Included</h3>
            <ul>
              <li>10 weeks of structured entrepreneurship curriculum</li>
              <li>Expert mentorship from successful veteran entrepreneurs</li>
              <li>Access to investor and industry networks</li>
              <li>Business development tools and resources</li>
              <li>Peer networking with fellow veteran entrepreneurs</li>
              <li>Alumni network access after program completion</li>
            </ul>

            <h3>What's NOT Included</h3>
            <ul>
              <li>Guaranteed business success or profitability</li>
              <li>Direct financial investment in your business</li>
              <li>Legal, tax, or financial advisory services</li>
              <li>Ongoing business consulting beyond program duration</li>
              <li>Endorsement or promotion of specific business ideas</li>
            </ul>

            <h2>4. Program Completion & Removal</h2>
            
            <h3>Successful Completion</h3>
            <ul>
              <li>Attend at least 8 out of 10 weekly sessions</li>
              <li>Complete all required assignments and projects</li>
              <li>Deliver final business presentation</li>
              <li>Demonstrate progress on business development goals</li>
            </ul>

            <h3>Grounds for Removal</h3>
            <ul>
              <li>Failure to meet time commitment requirements</li>
              <li>Unprofessional conduct or disrespectful behavior</li>
              <li>Violation of confidentiality agreements</li>
              <li>Providing false information in application or during program</li>
              <li>Illegal activities or actions that harm the program's reputation</li>
            </ul>

            <h2>5. Use of Website & Digital Platforms</h2>
            
            <h3>Acceptable Use</h3>
            <ul>
              <li>Access program materials and resources for educational purposes</li>
              <li>Communicate respectfully with program staff and participants</li>
              <li>Use platform features to enhance learning and collaboration</li>
              <li>Report technical issues or inappropriate content promptly</li>
            </ul>

            <h3>Prohibited Activities</h3>
            <ul>
              <li>Sharing login credentials or allowing unauthorized access</li>
              <li>Distributing program materials outside the participant group</li>
              <li>Using platforms for commercial solicitation unrelated to program</li>
              <li>Attempting to hack, disrupt, or damage platform functionality</li>
            </ul>

            <h2>6. Communication & Media</h2>
            
            <h3>Program Communications</h3>
            <ul>
              <li>Primary communication will be via email and program platform</li>
              <li>Participants must maintain current contact information</li>
              <li>Response to program communications expected within 48 hours</li>
              <li>Emergency contact information required for program safety</li>
            </ul>

            <h3>Media & Publicity</h3>
            <ul>
              <li>Version Bravo may feature participant success stories (with permission)</li>
              <li>Participants may decline media participation at any time</li>
              <li>Group photos and general program footage may be used for promotional purposes</li>
              <li>Specific business details will not be shared without explicit consent</li>
            </ul>

            <h2>7. Disclaimers & Limitations</h2>
            
            <h3>Educational Purpose</h3>
            <p>
              The Alpha-Bet program provides educational content and mentorship for entrepreneurial development. 
              It does not guarantee business success, specific outcomes, or financial returns. Participants 
              are responsible for their own business decisions and outcomes.
            </p>

            <h3>Professional Advice</h3>
            <p>
              Program content is for educational purposes only and does not constitute legal, financial, 
              tax, or investment advice. Participants should consult qualified professionals for specific 
              business and legal guidance.
            </p>

            <h3>Network Connections</h3>
            <p>
              While we facilitate introductions to mentors, investors, and industry contacts, we cannot 
              guarantee specific business relationships, partnerships, or investment opportunities.
            </p>

            <h2>8. Limitation of Liability</h2>
            
            <p>
              Version Bravo's liability is limited to the extent permitted by law. We are not responsible for:
            </p>
            <ul>
              <li>Business failures or financial losses resulting from program participation</li>
              <li>Actions or advice of mentors, guest speakers, or other participants</li>
              <li>Technical issues or platform downtime affecting program access</li>
              <li>Outcomes of business relationships formed through the program</li>
            </ul>

            <h2>9. Changes to Terms</h2>
            
            <p>
              We may update these terms periodically to reflect program improvements or legal requirements. 
              Participants will be notified of significant changes via email. Continued participation 
              constitutes acceptance of updated terms.
            </p>

            <h2>10. Dispute Resolution</h2>
            
            <h3>Informal Resolution</h3>
            <p>
              We encourage open communication to resolve any concerns. Contact the program director 
              directly to discuss issues or feedback.
            </p>

            <h3>Formal Process</h3>
            <p>
              If informal resolution is unsuccessful, disputes will be handled through binding arbitration 
              in accordance with the rules of the American Arbitration Association.
            </p>

            <h2>11. Contact Information</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">For questions about these terms or program policies:</p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> <span className="text-blue-600">info@vbv.vc</span></li>
              </ul>
            </div>

            <hr className="my-8" />
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-blue-900 font-bold mb-2">Our Commitment to You</h3>
              <p className="text-blue-800 mb-0">
                These terms exist to ensure a productive, respectful, and valuable experience for all participants. 
                We're committed to supporting your entrepreneurial journey with the same dedication you showed in your military service.
              </p>
            </div>

          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}