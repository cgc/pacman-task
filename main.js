/*jslint browser: true, undef: true, eqeqeq: true, nomen: true, white: true */
/*global window: false, document: false */

/*
 * fix looped audio
 * add fruits + levels
 * fix what happens when a ghost is eaten (should go back to base)
 * do proper ghost mechanics (blinky/wimpy etc)
 */

var NONE        = 4,
    UP          = 3,
    LEFT        = 2,
    DOWN        = 1,
    RIGHT       = 11,
    WAITING     = 5,
    PAUSE       = 6,
    PLAYING     = 7,
    COUNTDOWN   = 8,
    EATEN_PAUSE = 9,
    DYING       = 10,
    Pacman      = {};

Pacman.userStartPos = null;
Pacman.ghostStartPos = null;
Pacman.totalTrials = 1;
Pacman.randomTrial = null;
Pacman.FPS = 15;
Pacman.attackVar1 = false;
Pacman.AFPS = 5;
Pacman.countdownCheck = false;
Pacman.escaped = false;
Pacman.totalTime = performance.now();
Pacman.trialTime = performance.now();
Pacman.timeArray = [];
Pacman.ghostLocationArray = [];
Pacman.userLocationArray = [];
Pacman.bisc1Array = [];
Pacman.bisc2Array = [];
Pacman.bisc3Array = [];
Pacman.bisc4Array = [];
Pacman.bisc5Array = [];
Pacman.attackArray = [];
Pacman.chaseArray = [];
Pacman.eatenArray = [];
Pacman.scoreArray = [];
Pacman.lives = null;
Pacman.startingPositions = [
    [1,160,100  ],
    [2,80,160  ],
    [3,80,160  ],
    [4,70,150  ],
    [5,160,100  ],
    [6,120,40  ],
    [7,50,130  ],
    [8,160,100  ],
    [9,160,100  ],
    [10,50,130  ],
    [11,30,null  ],
    [12,20,100  ],
    [13,60,140  ],
    [14,60,140  ],
    [15,120,null  ],
    [16,130,50  ],
    [17,60,140  ],
    [18,160,90  ],
    [19,80,160  ],
    [20,70,150  ],
    [21,150,70  ],
    [22,20,null  ],
    [23,50,130  ],
    [24,120,40  ],
    [25,60,140  ],
    [26,160,null  ],
    [27,160,90  ],
    [28,160,90  ],
    [29,30,110  ],
    [30,50,130  ],
    [31,40,120  ],
    [32,30,110  ],
    [33,60,140  ],
    [34,20,100  ],
    [35,50,130  ],
    [36,20,100  ],
    [37,80,160  ],
    [38,130,50  ],
    [39,50,null  ],
    [40,30,110  ],
    [41,140,60  ],
    [42,120,40  ],
    [43,130,50  ],
    [44,20,null  ],
    [45,140,null  ],
    [46,160,90  ],
    [47,160,null  ],
    [48,80,160  ],
    [49,70,150  ],
    [50,120,40  ],
    [51,30,110  ],
    [52,160,80  ],
    [53,120,40  ],
    [54,150,70  ],
    [55,60,140  ],
    [56,60,140  ],
    [57,60,140  ],
    [58,30,110  ],
    [59,160,80  ],
    [60,70,150  ],
    [61,150,70  ],
    [62,160,null  ],
    [63,70,150  ],
    [64,160,100  ],
    [65,30,110  ],
    [66,40,null  ],
    [67,20,100  ],
    [68,120,40  ],
    [69,160,90  ],
    [70,120,40  ],
    [71,160,80  ],
    [72,50,130  ],
    [73,120,40  ],
    [74,130,50  ],
    [75,30,110  ],
    [76,50,130  ],
    [77,20,100  ],
    [78,70,150  ],
    [79,30,110  ],
    [80,30,null  ],
    [81,50,130  ],
    [82,130,50  ],
    [83,120,40  ],
    [84,80,160  ],
    [85,30,110  ],
    [86,140,60  ],
    [87,50,130  ],
    [88,20,null  ],
    [89,30,110  ],
    [90,50,130  ],
    [91,60,140  ],
    [92,30,110  ],
    [93,50,130  ],
    [94,60,null  ],
    [95,160,90  ],
    [96,70,150  ],
    [97,140,60  ],
    [98,130,50  ],
    [99,130,50  ],
    [100,160,80  ],
    [101,80,160  ],
    [102,80,160  ],
    [103,140,60  ],
    [104,140,60  ],
    [105,50,130  ],
    [106,160,80  ],
    [107,130,50  ],
    [108,160,90  ],
    [109,120,40  ],
    [110,160,90  ],
    [111,60,140  ],
    [112,160,100  ],
    [113,160,80  ],
    [114,20,100  ],
    [115,120,40  ],
    [116,20,100  ],
    [117,120,40  ],
    [118,160,null  ],
    [119,30,110  ],
    [120,50,130  ],
    [121,140,60  ],
    [122,120,40  ],
    [123,130,50  ],
    [124,50,130  ],
    [125,160,90  ],
    [126,160,null  ],
    [127,60,140  ],
    [128,130,50  ],
    [129,80,160  ],
    [130,130,50  ],
    [131,130,50  ],
    [132,60,140  ],
    [133,20,100  ],
    [134,160,90  ],
    [135,70,150  ],
    [136,160,90  ],
    [137,160,90  ],
    [138,30,110  ],
    [139,140,60  ],
    [140,130,50  ],
    [141,160,null  ],
    [142,40,120  ],
    [143,160,80  ],
    [144,60,null  ],
    [145,160,80  ],
    [146,160,80  ],
    [147,130,50  ],
    [148,120,40  ],
    [149,160,100  ],
    [150,30,110  ],
    [151,20,100  ],
    [152,140,60  ],
    [153,20,100  ],
    [154,140,60  ],
    [155,160,90  ],
    [156,120,40  ],
    [157,130,50  ],
    [158,150,70  ],
    [159,40,120  ],
    [160,160,80  ],
    [161,120,40  ],
    [162,160,90  ],
    [163,40,120  ],
    [164,150,null  ],
    [165,50,130  ],
    [166,30,110  ],
    [167,30,110  ],
    [168,160,90  ],
    [169,160,100  ],
    [170,160,90  ],
    [171,30,110  ],
    [172,60,140  ],
    [173,20,100  ],
    [174,60,140  ],
    [175,40,120  ],
    [176,30,110  ],
    [177,30,110  ],
    [178,50,null  ],
    [179,160,100  ],
    [180,60,140  ],
    [181,50,130  ],
    [182,150,70  ],
    [183,20,100  ],
    [184,160,90  ],
    [185,120,40  ],
    [186,150,70  ],
    [187,40,120  ],
    [188,70,150  ],
    [189,40,120  ],
    [190,150,70  ],
    [191,30,110  ],
    [192,160,90  ],
    [193,160,90  ],
    [194,70,150  ],
    [195,130,50  ],
    [196,70,150  ],
    [197,150,null  ],
    [198,150,70  ],
    [199,120,40  ],
    [200,130,50  ]
];


