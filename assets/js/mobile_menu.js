let menu = document.querySelector('.features-menu');
let navbar = document.querySelector('.navbar');
let burgerMenu = document.querySelector('.burger-menu');
let isMenuOpen = false;

window.onload = () => {
    menu.style.display = 'none';
}

function toggleMenu() {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = '';
        isMenuOpen = true;
    }
}

burgerMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
});

window.addEventListener('click', () => {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth <= 1060) {
        menu.style.display = 'none'; 
        isMenuOpen = false;
    } 
});