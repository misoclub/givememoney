
isStarted = false;

startdate = new Date();

// 時給。
jikyuu = 5000;
second = jikyuu / 60 / 60;

function getParam(name, url)
{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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


    if(saveData["jikyu"] && saveData["jikyu"] != "")
    {
        $('#jikyu').val(saveData["jikyu"]);
    }

    // すでに開始している。
    if(saveData["enable"] && saveData["enable"] != "")
    {
        if(saveData["enable"])
        {
startWork(0);
        }
    }


}

function save(_time, _enable, _jikyuu) {
    var saveData = {};
    // saveData["yourname"] = yourname;
    saveData["time"] = _time.getTime();
    saveData["enable"] = _enable;
    saveData["jikyu"] = _jikyuu;
    store.set('user_data', saveData);
}

function initialize() {
    // // 今日のいい感じの日時を入れておく。
    // var nowdate = new Date();
    // // デフォルト今日の日付。
    // var day = dateToStr24HPad0DayOfWeek(nowdate, 'YYYY年MM月DD日(WW)');
    // $('#targetDate').val(day);

    // 前回のデータ読み込み。
    load();
}

function startWork(startTime)
{
        // 開始してたらスルー。
        if(isStarted)
        {
            return;
        }

        let count = 0;
        const countUp = () => {
            count++;

            // 経過時間。
            $('#timeText').text(passTime(startdate));

            // 稼いだお金。
            var money = Math.floor(second * count * 100) / 100;
            $('#moneyText').text(money+"円");
        }

        jikyuu = $('#jikyu').val();

        if(isNaN(jikyuu))
        {
            alert("入力された時給が数値ではありません");
            return;
        }
        else if(jikyuu == "")
        {
            alert("時給を入力してください");
            return;
        }

        second = jikyuu / 60 / 60;

        if(startTime == 0)
        {
        startdate = new Date();
        }
        else
        {

        }
        var day = dateToStr24HPad0DayOfWeek(startdate, 'YYYY年MM月DD日(WW) hh:mm');
        $('#startTimeText').text(day);

        setInterval(countUp, 1000);
        isStarted = true;
}

function stopWork()
{

}

// 経過時間のテキストを返す。
function passTime(startTime)
{
    var diff_time = Date.now() - startTime.getTime();

    var seconds = Math.floor(diff_time / 1000);

    var pass_seconds = seconds % 60;
    var pass_minutes = Math.floor(seconds / 60) % 60;
    var pass_hours = Math.floor(seconds / (60 * 60));

    return ('0' + pass_hours).slice(-2) + ":" + ('0' + pass_minutes).slice(-2) + ":" + ('0' + pass_seconds).slice(-2);
}

$(function() {

    // 開始ボタン。
    $('#start').click(function() {

        startWork(0);

        save(startdate, true, jikyuu);
    });

    $('#stop').click(function() {
        // 開始してなかったらスルー。
        if(!isStarted)
        {
            return;
        }

        stopWork(0);

        save(startdate, false, jikyuu);
    });




});
















