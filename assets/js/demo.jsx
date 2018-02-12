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
    this.state = {
      cards: [],
      gameState: gameStatesType.WFC,
      firstCard: null,
      secondCard: null,
      flag: 0,
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
     percent:msg.game.percent,
     flag:msg.game.flag}
     );
    if(this.state.flag == 2 ){
     this.channel.push("unflipfn",{}).receive("ok",this.gotView.bind(this));      
    }
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



  reset() {
    this.setState({
      cards: [],
      gameState: gameStatesType.WFC,
      firstCard: null,
      flag: 0,
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

