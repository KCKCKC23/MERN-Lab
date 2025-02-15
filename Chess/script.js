const chessboard = document.getElementById("chessboard");
const board = [];
const pieces = {
  0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"], // Black major pieces
  1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"], // Black pawns
  6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"], // White pawns
  7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"], // White major pieces
};
let currentTurn = "white"; // White starts the game
let draggedPiece = null;

// Create a message container
const messageContainer = document.createElement("div");
messageContainer.id = "message";
document.body.appendChild(messageContainer);

// Initialize the board
for (let row = 0; row < 8; row++) {
  board[row] = [];
  for (let col = 0; col < 8; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
    cell.dataset.row = row;
    cell.dataset.col = col;

    // Add pieces to initial positions
    if (pieces[row] && pieces[row][col]) {
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.textContent = pieces[row][col];
      piece.dataset.color = row < 2 ? "black" : "white"; // Black on top, white on bottom
      piece.draggable = true;

      // Drag-and-drop event listeners
      piece.addEventListener("dragstart", dragStart);
      piece.addEventListener("dragend", dragEnd);

      cell.appendChild(piece);
    }

    // Allow dropping pieces on empty cells or cells with opponent pieces
    cell.addEventListener("dragover", dragOver);
    cell.addEventListener("drop", dropPiece);

    chessboard.appendChild(cell);
    board[row][col] = cell;
  }
}

// Drag-and-drop functions
function dragStart(event) {
  const pieceColor = event.target.dataset.color;
  if (pieceColor === currentTurn) {
    draggedPiece = event.target;
    setTimeout(() => (draggedPiece.style.display = "none"), 0);
  } else {
    event.preventDefault();
  }
}

function dragEnd() {
  if (draggedPiece) draggedPiece.style.display = "block";
  draggedPiece = null;
}

function dragOver(event) {
  event.preventDefault();
}

function dropPiece(event) {
  event.preventDefault();
  const targetCell = event.target.closest(".cell");
  if (draggedPiece && targetCell) {
    const startRow = parseInt(draggedPiece.parentElement.dataset.row);
    const startCol = parseInt(draggedPiece.parentElement.dataset.col);
    const endRow = parseInt(targetCell.dataset.row);
    const endCol = parseInt(targetCell.dataset.col);

    // Validate move
    const isValid = validateMove(draggedPiece, startRow, startCol, endRow, endCol);
    if (isValid) {
      // Capture opponent piece if present
      const targetPiece = targetCell.querySelector(".piece");
      if (targetPiece) {
        targetCell.removeChild(targetPiece);
      }

      // Move the piece
      targetCell.appendChild(draggedPiece);

      // Check for check or checkmate
      if (isCheck()) {
        showMessage(`${currentTurn === "white" ? "Black" : "White"} is in check!`);
        if (isCheckmate()) {
          showMessage(`${currentTurn === "white" ? "Black" : "White"} is in checkmate! Game over.`);
          disableGame();
          return;
        }
      }

      // Change turn
      currentTurn = currentTurn === "white" ? "black" : "white";
    }
  }
}

// Show messages
function showMessage(message) {
  messageContainer.textContent = message;
  setTimeout(() => (messageContainer.textContent = ""), 5000);
}

// Disable the game on checkmate
function disableGame() {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach((piece) => {
    piece.draggable = false;
  });
}

