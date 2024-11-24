console.log('Script loaded');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const loginForm = document.getElementById('login-form');
    const iframe = document.getElementById('powerbi-iframe');
    const menuItems = document.querySelectorAll('.menu a');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplay = document.getElementById('user-display');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    console.log('Elements:', { loginForm, iframe, menuItems, logoutBtn, userDisplay, fullscreenBtn });

    function updateIframeSrc(pageName) {
        if (!iframe) return;
        const baseUrl = 'https://app.powerbi.com/groups/5606ec57-3bc7-4eea-82c3-d1bfa00c7513/reports/948fd5df-254d-4ba7-b739-2544d582b312';
        const newUrl = `${baseUrl}/${pageName}?experience=power-bi&navContentPaneEnabled=false&filterPaneEnabled=false&toolbarHidden=true`;
        iframe.src = newUrl;
        iframe.onload = removeFooter;
    }

    function removeFooter() {
        if (!iframe) return;
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const style = iframeDoc.createElement('style');
            style.textContent = `
                body { overflow: hidden !important; }
                div[class*="footer"],
                div[class*="footerWrapper"],
                .powerBIFooter,
                #footer,
                footer,
                [class*="footer-container"],
                [id*="footer-container"] {
                    display: none !important;
                    height: 0 !important;
                    min-height: 0 !important;
                    max-height: 0 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                #reportContainer { height: 100vh !important; }
            `;
            iframeDoc.head.appendChild(style);

            const footerElements = iframeDoc.querySelectorAll('div[class*="footer"], div[class*="footerWrapper"], .powerBIFooter, #footer, footer, [class*="footer-container"], [id*="footer-container"]');
            footerElements.forEach(el => el.remove());

            console.log('Footer removal attempted');
        } catch (error) {
            console.error('Error removing footer:', error);
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function handleFullscreenChange() {
        document.body.classList.toggle('fullscreen-mode', document.fullscreenElement);
    }

    if (loginForm) {
        console.log('Login page detected');
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            console.log('Login attempt - Username:', username, 'Password:', password);

            if (username === 'Leonardo' && password === '123') {
                console.log('Login successful');
                localStorage.setItem('user', username);
                window.location.href = 'dashboard.html';
            } else {
                console.log('Login failed');
                alert('Usuário ou senha incorretos');
            }
        });
    } else if (iframe) {
        console.log('Dashboard page detected');
        const user = localStorage.getItem('user');
        if (!user) {
            console.log('User not logged in, redirecting to login page');
            window.location.href = 'index.html';
        } else {
            console.log('User logged in:', user);
            if (userDisplay) userDisplay.textContent = user;

            menuItems.forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    const selectedPage = this.getAttribute('data-page');
                    console.log('Menu item clicked:', selectedPage);

                    menuItems.forEach(mi => mi.classList.remove('active'));
                    this.classList.add('active');

                    updateIframeSrc(selectedPage);
                });
            });

            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    console.log('Logout button clicked');
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                });
            }

            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', toggleFullScreen);
            }

            document.addEventListener('fullscreenchange', handleFullscreenChange);

            // Inicializar com a primeira página
            updateIframeSrc('978b5a6d63c886ae5fd5');
        }
    } else {
        console.log('Neither login form nor dashboard elements found');
    }
});