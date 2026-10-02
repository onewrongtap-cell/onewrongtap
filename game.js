/* =========================================================
ONE WRONG TAP
GAME ENGINE v3.1
========================================================= */

"use strict";

/* =========================================================
ELEMENTS
========================================================= */

const startScreen =
document.getElementById("startScreen");

const gameScreen =
document.getElementById("gameScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

const startButton =
document.getElementById("startButton");

const restartButton =
document.getElementById("restartButton");

const playAgainButton =
document.getElementById("playAgainButton");

const backToMenuButton =
document.getElementById("backToMenuButton");

const tapArea =
document.getElementById("tapArea");

const timerDisplay =
document.getElementById("timer");

const scoreDisplay =
document.getElementById("score");

const streakDisplay =
document.getElementById("streak");

const gameCoinsDisplay =
document.getElementById("gameCoins");

const finalScoreDisplay =
document.getElementById("finalScore");

const shopButton =
document.getElementById("shopButton");

const shopModal =
document.getElementById("shopModal");

const closeShopButton =
document.getElementById("closeShopButton");

const shopCoins =
document.getElementById("shopCoins");

const shopItem1 =
document.getElementById("shopItem1");

const shopItem2 =
document.getElementById("shopItem2");

const achievementsButton =
document.getElementById("achievementsButton");

const achievementsScreen =
document.getElementById("achievementsScreen");

const achievementsBackButton =
document.getElementById("achievementsBackButton");

const achievementsList =
document.getElementById("achievementsList");

const achievementPopup =
document.getElementById("achievementPopup");

const achievementPopupName =
document.getElementById("achievementPopupName");

const achievementPopupDescription =
document.getElementById(
    "achievementPopupDescription"
);

/* =========================================================
GAME STATE
========================================================= */

let score = 0;

let timeLeft = 40;

let gameRunning = false;

let timerInterval = null;

let roundTimeout = null;

let streak = 0;

let bestStreak = 0;

let highScore =
Number(
    localStorage.getItem(
        "oneWrongTapHighScore"
    )
) || 0;

let totalGames =
Number(
    localStorage.getItem(
        "oneWrongTapTotalGames"
    )
) || 0;

let totalTaps =
Number(
    localStorage.getItem(
        "oneWrongTapTotalTaps"
    )
) || 0;

let totalWins =
Number(
    localStorage.getItem(
        "oneWrongTapTotalWins"
    )
) || 0;

let coins =
Number(
    localStorage.getItem(
        "oneWrongTapCoins"
    )
) || 0;

let doubleCoins =
localStorage.getItem(
    "oneWrongTapDoubleCoins"
) === "true";

let secondChance =
localStorage.getItem(
    "oneWrongTapSecondChance"
) === "true";

let secondChanceUsed = false;

/* =========================================================
ACHIEVEMENTS
========================================================= */

const achievements = {

    firstTap: {
        name: "FIRST TAP",
        description:
            "Make your first correct tap.",
        unlocked: false
    },

    streak5: {
        name: "HOT STREAK",
        description:
            "Reach a 5 tap streak.",
        unlocked: false
    },

    streak10: {
        name: "UNSTOPPABLE",
        description:
            "Reach a 10 tap streak.",
        unlocked: false
    },

    streak20: {
        name: "ON FIRE",
        description:
            "Reach a 20 tap streak.",
        unlocked: false
    },

    score50: {
        name: "50 CLUB",
        description:
            "Score 50 points in one game.",
        unlocked: false
    },

    score100: {
        name: "100 CLUB",
        description:
            "Score 100 points in one game.",
        unlocked: false
    }

};

/* =========================================================
LOAD ACHIEVEMENTS
========================================================= */

try {

    const savedAchievements =
        JSON.parse(
            localStorage.getItem(
                "oneWrongTapAchievements"
            ) || "{}"
        );

    Object.keys(achievements).forEach(
        function (key) {

            if (
                savedAchievements[key]
            ) {

                achievements[key].unlocked =
                    true;

            }

        }
    );

} catch (error) {

    console.log(
        "Achievement data reset."
    );

}

/* =========================================================
SAVE DATA
========================================================= */

function saveData() {

    localStorage.setItem(
        "oneWrongTapHighScore",
        highScore
    );

    localStorage.setItem(
        "oneWrongTapTotalGames",
        totalGames
    );

    localStorage.setItem(
        "oneWrongTapTotalTaps",
        totalTaps
    );

    localStorage.setItem(
        "oneWrongTapTotalWins",
        totalWins
    );

    localStorage.setItem(
        "oneWrongTapCoins",
        coins
    );

}

/* =========================================================
SAVE ACHIEVEMENTS
========================================================= */

function saveAchievements() {

    localStorage.setItem(
        "oneWrongTapAchievements",
        JSON.stringify(
            achievements
        )
    );

}

/* =========================================================
SHOW ACHIEVEMENT
========================================================= */

function showAchievement(
    name,
    description
) {

    if (!achievementPopup) {
        return;
    }

    if (achievementPopupName) {

        achievementPopupName.textContent =
            name;

    }

    if (achievementPopupDescription) {

        achievementPopupDescription.textContent =
            description;

    }

    achievementPopup.classList.remove(
        "hidden"
    );

    achievementPopup.classList.add(
        "show"
    );

    setTimeout(
        function () {

            achievementPopup.classList.remove(
                "show"
            );

            achievementPopup.classList.add(
                "hidden"
            );

        },
        2500
    );

}

/* =========================================================
UNLOCK ACHIEVEMENT
========================================================= */

function unlockAchievement(
    key
) {

    if (
        !achievements[key]
    ) {

        return;

    }

    if (
        achievements[key].unlocked
    ) {

        return;

    }

    achievements[key].unlocked =
        true;

    saveAchievements();

    showAchievement(
        achievements[key].name,
        achievements[key].description
    );

    renderAchievements();

}

/* =========================================================
RENDER ACHIEVEMENTS
========================================================= */

function renderAchievements() {

    if (!achievementsList) {
        return;
    }

    achievementsList.innerHTML = "";

    Object.keys(achievements).forEach(
        function (key) {

            const achievement =
                achievements[key];

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "achievement-item";

            if (
                achievement.unlocked
            ) {

                item.classList.add(
                    "unlocked"
                );

            }

            item.innerHTML =
                "<div class=\"achievement-name\">" +
                (
                    achievement.unlocked
                        ? achievement.name
                        : "LOCKED"
                ) +
                "</div>" +
                "<div class=\"achievement-description\">" +
                achievement.description +
                "</div>";

            achievementsList.appendChild(
                item
            );

        }
    );

}

/* =========================================================
UPDATE COIN DISPLAY
========================================================= */

function updateCoinDisplays() {

    if (gameCoinsDisplay) {

        gameCoinsDisplay.textContent =
            coins;

    }

    if (shopCoins) {

        shopCoins.textContent =
            coins;

    }

}

/* =========================================================
UPDATE SHOP
========================================================= */

function updateShop() {

    updateCoinDisplays();

    if (shopItem1) {

        if (doubleCoins) {

            shopItem1.innerHTML =
                "<span>⚡ DOUBLE COINS</span>" +
                "<span class=\"shop-price\">OWNED</span>";

        } else {

            shopItem1.innerHTML =
                "<span>⚡ DOUBLE COINS</span>" +
                "<span class=\"shop-price\">100 🪙</span>";

        }

    }

    if (shopItem2) {

        if (secondChance) {

            shopItem2.innerHTML =
                "<span>🛡️ SECOND CHANCE</span>" +
                "<span class=\"shop-price\">OWNED</span>";

        } else {

            shopItem2.innerHTML =
                "<span>🛡️ SECOND CHANCE</span>" +
                "<span class=\"shop-price\">250 🪙</span>";

        }

    }

}

/* =========================================================
START GAME
========================================================= */

function startGame() {

    clearInterval(
        timerInterval
    );

    clearTimeout(
        roundTimeout
    );

    score = 0;

    timeLeft = 40;

    streak = 0;

    bestStreak = 0;

    secondChanceUsed =
        false;

    gameRunning = true;

    totalGames++;

    scoreDisplay.textContent =
        "0";

    streakDisplay.textContent =
        "0";

    timerDisplay.textContent =
        "40";

    updateCoinDisplays();

    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

    clearBoard();

    createRound();

    playStartSound();

    vibrate(20);

    timerInterval =
        setInterval(
            function () {

                if (!gameRunning) {
                    return;
                }

                timeLeft--;

                timerDisplay.textContent =
                    timeLeft;

                if (
                    timeLeft <= 0
                ) {

                    endGame();

                }

            },
            1000
        );

}

/* =========================================================
END GAME
========================================================= */

function endGame() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    clearInterval(
        timerInterval
    );

    clearTimeout(
        roundTimeout
    );

    totalWins += score;

    if (
        score > highScore
    ) {

        highScore = score;

    }

    saveData();

    clearBoard();

    if (finalScoreDisplay) {

        finalScoreDisplay.textContent =
            score;

    }

    gameScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.remove(
        "hidden"
    );

    playGameOverSound();

    vibrate([
        70,
        40,
        100
    ]);

}

