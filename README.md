# 🎓 Smart FFCS Timetable Planner

A sophisticated web application for VIT Bhopal students to create, visualize, and manage their Fully Flexible Credit System (FFCS) timetables with intelligent transition tracking.

## ✨ Features

### 📅 **Core Functionality**
- **Interactive Timetable**: Visual 6-day week schedule with 7 time slots per day
- **Smart Slot Selection**: Click-based interface for easy course scheduling
- **Location Tracking**: Automatic classroom transition detection and visualization
- **Color Coding**: Custom color schemes for different courses
- **Faculty & Venue Management**: Complete course details management

### 🚀 **Advanced Features**
- **Transition Intelligence**:
  - 🟢 **Green**: Same location / First class of day
  - 🟡 **Yellow**: Medium distance transitions (Ab01 ↔ AR/LC)
  - 🔴 **Red**: Long distance transitions (Ab02 ↔ Ab01/AR/LC)
- **Multiple Export Options**:
  - 📄 **PDF**: High-quality printable timetables
  - 🖼️ **PNG**: High-resolution images for sharing
  - 📊 **JSON**: Complete data backup format
  - 📈 **CSV**: Excel/Sheets compatible format
- **Edit & Delete**: Full CRUD operations for courses
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🏛️ **VIT Bhopal Specific**
- Campus location mapping (Ab02, Ab01, LC, AR, ONLINE)
- Standard FFCS time slots (8:30-19:30)
- Academic block-wise transition calculations
- University-branded interface

## 🛠️ **Technologies Used**

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Libraries**:
  - Font Awesome 6.6.0 (Icons)
  - Google Fonts (Exo 2 & Inter)
  - html2canvas (Export to image)
  - jsPDF (PDF generation)
- **No Backend Required**: Runs completely in browser

## 📋 **How to Use**

### 1. **Course Configuration**
1. Enter number of courses
2. Generate or select color palette
3. Fill course details:
   - Course Code (Optional)
   - Subject Name (Required)
   - Faculty Name (Optional)
   - Location (Required)
4. Click "Add Course to Timetable"

### 2. **Timetable Building**
1. Click on empty timetable cells to select slots
2. Selected slots will be highlighted
3. Click "Confirm Selection" to finalize
4. Repeat for all courses

### 3. **Editing & Management**
- Click "Edit" on any course card to modify
- Click "Delete" to remove a course
- Use "Clear All" to reset completely

### 4. **Export Options**
Click "Export Timetable" and choose:
- PDF: Best for printing
- PNG: For sharing online
- JSON: For backup/restore
- CSV: For spreadsheet analysis

## 🏗️ **Project Structure**
```
smart-ffcs-timetable/
│
├── index.html # Main application file
│
├── README.md # This documentation
│
└── Features:
├── Color palette generator
├── Transition detection system
├── Location-based analytics
├── Multiple export formats
├── Responsive design
└── No installation required
```
## 🎨 **Color System**

The application uses a sophisticated color management system:

1. **Auto-generated Palettes**: Creates harmonious color schemes
2. **Contrast Optimization**: Automatically adjusts text color for readability
3. **Transition Indicators**:
   - 🔴 Red: Long distance (15+ min walk)
   - 🟡 Yellow: Medium distance (5-15 min walk)
   - 🟢 Green: Same location / No transition needed

## 📱 **Responsive Design**

- **Desktop**: Full-featured interface with side-by-side panels
- **Tablet**: Optimized layout with adjusted spacing
- **Mobile**: Single-column layout with touch-friendly elements

## 🚦 **Transition Rules**

| Transition Type | Locations Involved | Color | Walking Time |
|----------------|-------------------|-------|--------------|
| Long Distance | Ab02 ↔ Ab01/AR/LC | 🔴 Red | 15+ minutes |
| Medium Distance | Ab01 ↔ AR/LC | 🟡 Yellow | 5-15 minutes |
| Same Location | Any → Same | 🟢 Green | 0 minutes |
| Online Classes | ONLINE → Any | 🟢 Green | N/A |

## 💾 **Export Formats**

### **PDF Export**
- Includes header with university branding
- High-resolution timetable image
- Course list with all details
- Page numbers and generation timestamp

### **JSON Export**
```json
{
  "title": "Smart FFCS Timetable",
  "university": "VIT Bhopal University",
  "courses": [],
  "timetable": {},
  "summary": {}
}
```
CSV Export
Column headers for easy import

Time slot mapping included

Compatible with Excel/Google Sheets

### **🎯 Use Cases**
- Semester Planning: Plan your entire semester schedule

- Conflict Avoidance: Visualize potential time/location conflicts

- Transition Optimization: Minimize walking time between classes

- Backup & Restore: Save and load your timetable

- Sharing: Export and share with classmates

### **🔧 Keyboard Shortcuts**
Shortcut	Action
```
Ctrl/Cmd + E ->	Open export modal
Click	Select/deselect -> timetable slot
Escape ->	Cancel current selection
```
### **🌐 Browser Compatibility**
- ✅ Chrome 60+

- ✅ Firefox 55+

- ✅ Safari 11+

- ✅ Edge 79+

- ✅ Opera 50+

### **📝 License & Attribution**
- University: VIT Bhopal

- System: Fully Flexible Credit System (FFCS)

- Developed For: Faculty of Engineering & Technology

- Version: 2.1

- Year: 2026

### **Made with ❤️ for VIT Bhopal Students**

Simplify your semester planning with Smart FFCS Timetable Planner!
