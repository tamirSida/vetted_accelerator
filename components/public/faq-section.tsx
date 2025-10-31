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
      id: 'faq-3',
      question: 'What time commitment is required?',
      answer: 'The program requires approximately 8-10 hours per week over 10 weeks. This includes live workshops, self-paced learning modules, peer collaboration sessions, and practical assignments to develop your business concept.',
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-4',
      question: 'Is the program conducted online or in-person?',
      answer: 'The Alpha-Bet program is conducted entirely online, making it accessible to veterans regardless of location. All workshops, mentorship sessions, and networking events are held virtually using modern collaboration platforms.',
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-eligibility',
      question: 'Who is eligible for the Alpha-Bet program?',
      answer: 'The program is designed for US and Israeli combat veterans who have completed their military service in good standing (or active reservists) and are ready to start a career in entrepreneurship. <a href="/qualifications" class="text-blue-600 hover:text-blue-800 underline font-medium">See full qualifications here</a>',
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-program-dates',
      question: 'When does the program run?',
      answer: '<a href="#hero" class="text-blue-600 hover:text-blue-800 underline font-medium">See current program schedule</a>',
      order: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-7',
      question: 'For the Alpha-Bet program, What service types qualify as a Combat Veteran?',
      answer: '<a href="/service-requirements" class="text-blue-600 hover:text-blue-800 underline font-medium">Click here to see service requirements.</a>',
      order: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'faq-weekly-meetings',
      question: 'When are the weekly meetings?',
      answer: 'You must attend two weekly meetings: a lecture and a lab.<br><br>There are multiple lecture days per week, however you will be assigned to one lecture group for the duration of the program.<br><br>Please refer to the full <a href="/curriculum" class="text-blue-600 hover:text-blue-800 underline font-medium">curriculum</a> and <a href="/sched.pdf" class="text-blue-600 hover:text-blue-800 underline font-medium">schedule</a> for lecture times, exact dates, and exception weeks which adjust around holidays.',
      order: 6,
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