/* =========================================================
CLEAR BOARD
========================================================= */

function clearBoard() {

    if (!tapArea) {
        return;
    }

    tapArea.innerHTML = "";

}

/* =========================================================
DIFFICULTY
========================================================= */

function getDifficulty() {

    if (score < 5) {

        return {
            tiles: 3,
            columns: 2
        };

    }

    if (score < 12) {

        return {
            tiles: 4,
            columns: 2
        };

    }

    if (score < 20) {

        return {
            tiles: 5,
            columns: 3
        };

    }

    if (score < 35) {

        return {
            tiles: 6,
            columns: 3
        };

    }

    if (score < 50) {

        return {
            tiles: 8,
            columns: 4
        };

    }

    return {
        tiles: 10,
        columns: 4
    };

}

/* =========================================================
CREATE ROUND
========================================================= */

function createRound() {

    if (!gameRunning) {
        return;
    }

    clearBoard();

    const difficulty =
        getDifficulty();

    const tiles =
        difficulty.tiles;

    const columns =
        difficulty.columns;

    tapArea.style.display =
        "grid";

    tapArea.style.gridTemplateColumns =
        `repeat(${columns}, 1fr)`;

    const wrongIndex =
        Math.floor(
            Math.random() * tiles
        );

    for (
        let i = 0;
        i < tiles;
        i++
    ) {

        const tile =
            document.createElement(
                "button"
            );

        tile.type =
            "button";

        tile.className =
            "tile";

        if (
            i === wrongIndex
        ) {

            tile.classList.add(
                "danger"
            );

            tile.dataset.type =
                "wrong";

        } else {

            tile.dataset.type =
                "safe";

        }

        tile.addEventListener(
            "pointerdown",
            handleTileTap,
            {
                passive: false
            }
        );

        tapArea.appendChild(
            tile
        );

    }

}

