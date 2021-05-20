import React, {useState, useEffect} from 'react';
import SquareBox from './SquareBox';

function findWinner(squares)
{
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
		if (squares[a]!='-' && squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function Game()
{
    const [board, setBoard] = useState(Array(9).fill('-'));
    const [turn,setTurn] =useState('X');
    const [winner,setWinner] =useState('');
    const [game,setGame] =useState('');
    const [nowinner,setNowinner] =useState(false);

    useEffect(()=>{ // each time check so if all box filled and no winner
        console.log('effect');
        var n = board.includes("-");
        if(n===false && winner==''){
        setNowinner(true);
        setGame('');
        }
    },[board]);
    
    const onClick = (val) =>{
        if(board[val]=='-' && game=='Start'){// only blank box ( ) we click
        const clickedBy=(turn==='X')?'0':'X';
         setTurn(clickedBy); // to manage each user turn
         const boardCopy = [...board];
         boardCopy[val] =clickedBy;
         setBoard(boardCopy); // save each box value filled by user

          const win=findWinner(boardCopy);
          if(win){
          setWinner(win);
          setGame('');
          }
        }
    }
    return (
        <>
        <div>
	<SquareBox value={board[0]} onClick={() => onClick(0)} />
	<SquareBox value={board[1]} onClick={() => onClick(1)} />
	<SquareBox value={board[2]} onClick={() => onClick(2)} />
    </div>
    <div>
	<SquareBox value={board[3]} onClick={() => onClick(3)} />
	<SquareBox value={board[4]} onClick={() => onClick(4)} />
	<SquareBox value={board[5]} onClick={() => onClick(5)} />
    </div>
    <div>
	<SquareBox value={board[6]} onClick={() => onClick(6)} />
	<SquareBox value={board[7]} onClick={() => onClick(7)} />
	<SquareBox value={board[8]} onClick={() => onClick(8)} />
</div>
  <div style={{display: (!winner && game)?'block':'none'}}>Please click blank box by user {(turn==='X')?'0':'X'}</div>
  <div style={{color:"green", display: winner?'block':'none'}}>Winner is User {winner}</div>
  <div style={{color:"red", display: nowinner?'block':'none'}}>No User is winner</div>
  <div style={{display: (!game)?'block':'none'}}><button onClick={()=>{ setGame('Start'); setWinner(''); setNowinner(false); setBoard(Array(9).fill('-')); }}>Start Game</button></div>
        </>
    )
}

export default Game;