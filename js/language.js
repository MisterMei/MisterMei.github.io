let currentLang = 'en';

function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    currentLang = savedLang;
    updateLanguage(currentLang);

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    updateLanguage(currentLang);
    localStorage.setItem('preferredLanguage', currentLang);
}

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-zh]');
    
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const zhText = element.getAttribute('data-zh');
        
        if (enText && zhText) {
            element.textContent = lang === 'en' ? enText : zhText;
        }
    });

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = lang === 'en' ? '中文' : 'EN';
        }
    }

    document.documentElement.lang = lang;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}

