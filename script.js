/* -----------------------
FASE DI PREPARAZIONE
------------------------ */

// Recuperare dalla pagina tutti gli elementi di interesse
const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');
const gameContainer = document.querySelector('.game-container');

// Preparo delle informazioni utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs - 1;
const bombsList = [];
const treasure = [];
let score = 0;
let t;

// Generare tesoro random
treasure.push (Math.floor(Math.random() * 100) +1);
console.log ('tesoro=',treasure);

// Generare TOT bombe casuali
while (bombsList.length < totalBombs) {
  const number = Math.floor(Math.random() * totalCells) + 1;
  if (!bombsList.includes(number) && !treasure.includes(number)) bombsList.push(number);
}
console.log(bombsList);

/* -----------------------
GRIGLIA E LOGICA DI GIOCO
-----------------------*/
let isCellEven = false;
let isRowEven = false;

grid.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

for (let i = 1; i <= totalCells; i++) {
  // Creo un elemento e gli do la classe 'cell'
  const cell = document.createElement('div');
  cell.classList.add('cell');

  // cell.innerText = i;
  isCellEven = i % 2 === 0;

  // Se la riga è pari e la cella è pari: casella grigia
  if (isRowEven && isCellEven) cell.classList.add('cell-dark');

  // Se la riga è dispari e la cella è dispari: casella grigia
  else if (!isRowEven && !isCellEven) cell.classList.add('cell-dark');

  // Se sono alla fine della riga...
  if (i % 10 === 0) isRowEven = !isRowEven;

  // # Gestiamo il click della cella
  cell.addEventListener('click', function () {
    // ! Controllo che la cella non sia stata già cliccata e non abbia la bandierina
    if (cell.classList.contains('cell-clicked') || cell.classList.contains('red-flag')) return;

    // Se è il tesoro
    if (treasure.includes(i)) {
      // faccio apparire il tesoro
      cell.classList.add('treasure');

      // aggiorno lo score a 9999 e faccio finire il gioco
      treasureScore();
      endGame(true);

      // cambio lo sfondo della schermata 
      endGameScreen.classList.add('win-treasure');
      endGameText.innerHTML = 'MAX<br>SCORE!';
                 
      return;
      
    }      

    if (bombsList.includes(i)) {
      // Se è una bomba....
      cell.classList.add('cell-bomb');
      endGame(false);
    } else {
      // Se non lo è...
      cell.classList.add('cell-clicked');
      //updateScore();

      //inserisco il numero di bombe come testo nella cella
      //countCloseBombs(i);
      const closeBombsNum = countCloseBombs(i);
      //console.log('Bombe vicine=',closeBombsNum);

      if (closeBombsNum !== 0) {
        cell.innerHTML = '<p>'+closeBombsNum+'</p>';
      };
  
    }

        
  });

  // gestisco il rightClick della cella 
  cell.addEventListener("contextmenu", function() {

    // ! Controllo che la cella non sia stata già cliccata
    if (cell.classList.contains('cell-clicked')) {

      return

    } else if (cell.classList.contains('red-flag')) {

      // faccio sparire la bandierina
      cell.classList.remove('red-flag');

    } else {

      // faccio apparire la bandierina
      cell.classList.add('red-flag');

    }

  });

  // Lo inserisco nella griglia
  grid.appendChild(cell);
  
}

const cells = document.querySelectorAll('.cell');

/* -------------------
FUNZIONI
-------------------*/
// Funzione per aggiornare il punteggio
/*function updateScore() {
  // Incremento lo score
  score++;
  // Lo inserisco nel contatore
  scoreCounter.innerText = String(score).padStart(5, 0);

  // Controlliamo se l'utente ha vinto
  if (score === maxScore) endGame(true);
}*/

//aggiorno lo score quando trovo il tesoro
function treasureScore () {
  // porto lo score a 99999
  score = 99999;
  // console.log(score);
  
  // Lo metto nel contatore
  scoreCounter.innerText = String(score).padStart(5, 0);
}

// Funzione per decretare la fine del gioco
function endGame(isVictory) {
  // blocco set interval
  clearInterval(t);
  if (isVictory === true) { 
    // Coloriamo di verde e cambiamo il messaggio
    endGameScreen.classList.add('win');
    endGameText.innerHTML = 'YOU<br>WIN';
  } else {
    
  }
  

  // Mostriamo la schermata rimuovendo la classe
  endGameScreen.classList.remove('hidden');
}

// Funzione per ricaricare la pagina
function playAgain() {

  /*se ho vinto con il tesoro
  if (endGameScreen.classList.contains('win-treasure')){

    //recupero la finestra sorpresa
    const rickrollWindow = document.querySelector('.rickrolling');
    rickrollWindow.classList.remove('hidden');

    //faccio funzionare il btn per la chiusura
    const closeButton = document.querySelector('.rickrolling-btn');
    closeButton.addEventListener('click', function() {

      rickrollWindow.classList.add('hidden');

    })

  } else {*/

    location.reload();

  //}
}

