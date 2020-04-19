// 作者：张晓雷
// 邮箱: zhangxiaolei@outlook.com
// 协议：MIT

const timer = new createTimer('#timer');

document.oncontextmenu = function (e) {
    e.preventDefault();
}

function random(begin, end) {
    return parseInt(Math.random() * (end - begin + 1) + begin);
}

function haveArr(arr, arrList) {
    for (let item of arrList) {
        if (arr.toString() === item.toString()) {
            return true;
        }
    }
    return false;
}

const Minesweeper = {

    bombsNumber: undefined,

    begin: false,

    end: false,

    level: undefined,

    _x: undefined,

    _y: undefined,

    restOfCube: undefined,

    restOfBombs: undefined,

    table: Object.create(null),

    init: function (level) {

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

        this.begin = false;

        this.end = false;

        timer.reset();

        //重置表格单元
        this.ele_desk = document.querySelector("#desk");
        this.ele_desk.innerHTML = '';
        this.createDest();
        this.sweeper();


        //重新显示雷的剩余数量
        this.restOfBombs = this.bombsNumber;
        $('#mineNum').text(this.restOfBombs);

        //方块的所有数量
        this.restOfCube = this._y * this._x;

    },

    start: function (ny, nx) {

        timer.start();

        this.settleBombs(ny, nx);

        this.markupAllBombs();

    },

    reset: function () {

        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                this.table[y][x].have = 0;
                this.table[y][x].clue = 0;
                this.table[y][x].normal();
            }
        }

        timer.reset();

        this.begin = false;

        this.end = false;

        //重新显示雷的剩余数量
        this.restOfBombs = this.bombsNumber;
        $('#mineNum').text(this.restOfBombs);

        //方块的所有数量
        this.restOfCube = this._y * this._x;

    },


    getAround: function (y, x) {
        let a = [];
        this.check(y - 1, x - 1) && a.push([y - 1, x - 1]);
        this.check(y - 1, x) && a.push([y - 1, x]);
        this.check(y - 1, x + 1) && a.push([y - 1, x + 1]);
        this.check(y, x + 1) && a.push([y, x + 1]);
        this.check(y + 1, x + 1) && a.push([y + 1, x + 1]);
        this.check(y + 1, x) && a.push([y + 1, x]);
        this.check(y + 1, x - 1) && a.push([y + 1, x - 1]);
        this.check(y, x - 1) && a.push([y, x - 1]);
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

        let divBorder, divLine, b;

        divBorder = document.createElement('div');

        divBorder.setAttribute('class', 'desk_border')

        let _v, BGType = localGameData.BGColor;

        switch (BGType) {
            case 1: _v = '-1'; break
            case 2: _v = '-2'; break
            case 3: _v = '-3'; break
        }
        // v === _v
        function makeClass(el, v) {
            return function (val, ex) {
                ex = ex ? (' ' + ex) : '';
                el.setAttribute('class', val + v + ex)
            }
        }

        for (let y = 0; y < this._y; y++) {
            divLine = document.createElement('div');
            this.table[y] = Object.create(null);
            for (let x = 0; x < this._x; x++) {
                b = document.createElement('b');
                b.setAttribute('class', 'c-cover' + _v);
                this.table[y][x] = {

                    // 0 ：默认   1 : 打开状态   2 : 标记小红旗   3 : 标记问号
                    status: 0,

                    // 0 : 空  1 : 有雷  2 : 有数字
                    have: 0,

                    clue: 0,

                    //等于0时，执行操作后，select等于1；等于1时，执行操作后，select等于2；等于2时，执行操作，select等于0。
                    select: 0,

                    span: b,

                    class: makeClass(b, _v),

                    normal: function () {
                        this.class('c-cover')
                        this.span.innerText = "";
                        this.span.style.color = '';
                        this.status = 0;
                        this.select = 0;
                    },

                    open: function () {
                        this.class('c-bg')
                        this.status = 1;
                        if (this.clue) {
                            switch (this.clue) {
                                //颜色按照win7系统自带的扫雷数字设置
                                case 1: this.span.style.color = 'rgb(65,80,190)'; break
                                case 2: this.span.style.color = 'rgb(30,100,5)'; break
                                case 3: this.span.style.color = 'rgb(170,5,5)'; break
                                case 4: this.span.style.color = 'rgb(15,15,140)'; break
                                case 5: this.span.style.color = 'rgb(125,5,5)'; break
                                case 6: this.span.style.color = 'rgb(5,125,125)'; break
                                case 7: this.span.style.color = 'rgb(170,5,5)'; break
                                case 8: this.span.style.color = 'rgb(170,5,5)'; break
                                default: console.log("clue error")
                            }
                            this.text(this.clue)
                        }
                        Minesweeper.restOfCube -= 1;
                    },

                    markup: function () {
                        this.class('c-flag')
                        this.status = 2;
                        this.select = 1;
                        if (this.have === 1) { Minesweeper.restOfCube -= 1 }
                        Minesweeper.restOfBombs -= 1;
                        $('#mineNum').text(Minesweeper.restOfBombs);
                    },

                    doubt: function () {
                        this.class('c-cover')
                        this.status = 3;
                        this.select = 2;
                        this.span.style.color = '#FFFFFF';
                        this.span.innerText = "?"
                        if (this.have === 1) { Minesweeper.restOfCube += 1 }
                        Minesweeper.restOfBombs += 1;
                        $('#mineNum').text(Minesweeper.restOfBombs);
                    },
                    //游戏结束，雷显示
                    exp: function () {
                        this.class('c-bomb')
                    },
                    //直接爆炸
                    expNow: function () {
                        this.class('c-expNow')
                        this.select = 4;
                    },
                    //游戏结束，标记正确
                    mkYesBomb: function () {
                        this.class('c-mkyes')
                    },
                    //游戏结束，标记错误
                    mkNoBomb: function () {
                        this.class('c-mkno')
                    },

                    text: function (val) {
                        this.span.innerText = val;
                    },
                    //X号
                    symbol_x: function () {
                        this.class('c-bg-x')
                    },
                    //消除X号
                    symbol_x_up: function () {
                        this.class('c-bg')
                    },

                    select_around: function () {
                        this.class('c-bg')
                    },
               
                    recover: function () {
                        this.status === 2
                            ? this.class('c-flag')
                            : this.class('c-cover')
                    },

                    hover: function () {
                        this.status === 2
                            ? this.class('c-flag', 'c-hover')
                            : this.class('c-cover', 'c-hover')
                    }
                }
                divLine.appendChild(b);
            }
            divBorder.appendChild(divLine);
        }
        this.ele_desk.appendChild(divBorder);
    },

    sweeper: function () {

        let center = [],
            around = [],
            sum = 0,
            that = this,
            leftUpLock = false,
            leftKeyPress = false,
            allUpDone = false;

        //消除动画
        function allUpDoneFunc() {

            if (that.end) { return }
           
            if (center.length) { 
                let c = center.pop()
                c.symbol_x();
                setTimeout(() => {
                    c.symbol_x_up();
                    center = [];
                }, 60)
            }

            for (let item of around) {
                if (item.status === 0) {
                    item.recover();
                }
            }

            around = [];
            sum = 0;
            leftKeyPress = false;
        }
        //清除动作
        function allUpWork() {
            //执行这一个步的前提是 status === 1 && sum === clue
            //收集around数据的条件是 status === 0，也就是遮盖的方块
            //理论上到这一步，around里的数据都是空的，因为 sum === clue。但用户可能标错，所以一旦发现 have === 1 则说明触雷，游戏结束。
            //bombs方法会对标记正确还是错误进行判断，并进行标识。
            for (let item of around) {
                if (item.status === 0) {
                    if (item.have !== 1) {
                        item.open();
                    } else if (item.have === 1) {
                        item.expNow();
                        that.end = true;
                    }
                }
            }

            that.uncoverEmpty();

            if (that.end) { that.bombs();}

            that.checkWin();

            if (that.end) {
                leftUpLock = false;
                leftKeyPress = false;
                allUpDone = false;
                center = [];
                around = [];
                sum = 0;
            }
        }

        for (let y = 0; y < this._y; y++) {

            for (let x = 0; x < this._x; x++) {

                let cube = that.table[y][x];
                   //光标移动
                cube.span.addEventListener('mouseover', function () {

                    if (!that.end) {

                        if (leftKeyPress) {
                            cube.select_around()
                        } else if (cube.status !== 1) {
                            cube.hover();
                        }

                        if (leftUpLock) {
                            aroundCheck(y, x);
                        }
                    }
                })
                //光标移过
                cube.span.addEventListener('mouseout', function () {

                    if (!that.end) {

                        if (cube.status !== 1) {
                            cube.recover();
                        }

                        if (center.length) {
                            center.shift().symbol_x_up();
                        }

                        if (around.length) {
                            allUpDoneFunc();
                        }
                    }
                })
                //按下动作
                cube.span.addEventListener('mousedown', function (event) {

                    if (that.end) { return }

                    if (event.buttons === 1 && cube.status === 0) {
                        
                        cube.select_around();

                        leftKeyPress = true;

                    } else if (event.buttons === 2) {
                        
                        if (cube.select === 0) {

                            if (cube.status === 0) { cube.markup();}

                        } else if (cube.select === 1) {

                            cube.doubt();

                        } else if (cube.select === 2) {

                            cube.normal();

                        }

                        that.checkWin();

                    } else if (event.buttons === 3) {
                        
                        leftUpLock = true;

                        aroundCheck(y, x);

                    }

                }, false)

                function aroundCheck(y, x) {

                    let status;

                    that.getAround(y, x).forEach((p) => {
                        status = that.table[p[0]][p[1]].status;
                        sum += (status === 2 ? 1 : 0)
                        if (status === 0) {
                            around.push(that.table[p[0]][p[1]])
                        }
                    })

                    if (cube.status === 1 && cube.clue) {
                        center.push(cube);
                    } else if (cube.status === 0) {
                        around.push(cube);
                    }

                    around.forEach(item => item.select_around())

                }

                //松开动作
                cube.span.addEventListener('mouseup', function (event) {

                    if (that.end) { return }

                    if (event.button === 0) {

                        if (!leftUpLock) {

                            leftUpLock = false;

                            leftKeyPress = false;

                            if (!that.begin) {
                                that.start(y, x);
                                that.begin = true;
                                that.end = false;
                            }

                            if (cube.status === 0) {
                                if (cube.have === 1) {
                                    cube.expNow();
                                    that.bombs(y, x);
                                } else {
                                    if (cube.have === 2) {
                                        cube.open();
                                    } else {
                                        cube.open();
                                        that.uncoverEmpty();
                                    }
                                }
                            }

                            that.checkWin();
                            
                        } else {

                            if (!allUpDone) {
                                if (cube.status === 1 && cube.clue === sum) {
                                    allUpWork();
                                }
                                allUpDoneFunc(); 
                                allUpDone = true;
                            } else {
                                allUpDone = false;
                                leftUpLock = false;
                            }
                        }
                    } else if (event.button === 2) {

                        if (leftUpLock && !allUpDone) {
                            if (cube.status === 1 && cube.clue === sum) {
                                allUpWork();
                            }
                            allUpDoneFunc(); 
                            allUpDone = true;
                        } else {
                            allUpDone = false;
                            leftUpLock = false;
                        }
                    }
                }, false)
            }
        }
    },

    settleBombs: function (ny, nx) {

        let y, x,
            n = this.bombsNumber,
            notList = this.getAround(ny, nx);

        notList.push([ny, nx]);

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

        timer.stop();
        this.end = true;
        lostSaveGameData(this.level);
        let item;
        for (let y = 0; y < this._y; y++) {
            for (let x = 0; x < this._x; x++) {
                item = this.table[y][x];
                //有雷，且标记小红旗
                if (item.status === 2 && item.have === 1) {
                    item.mkYesBomb();
                    //无雷，标记错误
                } else if (item.status === 2 && item.have !== 1) {
                    item.mkNoBomb();
                    //当场爆炸，游戏已经结束，暂借selec属性实现功能。
                } else if (item.select === 4) {
                    item.expNow();
                } else if (item.have === 1) {
                    item.exp();
                }
            }
        }
    },

    checkWin: function () {
        if (this.restOfCube === 0) {
            $('#games-win-window').show();
            setPopupLoc('#games-win-window');
            timer.stop();
            this.end = true;
            $('#spendTime').text(timer.getTime() + '秒')
            winSaveGameData(this.level);
        }
    }
}

