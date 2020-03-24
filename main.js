console.log('Welcome to 2048!')

let field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let numOfMoves = 0;
let score = 0;

function initiate() {
    field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    numOfMoves = 0;
    score = 0;
    newNumber();
    updateGrid();
}

function keyCodetoinput(keyCode) {
    if(keyCode === 38) {
        return 0;
    } else if(keyCode === 40) {
        return 1;
    } else if(keyCode === 37) {
        return 2;
    } else if(keyCode === 39) {
        return 3;
    } else {
        console.log("invalid keyCode: " + keyCode);
        return;
    }
}

function newNumber() {
    let emptySquares = [];
    let isFour = (Math.random() > 0.9);

    for(let r = 0; r < 4; r++)
        for(let c = 0; c < 4; c++)
            if(!field[r][c]) emptySquares.push([r, c]);
    
    let newSquare = emptySquares[Math.floor(emptySquares.length*Math.random())];
    field[newSquare[0]][newSquare[1]] = isFour ? 4 : 2;
}

function compress(input) {
    switch(input) {
        case 0:
            for(let j = 0; j < 4; j++) {
                let initZeroFlag = false;
                let initZero = -1;
                for(let i = 0; i < 4; i++) {
                    if(!field[i][j] && !initZeroFlag) {
                        initZeroFlag = true;
                        initZero = i;
                    } else if(field[i][j] && initZeroFlag) {
                        initZeroFlag = false;
                        field[initZero][j] = field[i][j];
                        field[i][j] = 0;
                        i = initZero;
                    }
                }
            }
            break;
        case 1:
            for(let j = 0; j < 4; j++) {
                let initZeroFlag = false;
                let initZero = -1;
                for(let i = 3; i >= 0; i--) {
                    if(!field[i][j] && !initZeroFlag) {
                        initZeroFlag = true;
                        initZero = i;
                    } else if(field[i][j] && initZeroFlag) {
                        initZeroFlag = false;
                        field[initZero][j] = field[i][j];
                        field[i][j] = 0;
                        i = initZero;
                    }
                }
            }
            break;
        case 2:
            for(let i = 0; i < 4; i++) {
                let initZeroFlag = false;
                let initZero = -1;
                for(let j = 0; j < 4; j++) {
                    if(!field[i][j] && !initZeroFlag) {
                        initZeroFlag = true;
                        initZero = j;
                    } else if(field[i][j] && initZeroFlag) {
                        initZeroFlag = false;
                        field[i][initZero] = field[i][j];
                        field[i][j] = 0;
                        j = initZero;
                    }
                }
            }
            break;
        case 3:
            for(let i = 0; i < 4; i++) {
                let initZeroFlag = false;
                let initZero = -1;
                for(let j = 3; j >= 0; j--) {
                    if(!field[i][j] && !initZeroFlag) {
                        initZeroFlag = true;
                        initZero = j;
                    } else if(field[i][j] && initZeroFlag) {
                        initZeroFlag = false;
                        field[i][initZero] = field[i][j];
                        field[i][j] = 0;
                        j = initZero;
                    }
                }
            }
            break;
    }
    
}

