document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
    const body = document.body;

    if (themeToggleButtons.length === 0) return;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    };

    const savedTheme = localStorage.getItem('theme');

    // Default to light mode when no theme is saved
    let currentTheme = savedTheme || 'light';

    applyTheme(currentTheme);

    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // If the user hasn't chosen a theme, adapt to system changes.
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
});
