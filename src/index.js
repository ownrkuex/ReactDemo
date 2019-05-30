import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    // timer只是一个普通字段，不是状态也不是参数
    this.timer = setInterval(() => this.setState({
      time: new Date()
    }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.time.toLocaleTimeString()}</h2>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className={props.highLight ? "square square-highlight" : "square"} onClick={() => props.onClick(props.id)}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square key={i}
        id={i}
        value={this.props.status.squares[i]}
        highLight={this.props.winLoc.includes(i)}
        onClick={this.props.onClick}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push((
        <div className="board-row" key={i}>
          {squares}
        </div>
      ));
    }
    return (<div>{rows}</div>);
  }
}

function History(props) {
  let desc = props.index ? "Go to move #" + props.index : "Go to game start";

  return (
    <li className={props.index === props.currentMove ? "history" : null}>
      <button onClick={() => props.onClick(props.index)}>{desc}</button>
      {props.index > 0 && (<span>{props.move.xIsNext ? 'O' : 'X'}, 列{props.move.locX}, 行{props.move.locY}</span>)}
    </li>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xIsNext: true,
          locX: null,
          locY: null
        }
      ],
      currentMove: 0,
      winInfo: {
        winner: null,
        loc: []
      }
    }

    this.jumpTo = this.jumpTo.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          loc: lines[i]
        };
      }
    }
    return {
      winner: null,
      loc: []
    };
  }

  handleClick(i) {
    let current = this.state.history[this.state.currentMove];
    if (current.squares[i] == null && this.state.winInfo.winner == null) {
      const squares = current.squares.slice();
      squares[i] = current.xIsNext ? 'X' : 'O';
      let newHistory = JSON.parse(JSON.stringify(this.state.history.slice(0, this.state.currentMove + 1)));
      newHistory.push({
        squares: squares,
        xIsNext: !current.xIsNext,
        locX: i % 3,
        locY: Math.floor(i / 3)
      });
      this.setState({
        history: newHistory,
        currentMove: newHistory.length - 1,
        winInfo: this.calculateWinner(squares)
      });
    }
  }

  jumpTo(i) {
    this.setState({
      winInfo: this.calculateWinner(this.state.history[i].squares),
      currentMove: i
    });
  }

  render() {
    let current = this.state.history[this.state.currentMove];
    let info;
    if (this.state.winInfo.winner) {
      info = 'Winner: ' + this.state.winInfo.winner;
    } else {
      info = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    const moves = this.state.history.map((move, index) => (
      <History key={index}
        index={index}
        move={move}
        currentMove={this.state.currentMove}
        onClick={this.jumpTo}
      />
    ));

    return (
      <div className="game">
        <Clock />
        <div className="game-board">
          <Board
            winLoc={this.state.winInfo.loc}
            status={current}
            onClick={this.handleClick}
          />
        </div>
        <div className="game-info">
          <div>{info}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
