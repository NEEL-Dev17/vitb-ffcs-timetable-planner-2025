let courses = [];
let selectedSlots = new Set();
let colorPalette = [];
let selectedColor = null;
let currentCourse = null;
let isSelecting = false;
let editingCourseIndex = -1;

const timetableSlots = {
    'Mon': ['A11', 'B11', 'C11', 'A21', 'A14', 'B21', 'C21'],
    'Tue': ['D11', 'E11', 'F11', 'D21', 'E14', 'E21', 'F21'],
    'Wed': ['A12', 'B12', 'C12', 'A22', 'B14', 'B22', 'A24'],
    'Thu': ['D12', 'E12', 'F12', 'D22', 'F14', 'E22', 'F22'],
    'Fri': ['A13', 'B13', 'C13', 'A23', 'C14', 'B23', 'B24'],
    'Sat': ['D13', 'E13', 'F13', 'D23', 'D14', 'D24', 'E23']
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

document.addEventListener('DOMContentLoaded', function() {
    initializeTimetable();
    generateColorPalette();
    updateTotalSlots();
});

function generateColorPalette() {
    const count = parseInt(document.getElementById('courseCount').value) || 6;
    colorPalette = [];
    const baseHue = 210;
    
    for (let i = 0; i < count; i++) {
        const hue = (baseHue + (i * 360 / count)) % 360;
        const saturation = 60 + Math.random() * 25;
        const lightness = 40 + Math.random() * 20;
        const color = hslToHex(hue, saturation, lightness);
        
        const colorName = `Course ${i + 1}`;
        colorPalette.push({ color, name: colorName });
    }

    displayColorPalette();
    showNotification(`Generated ${count} academic color themes`, 'info');
}

function displayColorPalette() {
    const container = document.getElementById('colorPalette');
    container.innerHTML = '';
    
    colorPalette.forEach((colorObj, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.onclick = () => selectColor(index);
        colorItem.innerHTML = `
            <div class="color-preview" style="background-color: ${colorObj.color};"></div>
            <div class="color-info">
                <div class="color-name">${colorObj.name}</div>
                <div class="color-code">${colorObj.color}</div>
            </div>
        `;
        container.appendChild(colorItem);
    });
}

function selectColor(index) {
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    document.querySelectorAll('.color-item')[index].classList.add('selected');
    selectedColor = colorPalette[index];
    
    document.getElementById('selectedColorInfo').innerHTML = `
        <i class="fas fa-check-circle" style="color: ${selectedColor.color}"></i>
        Selected: <span style="color: ${selectedColor.color}">${selectedColor.name}</span>
        <div style="font-size: 0.85rem; color: var(--gray); margin-top: 5px;">
            Ready for course assignment
        </div>
    `;
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function initializeTimetable() {
    const tbody = document.querySelector('#timetable tbody');
    tbody.innerHTML = '';

    days.forEach(day => {
        const row = document.createElement('tr');
        
        const dayCell = document.createElement('th');
        dayCell.className = 'day-header';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        timetableSlots[day].forEach((slotId, index) => {
            const cell = document.createElement('td');
            
            if (index === 3) { 
                const lunchCell = document.createElement('td');
                lunchCell.className = 'lunch-column';
                lunchCell.innerHTML = '🍴';
                row.appendChild(lunchCell);
            }
            
            const cellDiv = document.createElement('div');
            cellDiv.className = 'empty-slot';
            cellDiv.id = slotId;
            cellDiv.onclick = () => handleCellClick(slotId);
            cellDiv.innerHTML = `<span style="font-weight: 700;">${slotId}</span>`;
            
            cell.appendChild(cellDiv);
            row.appendChild(cell);
        });

        const locationCell = document.createElement('td');
        locationCell.className = 'location-column';
        locationCell.id = `loc-${day}`;
        locationCell.innerHTML = `
            <div class="location-info" style="font-size: 0.8rem; padding: 5px;">
                <div id="loc-info-${day}">No classes</div>
            </div>
        `;
        row.appendChild(locationCell);

        tbody.appendChild(row);
    });
}

function addCourse() {
    const courseCode = document.getElementById('courseCode').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const facultyName = document.getElementById('facultyName').value.trim();
    const location = document.getElementById('courseLocation').value;
    
    if (!courseName) {
        showNotification('Please enter subject name', 'error');
        return;
    }
    
    if (!location) {
        showNotification('Please select a location', 'error');
        return;
    }
    
    if (!selectedColor) {
        showNotification('Please select a color for the course', 'error');
        return;
    }

    if (editingCourseIndex !== -1) {
        courses[editingCourseIndex] = {
            ...courses[editingCourseIndex],
            code: courseCode || 'N/A',
            name: courseName,
            faculty: facultyName || 'Not specified',
            location: location,
            color: selectedColor.color,
            colorName: selectedColor.name
        };
        
        updateTimetable();
        
        resetEditMode();
        
        showNotification(`Course "${courseName}" updated successfully!`, 'success');
    } else {
        currentCourse = {
            id: courses.length + 1,
            code: courseCode || 'N/A',
            name: courseName,
            faculty: facultyName || 'Not specified',
            location: location,
            color: selectedColor.color,
            colorName: selectedColor.name,
            slots: []
        };

        document.getElementById('selectedSlots').style.display = 'block';
        document.getElementById('slotTags').innerHTML = '<span style="color: var(--gray);"><i class="fas fa-mouse-pointer"></i> Click on timetable cells to select slots...</span>';
        
        isSelecting = true;
        showNotification('Select time slots for ' + courseName, 'info');
    }
}

function handleCellClick(slotId) {
    if (!isSelecting || !currentCourse) return;
    
    const existingCourse = courses.find((course, index) => 
        index !== editingCourseIndex && course.slots.includes(slotId)
    );
    
    if (existingCourse) {
        showNotification(`Slot ${slotId} is already assigned to ${existingCourse.name}`, 'error');
        return;
    }

    const cell = document.getElementById(slotId);
    
    if (selectedSlots.has(slotId)) {
        selectedSlots.delete(slotId);
        cell.classList.remove('cell-selected');
    } else {
        selectedSlots.add(slotId);
        cell.classList.add('cell-selected');
    }

    updateSelectedSlotsDisplay();
}

function updateSelectedSlotsDisplay() {
    const container = document.getElementById('slotTags');
    
    if (selectedSlots.size === 0) {
        container.innerHTML = '<span style="color: var(--gray);"><i class="fas fa-mouse-pointer"></i> Click on timetable cells to select slots...</span>';
        return;
    }

    const tags = Array.from(selectedSlots).map(slot => `
        <div class="slot-tag">
            <i class="fas fa-clock"></i> ${slot}
            <button class="remove-tag" onclick="removeSlot('${slot}')" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.9rem; padding: 2px 6px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    container.innerHTML = tags;
}

function removeSlot(slotId) {
    selectedSlots.delete(slotId);
    const cell = document.getElementById(slotId);
    if (cell) {
        cell.classList.remove('cell-selected');
    }
    updateSelectedSlotsDisplay();
}

function confirmSelection() {
    if (selectedSlots.size === 0) {
        showNotification('Please select at least one time slot', 'error');
        return;
    }

    if (editingCourseIndex !== -1) {
        courses[editingCourseIndex].slots = Array.from(selectedSlots);
        editingCourseIndex = -1;
    } else {
        currentCourse.slots = Array.from(selectedSlots);
        courses.push(currentCourse);
    }

    updateTimetable();
    resetSelection();
    
    showNotification(`Course "${currentCourse.name}" ${editingCourseIndex !== -1 ? 'updated' : 'added'} successfully!`, 'success');
}

function cancelSelection() {
    resetSelection();
    showNotification('Selection cancelled', 'info');
}

function resetSelection() {
    selectedSlots.forEach(slot => {
        const cell = document.getElementById(slot);
        if (cell) {
            cell.classList.remove('cell-selected');
        }
    });
    
    selectedSlots.clear();
    currentCourse = null;
    editingCourseIndex = -1;
    isSelecting = false;
    
    document.getElementById('selectedSlots').style.display = 'none';
    document.getElementById('courseCode').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('facultyName').value = '';
    document.getElementById('courseLocation').selectedIndex = 0;
    document.getElementById('selectedColorInfo').innerHTML = `
        <i class="fas fa-info-circle"></i> Select a color for your course
    `;

    resetEditMode();
}

function resetEditMode() {
    const setupSection = document.getElementById('setupSection');
    const addCourseBtn = document.getElementById('addCourseBtn');

    setupSection.classList.remove('edit-mode-active');
    
    const existingLabel = setupSection.querySelector('.edit-mode-label');
    if (existingLabel) {
        existingLabel.remove();
    }

    addCourseBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Course to Timetable';
    
    editingCourseIndex = -1;
}

function updateTimetable() {
    days.forEach(day => {
        timetableSlots[day].forEach(slotId => {
            const cell = document.getElementById(slotId);
            if (cell) {
                cell.className = 'empty-slot';
                cell.onclick = () => handleCellClick(slotId);
                cell.innerHTML = `<span style="font-weight: 700;">${slotId}</span>`;
                cell.classList.remove('cell-selected'); // Remove selection highlight
            }
        });
    });

    courses.forEach(course => {
        course.slots.forEach(slotId => {
            const cell = document.getElementById(slotId);
            if (cell) {
                cell.className = 'course-slot';
                cell.onclick = null;
                cell.style.backgroundColor = `${course.color}15`;
                cell.style.borderColor = course.color;
                cell.style.boxShadow = `0 2px 8px ${course.color}30`;
                
                let contentHTML = `
                    <div class="course-name">${course.name}</div>
                `;
                
                if (course.code !== 'N/A') {
                    contentHTML += `<div class="course-code">${course.code}</div>`;
                }
                
                if (course.faculty !== 'Not specified') {
                    contentHTML += `<div class="course-faculty">${course.faculty}</div>`;
                }
                
                contentHTML += `
                    <div class="course-venue" style="background-color: ${course.color}40; color: ${getContrastColor(course.color)}; border: 1px solid ${course.color}60;">
                        ${course.location}
                    </div>
                `;
                
                cell.innerHTML = contentHTML;
            }
        });
    });

    updateLocationTransitions();
    document.getElementById('courseCountDisplay').textContent = courses.length;
    updateCoursesList();
    updateTotalSlots();
}

function updateTotalSlots() {
    const totalFilledSlots = courses.reduce((total, course) => total + course.slots.length, 0);
    document.getElementById('totalSlots').textContent = totalFilledSlots;
}

function updateLocationTransitions() {
    let totalTransitions = 0;
    
    days.forEach(day => {
        const daySlots = timetableSlots[day];
        let previousLocation = null;
        let previousSlot = null;
        let hasGap = false;
        
        const sortedSlots = daySlots.map(slotId => ({
            id: slotId,
            timeIndex: getTimeIndex(slotId)
        })).sort((a, b) => a.timeIndex - b.timeIndex);
        
        sortedSlots.forEach(({ id: slotId, timeIndex }) => {
            const cell = document.getElementById(slotId);
            const course = courses.find(c => c.slots.includes(slotId));
            
            const existingMarker = cell.querySelector('.transition-marker');
            if (existingMarker) existingMarker.remove();
            
            if (course) {
                const currentLocation = course.location;
                let transitionType = null;
                
                if (!previousLocation) {
                    transitionType = 'green';
                } 

                else if (hasGap) {
                    transitionType = 'green';
                    hasGap = false;
                }

                else {
                    transitionType = getTransitionType(previousLocation, currentLocation);
                    if (transitionType) totalTransitions++;
                }
                
                if (transitionType) {
                    const marker = document.createElement('div');
                    marker.className = `transition-marker transition-${transitionType}`;
                    cell.appendChild(marker);
                }
                
                previousLocation = currentLocation;
                previousSlot = slotId;
                hasGap = false;
            } else {

                if (previousLocation) {
                    hasGap = true;
                }
            }
        });
        
        updateDayLocationInfo(day);
    });
    
    document.getElementById('transitionCount').textContent = totalTransitions;
}

function getTimeIndex(slotId) {
    const timeOrder = {
        'A11': 0, 'B11': 1, 'C11': 2, 'A21': 3, 'A14': 4, 'B21': 5, 'C21': 6,
        'D11': 0, 'E11': 1, 'F11': 2, 'D21': 3, 'E14': 4, 'E21': 5, 'F21': 6,
        'A12': 0, 'B12': 1, 'C12': 2, 'A22': 3, 'B14': 4, 'B22': 5, 'A24': 6,
        'D12': 0, 'E12': 1, 'F12': 2, 'D22': 3, 'F14': 4, 'E22': 5, 'F22': 6,
        'A13': 0, 'B13': 1, 'C13': 2, 'A23': 3, 'C14': 4, 'B23': 5, 'B24': 6,
        'D13': 0, 'E13': 1, 'F13': 2, 'D23': 3, 'D14': 4, 'D24': 5, 'E23': 6
    };
    return timeOrder[slotId] || 0;
}

function getTransitionType(loc1, loc2) {
    const redTransitions = [
        ['Ab02', 'Ab01'], ['Ab01', 'Ab02'],
        ['Ab02', 'AR'], ['AR', 'Ab02'],
        ['Ab02', 'LC'], ['LC', 'Ab02']
    ];
    
    const yellowTransitions = [
        ['Ab01', 'AR'], ['Ab01', 'LC'],
        ['LC', 'Ab01'], ['AR', 'Ab01'],
        ['LC', 'AR'], ['AR', 'LC']
    ];
    
    const greenTransitions = [
        ['Ab02', 'Ab02'], ['Ab01', 'Ab01'],
        ['AR', 'AR'], ['LC', 'LC'],
        ['ONLINE','ONLINE'],
        ['ONLINE', 'Ab02'], ['Ab02', 'ONLINE'],
        ['ONLINE', 'Ab01'], ['Ab01', 'ONLINE'],
        ['ONLINE', 'AR'], ['AR', 'ONLINE'],
        ['ONLINE', 'LC'], ['LC', 'ONLINE']
    ];
    
    for (const [l1, l2] of redTransitions) {
        if ((loc1 === l1 && loc2 === l2) || (loc1 === l2 && loc2 === l1)) {
            return 'red';
        }
    }
    
    for (const [l1, l2] of yellowTransitions) {
        if ((loc1 === l1 && loc2 === l2) || (loc1 === l2 && loc2 === l1)) {
            return 'yellow';
        }
    }
    
    for (const [l1, l2] of greenTransitions) {
        if (loc1 === l1 && loc2 === l2) {
            return 'green';
        }
    }
    
    return null;
}

function updateDayLocationInfo(day) {
    const daySlots = timetableSlots[day];
    const coursesForDay = courses.filter(course => 
        course.slots.some(slot => daySlots.includes(slot))
    );
    
    const locationCell = document.getElementById(`loc-info-${day}`);
    
    if (coursesForDay.length === 0) {
        locationCell.innerHTML = '<span style="color: var(--gray);">No classes</span>';
        return;
    }
    
    const locations = coursesForDay.map(course => course.location);
    const uniqueLocations = [...new Set(locations)];
    
    locationCell.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 5px;">${coursesForDay.length} class${coursesForDay.length > 1 ? 'es' : ''}</div>
        <div style="font-size: 0.75rem;">
            ${uniqueLocations.map(loc => 
                `<div style="margin: 2px 0; padding: 2px 5px; background: #E8F4FF; border-radius: 4px; border-left: 3px solid var(--campus-blue);">
                    ${loc}
                </div>`
            ).join('')}
        </div>
    `;
}

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function updateCoursesList() {
    const container = document.getElementById('coursesContainer');
    const coursesListSection = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesListSection.style.display = 'none';
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--gray); font-style: italic;"><i class="fas fa-book-open"></i><br>No courses added yet. Add your first course above!</div>';
        return;
    }
    
    coursesListSection.style.display = 'block';

    container.innerHTML = `
        <div style="overflow-x: auto;">
            <table border="1" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #003366; color: white;">
                        <th style="padding: 10px; width: 75px; font-size: 20px;">Sl No.</th>
                        <th style="padding: 10px; font-size: 20px;">Course Name</th>
                        <th style="padding: 10px; font-size: 20px;">CourseCode</th>
                        <th style="padding: 10px; font-size: 20px;">Faculty</th>
                        <th style="padding: 10px; font-size: 20px;">Location</th>
                        <th style="padding: 10px; font-size: 20px;">Time Slots</th>
                        <th style="padding: 10px; font-size: 20px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map((course, index) => {
                        console.log(`Course ${index + 1}:`, {
                            name: course.name,
                            code: course.code,
                            faculty: course.faculty,
                            location: course.location,
                            slots: course.slots
                        });
                        
                        return `
                            <tr>
                                <td style="text-align: center; padding: 10px; font-size: 18px;">${index + 1}</td>
                                <td style="padding: 10px; font-size: 18px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 12px; height: 12px; background: ${course.color}; border-radius: 2px;"></div>
                                        ${course.name}
                                    </div>
                                </td>
                                <td style="text-align: center; padding: 10px; font-size: 18px;">${course.code}</td>
                                <td style="text-align: center; padding: 10px; font-size: 18px;">${course.faculty}</td>
                                <td style="text-align: center; padding: 10px;"><strong>${course.location}</strong></td>
                                <td style="text-align: center; padding: 10px font-size: 18px;">
                                    ${course.slots.map(slot => `<span style="display: inline-block; padding: 3px 8px; margin: 2px; background: #f0f0f0; border-radius: 4px;">${slot}</span>`).join('')}
                                </td>
                                <td style="text-align: center; padding: 10px; font-size: 18px;">
                                    <div style="display: flex; gap: 5px; justify-content: center;">
                                        <button onclick="editCourse(${index})" style="padding: 5px 10px; background: #003366; color: white; border: none; border-radius: 10px; cursor: pointer;">Edit</button>
                                        <button onclick="deleteCourse(${index})" style="padding: 5px 10px; background: #dc143c; color: white; border: none; border-radius: 10px; cursor: pointer;">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function editCourse(index) {
    const course = courses[index];

    selectedSlots.forEach(slot => {
        const cell = document.getElementById(slot);
        if (cell) {
            cell.classList.remove('cell-selected');
        }
    });
    
    document.getElementById('courseCode').value = course.code !== 'N/A' ? course.code : '';
    document.getElementById('courseName').value = course.name;
    document.getElementById('facultyName').value = course.faculty !== 'Not specified' ? course.faculty : '';
    document.getElementById('courseLocation').value = course.location;
    
    let colorIndex = colorPalette.findIndex(c => c.color === course.color);
    
    if (colorIndex === -1) {
        colorPalette.push({ 
            color: course.color, 
            name: course.colorName || `Custom - ${course.name.substring(0, 15)}...` 
        });
        colorIndex = colorPalette.length - 1;
        displayColorPalette();
    }
    
    selectColor(colorIndex);
    
    editingCourseIndex = index;
    currentCourse = { ...course };

    selectedSlots = new Set(course.slots);
    document.getElementById('selectedSlots').style.display = 'block';
    isSelecting = true;

    days.forEach(day => {
        timetableSlots[day].forEach(slotId => {
            const cell = document.getElementById(slotId);
            if (cell) {
                cell.classList.remove('cell-selected');
            }
        });
    });

    course.slots.forEach(slotId => {
        const cell = document.getElementById(slotId);
        if (cell) {
            cell.classList.add('cell-selected');
        }
    });
    
    updateSelectedSlotsDisplay();
    
    const setupSection = document.getElementById('setupSection');
    const addCourseBtn = document.getElementById('addCourseBtn');
    
    setupSection.classList.add('edit-mode-active');
    
    const existingLabel = setupSection.querySelector('.edit-mode-label');
    if (existingLabel) {
        existingLabel.remove();
    }
    
    const editLabel = document.createElement('div');
    editLabel.className = 'edit-mode-label';
    editLabel.innerHTML = `<i class="fas fa-edit"></i> EDITING: ${course.name}`;
    setupSection.appendChild(editLabel);
    
    addCourseBtn.innerHTML = '<i class="fas fa-save"></i> Update Course';
    
    showNotification(`Editing "${course.name}". Modify details and click UPDATE.`, 'info');
}

function deleteCourse(index) {
    if (confirm(`Delete course "${courses[index].name}"?`)) {

        const wasEditing = (index === editingCourseIndex);
        
        courses.splice(index, 1);
        updateTimetable();
        showNotification('Course deleted successfully', 'success');
        
        if (wasEditing) {
            resetEditMode();
            resetSelection();
        }
    }
}

function clearAll() {
    if (courses.length === 0) {
        showNotification('No courses to clear', 'info');
        return;
    }
    
    if (confirm('Clear all courses? This action cannot be undone.')) {
        courses = [];
        selectedSlots.clear();
        currentCourse = null;
        editingCourseIndex = -1;
        isSelecting = false;
        
        updateTimetable();
        document.getElementById('selectedSlots').style.display = 'none';
        document.getElementById('coursesList').style.display = 'none';
        
        resetEditMode();
        
        showNotification('All courses cleared successfully', 'success');
    }
}

function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <div>${message}</div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                container.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
