'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { PortfolioCompany } from '@/lib/types/cms';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditModal from '@/components/admin/edit-modal';
import Image from 'next/image';

// Counter animation hook
const useCountUp = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration, hasStarted]);

  return { count, startAnimation };
};

export default function PortfolioPage() {
  const { isAdminMode } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Enable URL-based admin access
  useUrlAdminAccess();

  // Counter hooks for each statistic
  const israeliCount = useCountUp(29, 2000);
  const americanCount = useCountUp(31, 2000);
  const totalCount = useCountUp(60, 2000);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const companiesData = await CMSServiceFactory.getPortfolioCompanyService().getVisible();
      
      setPortfolioCompanies(companiesData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    // Start animations when component mounts and loading is done
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !statsVisible) {
            setStatsVisible(true);
            israeliCount.startAnimation();
            americanCount.startAnimation();
            totalCount.startAnimation();
          }
        },
        { threshold: 0.5 }
      );

      const statsElement = document.getElementById('stats-section');
      if (statsElement) {
        observer.observe(statsElement);
      }

      return () => observer.disconnect();
    }
  }, [loading, statsVisible, israeliCount, americanCount, totalCount]);

  const handleEditCompany = useCallback((company?: PortfolioCompany) => {
    setEditingItem(company || {});
    setEditModalOpen(true);
  }, []);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingItem && editingItem.id) {
        await CMSServiceFactory.getPortfolioCompanyService().update(editingItem.id, data);
      } else {
        const companyData = {
          ...data,
          isVisible: true,
          order: portfolioCompanies.length + 1
        };
        await CMSServiceFactory.getPortfolioCompanyService().create(companyData);
      }
      
      await loadContent();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [editingItem, loadContent, portfolioCompanies.length]);

  const handleDelete = useCallback(async (company: PortfolioCompany) => {
    if (!confirm(`Are you sure you want to delete ${company.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await CMSServiceFactory.getPortfolioCompanyService().delete(company.id);
      await loadContent();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    }
  }, [loadContent]);

  const getEditFields = () => [
    { key: 'name', label: 'Company Name', type: 'text' as const, required: true, placeholder: 'e.g., Guild' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Brief company description...' },
    { key: 'logo', label: 'Logo URL', type: 'text' as const, required: true, placeholder: 'https://example.com/logo.png' },
    { key: 'status', label: 'Status', type: 'select' as const, required: true, options: [
      { value: 'none', label: 'No Status' },
      { value: 'fundraising', label: 'Fundraising' },
      { value: 'exited', label: 'Exited' }
    ]}
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Controls */}
      <DiscreteAdminAccess />
      <DiscreteAdminDot />
      <SimpleAdminToggle />

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-2 sm:pb-3 px-4 bg-gradient-to-br from-white via-white to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 relative group">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700 text-sm font-medium tracking-wide">PORTFOLIO COMPANIES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Mission-Driven Founders.<br />
              Venture-Backed Results.
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Every company in our portfolio was built by a combat veteran founder.<br />
              We back operators who think fast, adapt under pressure, and execute relentlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Companies Accelerated Section */}
      <section id="stats-section" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Companies Accelerated
            </h2>
          </div>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Israeli Companies */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-blue-600 mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {israeliCount.count}
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Israeli Companies</h3>
              </div>
            </div>

            {/* Total Companies */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-blue-600 mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {totalCount.count}
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Total Companies</h3>
              </div>
            </div>

            {/* American Companies */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-blue-600 mb-4" style={{ fontFamily: "'Black Ops One', cursive" }}>
                  {americanCount.count}
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">American Companies</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6" style={{ fontFamily: "'Black Ops One', cursive" }}>
              Portfolio Highlights
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
              Proven track record of accelerating high growth veteran-led companies.
            </p>
            {isAdminMode && (
              <button
                onClick={() => handleEditCompany()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <i className="fas fa-plus"></i>
                Add Company
              </button>
            )}
          </div>
          
          {/* Portfolio Companies Grid */}
          {portfolioCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioCompanies.map((company) => (
                <div key={company.id} className="relative">
                  <div 
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full group border border-gray-100 hover:border-blue-400 cursor-pointer"
                    onClick={() => isAdminMode && handleEditCompany(company)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-center justify-center h-16 mb-4">
                        <Image
                          alt={`${company.name} logo`}
                          width={120}
                          height={48}
                          src={company.logo}
                          className="max-h-12 max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-gray-600 text-sm text-center leading-relaxed group-hover:text-gray-900 transition-colors">
                        {company.description}
                      </p>
                    </div>

                    {/* Admin Controls */}
                    {isAdminMode && (
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCompany(company);
                          }}
                          className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                          title="Edit company"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(company);
                          }}
                          className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                          title="Delete company"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    )}

                    {/* Status Flag */}
                    {company.status !== 'none' && (
                      <div className="absolute bottom-0 right-0 z-10">
                        <div 
                          className={`w-0 h-0 border-l-[80px] border-l-transparent border-b-[80px] ${
                            company.status === 'exited' ? 'border-b-blue-600' : 'border-b-green-600'
                          }`}
                        ></div>
                        <div className="absolute bottom-2 right-1 text-white text-[8px] font-bold leading-tight text-center">
                          <div>{company.status === 'exited' ? 'EXITED' : 'FUNDRAISING'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-building text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Companies Coming Soon</h3>
              <p className="text-gray-600 leading-relaxed">
                We're currently showcasing our portfolio of exceptional veteran-founded companies. 
                Stay tuned to see the innovative startups we're backing and the impact they're making.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        title={`${editingItem?.id ? 'Edit' : 'Add'} Portfolio Company`}
        fields={getEditFields()}
        initialData={editingItem}
      />
    </div>
  );
}