/* =========================================================
TILE TAP
========================================================= */

function handleTileTap(
    event
) {

    event.preventDefault();

    event.stopPropagation();

    if (!gameRunning) {
        return;
    }

    const tile =
        event.currentTarget;

    if (
        tile.dataset.clicked ===
        "true"
    ) {

        return;

    }

    tile.dataset.clicked =
        "true";

    totalTaps++;

    /* =============================================
       WRONG TILE
    ============================================= */

    if (
        tile.dataset.type ===
        "wrong"
    ) {

        tile.classList.add(
            "danger"
        );

        streak = 0;

        streakDisplay.textContent =
            "0";

        wrongTapEffect();

        /*
           SECOND CHANCE
        */

        if (
            secondChance &&
            !secondChanceUsed
        ) {

            secondChanceUsed =
                true;

            streak = 0;

            streakDisplay.textContent =
                "0";

            createRound();

            return;

        }

        endGame();

        return;

    }

    /* =============================================
       CORRECT TILE
    ============================================= */

    streak++;

    streakDisplay.textContent =
        streak;

    if (
        streak > bestStreak
    ) {

        bestStreak =
            streak;

    }

    /* =============================================
       FIRST TAP
    ============================================= */

    unlockAchievement(
        "firstTap"
    );

    /* =============================================
       STREAK ACHIEVEMENTS
    ============================================= */

    if (
        streak >= 5
    ) {

        unlockAchievement(
            "streak5"
        );

    }

    if (
        streak >= 10
    ) {

        unlockAchievement(
            "streak10"
        );

    }

    if (
        streak >= 20
    ) {

        unlockAchievement(
            "streak20"
        );

    }

    /* =============================================
       SCORE
    ============================================= */

    score++;

    scoreDisplay.textContent =
        score;

    /* =============================================
       SCORE ACHIEVEMENTS
    ============================================= */

    if (
        score >= 50
    ) {

        unlockAchievement(
            "score50"
        );

    }

    if (
        score >= 100
    ) {

        unlockAchievement(
            "score100"
        );

    }

    /* =============================================
       COINS
    ============================================= */

    coins +=
        doubleCoins
            ? 10
            : 5;

    saveData();

    updateCoinDisplays();

    coinEffect();

    /* =============================================
       EFFECTS
    ============================================= */

    correctTapEffect(
        tile
    );

    vibrate(10);

    playCorrectSound();

    /* =============================================
       NEXT ROUND
    ============================================= */

    clearTimeout(
        roundTimeout
    );

    roundTimeout =
        setTimeout(
            function () {

                createRound();

            },
            70
        );

}

