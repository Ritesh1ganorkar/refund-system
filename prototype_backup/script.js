/**
 * ReturnEasy App Logic
 * Refactored using an ES6 Class structure for better organization, scoping, and bug prevention.
 */
class RefundApp {
    constructor() {
        // App State
        this.returns = JSON.parse(localStorage.getItem('returnsList')) || [];
        this.currentViewId = null; // Tracks which return is currently in the tracker
        this.theme = localStorage.getItem('theme') || 'light';
        
        // Stage config for UI Mapping
        this.STAGE_MAP = { 'requested': 0, 'approved': 1, 'picked': 2, 'refunded': 3 };
        
        // Timer references to prevent memory leaks or overlapping simulations
        this.activeTimers = {};

        // DOM Elements setup
        this.initDOM();
        
        // Initialize App
        this.init();
    }

    initDOM() {
        // Form & Inputs
        this.form = document.getElementById('returnForm');
        this.orderIdInput = document.getElementById('orderId');
        this.productNameInput = document.getElementById('productName');
        this.reasonInput = document.getElementById('reason');
        this.imageUpload = document.getElementById('imageUpload');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('previewImg');
        this.removeImgBtn = document.getElementById('removeImgBtn');
        this.submitBtn = document.getElementById('submitBtn');

        // Layout Elements
        this.themeToggle = document.getElementById('themeToggle');
        this.trackerCard = document.getElementById('trackerCard');
        this.historyList = document.getElementById('historyList');
        this.statusFilter = document.getElementById('statusFilter');
        this.toastContainer = document.getElementById('toastContainer');
    }

