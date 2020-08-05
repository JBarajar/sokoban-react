import React, {useState, useEffect} from 'react'
import Hammer from 'react-hammerjs'
import TileBoard from './TileBoard/TileBoard.js'
import LevelSelect from './LevelSelect.js'
import './Level.css'

import Footer from './Footer.js'

import * as data from './levels'

function Level() {
    const [levelSet, changeLevelSet] = useState({
        levels: data.original,
        total: data.original.length
    })
    const [level, changeLevel] = useState({
        state: levelSet.levels[0].level,
        goals: levelSet.levels[0].goalPos,
        player: levelSet.levels[0].playerPos,
        width: levelSet.levels[0].width,
        height: levelSet.levels[0].height,
        moves: 0,
        gameWin: false,
        gameOver: false
    });
    const [curr, changeCurr] = useState(0);

    function setLevel(num) {
        if(num < 0 || num >= levelSet.total) return;
        changeLevel({
            state: levelSet.levels[num].level,
            goals: levelSet.levels[num].goalPos,
            player: levelSet.levels[num].playerPos,
            width: levelSet.levels[num].width,
            height: levelSet.levels[num].height,
            moves: 0,
            gameWin: false,
            gameOver: false
        })
        changeCurr(num);
    }

    function nextLevel() {
        setLevel(curr + 1);
    }

    function prevLevel() {
        setLevel(curr - 1);
    }

    function resetLevel() {
        setLevel(curr);
    }

    function isValidBoxMove(boxPos, mod) {
        let tile = level.state[boxPos + mod];
        if(tile === ' ' || tile === '.') return true;
        else return false;
    }

    function isBoxStuck(state, boxPos) {
        if ((state[boxPos - 1] === '#' || state[boxPos + 1] === '#') && 
            (state[boxPos - level.width] === '#' || state[boxPos + level.width] === '#') &&
            (state[boxPos] !== '*')) { console.log('stuck'); return true;  }
        else return false;
    }

    function isGameWon(state) {
        const result = level.goals.every(pos => state[pos] === '*');
        if(result) setTimeout(() => nextLevel(), 3000);
        return result;
    }

    function move(mod) {
        let newLevel = {};
        let newState = [...level.state];
        const pos = level.player; //current player position
        const newPos = level.player + mod;
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
                gameWin: isGameWon(newState),
                gameOver: isBoxStuck(newState, newBoxPos)
            }

            if(isGameWon(newState)) console.log('won');
            if(isBoxStuck(newState, newBoxPos)) console.log('lost')
            
        }

        else return; //exit on unknown symbol


        newLevel = {
            ...level,
            ...newLevel,
            state: newState,
            player: newPos,
            moves: level.moves + 1
        }
        changeLevel(newLevel);
        
        
    }

    function moveRight() {
        move(1);
    }
    function moveLeft() {
        move(-1);
    }
    function moveDown() {
        move(level.width);
    }
    function moveUp() {
        move(-level.width);
    }

    function handleKeyDown(e) {
        if(e.repeat) return;
        if(!level.gameOver && !level.gameWin) {
            switch(e.key) {
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowUp':
                    moveUp();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
            }
        }

        switch(e.key) {
            case 'r':
                resetLevel();
                break;
            case 'e':
                nextLevel();
                break;
            case 'q':
                prevLevel();
                break;
        }
    }

    function handleSwipe(e) {
        if (e.direction === 2) { //left swipe
            moveLeft();
        }

        if (e.direction === 4) { //right swipe
            moveRight();
        }

        if (e.direction === 8) { //up swipe
            moveUp();
        }

        if (e.direction === 16) { //down swipe
            moveDown();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    })

    return (
        <div className='page-container'>

            <div className='game-container'>

                <div className='stat-container'>
                    <p className='move-counter'>Moves: {level.moves}</p>
                    <LevelSelect className='level-select' 
                                    currLevel={curr} 
                                    numLevels={levelSet.total} 
                                    changeLevel={setLevel} 
                                    nextLevel={nextLevel} 
                                    prevLevel={prevLevel}
                    />
                    <button className='reset' onClick={resetLevel}>Reset</button>
                </div>

                {level.gameOver ? <p className='game-over'>Game Over! Press "Reset" to try again.</p> : null}
                {level.gameWin ? <p className='game-won'>Level Complete!</p> : null}

                {/*Game board*/}
                <Hammer onSwipe={handleSwipe} direction='DIRECTION_ALL'>
                    <div className='level-container'>
                        <TileBoard state={level.state} width={level.width} height={level.height} />
                    </div>
                </Hammer> 

                <header>
                    <p>Sokoban</p>
                </header>

                <div className='desc-container'>
                    Objective: Push all the boxes into the goals<br/><br/>
                    Controls<br/>
                    Move: Arrow Keys or Swipe<br/>
                    Restart: R<br/><br/>
                </div>
                
            </div>

            <Footer />
        </div>
    )
}

export default Level