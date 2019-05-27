import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick(props.id)}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        id={i}
        value={this.props.status.squares[i]}
        onClick={i => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
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
      winner: null,
      currentMove: 0
    }
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
        return squares[a];
      }
    }
    return null;
  }

  handleClick(i) {
    let current = this.state.history[this.state.currentMove];
    if (current.squares[i] == null && this.state.winner == null) {
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
        winner: this.calculateWinner(squares),
        currentMove: newHistory.length - 1
      });
    }
  }

  jumpTo(i) {
    this.setState({
      winner: this.calculateWinner(this.state.history[i].squares),
      currentMove: i
    });
  }

  render() {
    let current = this.state.history[this.state.currentMove];
    let info;
    if (this.state.winner) {
      info = 'Winner: ' + this.state.winner;
    } else {
      info = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    const moves = this.state.history.map((move, index) => (
      <History key={index}
        index={index}
        move={move}
        currentMove={this.state.currentMove}
        onClick={index => this.jumpTo(index)}
      />
    ));

    return (
      <div className="game">
        <div className="game-board">
          <Board
            status={current}
            onClick={i => this.handleClick(i)}
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
