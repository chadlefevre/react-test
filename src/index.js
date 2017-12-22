import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    renderColHeader() {
        return (
          <div className="board-col-header">
              <label className="boardLabel"></label>
              <label className="boardLabel">C1</label>
              <label className="boardLabel">C2</label>
              <label className="boardLabel">C3</label>
          </div>
        );
    }

    renderRow(i) {
        var row = [];
        for(let j=0; j<3;j++) { //rows
            row.push(this.renderSquare(3*i+j));
        }
        return (
          <div>
          <label className="boardLabel">R{i+1}</label>
          {row}
          </div>
        );
    }

    renderBody() {
        var col = [];
        for(let i=0;i<3;i++)
        {
            col.push(this.renderRow(i));
        }
        return (
            <div>{col}</div>
        );
    }


    render() {
      return (
        <div>
            {this.renderColHeader()}
            {this.renderBody()}
        </div>

        );
    }
    
  }
  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
            history: [{
                squares: Array(9).fill(null), 
                moveIndex: null,
            }],
            stepNumber: 0,
            xIsNext: true,
          };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveIndex: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        //const label = history
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move?
                'Go to move #' + move + " (C" + ((history[move].moveIndex%3)+1) + ", R" + (Math.floor(history[move].moveIndex/3)+1) +")":
                'Go to game start';
            const labelStyle = (this.state.stepNumber === move)?{fontWeight: 'bold'}:{};
            return (
                <li key={move}>
                    <button style={labelStyle} onClick={() => this.jumpTo(move)}> {desc} </button>
                </li>
            );
        });

        let status, statusFormat;
        if (winner) {
            statusFormat = { fontWeight: 'bold', fontSize: '24px'};
            status = 'Winner: ' + winner;
        } else {
            statusFormat = {};
            status = 'Next player: ' + (this.state.xIsNext?'X':'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div style={statusFormat}>{status}</div>
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
  
  function calculateWinner(squares) {
      const lines = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6],
      ];
      for(let i=0; i<lines.length; i++) {
          const [a,b,c] = lines[i];
          if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
          }
      }
      return null;
  }