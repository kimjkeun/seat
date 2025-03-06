document.addEventListener('DOMContentLoaded', function() {
    // State variables
    let students = [];
    let seats = [];
    let currentMode = 'manual';
    let numColumns = 5;
    let numRows = 7;
    let unassignedStudents = [];
    let selectedStudent = null;

    // DOM Elements
    const studentIdInput = document.getElementById('student-id');
    const studentNameInput = document.getElementById('student-name');
    const addStudentBtn = document.getElementById('add-student');
    const clearStudentsBtn = document.getElementById('clear-students');
    const studentTableBody = document.getElementById('student-table-body');
    const assignNextBtn = document.getElementById('assign-next');
    const assignAllBtn = document.getElementById('assign-all');
    const resetSeatsBtn = document.getElementById('reset-seats');
    const numColumnsInput = document.getElementById('num-columns');
    const numRowsInput = document.getElementById('num-rows');
    const modeManualBtn = document.getElementById('mode-manual');
    const modeExcludeBtn = document.getElementById('mode-exclude');
    const seatingChart = document.getElementById('seating-chart');
    const excelDataTextarea = document.getElementById('excel-data');
    const processExcelBtn = document.getElementById('process-excel');
    const unassignedStudentTableBody = document.getElementById('unassigned-student-table-body');
    
    // Page navigation elements
    const setupPage = document.getElementById('setup-page');
    const seatingPage = document.getElementById('seating-page');
    const goToSeatingBtn = document.getElementById('go-to-seating');
    const backToSetupBtn = document.getElementById('back-to-setup');

    // Initialize the seating chart
    initializeSeatingChart();

    // Event Listeners
    addStudentBtn.addEventListener('click', addStudent);
    clearStudentsBtn.addEventListener('click', clearStudents);
    assignNextBtn.addEventListener('click', assignNextStudent);
    assignAllBtn.addEventListener('click', assignAllStudents);
    resetSeatsBtn.addEventListener('click', resetSeats);
    modeManualBtn.addEventListener('click', () => setMode('manual'));
    modeExcludeBtn.addEventListener('click', () => setMode('exclude'));
    processExcelBtn.addEventListener('click', processExcelData);
    
    // Page navigation event listeners
    goToSeatingBtn.addEventListener('click', goToSeatingPage);
    backToSetupBtn.addEventListener('click', backToSetupPage);

    // Enter key for student inputs
    studentNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addStudent();
        }
    });

    studentIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            studentNameInput.focus();
        }
    });

    // Functions
    function initializeSeatingChart() {
        // Clear existing seats
        seatingChart.innerHTML = '';
        seats = [];

        // Update grid layout
        seatingChart.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
        seatingChart.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

        // Create seats
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numColumns; col++) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.dataset.row = row;
                seat.dataset.col = col;
                
                const seatInfo = {
                    element: seat,
                    row: row,
                    col: col,
                    assigned: false,
                    excluded: false,
                    studentId: '',
                    studentName: ''
                };
                
                seats.push(seatInfo);
                
                seat.addEventListener('click', function() {
                    handleSeatClick(seatInfo);
                });
                
                seatingChart.appendChild(seat);
            }
        }
    }

    function handleSeatClick(seat) {
        if (currentMode === 'exclude') {
            // Toggle excluded status
            seat.excluded = !seat.excluded;
            
            if (seat.excluded) {
                seat.element.classList.add('excluded');
                
                // If seat was assigned, remove student assignment
                if (seat.assigned) {
                    // Add the student back to unassigned list
                    const student = { id: seat.studentId, name: seat.studentName };
                    unassignedStudents.push(student);
                    updateUnassignedStudentTable();
                    
                    // Clear seat assignment
                    seat.assigned = false;
                    seat.studentId = '';
                    seat.studentName = '';
                }
            } else {
                seat.element.classList.remove('excluded');
            }
        } else if (currentMode === 'manual') {
            // Manual assignment mode
            if (seat.excluded) {
                alert('제외된 좌석입니다. 배치할 수 없습니다.');
                return;
            }
            
            if (seat.assigned) {
                // If already assigned, clear it
                const student = { id: seat.studentId, name: seat.studentName };
                unassignedStudents.push(student);
                updateUnassignedStudentTable();
                
                seat.assigned = false;
                seat.studentId = '';
                seat.studentName = '';
                updateSeatDisplay(seat);
            } else if (selectedStudent) {
                // Assign the selected student
                seat.assigned = true;
                seat.studentId = selectedStudent.id;
                seat.studentName = selectedStudent.name;
                updateSeatDisplay(seat);
                
                // Remove from unassigned students array
                unassignedStudents = unassignedStudents.filter(student => 
                    student.id !== selectedStudent.id);
                updateUnassignedStudentTable();
                
                // Clear selection
                clearStudentSelection();
            } else if (unassignedStudents.length > 0) {
                // If no student is selected but there are unassigned students, use the first one
                const student = unassignedStudents.shift();
                updateUnassignedStudentTable();
                
                seat.assigned = true;
                seat.studentId = student.id;
                seat.studentName = student.name;
                updateSeatDisplay(seat);
            } else {
                alert('배치할 학생이 없습니다. 학생을 선택하거나 추가해주세요.');
            }
        }
    }

    function updateSeatDisplay(seat) {
        seat.element.innerHTML = '';
        
        if (seat.assigned) {
            seat.element.classList.add('assigned');
            
            const idElement = document.createElement('div');
            idElement.className = 'student-id';
            idElement.textContent = seat.studentId;
            
            const nameElement = document.createElement('div');
            nameElement.className = 'student-name';
            nameElement.textContent = seat.studentName;
            
            seat.element.appendChild(idElement);
            seat.element.appendChild(nameElement);
        } else {
            seat.element.classList.remove('assigned');
        }
    }

    function selectStudent(student) {
        // Clear previous selection
        clearStudentSelection();
        
        // Set the selected student
        selectedStudent = student;
        
        // Find the student row and highlight it
        const rows = document.querySelectorAll('#student-table-body tr, #unassigned-student-table-body tr');
        for (const row of rows) {
            const idCell = row.querySelector('td:first-child');
            if (idCell && idCell.textContent === student.id) {
                row.classList.add('selected');
                break;
            }
        }
    }

    function clearStudentSelection() {
        selectedStudent = null;
        
        // Remove highlighting from all rows
        const rows = document.querySelectorAll('#student-table-body tr, #unassigned-student-table-body tr');
        for (const row of rows) {
            row.classList.remove('selected');
        }
    }

    function addStudent() {
        const id = studentIdInput.value.trim();
        const name = studentNameInput.value.trim();
        
        if (id === '' || name === '') {
            alert('학번과 이름을 모두 입력해주세요.');
            return;
        }
        
        // Check if student with same ID already exists
        if (students.some(student => student.id === id)) {
            alert('이미 존재하는 학번입니다.');
            return;
        }
        
        // Add to students array
        const student = { id, name };
        students.push(student);
        unassignedStudents.push(student);
        
        // Update the table
        updateStudentTable();
        updateUnassignedStudentTable();
        
        // Clear inputs
        studentIdInput.value = '';
        studentNameInput.value = '';
        studentIdInput.focus();
    }

    function processExcelData() {
        const data = excelDataTextarea.value.trim();
        
        if (data === '') {
            alert('엑셀 데이터를 입력해주세요.');
            return;
        }
        
        // Split by newlines
        const lines = data.split('\n');
        let addedCount = 0;
        let duplicateCount = 0;
        
        for (const line of lines) {
            // Skip empty lines
            if (line.trim() === '') continue;
            
            // Split by tab or multiple spaces
            const parts = line.split(/\t|\s{2,}/);
            
            if (parts.length >= 2) {
                const id = parts[0].trim();
                const name = parts[1].trim();
                
                // Skip if empty id or name
                if (id === '' || name === '') continue;
                
                // Check for duplicates
                if (students.some(student => student.id === id)) {
                    duplicateCount++;
                    continue;
                }
                
                // Add student
                const student = { id, name };
                students.push(student);
                unassignedStudents.push(student);
                addedCount++;
            }
        }
        
        // Update the table
        updateStudentTable();
        updateUnassignedStudentTable();
        
        // Clear textarea
        excelDataTextarea.value = '';
        
        // Show result
        alert(`${addedCount}명의 학생이 추가되었습니다. ${duplicateCount}명은 중복으로 추가되지 않았습니다.`);
    }

    function updateStudentTable() {
        studentTableBody.innerHTML = '';
        
        for (const student of students) {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = student.id;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            
            const actionCell = document.createElement('td');
            
            const selectBtn = document.createElement('button');
            selectBtn.className = 'select-button';
            selectBtn.textContent = '선택';
            selectBtn.addEventListener('click', function() {
                selectStudent(student);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-button';
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', function() {
                removeStudent(student.id);
            });
            
            actionCell.appendChild(selectBtn);
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(actionCell);
            
            studentTableBody.appendChild(row);
        }
    }

    function updateUnassignedStudentTable() {
        if (!unassignedStudentTableBody) return;
        
        unassignedStudentTableBody.innerHTML = '';
        
        for (const student of unassignedStudents) {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = student.id;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            
            const actionCell = document.createElement('td');
            
            const selectBtn = document.createElement('button');
            selectBtn.className = 'select-button';
            selectBtn.textContent = '선택';
            selectBtn.addEventListener('click', function() {
                selectStudent(student);
            });
            
            actionCell.appendChild(selectBtn);
            
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(actionCell);
            
            unassignedStudentTableBody.appendChild(row);
        }
    }

    function removeStudent(studentId) {
        // Remove from students array
        students = students.filter(student => student.id !== studentId);
        
        // Remove from unassigned students array
        unassignedStudents = unassignedStudents.filter(student => student.id !== studentId);
        
        // Clear selection if the selected student was removed
        if (selectedStudent && selectedStudent.id === studentId) {
            clearStudentSelection();
        }
        
        // Remove from seats if assigned
        for (const seat of seats) {
            if (seat.studentId === studentId) {
                seat.assigned = false;
                seat.studentId = '';
                seat.studentName = '';
                updateSeatDisplay(seat);
            }
        }
        
        // Update tables
        updateStudentTable();
        updateUnassignedStudentTable();
    }

    function clearStudents() {
        if (students.length === 0) return;
        
        if (confirm('모든 학생 정보를 삭제하시겠습니까?')) {
            // Clear arrays
            students = [];
            unassignedStudents = [];
            
            // Clear selection
            clearStudentSelection();
            
            // Clear seats
            for (const seat of seats) {
                if (seat.assigned) {
                    seat.assigned = false;
                    seat.studentId = '';
                    seat.studentName = '';
                    updateSeatDisplay(seat);
                }
            }
            
            // Update tables
            updateStudentTable();
            updateUnassignedStudentTable();
        }
    }

    function assignNextStudent() {
        if (unassignedStudents.length === 0) {
            alert('배치할 학생이 없습니다.');
            return;
        }
        
        // Get available seats (not assigned and not excluded)
        const availableSeats = seats.filter(seat => !seat.assigned && !seat.excluded);
        
        if (availableSeats.length === 0) {
            alert('배치할 수 있는 좌석이 없습니다.');
            return;
        }
        
        // Get the next student
        const student = unassignedStudents.shift();
        updateUnassignedStudentTable();
        
        // Randomly select an available seat
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const selectedSeat = availableSeats[randomIndex];
        
        // Assign the student to the seat
        selectedSeat.assigned = true;
        selectedSeat.studentId = student.id;
        selectedSeat.studentName = student.name;
        updateSeatDisplay(selectedSeat);
    }

    function assignAllStudents() {
        if (unassignedStudents.length === 0) {
            alert('배치할 학생이 없습니다.');
            return;
        }
        
        // Get available seats (not assigned and not excluded)
        const availableSeats = seats.filter(seat => !seat.assigned && !seat.excluded);
        
        if (availableSeats.length === 0) {
            alert('배치할 수 있는 좌석이 없습니다.');
            return;
        }
        
        if (availableSeats.length < unassignedStudents.length) {
            alert(`좌석이 부족합니다. ${availableSeats.length}명만 배치됩니다.`);
        }
        
        // Shuffle available seats
        const shuffledSeats = [...availableSeats].sort(() => Math.random() - 0.5);
        
        // Assign students to seats
        const assignCount = Math.min(unassignedStudents.length, shuffledSeats.length);
        for (let i = 0; i < assignCount; i++) {
            const seat = shuffledSeats[i];
            const student = unassignedStudents.shift();
            
            seat.assigned = true;
            seat.studentId = student.id;
            seat.studentName = student.name;
            updateSeatDisplay(seat);
        }
        
        updateUnassignedStudentTable();
    }

    function resetSeats() {
        if (confirm('모든 자리 배치를 초기화하시겠습니까?')) {
            // Move all assigned students back to unassigned list
            for (const seat of seats) {
                if (seat.assigned) {
                    const student = { id: seat.studentId, name: seat.studentName };
                    unassignedStudents.push(student);
                    
                    seat.assigned = false;
                    seat.studentId = '';
                    seat.studentName = '';
                    updateSeatDisplay(seat);
                }
            }
            
            // Update unassigned student table
            updateUnassignedStudentTable();
        }
    }

    function goToSeatingPage() {
        // Get the values from inputs
        numColumns = parseInt(numColumnsInput.value) || 5;
        numRows = parseInt(numRowsInput.value) || 7;
        
        // Validate values
        if (numColumns < 1 || numColumns > 10) {
            alert('열 수는 1에서 10 사이여야 합니다.');
            return;
        }
        
        if (numRows < 1 || numRows > 10) {
            alert('행 수는 1에서 10 사이여야 합니다.');
            return;
        }
        
        // Hide setup page and show seating page
        setupPage.style.display = 'none';
        seatingPage.style.display = 'block';
        
        // Initialize the seating chart with the new dimensions
        initializeSeatingChart();
        
        // Reset the unassigned students list
        unassignedStudents = [...students];
        updateUnassignedStudentTable();
        
        // Clear any selected student
        clearStudentSelection();
    }

    function backToSetupPage() {
        // Hide seating page and show setup page
        setupPage.style.display = 'block';
        seatingPage.style.display = 'none';
    }

    function setMode(mode) {
        currentMode = mode;
        
        // Update button styling
        if (mode === 'manual') {
            modeManualBtn.classList.add('active');
            modeExcludeBtn.classList.remove('active');
        } else if (mode === 'exclude') {
            modeManualBtn.classList.remove('active');
            modeExcludeBtn.classList.add('active');
        }
    }
});