/* =========================================================
CORRECT TAP EFFECT
========================================================= */

function correctTapEffect(
    tile
) {

    tile.classList.add(
        "safe-hit"
    );

    tile.classList.add(
        "tap-feedback"
    );

    setTimeout(
        function () {

            tile.classList.remove(
                "tap-feedback"
            );

        },
        140
    );

}

/* =========================================================
WRONG TAP EFFECT
========================================================= */

function wrongTapEffect() {

    playWrongSound();

    vibrate([
        70,
        35,
        100
    ]);

    document.body.classList.add(
        "wrong-tap"
    );

    setTimeout(
        function () {

            document.body.classList.remove(
                "wrong-tap"
            );

        },
        250
    );

}

/* =========================================================
COIN EFFECT
========================================================= */

function coinEffect() {

    const event =
        new CustomEvent(
            "oneWrongTapCoinEarned"
        );

    document.dispatchEvent(
        event
    );

}

/* =========================================================
VIBRATION
========================================================= */

function vibrate(
    pattern
) {

    try {

        if (
            navigator.vibrate
        ) {

            navigator.vibrate(
                pattern
            );

        }

    } catch (
        error
    ) {

        console.log(
            "Vibration unavailable."
        );

    }

}

/* =========================================================
AUDIO
========================================================= */

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {

        const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioCtx) {
            return null;
        }

        audioContext =
            new AudioCtx();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

    return audioContext;

}

function playTone(
    frequency,
    duration,
    type,
    volume
) {

    const ctx =
        getAudioContext();

    if (!ctx) {
        return;
    }

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type =
        type || "sine";

    oscillator.frequency.value =
        frequency;

    gain.gain.value =
        volume || 0.05;

    oscillator.connect(
        gain
    );

    gain.connect(
        ctx.destination
    );

    const now =
        ctx.currentTime;

    gain.gain.setValueAtTime(
        volume || 0.05,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    oscillator.start(
        now
    );

    oscillator.stop(
        now + duration
    );

}

function playStartSound() {

    playTone(
        440,
        0.10,
        "sine",
        0.05
    );

    setTimeout(
        function () {

            playTone(
                660,
                0.12,
                "sine",
                0.05
            );

        },
        80
    );

}

function playCorrectSound() {

    playTone(
        720,
        0.06,
        "sine",
        0.035
    );

}

function playWrongSound() {

    playTone(
        180,
        0.20,
        "sawtooth",
        0.055
    );

    setTimeout(
        function () {

            playTone(
                100,
                0.25,
                "sawtooth",
                0.045
            );

        },
        70
    );

}

function playGameOverSound() {

    playTone(
        220,
        0.20,
        "sawtooth",
        0.05
    );

    setTimeout(
        function () {

            playTone(
                130,
                0.30,
                "sawtooth",
                0.045
            );

        },
        100
    );

}

/* =========================================================
SHOP
========================================================= */

if (shopButton) {

    shopButton.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            updateShop();

            if (shopModal) {

                shopModal.classList.remove(
                    "hidden"
                );

            }

        }
    );

}

