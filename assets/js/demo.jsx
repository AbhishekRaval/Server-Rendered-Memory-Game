import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render( < Layout width = {
    4
  }
  height = {
    4
  }
  str = {
    "AABBCCDDEEFFGGHH"
  }
  />, root);
}

const gameStatesType = {
  WFC: "WAITING_FIRST_CARD",
  WSC: "WAITING_SECOND_CARD",
  WRONG: "WRONG",
  TIMEOUT: "TIMEOUT"
};

class Card extends React.Component {
  render() {
    return <div className = "card" >
      < span > {
        this.props.card.flipped ? this.props.card.cardValue : "#"
      } < /span> < /div >
  }
}



function delay(ms) {
  var cur_d = new Date();
  var cur_ticks = cur_d.getTime();
  var ms_passed = 0;
  while (ms_passed < ms) {
    var d = new Date(); // Possible memory leak?
    var ticks = d.getTime();
    ms_passed = ticks - cur_ticks;
    // d = null;  // Prevent memory leak?
  }
}


function generateStringArray(str) {
  var arr = new Array(16);
  for (var i = 0; i < str.length; i++) {
    arr[i] = str.charAt(i);
  }
  arr = shuffle(arr);
  return arr;
}

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}



class Layout extends React.Component {
  constructor(props) {
    super(props);
    if (props.width * props.height % 2 == 1) {
      alert("Number of Cards is Odd");
    }
    if (props.width * props.height != props.str.length) {
      alert("String should be of the size" + props.width * props.height)
    }
    var cards = createArray(props.height, props.width);
    var possArray = generateStringArray(props.str);
    for (var i = 0; i < props.height; i++) {
      for (var j = 0; j < props.width; j++) {
        cards[i][j] = {
          cardValue: possArray[i * props.width + j],
          flipped: false,
          i: i,
          j: j
        };
      }
    }

    this.state = {
      cards: cards,
      gameState: gameStatesType.WFC,
      firstCard: null,
      secondCard: 0,
      count: 0,
      score: 0
    };
  }

  cardClick(card) {
    if (!card.flipped && this.state.secondCard == 0) {
      switch (this.state.gameState) {
        case gameStatesType.WFC:
          this.state.cards[card.i][card.j].flipped = true;
          this.setState({
            cards: this.state.cards,
            firstCard: card,
            gameState: gameStatesType.WSC,
            count: this.state.count + 1,
            secondCard: 0
          });
          break;

        case gameStatesType.WSC:
          this.state.cards[card.i][card.j].flipped = true;
          this.setState({
            cards: this.state.cards,
            secondCard: 2
          });
          if (this.state.firstCard.cardValue == card.cardValue) {
            this.setState({
              gameState: gameStatesType.WFC,
              cards: this.state.cards,
              count: this.state.count + 1,
              score: this.state.score + 25,
              secondCard: 0
            });
          } else {
            setTimeout(function() {
            	if(this.state.score>5)
              {
              this.state.score = this.state.score-5;
              }
              else{
              this.state.score=0;
              }
              this.state.cards[this.state.firstCard.i][this.state.firstCard.j].flipped = false;
              this.state.cards[card.i][card.j].flipped = false;
              this.setState({
                gameState: gameStatesType.WFC,
                count: this.state.count + 1,
                cards: this.state.cards,
                secondCard: 0,
                score: this.state.score
              });
            }.bind(this), 1000);
          }
          break;
      }
    }
  }

  reset() {
    var height = 4;
    var width = 4;
    var strng = "AABBCCDDEEFFGGHH";
    var cards = createArray(height, width);
    var possArray = generateStringArray(strng);
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        cards[i][j] = {
          cardValue: possArray[i * width + j],
          flipped: false,
          i: i,
          j: j
        };
      }
    }
    this.setState({
      cards: cards,
      gameState: gameStatesType.WFC,
      firstCard: null,
      secondCard: 0,
      count: 0,
      score: 0
    });

  }


  render() {
    const cardsRendered = this.state.cards.map((rowOfCards, rowindex) => < tr > {
          rowOfCards.map((card, cardIndex) => < td onClick = {
              () => this.cardClick(card)
            } > < Card card = {
              card
            }
            /></td > )
        } < /tr>);
       
       
       return <div > 
	< table >
	 < tbody >
	  < tr >
	 	< td > {  cardsRendered   } < /td> 
	 	< /tr > < /tbody>
	 	 < /table >
       < div > <p id="clicks">Number of Clicks: <b>{
          this.state.count
        }</b>     ||    Score:  <b> {this.state.score} </b></p> < /div >
        <div><p> </p></div>
      < button onClick = {
        this.reset.bind(this)
      } > Reset! < /button> < /div> 

  }
}