Pacman.User = function (game, map) {

    var
        direction = null,
        eaten     = null,
        due       = null,
        lives     = null,
        trials = null,
        score     = 5,
        keyMap    = {},
        over = true,
        //ghost = new Pacman.Ghost(game, map, "#FF00FF"),
        position = null;

    keyMap[KEY.ARROW_LEFT]  = LEFT;
    keyMap[KEY.ARROW_UP]    = UP;
    keyMap[KEY.ARROW_RIGHT] = RIGHT;
    keyMap[KEY.ARROW_DOWN]  = DOWN;

    function addScore(nScore) {
        score += nScore;
        if (score >= 10000 && score - nScore < 10000) {
            lives += 1;
        }
    };

    function theScore() {
        return score;
    };

    function loseLife() {
        lives -= 1;
        trials--;
    };

    function getLives() {
        return lives;
    };

    function getTrials() {
        return trials;
    };

    function getDirection() {
        return direction;
    };

    function getDue() {
        return due;
    }

    function setEaten(num) {
        eaten = num;
    }

    function initUser() {
        score = 0;
        if (lives !== 0) {
            trials = 20;
        }
        lives = 3;
        newLevel();
    }

    function newLevel() {
        resetPosition();
        over = true;
        eaten = 0;
    };

    function resetPosition() {
        Pacman.randomTrial = Math.floor(Math.random() * 201);
        if (Pacman.randomTrial >= 200) {
            Pacman.randomTrial = 199;
        } else if (Pacman.randomTrial < 1) {
            Pacman.randomTrial = 1;
        }
        console.assert(Pacman.randomTrial <= 201 || Pacman.randomTrial >= 0, Pacman.randomTrial);
        position = {"x": Pacman.startingPositions[Pacman.randomTrial][1], "y": 100};
        direction = NONE;
        due = NONE;
    };

    function reset() {
        initUser();
        resetPosition();
        Pacman.attackVar1 = false;
    };

    function keyDown(e) {
        if (typeof keyMap[e.keyCode] !== "undefined") {
            due = keyMap[e.keyCode];
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    };

    function getNewCoord(dir, current) {
        return {
            "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
            "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
        };
    };


    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function pointToCoord(x) {
        return Math.round(x/10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function next(pos, dir) {
        return {
            "y" : pointToCoord(nextSquare(pos.y, dir)),
            "x" : pointToCoord(nextSquare(pos.x, dir)),
        };
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function isOnSamePlane(due, dir) {
        return ((due === LEFT || due === RIGHT) &&
            (dir === LEFT || dir === RIGHT)) ||
            ((due === UP || due === DOWN) &&
                (dir === UP || dir === DOWN));
    };

    function move(ctx) {

        var npos        = null,
            nextWhole   = null,
            oldPosition = position,
            block       = null;

        if (due !== direction) {
            npos = getNewCoord(due, position);

            if (isOnSamePlane(due, direction) ||
                (onGridSquare(position) &&
                    map.isFloorSpace(next(npos, due)))) {
                direction = due;
            } else {
                npos = null;
            }
        }
        if (position.x === 10 || position.x === 170) {
            console.log("Escaped.");
            console.log("\n");
            game.completedLevel();
            Pacman.escaped = true;
            trials--;
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

        if (onGridSquare(position) && map.isWallSpace(next(npos, direction))) {
            direction = NONE;
        }

        if (direction === NONE) {
            return {"new" : position, "old" : position};
        }

        if (npos.y === 100 && npos.x >= 190 && direction === RIGHT) {
            npos = {"y": 100, "x": -10};
        }

        if (npos.y === 100 && npos.x <= -12 && direction === LEFT) {
            npos = {"y": 100, "x": 190};
        }

        position = npos;
        nextWhole = next(position, direction);

        block = map.block(nextWhole);


        if ((isMidSquare(position.y) || isMidSquare(position.x)) &&
            block === Pacman.BISCUIT || block === Pacman.PILL) {
            let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
            if (userPosition <= 80) {
                if (nextWhole.x === (userPosition / 10) + 2) {
                    Pacman.bisc1Array.push("True");
                    addScore(10);
                } else if (nextWhole.x === (userPosition / 10) + 3) {
                    Pacman.bisc2Array.push("True");
                    addScore(20);
                } else if (nextWhole.x === (userPosition / 10) + 4) {
                    Pacman.bisc3Array.push("True");
                    addScore(30);
                } else if (nextWhole.x === (userPosition / 10) + 5) {
                    Pacman.bisc4Array.push("True");
                    addScore(40);
                } else if (nextWhole.x === (userPosition / 10) + 6) {
                    Pacman.bisc5Array.push("True");
                    addScore(50);
                }
            } else {
                if (nextWhole.x === (userPosition / 10) - 2) {
                    Pacman.bisc1Array.push("True");
                    addScore(10);
                } else if (nextWhole.x === (userPosition / 10) - 3) {
                    Pacman.bisc2Array.push("True");
                    addScore(20);
                } else if (nextWhole.x === (userPosition / 10) - 4) {
                    Pacman.bisc3Array.push("True");
                    addScore(30);
                } else if (nextWhole.x === (userPosition / 10) - 5) {
                    Pacman.bisc4Array.push("True");
                    addScore(40);
                } else if (nextWhole.x === (userPosition / 10) - 6) {
                    Pacman.bisc5Array.push("True");
                    addScore(50);
                }
            }
            map.setBlock(nextWhole, Pacman.EMPTY);
           /* if (position.x < 110 && over) {
                if (position.x === 62 || position.x === 78) {
                    addScore(10);
                } else if (position.x === 72 || position.x === 88) {
                    addScore(20);
                } else if (position.x === 82 || position.x === 98) {
                    addScore(30);
                } else if (position.x === 92 || position.x === 108) {
                    addScore(40);
                } else if (position.x === 102 || position.x === 118) {
                    addScore(50);
                }
            } else {
                over = false;
                if (position.x === 118 || position.x === 102) {
                    addScore(10);
                } else if (position.x === 108 || position.x === 92) {
                    addScore(20);
                } else if (position.x === 98 || position.x === 82) {
                    addScore(30);
                } else if (position.x === 88 || position.x === 72) {
                    addScore(40);
                } else if (position.x === 78 || position.x === 62) {
                    addScore(50);
                }
            } */
            //addScore((block === Pacman.BISCUIT) ? 10 : 50);
            eaten += 1;

          /*  if (eaten === 5) {
                game.completedLevel();
                trials--;
            } */

            if (block === Pacman.PILL) {
                game.eatenPill();
            }
        } else {
            Pacman.bisc1Array.push("False");
            Pacman.bisc2Array.push("False");
            Pacman.bisc3Array.push("False");
            Pacman.bisc4Array.push("False");
            Pacman.bisc5Array.push("False");
        }
        return {
            "new" : position,
            "old" : oldPosition
        };

    };
    function getPosition() {
        return position;
    };

    function isMidSquare(x) {
        var rem = x % 10;
        return rem > 3 || rem < 7;
    };

    function calcAngle(dir, pos) {
        if (dir == RIGHT && (pos.x % 10 < 5)) {
            return {"start":0.25, "end":1.75, "direction": false};
        } else if (dir === DOWN && (pos.y % 10 < 5)) {
            return {"start":0.75, "end":2.25, "direction": false};
        } else if (dir === UP && (pos.y % 10 < 5)) {
            return {"start":1.25, "end":1.75, "direction": true};
        } else if (dir === LEFT && (pos.x % 10 < 5)) {
            return {"start":0.75, "end":1.25, "direction": true};
        }
        return {"start":0, "end":2, "direction": false};
    };

    function drawDead(ctx, amount) {

        var size = map.blockSize,
            half = size / 2;

        if (amount >= 1) {
            return;
        }

        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.moveTo(((position.x/10) * size) + half,
            ((position.y/10) * size) + half);

        ctx.arc(((position.x/10) * size) + half,
            ((position.y/10) * size) + half,
            half, 0, Math.PI * 2 * amount, true);

        ctx.fill();
    };

    function draw(ctx) {

        var s     = map.blockSize,
            angle = calcAngle(direction, position);

        ctx.fillStyle = "#FFFF00";

        ctx.beginPath();

        ctx.moveTo(((position.x/10) * s) + s / 2,
            ((position.y/10) * s) + s / 2);

        ctx.arc(((position.x/10) * s) + s / 2,
            ((position.y/10) * s) + s / 2,
            s / 2, Math.PI * angle.start,
            Math.PI * angle.end, angle.direction);

        ctx.fill();
    };

    function getEaten() {
        return eaten;
    }

    initUser();

    return {
        "draw"          : draw,
        "over"          : over,
        "drawDead"      : drawDead,
        "loseLife"      : loseLife,
        "getLives"      : getLives,
        "getTrials"     : getTrials,
        "getPosition"  : getPosition,
        "score"         : score,
        "getEaten" : getEaten,
        "setEaten" :setEaten,
        "getDirection"  : getDirection,
        "getDue"        : getDue,
        "addScore"      : addScore,
        "theScore"      : theScore,
        "keyDown"       : keyDown,
        "move"          : move,
        "newLevel"      : newLevel,
        "reset"         : reset,
        "resetPosition" : resetPosition,
        "getNewCoord"   : getNewCoord
    };
};

Pacman.Ghost = function (game, map, colour) {

    var position = null,
        direction = null,
        eatable = null,
        eaten = null,
        due = null,
        attackVar = false,
        chaseVar = false,
        bobVar = false,
        bobCount = 0,
        distanceVar = null,
        chaseCount = null,
        attackCount = null,
        attackDist = null,
        wallDist = null,
        tracker2 = null,
        tracker4 = Math.random(),
        fps = 18,
        pacman2 = new Pacman.User(game, map);

    function getNewCoord(dir, current) {
        /* return {
             "x": current.x + (dir === LEFT && -2 || dir === RIGHT && 2 || 0),
             "y": current.y + (dir === DOWN && 2 || dir === UP    && -2 || 0)
         } */

        var speed = isVunerable() ? 1 : isHidden() ? 4 : 2,
            xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0),
            ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);

        return {
            "x": addBounded(current.x, xSpeed),
            "y": addBounded(current.y, ySpeed)
        };
    };

    function getAttackSpeed(x, min_speed_to_catch, max_ghost_speed) {
        let speed = x * (max_ghost_speed -  min_speed_to_catch) + min_speed_to_catch;
        return speed;
    }

    function getNewAttackCoord(x, y, tracker4) {
       // let moveAmount = Math.ceil(wallDist / attackDist) * 4;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
           // if (x - moveAmount < PACMAN.getUserPos()) {
            if (x - 3 < PACMAN.getUserPos()) {
                return {
                    "x" : PACMAN.getUserPos(),
                    "y" : y
                }
            } else {
                let max_time_to_catch = (PACMAN.getUserPos() - 10) / 2;
                let min_speed_to_catch = (PACMAN.getGhostPos() - PACMAN.getUserPos()) / max_time_to_catch;
                let min_ghost_speed = Math.max(min_speed_to_catch, 2);
                let max_ghost_speed = 5;
                let ghost_attack_speed = getAttackSpeed(tracker4, min_ghost_speed, max_ghost_speed);
                console.log("max_time_to_catch: " + max_time_to_catch);
                console.log("G + P distance: " + (PACMAN.getGhostPos() - PACMAN.getUserPos()));
                console.log("max speed: " + max_ghost_speed);
                console.log("min speed: " + min_ghost_speed);
                console.log("attack speed: " + ghost_attack_speed);
                return {
                    "x" : x - ghost_attack_speed,
                    "y" : y
                }

            }
        } else {
            //if (x + moveAmount > PACMAN.getUserPos()) {
            if (x + 3 > PACMAN.getUserPos()) {
                return {
                    "x" : PACMAN.getUserPos,
                    "y" : y
                }
            } else {
              let max_time_to_catch = (( 170 - PACMAN.getUserPos() ) / 2);
              let min_speed_to_catch = (PACMAN.getUserPos() - PACMAN.getGhostPos()) / max_time_to_catch;
              let min_ghost_speed = Math.max(min_speed_to_catch, 2);
              let max_ghost_speed = 5;
              let ghost_attack_speed = getAttackSpeed(tracker4, min_ghost_speed, max_ghost_speed);
              console.log("max_time_to_catch: " + max_time_to_catch);
              console.log("G + P distance: " + (PACMAN.getUserPos() - PACMAN.getGhostPos()));
              console.log("max speed: " + max_ghost_speed);
              console.log("min speed: " + min_ghost_speed);
              console.log("attack speed: " + ghost_attack_speed);
              return {
                  "x" : x + ghost_attack_speed,
                  "y" : y
              }
            }
        }
    }

    /* Collision detection(walls) is done when a ghost lands on an
     * exact block, make sure they dont skip over it
     */
    function addBounded(x1, x2) {
        var rem = x1 % 10,
            result = rem + x2;
        if (rem !== 0 && result > 10) {
            return x1 + (10 - rem);
        } else if (rem > 0 && result < 0) {
            return x1 - rem;
        }
        return x1 + x2;
    };

    function isVunerable() {
        return eatable !== null;
    };

    function isDangerous() {
        return eaten === null;
    };

    function isHidden() {
        return eatable === null && eaten !== null;
    };

    function getRandomDirection() {
       /* var moves = (direction === LEFT || direction === RIGHT)
            ? [UP, DOWN] : [LEFT, RIGHT];
        return moves[Math.floor(Math.random() * 2)]; */
        let x = Math.random() * 100;
        if (x >= 50) {
            return 11;
        } else {
            return 2;
        }
    };

    function reset() {
        eaten = null;
        eatable = null;
        position = {"x": Pacman.startingPositions[Pacman.randomTrial][2], "y": 100};
       /* let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
        if (position.x > userPosition) {
            for (let i = 2; i < 7; i+=1) {
                Pacman.MAP[10][(userPosition / 10) + i] = Pacman.BISCUIT;
                map = Pacman.MAP;
                ctx.fillStyle = "#FFF";
                ctx.fillRect((((userPosition / 10) + i) * map.blockSize) + (map.blockSize / 2.5),
                    (10 * map.blockSize) + (map.blockSize / 2.5),
                    map.blockSize / 6, map.blockSize / 6);
            }
        } else {
            for (let i = 2; i < 7; i++) {
                Pacman.MAP[10][(userPosition / 10) - i] = Pacman.BISCUIT;
                map = Pacman.MAP;
                ctx.fillStyle = "#FFF";
                ctx.fillRect((((userPosition / 10) - i) * map.blockSize) + (map.blockSize / 2.5),
                    (10 * map.blockSize) + (map.blockSize / 2.5),
                    map.blockSize / 6, map.blockSize / 6);
            }
        } */
        direction = getRandomDirection();
        due = getRandomDirection();
        attackVar = false;
        chaseVar = false;
        chaseCount = 0;
        attackCount = 0;
    };

    function onWholeSquare(x) {
        return x % 10 === 0;
    };

    function oppositeDirection(dir) {
        return dir === LEFT && RIGHT ||
            dir === RIGHT && LEFT;
    };

    function makeEatable() {
        direction = oppositeDirection(direction);
        eatable = game.getTick();
    };

    function eat() {
        eatable = null;
        eaten = game.getTick();
    };

    function pointToCoord(x) {
        return Math.round(x / 10);
    };

    function nextSquare(x, dir) {
        var rem = x % 10;
        if (rem === 0) {
            return x;
        } else if (dir === RIGHT || dir === DOWN) {
            return x + (10 - rem);
        } else {
            return x - rem;
        }
    };

    function onGridSquare(pos) {
        return onWholeSquare(pos.y) && onWholeSquare(pos.x);
    };

    function secondsAgo(tick) {
        return (game.getTick() - tick) / fps;
    };

    function getColour() {
        if (eatable) {
            if (secondsAgo(eatable) > 5) {
                return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB";
            } else {
                return "#0000BB";
            }
        } else if (eaten) {
            return "#222";
        }
        return colour;
    };

    function draw(ctx) {
       /* if (attackVar === true) {

        } */

        var s = map.blockSize,
            top = (position.y / 10) * s,
            left = (position.x / 10) * s;

        if (eatable && secondsAgo(eatable) > 8) {
            eatable = null;
        }

        if (eaten && secondsAgo(eaten) > 3) {
            eaten = null;
        }

        var tl = left + s;
        var base = top + s - 3;
        var inc = s / 10;

        var high = game.getTick() % 10 > 5 ? 3 : -3;
        var low = game.getTick() % 10 > 5 ? -3 : 3;

        ctx.fillStyle = getColour();
        ctx.beginPath();

        ctx.moveTo(left, base);

        ctx.quadraticCurveTo(left, top, left + (s / 2), top);
        ctx.quadraticCurveTo(left + s, top, left + s, base);

        // Wavy things at the bottom
        ctx.quadraticCurveTo(tl - (inc * 1), base + high, tl - (inc * 2), base);
        ctx.quadraticCurveTo(tl - (inc * 3), base + low, tl - (inc * 4), base);
        ctx.quadraticCurveTo(tl - (inc * 5), base + high, tl - (inc * 6), base);
        ctx.quadraticCurveTo(tl - (inc * 7), base + low, tl - (inc * 8), base);
        ctx.quadraticCurveTo(tl - (inc * 9), base + high, tl - (inc * 10), base);

        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.arc(left + 6, top + 6, s / 6, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
        ctx.closePath();
        ctx.fill();

        var f = s / 12;
        var off = {};
        off[RIGHT] = [f, 0];
        off[LEFT] = [-f, 0];
        //off[UP]    = [0, -f];
        //off[DOWN]  = [0, f];

        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(left + 6, top + 6,
            s / 15, 0, 300, false);
        ctx.arc((left + s) - 6, top + 6,
            s / 15, 0, 300, false);
        ctx.closePath();
        ctx.fill();

    };

    function pane(pos) {

        if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
            return {"y": 100, "x": -10};
        }

        if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
            return position = {"y": 100, "x": 190};
        }

        return false;
    };

    function distance() {
        distanceVar = Math.abs(PACMAN.getGhostPos() - PACMAN.getUserPos())
        return distanceVar;
    }

    function chase(ctx) {
        console.log("Chased.")
        Pacman.chaseArray.push("True");
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            due = LEFT;
            direction = LEFT;
            let oldPos = position;
            position = getNewCoord(due, position);
            return {
                "new" : position,
                "old" : oldPos
            }
        } else {
            due = RIGHT;
            direction = RIGHT;
            let oldPos = position;
            position = getNewCoord(due, position);
            return {
                "new" : position,
                "old" : oldPos
            }
        }
    }

  /*  function bob(ctx) {
        due = oppositeDirection(due);
        direction = oppositeDirection(direction);
        bobCount = 0;
        return getNewCoord(due, position);
    } */

    function attack(ctx) {
        console.log("Attacked.");
        Pacman.attackArray.push("True");
         Pacman.attackVar1 = true;
        attackVar = true;
        let npos;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            direction = LEFT;
            due = LEFT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x ,PACMAN.getGhostPosY(), tracker4);
            position = npos;
            return {
                "new": position,
                "old": oldPos
            };
        } else {
            direction = RIGHT;
            due = RIGHT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x, PACMAN.getGhostPosY(), tracker4);
            position = npos;
            return {
                "new" : position,
                "old" : oldPos
            };
        }
        //PACMAN.loseLife();
        //PACMAN.completedLevel();
    }

    function getX() {
        return position.x;
    }

    function distanceToLambda(x) {
        const n = 161;
        const arr = [...Array(n).keys()];
        let lambda = arr.indexOf(x);
        let xMax = 10;
        let xMin = 0;
        let yMax = 160;
        let yMin = 0;
        const retArr = [];
        for (const i in arr) {
            let percent = (i - yMin) / (yMax - yMin);
            let outputX = percent * (xMax - xMin) + xMin;
            retArr.push(outputX);
        }
        // retArr.sort().reverse();
        return retArr[lambda];
    }

    function survival(lambda_dist) {

        let re = ( 1 - (1 / (1 + (Math.E ** ((lambda_dist - 1.75) * -5)))) ) / 10;
        return re;
    }

    function chase_chance(lambda_dist) {

        let re = ( 1 - (1 / (1 + (Math.E ** ((lambda_dist - 1.75) * -3)))) ) / 10;
        return re;
    }


    function move(ctx) {

        var oldPos = position
        onGrid = onGridSquare(position),
            npos = null;
        if (due !== direction) {

            npos = getNewCoord(due, position);

            if (onGrid &&
                map.isFloorSpace({
                    "y": pointToCoord(nextSquare(npos.y, due)),
                    "x": pointToCoord(nextSquare(npos.x, due))
                })) {
                direction = due;
            } else {
                npos = null;
            }
        }

        if (npos === null) {
            npos = getNewCoord(direction, position);
        }

    if (onGrid &&
        map.isWallSpace({
            "y": pointToCoord(nextSquare(npos.y, direction)),
            "x": pointToCoord(nextSquare(npos.x, direction))
        })) {

        due = oppositeDirection(due);
        direction = oppositeDirection(direction);
        return move(ctx);
    }

    //let tracker = Math.random() * 100;
    if (!isNaN(distance())) {
        let lambda_dist = distanceToLambda(distance());
        const now = performance.now();
        tracker2 = Math.random();
        console.log("Time since start of trial:" + (((now - Pacman.trialTime) / 1000) - 2));
        let probOfAttack = survival(lambda_dist);
        let probOfChase =  chase_chance(lambda_dist);
        console.log("Tracker: " + tracker2);
        console.log("probOfAttack: " + probOfAttack);
        console.log("Chase Value: " + probOfChase);
        //if (chaseVar === false && bobVar === false) {
            //console.log(now.getSeconds() + "." + now.getMilliseconds());
            //console.log(tracker2, probOfAttack);
        //console.log(attackVar);
        //console.log(chaseVar);
            if (( (tracker2 < probOfAttack ) || attackVar === true) && chaseVar === false) {
                console.log("In attack");
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                        wallDist = PACMAN.getUserPos();
                    }
                }
                attackVar = true;
                attackCount++;
                return attack(ctx);
            } else if ( (tracker2 <= probOfChase) ||
                        chaseVar === true ) {
                console.log("In chase");
                chaseVar = true;
                chaseCount++;
                return chase(ctx);
            } else {
                Pacman.attackArray.push("False");
                Pacman.chaseArray.push("False");
                console.log("in bob" + bobCount);
                bobVar = true;
               // let oldPos = position;
               // position = getNewCoord(due, position);
                bobCount++;
                if (position.x === 170) {
                    position.x = 168;
                    position.y = 100;
                    return {
                        "new" : position,
                        "old" : oldPos
                    }
                }
                if (position.x === 20) {
                    position.x = 22;
                    position.y = 100;
                    return {
                        "new" : position,
                        "old": oldPos
                    }
                }
                if (bobCount >= 10) {
                    due = oppositeDirection(due);
                    direction = oppositeDirection(direction);
                    position = getNewCoord(due, position);
                    bobCount = 0;
                    return {
                        "new" : position,
                        "old" : oldPos
                    }
                } else {
                    position = getNewCoord(due, position);
                    return {
                        "new" : position,
                        "old" : oldPos
                    }
                }
              /*  if (bobCount < 10) {
                    if (position.x > Pacman.startingPositions[Pacman.randomTrial][1]) {
                        npos.x = getX() - 2;
                        npos.y = 100;
                        position = npos;
                        return {
                            "new" : npos,
                            "old" : oldPos
                        }
                    } else {
                        npos.x = getX() + 2;
                        npos.y = 100;
                        position = npos;
                        return {
                            "new" : npos,
                            "old" : oldPos
                        }
                    }
                } */
            }
    }

     /* if (chaseVar === false && bobVar === false) {
        if (distance() >= 100) {
           /* if ((tracker <= 10.67379 / 25) || attackCount >= 1) {
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                    }
                }
                attackVar = true;
                attackCount++;
                return attack(ctx);
            }  else  if ((tracker > 10.67379 / 25 && tracker <= (29.47 + 10.67379) / 25) || chaseCount >= 1) {
                chaseVar = true;
                chaseCount++;
                chase(ctx);
            } else {
                bobVar = true;
                bobCount++;
                if (bobCount < 10) {
                    return move(ctx);
                } else {
                    bob(ctx);
                }
            }
      } else if (distance() >= 90 && distance() < 100) {
          /*if ((tracker <= 11.11090 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            }  else  if ((tracker > 11.11090 / 25 && tracker <= (29.33403 + 11.11090) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 10) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 80 && distance() < 90) {
           /* if ((tracker <= 11.83156 / 25) || attackCount >= 1) {
                attackVar = true;
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                        wallDist = PACMAN.getUserPos();
                    }
                }
                attackCount++;
                return attack(ctx);
            } else if ((tracker > 11.83156 / 25 && tracker <= (29.0955 + 11.83156) / 25) || chaseCount >= 1) {
                chaseVar = true;
                chaseCount++;
                chase(ctx);
            } else {
                bobVar = true;
                bobCount++;
                if (bobCount < 20) {
                    return move(ctx);
                } else {
                    bob(ctx);
                }
            }
      } else if (distance() >= 70 && distance() < 80) {
        /* if ((tracker <= 13.01974 / 25) || attackCount >= 1) {
             attackVar = true;
             if (attackCount === 0) {
                 attackDist = distance();
                 if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                     wallDist = PACMAN.getUserPos();
                 }
             }
             attackCount++;
             return attack(ctx);
            }  else if ((tracker > 13.01974 / 25 && tracker <= (28.7034858 + 13.01974) / 25) || chaseCount >= 1) {
             chaseVar = true;
             chaseCount++;
             chase(ctx);
            } else {
             bobVar = true;
             bobCount++;
             if (bobCount < 20) {
                 return move(ctx);
             } else {
                 bob(ctx);
             }
            }
      } else if (distance() >= 60 && distance() < 70) {
         /* if ((tracker <= 14.97871 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 14.97871 / 25 && tracker <= (28.057 + 14.97871) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 50 && distance() < 60) {
         /* if ((tracker <= 18.20850 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 18.20850 / 25 && tracker <= (26.991195 + 18.20850) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 40 && distance() < 50) {
          /*if ((tracker <= 23.53353 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 23.53353 / 25 && tracker <= (25.2339351 + 23.53353) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 30 && distance() < 40) {
         /* if ((tracker <= 32.31302 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 32.31302 / 25 && tracker <= (22.336 + 32.31302) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 20 && distance() < 30) {
        /*  if ((tracker <= 46.78794 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 46.78794 / 25 && tracker <= (17.55997 + 46.78794) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } else if (distance() >= 10 && distance() < 20) {
         /* if ((tracker <= 70.65307 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 70.65307 / 25 && tracker <= (9.6844869 + 70.65307) / 25) || chaseCount >= 1) {
              chaseVar = true;
              chaseCount++;
              chase(ctx);
            } else {
              bobVar = true;
              bobCount++;
              if (bobCount < 20) {
                  return move(ctx);
              } else {
                  bob(ctx);
              }
            }
      } } */

    position = npos;
    var tmp = pane(position);
    if (tmp) {
        position = tmp;
    }
    bobVar = false;
    //chaseVar = false;
    //attackVar = false;
    return {
        "new": position,
        "old": oldPos
    };
}

    return {
        "eat"         : eat,
        "isVunerable" : isVunerable,
        "isDangerous" : isDangerous,
        "makeEatable" : makeEatable,
        "reset"       : reset,
        "move"        : move,
        "draw"        : draw,
        "distance" : distance,
        "getX" : getX,
        "getNewAttackCoord" : getNewAttackCoord
    };
};

