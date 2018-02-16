var $gamePlace = $('#game');
var $playArea = $('.playArea');
var $playButton = $('#play');
var $stopButton = $('#stop');
var $coverRound = $('#coverRound');
var $roundText = $('#roundText');
var $levelText = $('#level');
var timeText = $('#timeToEnd');
var $gameScoreText = $('#gameScore');
var soundOpenDoor = document.createElement('audio');
soundOpenDoor.src = "sounds/open.mp3";
var soundCloseDoor = document.createElement('audio');
soundCloseDoor.src = "sounds/close2.mp3";
var soundCoin = document.createElement('audio');
soundCoin.src = "sounds/coin.mp3";
var soundThief = document.createElement('audio');
soundThief.src = "sounds/thief.mp3";
var soundGun = document.createElement('audio');
soundGun.src = "sounds/gun.mp3";

function CreateBox(idBlock) {
    var id = idBlock;
    var boxState = 0;

    return {
        insertBox: function (difficultyLevel) {
            switch (difficultyLevel) {
                case 9:
                    $gamePlace.append($('<div id="' + id + '" class="playArea playAreaSafe9 col-xs-4">' +
                        '<div class="safeDoor playAreaSafe9">' +
                        '   <img src="images/safe_door.png" class="safeDoorFront">' +
                        '   <div class="safeDoorBack"></div>' +
                        '</div>' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    break;
                case 16:
                    $gamePlace.append($('<div id="' + id + '" class="playArea playAreaSafe16 col-xs-3">' +
                        '<div class="safeDoor playAreaSafe16">' +
                        '   <img src="images/safe_door.png" class="safeDoorFront">' +
                        '   <div class="safeDoorBack"></div>' +
                        '</div>' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    break;
                case 25:
                    $gamePlace.append($('<div id="' + id + '" class="playArea playAreaSafe25">' +
                        '<div class="safeDoor playAreaSafe25">' +
                        '   <img src="images/safe_door.png" class="safeDoorFront">' +
                        '   <div class="safeDoorBack"></div>' +
                        '</div>' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    break;
            }
        },

        getBoxState: function () {
            return boxState;
        },

        setActiveBox: function (goodBad) {
            $('.playArea').removeClass('active');
            if (goodBad) {
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(-90deg)');
                $('#' + id).addClass('active');
                $('#' + id + ' .coin').show();
                boxState = 1;
            } else {
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(-90deg)');
                $('#' + id + ' .thief').show();
                soundThief.play();
                $('#' + id).addClass('active');
                boxState = 2;
            }
        },

        removeActiveBox: function () {
            if (boxState) {
                $('#' + id + ' .coin').hide();
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(0deg)');
                // $('#' + id).removeClass('active');
                boxState = 0;
                $('#' + id + ' .thief').hide();
                soundCloseDoor.play();
            }
        }
    }
}

function CreateGame() {
    var gameArea = [];
    var levelL = 9;
    var divColor = 0;
    var goodBadBox;
    var frequencyOfTheThiefShow = 10;
    var quantityBox = 9;
    var round = 1;
    var score = 0;
    var scoreToTable;
    var roundScore = 0;
    var totalRoundPoints = 0;
    var setGameTime = 30;
    var seconds = 30;
    var mSeconds = 0;
    var timeCounterInterval;
    var timeBetweenBoxes = 2000;
    var timeBetweenBoxesOriginal = timeBetweenBoxes;
    var activeGameInterval;
    var activeBoxInterval;
    var $difficultyLevelChecked = $('input[name="difficultyLevel"]');

    createGameArea();

    function createGameArea() {
        // $('#game').empty();
        $('.playArea').remove();
        gameArea = [];
        for (var i = 0; i < levelL; i++) {
            gameArea[i] = new CreateBox(i);
        }
        gameArea.forEach(function (area, index) {
            area.insertBox(levelL);
        })
    };

    $difficultyLevelChecked.click(function () {
        levelL = parseInt($difficultyLevelChecked.filter(':checked').val());
        switch (levelL) {
            case 9:
                timeBetweenBoxes = 2000;
                timeBetweenBoxesOriginal = timeBetweenBoxes;
                quantityBox = 9;
                frequencyOfTheThiefShow = 10;
                break;
            case 16:
                timeBetweenBoxes = 1400;
                timeBetweenBoxesOriginal = timeBetweenBoxes;
                quantityBox = 16;
                frequencyOfTheThiefShow = 5;
                break;
            case 25:
                timeBetweenBoxes = 1200;
                timeBetweenBoxesOriginal = timeBetweenBoxes;
                quantityBox = 25;
                frequencyOfTheThiefShow = 3;
                break;
        }
        createGameArea();
    });

    showInstruction();
    $('#play').click(counter);
    $('#stop').click(stopGame);

    function startGame() {
        menuDisabled();
        $('#stop').removeAttr('disabled');
        $('#level').text(round); // wyświetla która runda
        timeCounterInterval = setInterval(function () {
            $('#timeToEnd').text(seconds + '.' + mSeconds);
            if (seconds === 0 && mSeconds === 0) { // end round time
                setGameTime = 30;
                seconds = 30;
                mSeconds = 0;
                clearInterval(timeCounterInterval);
                clearInterval(activeGameInterval);
                clearTimeout(activeBoxInterval);
                gameArea[divColor].removeActiveBox();
                $('.playArea').removeClass('active');
                if (roundScore >= (totalRoundPoints / 100) * 70) {  // play next round
                    round++;
                    totalRoundPoints = 0;
                    if (timeBetweenBoxes > 200) {
                        timeBetweenBoxes -= 200;
                        showRound();
                    }
                } else { // end game
                    showResult();
                    score = 0;
                    $('#gameScore').text(score);
                    $('#level').text(" ");
                    round = 1;
                    menuDisabled();
                    gameArea[divColor].removeActiveBox();
                    $('.playArea').removeClass('active');
                    divColor = 0;
                    totalRoundPoints = 0;
                    setGameTime = 30;
                    seconds = 30;
                    mSeconds = 0;
                    timeBetweenBoxes = timeBetweenBoxesOriginal;

                }
                roundScore = 0;
            } else {
                mSeconds--;
                if (mSeconds === -1) {
                    setGameTime--;
                    seconds--;
                    mSeconds = 9;
                }
            }
        }, 100);

//      Tworzymy nowy podświetlany box co pewnien okres czasu
        activeGameInterval = setInterval(function () {
            // $('#' + divColor).removeClass('activeGood');
            gameArea[divColor].removeActiveBox();
            if (setGameTime >= (timeBetweenBoxes / 1000)) {
                divColor = Math.floor(Math.random() * quantityBox);
                // $('#' + divColor).addClass('activeGood');
                goodBadBox = Math.round(Math.random() * frequencyOfTheThiefShow);
                gameArea[divColor].setActiveBox(goodBadBox);
                soundOpenDoor.play();
                if (goodBadBox) totalRoundPoints++;
            }
        }, timeBetweenBoxes);

        // Jeżeli klikniemy na aktywny box, to zwiększamy punktację
        $('.playArea').click(function () {
            var boxNumber = parseInt($(this).attr("id"));
            boxState = gameArea[boxNumber].getBoxState();
            if (boxState) {
                if (boxState === 1) {
                    gameArea[boxNumber].removeActiveBox();
                    soundCoin.play();
                    score++;
                    roundScore++;
                }
                if (boxState === 2) {
                    gameArea[boxNumber].removeActiveBox();
                    soundGun.play();
                    score--;
                }
                $('#gameScore').text(score);
            }
        });
    }

    function stopGame() {
        setGameTime = 30;
        seconds = 30;
        mSeconds = 0;
        clearInterval(timeCounterInterval);
        clearInterval(activeGameInterval);
        clearTimeout(activeBoxInterval);
        gameArea[divColor].removeActiveBox();
        showResult();
        score = 0;
        round = 1;
        timeBetweenBoxes = timeBetweenBoxesOriginal;
        menuDisabled();
        $('.playArea').removeClass('active');
        $('#level').text(" ");
        $('#gameScore').text(score);
        $('#timeToEnd').text(seconds + '.' + mSeconds);
    }

    function showResult() {
        scoreToTable = score;
        $('#endGameScoreText').text("Twój wynik: " + score);
        $('#gameEnd').show();
        $coverRound.show();
        $coverRound.addClass('instructionBackground');
        $coverRound.addClass('coverRoundShow');
    }

// Funkcja z serwera
//     function showResult() {
//         let scoreToTable = score;
//         $('#roundText').show().html("<div id='endGameText'>KONIEC GRY</div><div id='endGameScoreText'>Twój wynik: " + score + "</div>" +
//             "   <button id='scoreTableButton' class='btn btn-default center-block'>Lista wyników</button>");
//         $('#coverRound').show();
//         $('#coverRound').addClass('instructionBackground');
//         $('#coverRound').addClass('coverRoundShow');
//     }

    $('#scoreTableButton').click(function () {
        let level;
        $('#gameEnd').hide();
        switch (levelL) {
            case 9:
                level = "easyLevel";
                break;
            case 16:
                level = "midLevel";
                break;
            case 25:
                level = "hardLevel";
                break;
            default:
                level = "easyLevel";
        }
        // showScoreList();
        mangingScoreList(scoreToTable, level);
        $('#scores').show();
    });

    // function showScoreList() {
    //     menuEnabled();
    //     $('#scores').show();
    //     // $('#roundText').css('text-align', 'left');
    //     // $('#roundText').show().html("<div id='scoreTableHeader'>TWOJE WYNIKI: </div>" +
    //     //     "<div class='container-fluid'>" +
    //     //     "   <div class='scoreTablePoint col-xs-4'>łatwy: " +
    //     //     "       <ol id='easyLevel'>" +
    //     //     "       </ol>" +
    //     //     "   </div>" +
    //     //     "   <div class='scoreTablePoint col-xs-4'>średni: " +
    //     //     "       <ol id='midLevel'>" +
    //     //     "       </ol>" +
    //     //     "   </div>" +
    //     //     "   <div class='scoreTablePoint col-xs-4'>trudny: " +
    //     //     "       <ol id='hardLevel'>" +
    //     //     "       </ol>" +
    //     //     "   </div>" +
    //     //     "</div>" +
    //     //     "<div>" +
    //     //     "   <button id='scoreTableRetryButton' class='btn btn-default center-block'>Zagraj ponownie</button>" +
    //     //     "</div>");
    //     $('#coverRound').addClass('scoreTableBackground');
    //     $('#coverRound').addClass('coverRoundShow');
    //     $('#play').removeAttr('disabled');
    //     $difficultyLevelChecked.removeAttr('disabled');
    //
    //
    //     // mangingScoreList(score, level);
    // }

    $('#scoreTableRetryButton').click(function () {
        $('#coverRound').hide();
        $('#scores').hide();
        menuEnabled();
        $('#stop').attr('disabled', 'disabled');
        // $('#play').removeAttr('disabled');
        // $difficultyLevelChecked.removeAttr('disabled');
        // setTimeout(counter(), 3000)
    });

    function checkScore(score, level) {
        let levelArray = ["easyLevel", "midLevel", "hardLevel"],
            scoreArray,
            zerosArray;

        for (let i = 0; i < levelArray.length; i++) {
            if (WHReadCookie(levelArray[i]) === null) {
                zerosArray = ["0", "0", "0", "0", "0"];
                WHCreateCookie(levelArray[i], zerosArray, 14);
            }
        }

        scoreArray = WHReadCookie(level).split(",");

        for (let j = 0; j < scoreArray.length; j++) {
            if (score > parseFloat(scoreArray[j])) {
                scoreArray.splice(j, 0, score.toString());
                if (scoreArray.length > 5) {
                    scoreArray.pop();
                }
                break
            }
        }
        WHCreateCookie(level, scoreArray, 14);
        return scoreArray
    }

    function mangingScoreList(score, level, levelArray = ["easyLevel", "midLevel", "hardLevel"]) {
        checkScore(score, level);
        for (i = 0; i < levelArray.length; i++) {
            let list = WHReadCookie(levelArray[i]).split(",");
            $('#' + levelArray[i]).empty();
            for (let j = 0; j < list.length; j++) {
                let template = '<li>' + list[j] + '</li>';
                $('#' + levelArray[i]).append(template);
            }
        }
    }

    function counter() {
        $coverRound.removeClass('coverRoundShow');
        menuDisabled();
        $coverRound.css("box-shadow", "none");
        $coverRound.removeClass('instructionBackground');
        var countNumber = 3;
        var countTimeout = setInterval(function () {
            $roundText.show();
            $coverRound.show();
            if (countNumber > 0) {
                $roundText.text(countNumber).fadeOut(800, function () {
                });
            } else if (countNumber === 0) {
                $roundText.text('START').fadeOut(800, function () {
                });
            } else {
                $roundText.hide();
                $coverRound.hide();
                clearInterval(countTimeout);
                startGame();
                return;
            }
            countNumber--;
        }, 900);
    }

    function showRound() {
        $coverRound.show();
        $roundText.show();
        $roundText.text('Runda ' + round).fadeOut(900);
        var timeout = setTimeout(function () {
            $coverRound.hide();
            $roundText.hide();
            clearTimeout(timeout);
            startGame();
            return
        }, 1000);
    }

    // function showInstruction() {
    //     $('#play').attr('disabled', 'disabled');
    //     $('#stop').attr('disabled', 'disabled');
    //     $difficultyLevelChecked.attr('disabled', 'disabled');
    //     $('#roundText').css('text-align', 'left');
    //     $('#roundText').show().html("<div id='instructionHeader'>INSTRUKCJA GRY</div>" +
    //         "<div class='instructionPoint'>CEL GRY: " +
    //         "   <span class='instructionPointText'>uzyskać jak najwięcej punktów</span></div>" +
    //         "<div class='instructionPoint'>STEROWANIE:" +
    //         "   <img class='instructionImgMouse' src='images/instructionMouseControl.png'> ," +
    //         "   <img class='instructionImgMouse' src='images/instructionMouseButton.png'>" +
    //         "</div>" +
    //         "<div class='instructionPoint'>POZIOM TRUDNOŚCI: " +
    //         "   <span class='instructionPointText'>łatwy, średni, trudny</span></div>" +
    //         "<div class='instructionPoint'>CZAS: " +
    //         "   <span class='instructionPointText'>30s runda</span></div>" +
    //         "<div class='instructionPoint'>PUNKTY: " +
    //         "   <span class='instructionPointText'><img id='instructionImgCoin' src='images/coin.png'> +1</span>" +
    //         "   <span class='instructionPointText'> <img id='instructionImgThief' src='images/thief.png'>-1</span>" +
    //         "</div>" +
    //         "<div class='instructionPoint'>KONIEC GRY: " +
    //         "   <span class='instructionPointText'>< 70% punktów w rundzie</span></div>" +
    //         "<button id='instructionCloseButton' class='btn btn-default center-block'>Zamknij</button>");
    //     $('#coverRound').addClass('instructionBackground');
    //     $('#coverRound').addClass('coverRoundShow');
    // }

    function showInstruction() {
        menuDisabled();
        $('#gameInstruction').show();
        $coverRound.addClass('instructionBackground');
        $coverRound.addClass('coverRoundShow');
    }

    $('#instructionButton').click(function () {
        menuDisabled();
        showInstruction();
        $coverRound.show();
    });

    $('#instructionCloseButton').click(function () {
        menuEnabled();
        $stopButton.attr('disabled', 'disabled');
        $coverRound.hide();
        $('#gameInstruction').hide();
    });

    $('#gameEndCloseButton').click(function () {
        menuEnabled();
        $stopButton.attr('disabled', 'disabled');
        $('#gameEnd').hide();
        $coverRound.hide();
    });

    $('#rankingButton').click(function () {
        menuDisabled();
        $('#scores').show();
        $('#coverRound').show();
        mangingScoreList(0, "easyLevel");
    });

    function menuDisabled() {
        $playButton.attr('disabled', 'disabled');
        $stopButton.attr('disabled', 'disabled');
        $difficultyLevelChecked.attr('disabled', 'disabled');
        $('#rankingButton').attr('disabled', 'disabled');
        $('#instructionButton').attr('disabled', 'disabled');
    }

    function menuEnabled() {
        $playButton.removeAttr('disabled');
        $stopButton.removeAttr('disabled');
        $difficultyLevelChecked.removeAttr('disabled');
        $('#rankingButton').removeAttr('disabled');
        $('#instructionButton').removeAttr('disabled');
    }
}

var game = new CreateGame();
