// ==========================================
// W4Y — Official Utility Dashboard Controller
// Optimized Pure Utility Performance Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Clock Display (IST Normalization Sync)
  initSystemClock();

  // 2. Data Registries
  let attendanceRoster = [
    { id: 'emp1', name: 'Vikram Kulkarni', role: 'Principal Director', target: 'HQ (Mumbai)', coords: '18.92205°N, 72.83410°E', distance: 14, status: 'present' },
    { id: 'emp2', name: 'Shreya Mehta', role: 'Senior Designer', target: 'Terra Site (Bandra)', coords: '19.06012°N, 72.83610°E', distance: 48, status: 'present' },
    { id: 'emp3', name: 'Amit Patel', role: 'Site Engineer', target: 'Gateway Site (Colaba)', coords: '18.92310°N, 72.83540°E', distance: 145, status: 'warning' },
    { id: 'emp4', name: 'Priya Nair', role: 'Junior Architect', target: 'HQ (Mumbai)', coords: '18.92420°N, 72.83680°E', distance: 230, status: 'blocked' },
    { id: 'emp5', name: 'Rahul Bose', role: 'Draftsman', target: 'HQ (Mumbai)', coords: '--', distance: '--', status: 'absent' }
  ];

  let projectsData = [
    {
      id: 'proj1',
      name: 'Gateway Tower (Colaba)',
      currentStage: 1,
      stages: [
        {
          number: 1,
          name: 'Planning & Permitting',
          checklist: [
            { id: 'doc1_1', name: 'CAD Site Drawing PDF', desc: 'Pre-layout blueprint with dimensions.', status: 'completed', filename: 'Gateway_Layout_V2.dwg.pdf' },
            { id: 'doc1_2', name: 'MCGM Planning Permit', desc: 'Official structural building permit.', status: 'pending', filename: null }
          ]
        },
        {
          number: 2,
          name: 'Core Excavation',
          checklist: [
            { id: 'doc2_1', name: 'Soil Quality Audit Report', desc: 'Lab analysis of foundational soil strength.', status: 'pending', filename: null },
            { id: 'doc2_2', name: 'Seismic Foundation Drawing', desc: 'Engineering drawings for base pillars.', status: 'pending', filename: null }
          ]
        },
        {
          number: 3,
          name: 'Finishing & Handover',
          checklist: [
            { id: 'doc3_1', name: 'Fire Safety Clearance NOC', desc: 'Municipal NOC for fire safety protocols.', status: 'pending', filename: null },
            { id: 'doc3_2', name: 'Client Handover Form', desc: 'Digital completion sign-off document.', status: 'pending', filename: null }
          ]
        }
      ]
    },
    {
      id: 'proj2',
      name: 'Terra Residence (Bandra)',
      currentStage: 2,
      stages: [
        {
          number: 1,
          name: 'Planning & Permitting',
          checklist: [
            { id: 'doc1_1', name: 'CAD Site Drawing PDF', desc: 'Pre-layout blueprint with dimensions.', status: 'completed', filename: 'Terra_MasterLayout_V4.pdf' },
            { id: 'doc1_2', name: 'MCGM Planning Permit', desc: 'Official structural building permit.', status: 'completed', filename: 'MCGM-BND-924-APPROVED.pdf' }
          ]
        },
        {
          number: 2,
          name: 'Core Excavation',
          checklist: [
            { id: 'doc2_1', name: 'Soil Quality Audit Report', desc: 'Lab analysis of foundational soil strength.', status: 'completed', filename: 'Terra_Geotech_Audit.pdf' },
            { id: 'doc2_2', name: 'Seismic Foundation Drawing', desc: 'Engineering drawings for base pillars.', status: 'pending', filename: null }
          ]
        },
        {
          number: 3,
          name: 'Finishing & Handover',
          checklist: [
            { id: 'doc3_1', name: 'Fire Safety Clearance NOC', desc: 'Municipal NOC for fire safety protocols.', status: 'pending', filename: null },
            { id: 'doc3_2', name: 'Client Handover Form', desc: 'Digital completion sign-off document.', status: 'pending', filename: null }
          ]
        }
      ]
    },
    {
      id: 'proj3',
      name: 'Oasis Villa (Alibaug)',
      currentStage: 3,
      stages: [
        {
          number: 1,
          name: 'Planning & Permitting',
          checklist: [
            { id: 'doc1_1', name: 'CAD Site Drawing PDF', desc: 'Pre-layout blueprint with dimensions.', status: 'completed', filename: 'Oasis_Alibaug_CAD_R3.pdf' },
            { id: 'doc1_2', name: 'MCGM Planning Permit', desc: 'Official structural building permit.', status: 'completed', filename: 'CZR_Alibaug_Permit.pdf' }
          ]
        },
        {
          number: 2,
          name: 'Core Excavation',
          checklist: [
            { id: 'doc2_1', name: 'Soil Quality Audit Report', desc: 'Lab analysis of foundational soil strength.', status: 'completed', filename: 'Soil_TerraTest_R2.pdf' },
            { id: 'doc2_2', name: 'Seismic Foundation Drawing', desc: 'Engineering drawings for base pillars.', status: 'completed', filename: 'Oasis_Foundation_Str.pdf' }
          ]
        },
        {
          number: 3,
          name: 'Finishing & Handover',
          checklist: [
            { id: 'doc3_1', name: 'Fire Safety Clearance NOC', desc: 'Municipal NOC for fire safety protocols.', status: 'completed', filename: 'NOC_Fire_A1.pdf' },
            { id: 'doc3_2', name: 'Client Handover Form', desc: 'Digital completion sign-off document.', status: 'pending', filename: null }
          ]
        }
      ]
    }
  ];

  let activeProjectId = 'proj1';

  // 3. UI Element Selectors
  const attTableBody = document.getElementById('attendance-table-body');
  const btnRefreshAtt = document.getElementById('btn-refresh-attendance');
  const journalLogConsole = document.getElementById('compliance-log-console');
  const btnClearLogs = document.getElementById('btn-clear-logs');
  
  const projectSelect = document.getElementById('project-select');
  const stepperContainer = document.getElementById('project-stepper');
  const checklistContainer = document.getElementById('checklist-items-container');
  const activeStageTitle = document.getElementById('active-stage-title');
  const checklistProgressBadge = document.getElementById('checklist-progress-badge');
  const btnAdvanceStage = document.getElementById('btn-advance-stage');
  const progressionLockMessage = document.getElementById('progression-lock-message');

  const countCheckedIn = document.getElementById('count-checked-in');
  const countWarnings = document.getElementById('count-warnings');
  const countLocks = document.getElementById('count-locks');

  // 4. Initial Core Execution loops
  writeLogEntry("Compliance sensor calibrated. Location-based geofence anchors verified at 18.92°N, 72.83°E.", "system");
  renderAttendanceGrid();
  renderProjectDropdown();
  renderProjectMilestones();
  updateOverviewStats();

  // 5. System Clock (IST Synchronizer)
  function initSystemClock() {
    const clockEl = document.getElementById('system-time-display');
    if (!clockEl) return;
    
    function updateClock() {
      const now = new Date();
      // Force display to IST (Indian Standard Time)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = now.toLocaleTimeString('en-US', options);
      clockEl.textContent = `IST ${timeStr}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 6. Monospace Log Compliance Logger
  function writeLogEntry(text, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-line log-${type}`;
    
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const timeStr = now.toLocaleTimeString('en-US', options);
    
    entry.innerHTML = `<span class="log-time">[${timeStr} IST]</span> ${text}`;
    
    journalLogConsole.appendChild(entry);
    journalLogConsole.scrollTop = journalLogConsole.scrollHeight;
  }

  // Clear Logs
  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      journalLogConsole.innerHTML = '';
      writeLogEntry("Journal logs cleared by Administrator.", "system");
    });
  }

  // Refresh Grid
  if (btnRefreshAtt) {
    btnRefreshAtt.addEventListener('click', () => {
      const icon = btnRefreshAtt.querySelector('svg');
      if (icon) icon.classList.add('icon-spin');
      
      setTimeout(() => {
        if (icon) icon.classList.remove('icon-spin');
        renderAttendanceGrid();
        writeLogEntry("Geofenced Attendance grid sweeps completed. Coordinates normalized.", "system");
      }, 500);
    });
  }

  // 7. Attendance Log Rendering & Actions
  function renderAttendanceGrid() {
    attTableBody.innerHTML = '';
    
    attendanceRoster.forEach(emp => {
      const row = document.createElement('tr');
      
      // Name & Role cell
      const nameCell = `
        <td class="emp-name-cell">
          ${emp.name}
          <div class="emp-details-sub">${emp.role}</div>
        </td>
      `;
      
      // Target Site cell
      const targetCell = `<td>${emp.target}</td>`;
      
      // Coordinates cell
      const coordsCell = `<td class="coord-cell">${emp.coords}</td>`;
      
      // Distance Deviation cell
      let distText = '';
      if (typeof emp.distance === 'number') {
        distText = `${emp.distance}m deviation`;
      } else {
        distText = emp.distance;
      }
      const distanceCell = `<td>${distText}</td>`;
      
      // Status Badge cell
      let statusClass = emp.status;
      let statusLabel = emp.status.toUpperCase();
      if (emp.status === 'approved') statusLabel = 'APPROVED';
      if (emp.status === 'on-leave') {
        statusClass = 'absent';
        statusLabel = 'APPROVED LEAVE';
      }
      
      const badgeCell = `
        <td>
          <span class="status-badge ${statusClass}">
            ${statusLabel}
          </span>
        </td>
      `;
      
      // Admin Override buttons cell
      let actionCell = `<td style="text-align: right; font-size:11px; color:var(--db-text-muted);">No Action Required</td>`;
      
      if (emp.status === 'warning') {
        actionCell = `
          <td style="text-align: right;">
            <button class="db-btn db-btn-primary db-btn-xs" data-override-id="${emp.id}" data-type="warning">
              <i data-lucide="check"></i> Approve Bypass
            </button>
          </td>
        `;
      } else if (emp.status === 'blocked') {
        actionCell = `
          <td style="text-align: right;">
            <button class="db-btn db-btn-primary db-btn-xs" data-override-id="${emp.id}" data-type="blocked" style="background-color: var(--db-danger-dark);">
              <i data-lucide="shield-check"></i> Authorize Override
            </button>
          </td>
        `;
      } else if (emp.status === 'absent') {
        actionCell = `
          <td style="text-align: right;">
            <button class="db-btn db-btn-secondary db-btn-xs" data-override-id="${emp.id}" data-type="leave">
              <i data-lucide="users"></i> Mark as Leave
            </button>
          </td>
        `;
      } else if (emp.status === 'approved' || emp.status === 'on-leave') {
        actionCell = `<td style="text-align: right; font-weight:700; color:var(--db-sage-dark);">Compliance Clear</td>`;
      }
      
      row.innerHTML = nameCell + targetCell + coordsCell + distanceCell + badgeCell + actionCell;
      attTableBody.appendChild(row);
    });

    // Re-create icons inside table
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach button action handlers
    attachAttendanceActionHandlers();
  }

  function attachAttendanceActionHandlers() {
    const buttons = attTableBody.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const empId = btn.dataset.overrideId;
        const overrideType = btn.dataset.type;
        const employee = attendanceRoster.find(emp => emp.id === empId);
        
        if (!employee) return;

        if (overrideType === 'warning') {
          employee.status = 'approved';
          writeLogEntry(`GEOFENCE WARNING BYPASS: Location authorized for ${employee.name}. Allowed deviation: ${employee.distance}m.`, "success");
        } else if (overrideType === 'blocked') {
          employee.status = 'approved';
          writeLogEntry(`ACCESS BLOCK OVERRIDE: Administrative geofence lockout bypass authorized for ${employee.name} at coordinates [${employee.coords}].`, "warning");
        } else if (overrideType === 'leave') {
          employee.status = 'on-leave';
          writeLogEntry(`ABSENCE COMPLIANCE: Casual leave allocation approved for ${employee.name} (timesheet normalized).`, "success");
        }

        renderAttendanceGrid();
        updateOverviewStats();
      });
    });
  }

  // 8. Project Dropdown Handler
  function renderProjectDropdown() {
    projectSelect.innerHTML = '';
    projectsData.forEach(proj => {
      const opt = document.createElement('option');
      opt.value = proj.id;
      opt.textContent = proj.name;
      opt.selected = (proj.id === activeProjectId);
      projectSelect.appendChild(opt);
    });

    projectSelect.addEventListener('change', (e) => {
      activeProjectId = e.target.value;
      renderProjectMilestones();
      writeLogEntry(`Switched workspace context to project: "${projectsData.find(p => p.id === activeProjectId).name}".`, "system");
    });
  }

  // 9. Project Milestone Stepper CRM
  function renderProjectMilestones() {
    const project = projectsData.find(p => p.id === activeProjectId);
    if (!project) return;

    // A. Render horizontal Stepper Pipeline
    stepperContainer.innerHTML = '';
    
    // Width fill line calculation
    const progressPct = ((project.currentStage - 1) / (project.stages.length - 1)) * 100;
    const progressFill = document.createElement('div');
    progressFill.className = 'stepper-progress-fill';
    progressFill.style.width = `calc(${progressPct}% - 72px)`;
    stepperContainer.appendChild(progressFill);

    project.stages.forEach(stage => {
      const stepNode = document.createElement('div');
      
      let nodeStateClass = 'locked';
      if (stage.number === project.currentStage) {
        nodeStateClass = 'active';
      } else if (stage.number < project.currentStage) {
        nodeStateClass = 'complete';
      }
      
      stepNode.className = `step-node ${nodeStateClass}`;
      
      let circleContent = stage.number;
      if (stage.number < project.currentStage) {
        circleContent = `<i data-lucide="check"></i>`;
      }
      
      stepNode.innerHTML = `
        <div class="step-circle">${circleContent}</div>
        <div class="step-label">Stage ${stage.number}</div>
      `;
      
      stepperContainer.appendChild(stepNode);
    });

    // B. Render active Stage details
    const activeStage = project.stages.find(s => s.number === project.currentStage);
    activeStageTitle.textContent = `Stage ${project.currentStage}: ${activeStage.name}`;
    
    // C. Render checklist for current stage
    checklistContainer.innerHTML = '';
    let completedCount = 0;

    activeStage.checklist.forEach(item => {
      const checkRow = document.createElement('div');
      checkRow.className = 'checklist-item';
      
      const itemLeft = `
        <div class="item-left">
          <div class="item-doc-icon"><i data-lucide="file-text"></i></div>
          <div class="item-meta">
            <span class="item-name">${item.name}</span>
            <span class="item-desc">${item.desc}</span>
          </div>
        </div>
      `;
      
      let itemRight = '';
      if (item.status === 'completed') {
        completedCount++;
        itemRight = `
          <div class="item-right">
            <span class="item-details-sub" style="font-family:var(--db-font-mono); margin-right:8px;" title="Uploaded File">${item.filename}</span>
            <span class="item-complete-badge"><i data-lucide="check"></i> Signed Off</span>
          </div>
        `;
      } else {
        itemRight = `
          <div class="item-right">
            <span class="status-badge warning" style="margin-right:12px;">Missing</span>
            <div class="simulated-upload-wrapper">
              <button class="simulated-upload-btn"><i data-lucide="upload"></i> Upload File</button>
              <input type="file" class="simulated-upload-input" data-doc-id="${item.id}" accept=".pdf,.dwg,.xlsx,.png">
            </div>
          </div>
        `;
      }
      
      checkRow.innerHTML = itemLeft + itemRight;
      checklistContainer.appendChild(checkRow);
    });

    checklistProgressBadge.textContent = `${completedCount} / ${activeStage.checklist.length} Complete`;

    // Check compliance safeguards
    const allDone = (completedCount === activeStage.checklist.length);
    
    if (allDone) {
      btnAdvanceStage.disabled = false;
      progressionLockMessage.className = 'lock-indicator unlocked';
      progressionLockMessage.innerHTML = `<i data-lucide="check" style="color:var(--db-sage-dark);"></i> Stage compliance requirements met. Ready to advance.`;
    } else {
      btnAdvanceStage.disabled = true;
      progressionLockMessage.className = 'lock-indicator';
      progressionLockMessage.innerHTML = `<i data-lucide="lock"></i> Complete all required document uploads to unlock subsequent stages.`;
    }

    // Re-create icons inside stepper and checklist
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Bind simulated upload events
    attachDocumentUploadHandlers();
    attachStageAdvanceHandler();
  }

  function attachDocumentUploadHandlers() {
    const uploadInputs = checklistContainer.querySelectorAll('.simulated-upload-input');
    uploadInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const docId = input.dataset.docId;
        const project = projectsData.find(p => p.id === activeProjectId);
        const activeStage = project.stages.find(s => s.number === project.currentStage);
        const checklistItem = activeStage.checklist.find(item => item.id === docId);

        if (!checklistItem) return;

        // Change button to spinner/loading
        const uploadWrapper = input.parentElement;
        const uploadBtn = uploadWrapper.querySelector('.simulated-upload-btn');
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = `<i data-lucide="refresh-cw" class="icon-spin"></i> Uploading...`;
        if (window.lucide) window.lucide.createIcons();

        // Simulate network upload latency of 600ms
        setTimeout(() => {
          checklistItem.status = 'completed';
          checklistItem.filename = file.name;
          
          writeLogEntry(`COMPLIANCE FILE UPLOAD: Mapped "${file.name}" to checkpoint [${checklistItem.name}] on ${project.name}.`, "success");
          
          renderProjectMilestones();
          updateOverviewStats();
        }, 600);

      });
    });
  }

  function attachStageAdvanceHandler() {
    btnAdvanceStage.onclick = () => {
      const project = projectsData.find(p => p.id === activeProjectId);
      if (!project || project.currentStage >= project.stages.length) return;

      const oldStageNum = project.currentStage;
      project.currentStage++;
      
      writeLogEntry(`MILESTONE CRM PROGRESSION: ${project.name} successfully advanced from Stage ${oldStageNum} to Stage ${project.currentStage} following compliance authorization clearance.`, "success");
      
      renderProjectMilestones();
      updateOverviewStats();
    };
  }

  // 10. Header Counter Updating loops
  function updateOverviewStats() {
    // A. Staff Checked In
    const checkedInCount = attendanceRoster.filter(e => e.status === 'present' || e.status === 'approved').length;
    countCheckedIn.textContent = `${checkedInCount} / ${attendanceRoster.length}`;

    // B. Access Warnings
    const warningCount = attendanceRoster.filter(e => e.status === 'warning' || e.status === 'blocked').length;
    countWarnings.textContent = warningCount;

    const warnCard = document.getElementById('metric-warnings-card');
    if (warningCount > 0) {
      warnCard.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      warnCard.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.05)';
    } else {
      warnCard.style.borderColor = 'var(--db-border)';
      warnCard.style.boxShadow = 'none';
    }

    // C. Milestone Locks
    let lockedProjects = 0;
    projectsData.forEach(p => {
      // Find active stage
      const activeStage = p.stages.find(s => s.number === p.currentStage);
      // See if there's any pending document
      const hasPending = activeStage.checklist.some(item => item.status === 'pending');
      if (hasPending) lockedProjects++;
    });
    
    countLocks.textContent = lockedProjects;

    const locksCard = document.getElementById('metric-roadblocks-card');
    if (lockedProjects > 0) {
      locksCard.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    } else {
      locksCard.style.borderColor = 'var(--db-border)';
    }
  }

});