    init() {
        this.applyTheme();
        this.addEventListeners();
        
        // Initial render
        this.renderHistory();
        
        // Show most recent return in tracker if any exist
        if (this.returns.length > 0) {
            this.updateTrackerUI(this.returns[0]);
        }
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            this.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.body.removeAttribute('data-theme');
            this.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    addEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        this.statusFilter.addEventListener('change', () => this.renderHistory());

        // Custom validation clearing on input
        [this.orderIdInput, this.productNameInput, this.reasonInput].forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.parentElement.classList.remove('has-error');
            });
        });

        // Image handling
        this.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeImgBtn.addEventListener('click', () => this.clearImage());
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.previewImg.src = event.target.result;
                this.imagePreview.style.display = 'block';
                document.getElementById('fileDropArea').style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    }

    clearImage() {
        this.imageUpload.value = '';
        this.previewImg.src = '';
        this.imagePreview.style.display = 'none';
        document.getElementById('fileDropArea').style.display = 'block';
    }

    validateForm() {
        let isValid = true;
        
        // Extract values
        const idVal = this.orderIdInput.value.trim();
        const prodVal = this.productNameInput.value.trim();
        const reasonVal = this.reasonInput.value;

        // Reset errors
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));

        // Regex Validation for Order ID
        if (!/^ORD-\d{5}$/.test(idVal)) {
            this.orderIdInput.parentElement.parentElement.classList.add('has-error');
            isValid = false;
        }

        if (prodVal === '') {
            this.productNameInput.parentElement.parentElement.classList.add('has-error');
            isValid = false;
        }

        if (!reasonVal) {
            this.reasonInput.parentElement.parentElement.classList.add('has-error');
            isValid = false;
        }

        return { isValid, data: { orderId: idVal, productName: prodVal, reason: reasonVal } };
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const { isValid, data } = this.validateForm();
        if (!isValid) {
            this.showToast('Please fix the errors in the form.', 'error');
            return;
        }

        // Set Loading state
        this.submitBtn.classList.add('btn-loading');

        // Simulate network latency
        setTimeout(() => {
            this.processNewReturn(data);
        }, 800);
    }

    processNewReturn(data) {
        // Create Record
        const newReturn = {
            id: 'RET-' + Math.floor(10000 + Math.random() * 90000), // Random 5 digit ID
            orderId: data.orderId,
            productName: data.productName,
            reason: data.reason,
            date: new Date().toISOString(),
            status: 'requested',
            estimatedRefund: this.getFutureDate(5)
        };

        // Update State
        this.returns.unshift(newReturn);
        this.saveData();

        // Reset UI
        this.form.reset();
        this.clearImage();
        this.submitBtn.classList.remove('btn-loading');
        this.showToast(`Request ${newReturn.id} submitted!`, 'success');

        // Update View
        this.renderHistory();
        this.updateTrackerUI(newReturn);

        // Smart Feature: Begin backend mock simulation
        this.simulateTimeline(newReturn.id);
    }

    updateTrackerUI(returnRecord) {
        this.currentViewId = returnRecord.id;

        // Html template for the tracker
        const trackerHTML = `
            <div class="tracker-header">
                <div class="tracker-header-info">
                    <h3>${returnRecord.productName}</h3>
                    <p>Expected Refund: <strong>${new Date(returnRecord.estimatedRefund).toLocaleDateString()}</strong></p>
                </div>
                <span class="badge">${returnRecord.orderId}</span>
            </div>
            
            <div class="stepper-container">
                <div class="stepper">
                    <div class="step-line">
                        <div class="step-line-fill" id="progressFill"></div>
                    </div>
                    
                    <div class="step" id="step-requested">
                        <div class="step-icon"><i class="fa-solid fa-file-signature"></i></div>
                        <div class="step-label">Requested</div>
                    </div>
                    <div class="step" id="step-approved">
                        <div class="step-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                        <div class="step-label">Approved</div>
                    </div>
                    <div class="step" id="step-picked">
                        <div class="step-icon"><i class="fa-solid fa-truck-fast"></i></div>
                        <div class="step-label">Picked Up</div>
                    </div>
                    <div class="step" id="step-refunded">
                        <div class="step-icon"><i class="fa-solid fa-sack-dollar"></i></div>
                        <div class="step-label">Refunded</div>
                    </div>
                </div>
            </div>
        `;
        
        this.trackerCard.innerHTML = trackerHTML;

        // Sync visual steps
        const steps = ['requested', 'approved', 'picked', 'refunded'];
        const currentStageIdx = this.STAGE_MAP[returnRecord.status];
        const progressFill = document.getElementById('progressFill');

        // Set bar width based on completed segments (each segment is ~33%)
        const fillPercentage = (currentStageIdx / (steps.length - 1)) * 100;
        // Adjust for padding so it aligns precisely with icons
        progressFill.style.width = `calc(${fillPercentage}% - ${fillPercentage === 100 ? 0 : 0}px)`;

        steps.forEach((step, idx) => {
            const stepEl = document.getElementById(`step-${step}`);
            if (idx < currentStageIdx) {
                stepEl.classList.add('completed');
            } else if (idx === currentStageIdx) {
                stepEl.classList.add('active');
            }
        });

        // Visually highlight the active item in the history list
        document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active-item'));
        const activeHistoryElement = document.getElementById(`hist-${returnRecord.id}`);
        if(activeHistoryElement) activeHistoryElement.classList.add('active-item');
    }

    renderHistory() {
        const filterVal = this.statusFilter.value;
        this.historyList.innerHTML = '';

        const visibleReturns = this.returns.filter(ret => {
            if(filterVal === 'all') return true;
            if(filterVal === 'refunded') return ret.status === 'refunded';
            return ret.status !== 'refunded';
        });

        if(visibleReturns.length === 0) {
            this.historyList.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 2rem;">No visible records.</p>';
            return;
        }

        visibleReturns.forEach(ret => {
            const isCompleted = ret.status === 'refunded';
            const badgeClass = isCompleted ? 'refunded' : 'pending';
            const statusText = isCompleted ? 'Refunded' : 'Processing';

            const item = document.createElement('div');
            item.className = `history-item ${this.currentViewId === ret.id ? 'active-item' : ''}`;
            item.id = `hist-${ret.id}`;
            
            item.innerHTML = `
                <div class="history-info">
                    <h4>${ret.productName}</h4>
                    <p>${ret.id} • ${new Date(ret.date).toLocaleDateString()}</p>
                </div>
                <div class="status-badge ${badgeClass}">${statusText}</div>
            `;

            item.addEventListener('click', () => this.updateTrackerUI(ret));
            this.historyList.appendChild(item);
        });
    }

    // --- Core Logic & Helpers --- //

    saveData() {
        localStorage.setItem('returnsList', JSON.stringify(this.returns));
    }

    getFutureDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        this.toastContainer.appendChild(toast);

        // Remove cleanly
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }

    // Smart Simulated Backend functionality (For prototyping demo)
    simulateTimeline(returnId) {
        // Clear existing timers for this ID if they somehow run twice
        if(this.activeTimers[returnId]) {
            this.activeTimers[returnId].forEach(clearTimeout);
        }
        this.activeTimers[returnId] = [];

        const scheduleUpdate = (newStatus, delay) => {
            const timerId = setTimeout(() => {
                const targetReturn = this.returns.find(r => r.id === returnId);
                if (targetReturn && targetReturn.status !== 'refunded') {
                    
                    targetReturn.status = newStatus;
                    this.saveData();
                    this.renderHistory();

                    // Only animate tracker if the user is currently looking at this item
                    if (this.currentViewId === returnId) {
                        this.updateTrackerUI(targetReturn);
                    }

                    if (newStatus === 'refunded') {
                        this.showToast(`Refund processed for ${targetReturn.orderId}!`, 'success');
                    }
                }
            }, delay);
            this.activeTimers[returnId].push(timerId);
        };

        // Advance gracefully for demo purposes
        scheduleUpdate('approved', 5000);
        scheduleUpdate('picked', 9000);
        scheduleUpdate('refunded', 14000);
    }
}

// Boot the app
document.addEventListener('DOMContentLoaded', () => {
    window.App = new RefundApp();
});
