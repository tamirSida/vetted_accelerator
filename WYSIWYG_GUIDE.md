# WYSIWYG Content Management System

## 🎯 **How to Edit Content**

### **Step 1: Access Admin Mode**
Use any of the discrete access methods:
- **Tiny dot**: Click the small dot in top-right corner 5 times
- **Keyboard**: Press `Ctrl+Shift+A` or type `ALPHABET`  
- **URL**: Add `?alpha=bet` or `#admin2024` to any URL

### **Step 2: Enable Edit Mode**
1. After logging in with Firebase auth, you'll see an "Edit Mode" button in top-right
2. Click it to enable inline editing
3. Button changes to "Exit Edit Mode" - click again to disable

### **Step 3: Edit Content Inline**
1. **Hover over any section** - you'll see a blue dashed border
2. **Edit button appears** - click "Edit [Section]" button
3. **Modal opens** - edit content in the popup form
4. **Save changes** - content updates immediately on the site

## 📝 **What You Can Edit**

### **✅ Currently Editable:**
- **Hero Section** - Headline, sub-headline, CTA button, background image
- **Content Sections** - Title, content text, section type

### **🚧 Coming Soon:**
- Team members
- Testimonials  
- Curriculum items
- Call-to-action buttons

## 🎨 **Visual Cues**

### **Admin Mode ON:**
- Blue dashed borders around editable sections
- Edit buttons appear on hover
- "Exit Edit Mode" button visible

### **Admin Mode OFF:**
- Normal website view
- No edit buttons or borders
- "Edit Mode" button available for logged-in users

## 🔧 **Technical Details**

### **Architecture:**
- `EditableSection` - Wrapper component that adds edit functionality
- `EditModal` - Popup form for editing content
- `SimpleAdminToggle` - Toggle button for admin mode
- Real-time Firebase updates

### **Security:**
- Only authenticated Firebase users can edit
- Changes save immediately to Firestore
- Public users see content without edit capabilities

## 🚀 **Usage Examples**

1. **Edit Hero Section:**
   - Enable edit mode → Hover over hero → Click "Edit Hero"
   - Change headline, sub-headline, or CTA button
   - Save → Changes appear immediately

2. **Add New Content:**
   - Currently requires using the traditional CMS at `/admin`
   - WYSIWYG creation coming in future updates

3. **Quick Content Updates:**
   - Perfect for fixing typos, updating text, changing images
   - No need to navigate through admin panels

---

**This WYSIWYG system provides the same functionality as VBV's inline editing, allowing you to edit content directly on the page where you see it!**