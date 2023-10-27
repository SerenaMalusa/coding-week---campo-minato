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
const closeSurpriseBtn = document.querySelector('.surprise-btn');
const surpriseModal = document.querySelector('.surprise');
const getSurpriseBtn = document.querySelector('.get-surprise');

// Preparo delle informazioni utili alla logica di gioco
const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs - 1;
const bombsList = [];
const treasure = [];
let score = 0;
let t;

// prevengo il menu di default al tasto destro nella griglia (così posso mettere le bandiere rosse)
grid.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

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

      winTreasure();
      
    }      

    // Se è una bomba...
    if (bombsList.includes(i)) {
      
      cell.classList.add('cell-bomb');
      endGame(false);

    // Se non lo è...
    } else {
      cell.classList.add('cell-clicked');
      //updateScore();

      //conto il numero di bombe vicine e lo inserisco nelle celle che ne hanno almeno 1
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

      return;

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

//metto tutte le celle create in un array
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


// Funzione per decretare la fine del gioco
function endGame(isVictory) {

  // blocco set interval
  clearInterval(t);

  if (isVictory === true) { 
    // Coloriamo di verde e cambiamo il messaggio 
    endGameScreen.classList.add('win');
    endGameText.innerHTML = 'YOU<br>WIN';

    //mostro il tesoro e le bombe non flaggate
    revealTreasure();
    revealBombs();

  } else {

    //mostro tutte le bombe e il tesoro
    revealAllBombs();
    revealTreasure();    
  }
  
  // Mostriamo la schermata rimuovendo la classe
  endGameScreen.classList.remove('hidden');
}

// Funzione per ricaricare la pagina
function playAgain() {

  location.reload();

}

// # BONUS
//funzione per vittoria con tesoro
function winTreasure () {
  
  // porto lo score a 99999 e lo metto nel contatore
  score = 99999;
  // console.log(score);
  scoreCounter.innerText = String(score).padStart(5, 0);

  //faccio finire il gioco
  endGame(true);

  // cambio la schermata 
  endGameScreen.classList.add('win-treasure');
  endGameText.innerHTML = 'MAX<br>SCORE!';

  //faccio apparire bottone della sorpresa
  getSurpriseBtn.classList.remove('hidden');
}

// Funzione che rivela tutte le bombe
function revealAllBombs() {
  // Recupero tutte le celle
  //const cells = document.querySelectorAll('.cell');
  for (let i = 1; i <= cells.length; i++) {
    // controllo se la cella è una bomba
    if (bombsList.includes(i)) {
      const bombReveal = cells[i - 1];
      bombReveal.classList.remove('red-flag');
      bombReveal.classList.add('cell-bomb');
    }
  }

}

//Funzione che rivela  le bombe non flaggate
function revealBombs() {
  // Recupero tutte le celle
  for (let i = 1; i <= cells.length; i++) {
    // controllo se la cella è una bomba
    if (bombsList.includes(i)) {
      const bombReveal = cells[i - 1];
      bombReveal.classList.add('cell-bomb');
    }
  }

}

//funzione per rivelare il tesoro
function revealTreasure() {
  // Recupero tutte le celle
  for (let i = 1; i <= cells.length; i++) {
    
    //controllo se la cella è il tesoro
    if (treasure.includes(i)) {
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

        //le aggiungo a closeBombs
        closeBombs.push(i);

      } 

    } else if ((cellIndex - 1) % 10 === 0) {

      // se le 2 celle sopra, quella a sx e le 2 celle sotto sono in bombsList
      if ((cellIndex-10 == i || cellIndex-9 == i || cellIndex+1 == i || cellIndex+10 == i || cellIndex+11 == i)  &&  bombsList.includes(i)) {

        //le aggiungo a closeBombs
        closeBombs.push(i);

      } 

    } else {

      // se le 3 celle sopra, quelle a dx, a sx e le 3 celle sotto sono in bombsList
      if ((cellIndex-11 == i || cellIndex-10 == i || cellIndex-9 == i || cellIndex-1 == i || cellIndex+1 == i || cellIndex+9 == i || cellIndex+10 == i || cellIndex+11 == i)  &&  bombsList.includes(i)) {

        //le aggiungo a closeBombs
        closeBombs.push(i);

      } 

    }

  }

  //conto quante bombe ci sono
  return closeBombs.length;
}

