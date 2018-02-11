var $gamePlace = $('#game');

function CreateBox(id) {
    var height;
    var id = id;
    var boxState = 0;

    return {
        insertBox: function (difficultyLevel) {
            switch (difficultyLevel) {
                case 9:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-4">' +
                        '<img src="images/safe_door.png" class="safeDoor">' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    height = $gamePlace.height() / 3;
                    break;
                case 16:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-3">' +
                        '<img src="images/safe_door.png" class="safeDoor">' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    height = $gamePlace.height() / 4;
                    break;
                case 25:
                    $gamePlace.append($('<div id="' + id + '" class="playArea col-xs-4">' +
                        '<img src="images/safe_door.png" class="safeDoor">' +
                        '<img src="images/coin.png" class="coin">' +
                        '<img src="images/thief.png" class="thief"></div>'));
                    height = $gamePlace.height() / 5;
                    $('.playArea').css({
                        display: 'inline - block',
                        float: 'left',
                        width: '20%'
                    });
                    break;
            }
            $('#' + id).height(height);
        },

        getBoxState: function () {
            return boxState;
        },

        setActiveBox: function (goodBad) {
            if (goodBad) {
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(-90deg)');
                $('#' + id).addClass('active');
                $('#' + id + ' .coin').show();
                boxState = 1;
            } else {
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(-90deg)');
                $('#' + id + ' .thief').show();
                $('#' + id).addClass('active');
                boxState = 2;
            }
        },

        removeActiveBox: function () {
            if (boxState) {
                $('#' + id + ' .coin').hide();
                $('#' + id + ' .safeDoor').css('transform', 'rotateY(0deg)');
                $('#' + id).removeClass('active');
                boxState = 0;
                $('#' + id + ' .thief').hide();
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
    var level = 1;
    var score = 0;
    var roundScore = 0;
    var totalRoundPoints = 0;
    var setGameTime = 30;
    var seconds;
    var timeCounterInterval;
    var timeBetweenBoxes = 2000;
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
                quantityBox = 9;
                frequencyOfTheThiefShow = 10;
                break;
            case 16:
                timeBetweenBoxes = 1400;
                quantityBox = 16;
                frequencyOfTheThiefShow = 5;
                break;
            case 25:
                timeBetweenBoxes = 1000;
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
        $('#play').attr('disabled', 'disabled'); //wyłącza możliwość ponownego startu
        $difficultyLevelChecked.attr('disabled', 'disabled'); //wyłącza możliwość wyboru trudności
        $('#stop').removeAttr('disabled');
        $('#level').text(level); // wyświetla która runda
        timeCounterInterval = setInterval(function () {
            seconds = setGameTime % 60;
            $('#timeToEnd').text('0:' + seconds);
            if (seconds === 0) { // end round time
                setGameTime = 30;
                clearInterval(timeCounterInterval);
                clearInterval(activeGameInterval);
                clearTimeout(activeBoxInterval);
                gameArea[divColor].removeActiveBox();
                if (roundScore >= (totalRoundPoints / 100) * 70) {  // play next round
                    level++;
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
                    level = 1;
                    $('#play').removeAttr('disabled');
                    $difficultyLevelChecked.removeAttr('disabled');
                    gameArea[divColor].removeActiveBox();
                    divColor = 0;
                    totalRoundPoints = 0;
                }
                roundScore = 0;
            } else {
                setGameTime--;
            }
        }, 1000);

//      Tworzymy nowy podświetlany box co pewnien okres czasu
        activeGameInterval = setInterval(function () {
            // $('#' + divColor).removeClass('activeGood');
            gameArea[divColor].removeActiveBox();
            if (setGameTime >= (timeBetweenBoxes / 1000)) {
                divColor = Math.floor(Math.random() * quantityBox);
                // $('#' + divColor).addClass('activeGood');
                goodBadBox = Math.round(Math.random() * frequencyOfTheThiefShow);
                gameArea[divColor].setActiveBox(goodBadBox);
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
                    score++;
                    roundScore++;
                }
                if (boxState === 2) {
                    gameArea[boxNumber].removeActiveBox();
                    score--;
                }
                $('#gameScore').text(score);
            }
        });
    }

    function stopGame() {
        setGameTime = 30;
        clearInterval(timeCounterInterval);
        clearInterval(activeGameInterval);
        clearTimeout(activeBoxInterval);
        gameArea[divColor].removeActiveBox();
        showResult();
        score = 0;
        level = 1;
        setGameTime = 30;
        $('#play').removeAttr('disabled');
        $difficultyLevelChecked.removeAttr('disabled');
        $('#level').text(" ");
        $('#gameScore').text(score);
        $('#timeToEnd').text('0:' + setGameTime);
    }

    function showResult() {
        $('#roundText').show().html("<div id='endGameText'>KONIEC GRY</div><div id='endGameScoreText'>Twój wynik: " + score + "</div>");
        $('#coverRound').show();
        $('#coverRound').addClass('instructionBackground');
        $('#coverRound').addClass('coverRoundShow');
    }

    function counter() {
        $('#coverRound').removeClass('coverRoundShow');
        $('#play').attr('disabled', 'disabled');
        $('#stop').attr('disabled', 'disabled');
        $difficultyLevelChecked.attr('disabled', 'disabled');
        $('#roundText').hide();
        $('#coverRound').css("box-shadow", "none");
        $('#coverRound').removeClass('instructionBackground')
        $('#coverRound').show();
        var countNumber = 3;
        var countTimeout = setInterval(function () {
            if (countNumber > 0) {
                // $('#roundText').text(countNumber);
                $('#roundText').text(countNumber).fadeIn(700, function () {
                    $(this).hide();
                });
            } else if (countNumber === 0) {
                $('#roundText').text('START').fadeIn(700, function () {
                    $(this).hide();
                });
            } else {
                $('#roundText').hide();
                $('#coverRound').hide();
                clearInterval(countTimeout);
                startGame();
                return;
            }
            countNumber--;
        }, 800);
    }

    function showRound() {
        $('#coverRound').show();
        $('#roundText').text('Runda ' + level).fadeIn(700);
        var timeout = setTimeout(function () {
            $('#coverRound').hide();
            $('#roundText').hide();
            clearTimeout(timeout);
            startGame();
            return
        }, 700);
    }

    function showInstruction() {
        $('#play').attr('disabled', 'disabled');
        $('#stop').attr('disabled', 'disabled');
        $difficultyLevelChecked.attr('disabled', 'disabled');
        $('#roundText').css('text-align', 'left');
        $('#roundText').show().html("<div id='instructionHeader'>INSTRUKCJA GRY</div>" +
            "<div class='instructionPoint'>CEL GRY: " +
            "   <span class='instructionPointText'>uzyskać jak najwięcej punktów</span></div>" +
            "<div class='instructionPoint'>STEROWANIE:" +
            "   <img class='instructionImgMouse' src='images/instructionMouseControl.png'> ," +
            "   <img class='instructionImgMouse' src='images/instructionMouseButton.png'>" +
            "</div>" +
            "<div class='instructionPoint'>POZIOM TRUDNOŚCI: " +
            "   <span class='instructionPointText'>łatwy, średni, trudny</span></div>" +
            "<div class='instructionPoint'>CZAS: " +
            "   <span class='instructionPointText'>30s runda</span></div>" +
            "<div class='instructionPoint'>PUNKTY: " +
            "   <span class='instructionPointText'><img id='instructionImgCoin' src='images/coin.png'> +1</span>" +
            "   <span class='instructionPointText'> <img id='instructionImgThief' src='images/thief.png'>-1</span>" +
            "</div>" +
            "<div class='instructionPoint'>KONIEC GRY: " +
            "   <span class='instructionPointText'>< 70% punktów w rundzie</span></div>" +
            "<button id='instructionCloseButton' class='btn btn-default center-block'>Zamknij</button>");
        $('#coverRound').addClass('instructionBackground');
        $('#coverRound').addClass('coverRoundShow');
    }

    $('#instructionCloseButton').click(function () {
        $('#coverRound').hide();
        $('#play').removeAttr('disabled');
        $difficultyLevelChecked.removeAttr('disabled');
    })

}

var game = new CreateGame();
