/* Made (with love) by Lex Whalen */


var GLOB_BG = chrome.extension.getBackgroundPage();


var GLOB_SET_BTN = document.getElementById('btn__set-all-timers');
var GLOB_KILL_BTN = document.getElementById('btn__reset-all-timers');
var GLOB_PAUSE_BTN = document.getElementById("btn__pause");

GLOB_SET_BTN.addEventListener('click',()=>{
    // reset timers
    resetAll();
    // get the round count
    var round_count = parseInt(document.getElementById('round_count').value,10)

    // get the durations of each timer
    var timer01_dur = parseInt(minToSec(document.getElementById('timer01_min').value),10) +
                            parseInt(document.getElementById('timer01_sec').value,10);

    var timer02_dur = parseInt(minToSec(document.getElementById('timer02_min').value),10) +
                            parseInt(document.getElementById('timer02_sec').value,10);
    

    // if nothing set, show error
    if( (isNaN(timer01_dur) || timer01_dur == 0) && (isNaN(timer02_dur) || timer02_dur == 0)){
        alert("Please set a non-zero time for both timers.");
    }
    else if(isNaN(timer01_dur) || timer01_dur == 0){
        alert("Please set a time for timer 1.");
    }
    else if(isNaN(timer02_dur) || timer02_dur == 0){
        alert("Please set a time for timer 2.");
    }

    else{
        resetAll();

        GLOB_BG.timer01.setStartTime(timer01_dur);
        GLOB_BG.timer02.setStartTime(timer02_dur);

        GLOB_BG.GLOB_ROUND_COUNTER.setRounds(round_count);
        GLOB_BG.GLOB_ROUND_COUNTER.setIntervalCheck();

        GLOB_BG.timer01.startTimer();
    }
})

GLOB_KILL_BTN.addEventListener('click',()=>{
    resetAll();
});


GLOB_PAUSE_BTN.addEventListener('click',()=>{
    // check the current timer
    if(GLOB_BG.timer01.IS_CURRENT_TIMER){
        GLOB_BG.timer01.pauseUnpause();

        if(GLOB_BG.timer01.IS_PAUSED){
            GLOB_PAUSE_BTN.innerText = "Unpause";
        }else{
            GLOB_PAUSE_BTN.innerText = "Pause";
        }
    }
    else if(GLOB_BG.timer02.IS_CURRENT_TIMER){
        GLOB_BG.timer02.pauseUnpause();

        if(GLOB_BG.timer02.IS_PAUSED){
            GLOB_PAUSE_BTN.innerText = "Unpause";
        }else{
            GLOB_PAUSE_BTN.innerText = "Pause";
        }
    }
});

function checkIfPaused(){
    // check if any timer paused, if so change the html text
    // this is for reloads of popup page
    if(GLOB_BG.timer01.IS_PAUSED || GLOB_BG.timer02.IS_PAUSED){
        GLOB_PAUSE_BTN.innerText = "Unpause";
    }
}



function minToSec(aMin){
    return 60 * aMin;
}


function getFormData(form_id){
    return document.getElementById(form_id);
}

function resetAll(){
    document.getElementById('timer-01__time').innerText = "00:00";
    document.getElementById('timer-02__time').innerText = "00:00";

    GLOB_BG.resetAll();
}

function IntervalUpdate(){
    // the required tasks on each update

    // update the html display
    document.getElementById('timer-01__time').innerText = GLOB_BG.timer01.getDisplayTime()
    document.getElementById('timer-02__time').innerText = GLOB_BG.timer02.getDisplayTime()
    document.getElementById('rounds__count').innerText = GLOB_BG.GLOB_ROUND_COUNTER.getCurrentRound() + "/" + GLOB_BG.GLOB_ROUND_COUNTER.getRounds();
}
function onlyButtonInput(inputField){
    // this makes it so you can only change the numbers via buttons on side, no keyboard
    inputField.addEventListener("keydown",e=>e.preventDefault());
    inputField.addEventListener("keydown",e=>e.keyCode !=38 && e.keyCode != 40 && e.preventDefault());
}

function getCurVal(inputField){
    return parseInt(inputField.value,10);
}

function plus5(inputField){
    var cur_val = getCurVal(inputField);
    if(cur_val + 5 <= 99){
        // can add 5
        inputField.value = "";
        inputField.value = cur_val + 5;
    }
}
function sub5(inputField){
    var cur_val = getCurVal(inputField);
    if(cur_val -5 >=0){
        // can sub 5
        inputField.value = "";
        inputField.value = cur_val -5;
    }
}
function plus10(inputField){
    var cur_val = getCurVal(inputField);
    if(cur_val +10 <= 99){
        // can add 10
        inputField.value = "";
        inputField.value = cur_val +10;
    }
}
function mapButton(btn_id,func,value_id){
    document.getElementById(btn_id).addEventListener("click",()=>{
        func(value_id)
    })
}
function sub10(inputField){
    var cur_val = getCurVal(inputField);
    if(cur_val -10 >=0){
        // can sub 5
        inputField.value = "";
        inputField.value = cur_val -10;
    }
}

var timer01_min = document.getElementById("timer01_min")
var timer01_sec = document.getElementById("timer01_sec")
var timer02_min = document.getElementById("timer02_min")
var timer02_sec = document.getElementById("timer02_sec")
var round_count = document.getElementById("round_count")

// for mapping buttons

// timer01 min
mapButton("timer01__min_plus5",plus5,timer01_min);
mapButton("timer01__min_sub5",sub5,timer01_min);
mapButton("timer01__min_plus10",plus10,timer01_min);
mapButton("timer01__min_sub10",sub10,timer01_min);
// timer01 sec
mapButton("timer01__sec_plus5",plus5,timer01_sec);
mapButton("timer01__sec_sub5",sub5,timer01_sec);
mapButton("timer01__sec_plus10",plus10,timer01_sec);
mapButton("timer01__sec_sub10",sub10,timer01_sec);
// timer02 min
mapButton("timer02__min_plus5",plus5,timer02_min);
mapButton("timer02__min_sub5",sub5,timer02_min);
mapButton("timer02__min_plus10",plus10,timer02_min);
mapButton("timer02__min_sub10",sub10,timer02_min);
// timer02 sec
mapButton("timer02__sec_plus5",plus5,timer02_sec);
mapButton("timer02__sec_sub5",sub5,timer02_sec);
mapButton("timer02__sec_plus10",plus10,timer02_sec);
mapButton("timer02__sec_sub10",sub10,timer02_sec);
// rounds
mapButton("rounds_plus5",plus5,round_count);
mapButton("rounds_sub5",sub5,round_count);
mapButton("rounds_plus10",plus10,round_count);
mapButton("rounds_sub10",sub10,round_count);

// for checking correct inputs
var inputArr = [timer01_min,timer01_sec,timer02_min,timer02_sec,round_count];
inputArr.forEach(i=>onlyButtonInput(i));

// change text "pause" / "unpause" if pause or not
checkIfPaused();

setInterval(()=>{
    IntervalUpdate();
},20);






