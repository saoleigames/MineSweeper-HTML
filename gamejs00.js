
/*
DoubleMouse对象的作用是实现左右鼠标按键同时作用的功能，根据添加鼠标事件的类型（mousedown, mouseup)，
实现不同的功能。event.buttons 属性貌似也提供同时按下的功能，但在我的浏览器上（Microsoft Edge BETA），
这个属性不能用，同时按下以后，会先触发一个左键时间，再触发同时按下事件。

具体用法：

let mouse = new DoubleMouse(参数)； 参数可选，默认为20；

参数的作用是设定左右键同时按下时判定是否为同时动作的条件，即左右键的最大间隔时间是20毫秒，如果左右键的
时间在20秒以内，则判定为同时按下，如果大于20毫秒，则判定为单独按下。

这意味着，通过此对象功能实现的所有动作将会延时20毫秒（根据参数）执行。

一个页面只需要实例化一个对象，因为任何时候，都只有一个鼠标在动作，而每次动作完成，对象都会重置。

document.querySelector('elem').addEventListener('mousedown', function (event) {

    if (event.button === 0) {
        mouse.left(function() {
            //左键动作
        })
    } else if (event.button === 2) {
        mouse.right(function() {
            //右键动作
        })
    }
    mouse.together(function() {
        //同时按下动作
    })

}

*/
class DoubleMouse {

    constructor (gap) {
        this.gap = gap || 20;
        this.leftStamp = 0;
        this.rightStamp = 0;
        this.stop_L = undefined;
        this.stop_R = undefined;
        this.togetherFn = undefined;
    }

    reset () {
        this.leftStamp = 0;
        this.rightStamp = 0;
    }

    getTime () {
        return new Date().getTime();
    }

    left (callback) {
        this.leftStamp = this.getTime();
        this.stop_L = setTimeout(() => {
            clearTimeout(this.stop_R);
            if (!this.rightStamp || Math.abs(this.leftStamp - this.rightStamp) > this.gap) {
                callback();
            } else {
                this.togetherFn();
            }
            this.reset();
        }, this.gap);
    }

    right (callback) {
        this.rightStamp = this.getTime();
        this.stop_R = setTimeout(() => {
            clearTimeout(this.stop_L)
            if (!this.leftStamp || Math.abs(this.leftStamp - this.rightStamp) > this.gap) {
                callback();
            } else {
                this.togetherFn();
            }
            this.reset();
        }, this.gap);
    }

    together (callback) {
        this.togetherFn = callback;
    }
}






function $(name) {

    return ({

        ele: typeof name === 'string' ? document.querySelector(name) : name,

        attr: function (attr, val) {
            this.ele.setAttribute(attr, val)
        },
        /*
        css: function (obj) {
            for (let key in obj) {
                this.ele.style[key] = obj[key];
            }
        },
        */
        css : function (type, val) {
            this.ele.style[type] = val
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

        click: function (fn) {
            this.ele.addEventListener('click', fn, false);
        },

        movein: function (fn) {
            this.ele.addEventListener('mouseover', fn, false);
        },

        moveout: function (fn) {
            this.ele.addEventListener('mouseout', fn, false);
        }
    })
}


function createTimer(id) {
    this.id = document.querySelector(id);
    var addTime = 0;
    var timerStop;
    
    var itv = function () {
        addTime += 1;
        this.id.innerText = addTime;
    };

    //开始计时
    this.start = function () {
        //扫雷点击开始直接从1秒开始计时
        addTime += 1;
        this.id.innerText = addTime;
        timerStop = setInterval(itv.bind(this), 1000);
    };
    //时间停止
    this.stop = function () {
        clearInterval(timerStop);
    };
    //初始化计时
    this.reset = function () {
        clearInterval(timerStop);
        this.id.innerText = 0;
        addTime = 0;
    };
    //获取时间
    this.getTime = function () {
        return addTime;
    }
}



function moveElement(select, moveBody, marginX, marginY) {

    let startX, startY, mousePress = false;

    marginX = marginX || 5;
    marginY = marginY || 8;

    select = document.querySelector(select);
    moveBody = document.querySelector(moveBody);

    select.addEventListener("mousedown", function (event) {
        startX = event.offsetX;
        startY = event.offsetY;
        mousePress = true;
    })

    document.addEventListener("mousemove", function (event) {
        if (mousePress) {
            moveBody.style.left = event.clientX - (startX + marginX + 2) + "px";
            moveBody.style.top = event.clientY - (startY + marginY + 2) + "px";
        }
    }, false);

    document.addEventListener("mouseup", function () {
        mousePress = false;
    }, false);
}