Pacman.Map = function (size) {

    var height    = null,
        width     = null,
        blockSize = size,
        pillSize  = 0,
        map       = null;

    function withinBounds(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }

    function isWall(pos) {
        return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === Pacman.WALL;
    }

    function isFloorSpace(pos) {
        if (!withinBounds(pos.y, pos.x)) {
            return false;
        }
        var peice = map[pos.y][pos.x];
        return peice === Pacman.EMPTY ||
            peice === Pacman.BISCUIT ||
            peice === Pacman.PILL;
    }

    function drawWall(ctx) {

        var i, j, p, line;

        ctx.strokeStyle = "#0000FF";
        ctx.lineWidth   = 5;
        ctx.lineCap     = "round";

        for (i = 0; i < Pacman.WALLS.length; i += 1) {
            line = Pacman.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];

                if (p.move) {
                    ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * blockSize,
                        p.curve[1] * blockSize,
                        p.curve[2] * blockSize,
                        p.curve[3] * blockSize);
                }
            }
            ctx.stroke();
        }
    }

    function reset() {
        //map    = Pacman.MAP.clone();
        Pacman.MAP = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        map = Pacman.MAP;
        height = map.length;
        width  = map[0].length;
    };

    function block(pos) {
        return map[pos.y][pos.x];
    };

    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    };

    function drawPills(ctx) {

        if (++pillSize > 30) {
            pillSize = 0;
        }

        for (i = 0; i < height; i += 1) {
            for (j = 0; j < width; j += 1) {
                if (map[i][j] === Pacman.PILL) {
                    ctx.beginPath();

                    ctx.fillStyle = "#000";
                    ctx.fillRect((j * blockSize), (i * blockSize),
                        blockSize, blockSize);

                    ctx.fillStyle = "#FFF";
                    ctx.arc((j * blockSize) + blockSize / 2,
                        (i * blockSize) + blockSize / 2,
                        Math.abs(5 - (pillSize/3)),
                        0,
                        Math.PI * 2, false);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };

    function draw(ctx) {

        var i, j, size = blockSize;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width * size, height * size);

        drawWall(ctx);

        for (i = 0; i < height; i += 1) {
            for (j = 0; j < width; j += 1) {
                if (Pacman.countdownCheck === true) {
                    if (i !== PACMAN.getUserPos() && i !== PACMAN.getGhostPos()) {
                        drawBlock(i, j, ctx);
                    }
                } else {
                    drawBlock(i, j, ctx);
                }
            }
        }
    };

    function drawBlock(y, x, ctx) {

        var layout = map[y][x];

        if (layout === Pacman.PILL) {
            return;
        }

        ctx.beginPath();

        if (layout === Pacman.EMPTY || layout === Pacman.BLOCK ||
            layout === Pacman.BISCUIT) {

            ctx.fillStyle = "#000";
            ctx.fillRect((x * blockSize), (y * blockSize),
                blockSize, blockSize);

            if (layout === Pacman.BISCUIT) {
                let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
                if (userPosition <= 80) {
                   if (x === (userPosition / 10) + 2) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / 6,
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 3) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / 5,
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 4) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / 4,
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 5) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / 3,
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 6) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / 2.5,
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   }
                } else {
                    if (x === (userPosition / 10) - 2) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / 6,
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 3) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / 5,
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 4) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / 4,
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 5) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / 3,
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 6) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / 2.5,
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    }
                }
            }
        }
        ctx.closePath();
    };

    reset();

    return {
        "draw"         : draw,
        "drawBlock"    : drawBlock,
        "drawPills"    : drawPills,
        "block"        : block,
        "setBlock"     : setBlock,
        "reset"        : reset,
        "isWallSpace"  : isWall,
        "isFloorSpace" : isFloorSpace,
        "height"       : height,
        "width"        : width,
        "blockSize"    : blockSize
    };
};