if (closeShopButton) {

    closeShopButton.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            if (shopModal) {

                shopModal.classList.add(
                    "hidden"
                );

            }

        }
    );

}

/* =========================================================
DOUBLE COINS
========================================================= */

if (shopItem1) {

    shopItem1.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            if (doubleCoins) {
                return;
            }

            if (coins < 100) {
                return;
            }

            coins -= 100;

            doubleCoins =
                true;

            localStorage.setItem(
                "oneWrongTapCoins",
                coins
            );

            localStorage.setItem(
                "oneWrongTapDoubleCoins",
                "true"
            );

            updateShop();

        }
    );

}

/* =========================================================
SECOND CHANCE
========================================================= */

if (shopItem2) {

    shopItem2.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            if (secondChance) {
                return;
            }

            if (coins < 250) {
                return;
            }

            coins -= 250;

            secondChance =
                true;

            localStorage.setItem(
                "oneWrongTapCoins",
                coins
            );

            localStorage.setItem(
                "oneWrongTapSecondChance",
                "true"
            );

            updateShop();

        }
    );

}

/* =========================================================
ACHIEVEMENTS BUTTON
========================================================= */

if (achievementsButton) {

    achievementsButton.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            renderAchievements();

            if (achievementsScreen) {

                achievementsScreen.classList.remove(
                    "hidden"
                );

            }

            startScreen.classList.add(
                "hidden"
            );

        }
    );

}

/* =========================================================
ACHIEVEMENTS BACK BUTTON
========================================================= */

if (achievementsBackButton) {

    achievementsBackButton.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            if (achievementsScreen) {

                achievementsScreen.classList.add(
                    "hidden"
                );

            }

            startScreen.classList.remove(
                "hidden"
            );

        }
    );

}

/* =========================================================
START BUTTON — FIX
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const startBtn =
        document.getElementById("startButton");

    if (!startBtn) {

        console.error(
            "START BUTTON NOT FOUND"
        );

        return;

    }

    startBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "START BUTTON CLICKED"
            );

            startGame();

        }
    );

    startBtn.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

        },
        {
            passive: false
        }
    );

    console.log(
        "START BUTTON READY"
    );

});

/* =========================================================
START BUTTON — TOUCH / ANDROID
========================================================= */

document.addEventListener(
    "pointerdown",
    function (event) {

        const button =
            event.target.closest("#startButton");

        if (!button) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        console.log(
            "START GAME POINTER PRESSED"
        );

        try {

            startGame();

        } catch (error) {

            console.error(
                "START GAME ERROR:",
                error
            );

            alert(
                "START GAME ERROR:\n\n" +
                error.message
            );

        }

    },
    true
);/* =========================================================
PREVENT MOBILE SCROLL
========================================================= */

if (tapArea) {

    tapArea.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

        },
        {
            passive: false
        }
    );

}

/* =========================================================
PREVENT CONTEXT MENU
========================================================= */

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);

/* =========================================================
SCREEN RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function () {

        if (gameRunning) {

            createRound();

        }

    }
);

/* =========================================================
INITIAL STATE
========================================================= */

if (startScreen) {

    startScreen.classList.remove(
        "hidden"
    );

}

if (gameScreen) {

    gameScreen.classList.add(
        "hidden"
    );

}

if (gameOverScreen) {

    gameOverScreen.classList.add(
        "hidden"
    );

}

if (gameCoinsDisplay) {

    gameCoinsDisplay.textContent =
        coins;

}

renderAchievements();

updateShop();

saveData();

console.log(
    "ONE WRONG TAP v3.1 loaded."
);

console.log(
    "START BUTTON ELEMENT:",
    startButton
);

console.log(
    "START BUTTON LISTENER READY"
);
