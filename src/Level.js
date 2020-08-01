import React from 'react'
import Hammer from 'react-hammerjs'

import Tile from './Tile.js'
import LevelSelect from './LevelSelect.js'
import './Level.css'

import Footer from './Footer.js'


class Level extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            levelData: props.levelData,
            numLevels: props.levelData.original.length,
            currLevel: 0,
            level: {
                tiles: props.levelData.original[0].level,
                goalPos: props.levelData.original[0].goalPos,
                playerPos: props.levelData.original[0].playerPos,
                levelWidth: props.levelData.original[0].width,
                levelHeight: props.levelData.original[0].height,
                numMoves: 0,
                gameOver: false,
                gameWon: false
            }
        }
    }

    changeLevel(num) {
        if(num >= this.state.numLevels || num < 0) return

        let newLevel = {
            tiles: this.state.levelData.original[num].level,
            goalPos: this.state.levelData.original[num].goalPos,
            playerPos: this.state.levelData.original[num].playerPos,
            levelWidth: this.state.levelData.original[num].width,
            levelHeight: this.state.levelData.original[num].height,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        }

        this.setState({
            currLevel: num,
            level: newLevel,
            origState: newLevel
        })
    }

    nextLevel() {
        const newLevel = this.state.currLevel + 1
        this.changeLevel(newLevel)
    }

    prevLevel() {
        const newLevel = this.state.currLevel - 1
        this.changeLevel(newLevel)
    }

    resetLevel() {
        this.setState({level: this.state.origState})
    }

    isValidBoxMove(state, boxPos, modifier) {
        if (state.tiles[boxPos + modifier] === ' ' || state.tiles[boxPos + modifier] === '.') {
            return true
        }
        else return false
    }

    isBoxStuck(state, boxPos) {
        
        if ( (state.tiles[boxPos - 1] === '#' || state.tiles[boxPos + 1] === '#') && (state.tiles[boxPos - state.levelWidth] === '#' || state.tiles[boxPos + state.levelWidth] === '#') ) {
            if (state.tiles[boxPos] === '*') return false
            else return true
        }
        else return false
    }

    isGameWon(tiles, goalPos) {
        const result = goalPos.every(pos => tiles[pos] === '*')
        if (result) setTimeout(() => this.nextLevel(), 2000)
        return result
    }

    move(state, modifier) {
        let newState = {...state}
        const currTile = state.tiles[state.playerPos]
        const nextPos = state.playerPos + modifier
        const nextTile = state.tiles[nextPos]

        if(nextTile === '#') return

        let newTiles = [...state.tiles]
        
        if(nextTile === ' ') {
            newTiles[nextPos] = '@'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            newState.tiles = newTiles
            newState.playerPos = state.playerPos + modifier
            newState.numMoves = state.numMoves + 1

            return {
                level: newState
            }
        }

        else if(nextTile === '.') {
            newTiles[nextPos] = '+'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            newState.tiles = newTiles
            newState.playerPos = state.playerPos + modifier
            newState.numMoves = state.numMoves + 1

            return {
                level: newState
            }
        }
        
        else if ((nextTile === '$' || nextTile === '*') && this.isValidBoxMove(state, state.playerPos + modifier, modifier)) {
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            if (nextTile === '$') newTiles[state.playerPos + modifier] = '@'
            else if (nextTile === '*') newTiles[state.playerPos + modifier] = '+'

            const nextBoxPos = state.playerPos + modifier + modifier
            const nextBoxTile = newTiles[nextBoxPos]

            if(nextBoxTile === ' ') {
                newTiles[nextBoxPos] = '$'

            }
            else if (nextBoxTile === '.') {
                newTiles[nextBoxPos] = '*'
            }
            let newState =  {
                tiles: newTiles,
                goalPos: state.goalPos,
                playerPos: state.playerPos + modifier,
                levelWidth: state.levelWidth,
                levelHeight: state.levelHeight,
                numMoves: state.numMoves + 1,
                gameWon: this.isGameWon(newTiles, state.goalPos)
            }

            newState.gameOver = this.isBoxStuck(newState, nextBoxPos)
            return {level: newState}
        }
    }

    moveRight(state) {
        return this.move(state, 1)
    }

    moveLeft(state) {
        return this.move(state, -1)
    }

    moveUp(state) {
        console.log(state.levelWidth)
        return this.move(state, -state.levelWidth)
    }

    moveDown(state) {
        return this.move(state, state.levelWidth)
    }

    handleKeyDown(e) {
        if (!this.state.level.gameOver && !this.state.level.gameWon) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.setState(prevState => this.moveRight(prevState.level))
            }
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.setState(prevState => this.moveLeft(prevState.level))
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.setState(prevState => this.moveUp(prevState.level))
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.setState(prevState => this.moveDown(prevState.level))
            }
        }

        if(e.key === 'r' || e.key === 'R') {
            this.resetLevel()
        }

        if(e.key === 'e') {
            this.nextLevel()
        }

        if(e.key === 'q') {
            this.prevLevel()
        }
    }

    handleSwipe(e) {
        if (e.direction === 2) { //left swipe
            this.setState(prevState => this.moveLeft(prevState.level))
        }

        if (e.direction === 4) { //right swipe
            this.setState(prevState => this.moveRight(prevState.level))
        }

        if (e.direction === 8) { //up swipe
            this.setState(prevState => this.moveUp(prevState.level))
        }

        if (e.direction === 16) { //down swipe
            this.setState(prevState => this.moveDown(prevState.level))
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.setState({origState: {...this.state.level}})
        
    }

    render() {
        const newTiles = this.state.level.tiles.map((tile, index) => {
            return <Tile key={index} tileType={tile} levelWidth={this.state.level.levelWidth} levelHeight={this.state.level.levelHeight}/>
        })
        console.log(this.state.levelWidth);
        document.documentElement.style.setProperty('--level-width', this.state.level.levelWidth)
        document.documentElement.style.setProperty('--level-height', this.state.level.levelHeight)

        return (
            <div className='page-container'>
                <header>
                    <p>Sokoban</p>
                </header>

                <div className='game-container'>
                    {/*Stat container and level select*/}
                    <div className='stat-container'>
                        <p>Moves: {this.state.level.numMoves}</p>
                        <LevelSelect currLevel={this.state.currLevel} 
                                        numLevels={this.state.numLevels} 
                                        changeLevel={this.changeLevel.bind(this)} 
                                        nextLevel={this.nextLevel.bind(this)} 
                                        prevLevel={this.prevLevel.bind(this)}
                        />
                        <button className='reset' onClick={() => this.resetLevel()}>Reset</button>
                        {this.state.level.gameOver ? <p className='game-over'>Game Over, Press "Reset" to try again.</p> : null}
                        {this.state.level.gameWon ? <p className='game-won'>Level Complete!</p> : null}
                    </div>

                    {/*Game board*/}
                    <Hammer onSwipe={event => this.handleSwipe(event)} direction='DIRECTION_ALL'>
                        <div className='level-container'>
                            <div className='level-grid'>
                                {newTiles}
                            </div>
                        </div>
                            
                    </Hammer>

                    
                    
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
}

export default Level