//funzione per avviare il controllo delle celle cliccate in setInterval
function open () {

  //creo array vuoto che conterà le celle cliccate per il punteggio
  const clickedCells = [];

  //prendo tutte le celle
  cells.forEach((cell, i) => {
        
    //se la cella è cliccata
    if (cell.classList.contains('cell-clicked')) {
      
      //agiungo cella all'array
      clickedCells.push(i+1);

      //conto quante bombe vicine ha e solo se non ne ha
      const closeBombsNum = countCloseBombs(i + 1);
      if (closeBombsNum === 0) {

      //passo la cella alla funzione per "cliccare" le celle adiacenti
      clickAdiacentCells(i + 1);
      }
    }

    //aggiorno il punteggio
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

    //celle tutto a dx
    if (cellIndex % 10 === 0) {

      // prendo le 2 celle sopra, quella a sx e le 2 celle sotto che non siano il tesoro
      if ((cellIndex-11 == i+1 || cellIndex-10 == i+1 || cellIndex-1 == i+1 || cellIndex+9 == i+1 || cellIndex+10 == i+1) && !treasure.includes(i+1)) {

        clickCell(cell, i + 1);
      }
    // celle tutto a sx
    } else if ((cellIndex - 1) % 10 === 0) {

      // prendo le 2 celle sopra, quella a dx e le 2 celle sotto che non sono il tesoro
      if ((cellIndex-10 == i+1 || cellIndex-9 == i+1 || cellIndex+1 == i+1 || cellIndex+10 == i+1 || cellIndex+11 == i+1)  &&  !treasure.includes(i+1)) {

        clickCell(cell, i + 1);
      }
    } else {

      // prendo le 3 celle sopra, quelle a dx, a sx e le 3 celle sotto che non sono un tesoro
      if ((cellIndex-11 == i+1 || cellIndex-10 == i+1 || cellIndex-9 == i+1 || cellIndex-1 == i+1 || cellIndex+1 == i+1 || cellIndex+9 == i+1 || cellIndex+10 == i+1 || cellIndex+11 == i+1)  &&  !treasure.includes(i+1)) {

        clickCell(cell, i + 1);
      }
    }
  });

}

//funzione che mostra le celle con numero
function clickCell (cellNumber, cellIndex) {

  //clicco la cella
  cellNumber.classList.add('cell-clicked');

  //conto quante bombe ci sono intorno alla cella e se non è uno zero 
  const closeBombsNum = countCloseBombs(cellIndex);     
  if (closeBombsNum !== 0) {
    //inserisco il numero di bombe vicine nella cella
    cellNumber.innerHTML = '<p>'+ closeBombsNum + '</p>';
  }
}

//funzione per gestire la finestra sorpresa
function manageSurprise() {
   //se la modale è nascosta la mostro, altrimenti la nascondo
   if (surpriseModal.classList.contains('hidden')) {
    surpriseModal.classList.remove('hidden');
   } else {
    surpriseModal.classList.add('hidden');
   }

}


/* ---------------------
EVENTI
-----------------------*/
//gestisco click per apparizione schermata di sorpresa
getSurpriseBtn.addEventListener('click', manageSurprise);

//gestisco click per chiudere schermata di sorpresa
closeSurpriseBtn.addEventListener('click', manageSurprise);

// Gestiamo il click sul tasto rigioca
playAgainButton.addEventListener('click', playAgain);

//Intervallo che deve controllare tutte le celle cliccate ogni tot millisecondi
t = setInterval (open, 50);
