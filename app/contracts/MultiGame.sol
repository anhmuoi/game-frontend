// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract MultiGame {
    struct Game {
        address[] players;
        uint256 entryFee;
        bool gameEnded;
        address winner;
        uint256 totalPrize;
    }

    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, uint256 entryFee);
    event GameJoined(uint256 gameId, address player);
    event WinnerDeclared(uint256 gameId, address winner);

    function createGame(uint256 gameId, uint256 _entryFee) public {
        require(_entryFee > 0, "Entry fee must be greater than zero");
        require(games[gameId].entryFee == 0, "Game ID already exists");

        Game storage newGame = games[gameId];
        newGame.entryFee = _entryFee;
        newGame.gameEnded = false;
        newGame.totalPrize = 0;

        emit GameCreated(gameId, _entryFee);
    }

    function joinGame(uint256 gameId) public payable {
        Game storage game = games[gameId];

        require(game.players.length < 4, "Maximum 4 players allowed");
        require(msg.value == game.entryFee, "Incorrect entry fee");
        require(!game.gameEnded, "Game has already ended");

        game.players.push(msg.sender);
        game.totalPrize += msg.value;

        emit GameJoined(gameId, msg.sender);
    }

    function declareWinner(uint256 gameId, address winner) public {
        Game storage game = games[gameId];

        require(game.players.length >= 2 && game.players.length <= 4, "Number of players must be between 2 and 4");
        require(!game.gameEnded, "Game has already ended");

        bool isPlayer = false;
        for (uint i = 0; i < game.players.length; i++) {
            if (game.players[i] == winner) {
                isPlayer = true;
                break;
            }
        }
        require(isPlayer, "Winner must be one of the players");

        game.gameEnded = true;
        game.winner = winner;

        uint256 prize = game.totalPrize;
        game.totalPrize = 0;

        emit WinnerDeclared(gameId, winner);
        payable(winner).transfer(prize);
    }

    function getPlayers(uint256 gameId) public view returns (address[] memory) {
        return games[gameId].players;
    }

    function getTotalPrize(uint256 gameId) public view returns (uint256) {
        return games[gameId].totalPrize;
    }
}