function moveAndMerge(input) {
    compress(input);
    if(input === 0 || input === 1 || input === 2 || input === 3) numOfMoves++;
    // Up or Down : Column-wise operation
    if(input === 0 || input === 1) {
        for(let c = 0; c < 4; c++) {
            if(field[3*input][c] === field[input + 1][c]) {
                field[3*input][c] += field[input + 1][c];
                score += field[3*input][c];
                let new1 = 0;
                if(field[-1*input + 2][c] === field[-3*input + 3][c]) {
                    new1 = field[-1*input + 2][c] + field[-3*input + 3][c];
                    score += new1;
                } else new1 = field[-1*input + 2][c];
                let new2 = field[-1*input + 2][c] === field[-3*input + 3][c] ? 0 : field[-3*input + 3][c];
                field[input + 1][c] = new1;
                field[-1*input + 2][c] = new2;
                field[-3*input + 3][c] = 0;
                continue;
            }
            if(field[input + 1][c] === field[-1*input + 2][c]) {
                field[input + 1][c] += field[-1*input + 2][c];
                score += field[input + 1][c];
                field[-1*input + 2][c] = field[-3*input + 3][c];
                field[-3*input + 3][c] = 0;
                continue;
            }
            let new2 = 0;
            if(field[-1*input + 2][c] === field[-3*input + 3][c]) {
                new2 = field[-1*input + 2][c] + field[-3*input + 3][c];
                score += new2;
            } else new2 = field[-1*input + 2][c];
            let new3 = field[-1*input + 2][c] === field[-3*input + 3][c] ? 0 : field[-3*input + 3][c];
            field[-1*input + 2][c] = new2;
            field[-3*input + 3][c] = new3;
        }
    }

    // Left or Right: Row-wise operation
    else if(input === 2 || input === 3) {
        for(let r = 0; r < 4; r++) {
            compress(input, r);
            if(field[r][3*input - 6] === field[r][input - 1]) {
                field[r][3*input - 6] += field[r][input - 1];
                score += field[r][3*input - 6];
                if(field[r][-1*input + 4] === field[r][-3*input + 9]) {
                    new1 = field[r][-1*input + 4] + field[r][-3*input + 9];
                    score += new1;
                } else new1 = field[r][-1*input + 4];
                let new2 = field[r][-1*input + 4] === field[r][-3*input + 9] ? 0 : field[r][-3*input + 9];
                field[r][input - 1] = new1;
                field[r][-1*input + 4] = new2;
                field[r][-3*input + 9] = 0;
                continue;
            }
            if(field[r][input - 1] === field[r][-1*input + 4]) {
                field[r][input - 1] += field[r][-1*input + 4];
                score += field[r][input - 1];
                field[r][-1*input + 4] = field[r][-3*input + 9];
                field[r][-3*input + 9] = 0;
                continue;
            }
            let new2 = 0;
            if(field[r][-1*input + 4] === field[r][-3*input + 9]) {
                new2 = field[r][-1*input + 4] + field[r][-3*input + 9];
                score += new2;
            } else new2 = field[r][-1*input + 4];
            let new3 = field[r][-1*input + 4] === field[r][-3*input + 9] ? 0 : field[r][-3*input + 9];
            field[r][-1*input + 4] = new2;
            field[r][-3*input + 9] = new3;
            compress(input, r);
        }
    }
    else console.log(`Invalid input: ${input}`);
}

function updateGrid() {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            document.getElementById(i+"x"+j).innerHTML = field[i][j] ? field[i][j] : "";
        }
    } 
}

function isupdatable() {
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c < 3; c++) {
            if(field[r][c] === field[r][c+1]) {
                console.log("updatable");
                return true;
            }
        }
    }
    for(let r = 0; r < 3; r++) {
        for(let c = 0; c < 4; c++) {
            if(field[r][c] === field[r+1][c]) {
                console.log("updatable");
                return true;
            }
        }
    }
    console.log("not updatable!");
    return false;
}

function checkHealth() {
    let emptyCount = 0;
    for(let r = 0; r < 4; r++) {
        for(let c = 0; c < 4; c++) {
            if(field[r][c] === 2048) {
                document.getElementById("grid").style.opacity = "0.2";
                document.getElementById("win").style.visibility = "visible";
                console.log("YOU WIN!!");
                return false;
            }
            if(!field[r][c]) emptyCount++;
        }
    }
    if(emptyCount === 0 && !isupdatable()) {
        document.getElementById("grid").style.opacity = "0.2";
        document.getElementById("lose").style.visibility = "visible";
        console.log("YOU LOSE...")
        return false;
    }
    return true;
}

// Initiation
initiate();

// Controller
window.onkeyup = function() {
    let keyboardInput = this.keyCodetoinput(this.event.keyCode);
    if(this.checkHealth() && keyboardInput !== this.undefined) {
        this.moveAndMerge(keyboardInput);
        this.newNumber();
        document.getElementById("moves").innerHTML = "Moves: " + numOfMoves;
        document.getElementById("score").innerHTML = "Score: " + score;
        updateGrid();
        this.checkHealth();
    }
    return;
}