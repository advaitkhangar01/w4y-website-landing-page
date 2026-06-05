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
  initHRAndFinanceRoom();

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

  // 11. HR, Finance & Audit Control Room Controllers
  function initHRAndFinanceRoom() {
    // A. Chat Mention System
    const chatScroller = document.getElementById('chat-scroller');
    const inputChatMsg = document.getElementById('input-chat-msg');
    const btnSendChat = document.getElementById('btn-send-chat');

    if (btnSendChat && inputChatMsg) {
      function sendChatMessage() {
        const text = inputChatMsg.value.trim();
        if (!text) return;

        // Post chat bubble
        const bubble = document.createElement('div');
        bubble.innerHTML = `<span style="font-weight:700; color:#142334;">Admin:</span> <span style="color:#475569;">${text}</span>`;
        chatScroller.appendChild(bubble);
        chatScroller.scrollTop = chatScroller.scrollHeight;

        inputChatMsg.value = '';

        // Check for mentions (e.g., @Rahul or @Vikram)
        const match = text.match(/@(\w+)\s+(.+)/);
        if (match) {
          const user = match[1];
          const taskName = match[2];
          
          const project = projectsData.find(p => p.id === activeProjectId);
          const activeStage = project.stages.find(s => s.number === project.currentStage);
          
          const newDocId = 'doc_extracted_' + Date.now();
          activeStage.checklist.push({
            id: newDocId,
            name: taskName.charAt(0).toUpperCase() + taskName.slice(1),
            desc: `Assigned via chat mention to ${user}.`,
            status: 'pending',
            filename: null
          });

          // Re-render
          setTimeout(() => {
            renderProjectMilestones();
            updateOverviewStats();
            writeLogEntry(`@MENTION COMPILER: Extracted and assigned task "${taskName}" to ${user} on project "${project.name}".`, "success");
          }, 400);
        }
      }

      btnSendChat.addEventListener('click', sendChatMessage);
      inputChatMsg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
      });
    }

    // B. Leave Request Approvals
    const btnApproveLeave = document.getElementById('btn-approve-leave');
    const btnRejectLeave = document.getElementById('btn-reject-leave');
    const leaveReq1 = document.getElementById('leave-req-1');

    if (btnApproveLeave && btnRejectLeave && leaveReq1) {
      btnApproveLeave.addEventListener('click', () => {
        leaveReq1.innerHTML = `
          <div>
            <p style="font-size:11px; font-weight:700; color:#142334; margin:0;">Ashwini K. (Employee)</p>
            <p style="font-size:9px; color:#64748b; margin:2px 0 0 0;">Medical Leave • 2 Days</p>
          </div>
          <span style="font-size: 9px; font-weight: 800; color: #10B981; text-transform: uppercase; background: rgba(16,185,129,0.08); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(16,185,129,0.15);">Approved</span>
        `;
        // Increment unpaid leaves in the calculator
        const prSliderLeaves = document.getElementById('pr-slider-leaves');
        if (prSliderLeaves) {
          prSliderLeaves.value = parseInt(prSliderLeaves.value) + 2;
          recalculatePayroll();
        }
        writeLogEntry("HR LEAVE APPROVAL: Medical leave authorized for Ashwini K. (2 Days). Recalculating payroll...", "success");
      });

      btnRejectLeave.addEventListener('click', () => {
        leaveReq1.innerHTML = `
          <div>
            <p style="font-size:11px; font-weight:700; color:#142334; margin:0;">Ashwini K. (Employee)</p>
            <p style="font-size:9px; color:#64748b; margin:2px 0 0 0;">Medical Leave • 2 Days</p>
          </div>
          <span style="font-size: 9px; font-weight: 800; color: #ef4444; text-transform: uppercase; background: rgba(239,68,68,0.08); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.15);">Rejected</span>
        `;
        writeLogEntry("HR LEAVE DEFIANCE: Medical leave rejected for Ashwini K.", "warning");
      });
    }

    // C. Payroll Calculator
    const prSliderLates = document.getElementById('pr-slider-lates');
    const prSliderLeaves = document.getElementById('pr-slider-leaves');
    const prInputBonus = document.getElementById('pr-input-bonus');

    const prLabelLates = document.getElementById('pr-label-lates');
    const prLabelLeaves = document.getElementById('pr-label-leaves');
    const prOutDeductions = document.getElementById('pr-out-deductions');
    const prOutNet = document.getElementById('pr-out-net');
    
    const btnProcessPayroll = document.getElementById('btn-process-payroll');
    const preflightPayrollStatus = document.getElementById('preflight-payroll-status');
    const preflightPayrollIcon = document.getElementById('preflight-payroll-icon');

    let payrollPaid = false;

    function recalculatePayroll() {
      if (payrollPaid || !prSliderLates || !prSliderLeaves || !prInputBonus) return;

      const lates = parseInt(prSliderLates.value);
      const leaves = parseInt(prSliderLeaves.value);
      const bonus = parseInt(prInputBonus.value) || 0;

      prLabelLates.textContent = `${lates} day${lates !== 1 ? 's' : ''}`;
      prLabelLeaves.textContent = `${leaves} day${leaves !== 1 ? 's' : ''}`;

      const lateDeduction = lates * 500;
      const leaveDeduction = leaves * 1666;
      const totalDeductions = lateDeduction + leaveDeduction;
      const netPayout = Math.max(0, 50000 - totalDeductions + bonus);

      prOutDeductions.textContent = `-₹${totalDeductions.toLocaleString('en-IN')}`;
      prOutNet.textContent = `₹${netPayout.toLocaleString('en-IN')}`;

      return netPayout;
    }

    if (prSliderLates && prSliderLeaves && prInputBonus) {
      [prSliderLates, prSliderLeaves].forEach(slider => {
        slider.addEventListener('input', recalculatePayroll);
      });
      prInputBonus.addEventListener('input', recalculatePayroll);
    }

    if (btnProcessPayroll) {
      btnProcessPayroll.addEventListener('click', () => {
        const finalNet = recalculatePayroll();
        payrollPaid = true;

        btnProcessPayroll.disabled = true;
        btnProcessPayroll.textContent = "Payroll Processed (PAID)";
        btnProcessPayroll.style.background = "#cbd5e1";
        btnProcessPayroll.style.color = "#475569";
        btnProcessPayroll.style.cursor = "not-allowed";

        if (prSliderLates) prSliderLates.disabled = true;
        if (prSliderLeaves) prSliderLeaves.disabled = true;
        if (prInputBonus) prInputBonus.disabled = true;

        // Update preflight checks
        if (preflightPayrollStatus && preflightPayrollIcon) {
          preflightPayrollStatus.textContent = "0 Pending";
          preflightPayrollStatus.style.color = "#10B981";
          preflightPayrollIcon.innerHTML = `<i data-lucide="check" style="width:14px; height:14px; color:#10B981;"></i> Staff Payroll Processing Status`;
          if (window.lucide) window.lucide.createIcons();
        }

        writeLogEntry(`PAYROLL PROCESSOR: Disbursed ₹${finalNet.toLocaleString('en-IN')} net salary to Rahul N. for operational logs compliance. Status: PAID.`, "success");
      });
    }

    // D. 15-Day Audit Shield Lock & Month-End Close
    const toggleAuditShield = document.getElementById('toggle-audit-shield');
    const inputCloseReason = document.getElementById('input-close-reason');
    const btnCloseMonth = document.getElementById('btn-close-month');

    if (toggleAuditShield) {
      toggleAuditShield.addEventListener('change', () => {
        // Toggle locked classes on top panels (attendance table and milestone stepper)
        const attendancePanel = document.querySelector('.db-grid-container .db-panel:nth-child(1)');
        const stepperPanel = document.querySelector('.db-grid-container .db-panel:nth-child(2)');

        if (toggleAuditShield.checked) {
          if (attendancePanel) attendancePanel.classList.add('audit-locked');
          if (stepperPanel) stepperPanel.classList.add('audit-locked');
          writeLogEntry("AUDIT SHIELD SECURED: Activated 15-day strict compliance logs lockout. Historical modifications disabled.", "warning");
        } else {
          if (attendancePanel) attendancePanel.classList.remove('audit-locked');
          if (stepperPanel) stepperPanel.classList.remove('audit-locked');
          writeLogEntry("AUDIT SHIELD UNSECURED: Historical modifications enabled by Administrator credentials.", "system");
        }
      });
    }

    if (btnCloseMonth && inputCloseReason) {
      btnCloseMonth.addEventListener('click', () => {
        // Check preflight payroll
        if (!payrollPaid) {
          const reason = inputCloseReason.value.trim();
          if (!reason) {
            alert("🔒 Closure Blocked!\nA mandatory authorization key/override reason is required to execute monthly closure with pending staff payroll.");
            writeLogEntry("MONTHLY CLOSURE ABORTED: Pending payroll requires authorization overrides.", "warning");
            return;
          }
        }

        // Lock ALL panels on dashboard!
        const panels = document.querySelectorAll('.db-panel');
        panels.forEach(p => {
          p.classList.add('audit-locked');
        });
        
        btnCloseMonth.disabled = true;
        btnCloseMonth.textContent = "JUNE PERIOD AUDITED & SECURED";
        btnCloseMonth.style.background = "#0c1221";
        btnCloseMonth.style.color = "#a1a1aa";
        
        if (toggleAuditShield) toggleAuditShield.disabled = true;
        inputCloseReason.disabled = true;

        writeLogEntry("MONTHLY CLOSURE SUCCESSFUL: Locked ledger periods for June 2026. Generated compliance snapshots.", "success");
        alert("🔒 Month closed successfully!\nAll June operations have been audited, snapshotted, and frozen in read-only compliance lock.");
      });
    }
  }

});
