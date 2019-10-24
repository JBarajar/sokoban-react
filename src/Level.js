import React from 'react'
import Hammer from 'react-hammerjs'

import Tile from './Tile.js'
import LevelSelect from './LevelSelect.js'
import './Level.css'

import Footer from './Footer.js'


class Level extends React.Component {
    constructor(props) {
        //console.log(props)
        super(props)
        this.state = {
            levelData: props.levelData,
            numLevels: props.levelData.original.numLevels,
            currLevel: 0,
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

    changeLevel(num) {
        if(num >= this.state.numLevels || num < 0) return
        this.setState({
            currLevel: num,
            tiles: this.state.levelData.original[num].level,
            goalPos: this.state.levelData.original[num].goalPos,
            playerPos: this.state.levelData.original[num].playerPos,
            levelWidth: this.state.levelData.original[num].width,
            levelHeight: this.state.levelData.original[num].height,
            numMoves: 0,
            gameOver: false,
            gameWon: false
        })

        this.setState({origState: {...this.state}})
    }

    nextLevel() {
        const newLevel = this.state.currLevel + 1
        if (newLevel < this.state.numLevels) this.changeLevel(newLevel)
    }

    prevLevel() {
        const newLevel = this.state.currLevel - 1
        if (newLevel >= 0) this.changeLevel(newLevel)
    }

    resetLevel() {
        this.setState(this.state.origState)
        this.setState({origState: {...this.state}})
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
        const currTile = state.tiles[state.playerPos]
        const nextPos = state.playerPos + modifier
        const nextTile = state.tiles[nextPos]

        if(nextTile === '#') return

        let newTiles = [...state.tiles]
        
        if(nextTile === ' ') {
            newTiles[nextPos] = '@'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            return {
                tiles: newTiles,
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1,
            }
        }

        else if(nextTile === '.') {
            newTiles[nextPos] = '+'
            if (currTile === '@') newTiles[state.playerPos] = ' '
            else if (currTile === '+') newTiles[state.playerPos] = '.'

            return {
                tiles: newTiles,
                playerPos: state.playerPos + modifier,
                numMoves: state.numMoves + 1,
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
            return newState
        }
    }

    moveRight(state) {
        return this.move(state, 1)
    }

    moveLeft(state) {
        return this.move(state, -1)
    }

    moveUp(state) {
        return this.move(state, -state.levelWidth)
    }

    moveDown(state) {
        return this.move(state, state.levelWidth)
    }

    handleKeyDown(e) {
        if (!this.state.gameOver && !this.state.gameWon) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.setState(prevState => this.moveRight(prevState))
            }
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.setState(prevState => this.moveLeft(prevState))
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.setState(prevState => this.moveUp(prevState))
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.setState(prevState => this.moveDown(prevState))
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
            console.log('left')
            this.setState(prevState => this.moveLeft(prevState))
        }

        if (e.direction === 4) { //right swipe
            console.log('right')
            this.setState(prevState => this.moveRight(prevState))
        }

        if (e.direction === 8) { //up swipe
            console.log('up')
            this.setState(prevState => this.moveUp(prevState))
        }

        if (e.direction === 16) { //down swipe
            this.setState(prevState => this.moveDown(prevState))
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.setState({origState: {...this.state}})
    }

    render() {
        const newTiles = this.state.tiles.map((tile, index) => {
            return <Tile key={index} tileType={tile} levelWidth={this.state.levelWidth} levelHeight={this.state.levelHeight}/>
        })

        return (
            <div className='page-container'>
                <header>
                    <p>Sokoban</p>
                </header>

                <div className='game-container'>
                    <Hammer onSwipe={event => this.handleSwipe(event)} direction='DIRECTION_ALL'>
                            <div className='level-container'>
                                <div className='padding-box' id='levelContainer'>
                                    {newTiles}
                                </div>
                            </div>
                    </Hammer>

                    
                    <Hammer onSwipe={event => this.handleSwipe(event)} direction='DIRECTION_ALL'>
                        <div className='stat-container'>
                            <p>Moves: {this.state.numMoves}</p>
                            <p>Level: {this.state.currLevel + 1}</p>
                            <LevelSelect currLevel={this.state.currLevel} numLevels={this.state.numLevels} changeLevel={this.changeLevel.bind(this)} nextLevel={this.nextLevel.bind(this)} prevLevel={this.prevLevel.bind(this)}/>
                            {this.state.gameOver ? <p className='game-over'>Game Over, Press "R" to restart.</p> : null}
                            {this.state.gameWon ? <p className='game-won'>Game Won!</p> : null}
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