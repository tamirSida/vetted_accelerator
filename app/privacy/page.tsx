'use client';

import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import Footer from '@/components/public/footer';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';

export default function PrivacyPolicyPage() {
  useUrlAdminAccess();

  return (
    <>
      <SEOHead
        title="Privacy Policy - Alpha-Bet Program"
        description="Alpha-Bet privacy policy: How we collect, use, and protect your personal information in our veteran entrepreneurship program. Transparent data practices for program participants."
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
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your privacy and data security are our top priorities
            </p>
            <div className="mt-8 text-sm text-gray-600">
              Last Updated: August 16, 2025
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Quick Summary</h2>
              <p className="text-blue-800 mb-0">
                We collect only essential information needed to run the Alpha-Bet program effectively. 
                We never sell your data, and we protect your information with military-grade security standards.
              </p>
            </div>

            <h2>1. Information We Collect</h2>
            
            <h3>Website Usage Data</h3>
            <ul>
              <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
              <li><strong>Website Analytics:</strong> Pages visited, time spent, navigation patterns</li>
              <li><strong>Cookies:</strong> Essential cookies for website functionality</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <h3>Website Operations</h3>
            <ul>
              <li>Ensure website functionality and security</li>
              <li>Analyze website traffic and improve user experience</li>
              <li>Respond to contact form inquiries (when provided)</li>
              <li>Send newsletters to subscribers (when opted in)</li>
            </ul>

            <h3>Website Improvement</h3>
            <ul>
              <li>Understand how visitors use our website</li>
              <li>Improve website design and functionality</li>
              <li>Optimize content and resources</li>
            </ul>

            <h3>Communications</h3>
            <ul>
              <li>Send program-related notifications and updates</li>
              <li>Share alumni success stories and networking opportunities (with consent)</li>
              <li>Provide newsletter content about entrepreneurship and veteran business resources</li>
            </ul>

            <h2>3. Information Sharing</h2>
            
            <h3>We DO Share Information With:</h3>
            <ul>
              <li><strong>Program Mentors:</strong> Limited information to facilitate effective mentorship</li>
              <li><strong>Fellow Participants:</strong> Basic contact information for networking (with your consent)</li>
              <li><strong>Service Providers:</strong> Trusted partners who help deliver program services (under strict confidentiality agreements)</li>
            </ul>

            <h3>We NEVER Share Information With:</h3>
            <ul>
              <li>Marketing companies or data brokers</li>
              <li>Social media platforms for advertising purposes</li>
              <li>Any third parties for commercial gain</li>
              <li>Government agencies (except as required by law)</li>
            </ul>

            <h2>4. Data Security</h2>
            
            <p>We implement enterprise-grade security measures:</p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Strict limitations on who can access participant data</li>
              <li><strong>Regular Audits:</strong> Periodic security reviews and updates</li>
              <li><strong>Secure Infrastructure:</strong> Industry-standard cloud security protocols</li>
            </ul>

            <h2>5. Your Rights and Choices</h2>
            
            <h3>You Can:</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of all personal information we have about you</li>
              <li><strong>Update:</strong> Correct or update your personal information at any time</li>
              <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from newsletters and non-essential communications</li>
              <li><strong>Limit:</strong> Restrict how we use or share your information</li>
            </ul>

            <h3>To Exercise Your Rights:</h3>
            <p>Contact us at <span className="text-blue-600">info@vbv.vc</span> with your request. We'll respond within 30 days.</p>

            <h2>6. Data Retention</h2>
            
            <ul>
              <li><strong>Program Participants:</strong> Information retained for the duration of the program plus 7 years for alumni support</li>
              <li><strong>Unsuccessful Applicants:</strong> Application data kept for 2 years for future program consideration</li>
              <li><strong>Website Analytics:</strong> Aggregated data retained for 3 years to improve website experience</li>
              <li><strong>Communications:</strong> Email communications retained as long as you're subscribed</li>
            </ul>

            <h2>7. International Data Transfers</h2>
            
            <p>
              Since we serve both US and Israeli veterans, your information may be transferred between 
              these countries. We ensure all transfers comply with applicable privacy laws and maintain 
              the same level of protection regardless of location.
            </p>

            <h2>8. Children's Privacy</h2>
            
            <p>
              The Alpha-Bet program is designed for military veterans and is not intended for individuals 
              under 18. We do not knowingly collect information from children under 18.
            </p>

            <h2>9. Changes to This Policy</h2>
            
            <p>
              We may update this privacy policy periodically. Significant changes will be communicated 
              via email to program participants. The "Last Updated" date at the top indicates when 
              changes were last made.
            </p>

            <h2>10. Contact Us</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-4">For privacy-related questions or requests:</p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> <span className="text-blue-600">info@vbv.vc</span></li>
              </ul>
            </div>

            <hr className="my-8" />
            
            <div className="text-center text-gray-600">
              <p>
                This privacy policy reflects our commitment to transparency and your right to privacy. 
                We believe veterans deserve the highest standards of data protection and respect.
              </p>
            </div>

          </div>
        </section>

        <BottomNavigation currentPage="home" />
      </div>
    </>
  );
}