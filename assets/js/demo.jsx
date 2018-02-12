import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Progress } from 'reactstrap';
import { Table } from 'reactstrap';

export default function run_demo(root,channel) {
  ReactDOM.render( < Layout width = {
    4
  }
  height = {
    4
  }
  str = {
    "AABBCCDDEEFFGGHH"
  }
  channel={channel}
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
    return <div className ={ !this.props.card.flipped?"card":((this.props.card.colstate==1)?"cardReveal":"cardFlip")} >
      <span><div className = "middlefont"> {
        this.props.card.flipped ? this.props.card.cardValue:" "}</div></span> </div >
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
    this.channel = props.channel;
    this.onedtotwod = this.onedtotwod.bind(this);
    this.channel.join()
  .receive("ok", this.gotView.bind(this))
  .receive("error", resp => { console.log("Unable to join, failed", resp); });

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
          colstate:0
        };
      }
    }

    this.state = {
      cards: [],
      gameState: gameStatesType.WFC,
      firstCard: null,
      secondCard: 0,
      count: 0,
      score: -5,
      percent:0,
      height:props.height,
      width:props.width,
      str:props.str
    };
  }

  gotView(msg){
    console.log("Got View",msg);
    this.setState({cards: this.onedtotwod(msg.game.cards), 
      score: msg.game.score,
     count: msg.game.count,
     percent:msg.game.percent});
  }

  onedtotwod(arrayinp){
    var cards1 = createArray(4,4);
    var k = 0;
   for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      cards1[i][j] = arrayinp[k];
      k++;
    }    
  }
  return cards1
}

  cardClick(card,rowindex,cardIndex) {
    if (!card.flipped && this.state.secondCard == 0) {
      switch (this.state.gameState) {
        case gameStatesType.WFC:
          this.state.cards[rowindex][cardIndex].flipped = true;
          this.state.cards[rowindex][cardIndex].colstate = 0;
          this.setState({
            cards: this.state.cards,
            firstCard: {card: card, row: rowindex, col: cardIndex},
            gameState: gameStatesType.WSC,
            count: this.state.count + 1,
            secondCard: 0
          });
          break;

        case gameStatesType.WSC:
          this.state.cards[rowindex][cardIndex].flipped = true;
          this.setState({
            cards: this.state.cards,
            secondCard: 2
          });
          if (this.state.firstCard.card.cardValue == card.cardValue) {
               this.state.cards[this.state.firstCard.row][this.state.firstCard.col].colstate = 1;
               this.state.score = this.state.score + 25 +  this.state.count;
              this.state.cards[rowindex][cardIndex].colstate = 1;
              var countFlipped = 0 ;
                for (var i = 0; i < this.state.height; i++) {
                  for (var j = 0; j < this.state.width; j++) {
                    if(this.state.cards[i][j].flipped){
                    countFlipped++;
                    } 
                  }
                }
          var per = ((countFlipped/(this.state.width*this.state.height))*100);

                    this.setState({
              gameState: gameStatesType.WFC,
              cards: this.state.cards,
              count: this.state.count + 1,
              score: this.state.score,
              secondCard: 0,
              percent:per
            });
          } else {
            setTimeout(function() {
            
              this.state.score = this.state.score - 5 -  this.state.count;
            
                this.state.cards[this.state.firstCard.row][this.state.firstCard.col].colstate = 0;
              this.state.cards[rowindex][cardIndex].colstate = 0;
              this.state.cards[this.state.firstCard.row][this.state.firstCard.col].flipped = false;
              this.state.cards[rowindex][cardIndex].flipped = false;
              this.setState({
                gameState: gameStatesType.WFC,
                count: this.state.count + 1,
                cards: this.state.cards,
                secondCard: 0,
                score: this.state.score
              });
            }.bind(this), 500);
          }
          break;
      }
    }
  }

  reset() {
    this.setState({
      cards: [],
      gameState: gameStatesType.WFC,
      firstCard: null,
      secondCard: 0,
      count: 0,
      score: 0,
      percent:0
    });
    this.channel.push("resetfn",{}).receive("ok",this.gotView.bind(this))
  }

  serverClickHandle(card,i,j){
    this.channel.push("handleclickfn",{i: i, j: j})
    .receive("ok",this.gotView.bind(this))
  }


  render() {
    const cardsRendered = this.state.cards.map((rowOfCards, rowindex) => < tr > {
          rowOfCards.map((card, cardIndex) => < td onClick = {
              () => this.serverClickHandle(card,rowindex,cardIndex)
            } > < Card card = {
              card
            }
            /></td > )
        } < /tr>);
       
       
       return <div > 
  < table class="table table-dark">
   < tbody >
    < tr >
    < td > {  cardsRendered   }  < /td> 
    < /tr > < /tbody>
     < /table >
       < div > <p id="clicks">Number of Clicks: <b>{this.state.count}</b>&nbsp;&nbsp;||&nbsp;&nbsp;Score:  <b> {this.state.score} </b></p> < /div >
    <div class="progressBar">
        <Progress color="success" value={this.state.percent}>{this.state.percent}</Progress></div>   <p>&nbsp;</p>
      < button class="btn btn-success"onClick = {
        this.reset.bind(this)
      } > Reset! < /button>      
       < /div> 

  }
}

