import React from 'react'
import './LevelSelect.css'

class LevelSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currLevel: props.currLevel,
            value: props.currLevel + 1
        }

        console.log(props.numLevels)
    }

    handleChange(e) {
        console.log('change')
        this.setState({value: e.target.value})
        //console.log('change')
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('submit')
        this.props.changeLevel(Number(this.state.value - 1))
        
    }

    static getDerivedStateFromProps(props, state) {
        console.log('gdsfp')
        if(props.currLevel !== state.currLevel) {
            return {
                currLevel: props.currLevel,
                value: props.currLevel + 1
            }
        }
        else return null
    }

    render() {
        return (
            <div className='level-select'>
                <button className='prev-button' onClick={() => this.props.prevLevel()}>&larr;</button>
                
                <form onSubmit={e => this.handleSubmit(e)}>
                    <label>Level</label>
                    <input className='level-field' type='number' max={this.props.numLevels} value={this.state.value} onChange={event => this.handleChange(event)}></input>
                </form>
                    
                <button className='next-button' onClick={() => this.props.nextLevel()}>&rarr;</button>
            </div>
        )
        
    }
}

export default LevelSelect