function winSaveGameData(level) {
    let item;
    if (level === 1) {
        item = localGameData.level1;
    } else if (level === 2) {
        item = localGameData.level2;
    } else if (level === 3) {
        item = localGameData.level3;
    }
    item.totalBout += 1;
    item.winsBout += 1;
    item.c_WinNow += 1;
    item.c_LostNow = 0;
    if (item.c_WinNow > item.c_WinPast) {
        item.c_WinPast = item.c_WinNow;
    }
    item.bestResult5.push(timer.getTime() + ':' + new Date().getTime());
    item.bestResult5.sort(sortControl);
    if (item.bestResult5.length > 5) {
        item.bestResult5.pop();
    }
    saveGameDataToLocal();
}

function lostSaveGameData(level) {
    let item;
    if (level === 1) {
        item = localGameData.level1;
    } else if (level === 2) {
        item = localGameData.level2;
    } else if (level === 3) {
        item = localGameData.level3;
    }
    item.totalBout += 1;
    item.c_WinNow = 0;
    item.c_LostNow += 1;
    if (item.c_LostNow > item.c_LostPast) {
        item.c_LostPast = item.c_LostNow;
    }
    saveGameDataToLocal();
}

function sortControl(a, b) {
    let ia, fa, ib, fb;
    ia = parseInt(a.slice(0, a.indexOf(":")));
    fa = parseInt(a.slice(a.indexOf(":") + 1));
    ib = parseInt(b.slice(0, b.indexOf(":")));
    fb = parseInt(b.slice(b.indexOf(":") + 1));
    if (ia !== ib) {
        return ia - ib;
    } else {
        return fa - fb;
    }
}

