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
Pacman.initialDraw = 0;
Pacman.FPS = 15;
Pacman.attackVar1 = false;
Pacman.AFPS = 5;
Pacman.countdownCheck = false;
Pacman.escaped = false;
Pacman.previousGhostStart = null;
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
Pacman.start = new Audio('https://dl.dropbox.com/s/eqexu1hbjplnk2n/256112__nckn__pleasant-done-notification.wav?dl=1');
Pacman.die = new Audio('https://dl.dropbox.com/s/d1p1u1mpm55forc/341820__ianstargem__screechy-alarm.wav?dl=1');
Pacman.startingPositions = [
    [1,170,90,2.5,6,5,4,3  ],
    [2,120,40,5,3,6,2.5,4  ],
    [3,120,null,5,2.5,6,3,4  ],
    [4,150,70,3,6,4,2.5,5  ],
    [5,80,160,2.5,4,6,5,3  ],
    [6,40,120,6,5,3,4,2.5  ],
    [7,20,null,4,3,2.5,5,6  ],
    [8,130,50,4,6,3,5,2.5  ],
    [9,30,110,5,6,3,4,2.5  ],
    [10,140,null,5,2.5,3,4,6  ],
    [11,60,140,2.5,6,5,4,3  ],
    [12,50,130,5,3,6,2.5,4  ],
    [13,140,60,5,2.5,6,3,4  ],
    [14,160,null,3,6,4,2.5,5  ],
    [15,60,null,2.5,4,6,5,3  ],
    [16,160,100,6,5,3,4,2.5  ],
    [17,160,80,4,3,2.5,5,6  ],
    [18,20,100,4,6,3,5,2.5  ],
    [19,40,null,5,6,3,4,2.5  ],
    [20,70,150,5,2.5,3,4,6  ]
];


Pacman.User = function (game, map) {

    var
        direction = null,
        eaten     = null,
        due       = null,
        lives     = null,
        trials_2 = null
        trials = null,
        score     = 5,
        keyMap    = {},
        over = true,
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
        trials_2++;
    };

    function getLives() {
        return lives;
    };

    function getTrials() {
        return trials;
    };

    function getTrials2() {
        return trials_2;
    }

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
            trials_2 = 1;
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
        Pacman.randomTrial = Math.floor(Math.random() * 21);
        if (Pacman.randomTrial >= 20) {
            Pacman.randomTrial = 19;
        } else if (Pacman.randomTrial < 1) {
            Pacman.randomTrial = 1;
        }
        console.assert(Pacman.randomTrial <= 19 && Pacman.randomTrial >= 0);
        if ((getTrials() === 20 && Pacman.startingPositions[Pacman.randomTrial][2] === null)
            || (Pacman.startingPositions[Pacman.randomTrial][2] === null && Pacman.previousGhostStart === null)) {
            Pacman.randomTrial = Math.floor(Math.random() * 21);
        }
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
            var start = new Audio('https://dl.dropbox.com/s/eqexu1hbjplnk2n/256112__nckn__pleasant-done-notification.wav?dl=1');
            start.play();
            trials--;
            trials_2++;
            game.completedLevel();
            Pacman.escaped = true;
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
            eaten += 1;

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
        "getTrials2" : getTrials2,
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
        fps = 18;

    function getNewCoord(dir, current) {

        var speed = isVunerable() ? 1 : isHidden() ? 4 : 2,
            xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0),
            ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);

        return {
            "x": addBounded(current.x, xSpeed),
            "y": addBounded(current.y, ySpeed)
        };
    };

    function getNewAttackCoord(x, y) {
        if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
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
        Pacman.previousGhostStart = position.x;
        direction = getRandomDirection();
        due = getRandomDirection();
        attackVar = false;
        chaseVar = false;
        chaseCount = 0;
        attackCount = 0;
        tracker2 = Math.random();
        console.log("new trial");
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
        const now = performance.now();
        let lambda_dist = distanceToLambda(distance());
        let probOfChase =  chase_chance(lambda_dist);
        console.log("Distance" + distance());
        console.log("Prob" + probOfChase);
        if (probOfChase < .1) {
            return "#FA86F2";
        } else if (probOfChase >= .1 && probOfChase < .15) {
            return "#F55CE7";
        } else if (probOfChase >= .15 && probOfChase < .3) {
            return "#ed30cd";
        } else if (probOfChase >= .3 && probOfChase < .75) {
            return "#D7008A";
        } else {
            return "#B30041";
        }
        return colour;
    };

    function draw(ctx) {

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


    function attack(ctx) {
        Pacman.attackArray.push("True");
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
        return retArr[lambda];
        // return x;
    }

    function survival(lambda_dist) {

        let re =  1 - (1 / (1 + (Math.E ** ((lambda_dist - 1.5) * -4)))) + 0.1;
        // let re =  -.007 * (lambda_dist/100 -2)

        return re;
    }

    function chase_chance(lambda_dist) {

        let re =  1 - (1 / (1 + (Math.E ** ((lambda_dist - 1.5) * -4)))) + 0.1;
        // let re = -.005 * (lambda_dist/100 - 2)
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
    if (!isNaN(distance())) {
        let lambda_dist = distanceToLambda(distance());
        const now = performance.now();
        console.log("Time since start of trial:" + (((now - Pacman.trialTime) / 1000) - 2));
        let probOfAttack = survival(lambda_dist);
        let probOfChase =  chase_chance(lambda_dist);
        console.log("Tracker: " + tracker2);
        console.log("probOfAttack: " + probOfAttack);
        console.log("Chase Value: " + probOfChase);
            if (( (tracker2 < probOfAttack ) || attackVar === true) && chaseVar === false && ((((now - Pacman.trialTime) / 1000) - 2) > 1) ) {
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
                bobVar = true;
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
            }
    }
    position = npos;
    var tmp = pane(position);
    if (tmp) {
        position = tmp;
    }
    bobVar = false;
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
            let sizeArray = [2.5, 3, 4, 5, 6];
            var currentIndex = sizeArray.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = sizeArray[currentIndex];
                sizeArray[currentIndex] = sizeArray[randomIndex];
                sizeArray[randomIndex] = temporaryValue;
            }
            if (layout === Pacman.BISCUIT) {
                let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
                if (userPosition <= 80) {
                   if (x === (userPosition / 10) + 2) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / Pacman.startingPositions[Pacman.randomTrial][3],
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 3) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / Pacman.startingPositions[Pacman.randomTrial][4],
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 4) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 5) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   } else if (x === (userPosition / 10) + 6) {
                       ctx.fillStyle = "#ffff00";
                       ctx.arc((x * blockSize) + (blockSize / 2.5),
                           (y * blockSize) + (blockSize / 2.5),
                           blockSize / Pacman.startingPositions[Pacman.randomTrial][7],
                           0,
                           Math.PI * 2, false);
                       ctx.fill();
                   }
                } else {
                    if (x === (userPosition / 10) - 2) {
                        ctx.fillStyle = "#ffff00";
                        console.log(Pacman.randomTrial);
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][3],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 3) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][4],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 4) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][5],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 5) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 6) {
                        ctx.fillStyle = "#ffff00";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][7],
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

