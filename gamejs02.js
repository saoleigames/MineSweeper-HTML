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


moveElement("#move-mine", "#minesweeper");
moveElement("#move-win", "#games-win-window");
moveElement("#move-info", "#games-info-window");
moveElement("#move-about", "#about-games-window");

document.querySelectorAll('.point3').forEach(function (item) {
    item.addEventListener('click', function () {
        $(this.parentElement.parentElement.parentElement).hide();
    }, false)
})


let ui = {
    opt : $('#opt').ele,
    opt_list : $('#opt-list').ele,
    minesweeper : $('#minesweeper').ele,
}

$(ui.opt).movein(function () {
    $(ui.opt_list).show();
})

$(ui.opt).moveout(function () {
    $(ui.opt_list).hide();
})

$('#opt-restart').click(function () {

    Minesweeper.reset();

    $(ui.opt_list).hide();
})

$('#opt-about').click(function () {

    popupWinLoc('#about-games-window', 340, 224)

    $('#about-games-window').show();

    $(ui.opt_list).hide();
})

$('#opt-info').click(function () {

    popupWinLoc('#games-info-window', 414, 284)

    $('#games-info-window').show();

    $(ui.opt_list).hide();
})

function popupWinLoc(name, width, height) {
    winsize = document.querySelector(name);
    let m = ui.minesweeper;
    let w = m.offsetWidth;
    let h = m.offsetHeight;
    let y = m.offsetTop;
    let x = m.offsetLeft;
    winsize.style.left = (x + w / 2) - width / 2 + 'px';
    winsize.style.top = (y + h / 2) - height / 2 + 'px';
}

$('#s-normal').click(function () {

    Minesweeper.init(1);

    $(ui.opt_list).hide();
})

$('#s-middle').click(function () {

    Minesweeper.init(2);

    $(ui.opt_list).hide();
})

$('#s-hard').click(function () {

    Minesweeper.init(3);

    $(ui.opt_list).hide();
})