// # BONUS
// Funzione che rivela tutte le bombe e il tesoro
function revealAll() {
  // Recupero tutte le celle
  const cells = document.querySelectorAll('.cell');
  for (let i = 1; i <= cells.length; i++) {
    // controllo se la cella è una bomba
    if (bombsList.includes(i)) {
      const bombReveal = cells[i - 1];
      bombReveal.classList.remove('red-flag');
      bombReveal.classList.add('cell-bomb');
    }

    //controllo se la cella è il tesoro
    else if (treasure.includes(i)) {
      const treasureReveal = cells[i-1];
      treasureReveal.classList.remove('red-flag');
      treasureReveal.classList.add('treasure');
    }
  }

}

// Funzione per contare le bombe vicine
function countCloseBombs(cellIndex) {
  const closeBombs = [];

  //riprendo tutte le celle 
  for (let i = 1; i <= totalCells; i++) {

    if (cellIndex % 10 === 0) {

      // se le 2 celle sopra, quella a dx e le 2 celle sotto sono in bombsList
      if ((cellIndex-11 == i || cellIndex-10 == i || cellIndex-1 == i || cellIndex+9 == i || cellIndex+10 == i)  &&  bombsList.includes(i)) {

        //le aggiongo a closeBombs
        closeBombs.push(i);

      } 

    } else if ((cellIndex - 1) % 10 === 0) {

      // se le 2 celle sopra, quella a sx e le 2 celle sotto sono in bombsList
      if ((cellIndex-10 == i || cellIndex-9 == i || cellIndex+1 == i || cellIndex+10 == i || cellIndex+11 == i)  &&  bombsList.includes(i)) {

        //le aggiongo a closeBombs
        closeBombs.push(i);

      } 

    } else {

      // se le 3 celle sopra, quelle a dx, a sx e le 3 celle sotto sono in bombsList
      if ((cellIndex-11 == i || cellIndex-10 == i || cellIndex-9 == i || cellIndex-1 == i || cellIndex+1 == i || cellIndex+9 == i || cellIndex+10 == i || cellIndex+11 == i)  &&  bombsList.includes(i)) {

        //le aggiongo a closeBombs
        closeBombs.push(i);

      } 

    }

  }

  //conto solo quante bombe ci sono
  return closeBombs.length;
}

//funzione per avviare il controllo delle celle cliccate
function open () {

  const clickedCells = [];

  //prendo tutte le celle
  cells.forEach((cell, i) => {
    
    const closeBombsNum = countCloseBombs(i + 1);
      
    //se la cella è cliccata e non ha bombe vicine
    if (cell.classList.contains('cell-clicked')) {
      
      clickedCells.push(i+1);

      if (closeBombsNum === 0) {

      //passo la cella alla funzione per "cliccare" le celle adiacenti
      clickAdiacentCells(i + 1);
      }
    }

    let score = clickedCells.length;
    scoreCounter.innerText = String(score).padStart(5, 0);
    if (score === maxScore) endGame(true);
    return;

  });
}

//funzione per aggiungere la classe cell-clicked 
function clickAdiacentCells(cellIndex) {

  //riprendo tutte le celle
  cells.forEach((cell, i) => {

    const closeBombsNum = countCloseBombs(i + 1);
    //celle tutto a dx
    if (cellIndex % 10 === 0) {

      // prendo le 2 celle sopra, quella a sx e le 2 celle sotto che non siano un tesoro
      if ((cellIndex-11 == i+1 || cellIndex-10 == i+1 || cellIndex-1 == i+1 || cellIndex+9 == i+1 || cellIndex+10 == i+1) && !treasure.includes(i+1)) {

        //le clicco e le numero a meno che non siano uno 0
        cell.classList.add('cell-clicked');        
        if (closeBombsNum !== 0) {
          cell.innerHTML = '<p>'+ closeBombsNum + '</p>';
        }

      }
    // celle tutto a sx
    } else if ((cellIndex - 1) % 10 === 0) {

      // prendo le 2 celle sopra, quella a dx e le 2 celle sotto che non sono il tesoro
      if ((cellIndex-10 == i+1 || cellIndex-9 == i+1 || cellIndex+1 == i+1 || cellIndex+10 == i+1 || cellIndex+11 == i+1)  &&  !treasure.includes(i+1)) {

        //le clicco e le numero a meno che non siano uno 0
        cell.classList.add('cell-clicked');        
        if (closeBombsNum !== 0) {
          cell.innerHTML = '<p>'+ closeBombsNum + '</p>';
        }
      }
    } else {

      // prendo le 3 celle sopra, quelle a dx, a sx e le 3 celle sotto che non sono un tesoro
      if ((cellIndex-11 == i+1 || cellIndex-10 == i+1 || cellIndex-9 == i+1 || cellIndex-1 == i+1 || cellIndex+1 == i+1 || cellIndex+9 == i+1 || cellIndex+10 == i+1 || cellIndex+11 == i+1)  &&  !treasure.includes(i+1)) {

        //le clicco e le numero a meno che non siano uno 0
        cell.classList.add('cell-clicked');        
        if (closeBombsNum !== 0) {
          cell.innerHTML = '<p>'+ closeBombsNum + '</p>';
        }
      }
    }
  });

}


/* ---------------------
EVENTI
-----------------------*/

// Gestiamo il click sul tasto rigioca
playAgainButton.addEventListener('click', playAgain);

//Intervallo che deve controllare tutte le celle cliccate ogni tot millisecondi
t = setInterval (open, 100);