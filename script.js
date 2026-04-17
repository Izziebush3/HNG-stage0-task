const state = { title: "Build your HNG stage 0 task", description: "Make a clean, modern Todo / Task Card component, with exact data-testid elements and ensure it is screenreader accessible and mobile-friendly", priority: "High", dueDate: new Date("2026-04-17T23:59:00Z"), status: "In Progress", isDone: false };

const card = document.querySelector('[data-testid="test-todo-card"]');
const viewContent = document.querySelector('.view-content');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const titleElement = document.querySelector('[data-testid="test-todo-title"]');
const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
const priorityDot = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const statusBtns = document.querySelectorAll('.status-button');
const descPreview = document.querySelector('[data-testid="test-todo-description-preview"]');
const descFull = document.querySelector('[data-testid="test-todo-description"]');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const overdueText = document.getElementById('overdue-text');
const toggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');
const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');

function formatDueDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function toLocalDateTimeInputValue(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
}





let timerInterval = null;

function updateTimeRemaining() {
    if (state.isDone) {
        timeRemainingElement.textContent = "Completed";
        overdueIndicator.classList.remove('visible');
        return;
    }

    const now = Date.now();
    const timeDiff = state.dueDate.getTime() - now;

    const abs = Math.abs(timeDiff);

    const days = Math.floor(abs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(abs / (1000 * 60 * 60));
    const minutes = Math.floor(abs / (1000 * 60));

    const remHours = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remMinutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));

    let text = "";

    if (timeDiff < 0) {
        if (minutes < 60) text = `Overdue by ${minutes}m`;
        else if (hours < 24) text = `Overdue by ${hours}h ${remMinutes}m`;
        else text = `Overdue by ${days}d ${remHours}h`;

        overdueIndicator.classList.add('visible');
        overdueText.textContent = text;
    } else {
        overdueIndicator.classList.remove('visible');

        if (timeDiff < 60000) text = "Due now!";
        else if (timeDiff < 3600000) text = `Due in ${minutes}m`;
        else if (timeDiff < 86400000) text = `Due in ${hours}h ${remMinutes}m`;
        else if (days === 1) text = "Due tomorrow";
        else text = `Due in ${days} days`;
    }

    timeRemainingElement.textContent = text;
}



function startTimer() {
    clearInterval(timerInterval);
    updateTimeRemaining();
    timerInterval = setInterval(updateTimeRemaining, 30000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

expandToggle.addEventListener('click', () => {
    const isExpanded = expandToggle.getAttribute('aria-expanded') === 'true';

    expandToggle.setAttribute('aria-expanded', !isExpanded);
    collapsibleSection.setAttribute('aria-hidden', isExpanded);

    expandToggle.classList.toggle('expanded');

    collapsibleSection.classList.toggle('expanded');

    expandToggle.innerHTML = `
        <span class="expand-icon" aria-hidden="true">
            <i class="fa fa-chevron-${isExpanded ? 'down' : 'up'}"></i>
        </span>
        ${isExpanded ? 'Show more' : 'Show less'}
    `;
});


statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const newStatus = btn.dataset.status;
        state.status = newStatus;
        state.isDone = newStatus === 'Done';
        toggle.checked = state.isDone;
        renderStatus(newStatus);
        titleElement.classList.toggle('done', state.isDone);
        renderDescription();
        if (state.isDone) stopTimer();
        else startTimer();
        updateTimeRemaining();
    });
});

toggle.addEventListener('change', function () {
    const done = this.checked;
    state.isDone = done;
    state.status = done ? 'Done' : 'In Progress';
    titleElement.classList.toggle('done', done);
    renderStatus(state.status);
    renderDescription();
    if (done) stopTimer();
    else startTimer();
    updateTimeRemaining();
});

editButton.addEventListener('click', () => {
    editTitleInput.value = state.title;
    editDescriptionInput.value = state.description;
    editPrioritySelect.value = state.priority;
    editDueDateInput.value = toLocalDateTimeInputValue(state.dueDate);
    viewContent.classList.add('hidden');
    editForm.classList.add('active');
    editTitleInput.focus();
});

cancelButton.addEventListener('click', () => {
    viewContent.classList.remove('hidden');
    editForm.classList.remove('active');
    editButton.focus();
});



saveButton.addEventListener('click', () => {
    const newTitle = editTitleInput.value.trim();
    const newDesc = editDescriptionInput.value.trim();
    const newPri = editPrioritySelect.value;
    const newDue = new Date(editDueDateInput.value);

    if (!newTitle) {
        editTitleInput.focus();
        return;
    }
    state.title = newTitle;
    state.description = newDesc;
    state.priority = newPri;

    if (!isNaN(newDue)) {
        state.dueDate = newDue;
        dueDateElement.textContent = `Due ${formatDueDate(newDue)}`;
        dueDateElement.setAttribute('datetime', newDue.toISOString());
    }

    titleElement.textContent = newTitle;
    renderPriority(newPri);
    renderDescription();
    startTimer();

    viewContent.classList.remove('hidden');
    editForm.classList.remove('active');
    editButton.focus();
});


deleteButton.addEventListener('click', () => {
    if (confirm('Delete this task?')) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        setTimeout(() => card.remove(), 250);
    }
});

function renderPriority(priority) {
    priorityBadge.textContent = priority;
    priorityBadge.setAttribute('data-priority', priority);
    card.setAttribute('data-priority', priority);
}

function renderStatus(status) {
    statusBadge.textContent = status;
    statusBadge.setAttribute('data-status', status);
    statusBadge.setAttribute('aria-label', `Status: ${status}`);

    Array.from(statusBtns).forEach(btn => {
        btn.setAttribute('aria-pressed', btn.dataset.status === status);
    });
}

function renderDescription() {
    descFull.textContent = state.description;
    descPreview.textContent = state.description.slice(0, 80) + "...";
}

renderPriority(state.priority);
renderStatus(state.status);
renderDescription();
startTimer();