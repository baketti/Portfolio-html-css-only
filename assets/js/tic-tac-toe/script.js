const player1input = document.getElementById('player1');
const player2input = document.getElementById('player2');
const btn = document.querySelector('.start');
const startScreen = document.querySelector('.start-screen');
const endScreen = document.querySelector('.end');
const turnInfo = document.querySelector('.turn-info');
const restart = document.querySelector('.restart');
const caselle = document.querySelectorAll('.casella');
/* i nomi dei giocatori da inserire nella legenda */
const name1 = document.querySelector('.pl1-name');
const name2 = document.querySelector('.pl2-name');
const legend = document.querySelector('.legend');

/* variabili per tenere traccia dei nomi dei giocatori */
let player1name;
let player2name;
/* pulsante di inizio */
btn.addEventListener ('click',(ev) => {
    ev.preventDefault();
    /* prendo i nomi dal form e se sono vuoti li imposto di default */
    player1name = player1input.value == '' ? 'Player 1' : player1input.value;
    player2name = player2input.value == '' ? 'Player 2' : player2input.value;
    player1.nome = player1name;
    player2.nome = player2name;
    /* nomi nella legenda */
    name1.innerHTML = `<p>${player1name}</p>`;
    name2.innerHTML = `<p>${player2name}</p>`;
    /* resetto gli input */
    player1input.value = '';
    player2input.value = '';
    /* rimuovo la schermata di inizio */
    startScreen.classList.add('hidden');
    turnInfo.innerHTML = player1name +' it`s your turn!';
    /* mostro le info di gioco e la legenda */
    legend.classList.remove('hidden');
})

/* Oggetto giocatore */
class Player {
	nome;	
	symbol;
	constructor(symbol, nome) {
		this.symbol=symbol;
		this.nome=nome;
	}
	getSimbolo() {
		return this.symbol;
	}
	toString() {
		return this.nome;
	}
}

/* Oggetti giocatori inizializzati con simbolo predefinito */
class Player1 extends Player{
	constructor() {
		super('X', player1name);
	}  
	static getSimbolo() {
		return this.symbol;
	}
}

class Player2 extends Player{
	constructor() {
		super('O', player2name);
	}
	static getSimbolo() {
		return this.symbol;
	}
}

/* Oggetto gioco */
class Game {
    player1;
    player2;
    turno;
    constructor(player1,player2) {
        this.player1=player1;
        this.player2=player2;
        this.turno=player1;
    }
    getPlayer() {
        return this.turno;
    }
    setTurno(turno) {
        this.turno = turno == player1 ? player2 : player1;
        turnInfo.innerHTML = this.turno == player1 ? player1name+' it`s your turn!' : player2name+' it`s your turn!';
    }
}

/* la matrice 3x3 che utilizzo per controllare la vittoria */
const schema = [[1,2,3],[4,5,6],[7,8,9]];

/* funzione che controlla la vittoria */
function checkVittoria() {//ritorna true se c'è vittoria, false altrimenti
    /* ciclo che controlla se c'è vittoria in riga */
    for (let i = 0; i < 3; i++) {
        if (schema[i][0] == schema[i][1] && schema[i][1] == schema[i][2]) {
            return true;
        }
    }
    /* ciclo che controlla se c'è vittoria in colonna */
    for (let i = 0; i < 3; i++) {
        if (schema[0][i] == schema[1][i] && schema[1][i] == schema[2][i]) {
            return true;
        }
    }
    /* condizioni che controllano se c'è vittoria nelle 2 diagonali */
    if (schema[0][0] == schema[1][1] && schema[1][1] == schema[2][2]) {
        return true;
    }
    if (schema[0][2] == schema[1][1] && schema[1][1] == schema[2][0]) {
        return true;
    }
    return false;
}

