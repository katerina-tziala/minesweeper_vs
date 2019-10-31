<h1><img src="https://github.com/katerina-tziala/minesweeper_vs/blob/master/client/minesweeper_vs_logo.png" alt="MinesweeperVS logo" width="54" height="54">MinesweeperVS</h1>
MinesweeperVS is a two-player puzzle browser game, written in JavaScript, HTML5 and CSS3. The players communicate with each other through a custom WebSocket developed in JavaScript upon Node.js.

<h2>Objective</h2>
MinesweeperVS is developed based on the single-player minesweeper computer game. The objective of MinesweeperVS is to locate all hidden "mines" (or bombs) on the board and place more flags on the mines than the opponent without detonating any of them.


<h2>Game Flow</h2>
All potential players are connected to the lobby of the game and can see other users connected. In order to play, a user has to invite another user and select the game level. There are three game levels:

**1. Beginner:** 10 mines in a 9x9 board.

**2. Intermediate:** 40 mines in a 16x16 board.

**3. Expert:** 99 mines in a 16x30 board.

Is the invitation accepted? Game is on!

<h2>Game Play</h2>
<p>Players take turns. The player who plays first is selected randomly. In each turn, the player has 30 seconds to select and click a field on the board, that is not revealed or flagged already, and complete the turn. If the player makes no move on the 30-second time window then loses his/her turn and the opponent plays again.</p>
<p>The left mouse button (left click) is used to reveal fields on the board that the player thinks that they do not contain mines. The right mouse button (right click) is used to flag the fields that the player thinks they do contain mines.</p>
<p>If a player clicks (left click) on a non-bomb area, each revealed field will either open up to be blank, or will contain a number from 1 to 8. These numbers specify the number of mines adjacent to that field. For example, 1 means there is only 1 mine adjacent to it, 2 means there are only 2 mines adjacent to it, and so on. When a field has the number 8 it means that all adjacent fields contain mines.</p>
<p>When a player clicks (left click) on a field that contains a hidden mine then the mine gets detonated.</p>
<p>When a player marks a field as a mine (right click), a flag will appear on it in case the field does contain a hidden mine, or an "x" symbol in case the field is empty.</p>

<h3>Win - Loss - Draw</h3>

- In case a player misses 5 consecutive turns then the opponent wins.
- In case a player detonates a mine (reveal a field that contains a mine) then the opponent wins.
- When all mines are flagged then the game ends.

  - The player who finds the most hidden "mines" wins.
  - In case both players find the same number of mines then the game ends as a draw.

<h2>Compatibility</h2>
The game is compatible in any latest Chrome and Opera browser when accessed through a laptop or desktop.

<h2>Local Setup of the Project</h2>

**1.** Fork and clone the [**minsesweeper_vs**](https://github.com/katerina-tziala/minesweeper_vs) repository.

**2.** Open the terminal navigate into the /server folder inside the app and run ***npm install***.

**3.** When all dependencies are installed, run the command ***node server.js*** from the same server folder.

**4.** To launch the game install and use the [**Web Server for Chrome**](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb).

**5.** Choose the /client folder of the project from the *Web Server for Chrome* app.

**6.** Access the game by clicking the provided link of the *Web Server for Chrome* app.

**7.** Enjoy! :video_game: :flags: :collision: :wink:

