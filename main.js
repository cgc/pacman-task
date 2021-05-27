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
Pacman.biscvar = false;
Pacman.trial_counter = 0;
Pacman.move = false;
Pacman.attackProb = 0;
Pacman.chaseProb = 0.5;
Pacman.escapeUserPos = 0;
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
Pacman.averageScore = [];
Pacman.lives = null;
Pacman.usedTrials = [];
Pacman.orig_startingPositions = [
    [1,160,80,null,null,null,null,null  ],
    [2,120,40,5,3,6,2.5,4  ],
    [3,120,null,5,2.5,6,3,4  ],
    [4,150,70,3,6,4,2.5,5  ],
    [5,80,160,null,null,null,null,null  ],
    [6,40,120,6,5,3,4,2.5  ],
    [7,20,null,4,3,2.5,5,6  ],
    [8,130,50,4,6,3,5,2.5  ],
    [9,30,110,5,6,3,4,2.5  ],
    [10,140,60,null,null,null,null,null  ],
    [11,60,140,2.5,6,5,4,3  ],
    [12,50,130,5,3,6,2.5,4  ],
    [13,140,60,5,2.5,6,3,4  ],
    [14,160,null,3,6,4,2.5,5  ],
    [15,60,null,2.5,4,6,5,3  ],
    [16,100,20,6,5,3,4,2.5  ],
    [17,160,80,4,3,2.5,5,6  ],
    [18,20,100,4,6,3,5,2.5  ],
    [19,40,120,null,null,null,null,null  ],
    [20,70,150,5,2.5,3,4,6  ]
];
Pacman.startingPositions = Pacman.orig_startingPositions.sort(() => Math.random() - 0.5);
Pacman.survivalProbabilities = [
    {
        "CDF": 1,
        "Scaled_Distance": 0
    },
    {
        "CDF": 0.9979689583650599,
        "Scaled_Distance": 0.01
    },
    {
        "CDF": 0.99214346656768,
        "Scaled_Distance": 0.02
    },
    {
        "CDF": 0.98290696581622,
        "Scaled_Distance": 0.03
    },
    {
        "CDF": 0.9706196592230399,
        "Scaled_Distance": 0.04
    },
    {
        "CDF": 0.9556194578125,
        "Scaled_Distance": 0.05
    },
    {
        "CDF": 0.93822290223616,
        "Scaled_Distance": 0.06
    },
    {
        "CDF": 0.91872606049758,
        "Scaled_Distance": 0.07
    },
    {
        "CDF": 0.89740540198912,
        "Scaled_Distance": 0.08
    },
    {
        "CDF": 0.8745186481431401,
        "Scaled_Distance": 0.09
    },
    {
        "CDF": 0.8503055999999999,
        "Scaled_Distance": 0.1
    },
    {
        "CDF": 0.8249889429952599,
        "Scaled_Distance": 0.11
    },
    {
        "CDF": 0.7987750292684799,
        "Scaled_Distance": 0.12
    },
    {
        "CDF": 0.7718546377960199,
        "Scaled_Distance": 0.13
    },
    {
        "CDF": 0.7444037126502401,
        "Scaled_Distance": 0.14
    },
    {
        "CDF": 0.7165840796874999,
        "Scaled_Distance": 0.15
    },
    {
        "CDF": 0.6885441419673599,
        "Scaled_Distance": 0.16
    },
    {
        "CDF": 0.66041955420538,
        "Scaled_Distance": 0.17
    },
    {
        "CDF": 0.6323338765619199,
        "Scaled_Distance": 0.18
    },
    {
        "CDF": 0.6043992080693399,
        "Scaled_Distance": 0.19
    },
    {
        "CDF": 0.5767167999999998,
        "Scaled_Distance": 0.2
    },
    {
        "CDF": 0.54937764947746,
        "Scaled_Distance": 0.21
    },
    {
        "CDF": 0.52246307363328,
        "Scaled_Distance": 0.22
    },
    {
        "CDF": 0.4960452646118201,
        "Scaled_Distance": 0.23
    },
    {
        "CDF": 0.47018782572544005,
        "Scaled_Distance": 0.24
    },
    {
        "CDF": 0.4449462890624998,
        "Scaled_Distance": 0.25
    },
    {
        "CDF": 0.4203686148505602,
        "Scaled_Distance": 0.26
    },
    {
        "CDF": 0.3964956728771801,
        "Scaled_Distance": 0.27
    },
    {
        "CDF": 0.37336170627071996,
        "Scaled_Distance": 0.28
    },
    {
        "CDF": 0.35099477794354006,
        "Scaled_Distance": 0.29
    },
    {
        "CDF": 0.32941719999999985,
        "Scaled_Distance": 0.3
    },
    {
        "CDF": 0.30864594641166,
        "Scaled_Distance": 0.31
    },
    {
        "CDF": 0.28869304926207984,
        "Scaled_Distance": 0.32
    },
    {
        "CDF": 0.2695659788636199,
        "Scaled_Distance": 0.33
    },
    {
        "CDF": 0.25126800804864,
        "Scaled_Distance": 0.34
    },
    {
        "CDF": 0.23379856093749996,
        "Scaled_Distance": 0.35000000000000003
    },
    {
        "CDF": 0.21715354648576013,
        "Scaled_Distance": 0.36
    },
    {
        "CDF": 0.2013256771129801,
        "Scaled_Distance": 0.37
    },
    {
        "CDF": 0.18630477271551993,
        "Scaled_Distance": 0.38
    },
    {
        "CDF": 0.17207805036573998,
        "Scaled_Distance": 0.39
    },
    {
        "CDF": 0.15863039999999995,
        "Scaled_Distance": 0.4
    },
    {
        "CDF": 0.14594464639785998,
        "Scaled_Distance": 0.41000000000000003
    },
    {
        "CDF": 0.13400179775488008,
        "Scaled_Distance": 0.42
    },
    {
        "CDF": 0.12278128115142006,
        "Scaled_Distance": 0.43
    },
    {
        "CDF": 0.11226116521984009,
        "Scaled_Distance": 0.44
    },
    {
        "CDF": 0.1024183703125,
        "Scaled_Distance": 0.45
    },
    {
        "CDF": 0.09322886647295991,
        "Scaled_Distance": 0.46
    },
    {
        "CDF": 0.08466785951278,
        "Scaled_Distance": 0.47000000000000003
    },
    {
        "CDF": 0.07670996549632003,
        "Scaled_Distance": 0.48
    },
    {
        "CDF": 0.06932937393593996,
        "Scaled_Distance": 0.49
    },
    {
        "CDF": 0.0625,
        "Scaled_Distance": 0.5
    },
    {
        "CDF": 0.05619562603605999,
        "Scaled_Distance": 0.51
    },
    {
        "CDF": 0.050390032711679966,
        "Scaled_Distance": 0.52
    },
    {
        "CDF": 0.04505712007522,
        "Scaled_Distance": 0.53
    },
    {
        "CDF": 0.04017101883903995,
        "Scaled_Distance": 0.54
    },
    {
        "CDF": 0.03570619218749993,
        "Scaled_Distance": 0.55
    },
    {
        "CDF": 0.03163752841215994,
        "Scaled_Distance": 0.56
    },
    {
        "CDF": 0.027940424676579978,
        "Scaled_Distance": 0.5700000000000001
    },
    {
        "CDF": 0.024590862213120013,
        "Scaled_Distance": 0.58
    },
    {
        "CDF": 0.021565473254139933,
        "Scaled_Distance": 0.59
    },
    {
        "CDF": 0.018841600000000014,
        "Scaled_Distance": 0.6
    },
    {
        "CDF": 0.016397345926260076,
        "Scaled_Distance": 0.61
    },
    {
        "CDF": 0.014211619732479974,
        "Scaled_Distance": 0.62
    },
    {
        "CDF": 0.012264172235020077,
        "Scaled_Distance": 0.63
    },
    {
        "CDF": 0.010535626506239959,
        "Scaled_Distance": 0.64
    },
    {
        "CDF": 0.009007501562499964,
        "Scaled_Distance": 0.65
    },
    {
        "CDF": 0.007662229903359963,
        "Scaled_Distance": 0.66
    },
    {
        "CDF": 0.006483169204379968,
        "Scaled_Distance": 0.67
    },
    {
        "CDF": 0.005454608465919941,
        "Scaled_Distance": 0.68
    },
    {
        "CDF": 0.0045617689203399925,
        "Scaled_Distance": 0.6900000000000001
    },
    {
        "CDF": 0.003790799999999983,
        "Scaled_Distance": 0.7000000000000001
    },
    {
        "CDF": 0.003128770668459957,
        "Scaled_Distance": 0.71
    },
    {
        "CDF": 0.002563656417279958,
        "Scaled_Distance": 0.72
    },
    {
        "CDF": 0.0020843222308200016,
        "Scaled_Distance": 0.73
    },
    {
        "CDF": 0.0016805018214399725,
        "Scaled_Distance": 0.74
    },
    {
        "CDF": 0.0013427734375,
        "Scaled_Distance": 0.75
    },
    {
        "CDF": 0.00106253254656008,
        "Scaled_Distance": 0.76
    },
    {
        "CDF": 0.0008319616961800502,
        "Scaled_Distance": 0.77
    },
    {
        "CDF": 0.0006439978547200242,
        "Scaled_Distance": 0.78
    },
    {
        "CDF": 0.0004922975345400538,
        "Scaled_Distance": 0.79
    },
    {
        "CDF": 0.00037120000000001596,
        "Scaled_Distance": 0.8
    },
    {
        "CDF": 0.00027568886266005066,
        "Scaled_Distance": 0.81
    },
    {
        "CDF": 0.00020135236607998763,
        "Scaled_Distance": 0.8200000000000001
    },
    {
        "CDF": 0.0001443426626199784,
        "Scaled_Distance": 0.8300000000000001
    },
    {
        "CDF": 0.000101334384639995,
        "Scaled_Distance": 0.84
    },
    {
        "CDF": 0.00006948281250007682,
        "Scaled_Distance": 0.85
    },
    {
        "CDF": 0.000046381941759987555,
        "Scaled_Distance": 0.86
    },
    {
        "CDF": 0.00003002275198005222,
        "Scaled_Distance": 0.87
    },
    {
        "CDF": 0.000018751979520059692,
        "Scaled_Distance": 0.88
    },
    {
        "CDF": 0.000011231696739999464,
        "Scaled_Distance": 0.89
    },
    {
        "CDF": 0.000006399999999961992,
        "Scaled_Distance": 0.9
    },
    {
        "CDF": 0.0000034331088599737214,
        "Scaled_Distance": 0.91
    },
    {
        "CDF": 0.0000017091788799827867,
        "Scaled_Distance": 0.92
    },
    {
        "CDF": 7.741304199893051e-7,
        "Scaled_Distance": 0.93
    },
    {
        "CDF": 3.097958399811418e-7,
        "Scaled_Distance": 0.9400000000000001
    },
    {
        "CDF": 1.04687500002143e-7,
        "Scaled_Distance": 0.9500000000000001
    },
    {
        "CDF": 2.7688960013705355e-8,
        "Scaled_Distance": 0.96
    },
    {
        "CDF": 4.9717799877058155e-9,
        "Scaled_Distance": 0.97
    },
    {
        "CDF": 4.403200026814602e-10,
        "Scaled_Distance": 0.98
    },
    {
        "CDF": 6.9400041269318535e-12,
        "Scaled_Distance": 0.99
    },
    {
        "CDF": 0,
        "Scaled_Distance": 1
    }
]


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
        window.postMessage(["Trial " + getTrials2(),
            JSON.stringify({Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:getLives()})], "*");
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
        // const beta = require("m");
        //const val = beta(1, 1);
        //console.log("Beta: " + val);
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
         if (Pacman.randomTrial === 20) {
             Pacman.randomTrial = 19;
         }
       // Pacman.randomTrial = getTrials2();
        if (Pacman.usedTrials.includes(Pacman.randomTrial)) {
            while (Pacman.usedTrials.includes(Pacman.randomTrial)) {
                Pacman.randomTrial = Math.floor(Math.random() * 21);
                if (Pacman.randomTrial === 20) {
                    Pacman.randomTrial = 19;
                }
            }
        }
        Pacman.trial_counter++;
        if (Pacman.trial_counter > 3) {
            Pacman.usedTrials.push(Pacman.randomTrial);
        }
        //console.log("Used Trials so far: " + Pacman.usedTrials);
        position = {"x": Pacman.startingPositions[Pacman.randomTrial][1], "y": 100};
        //console.log("User start: " + position.x);
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
            //start.play();
            Pacman.escapeUserPos = position.x;
            Pacman.escaped = true;
            // PACMAN.setState(ESCAPED);
            console.log("Escaped");
            window.postMessage(["Trial " + getTrials2(),
                JSON.stringify({Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                    Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                    Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:getLives()})], "*");
            trials--;
            trials_2++;
            game.completedLevel();
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
            Pacman.move = true;
            let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
            if (userPosition <= 80) {
                if ( (nextWhole.x === (userPosition / 10) + 2) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null) ) {
                    Pacman.bisc1Array.push("True");// + (performance.now() - Pacman.totalTime) / 1000);
                    addScore(10);
                } else if ( (nextWhole.x === (userPosition / 10) + 3) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc2Array.push("True");
                    addScore(20);
                } else if ( (nextWhole.x === (userPosition / 10) + 4) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc3Array.push("True");
                    addScore(30);
                } else if ( (nextWhole.x === (userPosition / 10) + 5) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc4Array.push("True");
                    addScore(40);
                } else if ( (nextWhole.x === (userPosition / 10) + 6) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc5Array.push("True");
                    addScore(50);
                }
            } else {
                if ( (nextWhole.x === (userPosition / 10) - 2) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc1Array.push("True");
                    addScore(10);
                } else if ( (nextWhole.x === (userPosition / 10) - 3) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc2Array.push("True");
                    addScore(20);
                } else if ( (nextWhole.x === (userPosition / 10) - 4) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc3Array.push("True");
                    addScore(30);
                } else if ( (nextWhole.x === (userPosition / 10) - 5) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc4Array.push("True");
                    addScore(40);
                } else if ( (nextWhole.x === (userPosition / 10) - 6) && (Pacman.startingPositions[Pacman.randomTrial][3] !== null)) {
                    Pacman.bisc5Array.push("True");
                    addScore(50);
                }
            }
            map.setBlock(nextWhole, Pacman.EMPTY);
            eaten += 1;

            if (block === Pacman.PILL) {
                game.eatenPill();
            }
            Pacman.move = false;
        } else {
            Pacman.biscvar = true;
        }/* else {
            Pacman.bisc1Array.push("False");
            Pacman.bisc2Array.push("False");
            Pacman.bisc3Array.push("False");
            Pacman.bisc4Array.push("False");
            Pacman.bisc5Array.push("False");
        } */
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
        tracker_attack = null,
        tracker_chase = null,
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
        tracker_attack = Math.random();
        tracker_chase = Math.random();
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
        // let lambda_dist = distanceToLambda(distance());
        // Pacman.attack =  survival(lambda_dist);
        //console.log("Prob" + probOfChase);
        if (Pacman.attackProb < .1) {
            return "#FA86F2";
        } else if (Pacman.attackProb >= .1 && Pacman.attackProb < .2) {
            return "#f673d7";
        } else if (Pacman.attackProb >= .2 && Pacman.attackProb < .3) {
            return "#f061bd";
        } else if (Pacman.attackProb >= .3 && Pacman.attackProb < .4) {
            return "#e74fa2";
        } else if (Pacman.attackProb >= .4 && Pacman.attackProb < .5) {
            return "#dd3e89";
        } else if (Pacman.attackProb >= .5 && Pacman.attackProb < .6) {
            return "#d7357c";
        } else if (Pacman.attackProb >= .6 && Pacman.attackProb < .7) {
            return "#d12c70";
        } else if (Pacman.attackProb >= .7 && Pacman.attackProb < .8) {
            return "#ca2364";
        } else if (Pacman.attackProb >= .8 && Pacman.attackProb < .9) {
            return "#c31958";
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
        distanceVar = Math.abs(PACMAN.getGhostPos() - PACMAN.getUserPos());
        let bool = false;
        if (PACMAN.getGhostPos() != null) {
            if (PACMAN.collided(PACMAN.getWholeUserPos(), PACMAN.getWholeGhostPos())) {
                bool = true;
            }
        }
        if ((PACMAN.getUserPos() === 10 || PACMAN.getUserPos() === 170) || bool) {
            distanceVar = 150;
        }
        return distanceVar;
    }

    function chase(ctx) {
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
        // const n = 120;
        // const arr = [...Array(n).keys()];
        // let lambda = arr.indexOf(x);
        // let xMax = 120;
        // let xMin = 0;
        // let yMax = 100;
        // let yMin = 0;
        // const retArr = [];
        // for (const i in arr) {
        //     let percent = (i - yMin) / (yMax - yMin);
        //     let outputX = percent * (xMax - xMin) + xMin;
        //     retArr.push(outputX);
        // }
        // console.log("max lamda dist: " + retArr[retArr.length -1]);
        let new_dist = x;
        if ( new_dist > 100)
            new_dist = 100;
        return Math.floor(new_dist);
    }

    function survival(lambda_dist) {
        //console.log("lamda dist: " + lambda_dist);
        re = Pacman.survivalProbabilities[lambda_dist]["CDF"];
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
            // if (PACMAN.getEaten1() === 5) {
            //     Pacman.chaseArray.push("True");
            //     Pacman.attackArray.push("False");
            //     chaseVar = true;
            //     chaseCount++;
            //     return chase(ctx);
            // }
            let lambda_dist = distanceToLambda(distance());
            const now = performance.now();
            Pacman.attackProb = survival(lambda_dist);
            console.log("AttackProb: " + Pacman.attackProb);
            console.log("Tracker Attack: " + tracker_attack);
            console.log("Tracker Chase: " + tracker_chase);
            console.log("Pacman Pos: " + PACMAN.getUserPos());
            console.log("Ghost Pos: " + PACMAN.getGhostPos());
            console.log(" ");
            if (( (tracker_attack < Pacman.attackProb && tracker_chase <= Pacman.chaseProb) || attackVar === true) && chaseVar === false
                && ((((now - Pacman.trialTime) / 1000) - 2) > 1)) {
                Pacman.attackArray.push("True");
                Pacman.chaseArray.push("False");
                if (attackCount === 0) {
                    attackDist = distance();
                    if (PACMAN.getUserPos() < PACMAN.getGhostPos()) {
                        wallDist = PACMAN.getUserPos();
                    }
                }
                attackVar = true;
                console.log("Attack: " + attackVar);
                attackCount++;
                return attack(ctx);
            } else if ((tracker_attack < Pacman.attackProb & tracker_chase >=Pacman.chaseProb)
                || chaseVar === true || ((((now - Pacman.trialTime) / 1000) - 2) > 5 ) ) {
                Pacman.chaseArray.push("True");
                Pacman.attackArray.push("False");
                chaseVar = true;
                console.log("Chase: " + chaseVar);
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
                console.log("bob count: " + bobCount);
                if (Pacman.startingPositions[Pacman.randomTrial][2] === 20) {
                    if (bobCount >= 8) {
                        due = oppositeDirection(due);
                        direction = oppositeDirection(direction);
                        position = getNewCoord(due, position);
                        bobCount = 0;
                        return {
                            "new" : position,
                            "old" : oldPos
                        }
                    }
                }
                if (bobCount >= 10) {// && Pacman.startingPositions[Pacman.randomTrial][2] !== 20) {
                    due = oppositeDirection(due);
                    direction = oppositeDirection(direction);
                    position = getNewCoord(due, position);
                    bobCount = 0;
                    return {
                        "new" : position,
                        "old" : oldPos
                    }
              /*  } else if (Pacman.startingPositions[Pacman.randomTrial][2] === 20) {
                    if (bobCount >= 10) {
                        due = oppositeDirection(due);
                        direction = oppositeDirection(direction);
                        position = getNewCoord(due, position);
                        bobCount = 0;
                        return {
                            "new": position,
                            "old": oldPos
                        }
                    } */
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
            [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6],
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
            layout === Pacman.BISCUIT || layout === Pacman.LEFT_DOOR || layout === Pacman.RIGHT_DOOR) {

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
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][3],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) + 3) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][4],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) + 4) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) + 5) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) + 6) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][7],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    }
                } else {
                    if (x === (userPosition / 10) - 2) {
                        ctx.fillStyle = "#FFFFFF";
                        // console.log(Pacman.randomTrial);
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][3],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 3) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][4],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 4) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][5],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 5) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][6],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    } else if (x === (userPosition / 10) - 6) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.arc((x * blockSize) + (blockSize / 2.5),
                            (y * blockSize) + (blockSize / 2.5),
                            blockSize / Pacman.startingPositions[Pacman.randomTrial][7],
                            0,
                            Math.PI * 2, false);
                        ctx.fill();
                    }
                }
            }
            if (layout === Pacman.LEFT_DOOR || layout === Pacman.RIGHT_DOOR) {
                let userPosition = Pacman.startingPositions[Pacman.randomTrial][1];
                // console.log("left or right door?")
                // if ( (userPosition < 80 && layout === Pacman.LEFT_DOOR) || (userPosition >= 80 && layout === Pacman.RIGHT_DOOR)) {
                //     ctx.fillStyle = "#2ECC71";
                //     ctx.fillRect((x * blockSize ), (y * blockSize),
                //         blockSize, blockSize);
                // } else {
                ctx.fillStyle = "#000";
                ctx.fillRect((x * blockSize), (y * blockSize),
                    blockSize, blockSize);
                // }
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

    function dialog(text, font = "18px Monaco") {
        ctx.fillStyle = "#FFFF00";
        ctx.font      = font;
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
            Pacman.usedTrials.length = 0;
        } else {
            Pacman.totalTrials++;
        }

        if (user.trials === 0) {
            user.trials = 20;
        }


        /*  if (user.trials !== 0) {
              console.log("Trial " + user.getTrials2());
              window.postMessage(["Trial " + user.getTrials2(),
                 JSON.stringify({Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                  Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                  Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:user.getLives()})], "*");
          } */
        map.reset();
        map.draw(ctx);
        user.resetPosition();
        user.setEaten(0);
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
        Pacman.chaseProb = 0.5;
        Pacman.attackProb = 0;
        Pacman.move = false;
        Pacman.biscvar = false;
        //console.log("Chase Prob at new level: " + Pacman.chaseProb);
        //console.log("Attack Prob at new level: " + Pacman.attackProb);
        //  console.log("User start: "  + PACMAN.getUserPos());
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

    function getState() {
        return state;
    }

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

    function getPayout(score) {
        const n = 3070;
        const arr = [...Array(n).keys()];
        let lambda = arr.indexOf(score);
        let xMax = 25;
        let xMin = 0;
        let yMax = 3070;
        let yMin = 0;
        const retArr = [];
        for (const i in arr) {
            let percent = (i - yMin) / (yMax - yMin);
            let outputX = percent * (xMax - xMin) + xMin;
            retArr.push(Math.round(outputX));
        }
        return(retArr[lambda]);
    }
    function mainDraw() {

        var diff, u, i, len, nScore;
        u = user.move(ctx);
        //console.log("Escape pos: " + Pacman.escapeUserPos);
        let g;
        //   if (Pacman.escapeUserPos !== 10 && Pacman.escapeUserPos !== 170 && Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
        // g = ghost1.move(ctx);
        //redrawBlock(g.old);
        //  }
        const now = performance.now();
        Pacman.timeArray.push((now - Pacman.totalTime) / 1000);
        if ((Pacman.move === false && Pacman.bisc1Array.slice(-1)[0] !== "True") || Pacman.biscvar === true) {
            Pacman.bisc1Array.push("False");
            Pacman.bisc2Array.push("False");
            Pacman.bisc3Array.push("False");
            Pacman.bisc4Array.push("False");
            Pacman.bisc5Array.push("False");
        }
        Pacman.biscvar = false;
        Pacman.escapeUserPos = 0;
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            Pacman.previousGhostStart = null;
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
        }
        userPosX = u["new"].x;
        Pacman.userLocationArray.push(userPosX);
        Pacman.eatenArray.push(user.getEaten());
        Pacman.scoreArray.push(user.theScore());
        if (Pacman.startingPositions[Pacman.randomTrial][2] !== null) {
            if (collided(userPos, ghostPos)) {
                if (ghost1.isVunerable()) {
                    //audio.play("eatghost");
                    ghost1.eat();
                    eatenCount += 1;
                    nScore = eatenCount * 50;
                    drawScore(nScore, ghostPos);
                    user.addScore(nScore);
                    setState(EATEN_PAUSE);
                    timerStart = tick;
                } else if (ghost1.isDangerous()) {
                    /*   window.postMessage(["Trial " + user.getTrials2(),
                           JSON.stringify({Times:Pacman.timeArray, GhostLocation:Pacman.ghostLocationArray, UserLocation:Pacman.userLocationArray,
                               Biscuit1:Pacman.bisc1Array, Biscuit2:Pacman.bisc2Array, Biscuit3:Pacman.bisc3Array, Biscuit4:Pacman.bisc4Array, Biscuit5:Pacman.bisc5Array,
                               Attack:Pacman.attackArray, Chase:Pacman.chaseArray, Eaten:Pacman.eatenArray, Score:Pacman.scoreArray, Lives:user.getLives()})], "*");
                     */  setState(DYING);
                    var die = new Audio('https://dl.dropbox.com/s/d1p1u1mpm55forc/341820__ianstargem__screechy-alarm.wav?dl=1');
                    //die.play();
                    timerStart = tick;
                    console.log("Eaten");

                }
            }
        }
    };

    // function pressN() {
    //     dialog("Press n to start a new game!");
    // }

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
            Pacman.averageScore.push(Pacman.scoreArray[Pacman.scoreArray.length - 1]);
            console.log("Average Score: " + Pacman.averageScore);
            // compute final score
            let filtered_average_score = Pacman.averageScore.filter(x => x !== undefined);
            let average_score_final = Math.floor(filtered_average_score.reduce((a,b) => a + b, 0) / filtered_average_score.length);
            let final_payout = getPayout(average_score_final);
            dialog("You earned a bonus of $" + final_payout + "! Press the arrow to continue", "10px Monaco");
            window.postMessage(["final_score", average_score_final], "*");
            window.postMessage("next", "*");
        }

        if (state === PLAYING) {
            mainDraw();
        }
        /*else if (state === ESCAPED) {
              mainDraw();
          } */
        else if (state === WAITING && stateChanged) {
            stateChanged = false;
            map.draw(ctx);
            if (user.getTrials() !== 0) {
                //if (user.getLives() === 0) {
                //setTimeout(pressN, 5000);
                //} else {
                Pacman.averageScore.push(Pacman.scoreArray[Pacman.scoreArray.length - 1]);
                console.log("Average Score: " + Pacman.averageScore);
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
                        dialog("Ready, ")
                    } else {
                        dialog("Go!");
                    }
                    //dialog("Starting in: " + diff);
                }
            }
            Pacman.countdownCheck = false;
        }

        drawFooter();
    }


    function eatenPill() {
        //audio.play("eatpill");
        timerStart = tick;
        eatenCount = 0;
        ghost1.makeEatable(ctx);
    };

    function completedLevel() {
        setState(WAITING);
        level += 1;
        map.reset();
        // user.newLevel();
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

    function getWholeUserPos() {
        return userPos;
    }

    function getWholeGhostPos() {
        return ghostPos;
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
        "getEaten1" : getEaten1,
        "getState" : getState,
        "setState" : setState,
        "collided" : collided,
        "getWholeUserPos" : getWholeUserPos,
        "getWholeGhostPos" : getWholeGhostPos
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
Pacman.LEFT_DOOR  = 5;
Pacman.RIGHT_DOOR  = 6;

// Pacman.MAP = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
//     [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 2, 2, 2],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 2, 2, 2, 2, 2, 2, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

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