/* funzione che inserisce il simbolo del giocatore nella casella corrispondente */
function setMossa(casella,player) {
    /* la classe corrisponde al numero della casella nella griglia */
    const classe = casella.classList[1];
    //cambio il colore del simbolo in base al giocatore
    player == player1 ? casella.style.color = 'blue' : casella.style.color = 'red';
    player == player1 ? 
    casella.style.textShadow = `
        0 0 5px #0ff,
        0 0 10px #0ff,
        0 0 15px #0ff,
        0 0 20px #0ff,
        0 0 30px #0ff,
        0 0 40px #0ff` : 
    casella.style.textShadow = `
        0 0 5px rgb(255, 187, 62),
        0 0 10px rgb(255, 187, 62),
        0 0 15px rgb(255, 187, 62),
        0 0 20px rgb(255, 187, 62),
        0 0 30px rgb(255, 187, 62),
        0 0 40px rgb(255, 187, 62)`;

    switch(classe){
        case 'uno':
            schema[0][0] = player.getSimbolo();
            break;
        case 'due':
            schema[0][1] = player.getSimbolo();
            break;
        case 'tre':
            schema[0][2] = player.getSimbolo();
            break;
        case 'quattro':
            schema[1][0] = player.getSimbolo();
            break;
        case 'cinque':
            schema[1][1] = player.getSimbolo();
            break;
        case 'sei':
            schema[1][2] = player.getSimbolo();
            break;
        case 'sette':
            schema[2][0] = player.getSimbolo();
            break;
        case 'otto':
            schema[2][1] = player.getSimbolo();
            break;
        case 'nove':
            schema[2][2] = player.getSimbolo();
            break;
    }
}

/* inizializzo i due giocatori ed il gioco */
const player1 = new Player1();
const player2 = new Player2();
const game = new Game(player1,player2);

/* funzione che controlla se la mossa del giocatore è valida */
function checkMossa(casella){
    if (casella.innerHTML != 'X' && casella.innerHTML != 'O') return true;
    return false  
}

//Tengo traccia del numero di mosse per decretare l'eventuale pareggio
let mosse = 0;
/* per ogni casella => gestisco il click */
document.querySelectorAll('.casella').forEach(casella => { 
    //cambio colore al passaggio del mouse in base al giocatore corrrente
    casella.addEventListener('mouseover', () => {
        if (game.getPlayer() == player1) {
            casella.style.backgroundColor = 'rgb(157, 197, 199)';
        } else {
            casella.style.backgroundColor = 'rgb(245, 129, 129)';
        }
    }); 
    casella.addEventListener('mouseout', () => {
        casella.style.backgroundColor = 'white';
    })
    casella.addEventListener('click', () => {   
        /* controllo se la mossa è valida (non è necessario ma non guasta) */
        if(checkMossa(casella)) {
            /* inserisco il simbolo del giocatore nella casella */
            casella.innerHTML =  game.getPlayer() == player1 ? player1.getSimbolo() : player2.getSimbolo();
            /* aggiorno la mia matrice */
            setMossa(casella,game.getPlayer());
            /* aggiorno le mosse */
            mosse++;
            /* controllo se c'è vittoria */
            if(checkVittoria()){
                const winner = game.getPlayer();
                turnInfo.innerHTML = '';
                document.querySelector('.end-h1').innerHTML = 'The winner is '+winner+'!';
                endScreen.classList.remove('hidden');
            }
            /* al termine di ogni mossa => cambio turno */
            game.setTurno(game.getPlayer())
        }
        /* se non c'è un vincitore ed il numero di mosse è pari al massimo */
        if (!checkVittoria() && mosse == 9) {
            turnInfo.innerHTML = '';
            document.querySelector('.end-h1').innerHTML = 'It`s a draw!';//decreto il pareggio
            endScreen.classList.remove('hidden');
        }
    })
})
     
/* pulsante di fine partita per resettare tutto e rigiocare */
restart.addEventListener('click', () => {
    location.reload();
});