Pacman.Audio = function(game) {

    var files          = [],
        endEvents      = [],
        progressEvents = [],
        playing        = [];

    function load(name, path, cb) {

        var f = files[name] = document.createElement("audio");

        progressEvents[name] = function(event) { progress(event, name, cb); };

        f.addEventListener("canplaythrough", progressEvents[name], true);
        f.setAttribute("preload", "true");
        f.setAttribute("autobuffer", "true");
        f.setAttribute("src", path);
        f.pause();
    };

    function progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === "function") {
            callback();
            files[name].removeEventListener("canplaythrough",
                progressEvents[name], true);
        }
    };

    function disableSound() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
            files[playing[i]].currentTime = 0;
        }
        playing = [];
    };

    function ended(name) {

        var i, tmp = [], found = false;

        files[name].removeEventListener("ended", endEvents[name], true);

        for (i = 0; i < playing.length; i++) {
            if (!found && playing[i]) {
                found = true;
            } else {
                tmp.push(playing[i]);
            }
        }
        playing = tmp;
    };

    function play(name) {
        if (!game.soundDisabled()) {
            endEvents[name] = function() { ended(name); };
            playing.push(name);
            files[name].addEventListener("ended", endEvents[name], true);
            files[name].play();
        }
    };

    function pause() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
        }
    };

    function resume() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].play();
        }
    };

    return {
        "disableSound" : disableSound,
        "load"         : load,
        "play"         : play,
        "pause"        : pause,
        "resume"       : resume
    };
};

