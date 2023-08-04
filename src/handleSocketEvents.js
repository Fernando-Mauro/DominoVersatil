const { onCreateNewGame, onJoiningGame, onStartGame, onPushPiece, onSkipTurn, onEatPiece, onFinishGame, emitWinner, sendOnlineGames } = require("./sockets/index")

const handleSocketEvents = ({ socket, io }) => {
    socket.connectedRooms = [];

    // Create a new game
    socket.on("onCreateNewGame", (data) => {

        onCreateNewGame({ ...data, socket });

    });

    // Join to room
    socket.on("onJoiningGame", (data) => {

        onJoiningGame({ ...data, socket });

    });

    // Start the game
    socket.on("startGame", () => {
        onStartGame(socket);
    });


    // Pushing a piece
    socket.on("onPushPiece", (piece) => {
        onPushPiece({ socket, piece, io });
    });

    socket.on("skipTurn", () => onSkipTurn({ socket }));

    socket.on("eat-piece", () => {
        onEatPiece({ socket })
    });

    socket.on("endGame", () => {
        onFinishGame({ socket })
    })

    socket.on("winner", ({ winnerName }) => {
        emitWinner({ socket, winnerName })
    });

    socket.on("inLineGames", ({ gameMode }) => {
        sendOnlineGames({socket, gameMode});
    });

    socket.on("globallyInlineGames", () => {
        let llaves = [];
        gamesInline.forEach(gameActive => {
            if (gameActive.players.length < 4 && gameActive.startedGame === false) {
                llaves.push({
                    gameId: gameActive.idRoom,
                    numberPlayers: gameActive.players.length,
                    ownerName: gameActive.owner.name,
                    type: gameActive.modeGame
                });
            }
        });
        socket.emit("inLineGamesGlobally", llaves);

    });
};

module.exports = handleSocketEvents;