var PACMAN = (function (handle) {

    var state        = WAITING,
        audio        = null,
        ghost1       = null,
        ghostSpecs   = ["#FA86F2"],
        eatenCount   = 0,
        level        = 0,
        tick         = 0,
        ghostPos, userPos, ghostPosX, userPosX, ghostPosY,
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
        if (Pacman.totalTrials === 20) {
            Pacman.totalTrials = 1;
        } else {
            Pacman.totalTrials++;
        }

        if (user.trials === 0) {
            user.trials = 20;
        }
        if (user.trials !== 0) {
            window.postMessage(["Trial " + user.getTrials2(),
               JSON.stringify({Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:user.getLives()})], "*");
        }
        map.reset();
        map.draw(ctx);
        user.resetPosition();
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            ghost1.reset();
        }
        let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
        if (userPosition <= 80) {
            for (let i = 2; i < 7; i += 1) {
                Pacman.MAP[10][(userPosition / 10) + i] = Pacman.BISCUIT;
            }
        } else {
            for (let i = 2; i < 7; i++) {
                Pacman.MAP[10][(userPosition / 10) - i] = Pacman.BISCUIT;
            }
        }
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

    function textMessage() {
        dialog("You've run out of lives");

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
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            Pacman.previousGhostStart = null;
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
        }
        userPosX = u["new"].x;
        Pacman.userLocationArray.push(userPosX);
        Pacman.eatenArray.push(user.getEaten());
        Pacman.scoreArray.push(user.theScore());


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
                        Pacman.die.volume = 0.1;
                        Pacman.die.play();
                        setState(DYING);
                        timerStart = tick;
                    }
                }
            }
    };

    function pressN() {
        dialog("Press n to start a new game!");
    }

    function mainLoop() {
        if (Pacman.escaped === true) {
            Pacman.escaped = false;
        }
        var diff;

        if (state !== PAUSE) {
            ++tick;
        }


        if (user.getTrials() === 0 && !endtrials) {
            endtrials = true;
            map.draw(ctx);
            //user.trials = 20;
            dialog("Please exit the game.");
            window.postMessage("next", "*");
        }

        if (state === PLAYING) {
            const now = performance.now();
            Pacman.timeArray.push((now - Pacman.totalTime) / 1000);
            mainDraw();
        } else if (state === WAITING && stateChanged) {
            stateChanged = false;
            map.draw(ctx);
            if (user.getTrials() !== 0) {
                //if (user.getLives() === 0) {
                    //setTimeout(pressN, 5000);
                //} else {
                    dialog("Press n to start a new game!");
                //}
            } else {
              //  dialog("Please exit the game.");
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

    function getEaten1() {
        return user.getEaten();
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
        "getGhostPosY" : getGhostPosY,
        "getEaten1" : getEaten1
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
