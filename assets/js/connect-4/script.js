/* seleziono tutti gli elementi dal dom */
let player1input = document.getElementById('player1');
let player2input = document.getElementById('player2');
const btn = document.querySelector('.start');
const startScreen = document.querySelector('.start-screen');
const endScreen = document.querySelector('.end');
const turnInfo = document.querySelector('.turn-info');
const buttons = document.querySelectorAll(".arrow");
const restart = document.querySelector('.restart');
const warning = document.querySelector('.warning');
/* i nomi dei giocatori da inserire nella legenda */
const name1 = document.querySelector('.pl1-name');
const name2 = document.querySelector('.pl2-name');
const legend = document.querySelector('.legend');

/* creo la griglia una volta che l'html e il css sono stati caricati*/
document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.getElementById("forza4-grid");
    // Creo dinamicamente le celle della grid
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        gridContainer.appendChild(cell);
      }
    }
  });
  

/* funzione per inserire la pedina nella cella */
  function insertCoin(col,row,coin) {
    /*è una promessa perchè devo aspettare che la pedina sia inserita 
    prima di passare il turno o di decretare vittoria/pareggio*/
    return new Promise((resolve, reject) => {
        const cells = document.getElementsByClassName("cell");
        const celle = Array.from(cells);
        celle.forEach((cell) => {
        if (cell.dataset.col == col && cell.dataset.row == row) {
            cell.style.backgroundColor = coin == 'X' ? "red" : "yellow";
          }
        }); 
        setTimeout(resolve,100);
      })
    }

//creo la classe Player
  class Player {
    constructor(coin) {
      this.coin = coin;
    }
    getName() {
      return this.name;
    }
    getCoin() {
      return this.coin;
    }
  }

//creo la classe del gioco con tutti i metodo necessari
  class Forza4 {
    constructor(player1,player2) {
/* creo una matrice 6x7 per avere un riferimento in background della griglia di gioco 
   con tutti i valori inizializzati a null */ 
      this.grid = Array.from({ length: 6 }, () => Array(7).fill(null));
      this.player1 = player1;
      this.player2 = player2;
      this.turn = this.player1;//il turno è inizializzato al primo giocatore
    }
    /* metodo per inserire la mossa del giocatore nella mia griglia 'virtuale'
      => prende la colonna in cui il giocatore vuole inserire la sua pedina 
         ed il giocatore stesso 
      => ritorna la riga che mi servirà per aggiornare la UI */
    setIn(col, player) {
      if (col >= 0 && col <= 6) {//un controllo in più per sicurezza 
        /* 1) ciclo su tutte le righe a partire dal basso
           2) inserisco il simbolo corrispondente al giocatore corrente
              nel primo spazio vuoto presente nella colonna passata*/
        for (let i = 5; i >= 0; i--) {
          if (this.grid[i][col] !== 'X' && this.grid[i][col] !== 'O') {
            this.grid[i][col] = player.getCoin();
            return i;
          }
        }
      }
    } 
    //metodo che ritorna il player di turno
    getTurn() {
        return this.turn;
    }
    //metodo che cambia il turno
    switchTurn() {
        this.turn = this.turn == this.player1 ? this.player2 : this.player1;
        turnInfo.innerHTML = this.turn == this.player1 ? 
            this.player1.getName()+', it`s your turn!' : 
            this.player2.getName()+', it`s your turn!';
        return this.turn;
    }
    //metodo che controlla se la colonna è piena
    //prende la colonna cliccata e ritorna true se è piena, false altrimenti
    colonnaFull(col) {
      if (col >= 0 && col <= 6) {// un controllo per sicurezza
        if (this.grid[0][col] === 'X' || this.grid[0][col] === 'O') {
          return true;
        }
      }
      return false;
    } 
    //metodo che controlla se c'è una vittoria in colonna
    winControlCol(col, player) {
      if (col >= 0 && col <= 6) {//un controllo in più per sicurezza
        for (let i = 5; i > 2; i--) {
            if (
            this.grid[i][col] === player.getCoin() &&
            this.grid[i - 1][col] === player.getCoin() &&
            this.grid[i - 2][col] === player.getCoin() &&
            this.grid[i - 3][col] === player.getCoin()
            ) {
            return true;
            }
        }
    }
    return false;
    }
    //metodo che controlla se c'è una vittoria in riga
    winControlRow(col, player) {
      if (col >= 0 && col <= 6) {//un controllo in più per sicurezza 
        //ciclo per ogni riga e divido in due casi per non uscire dalla matrice
        for (let i = 5; i >= 0; i--) {
          //1° caso: colonna da 0 a 3
          if (col >= 0 && col < 3) {
            if (
              this.grid[i][col] === player.getCoin() &&
              this.grid[i][col + 1] === player.getCoin() &&
              this.grid[i][col + 2] === player.getCoin() &&
              this.grid[i][col + 3] === player.getCoin()
            ) {
              return true;
            }
          //2° caso: colonna da 3 a 6
          } else if (col >= 3 && col <= 6) {
            if (
              this.grid[i][col] === player.getCoin() &&
              this.grid[i][col - 1] === player.getCoin() &&
              this.grid[i][col - 2] === player.getCoin() &&
              this.grid[i][col - 3] === player.getCoin()
            ) {
              return true;
            }
          }
        }
      }
      return false;
    }
    //metodo che controlla se c'è una vittoria in diagonale
    winControlDia(player) {
      //ciclo per ogni riga e divido in due casi per non uscire dalla matrice
      //con l'indice di riga parto da index 5 e arrivo a index 3
      for (let i = 5; i > 2; i--) {
        //1° caso: colonna da 0 a 3
        for (let j = 0; j < 4; j++) {
          if (this.grid[i][j] === player.getCoin()) {
            if (
              this.grid[i - 1][j + 1] === player.getCoin() &&
              this.grid[i - 2][j + 2] === player.getCoin() &&
              this.grid[i - 3][j + 3] === player.getCoin()
            ) {
              return true;
            }
          }
        }
      }
      for (let i = 5; i > 2; i--) {
        //2° caso: colonna da 6 a 3
        for (let j = 6; j > 2; j--) {
          if (this.grid[i][j] === player.getCoin()) {
            if (
              this.grid[i - 1][j - 1] === player.getCoin() &&
              this.grid[i - 2][j - 2] === player.getCoin() &&
              this.grid[i - 3][j - 3] === player.getCoin()
            ) {
              return true;
            }
          }
        }
      }
      return false;
    }
    //metodo che controlla se c'è un vincitore
    isWinner = (column, player) => {
        if(
          this.winControlCol(column, player) || 
          this.winControlRow(column, player) || 
          this.winControlDia(player)
          ){
            return true;
        }
        return false;
    }
  }

