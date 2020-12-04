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
Pacman.startingPositions = [
    [1,20,120  ],
    [2,60,160  ],
    [3,20,120  ],
    [4,130,30  ],
    [5,140,40  ],
    [6,50,150  ],
    [7,30,130  ],
    [8,140,40  ],
    [9,20,120  ],
    [10,120,20  ],
    [11,80,170  ],
    [12,50,150  ],
    [13,130,30  ],
    [14,60,160  ],
    [15,160,80  ],
    [16,50,150  ],
    [17,140,40  ],
    [18,30,130  ],
    [19,40,140  ],
    [20,130,30  ],
    [21,130,30  ],
    [22,150,50  ],
    [23,50,150  ],
    [24,60,160  ],
    [25,160,70  ],
    [26,60,160  ],
    [27,50,150  ],
    [28,30,130  ],
    [29,160,60  ],
    [30,120,20  ],
    [31,40,140  ],
    [32,140,40  ],
    [33,20,120  ],
    [34,140,40  ],
    [35,120,20  ],
    [36,160,80  ],
    [37,150,50  ],
    [38,70,170  ],
    [39,140,40  ],
    [40,120,20  ],
    [41,50,150  ],
    [42,50,150  ],
    [43,70,170  ],
    [44,30,130  ],
    [45,160,70  ],
    [46,160,60  ],
    [47,60,160  ],
    [48,50,150  ],
    [49,30,130  ],
    [50,120,20  ],
    [51,30,130  ],
    [52,40,140  ],
    [53,120,20  ],
    [54,80,170  ],
    [55,20,120  ],
    [56,60,160  ],
    [57,140,40  ],
    [58,30,130  ],
    [59,70,170  ],
    [60,70,170  ],
    [61,30,130  ],
    [62,50,150  ],
    [63,40,140  ],
    [64,70,170  ],
    [65,60,160  ],
    [66,30,130  ],
    [67,80,170  ],
    [68,70,170  ],
    [69,140,40  ],
    [70,140,40  ],
    [71,120,20  ],
    [72,60,160  ],
    [73,20,120  ],
    [74,20,120  ],
    [75,80,170  ],
    [76,50,150  ],
    [77,160,70  ],
    [78,140,40  ],
    [79,130,30  ],
    [80,160,70  ],
    [81,160,60  ],
    [82,50,150  ],
    [83,130,30  ],
    [84,150,50  ],
    [85,40,140  ],
    [86,160,70  ],
    [87,60,160  ],
    [88,160,60  ],
    [89,120,20  ],
    [90,160,80  ],
    [91,60,160  ],
    [92,160,60  ],
    [93,70,170  ],
    [94,30,130  ],
    [95,30,130  ],
    [96,120,20  ],
    [97,20,120  ],
    [98,30,130  ],
    [99,60,160  ],
    [100,160,80  ],
    [101,120,20  ],
    [102,80,170  ],
    [103,120,20  ],
    [104,60,160  ],
    [105,50,150  ],
    [106,130,30  ],
    [107,50,150  ],
    [108,80,170  ],
    [109,140,40  ],
    [110,30,130  ],
    [111,150,50  ],
    [112,160,70  ],
    [113,60,160  ],
    [114,70,170  ],
    [115,40,140  ],
    [116,70,170  ],
    [117,160,60  ],
    [118,160,70  ],
    [119,20,120  ],
    [120,160,60  ],
    [121,130,30  ],
    [122,130,30  ],
    [123,60,160  ],
    [124,160,80  ],
    [125,150,50  ],
    [126,130,30  ],
    [127,140,40  ],
    [128,120,20  ],
    [129,160,70  ],
    [130,80,170  ],
    [131,70,170  ],
    [132,20,120  ],
    [133,160,70  ],
    [134,160,80  ],
    [135,60,160  ],
    [136,130,30  ],
    [137,80,170  ],
    [138,140,40  ],
    [139,150,50  ],
    [140,140,40  ],
    [141,140,40  ],
    [142,120,20  ],
    [143,20,120  ],
    [144,150,50  ],
    [145,130,30  ],
    [146,160,70  ],
    [147,130,30  ],
    [148,40,140  ],
    [149,20,120  ],
    [150,160,80  ],
    [151,160,80  ],
    [152,70,170  ],
    [153,120,20  ],
    [154,150,50  ],
    [155,160,80  ],
    [156,60,160  ],
    [157,20,120  ],
    [158,70,170  ],
    [159,20,120  ],
    [160,30,130  ],
    [161,30,130  ],
    [162,160,80  ],
    [163,70,170  ],
    [164,70,170  ],
    [165,70,170  ],
    [166,70,170  ],
    [167,50,150  ],
    [168,160,60  ],
    [169,30,130  ],
    [170,140,40  ],
    [171,80,170  ],
    [172,160,60  ],
    [173,160,80  ],
    [174,160,60  ],
    [175,140,40  ],
    [176,130,30  ],
    [177,20,120  ],
    [178,30,130  ],
    [179,120,20  ],
    [180,120,20  ],
    [181,30,130  ],
    [182,130,30  ],
    [183,160,60  ],
    [184,150,50  ],
    [185,160,70  ],
    [186,160,80  ],
    [187,160,80  ],
    [188,30,130  ],
    [189,160,60  ],
    [190,30,130  ],
    [191,150,50  ],
    [192,140,40  ],
    [193,130,30  ],
    [194,160,60  ],
    [195,70,170  ],
    [196,60,160  ],
    [197,140,40  ],
    [198,20,120  ],
    [199,20,120  ],
    [200,60,160  ]
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
        if (Pacman.randomTrial > 200) {
            Pacman.randomTrial = 200;
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

            map.setBlock(nextWhole, Pacman.EMPTY);
            if (position.x < 110 && over) {
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
            }
            //addScore((block === Pacman.BISCUIT) ? 10 : 50);
            eaten += 1;

            if (eaten === 5) {
                game.completedLevel();
                trials--;
            }

            if (block === Pacman.PILL) {
                game.eatenPill();
            }
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

        ctx.fillStyle = "#00FF00";
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

        ctx.fillStyle = "#00FF00";

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
        bobCount = null,
        distanceVar = null,
        chaseCount = null,
        attackCount = null,
        attackDist = null,
        wallDist = null,
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

    function getNewAttackCoord(x, y) {
       // let moveAmount = Math.ceil(wallDist / attackDist) * 4;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
           // if (x - moveAmount < PACMAN.getUserPos()) {
            if (x - 3 < PACMAN.getUserPos()) {
                return {
                    "x" : PACMAN.getUserPos(),
                    "y" : y
                }
            } else {
                if (distance() > 50) {
                    return {
                        "x" : x - 5,
                        "y" : y
                    }
                } else {
                    return {
                        "x" : x - 3,
                        "y" : y
                    }
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
                if (distance() > 50) {
                    return {
                        "x" : x + 5,
                        "y" : y
                    }
                } else {
                    return {
                        "x" : x + 3,
                        "y" : y
                    }
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
        direction = getRandomDirection();
        due = getRandomDirection();
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
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            due = LEFT;
            direction = LEFT;
        } else {
            due = RIGHT;
            direction = RIGHT;
        }
        return move(ctx);
    }

    function bob(ctx) {
        if (bobCount >= 10) {
            due = oppositeDirection(due);
            direction = oppositeDirection(direction);
            bobCount = 0;
            return move(ctx);
        }
    }

    function attack(ctx) {
        console.log("Attacked.");
         Pacman.attackVar1 = true;
        attackVar = true;
        let npos;
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
            direction = LEFT;
            due = LEFT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x ,PACMAN.getGhostPosY());
            position = npos;
            return {
                "new": position,
                "old": oldPos
            };
        } else {
            direction = RIGHT;
            due = RIGHT;
            var oldPos = position;
            npos = getNewAttackCoord(oldPos.x, PACMAN.getGhostPosY());
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

        let tracker = Math.random() * 100;

    if (onGrid &&
        map.isWallSpace({
            "y": pointToCoord(nextSquare(npos.y, direction)),
            "x": pointToCoord(nextSquare(npos.x, direction))
        })) {

        due = oppositeDirection(due);
        direction = oppositeDirection(direction);
        return move(ctx);
    }
      if (chaseVar === false && bobVar === false) {
        if (distance() >= 100) {
            if ((tracker <= 10.67379 / 25) || attackCount >= 1) {
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                    }
                }
                attackVar = true;
                attackCount++;
                return attack(ctx);
            } else if ((tracker > 10.67379 / 25 && tracker <= (29.47 + 10.67379) / 25) || chaseCount >= 1) {
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
          if ((tracker <= 11.11090 / 25) || attackCount >= 1) {
              attackVar = true;
              if (attackCount === 0) {
                  attackDist = distance();
                  if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                      wallDist = PACMAN.getUserPos();
                  }
              }
              attackCount++;
              return attack(ctx);
            } else if ((tracker > 11.11090 / 25 && tracker <= (29.33403 + 11.11090) / 25) || chaseCount >= 1) {
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
            if ((tracker <= 11.83156 / 25) || attackCount >= 1) {
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
         if ((tracker <= 13.01974 / 25) || attackCount >= 1) {
             attackVar = true;
             if (attackCount === 0) {
                 attackDist = distance();
                 if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                     wallDist = PACMAN.getUserPos();
                 }
             }
             attackCount++;
             return attack(ctx);
            } else if ((tracker > 13.01974 / 25 && tracker <= (28.7034858 + 13.01974) / 25) || chaseCount >= 1) {
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
          if ((tracker <= 14.97871 / 25) || attackCount >= 1) {
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
          if ((tracker <= 18.20850 / 25) || attackCount >= 1) {
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
          if ((tracker <= 23.53353 / 25) || attackCount >= 1) {
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
          if ((tracker <= 32.31302 / 25) || attackCount >= 1) {
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
          if ((tracker <= 46.78794 / 25) || attackCount >= 1) {
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
          if ((tracker <= 70.65307 / 25) || attackCount >= 1) {
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
      } }

    position = npos;
    var tmp = pane(position);
    if (tmp) {
        position = tmp;
    }
    bobVar = false;
    chaseVar = false;
    attackVar = false;
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
        map    = Pacman.MAP.clone();
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
                drawBlock(i, j, ctx);
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
                ctx.fillStyle = "#FFF";
                ctx.fillRect((x * blockSize) + (blockSize / 2.5),
                    (y * blockSize) + (blockSize / 2.5),
                    blockSize / 6, blockSize / 6);
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
        ghostPos, userPos, ghostPosX, userPosX, ghostPosY
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
        map.reset();
        map.draw(ctx);
        user.resetPosition();
        ghost1.reset();
        //audio.play("start");
        timerStart = tick;
        setState(COUNTDOWN);
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
            audio.resume();
            map.draw(ctx);
            setState(stored);
        } else if (e.keyCode === KEY.P) {
            stored = state;
            setState(PAUSE);
            audio.pause();
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
        let g = ghost1.move(ctx);
        redrawBlock(g.old);
        redrawBlock(u.old);
        ghost1.draw(ctx);
        user.draw(ctx);

        userPos = u["new"];
        ghostPos = g["new"];
        ghostPosX = g["new"].x;
        userPosX = u["new"].x;
        ghostPosY = g["new"].y;
        console.log("Trial: " + Math.abs(20 - user.getTrials()));
        console.log("User Position: " + userPosX);
        console.log("Ghost Position: " + ghostPosX);
        console.log("Distance: " + ghost1.distance());
        console.log("Eaten: " + user.getEaten());
        console.log("\n");



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
                    //audio.play("die");
                    setState(DYING);
                    timerStart = tick;
                }
            }
    };

    function mainLoop() {
        var diff;

        if (state !== PAUSE) {
            ++tick;
        }

        map.drawPills(ctx);

        if (user.getTrials() === 0 && !endtrials) {
            endtrials = true;
            map.draw(ctx);
            //user.trials = 20;
            dialog("Please exit the game.");
            //startLevel();
        }

        if (state === PLAYING) {
            mainDraw();
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

            diff = 5 + Math.floor((timerStart - tick) / Pacman.FPS);

            if (diff === 0) {
                map.draw(ctx);
                setState(PLAYING);
            } else {
                if (diff !== lastTime) {
                    lastTime = diff;
                    map.draw(ctx);
                    dialog("Starting in: " + diff);
                }
            }
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

        var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';

        var audio_files = [
            ["start", root + "audio/opening_song." + extension],
            ["die", root + "audio/die." + extension],
            ["eatghost", root + "audio/eatghost." + extension],
            ["eatpill", root + "audio/eatpill." + extension],
            ["eating", root + "audio/eating.short." + extension],
            ["eating2", root + "audio/eating.short." + extension]
        ];

        load(audio_files, function() { loaded(); });
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

Object.prototype.clone = function () {
    var i, newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i === 'clone') {
            continue;
        }
        if (this[i] && typeof this[i] === "object") {
            newObj[i] = this[i].clone();
        } else {
            newObj[i] = this[i];
        }
    }
    return newObj;
};

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