var PACMAN = (function () {

    var state        = WAITING,
        audio        = null,
        ghost1       = null,
        ghostSpecs   = ["#FF00FF"],
        eatenCount   = 0,
        level        = 0,
        tick         = 0,
        ghostPos, userPos, ghostPosX, userPosX, ghostPosY, oldGhostPos, oldUserPos
        stateChanged = true,
        timerStart   = null,
        lastTime     = 0,
        ctx          = null,
        timer        = null,
        map          = null,
        user         = null,
            endtrials = false,
        stored       = null;

    function getTick() {
        return tick;
    };

    function drawScore(text, position) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font      = "12px BDCartoonShoutRegular";
        ctx.fillText(text,
            (position["new"]["x"] / 10) * map.blockSize,
            ((position["new"]["y"] + 5) / 10) * map.blockSize);
    }

    function dialog(text) {
        ctx.fillStyle = "#FFFF00";
        ctx.font      = "18px Monaco";
        var width = ctx.measureText(text).width,
            x     = ((map.width * map.blockSize) - width) / 2;
        ctx.fillText(text, x, (map.height * 10) + 8);
    }

    function soundDisabled() {
        return localStorage["soundDisabled"] === "true";
    };

    function startLevel() {
        if (Pacman.totalTrials === 200) {
            Pacman.totalTrials = 1;
        } else {
            Pacman.totalTrials++;
        }
        if (user.trials === 0) {
            user.trials = 20;
        }
        if (user.trials !== 0) {
            window.postMessage(["Trial " + user.trials,
                {Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:Pacman.lives}], "*");
        }
        map.reset();
        map.draw(ctx);
        user.resetPosition();
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            ghost1.reset();
        }
        let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
        //oldGhostPos = ghost1.position.x;
        //oldUserPos = user.position.x;
        if (userPosition <= 80) {
            for (let i = 2; i < 7; i += 1) {
                Pacman.MAP[10][(userPosition / 10) + i] = Pacman.BISCUIT;
                //map = Pacman.MAP;
             /*
                    ctx.fillStyle = "#FFF";
                    ctx.fillRect((((userPosition / 10) + i) * map.blockSize) + (map.blockSize / 2.5),
                        (10 * map.blockSize) + (map.blockSize / 2.5),
                        map.blockSize / 6, map.blockSize / 6);
                */
            }
        } else {
            for (let i = 2; i < 7; i++) {
                Pacman.MAP[10][(userPosition / 10) - i] = Pacman.BISCUIT;
                //map = Pacman.MAP;
              /*  ctx.fillStyle = "#FFF";
                ctx.fillRect((((userPosition / 10) - i) * map.blockSize) + (map.blockSize / 2.5),
                    (10 * map.blockSize) + (map.blockSize / 2.5),
                    map.blockSize / 6, map.blockSize / 6); */
            }
        }
        //map.draw(ctx);
        start = new Audio("https://dl.dropbox.com/s/tr0akmihp4ku13d/opening_song.mp3?dl=1");
        //audio.play("start");
        //start.play();
        timerStart = tick;
        setState(COUNTDOWN);
        Pacman.trialTime = performance.now();
        Pacman.timeArray.length = 0;
        Pacman.ghostLocationArray.length = 0;
        Pacman.userLocationArray.length = 0;
        Pacman.bisc1Array.length = 0;
        Pacman.bisc2Array.length = 0;
        Pacman.bisc3Array.length = 0;
        Pacman.bisc4Array.length = 0;
        Pacman.bisc5Array.length = 0;
        Pacman.attackArray.length = 0;
        Pacman.chaseArray.length = 0;
        Pacman.eatenArray.length = 0;
        Pacman.scoreArray.length = 0;
    }

    function startNewGame() {
        setState(WAITING);
        level = 1;
        user.trials = 20;
        user.reset();
        map.reset();
        map.draw(ctx);
        startLevel();
    }

    function keyDown(e) {
        if (e.keyCode === KEY.N) {
            startNewGame();
        } else if (e.keyCode === KEY.S) {
            audio.disableSound();
            localStorage["soundDisabled"] = !soundDisabled();
        } else if (e.keyCode === KEY.P && state === PAUSE) {
            //start.resume();
            map.draw(ctx);
            setState(stored);
        } else if (e.keyCode === KEY.P) {
            stored = state;
            setState(PAUSE);
            start.pause();
            map.draw(ctx);
            dialog("Paused");
        } else if (state !== PAUSE) {
            return user.keyDown(e);
        }
        return true;
    }

    function loseLife() {
        setState(WAITING);
        user.loseLife();
        if (user.getLives() > 0 && user.getTrials() > 0) {
            startLevel();
        }
    }

    function setState(nState) {
        state = nState;
        stateChanged = true;
    };

    function collided(user, ghost) {
        return (Math.sqrt(Math.pow(ghost.x - user.x, 2) +
            Math.pow(ghost.y - user.y, 2))) < 10;
    };

    function drawFooter() {

        var topLeft  = (map.height * map.blockSize),
            textBase = topLeft + 17;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);

        ctx.fillStyle = "#FFFF00";

        for (var i = 0, len = user.getLives(); i < len; i++) {
            ctx.fillStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(150 + (25 * i) + map.blockSize / 2,
                (topLeft+1) + map.blockSize / 2);

            ctx.arc(150 + (25 * i) + map.blockSize / 2,
                (topLeft+1) + map.blockSize / 2,
                map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
            ctx.fill();
            ctx.fillStyle = "#FFFF00";
            ctx.font      = "14px Monaco";
            ctx.fillText("Trials: " + user.getTrials(), 255, textBase);

        }

        ctx.fillStyle = !soundDisabled() ? "#00FF00" : "#FF0000";
        ctx.font = "bold 16px sans-serif";
        //ctx.fillText("♪", 10, textBase);

        ctx.fillStyle = "#FFFF00";
        ctx.font      = "14px Monaco";
        ctx.fillText("Score: " + user.theScore(), 20, textBase);
    }

    function redrawBlock(pos) {
        map.drawBlock(Math.floor(100/10), Math.floor(pos.x/10), ctx);
        map.drawBlock(Math.ceil(100/10), Math.ceil(pos.x/10), ctx);
    }

    function mainDraw() {

        var diff, u, i, len, nScore;

        u = user.move(ctx);
        let g;
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            g = ghost1.move(ctx);
            redrawBlock(g.old);
        }
        redrawBlock(u.old);
        if (Pacman.escaped === false) {
            if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
                ghost1.draw(ctx);
            }
            user.draw(ctx);
        }


        userPos = u["new"];
        if (g !== undefined) {
            ghostPos = g["new"];
            ghostPosX = g["new"].x;
            ghostPosY = g["new"].y;
            Pacman.ghostLocationArray.push(ghostPosX);
            console.log("Ghost Position: " + ghostPosX);
        }
        userPosX = u["new"].x;
       // console.log("Trial: " + Math.abs(20 - user.getTrials()));
        console.log("User Position: " + userPosX);
       // console.log("Distance: " + ghost1.distance());
      //  console.log("Eaten: " + user.getEaten());
      //  console.log("\n"); */
        Pacman.userLocationArray.push(userPosX);
        Pacman.eatenArray.push(user.getEaten());
        Pacman.scoreArray.push(user.score);


            if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
                if (collided(userPos, ghostPos)) {
                    if (ghost1.isVunerable()) {
                        audio.play("eatghost");
                        ghost1.eat();
                        eatenCount += 1;
                        nScore = eatenCount * 50;
                        drawScore(nScore, ghostPos);
                        user.addScore(nScore);
                        setState(EATEN_PAUSE);
                        timerStart = tick;
                    } else if (ghost1.isDangerous()) {
                        console.log("Hit ghost.");
                        console.log("\n");
                        var die = new Audio('https://dl.dropbox.com/s/wulu2itp05lq255/die.mp3?dl=1');
                        //die.play();
                        //audio.play("die");
                        setState(DYING);
                        timerStart = tick;
                    }
                }
            }
    };

    function mainLoop() {
        if (Pacman.escaped === true) {
            Pacman.escaped = false;
        }
        var diff;

        if (state !== PAUSE) {
            ++tick;
        }

        //map.drawPills(ctx);

        if (user.getTrials() === 0 && !endtrials) {
            endtrials = true;
            map.draw(ctx);
            //user.trials = 20;
            dialog("Please exit the game.");
            //startLevel();
        }

        if (state === PLAYING) {
            const now = performance.now();
            Pacman.timeArray.push((now - Pacman.totalTime) / 1000);
            //console.log("Overall time: " + ((now - Pacman.totalTime) / 1000));
            mainDraw();
            //+ "." + now.getMilliseconds());
        } else if (state === WAITING && stateChanged) {
            stateChanged = false;
            map.draw(ctx);
            if (user.getTrials() !== 0) {
                dialog("Press n to start a new game!");
            } else {
                dialog("Please exit the game.");
            }
        } else if (state === EATEN_PAUSE &&
            (tick - timerStart) > (Pacman.FPS / 3)) {
            map.draw(ctx);
            setState(PLAYING);
        } else if (state === DYING) {
            if (tick - timerStart > (Pacman.FPS * 2)) {
                loseLife();
                user.setEaten(0);
            } else {
                redrawBlock(userPos);
                redrawBlock(ghostPos);
                ghost1.draw(ctx);
                user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2));
            }
        } else if (state === COUNTDOWN && endtrials === false) {

            diff = 3 + Math.floor((timerStart - tick) / Pacman.FPS);

            if (diff === 0) {
                map.draw(ctx);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) {
                    Pacman.countdownCheck = true;
                    lastTime = diff;
                    map.draw(ctx);
                    if (diff == 2) {
                      dialog("Ready, ");
                    } else {
                      dialog("Go!");
                    }
                }
            }
            Pacman.countdownCheck = false;
        }

        drawFooter();
    }


    function eatenPill() {
        audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        ghost1.makeEatable(ctx);
    };

    function completedLevel() {
        setState(WAITING);
        level += 1;
        map.reset();
        user.newLevel();
        startLevel();
    };

    function keyPress(e) {
        if (state !== WAITING && state !== PAUSE) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    function getUserPos() {
        return userPosX;
    }

    function getGhostPosY() {
        return ghostPosY;
    }

    function getUserDir() {
        return user.direction;
    }

    function getUserDue() {
        return user.getDue();
    }

    function init(wrapper, root) {

        var i, len, ghost,
            blockSize = wrapper.offsetWidth / 19,
            canvas    = document.createElement("canvas");

        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + 30 + "px");

        wrapper.appendChild(canvas);

        ctx  = canvas.getContext('2d');

        audio = new Pacman.Audio({"soundDisabled":soundDisabled});
        map   = new Pacman.Map(blockSize);
        user  = new Pacman.User({
            "completedLevel" : completedLevel,
            "eatenPill"      : eatenPill
        }, map);

            ghost1 = new Pacman.Ghost({"getTick":getTick}, map, ghostSpecs[0]);


        map.draw(ctx);
        dialog("Loading ...");
        loaded();
    };

    function load(arr, callback) {

        if (arr.length === 0) {
            callback();
        } else {
            var x = arr.pop();
            audio.load(x[0], x[1], function() { load(arr, callback); });
        }
    };

    function loaded() {

        dialog("Press N to Start");

        document.addEventListener("keydown", keyDown, true);
        document.addEventListener("keypress", keyPress, true);

        timer = window.setInterval(mainLoop, 1000 / Pacman.FPS);
        /*if (Pacman.attackVar1 === true) {
            window.setInterval(user.move, 1000/Pacman.AFPS)
        } */
    };

    function getGhostPos() {
        return ghostPosX;
    }

    return {
       "getUserPos": getUserPos,
        "getGhostPos": getGhostPos,
        "loseLife": loseLife,
        "completedLevel": completedLevel,
        "getUserDir" : getUserDir,
        "getUserDue" : getUserDue,
        "init" : init,
        "getGhostPosY" : getGhostPosY
    };

}());

