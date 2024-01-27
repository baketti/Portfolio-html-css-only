// Recupero dalla pagina tutti gli elementi di interesse
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again')

// Preparo delle informazioni utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let score = 0;

// Genero n bombe casuali
while (bombsList.length < totalBombs) {
  const number = Math.floor(Math.random() * totalCells) + 1;
  if (!bombsList.includes(number)) bombsList.push(number);
}

console.log(bombsList);

/* Griglia e logica di gioco */
let isCellEven = false;
let isRowEven = false;

for (let i = 1; i <= totalCells; i++) {
  // Creo un elemento e gli do la classe 'cell'
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', i)

  // cell.innerText = i;
  isCellEven = i % 2 === 0;

  // Se la riga è pari e la cella è pari: casella grigia
  if (isRowEven && isCellEven) cell.classList.add('cell-dark');

  // Se la riga è dispari e la cella è dispari: casella grigia
  else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');
  
  else cell.classList.add('cell-light');
  // Se sono alla fine della riga...
  if (i % 10 === 0) isRowEven = !isRowEven;

  // # Gestiamo il click della cella
  cell.addEventListener('click', function () {
    // ! Controllo che la cella non sia stata già cliccata
    if (cell.classList.contains('cell-clicked')) return;

    if (bombsList.includes(i)) {
      // Se è una bomba....
      cell.classList.add('cell-bomb');
      endGame(false);
    } else {
      // Se non lo è...
      cell.classList.add('cell-clicked');
      const nearBombs = checkNearBombs(i);
      if(nearBombs > 0) {
        if(nearBombs == 1) cell.style.color = 'green';
        if(nearBombs == 2 || nearBombs == 3) cell.style.color = 'blue';
        if(nearBombs == 4 || nearBombs == 5) cell.style.color = 'red';
        if(nearBombs == 6 || nearBombs == 7 || nearBombs == 8) cell.style.color = 'red';
        cell.innerHTML = `<span>${nearBombs}</span>`;
      }
      updateScore();
    }
  });

  // Lo inserisco nella griglia
  grid.appendChild(cell);
}
/* FUNZIONI */
// Funzione per aggiornare il punteggio
function updateScore() {
  // Incremento lo score
  score++;
  // Lo inserisco nel contatore
  scoreCounter.innerText = String(score).padStart(5, 0);

  // Controlliamo se l'utente ha vinto
  if (score === maxScore) endGame(true);
}

/*Funzione per controllare se ci sono bombe vicine:
  prende la posizione della cella => ritorna numero bombe vicine*/
function checkNearBombs(i) {
  let nearBombs = 0 
  if (i < 11) {
    if(i==1){
      if(bombsList.includes(i+1)) nearBombs++
      if(bombsList.includes(i+10)) nearBombs++
      if(bombsList.includes(i+11)) nearBombs++
    }
    if(i==10){
      if(bombsList.includes(i-1)) nearBombs++
      if(bombsList.includes(i+9)) nearBombs++
      if(bombsList.includes(i+10)) nearBombs++
    }
    if(i!=1 && i!=10){
      if(bombsList.includes(i-1)) nearBombs++
      if(bombsList.includes(i+1)) nearBombs++
      if(bombsList.includes(i+9)) nearBombs++
      if(bombsList.includes(i+10)) nearBombs++
      if(bombsList.includes(i+11)) nearBombs++
    }
  }
  if (i > 90) {
    if(i==91){
      if(bombsList.includes(i-10)) nearBombs++
      if(bombsList.includes(i-9)) nearBombs++
      if(bombsList.includes(i+1)) nearBombs++
    }
    if(i==100){
      if(bombsList.includes(i-10)) nearBombs++
      if(bombsList.includes(i-11)) nearBombs++
      if(bombsList.includes(i-1)) nearBombs++
    }
    if(i!=91 && i!=100){
      if(bombsList.includes(i-10)) nearBombs++
      if(bombsList.includes(i-9)) nearBombs++
      if(bombsList.includes(i-11)) nearBombs++
      if(bombsList.includes(i-1)) nearBombs++
      if(bombsList.includes(i+1)) nearBombs++
    }
   }
   if(i>10 && i<91){
    if(String(i).charAt(1) =='1' || String(i).charAt(1) =='0'){
      if(String(i).charAt(1) =='1'){
        if(bombsList.includes(i-10)) nearBombs++
        if(bombsList.includes(i-9)) nearBombs++
        if(bombsList.includes(i+1)) nearBombs++
        if(bombsList.includes(i+10)) nearBombs++
        if(bombsList.includes(i+11)) nearBombs++
      }
      if(String(i).charAt(1) =='0'){
        if(bombsList.includes(i-10)) nearBombs++
        if(bombsList.includes(i-11)) nearBombs++
        if(bombsList.includes(i-1)) nearBombs++
        if(bombsList.includes(i+9)) nearBombs++
        if(bombsList.includes(i+10)) nearBombs++
      }
    } else {
        if(bombsList.includes(i-10)) nearBombs++
        if(bombsList.includes(i-9)) nearBombs++
        if(bombsList.includes(i-11)) nearBombs++
        if(bombsList.includes(i-1)) nearBombs++
        if(bombsList.includes(i+1)) nearBombs++
        if(bombsList.includes(i+9)) nearBombs++
        if(bombsList.includes(i+10)) nearBombs++
        if(bombsList.includes(i+11)) nearBombs++
    }
  }
  return nearBombs;
}

// Funzione per decretare la fine del gioco
function endGame(isVictory) {
  if (isVictory) {
    // Coloriamo di verde e cambiamo il messaggio
    endGameScreen.classList.add('win');
    endGameText.innerHTML = 'YOU<br>WIN';
  } else {
    // Riveliamo tutte le bombe
    revealAllBombs();
  }

  // Mostriamo la schermata rimuovendo la classe
  endGameScreen.classList.remove('hidden');
}

// Funzione che rivela tutte le bombe
function revealAllBombs() {
  // Recupero tutte le celle
  const cells = document.querySelectorAll('.cell');
  for (let i = 1; i <= cells.length; i++) {
    // controllo se la cella è una bomba
    if (bombsList.includes(i)) {
      const cellToReveal = cells[i - 1];
      cellToReveal.classList.add('cell-bomb');
    }
  }
}

// Funzione per ricaricare la pagina
function playAgain() {
  location.reload();
}

//Evento click sul tasto rigioca
playAgainButton.addEventListener('click', playAgain);