function formatTime(val) {
    let d = val.split(':');
    let t = new Date();
    t.setTime(d[1]);
    return ({
        'date': d[0] + "s : " + t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate(),
        'time': d[0] + "s : " + t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + '日 ' + t.getHours() + '点' + t.getMinutes() + '分'
    })
}

//让窗口具备移动能力
moveElement("#move-mine", "#minesweeper");
moveElement("#move-win", "#games-win-window");
moveElement("#move-info", "#games-info-window");
moveElement("#move-about", "#about-games-window");

//所有关闭按钮的事件
document.querySelectorAll('.point3').forEach(function (item) {
    item.addEventListener('click', function () {
        $(this.parentElement.parentElement.parentElement).hide();
    }, false)
})
//所有弹出窗口的定位
function setPopupLoc(name) {
    let el = document.querySelector(name),
        m = ui.minesweeper,
        y = m.offsetTop,
        x = m.offsetLeft,
        w = m.offsetWidth,
        h = m.offsetHeight,
        el_w = el.offsetWidth,
        el_h = el.offsetHeight;
    el.style.left = (x + w / 2) - el_w / 2 + 'px';
    el.style.top = (y + h / 2) - el_h / 2 + 'px';
}

//初始数据
const initGameData = {

    startLevel: 1,

    //1:Green, 2:Red, 3:Blue

    BGColor: 1,

    level1: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },

    level2: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },

    level3: {
        bestResult5: [],
        totalBout: 0,
        winsBout: 0,
        c_WinNow: 0,
        c_WinPast: 0,
        c_LostNow: 0,
        c_LostPast: 0,
    },
}

