const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 10;

const gameBtn = document.querySelector(".game__play");
const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameTimer = document.querySelector(".game__timer");
const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const carrotCount = document.querySelector(".carrot__count");
const replayBtn = document.querySelector(".pop-up__refresh");

let timer;
let gameStatus = false;
let started = false;
let score = 0;
let currentTime = GAME_DURATION_SEC;

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");

gameBtn.addEventListener("click", () => {
    if (started) {
        stopGame();
    } else {
        if (gameStatus) {
            continueGame();
        } else startGame();
    }
});

field.addEventListener("click", fieldClick);

replayBtn.addEventListener("click", replayBtnClick);

function replayBtnClick() {
    currentTime = GAME_DURATION_SEC;
    startGame();
    hidePopUpText();
}

function continueGame() {
    started = true;
    gameStatus = false;
    playSound(bgSound);
    showStopBtn();
    startGameTimer(currentTime);
    hidePopUpText();
}

function hidePopUpText() {
    popUp.classList.add("pop-up__hide");
}

function fieldClick(event) {
    const target = event.target;
    if (started) {
        if (target.className === "carrot") {
            playSound(carrotSound);
            score++;
            updateCarrotCount();
            target.remove();
            if (score === CARROT_COUNT) {
                finishGame();
            }
        }
        if (target.className === "bug") {
            finishGame();
            stopGameTimer();
            playSound(bugSound);
        }
    }
}
function updateCarrotCount() {
    const currentScore = CARROT_COUNT - score;
    carrotCount.innerText = currentScore;
}
function stopSound(sound) {
    sound.pause();
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function startGame() {
    started = true;
    field.innerHTML = "";
    carrotCount.innerText = CARROT_COUNT;
    score = 0;
    addItem("carrot", CARROT_COUNT, "./img/carrot.png");
    addItem("bug", BUG_COUNT, "./img/bug.png");
    showStopBtn();
    startGameTimer(GAME_DURATION_SEC);
    showGameTimer();
    showCarrotCount();
    playSound(bgSound);
}

function stopGame() {
    gameStatus = true;
    started = false;
    showPlayBtn();
    showPopUpText(`REPLAY ❓`);
    stopSound(bgSound);
    stopGameTimer();
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
        const item = document.createElement("img");
        item.setAttribute("class", className);
        item.setAttribute("src", imgPath);
        item.style.position = "absolute";
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function showStopBtn() {
    const icon = document.querySelector(".fas");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-stop");
}

function showPlayBtn() {
    const icon = document.querySelector(".fas");
    icon.classList.add("fa-play");
    icon.classList.remove("fa-stop");
}

function showCarrotCount() {
    carrotCount.style.visibility = "visible";
}

function showGameTimer() {
    gameTimer.style.visibility = "visible";
}

function startGameTimer(time) {
    updateTimerText(time);
    timer = setInterval(() => {
        currentTime -= 1;
        if (time <= 0) {
            stopGameTimer();
            finishGame();
            return;
        } else {
            updateTimerText(--time);
        }
    }, 1000);
}

function updateTimerText(currentTime) {
    gameTimer.innerText = `0:${currentTime}`;
}

function stopGameTimer() {
    clearInterval(timer);
}

function finishGame() {
    let win = true;
    CARROT_COUNT - score === 0 ? win : (win = false);
    if (win) {
        playSound(winSound);
        stopGameTimer();
        showPopUpText(`YOU WON 🎉`);
    } else {
        playSound(bugSound);
        stopGameTimer();
        showPopUpText(`YOU LOST 💩`);
    }
    stopSound(bgSound);
}
function showPopUpText(text) {
    popUp.classList.remove("pop-up__hide");
    popUpText.innerText = text;
}
