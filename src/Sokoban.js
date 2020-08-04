function Sokoban() {
    let levelSet = {};
    let level = {};
    let curr = 0; //current level index

    function fetchSet(filename) {
        fetch(filename)
            .then(res => res.text())
            .then(text => {
                return JSON.parse(text);
            })
    }

    function setLevel(data) {
        return ({
            state: data.level,
            goals: data.goalPos,
            player: data.playerPos,
            width: data.width,
            height: data.height,
            moves: 0,
            gameOver: false,
            gameWin: false
        })
    }

    function isValidBoxMove(boxPos, mod) {
        let tile = level.state[boxPos + mod];
        if(tile === ' ' || tile === '.') return true;
        else return false;
    }

    function isBoxStuck(boxPos) {
        let state = level.state;
        if ((state[boxPos - 1] === '#' || state[boxPos + 1] === '#') && 
            (state[boxPos - level.width] === '#' || state[boxPos + level.width] === '#') &&
            (state[boxPos] !== '*')) return true;
        else return false;
    }

    function isGameWon() {
        const result = level.goals.every(pos => level.state[pos] === '*');
        if(result) setTimeout(() => this.nextLevel(), 3000);
        return result;
    }

    function move(mod) {
        let newLevel = {};
        let newState = {...level.state};
        const pos = level.playerPos; //current player position
        const newPos = level.playerPos + mod;
        if(newPos < 0 || newPos > level.state.length) return;
        const tile = newState[pos]; //current tile type player is on
        const newTile = newState[newPos]

        if(newTile === '#') return;

        else if(newTile === ' ') {
            newState[newPos] = '@';
            newState[pos] = (tile === '@' ? ' ' : '.');
        }

        else if(newTile === '.') {
            newState[newPos] = '+';
            newState[pos] = (tile === '@' ? ' ' : '.');
        }

        // '$' and '*'
        else if((newTile === '$' || newTile ==='*') && isValidBoxMove(newPos, mod)) {
            newState[pos] = (tile === '@' ? ' ' : '.');
            newState[newPos] = (newTile === '$' ? '@' : '+');

            const newBoxPos = newPos + mod;
            const newBoxTile = newState[newBoxPos];
            newState[newBoxPos] = (newBoxTile === ' ' ? '$' : '*');

            newLevel = {
                gameWin: isGameWon(),
                gameOver: isBoxStuck(newBoxPos)
            }
        }

        else return; //exit on unknown symbol

        newLevel = {
            ...level,
            ...newLevel,
            state: newState,
            player: newPos,
            moves: level.moves + 1
        }

        return newLevel;
    }

    this.moveRight() {
        level = move(1);
    }

    this.moveLeft() {
        level = move(-1);
    }

    this.moveDown() {
        level = move(level.width)l
    }

    this.moveUp() {
        level = move(-level.width);
    }

    this.loadLevelSet = function(filename) {
        let set  = fetchSet(filename);
        levelSet = {
            levels: set,
            total: set.original.length,
        }
        curr = 0;
        level = setLevel(set.original[curr]);
    }

    this.changeLevel = function(num) {
        if(num >= levelSet.total || num < 0) return;
        curr = num;
        level = setLevel(levelSet.levels.original[curr])
    }

    this.nextLevel = function() {
        if(curr < levelSet.total - 1) this.changeLevel(curr + 1);
    }

    this.prevLevel = function() {
        if(curr > 0) this.changeLevel(curr - 1);
    }

    this.resetLevel = function() {
        this.changeLevel(curr);
    }
}

export default Sokoban;