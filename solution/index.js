const CARROT_SIZE = 130;
const CARROT_COUNT = 10;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
    if (started) {
        stopGame();
    } else {
        startGame();
    }
});

popUpRefresh.addEventListener("click", () => {
    startGame();
    hidePopUp();
});

function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText("REPLY ❓");
    playSound(alertSound);
    stopSound(bgSound);
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if (win) {
        playSound(winSound);
    } else {
        playSound(bugSound);
    }
    stopSound(bgSound);
    showPopUpWithText(win ? "YOU WON 🎉" : "YOU LOST 💩");
}
function showStopButton() {
    const icon = gameBtn.querySelector(".fas");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-stop");
    gameBtn.style.visibility = "visible";
}
function hideGameButton() {
    gameBtn.style.visibility = "hidden";
}
function showTimerAndScore() {
    gameTimer.style.visibility = "visible";
    gameScore.style.visibility = "visible";
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}
function updateTimerText(time) {
    const minute = Math.floor(time / 60);
    const sec = time % 60;
    gameTimer.innerText = `${minute}:${sec}`;
}
function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove("pop-up__hide");
}
function hidePopUp() {
    popUp.classList.add("pop-up__hide");
}
function initGame() {
    score = 0;
    field.innerHTML = ``;
    gameScore.innerText = CARROT_COUNT;
    addItem("carrot", CARROT_COUNT, "./img/carrot.png");
    addItem("bug", BUG_COUNT, "./img/bug.png");
}

function onFieldClick(event) {
    if (!started) return; // 함수가 조건에 맞지않으면 빠르게 리턴하는게 중요!
    const target = event.target;
    if (target.matches(".carrot")) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if (score === CARROT_COUNT) {
            finishGame(true);
        }
    } else if (target.matches(".bug")) {
        stopGameTimer();
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}
function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
    const x1 = 0; // field 의 좌상단 젤끝
    const y1 = 0;
    // 당근 사이즈 80 을 빼줘야지 field를 벗어나지 않는다
    const x2 = fieldRect.width - CARROT_SIZE; // field의 우하단 젤 끝
    const y2 = fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
        const item = document.createElement("img");
        item.setAttribute("class", className);
        item.setAttribute("src", imgPath);
        // absolute 는 position이 static가 아닌 position을 기준으로 잡고 상위 부모들이 static이면 body를 기준으로 함
        item.style.position = "absolute";
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        // item.style.transform = `translate(${x}px,${y}px)`;
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