function displayInfo(obj) {

    ui.info_right[0].innerText = obj.totalBout;
    ui.info_right[1].innerText = obj.winsBout;
    ui.info_right[2].innerText = parseInt((obj.winsBout / obj.totalBout || 0) * 100) + "%";
    ui.info_right[3].innerText = obj.c_WinPast;
    ui.info_right[4].innerText = obj.c_LostPast;

    for (let i = 0; i < 5; i++) {
        ui.info_left[i].innerText = '';
    }

    let tmp;

    for (let i = 0; i < obj.bestResult5.length; i++) {
        tmp = formatTime(obj.bestResult5[i]);
        ui.info_left[i].innerText = tmp.date;
        ui.info_left[i].title = tmp.time;
    }

}

//载入本地数据
const localGameData = JSON.parse(localStorage.getItem("swpGameData"));

if (!localGameData) {
    localGameData = initGameData;
}
//初始化游戏
Minesweeper.init(localGameData.startLevel);
//保存至本地
function saveGameDataToLocal() {
    if (window.localStorage) {
        localStorage.setItem("swpGameData", JSON.stringify(localGameData))
    } else {
        console.error("Failed to store game record to local, [window.localStorage] object not found")
    }
}
//所有UI对象的保存
const ui = {
    opt: $('#opt').ele,
    opt_list: $('#opt-list').ele,
    minesweeper: $('#minesweeper').ele,
    opt_switch: {
        l1: $('#normal-info').ele,
        l2: $('#middle-info').ele,
        l3: $('#hard-info').ele,
        bg: '#F6EFEF',
        sbg: '#87CEEB'
    },
    info_left: document.querySelectorAll('#win5 ul li'),
    info_right: document.querySelectorAll('#win5info li span')
}
//选项菜单弹出
$(ui.opt).movein(function () {
    $(ui.opt_list).show();
})
//选项菜单移除消失
$(ui.opt).moveout(function () {
    $(ui.opt_list).hide();
})
//重新开始游戏
$('#opt-restart').click(function () {
    Minesweeper.reset();
    $(ui.opt_list).hide();
})
//关于窗口
$('#opt-about').click(function () {
    $('#about-games-window').show();
    setPopupLoc('#about-games-window')
    $(ui.opt_list).hide();
})

