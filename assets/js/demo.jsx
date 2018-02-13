import React from "react";
import ReactDOM from "react-dom";
import { Button } from "reactstrap";
import { Progress } from "reactstrap";
import { Table } from "reactstrap";

export default function run_demo(root, channel) {
  ReactDOM.render(<Layout channel={channel} />, root);
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.channel
      .join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => {
      console.log("Unable to join, failed", resp);
    });

    this.state = {
      cards: [],
      gameState: 0,
      firstCard: null,
      secondCard: null,
      flag: 0,
      count: 0,
      score: -5,
      percent: 0,
      height: 0,
      width: 0,
      str: 0
    };
  }

  gotView(msg) {
    console.log("Got View", msg);
    this.setState(msg.game);
    if (this.state.flag == 2) {
      this.channel.push("unflipfn", {}).receive("ok", this.gotView.bind(this));
    }
   
    if ((this.state.width * this.state.height) % 2 == 1) {
      alert("Number of Cards is Odd");
    }
    if (this.state.width * this.state.height != this.state.str.length) {
      alert(
        "String should be of the size" + this.state.width * this.state.height
      );
    }
  }

  reset() {
    this.channel.push("resetfn", {}).receive("ok", this.gotView.bind(this));
  }

  serverClickHandle(card, i, j) {
    this.channel
      .push("handleclickfn", { i: i, j: j })
      .receive("ok", this.gotView.bind(this));
       if (this.state.percent == 100) {
      alert("Game Complete, Click Reset Game to start new Game.")
    }
  }

  render() {
    let cardsRendered = this.state.cards.map((cardrow, rowindex) => (
      <table key={rowindex}>
        <tbody>
          <tr key={rowindex}>
            {cardrow.map((card, i) => (
              <td
                key={i}
                onClick={() => this.serverClickHandle(card, rowindex, i)}
                >
                <div
                  className={
                    !card.flipped
                      ? "card"
                    : card.colstate == 1 ? "cardReveal" : "cardFlip"
                  }
                  >
                  <div className="middlefont">
                    {card.flipped ? card.cardValue : " "}
                  </div>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    ));

    return (
      <div>
        <table className="table table-dark" key={2}>
          <tbody>
            <tr>
              <td> {cardsRendered} </td>
            </tr>
          </tbody>
        </table>
        <div>
          <p id="clicks">
            Number of Clicks: <b>{this.state.count}</b>&nbsp;&nbsp;||&nbsp;&nbsp;Score:{" "}
            <b> {this.state.score} </b>
          </p>
        </div>
        <div className="progressBar">
          <Progress color="success" value={this.state.percent}>
            {this.state.percent}
          </Progress>
        </div>
        <p>&nbsp;</p>
        <button className="btn btn-success" onClick={this.reset.bind(this)}>
          Reset!
        </button>
      </div>
    );
  }
}
