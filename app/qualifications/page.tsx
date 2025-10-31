'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ProgramOverviewSection from '@/components/public/program-overview-section';
import SEOHead from '@/components/seo/SEOHead';
import BottomNavigation from '@/components/public/bottom-navigation';
import DiscreteAdminAccess, { DiscreteAdminDot, useUrlAdminAccess } from '@/components/admin/discrete-access';
import SimpleAdminToggle from '@/components/admin/simple-admin-toggle';
import EditModal from '@/components/admin/edit-modal';
import { CMSServiceFactory } from '@/lib/cms/content-services';
import { ProgramIntro, ParticipantType, CandidateProfile, ProgramExclusions } from '@/lib/types/cms';

export default function QualificationsPage() {
  const [programIntro, setProgramIntro] = useState<ProgramIntro | null>(null);
  const [participantTypes, setParticipantTypes] = useState<ParticipantType[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [programExclusions, setProgramExclusions] = useState<ProgramExclusions | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'programIntro' | 'participantType' | 'candidateProfile' | 'programExclusions'>('programIntro');

  // Enable URL-based admin access
  useUrlAdminAccess();

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const [
        programIntroData,
        participantTypesData,
        candidateProfileData,
        programExclusionsData
      ] = await Promise.all([
        CMSServiceFactory.getProgramIntroService().getActiveProgramIntro(),
        CMSServiceFactory.getParticipantTypeService().getVisible(),
        CMSServiceFactory.getCandidateProfileService().getActiveCandidateProfile(),
        CMSServiceFactory.getProgramExclusionsService().getActiveProgramExclusions()
      ]);
      
      setProgramIntro(programIntroData);
      setParticipantTypes(participantTypesData);
      setCandidateProfile(candidateProfileData);
      setProgramExclusions(programExclusionsData);
    } catch (error) {
      console.error('Error loading qualifications content:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleEditIntro = useCallback(() => {
    const defaultIntro = {
      title: '',
      description: 'Alpha-Bet is the launchpad for Veterans and Reservists ready to take their first steps into entrepreneurship. Whether you already have an idea or are simply curious about the path, this program gives you the tools, experience, and network to start building.'
    };
    const introToEdit = programIntro || defaultIntro;
    setEditingItem(introToEdit);
    setEditingType('programIntro');
    setEditModalOpen(true);
  }, [programIntro]);

  const handleEditParticipantType = useCallback((type?: ParticipantType) => {
    setEditingItem(type);
    setEditingType('participantType');
    setEditModalOpen(true);
  }, []);

  const handleEditCandidateProfile = useCallback(() => {
    const defaultProfile = {
      title: 'The Alpha-Bet Candidate',
      description: '',
      highlights: [
        "Combat Veteran: Served in a combat role in the US or Israel.",
        "Serious about exploring entrepreneurship, not just \"filling time\"",
        "Collaborative, supportive, and eager to grow with others",
        "Curious, adaptable, and driven to turn military leadership into entrepreneurial impact",
        "Open to feedback and willing to put in the work to succeed"
      ]
    };
    const profileToEdit = candidateProfile || defaultProfile;
    setEditingItem(profileToEdit);
    setEditingType('candidateProfile');
    setEditModalOpen(true);
  }, [candidateProfile]);

  const handleEditExclusions = useCallback(() => {
    const defaultExclusions = {
      title: 'Who This Program Is Not For',
      description: '',
      highlights: [
        "Those who aren't ready to commit to a process of learning and practicing a new craft",
        "Experienced startup founders (the Version Bravo Accelerator is a better fit)",
        "Founders who are not Veterans or who did not serve in a combat unit",
        "Those who are using this as a way to figure out what to do next after the military - This program is open to transitioning or recently retired service members, however, you should be honest with yourself about whether you are genuinely interested in entrepreneurship or just looking for something to do after your service."
      ],
      note: "If you have entrepreneurial experience in other areas but want to understand the unique path of startups, Alpha-Bet is still a great fit."
    };
    const exclusionsToEdit = programExclusions || defaultExclusions;
    setEditingItem(exclusionsToEdit);
    setEditingType('programExclusions');
    setEditModalOpen(true);
  }, [programExclusions]);

  const handleSave = useCallback(async (data: any) => {
    try {
      if (editingType === 'programIntro') {
        // Save program intro data
        const introData = {
          title: data.title,
          description: data.description,
          isVisible: true,
          order: 1
        };
        
        if (programIntro && programIntro.id) {
          await CMSServiceFactory.getProgramIntroService().update(programIntro.id, introData);
        } else {
          await CMSServiceFactory.getProgramIntroService().create(introData);
        }
        await loadContent();
      } else if (editingType === 'participantType') {
        // Save participant type data
        const typeData = {
          ...data,
          highlights: Array.isArray(data.highlights) ? data.highlights : data.highlights.split('\n').filter((h: string) => h.trim()),
          isVisible: true,
          order: data.order || participantTypes.length + 1
        };
        
        if (editingItem && editingItem.id && !editingItem.id.startsWith('explorer-') && !editingItem.id.startsWith('builder-')) {
          await CMSServiceFactory.getParticipantTypeService().update(editingItem.id, typeData);
        } else {
          await CMSServiceFactory.getParticipantTypeService().create(typeData);
        }
        await loadContent();
      } else if (editingType === 'candidateProfile') {
        // Save candidate profile data
        const profileData = {
          ...data,
          highlights: Array.isArray(data.highlights) ? data.highlights : data.highlights.split('\n').filter((h: string) => h.trim()),
          isVisible: true,
          order: 1
        };
        
        if (candidateProfile && candidateProfile.id) {
          await CMSServiceFactory.getCandidateProfileService().update(candidateProfile.id, profileData);
        } else {
          await CMSServiceFactory.getCandidateProfileService().create(profileData);
        }
        await loadContent();
      } else if (editingType === 'programExclusions') {
        // Save program exclusions data
        const exclusionsData = {
          ...data,
          highlights: Array.isArray(data.highlights) ? data.highlights : data.highlights.split('\n').filter((h: string) => h.trim()),
          isVisible: true,
          order: 1
        };
        
        if (programExclusions && programExclusions.id) {
          await CMSServiceFactory.getProgramExclusionsService().update(programExclusions.id, exclusionsData);
        } else {
          await CMSServiceFactory.getProgramExclusionsService().create(exclusionsData);
        }
        await loadContent();
      }
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [editingItem, editingType, participantTypes.length, loadContent, programIntro, candidateProfile, programExclusions]);

  const programIntroFields = useMemo(() => [
    { key: 'title', label: 'Title', type: 'text' as const, required: false, placeholder: 'Optional section title' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Alpha-Bet is the launchpad for Veterans...' }
  ], []);

  const participantTypeFields = useMemo(() => [
    { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., Explorers' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: false, placeholder: 'Brief description of this participant type' },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'textarea' as const, required: true, placeholder: 'Enter each highlight on a new line...' },
    { key: 'order', label: 'Order', type: 'number' as const, required: true, placeholder: '1-10' }
  ], []);

  const candidateProfileFields = useMemo(() => [
    { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., The Alpha-Bet Candidate' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: false, placeholder: 'Optional description' },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'textarea' as const, required: true, placeholder: 'Enter each characteristic on a new line...' }
  ], []);

  const programExclusionsFields = useMemo(() => [
    { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g., Who This Program Is Not For' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: false, placeholder: 'Optional description' },
    { key: 'highlights', label: 'Exclusions (one per line)', type: 'textarea' as const, required: true, placeholder: 'Enter each exclusion on a new line...' },
    { key: 'note', label: 'Note (Optional)', type: 'textarea' as const, required: false, placeholder: 'Optional note to display at the bottom...' }
  ], []);

  const getEditFields = useCallback(() => {
    switch (editingType) {
      case 'programIntro':
        return programIntroFields;
      case 'participantType':
        return participantTypeFields;
      case 'candidateProfile':
        return candidateProfileFields;
      case 'programExclusions':
      default:
        return programExclusionsFields;
    }
  }, [editingType, programIntroFields, participantTypeFields, candidateProfileFields, programExclusionsFields]);

  const getModalTitle = useCallback(() => {
    switch (editingType) {
      case 'programIntro':
        return "Edit Program Introduction";
      case 'participantType':
        return editingItem?.title ? `Edit ${editingItem.title}` : "Add New Participant Type";
      case 'candidateProfile':
        return "Edit Candidate Profile";
      case 'programExclusions':
      default:
        return "Edit Program Exclusions";
    }
  }, [editingType, editingItem]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Eligibility Requirements - Who Should Apply to Alpha-Bet"
        description="Check if you qualify for Alpha-Bet: An entrepreneurship program for US & Israeli combat veterans. Requirements include military service, business interest, and program commitment."
        keywords={[
          'Alpha-Bet eligibility',
          'veteran program requirements',
          'combat veteran qualifications',
          'military entrepreneur eligibility',
          'veteran startup program requirements',
          'who can apply Alpha-Bet',
          'veteran business program eligibility',
          'military startup qualifications',
          'entrepreneur program requirements',
          'veteran accelerator eligibility'
        ]}
        canonical="/qualifications"
      />
      <div className="relative">
        {/* Discrete Admin Access Components */}
        <DiscreteAdminAccess />
        <DiscreteAdminDot />
        <SimpleAdminToggle />
        
        {/* Page Title Header */}
        <section className="py-8 sm:py-12 px-4 bg-gradient-to-br from-white via-white to-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6" style={{ fontFamily: "'Black Ops One', cursive" }}>
              The Alpha-Bet Participant
            </h1>
          </div>
        </section>
        
        {/* Program Overview Section */}
        <ProgramOverviewSection 
          programIntro={programIntro}
          participantTypes={participantTypes}
          candidateProfile={candidateProfile}
          programExclusions={programExclusions}
          onEditIntro={handleEditIntro}
          onEditParticipantType={handleEditParticipantType}
          onEditCandidateProfile={handleEditCandidateProfile}
          onEditExclusions={handleEditExclusions}
        />

        {/* Bottom Navigation */}
        <BottomNavigation currentPage="qualifications" />

        {/* Edit Modal */}
        <EditModal
          key={editingItem?.id || 'new'}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          title={getModalTitle()}
          fields={getEditFields()}
          initialData={{
            ...editingItem,
            // Convert highlights array to string for editing
            highlights: Array.isArray(editingItem?.highlights) ? editingItem.highlights.join('\n') : editingItem?.highlights
          }}
          loading={loading}
        />
      </div>
    </>
  );
}