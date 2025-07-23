// UI Components for SIWES Electronic Workbook

// Card component
function createCard({ title, description, content, footer, className = '' }) {
    return `
        <div class="card ${className}">
            ${title || description ? `
                <div class="card-header">
                    ${title ? `<h3 class="card-title">${utils.escapeHtml(title)}</h3>` : ''}
                    ${description ? `<p class="card-description">${utils.escapeHtml(description)}</p>` : ''}
                </div>
            ` : ''}
            ${content ? `<div class="card-content">${content}</div>` : ''}
            ${footer ? `<div class="card-footer">${footer}</div>` : ''}
        </div>
    `;
}

// Button component
function createButton({ text, type = 'button', variant = 'primary', size = '', onClick, disabled = false, className = '' }) {
    const buttonClass = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`;
    const buttonId = utils.generateId();
    
    const button = `
        <button type="${type}" class="${buttonClass}" id="${buttonId}" ${disabled ? 'disabled' : ''}>
            ${utils.escapeHtml(text)}
        </button>
    `;
    
    // Add event listener after button is added to DOM
    if (onClick) {
        setTimeout(() => {
            const buttonElement = document.getElementById(buttonId);
            if (buttonElement) {
                buttonElement.addEventListener('click', onClick);
            }
        }, 0);
    }
    
    return button;
}

// Tabs component
function createTabs({ tabs, defaultTab = 0, className = '' }) {
    const tabsId = utils.generateId();
    
    const tabsList = tabs.map((tab, index) => `
        <button class="tabs-trigger ${index === defaultTab ? 'active' : ''}" 
                data-tab="${index}" data-tabs-id="${tabsId}">
            ${utils.escapeHtml(tab.label)}
        </button>
    `).join('');
    
    const tabsContent = tabs.map((tab, index) => `
        <div class="tabs-content ${index === defaultTab ? 'active' : ''}" 
             data-tab="${index}" data-tabs-id="${tabsId}">
            ${tab.content}
        </div>
    `).join('');
    
    const tabsHtml = `
        <div class="tabs ${className}" data-tabs-id="${tabsId}">
            <div class="tabs-list">
                ${tabsList}
            </div>
            ${tabsContent}
        </div>
    `;
    
    // Add event listeners after tabs are added to DOM
    setTimeout(() => {
        const tabTriggers = document.querySelectorAll(`[data-tabs-id="${tabsId}"] .tabs-trigger`);
        const tabContents = document.querySelectorAll(`[data-tabs-id="${tabsId}"] .tabs-content`);
        
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const tabIndex = trigger.getAttribute('data-tab');
                
                // Remove active class from all triggers and contents
                tabTriggers.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked trigger and corresponding content
                trigger.classList.add('active');
                const targetContent = document.querySelector(`[data-tabs-id="${tabsId}"][data-tab="${tabIndex}"].tabs-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }, 0);
    
    return tabsHtml;
}

// Badge component
function createBadge({ text, variant = 'default', className = '' }) {
    return `<span class="badge badge-${variant} ${className}">${utils.escapeHtml(text)}</span>`;
}

// Form input component
function createFormInput({ 
    type = 'text', 
    name, 
    label, 
    placeholder = '', 
    value = '', 
    required = false, 
    className = '' 
}) {
    const inputId = utils.generateId();
    
    return `
        <div class="form-group">
            ${label ? `<label for="${inputId}" class="form-label">${utils.escapeHtml(label)}</label>` : ''}
            <input 
                type="${type}" 
                id="${inputId}" 
                name="${name}" 
                class="form-input ${className}"
                placeholder="${utils.escapeHtml(placeholder)}"
                value="${utils.escapeHtml(value)}"
                ${required ? 'required' : ''}
            />
        </div>
    `;
}

