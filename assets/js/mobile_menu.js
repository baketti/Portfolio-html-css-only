/* 
Con questo script gestiamo l'apertura e la chiusura del menu per dispositivi mobili: Tablet e mobile.
Il menu veniva aperto e chiuso tramite l':hover, ma siccome nei dispositivi touch non esiste l'hover,
perchè di fatto diventa un click, abbiamo dovuto gestire l'apertura e la chiusura del menu tramite javascript.
Ora il menu può essere chiuso cliccando sul burger-menu,oppure cliccando in qualsiasi altro punto della finestra,
lasciando invariato il comportamento precedente.
Nei desktop in questo modo, il comportamento del css verrà sovrascritto
e si potrà aprire e chiudere il menu sempre con un click.
Una volta aperto, però, il css originale tornerà a funzionare normalmente, 
e il menù potrà aprirsi e chiudersi con l'hover, dando di fatto al menu un comportamento ibrido.
*/

let menu = document.querySelector('.features-menu');
let burgerMenu = document.querySelector('.burger-menu');
let isMenuOpen = false;

/*
Aggiungiamo subito la proprietà sovrascrivendo il css originale, 
altrimenti non funzionerebbe al primo click, inizierebbe a funzionare solo al secondo
*/
window.onload = () => {
    menu.style.display = 'none';
}
/* 
Con questa funzione, al click sul burger menu:
    1)se il menu è aperto lo chiudiamo, altrimenti lo apriamo 
    2)una volta aperto togliamo la proprietà display: none, 
      e la impostiamo a vuota, lasciando la gestione al css originale
*/
function toggleMenu() {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = '';
        isMenuOpen = true;
    }
}
/* Assegnamo l'evento al burger-menu */
burgerMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
});
/* 
Aggiungiamo l'evento all'intera finestra, 
facendo di fatto un override della gestione dell':hover 
*/
window.addEventListener('click', () => {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    }
});
/* 
Appena la dimensione della finestra è tale da mostare il burger menu
assegnamo la proprietà display:none al menu,
altrimenti inizierebbe a funzionare solo al secondo click
*/
window.addEventListener('resize', () => {
    if (window.innerWidth <= 1060) {
        menu.style.display = 'none'; 
        isMenuOpen = false;
    } 
});