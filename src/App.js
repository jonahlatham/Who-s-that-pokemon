import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import swal from 'sweetalert2'

const baseUrl = 'https://pokeapi.co/api/v2/pokemon'

class App extends Component {
  state = {
    pokemonLoop: [],
    selectedPokemon: 0,
    correctAnswer: '',
    showPokemon: false,
    right: 0,
    wrong: 0,
  }
  audio = new Audio('http://www.pokezorworld.com/anime/wav/whosthatpokemon.wav')
  componentDidMount() {
    const dataFrom = [];
    for (let i = 1; i <= 151; i++) {
      dataFrom.push(axios.get(`${baseUrl}/${i}`))
    }
    Promise.all(dataFrom)
      .then((response) => {
        this.setState({
          pokemonLoop: response.map((e, i) => {
            console.log(e.data)
            return e.data
          }),
        })
      })
  }

  handleWho = () => {
    let whoItIs = Math.floor(Math.random(this.state.pokemonLoop.length) * 151)
    this.setState({
      correctAnswer: this.state.pokemonLoop[whoItIs],
      showPokemon: false,
      selectedPokemon: '',
    })
    this.audio.play()
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClick = () => {
    if (!this.state.showPokemon) {
      if (this.state.correctAnswer.id === Number(this.state.selectedPokemon)) {
        swal.fire(
          'Good job!',
          'You are correct!',
          'success'
        )
        this.setState({
          right: this.state.right + 1,
          showPokemon: true,
        })
      } else {
        swal.fire({
          type: 'error',
          title: 'Wrong...',
          text: `It's ${this.state.correctAnswer.name.charAt(0).toUpperCase() + this.state.correctAnswer.name.slice(1).toLowerCase()} moron`,
        })
        this.setState({
          wrong: this.state.wrong + 1,
          showPokemon: true,
        })
      }
    }
  }

  render() {
    let nameOption = this.state.pokemonLoop.sort((a, b) => (a.name > b.name) ? 1 : -1).map((e, i) => {
      return <option value={e.id} key={i}>{e.name}</option>
    })
    const pokemonDisplayed = <img className={!this.state.showPokemon ? 'pokmeonImg' : ''} src={this.state.correctAnswer ? this.state.correctAnswer.sprites.front_default : ''} alt='' />

    return (
      <div className="App">
        <div className='redBox'>
          <div className='yelloBox'>
            <button className='who' onClick={this.handleWho}>Who's That Pokemon</button>
            <br />
            <div className='pokemon'>
              {pokemonDisplayed}
            </div>
            <div className='tally'>
              <select className='dropDown' name='selectedPokemon' onChange={this.handleChange} value={this.state.selectedPokemon}>
                <option value="">Choose your pokemon</option>
                {nameOption}
              </select>
              <button className='submit' onClick={this.handleClick}>Submit</button>
            </div>
          </div>
          <br />
          <div className='tally'>
            <div className='right'>
              Correct
              <br />
              <div className='num'>{this.state.right}</div>
            </div>
            <br />
            <div className='right'>
              Fails
              <br />
              <div className='num'>{this.state.wrong}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App