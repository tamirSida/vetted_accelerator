import Link from 'next/link';
import Image from 'next/image';
import { EXTERNAL_URLS } from '@/lib/config/urls';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Curriculum', href: '/curriculum' },
    { name: 'Qualifications', href: '/qualifications' },
    { name: 'Apply', href: EXTERNAL_URLS.APPLY_FORM, external: true },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Service Requirements', href: '/service-requirements' },
  ];

  return (
    <footer className="bg-blue-900 text-white border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 flex items-center justify-center relative">
                <Image 
                  src="/logo.png"
                  alt="Alpha-Bet Logo" 
                  width={48}
                  height={48}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              An entrepreneurship program for US and Israeli combat veterans,
              designed to equip them with the skills, network, and battle-tested mindset 
              to build successful startups.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href={EXTERNAL_URLS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
            
            {/* Our Partners Section - Hidden on mobile, moved to Legal section */}
            <div className="mt-8 hidden md:block">
              <h4 className="text-white font-semibold mb-4">
                Our Partners
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Image 
                  src="/partnerships/afins.png"
                  alt="AFINS Partner" 
                  width={80}
                  height={40}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/honor-foundation.png"
                  alt="Honor Foundation Partner" 
                  width={80}
                  height={40}
                  className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/momentum.png"
                  alt="Momentum Partner" 
                  width={80}
                  height={40}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto', maxWidth: '80px', maxHeight: '40px' }}
                />
                <Image 
                  src="/partnerships/shabak.png"
                  alt="Shabak Partner" 
                  width={80}
                  height={40}
                  className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/atalef.png"
                  alt="Atalef Partner" 
                  width={80}
                  height={40}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/versionbravo.png"
                  alt="Version Bravo Partner" 
                  width={80}
                  height={40}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <i className="fas fa-envelope mr-2"></i>
                info@vbv.vc
              </p>
            </div>
            
            <h3 className="text-white font-semibold mt-6 mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Our Partners Section - Mobile only */}
            <div className="mt-6 md:hidden">
              <h3 className="text-white font-semibold mb-4">Our Partners</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Image 
                  src="/partnerships/afins.png"
                  alt="AFINS Partner" 
                  width={60}
                  height={30}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/honor-foundation.png"
                  alt="Honor Foundation Partner" 
                  width={60}
                  height={30}
                  className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/momentum.png"
                  alt="Momentum Partner" 
                  width={60}
                  height={30}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto', maxWidth: '60px', maxHeight: '30px' }}
                />
                <Image 
                  src="/partnerships/shabak.png"
                  alt="Shabak Partner" 
                  width={60}
                  height={30}
                  className="object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/atalef.png"
                  alt="Atalef Partner" 
                  width={60}
                  height={30}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Image 
                  src="/partnerships/versionbravo.png"
                  alt="Version Bravo Partner" 
                  width={60}
                  height={30}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-blue-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Alpha-Bet Program. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 sm:mt-0">
              Empowering veterans to become entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}