document.querySelectorAll('.opt-level li').forEach((item, index) => {
    item.addEventListener('click', function () {
        Minesweeper.init(index + 1);
        localGameData.startLevel = index + 1;
        saveGameDataToLocal();
        $(ui.opt_list).hide();
    })
}, false)

function infoSwitch(level) {
    if (level === 1) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.sbg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.bg)
    } else if (level === 2) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.sbg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.bg)
    } else if (level === 3) {
        $(ui.opt_switch.l1).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l2).css('background-color', ui.opt_switch.bg)
        $(ui.opt_switch.l3).css('background-color', ui.opt_switch.sbg)
    }
}

$('#opt-info').click(function () {
    let data, level = Minesweeper.level;
    $('#games-info-window').show();
    setPopupLoc('#games-info-window')
    infoSwitch(Minesweeper.level)
    if (level === 1) {
        data = localGameData.level1;
    } else if (level === 2) {
        data = localGameData.level2;
    } else if (level === 3) {
        data = localGameData.level3;
    }
    displayInfo(data)
    $(ui.opt_list).hide();
})

$(ui.opt_switch.l1).click(function () {
    infoSwitch(1)
    displayInfo(localGameData.level1)
})

$(ui.opt_switch.l2).click(function () {
    infoSwitch(2)
    displayInfo(localGameData.level2)
})

$(ui.opt_switch.l3).click(function () {
    infoSwitch(3)
    displayInfo(localGameData.level3)
})

document.querySelectorAll('.opt-bg li').forEach((item, index) => {
    item.addEventListener('click', function () {
        localGameData.BGColor = index + 1;
        Minesweeper.init(Minesweeper.level)
        saveGameDataToLocal();
        $(ui.opt_list).hide();
    }, false)
})