/* Human readable keyCode index */
var KEY = {'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40, 'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59, 'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93, 'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107, 'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110, 'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145, 'SEMICOLON': 186, 'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189, 'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192, 'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220, 'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222};

(function () {
    /* 0 - 9 */
    for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
    }
    /* A - Z */
    for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
    }
    /* NUM_PAD_0 - NUM_PAD_9 */
    for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
    }
    /* F1 - F12 */
    for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
    }
})();

Pacman.WALL    = 0;
Pacman.BISCUIT = 1;
Pacman.EMPTY   = 2;
Pacman.BLOCK   = 3;
Pacman.PILL    = 4;

Pacman.MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

Pacman.WALLS = [

    [{"move": [0, 9.5]}, {"line": [20, 9.5]}],


    [{"move": [0, 11.5]}, {"line": [20, 11.5]}]
];

$(function(){
    var el = document.getElementById("pacman");

    if (Modernizr.canvas && Modernizr.localstorage &&
        Modernizr.audio && (Modernizr.audio.ogg || Modernizr.audio.mp3)) {
        window.setTimeout(function () { PACMAN.init(el, "https://raw.githubusercontent.com/tarun-sreedhar/pacman/master/"); }, 0);
    } else {
        el.innerHTML = "Sorry, needs a decent browser<br /><small>" +
            "(firefox 3.6+, Chrome 4+, Opera 10+ and Safari 4+)</small>";
    }
});
