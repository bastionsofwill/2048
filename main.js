var i, j, dir, randomIndex, initZeroFlag, initZero;
var newSquare = [];
var equals = [];
var tempRow = [];
var tempBoard = [];
var newBoard = [];
var touchStart, touchEnd;
var deltaX, deltaY;

const Keycode = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

const State = {
    PLAYING: 0,
    GAMEOVER: 1,
    WIN: 2,
    INFINITE: 3
}

let game = {
    gameBoard: [],
    emptySquares: [],
    numOfMoves: 0,
    score: 0,
    gameState: null,
    createNewNumber() {
        this.emptySquares = [];
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 4; j++) {
                if(!this.gameBoard[i][j]) this.emptySquares.push({x: i, y: j});
            }
        }
        randomIndex = Math.floor(Math.random()*this.emptySquares.length);
        newSquare = this.emptySquares[randomIndex];
        this.gameBoard[newSquare.x][newSquare.y] = (Math.random() > 0.9)? 4 : 2;
        this.emptySquares.splice(randomIndex, 1);
        console.log("emptysquares: " + this.emptySquares.length);
    },
    showCurrentGame() {
        document.getElementById("moves").innerHTML = "Moves: " + this.numOfMoves;
        document.getElementById("score").innerHTML = "Score: " + this.score;
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 4; j++) {
                document.getElementById(i+"x"+j).innerHTML = this.gameBoard[i][j] ? this.gameBoard[i][j] : "";
            }
        }
    },
    initiateGame() {
        this.gameBoard = [[0, 0, 0, 0], 
                          [0, 0, 0, 0], 
                          [0, 0, 0, 0], 
                          [0, 0, 0, 0]];
        this.numOfMoves = 0;
        this.score = 0;
        this.gameState = State.PLAYING;
        this.createNewNumber();
        this.showCurrentGame();
        document.getElementById("grid").style.opacity = "1.0";
        document.getElementById("win").style.visibility = "hidden";
        document.getElementById("gameover").style.visibility = "hidden";
    },
    transpose(board) {
        return board[0].map((elementOf0thRow, index) => board.map(row => row[index]));
    },
    symmetricTransform(board) {
        return board.map((row, index) => row.map((element, index, arr) => arr[arr.length - 1 - index]));
    },
    convertBoard(keycode, board) {
        tempBoard = JSON.parse(JSON.stringify(board));
        if(!(keycode%2)) tempBoard = this.transpose(board);
        if(keycode > 38) tempBoard = this.symmetricTransform(tempBoard);
        return tempBoard;
    },
    recoverBoard(keycode, board) {
        tempBoard = JSON.parse(JSON.stringify(board));
        if(keycode > 38) tempBoard = this.symmetricTransform(tempBoard);
        if(!(keycode%2)) tempBoard = this.transpose(tempBoard);
        return tempBoard;
    },
    pushLeft(board) {
        // push
        for(i = 0; i < 4; i++) {
            initZeroFlag = false;
            initZero = -1;
            for(j = 0; j < 4; j++) {
                if(!board[i][j] && !initZeroFlag) {
                    initZeroFlag = true;
                    initZero = j;
                } else if(board[i][j] && initZeroFlag) {
                    initZeroFlag = false;
                    board[i][initZero] = board[i][j];
                    board[i][j] = 0;
                    j = initZero;
                }
            }
        }
        return board;
    },
    mergeLeft(board) {
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 3; j++) {
                if(board[i][j] === board[i][j+1]) {
                    this.score += 2*board[i][j];
                    board[i][j] *= 2;
                    board[i][j+1] = 0;
                }
            }
        }
        return board;
    },
    moveLeft(board) {
        return this.pushLeft(this.mergeLeft(this.pushLeft(board)));
    },
    checkSameSquares() {
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 3; j++) {
                if(this.gameBoard[i][j] === this.gameBoard[i][j+1] || this.gameBoard[j][i] === this.gameBoard[j+1][i]) return true;
            }
        }
        return false;
    },
    examineState() {
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 4; j++) {
                if(this.gameState === State.PLAYING && this.gameBoard[i][j] === 2048) {
                    this.gameState = State.WIN;
                    document.getElementById("grid").style.opacity = "0.2";
                    document.getElementById("win").style.visibility = "visible";
                    return;
                }
            }
        }
        if(!this.emptySquares.length && !this.checkSameSquares()) {
            this.gameState = State.GAMEOVER;
            document.getElementById("grid").style.opacity = "0.2";
            document.getElementById("gameover").style.visibility = "visible";
        }
    },
    setInfiniteMode() {
        document.getElementById("grid").style.opacity = "1.0";
        document.getElementById("win").style.visibility = "hidden";
        this.gameState = State.INFINITE;
        return;
    }
}

function playGame(direction) {
    if(game.gameState === State.PLAYING || game.gameState === State.INFINITE) {
        newBoard = game.recoverBoard(direction, game.moveLeft(game.convertBoard(direction, game.gameBoard)));
        if(JSON.stringify(game.gameBoard) !== JSON.stringify(newBoard)) {
            game.numOfMoves++;
            game.gameBoard = newBoard;
            game.createNewNumber();
            game.showCurrentGame();
            game.examineState();
        }
    }
}
function resetGame() {
    game.initiateGame();
}
function continueGame() {
    game.setInfiniteMode();
}

game.initiateGame();
window.onkeyup = evt => {
    evt.preventDefault();
    dir = evt.keyCode;
    playGame(dir);
}
window.onkeydown = () => {
    event.preventDefault();
}

document.getElementById('contentWrapper').addEventListener('touchstart', evt => {
    evt.preventDefault();
    touchStart = evt.targetTouches[0];
})

document.getElementById('contentWrapper').addEventListener('touchmove', evt => {
    evt.preventDefault();
    touchEnd = evt.targetTouches[0];
})

document.getElementById('contentWrapper').addEventListener('touchend', evt => {
    evt.preventDefault();
    dir = undefined;
    deltaX = touchEnd.clientX - touchStart.clientX;
    deltaY = touchEnd.clientY - touchStart.clientY;
    if(Math.abs(deltaX) > 2* Math.abs(deltaY)) {
        if(deltaX > 0) dir = Keycode.RIGHT;
        else dir = Keycode.LEFT;
    } else if(Math.abs(deltaY) > 2* Math.abs(deltaX)) {
        if(deltaY > 0) dir = Keycode.DOWN;
        else dir = Keycode.UP;
    }
    if(dir) playGame(dir);
})