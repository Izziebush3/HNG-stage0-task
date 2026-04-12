const dueDate = new Date("2026-04-16T23:59:00Z");
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');
const titleElement = document.querySelector('[data-testid="test-todo-title"]');
const descriptionElement = document.querySelector('[data-testid="test-todo-description"]');
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const toggle = document.querySelector('[data-testid="test-todo-complete-checkbox"]');

function updateTimeRemaining() {
    const now = Date.now();
    const timeDiff = dueDate.getTime() - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));


    if (timeDiff < 1000 * 60) {
        timeRemainingElement.textContent = "Due now!";
    } else if (timeDiff < 24 * 60 * 60 * 1000) {
        timeRemainingElement.textContent = `Due in ${hours}h ${minutes}m`;
    } else if (timeDiff <= 7 * 24 * 60 * 60 * 1000) {
        timeRemainingElement.textContent = `Due in ${days}d ${hours}h ${minutes}m`;
    }
    else {
        timeRemainingElement.textContent = `Due in ${days} days`;
    }
}

updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);

toggle.addEventListener('change', function () {
    const done = this.checked;

    titleElement.classList.toggle('done', done);
    descriptionElement.classList.toggle('done', done);

    if (done) {
        titleElement.style.textDecoration = "line-through";
        statusBadge.textContent = "Completed";
        statusBadge.setAttribute('aria-label', 'Status: Completed');
    } else {
        titleElement.style.textDecoration = "none";
        statusBadge.textContent = "Pending";
        statusBadge.setAttribute('aria-label', 'Status: Pending');
    }
});