// Form textarea component
function createFormTextarea({ 
    name, 
    label, 
    placeholder = '', 
    value = '', 
    rows = 4, 
    required = false, 
    className = '' 
}) {
    const textareaId = utils.generateId();
    
    return `
        <div class="form-group">
            ${label ? `<label for="${textareaId}" class="form-label">${utils.escapeHtml(label)}</label>` : ''}
            <textarea 
                id="${textareaId}" 
                name="${name}" 
                class="form-textarea ${className}"
                placeholder="${utils.escapeHtml(placeholder)}"
                rows="${rows}"
                ${required ? 'required' : ''}
            >${utils.escapeHtml(value)}</textarea>
        </div>
    `;
}

// Form select component
function createFormSelect({ 
    name, 
    label, 
    options = [], 
    value = '', 
    required = false, 
    className = '' 
}) {
    const selectId = utils.generateId();
    
    const optionsHtml = options.map(option => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const selected = optionValue === value ? 'selected' : '';
        
        return `<option value="${utils.escapeHtml(optionValue)}" ${selected}>${utils.escapeHtml(optionLabel)}</option>`;
    }).join('');
    
    return `
        <div class="form-group">
            ${label ? `<label for="${selectId}" class="form-label">${utils.escapeHtml(label)}</label>` : ''}
            <select 
                id="${selectId}" 
                name="${name}" 
                class="form-select ${className}"
                ${required ? 'required' : ''}
            >
                ${optionsHtml}
            </select>
        </div>
    `;
}

// Avatar component
function createAvatar({ src, name, size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };
    
    const initials = utils.getUserInitials(name);
    const avatarSrc = src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
    
    return `
        <div class="user-avatar ${sizeClasses[size]} ${className}" style="width: ${size === 'sm' ? '2rem' : size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '6rem'}; height: ${size === 'sm' ? '2rem' : size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '6rem'};">
            <img src="${avatarSrc}" alt="${utils.escapeHtml(name)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
        </div>
    `;
}

// Loading spinner component
function createLoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: '16px',
        md: '24px',
        lg: '32px'
    };
    
    return `
        <div class="loading-spinner ${className}" style="
            width: ${sizeClasses[size]};
            height: ${sizeClasses[size]};
            border: 2px solid #f3f4f6;
            border-top: 2px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
        "></div>
    `;
}

// Statistics card component
function createStatsCard({ title, value, description, icon, className = '' }) {
    return createCard({
        className: className,
        content: `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <p style="font-size: 0.875rem; font-weight: 500; color: #64748b; margin-bottom: 0.5rem;">
                        ${utils.escapeHtml(title)}
                    </p>
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 0.25rem;">
                        ${utils.escapeHtml(value)}
                    </div>
                    ${description ? `
                        <p style="font-size: 0.75rem; color: #64748b;">
                            ${utils.escapeHtml(description)}
                        </p>
                    ` : ''}
                </div>
                ${icon ? `<div style="color: #2563eb; font-size: 1.5rem;">${icon}</div>` : ''}
            </div>
        `
    });
}

// Empty state component
function createEmptyState({ title, description, actionText, actionHref, className = '' }) {
    return `
        <div class="text-center ${className}" style="padding: 3rem 1rem;">
            <div style="font-size: 3rem; color: #e5e7eb; margin-bottom: 1rem;">📝</div>
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
                ${utils.escapeHtml(title)}
            </h3>
            <p style="color: #64748b; margin-bottom: 1.5rem;">
                ${utils.escapeHtml(description)}
            </p>
            ${actionText && actionHref ? `
                <a href="${actionHref}" class="btn btn-primary">
                    ${utils.escapeHtml(actionText)}
                </a>
            ` : ''}
        </div>
    `;
}

// Add CSS for loading spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Export components
window.components = {
    createCard,
    createButton,
    createTabs,
    createBadge,
    createFormInput,
    createFormTextarea,
    createFormSelect,
    createAvatar,
    createLoadingSpinner,
    createStatsCard,
    createEmptyState
};