// Validate moves for each piece
function validateMove(piece, startRow, startCol, endRow, endCol) {
  const pieceType = piece.textContent;
  const pieceColor = piece.dataset.color;
  const targetPiece = board[endRow][endCol].querySelector(".piece");

  // Prevent moving onto a square with a piece of the same color
  if (targetPiece && targetPiece.dataset.color === pieceColor) {
    return false;
  }

  // Validate moves based on piece type
  switch (pieceType) {
    case "♙": // White pawn
    case "♟": // Black pawn
      const direction = pieceColor === "white" ? -1 : 1;
      const startRank = pieceColor === "white" ? 6 : 1;
      if (
        (endRow === startRow + direction && endCol === startCol && !targetPiece) || // Move forward
        (endRow === startRow + direction && Math.abs(endCol - startCol) === 1 && targetPiece) || // Capture diagonally
        (startRow === startRank && endRow === startRow + 2 * direction && endCol === startCol && !targetPiece) // Initial 2-square move
      ) {
        return true;
      }
      break;

    case "♖": // Rook
    case "♜":
      if (isStraightPathClear(startRow, startCol, endRow, endCol)) {
        return true;
      }
      break;

    case "♘": // Knight
    case "♞":
      if (
        (Math.abs(endRow - startRow) === 2 && Math.abs(endCol - startCol) === 1) ||
        (Math.abs(endRow - startRow) === 1 && Math.abs(endCol - startCol) === 2)
      ) {
        return true;
      }
      break;

    case "♗": // Bishop
    case "♝":
      if (isDiagonalPathClear(startRow, startCol, endRow, endCol)) {
        return true;
      }
      break;

    case "♕": // Queen
    case "♛":
      if (
        isStraightPathClear(startRow, startCol, endRow, endCol) ||
        isDiagonalPathClear(startRow, startCol, endRow, endCol)
      ) {
        return true;
      }
      break;

    case "♔": // King
    case "♚":
      if (Math.abs(endRow - startRow) <= 1 && Math.abs(endCol - startCol) <= 1) {
        return true;
      }
      break;
  }

  return false;
}

// Check if the path is clear for straight-line moves (Rooks and Queens)
function isStraightPathClear(startRow, startCol, endRow, endCol) {
  if (startRow !== endRow && startCol !== endCol) return false;
  const rowStep = startRow === endRow ? 0 : startRow < endRow ? 1 : -1;
  const colStep = startCol === endCol ? 0 : startCol < endCol ? 1 : -1;
  let row = startRow + rowStep;
  let col = startCol + colStep;

  while (row !== endRow || col !== endCol) {
    if (board[row][col].querySelector(".piece")) return false; // There is a piece in the way
    row += rowStep;
    col += colStep;
  }
  return true;
}

// Check if the path is clear for diagonal moves (Bishops and Queens)
function isDiagonalPathClear(startRow, startCol, endRow, endCol) {
  if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false;
  const rowStep = startRow < endRow ? 1 : -1;
  const colStep = startCol < endCol ? 1 : -1;
  let row = startRow + rowStep;
  let col = startCol + colStep;

  while (row !== endRow || col !== endCol) {
    if (board[row][col].querySelector(".piece")) return false; // There is a piece in the way
    row += rowStep;
    col += colStep;
  }
  return true;
}

// Detect if the king is in check
function isCheck() {
  const king = Array.from(document.querySelectorAll(".piece"))
    .find((piece) => piece.dataset.color === currentTurn && (piece.textContent === "♔" || piece.textContent === "♚"));
  if (!king) return false;

  const kingRow = parseInt(king.parentElement.dataset.row);
  const kingCol = parseInt(king.parentElement.dataset.col);

  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = board[row][col];
      const opponentPiece = cell.querySelector(".piece");
      if (opponentPiece && opponentPiece.dataset.color !== currentTurn) {
        if (validateMove(opponentPiece, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Detect checkmate
function isCheckmate() {
  // Check all moves for the current player
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = board[row][col];
      const piece = cell.querySelector(".piece");
      if (piece && piece.dataset.color === currentTurn) {
        for (let targetRow = 0; targetRow < 8; targetRow++) {
          for (let targetCol = 0; targetCol < 8; targetCol++) {
            const targetCell = board[targetRow][targetCol];
            const targetPiece = targetCell.querySelector(".piece");

            if (
              validateMove(piece, row, col, targetRow, targetCol) &&
              (!targetPiece || targetPiece.dataset.color !== currentTurn)
            ) {
              // Simulate the move
              targetCell.appendChild(piece);
              const originalParent = cell;
              if (targetPiece) targetCell.removeChild(targetPiece);

              // Check if the move resolves the check
              const stillInCheck = isCheck();

              // Revert the move
              originalParent.appendChild(piece);
              if (targetPiece) targetCell.appendChild(targetPiece);

              if (!stillInCheck) return false; // Not checkmate if any move resolves the check
            }
          }
        }
      }
    }
  }
  return true; // No valid moves resolve the check, so it's checkmate
}