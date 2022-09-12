isStarted = false;
startdate = new Date();

// 時給。
jikyuu = 5000;
second = jikyuu / 60 / 60;

timerId = 0;
money = 0;

// Webからのコピペ。日付フォーマット。
function dateToStr24HPad0DayOfWeek(date, format) {
    var weekday = ["日", "月", "火", "水", "木", "金", "土"];
    if (!format) {
        format = 'YYYY/MM/DD(WW) hh:mm:ss'
    }
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/WW/g, weekday[date.getDay()]);
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    return format;
}

function load() {
    var saveData = store.get('user_data');
    // データが存在するならせっせとフォームにセットしにいく。
    if (!saveData) {
        return;
    }
    if (saveData["jikyu"] && saveData["jikyu"] != "") {
        $('#jikyu').val(saveData["jikyu"]);
    }
    // すでに開始している。
    if (saveData["enable"] && saveData["enable"] != "") {
        if (saveData["enable"]) {
            startWork(saveData["time"]);
            isStarted = true;
            $('#start').hide();
            $('#stop').show();
        }
    }
}

function save(_time, _enable, _jikyuu) {
    var saveData = {};
    saveData["time"] = _time.getTime();
    saveData["enable"] = _enable;
    saveData["jikyu"] = _jikyuu;
    store.set('user_data', saveData);
}

function initialize() {
    // 前回のデータ読み込み。
    load();
}

function startWork(startTime) {
    const countUp = () => {
        // 経過時間。
        $('#timeText').text(passTime(startdate));
        // 稼いだお金。
        var diff_time = Date.now() - startdate.getTime();
        var seconds = Math.floor(diff_time / 1000);
        money = Math.floor(second * seconds * 100) / 100;
        $('#moneyText').text(money + "円");
    }

    // フォームに入力された値を取得。
    jikyuu = $('#jikyu').val();

    if (isNaN(jikyuu)) {
        alert("入力された時給が数値ではありません");
        return false;
    } else if (jikyuu == "") {
        alert("時給を入力してください");
        return false; 
    }

    // 秒給を計算。
    second = jikyuu / 60 / 60;

    if (startTime == 0) {
        startdate = new Date();
    } else {
        startdate = new Date(startTime);
    }

    // もろもろ値初期化。
    var diff_time = Date.now() - startdate.getTime();
    var seconds = Math.floor(diff_time / 1000);
    money = Math.floor(second * seconds * 100) / 100;
    $('#moneyText').text(money + "円");

    $('#timeText').text(passTime(startdate));
    
    // 開始日時。
    var day = dateToStr24HPad0DayOfWeek(startdate, 'YYYY年MM月DD日(WW) hh:mm');
    $('#startTimeText').text(day);

    timerId = setInterval(countUp, 1000);
    isStarted = true;

    return true;
}

function stopWork() {
    clearInterval(timerId);
    isStarted = false;
    alert("稼いだお金は" + money + "円でした。\nおつかれさまでした！");
    return true;
}

// 経過時間のテキストを返す。
function passTime(startTime) {
    var diff_time = Date.now() - startTime.getTime();
    var seconds = Math.floor(diff_time / 1000);
    var pass_seconds = seconds % 60;
    var pass_minutes = Math.floor(seconds / 60) % 60;
    var pass_hours = Math.floor(seconds / (60 * 60));

    return ('0' + pass_hours).slice(-2) + ":" + ('0' + pass_minutes).slice(-2) + ":" + ('0' + pass_seconds).slice(-2);
}

$(function () {
    // 開始ボタン。
    $('#start').click(function () {
        // 開始してたらスルー。
        if (isStarted) {
            return;
        }
        if(!startWork(0))
        {
            return;
        }
        save(startdate, true, jikyuu);
        $('#start').hide();
        $('#stop').show();
    });
    // 終了ボタン。
    $('#stop').click(function () {
        // 開始してなかったらスルー。
        if (!isStarted) {
            return;
        }
        if(!stopWork())
        {
            return;
        }
        save(startdate, false, jikyuu);
        $('#start').show();
        $('#stop').hide();
    });
});















