import React from 'react'
import './LevelSelect.css'

class LevelSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currLevel: props.currLevel,
            value: props.currLevel + 1
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.changeLevel(Number(this.state.value - 1))
    }

    static getDerivedStateFromProps(props, state) {
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

                <div className='level-field'>
                    <p className='level-label'>Level:</p>
                    <div className='number-box'>
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <input 
                                className='level-input' 
                                type='number' 
                                min='0' 
                                max={this.props.numLevels} 
                                value={this.state.value} 
                                onChange={event => this.handleChange(event)}>
                            </input>
                        </form>
                        <p>/{this.props.numLevels}</p>
                    </div>
                </div>
                    

                
                    
                <button className='next-button' onClick={() => this.props.nextLevel()}> &rarr;</button>
            </div>
        )
        
    }
}

export default LevelSelect