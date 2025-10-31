'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { EXTERNAL_URLS } from '@/lib/config/urls';
import { FAQ } from '@/lib/types/cms';

interface FAQSectionProps {
  faqs: FAQ[];
  onEdit?: (faq?: FAQ) => void;
  onDelete?: (faq: FAQ) => void;
}

export default function FAQSection({ faqs, onEdit, onDelete }: FAQSectionProps) {
  const { isAdminMode } = useAdmin();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Default FAQ data
  const defaultFAQs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'Do I need a company already?',
      answer: 'Idea, yes. Company, not necessarily. You don\'t need to have incorporated yet but you do need to be all in. Vetted is for founders who are fully committed to building and executing on their idea. If you\'re still exploring what to build or don\'t yet have a defined concept, start with our Alpha-Bet program. It\'s designed to help you develop and validate your first venture.',
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-2',
      question: 'What kind of companies do you fund?',
      answer: 'We\'re generalists focused on ambitious, high-trust founders.',
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-3',
      question: 'Where is the program held?',
      answer: 'There are three phases of the Accelerator program. Phase 1: 10-day bootcamp in Israel. Phase 2: Virtual Mentorship. Phase 3: 10-day bootcamp in Miami, Florida.',
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-4',
      question: 'What are the dates of the Accelerator?',
      answer: 'Phase 1: xx, Phase 2: xx, Phase 3: xx',
      order: 4,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-5',
      question: 'What is the time commitment for each phase?',
      answer: 'Phase 1: 8AM - 6PM daily with several evening activities/events.<br>Phase 2: 2-4 hours per week<br>Phase 3: 8AM - 6PM daily with several evening activities/events.<br><br><strong>If accepted into the Accelerator, 100% participation is required.</strong><br><br>Ultimately, this program is designed to help you accelerate your business. Every minute of content, workshops or mentorship is advancing your startup. Our curriculum is built to make sure you not only are making progress but are able to manage your business in parallel.',
      order: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-6',
      question: 'Is the Accelerator conducted in Hebrew or in English?',
      answer: 'The entire program is conducted in English exclusively. You must be proficient in English to participate in the program.',
      order: 6,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-7',
      question: 'Why does Vetted focus on Combat Veterans?',
      answer: 'At Vetted, we hold the deepest respect for every individual who has served. Our program is deliberately designed for combat veterans because our curriculum is built to translate the unique experiences of frontline service into a successful entrepreneurial career. First, we help combat veterans recognize and reframe the powerful skills they already possess. The ability to lead small teams, make critical decisions under extreme uncertainty, risk analysis, and execute a mission with limited resources are the essence of entrepreneurship. Our training shows you how planning an operation is analogous to developing a market-entry strategy. Second, we bridge the skill gaps that often exist after years of operational focus. Frontline service builds incredible leaders, but it doesn\'t typically teach financial modeling, marketing analytics, or the art of effective storytelling and networking. Vetted provides targeted instruction in these crucial business fundamentals catered to the combat veteran. By limiting the cohort to veterans with a shared combat background, we create a high-trust environment built on mutual understanding. This fosters unparalleled peer support, allowing participants to not only build a business but also engage in a process of mutual growth and recovery.',
      order: 7,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-8',
      question: 'What kind of support continues after the Accelerator?',
      answer: 'Graduates join our exclusive alumni network with ongoing access to mentors, investors, and fellow veteran entrepreneurs. We also provide continued resources such as advanced workshops and networking events throughout the year.',
      order: 8,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-9',
      question: 'Is Alpha-Bet connected to Vetted?',
      answer: 'Yes. Alpha-Bet is our education program for aspiring veteran founders.',
      order: 9,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-10',
      question: 'If I have already raised money, can I apply?',
      answer: 'We prefer to be first money in, or very close to that. A small amount raised from Friends and Family is okay.',
      order: 10,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-11',
      question: 'Will this program help me find additional funding for my startup?',
      answer: 'One of the benefits of joining Vetted is joining the robust network of founders and investors. While we can\'t guarantee additional funding, you will gain all the tools and introductions needed to go and execute a successful fundraise.',
      order: 11,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-12',
      question: 'Do you help solo-founders find co-founders?',
      answer: 'While we can\'t guarantee this, we have a broad network of talented founders/operators/experts who can help open doors and make introductions.',
      order: 12,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-13',
      question: 'Is travelling to both bootcamps required?',
      answer: 'Yes. 100% participation is required. If you cannot make the travel and participate fully, you will not be admitted to the program.',
      order: 13,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-14',
      question: 'How do we choose which startups to fund?',
      answer: 'We have an application process that\'s open to any startup founded by a combat veteran. You can apply here.',
      order: 14,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-15',
      question: 'What can I use the Vetted investment for?',
      answer: 'You can use your Vetted investment however it best supports your company\'s growth. For most founders, that starts with covering personal runway — paying yourself a modest salary so you can focus full-time on building the business. From there, it\'s about deploying capital strategically to accelerate progress where it matters most.',
      order: 15,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-16',
      question: 'Why are there two 10-day bootcamps?',
      answer: 'We have found that the momentum gained in these bootcamps is much better than weekly meetings. We see significant gain from each company. This is balanced knowing that people have families and so we do 2 trips spread apart by 6 weeks to strike the right balance.',
      order: 16,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Merge CMS FAQs with defaults - hardcoded FAQs first, then Firebase FAQs
  const mergeFAQsWithDefaults = () => {
    // Filter visible hardcoded FAQs and sort by order
    const visibleDefaultFAQs = defaultFAQs
      .filter(faq => faq.isVisible !== false)
      .sort((a, b) => a.order - b.order);
    
    // Filter visible Firebase FAQs (exclude duplicates by ID or question) and sort by order
    const visibleCmsFAQs = faqs
      .filter(faq => faq.isVisible !== false)
      .filter(faq => !defaultFAQs.some(defaultFaq => 
        defaultFaq.id === faq.id || defaultFaq.question === faq.question
      ))
      .sort((a, b) => a.order - b.order);
    
    // Return hardcoded FAQs first, then Firebase FAQs
    return [...visibleDefaultFAQs, ...visibleCmsFAQs];
  };

  const displayFAQs = mergeFAQsWithDefaults();

  const handleFAQClick = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleEditClick = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(faq);
    }
  };

  const handleDeleteClick = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this FAQ?')) {
      onDelete(faq);
    }
  };

  const handleAddClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 bg-gradient-to-br from-white via-white to-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-gray-800 text-sm font-medium tracking-wide">FREQUENTLY ASKED QUESTIONS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            Questions & Answers
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about the Alpha-Bet program and application process.
          </p>
        </div>

        {/* Admin Add Button */}
        {isAdminMode && (
          <div className="mb-8 text-center">
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg"
            >
              <i className="fas fa-plus"></i>
              <span>Add FAQ</span>
            </button>
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayFAQs.map((faq) => (
            <div
              key={faq.id}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              {/* Admin Buttons */}
              {isAdminMode && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={(e) => handleEditClick(faq, e)}
                    className="w-8 h-8 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                    title="Edit this FAQ"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {!defaultFAQs.some(defaultFaq => defaultFaq.id === faq.id || defaultFaq.question === faq.question) && (
                    <button
                      onClick={(e) => handleDeleteClick(faq, e)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg"
                      title="Delete this FAQ"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              )}

              {/* Question Header */}
              <button
                onClick={() => handleFAQClick(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-300 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-black pr-8 leading-tight">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-gray-400">
                  {expandedFAQ === faq.id ? (
                    <i className="fas fa-chevron-up"></i>
                  ) : (
                    <i className="fas fa-chevron-down"></i>
                  )}
                </div>
              </button>

              {/* Answer Content */}
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-5 border-t border-white/10 bg-white/5">
                  <div className="pt-4">
                    <div 
                      className="text-black leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-white via-white to-gray-200 rounded-2xl p-8 text-black shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-6 max-w-2xl mx-auto">
              Our team is here to help you understand if Alpha-Bet is the right fit for your entrepreneurial journey.
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:info@vbv.vc"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
              >
                <i className="fas fa-envelope"></i>
                <span>info@vbv.vc</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
