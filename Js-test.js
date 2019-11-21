
function $(name) {

    return ({

        ele: document.querySelector(name),

        attr: function (attr, val) {
            this.ele.setAttribute(attr, val)
        },

        css: function (obj) {
            for (let key in obj) {
                this.ele.style[key] = obj[key];
            }
        },

        show: function () {
            this.ele.style.display = "block";
        },

        hide: function () {
            this.ele.style.display = "none";
        },

        text: function (val) {
            this.ele.innerText = val;
        },
    })
}


document.querySelector('table').oncontextmenu = function (e) {
    e.preventDefault();
}


function random(begin, end) {
    return parseInt(Math.random() * (end - begin + 1) + begin);
}

function haveArr(arr, arrlist) {
    for (let item of arrlist) {
        if (arr.toString() === item.toString()) {
            return true;
        }
    }
}

const Minesweeper = {

    bombsNumber: undefined,

    start: false,

    level: undefined,

    _x: undefined,

    _y: undefined,

    restOfCube : undefined,

    restOfBombs : undefined,

    table: Object.create(null),

    init: function (ele, level) {

        this.level = level;

        if (level === 1) {
            this._x = 9;
            this._y = 9;
            this.bombsNumber = 10;
        } else if (level === 2) {
            this._x = 16;
            this._y = 16;
            this.bombsNumber = 40;
        } else if (level === 3) {
            this._x = 30;
            this._y = 16;
            this.bombsNumber = 99;
        }

        this.ele_desk = document.querySelector(ele);

        this.createDest();

        this.sweeper();

    },

    getAround: function (y, x) {
        let a = [];
        this.check(y - 1, x - 1) && a.push([y - 1, x - 1])
        this.check(y - 1, x) && a.push([y - 1, x])
        this.check(y - 1, x + 1) && a.push([y - 1, x + 1])
        this.check(y, x + 1) && a.push([y, x + 1])
        this.check(y + 1, x + 1) && a.push([y + 1, x + 1])
        this.check(y + 1, x) && a.push([y + 1, x])
        this.check(y + 1, x - 1) && a.push([y + 1, x - 1])
        this.check(y, x - 1) && a.push([y, x - 1])
        return a;
    },

    check: function (y, x) {
        y = +y;
        x = +x;
        let my = this._y - 1;
        let mx = this._x - 1;
        if (((y - 1 >= -1 && y <= my) && (y + 1 <= my + 1 && y >= 0)) && ((x - 1 >= -1 && x <= mx) && (x + 1 <= mx + 1 && x >= 0))) {
            return true;
        } else {
            return false;
        }
    },

    createDest: function () {
        let tr, td, span;
        for (let y = 0; y < this._y; y++) {
            tr = document.createElement('tr');
            this.table[y] = Object.create(null);
            for (let x = 0; x < this._x; x++) {
                td = document.createElement('td');
                span = document.createElement('span');
                span.setAttribute('class', 'basics cover');
                td.appendChild(span);

                this.table[y][x] = {

                    //status 的属性  0 ：默认   1 : 打开状态   2 : 标记小红旗   3 : 标记问号
                    status: 0,
                    //have 的属性  0 : 空  1 : 有雷  2 : 有数字
                    have: 0,

                    clue: 0,

                    select: 0,

                    span: span,

                    normal: function () {
                        this.span.setAttribute('class', 'basics cover')
                        this.span.innerText = "";
                        this.status = 0;
                        this.select = 0;
                    },

                    open: function () {
                        this.span.setAttribute('class', 'basics bg')
                        this.status = 1;
                        if (this.clue) { this.text(this.clue) }
                        Minesweeper.restOfCube -= 1;
                    },

                    markup: function () {
                        this.span.setAttribute('class', 'basics cover flag')
                        this.status = 2;
                        this.select = 1;
                        if (this.have === 1) { Minesweeper.restOfCube -= 1 }
                        Minesweeper.restOfBombs -= 1;
                    },

                    doubt: function () {
                        this.span.setAttribute('class', 'basics cover')
                        this.status = 3;
                        this.select = 2;
                        this.span.innerText = "?"
                        Minesweeper.restOfCube += 1;
                        Minesweeper.restOfBombs += 1;
                    },

                    exp: function () {
                        this.span.setAttribute('class', 'basics bg bomb')
                    },

                    text: function (val) {
                        this.span.innerText = val;
                    },

                    symbol_x: function () {
                        this.span.setAttribute('class', 'basics bg symbol-x')
                    },

                    symbol_x_up: function () {
                        this.span.setAttribute('class', 'basics bg')
                    },

                    select_around: function () {
                        this.span.setAttribute('class', 'basics select-around')
                    },

                    select_around_up: function () {
                        this.span.setAttribute('class', 'basics cover')
                    }

                }

                tr.appendChild(td);
            }
            this.ele_desk.appendChild(tr);
        }
    },

    sweeper: function () {

        let save8 = [], symbolx;

        document.addEventListener('mouseup', function (event) {

            if (symbolx) symbolx.symbol_x_up();

            if (save8.length) {
                if (event.button === 2 || event.button === 0) {
                    save8.forEach(function (item) {
                        item.select_around_up();
                    })
                }
            }

            save8 = [];

        }, false)

        let that = this;

        for (let y = 0; y < this._y; y++) {

            for (let x = 0; x < this._x; x++) {

                let cube;

                this.table[y][x].span.addEventListener('mousedown', function (event) {

                    cube = that.table[y][x];

                    if (event.buttons === 1) {

                        if (!that.start) {

                            that.restart(y, x);

                            that.start = true;
                        }

                        if (cube.status === 0) {

                            if (cube.have === 1) {

                                that.bombs();
    
                            } else {
                                
                                if (cube.have === 2) {

                                    cube.open();

                                } else {

                                    cube.open();

                                    that.uncoverEmpty();
                                }
                            }
                        }

                    } else if (event.buttons === 2) {

                        if (cube.select === 0) {

                            if (cube.status === 0) {

                                cube.markup();

                            }

                        } else if (cube.select === 1) {

                            cube.doubt();

                        } else if (cube.select === 2) {

                            cube.normal();
                        }

                    } else if (event.buttons === 3) {

                        let sum = 0, around = [];

                        that.getAround(y, x).forEach((p) => {
                            //status 为2，为标记小红旗状态
                            sum += (that.table[p[0]][p[1]].status === 2 ? 1 : 0)

                            around.push(that.table[p[0]][p[1]])

                        })
                        //如果统计已经标记的数值与提示信息相同，则为完成扫雷

                        if (sum === cube.clue) {

                            for (let item of around) {

                                if (item.status === 0) {

                                    if (item.have !== 1) {

                                        item.open();
    
                                    } else if (item.have === 1) {
    
                                        that.bombs();
    
                                    }

                                }

                            }

                            that.uncoverEmpty();

                        } else {

                            for (let item of around) {
                                if (item.status === 0) {
                                    item.select_around();
                                    save8.push(item);
                                }
                            }

                            if (cube.clue) {
                                cube.symbol_x();
                                symbolx = cube;
                            }
                        }
                    }

                    $('#info').text(that.restOfBombs);

                    that.checkWin();

                }, false)
            }
        }
    },

    restart: function (y, x) {

        this.restOfCube = this._y * this._x;

        this.restOfBombs = this.bombsNumber;

        this.settleBombs(y, x);

        this.markupAllBombs();

    },


    settleBombs: function (ny, nx) {

        let notList = this.getAround(ny, nx);
        notList.push([ny, nx]);
        let y, x, n = this.bombsNumber;
        while (n) {
            do {
                y = random(0, this._y - 1);
                x = random(0, this._x - 1);
            } while (haveArr([y, x], notList))
            if (this.table[y][x].have !== 1) {
                this.table[y][x].have = 1;
                n -= 1;
            }
        }
    },

    markupAllBombs: function () {

        let sum = 0;

        for (let y = 0; y < this._y; y++) {

            for (let x = 0; x < this._x; x++) {

                if (this.table[y][x].have === 0) {

                    this.getAround(y, x).forEach((p) => {

                        sum += (this.table[p[0]][p[1]].have === 1 ? 1 : 0)

                    })

                }

                if (sum) {
                    this.table[y][x].clue = sum;
                    this.table[y][x].have = 2;
                }

                sum = 0;
            }
        }
    },


    uncoverEmpty: function () {

        let sum = 0, stop = false, tmp;
        while (!stop) {
            for (let y = 0; y < this._y; y++) {
                for (let x = 0; x < this._x; x++) {
                    //状态为打开，have为空
                    if (this.table[y][x].status === 1 && this.table[y][x].have === 0) {
                        this.getAround(y, x).forEach((p) => {
                            tmp = this.table[p[0]][p[1]];
                            if (tmp.status === 0) {
                                tmp.open();
                                sum += 1;
                            }
                        })
                    }
                }
            }
            stop = sum ? false : true;
            sum = 0
        }
    },

    bombs: function () {
        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                if (this.table[y][x].have === 1) {
                    this.table[y][x].exp();
                }
            }
        }
    },

    checkWin : function () {
        if (this.restOfCube === 0) {
            alert("WIN")
        }
    }
}

Minesweeper.init("#desk", 3)


