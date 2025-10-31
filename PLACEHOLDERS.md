# Alpha-Bet Website Placeholder Content Tracking

This document tracks all placeholder content in the Alpha-Bet website that needs to be replaced with real information.

## 🚨 **CRITICAL PLACEHOLDERS** (High Priority - User Visible)

### 📧 Contact Information

| Type | Current Value | Location | Status | Priority |
|------|---------------|----------|--------|----------|
| Email | `info@vbv.vc` | `components/public/footer.tsx` (line ~79) | ❌ Needs Real Email | HIGH |
| Phone | `+1 (555) 123-4567` | `components/public/footer.tsx` (line ~83) | ❌ Needs Real Phone | HIGH |

### 🔗 Social Media Links

| Platform | Current Value | Location | Status | Priority |
|----------|---------------|----------|--------|----------|
| LinkedIn | `https://www.linkedin.com/school/versionbravo/posts/?feedView=all` | `/lib/config/urls.ts` | ✅ Real VBV LinkedIn | COMPLETE |
| Twitter | ❌ REMOVED | N/A | ✅ No Twitter Links | COMPLETE |

### 👥 Team Members (CMS Manageable)

| Content | Location | Status | Priority |
|---------|----------|--------|----------|
| Team Member 1 Info | Default CMS content in `/team` page | ❌ Needs Real Bio | HIGH |
| Team Member 2 Info | Default CMS content in `/team` page | ❌ Needs Real Bio | HIGH |
| Team Member 3 Info | Default CMS content in `/team` page | ❌ Needs Real Bio | HIGH |

**Note**: Team members can be updated via CMS admin interface by adding `?admin=true` to `/team` page

### 💬 Testimonials (CMS Manageable)

| Content | Location | Status | Priority |
|---------|----------|--------|----------|
| Veteran Testimonial 1 | Default CMS content on homepage | ❌ Needs Real Testimonial | HIGH |
| Veteran Testimonial 2 | Default CMS content on homepage | ❌ Needs Real Testimonial | HIGH |

**Note**: Testimonials can be updated via CMS admin interface on homepage with `?admin=true`

### ❓ FAQ Content (CMS Manageable)

| Content | Location | Status | Priority |
|---------|----------|--------|----------|
| FAQ Items | Default FAQ content on homepage | ✅ Good Default Content | MEDIUM |

**Note**: FAQ content is comprehensive but can be customized via CMS with delete/edit functionality

## ⚠️ **EXTERNAL FORM INTEGRATION** (Medium Priority - UX)

### Application Form

| Field | Current Value | Location | Status | Priority |
|-------|---------------|----------|--------|----------|
| External Form URL | `#` (placeholder) | `/lib/config/urls.ts` | ❌ Needs Real Form URL | MEDIUM |
| Apply Button Links | Points to placeholder | Multiple pages | ❌ Will work when URL added | MEDIUM |

**Note**: Local `/apply` page removed. All apply buttons now point to `EXTERNAL_URLS.APPLY_FORM` for easy centralized management.

## 🔧 **ADMIN PLACEHOLDERS** (Low Priority - Internal Use)

### Admin Interface

| Field | Current Value | Location | Status | Priority |
|-------|---------------|----------|--------|----------|
| Admin Email Placeholder | `admin@example.com` | `app/admin/page.tsx:140` | ❌ Internal Use Only | LOW |
| User Creation Placeholder | `admin@example.com` | `app/admin/users/page.tsx:161` | ❌ Internal Use Only | LOW |

## ✅ **CONTENT TO VERIFY** (May Be Intentional)

### Brand References

| Content | Location | Status | Notes |
|---------|----------|--------|--------|
| "Version Bravo" references | Multiple files | ✅ Verify if Real Brand | Appears throughout content |
| "Version Bravo ecosystem" | Default content sections | ✅ Verify if Real Brand | May be parent organization |
| "Version Bravo accelerator" | Default content sections | ✅ Verify if Real Brand | Referenced as partner program |

## 📋 **COMPLETION CHECKLIST**

### Phase 1: Critical Contact Information
- [ ] Replace `info@vbv.vc` with real email address (footer)
- [ ] Replace `+1 (555) 123-4567` with real phone number (footer)
- [x] ✅ LinkedIn URL updated to real VBV school page
- [x] ✅ Twitter references removed from website

### Phase 2: Content (Via CMS Admin) - **NEW GRANULAR CMS**
- [ ] Add real team member profiles via `/team?admin=true`
- [ ] Add real veteran testimonials via homepage `?admin=true`
- [ ] **NEW**: Edit individual Mission Brief and Key Highlights via granular CMS on homepage
- [ ] Customize FAQ content if needed via homepage `?admin=true`
- [ ] Update qualification requirements if needed via `/qualifications?admin=true`

### Phase 3: External Form Integration
- [ ] Update `EXTERNAL_URLS.APPLY_FORM` in `/lib/config/urls.ts` with real application form URL
- [ ] Test all "Apply Now" buttons point to correct external form

### Phase 4: Verification
- [ ] Confirm "Version Bravo" branding is intentional
- [ ] Test all contact methods work correctly
- [ ] Verify all social media links are active
- [ ] Test mobile popup functionality on curriculum page
- [ ] Verify logo displays correctly on all devices

## 🚀 **QUICK FIX GUIDE**

### To Update Contact Information:
1. **Email**: Edit `components/public/footer.tsx` (around line 79)
2. **Phone**: Edit `components/public/footer.tsx` (around line 83)
3. **Social Media**: Edit `components/public/footer.tsx` (around lines 38 and 46)

### To Update Content via CMS:
1. **Homepage**: Go to `yourdomain.com/?admin=true` for hero, testimonials, FAQ
2. **NEW Granular Content**: Individual "Mission Brief" and "Key Highlights" editing with add/remove functionality
3. **Team**: Go to `yourdomain.com/team?admin=true` for team member profiles
4. **Curriculum**: Go to `yourdomain.com/curriculum?admin=true` for curriculum content
5. **Qualifications**: Go to `yourdomain.com/qualifications?admin=true` for requirements
6. **External Form**: Update URL in `/lib/config/urls.ts` for all apply buttons

### To Test Changes:
```bash
npm run build  # Verify no errors
npm run dev    # Test in development
```

### Mobile Testing:
- Test curriculum popup modals on mobile devices
- Verify logo displays on mobile navigation  
- Check responsive design across all pages
- **NEW**: Test granular CMS editing on mobile devices
- **NEW**: Verify grid layout displays properly on all screen sizes

---

**Last Updated**: August 16, 2025  
**Status**: 🟢 Production-ready with advanced CMS system  
**Recent Major Changes**: 
- ✅ Implemented granular CMS with database persistence
- ✅ Enhanced visual design with seamless backgrounds and grid layouts
- ✅ Updated privacy policy to reflect minimal data collection
- ✅ Fixed double footer issues on legal pages
- ✅ Removed Twitter references and updated LinkedIn to real VBV URL
**Next Action**: Update EXTERNAL_URLS.APPLY_FORM in `/lib/config/urls.ts` when form URL available  
**Website Status**: ✅ Advanced production-ready website with modern CMS capabilities