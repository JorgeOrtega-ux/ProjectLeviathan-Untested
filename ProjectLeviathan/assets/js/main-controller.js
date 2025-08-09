import { initDragController } from './drag-controller.js';

function initMainController() {
    let closeOnClickOutside = true;
    let closeOnEscape = true;
    let isModuleOptionsActive = false;
    let isAnimating = false;

    const toggleButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');

    if (!toggleButton || !moduleOptions) return;

    const menuContent = moduleOptions.querySelector('.menu-content');

    const _setMenuClosed = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        isModuleOptionsActive = false;
    };

    const _setMenuOpen = () => {
        moduleOptions.classList.remove('disabled');
        moduleOptions.classList.add('active');
        isModuleOptionsActive = true;
    };

    const closeMenu = () => {
        if (isAnimating || !isModuleOptionsActive) return;

        if (window.innerWidth <= 468 && menuContent) {
            isAnimating = true;

            menuContent.removeAttribute('style');
            
            // 1. Asegurar que solo la animación de salida esté presente.
            moduleOptions.classList.remove('fade-in');
            moduleOptions.classList.add('fade-out');
            menuContent.classList.remove('is-open');

            // 2. Esperar el fin de la animación para hacer la limpieza completa.
            moduleOptions.addEventListener('animationend', () => {
                _setMenuClosed();
                moduleOptions.classList.remove('fade-out'); // Limpiar la clase de animación.
                isAnimating = false;
            }, { once: true });
        } else {
            _setMenuClosed();
        }
    };

    const openMenu = () => {
        if (isAnimating || isModuleOptionsActive) return;
        
        if (window.innerWidth <= 468 && menuContent) {
            isAnimating = true;
            _setMenuOpen();

            // 1. Asegurar que solo la animación de entrada esté presente.
            moduleOptions.classList.remove('fade-out');
            moduleOptions.classList.add('fade-in');
            
            requestAnimationFrame(() => {
                menuContent.classList.add('is-open');
            });

            // 2. Esperar el fin de la animación para limpiar la clase y desbloquear.
            moduleOptions.addEventListener('animationend', () => {
                moduleOptions.classList.remove('fade-in'); // Limpiar la clase de animación.
                isAnimating = false;
            }, { once: true });
        } else {
            _setMenuOpen();
        }
    };

    // --- EVENT LISTENERS ---
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isModuleOptionsActive ? closeMenu() : openMenu();
    });

    if (closeOnClickOutside) {
        document.addEventListener('click', (e) => {
            if (isAnimating || !isModuleOptionsActive) return;
            if (window.innerWidth <= 468) {
                if (e.target === moduleOptions) closeMenu();
            } else {
                if (!moduleOptions.contains(e.target) && !toggleButton.contains(e.target)) closeMenu();
            }
        });
    }

    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    initDragController(closeMenu, () => isAnimating);
}

export { initMainController };