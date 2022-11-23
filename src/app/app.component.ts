import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'TicTacToe';
  board = [["", "", ""], ["", "", ""], ["", "", ""]]
  player = "x"
  computer = "o"
  playing = true
  gameState = "inProgress"
  ngOnInit() {

  }

  restart(){
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]]
    this.playing = true
    this.gameState = "inProgress"
  }

  tileClick(e: MouseEvent){
    const tile = (e.target as HTMLElement).parentElement!
    if (tile.classList.contains("disabled")) return
    tile.classList.add("disabled")
    const id = tile.id
    const idSplit: any[] = id.split("")
    idSplit.forEach(e => e = Number(e))

    const [x, y] = [...idSplit];
    this.board[x][y] = this.player

    if (!this.isMovesLeft(this.board)){
      this.gameState = "draw"
      this.playing = false
      return;
    }

    const bM = this.findBestMove(this.board)
    this.board[bM[0]][bM[1]] = this.computer
    if(this.evaluate(this.board) == 10){
      this.gameState = "lost"
      this.playing = false
      return;
    }

  }


  getTileContent(i:number, j:number){
    return this.board[i][j]
  }

  isDisabled(i:number, j:number){
    return !(this.board[i][j] == "")
  }

  createRange(number: number){
    // return new Array(number);
    return new Array(number).fill(0)
      .map((n, index) => index + 1);
  }

  isMovesLeft(b: string[][]){
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (b[i][j] == '')
                return true;

    return false;
  }

  evaluate(b: string[][]){

  // Checking rows
  for(let row = 0; row < 3; row++)
  {
    if (b[row][0] == b[row][1] &&
      b[row][1] == b[row][2])
    {
      if (b[row][0] == this.computer)
        return +10;

      else if (b[row][0] == this.player)
        return -10;
    }
  }

    // Checking colums
    for(let col = 0; col < 3; col++)
    {
      if (b[0][col] == b[1][col] &&
        b[1][col] == b[2][col])
      {
        if (b[0][col] ==  this.computer)
          return +10;

        else if (b[0][col] == this.player)
          return -10;
      }
    }

    // Checking diag
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
      if (b[0][0] ==  this.computer)
        return +10;

      else if (b[0][0] == this.player)
        return -10;
    }

    if (b[0][2] == b[1][1] &&
      b[1][1] == b[2][0])
    {
      if (b[0][2] ==  this.computer)
        return +10;

      else if (b[0][2] == this.player)
        return -10;
    }

    // when never won in that pos
    return 0;
  }

  minimax(board: string[][], depth: number, isMax: boolean){
    let score = this.evaluate(board);

    // checks for win
    // if min or max won - return eval score

    if (score == 10)
      return score - (depth / 2);

    if (score == -10)
      return score;

    // tie check
    if (!this.isMovesLeft(board))
      return 0;

    // if max move
    if (isMax)
    {
      let best = -1000;

      // go thru all cels
      for(let i = 0; i < 3; i++)
      {
        for(let j = 0; j < 3; j++)
        {

          // check if cell is empty
          if (board[i][j]=='')
          {

            // making move, calling recursive minmax, undoing move
            board[i][j] = this.computer;

            best = Math.max(best, this.minimax(board, depth + 1, !isMax));

            board[i][j] = '';
          }
        }
      }
      return best;
    }

    // if this min move
    else
    {
      let best = 1000;

      // go thru all cels
      for(let i = 0; i < 3; i++)
      {
        for(let j = 0; j < 3; j++)
        {

          // check if cell is empty
          if (board[i][j] == '')
          {

            // making move, calling recursive minmax, undoing move
            board[i][j] = this.player;

            best = Math.min(best, this.minimax(board, depth + 1, !isMax));

            board[i][j] = '';
          }
        }
      }
      return best;
    }
  }
  findBestMove(board: string[][])
  {
    let bestVal = -1000;
    let bestMove = [-1, -1]

    // go thru all cels
    for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
      {

        // check if cell is empty
        if (board[i][j] == '')
        {

          // making move, calling  minmax, undoing move
          board[i][j] = this.computer;

          let moveVal = this.minimax(board, 0, false);

          board[i][j] = '';
          // if curr move val is bigger - set best to curr
          if (moveVal > bestVal)
          {
            bestMove = [i, j]
            bestVal = moveVal;
          }
        }
      }
    }

    return bestMove;
  }
}