//tengo traccia dei nomi dei giocatori
let player1name;
let player2name;

/* click sul pulsante start per iniziare il gioco */
  btn.addEventListener ('click',(ev) => {
      ev.preventDefault();
      document.querySelector('.page-footer').style.marginTop = '0'
      //recupero i nomi dei giocatori dagli input
      player1name = player1input.value == '' ? 'Player 1' : player1input.value;
      player2name = player2input.value == '' ? 'Player 2' : player2input.value;
      //assegno i nomi ai giocatori e li inserisco nella legenda
      player1.name = player1name;
      player2.name = player2name;
      name1.innerHTML = `<p>${player1name}</p>`;
      name2.innerHTML = `<p>${player2name}</p>`;
      //resetto i valori degli input
      player1input.value = '';
      player2input.value = '';
      //nascondo la schermata di inizio 
      startScreen.classList.add('hidden');
      turnInfo.innerHTML = player1name +', it`s your turn!';
      //mostro le informazioni di gioco e la legenda
      turnInfo.classList.remove('hidden');
      legend.classList.remove('hidden');

  });

//creo i due giocatori ed il gioco
/*il giocatore 1 lo identifico con la 'X', il 2 con 'O' 
per controllare in background la vittoria nella mia matrice di riferimento*/
  const player1 = new Player("X");
  const player2 = new Player("O");
  const forza4 = new Forza4(player1, player2);
//variabile per contare le mosse inizializzata a 0
  let mosse = 0;
//variabile che mi serve per non effettuare il cambio turno se la colonna è piena
  let change = true;
//evento sul click dei pulsanti per inserire la pedina + logica di gioco
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
        const player = forza4.getTurn();
        warning.innerHTML = "";
        const column = button.id;
        let row;
        //se la colonna non è piena inserisco la pedina
        if(!forza4.colonnaFull(column)){
            row = forza4.setIn(column, player);
            const coin = player.getCoin();
            await insertCoin(column, row, coin);
            change = true;
            mosse++;
        //altrimenti avviso che la colonna è piena
        }else {
            warning.innerHTML = "This column is full!";
            change = false;
        }
        //controllo se c'è un vincitore o se è un pareggio
        if(forza4.isWinner(column, player)){
            const winner = player.getName();
            turnInfo.innerHTML = '';
            document.querySelector('.end-h1').innerHTML = 'The winner is '+winner+'!';
            endScreen.classList.remove('hidden');
        }else if (!forza4.isWinner(column, player) && mosse==42) {
            turnInfo.innerHTML = '';
            document.querySelector('.end-h1').innerHTML = 'It`s a draw!';
            endScreen.classList.remove('hidden');
            //altrimenti cambio il turno
        } else {
            if(change) forza4.switchTurn();
        }
    });
 })

/* evento sul pulsante di fine partita per resettare e giocare di nuovo */
restart.addEventListener('click', () => {
  location.reload();
});