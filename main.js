const mainSection = document.querySelector(".main");
const playBtn = document.querySelector(".play");
const timerTime = document.querySelector(".timer__time");
const carrotCount = document.querySelector(".carrot__count");
const resultPage = document.querySelector(".end__game");
const resultText = document.querySelector(".game__status");
const field = document.querySelector(".field");
const fieldRect = field.getBoundingClientRect();
const fieldMaxWidth = fieldRect.width;
const fieldMaxHeight = fieldRect.height;
const carrot = "./img/carrot.png";
const bug = "./img/bug.png";
let currentTime = 10;
let carrots = 10;
let timer;
const clickedCarrotSound = new Audio("./sound/carrot_pull.mp3");
const gameBgSound = new Audio("./sound/bg.mp3");
const gameWinSound = new Audio("./sound/game_win.mp3");
const clickedBugSound = new Audio("./sound/bug_pull.mp3");
const randomPosition = (times, img, className) => {
    for (let i = 0; i < times; i++) {
        const x = Math.random() * fieldMaxWidth - 100;
        const y = Math.random() * fieldMaxHeight - 100;
        const item = new Image(100, 100);
        item.setAttribute("class", className);
        item.src = img;
        item.style.transform = `translate(${parseInt(x)}px,${parseInt(y)}px)`;
        item.style.position = "absolute";
        field.appendChild(item);
    }
};

const startCountDown = () => {
    currentTime = currentTime - 1;
    timerTime.innerText = `0:${currentTime}`;
    if (currentTime === 0) {
        clearInterval(timer);
        gameBgSound.pause();
        endGame("YOU LOST.. 💩💩");
    }
};

const init = () => {
    randomPosition(10, carrot, "carrots");
    randomPosition(5, bug, "bugs");
};

const endGame = (text) => {
    resultPage.style.display = "flex";
    resultPage.innerHTML = `
        <button class="replay">
            <i class="fas fa-redo"></i>
        </button>
        <div class="game__status">${text}</div>`;
    playBtn.style.display = "none";
};

const gameStop = () => {
    gameBgSound.pause();
    clearInterval(timer);
    playBtn.innerHTML = `<i class="fas fa-stop"></i>`;
    endGame("Replay ❓");
    mainSection.dataset.game = "paused";
};

const gameStart = () => {
    gameBgSound.play();
    timer = setInterval(startCountDown, 1000);
    mainSection.dataset.game = "started";
    resultPage.innerHTML = "";
    resultPage.style.display = "none";
    playBtn.innerHTML = `<i class="fas fa-play" ></i>`;
    playBtn.style.display = "block";
};
mainSection.addEventListener("click", (e) => {
    if (e.target.className === "play" || e.target.className === "fas fa-play") {
        if (mainSection.dataset.game === "ready") {
            init();
            gameStart();
        } else {
            gameStop();
        }
    }
    //결과가 나왔을때는 당근 벌레 클릭 x
    if (resultPage.innerText === "") {
        if (e.target.className === "carrots") {
            e.target.remove();
            carrots--;
            clickedCarrotSound.play();
            carrotCount.innerText = `${carrots}`;
            if (carrots === 0) {
                clearInterval(timer);
                gameBgSound.pause();
                gameWinSound.play();
                endGame("YOU WON! 🎉🎉");
            }
        }
        if (e.target.className === "bugs") {
            clickedBugSound.play();
            gameBgSound.pause();
            clearInterval(timer);
            endGame("YOU LOST.. 💩💩");
        }
    }
    if (
        e.target.className === "replay" ||
        e.target.className === "fas fa-redo"
    ) {
        if (mainSection.dataset.game === "paused") {
            gameStart();
        } else location.reload();
    }
});
