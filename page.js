// Initialize particles.js for background effect
particlesJS.load('particles-js', 'assets/particles-config.json', function() {
    console.log('Particles.js loaded');
});

// Auth functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const authMessage = document.getElementById('authMessage');
    
    // Initialize default users if none exist
    if (!localStorage.getItem('apex_users')) {
        const defaultUsers = [
            { username: 'trader', password: 'Welcome123' },
            { username: 'admin', password: 'Admin123' }
        ];
        localStorage.setItem('apex_users', JSON.stringify(defaultUsers));
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!username || !password) {
            showAuthMessage('Please fill in all fields', 'error');
            return;
        }
        
        authenticateUser(username, password);
    });
    
    function authenticateUser(username, password) {
        const users = JSON.parse(localStorage.getItem('apex_users'));
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Successful login
            sessionStorage.setItem('apex_auth', 'true');
            sessionStorage.setItem('apex_user', username);
            
            showAuthMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showAuthMessage('Invalid credentials. Please try again.', 'error');
        }
    }
    
    function showAuthMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = 'auth-message ' + type;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            authMessage.className = 'auth-message';
        }, 5000);
    }
});
// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!sessionStorage.getItem('apex_auth')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load user-specific data
    const currentUser = sessionStorage.getItem('apex_user');
    console.log(`Welcome back, ${currentUser}`);
    
    // Initialize components
    loadMarketData();
    loadFeatures();
    setupEventListeners();
    
    // Update UI based on user
    updateUserUI();
});

function loadMarketData() {
    // This would fetch real market data in a real application
    const marketData = [
        { symbol: 'NIFTY 50', price: 19425.35, change: 1.23 },
        { symbol: 'SENSEX', price: 64818.72, change: 0.87 },
        { symbol: 'USD/INR', price: 82.94, change: -0.12 }
    ];
    
    const marketHtml = marketData.map(item => `
        <div class="market-item">
            <span class="market-symbol">${item.symbol}</span>
            <span class="market-price">${item.price.toFixed(2)}</span>
            <span class="market-change ${item.change >= 0 ? 'positive' : 'negative'}">
                ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
            </span>
        </div>
    `).join('');
    
    document.querySelector('.hero-market-data').innerHTML = marketHtml;
}

function loadFeatures() {
    // This would come from an API in a real app
    const features = [
        {
            title: "Interactive Charts",
            description: "Advanced technical analysis tools with 50+ indicators",
            icon: "fas fa-chart-line",
            link: "charts.html"
        },
        {
            title: "Market Scanner",
            description: "Real-time screening for stocks matching your criteria",
            icon: "fas fa-search-dollar",
            link: "scanner.html"
        },
        {
            title: "AI Predictions",
            description: "Machine learning models for price direction forecasts",
            icon: "fas fa-robot",
            link: "ai-predictions.html"
        }
    ];
    
    const featuresHtml = features.map(feature => `
        <div class="col-md-4 feature-card">
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
            <a href="${feature.link}" class="btn btn-outline-primary">
                Explore <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
    
    document.getElementById('features').innerHTML = `
        <div class="container">
            <h2 class="section-title">Powerful Trading Tools</h2>
            <div class="row">
                ${featuresHtml}
            </div>
        </div>
    `;
}

// Add other functions as needed...
// Utility functions for the application

// Format currency with proper symbols
function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Format percentage changes
function formatPercentage(change) {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Throttle function for scroll/resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

