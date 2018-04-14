var myData = {
    "appName": "Ice-cubes-in-lemonade",
    "language": '',
    "userId": "",
    "buddyIds": "",
    "sessionId": "",
    "appData": {
        "eventType": "tool_start",
        "tool_startTime": "",
        "language": "",
        "attempt": [],
        "eventType1": "tool_end",
        "tool_endTime": "",
        "totalScore": "",
        "createdAt": ""
    }
}
var attempt = {
    "eventType": "clue_start",
    "currentClue": "",
    "cluestartTime": "",
    "language": '',
    "NumberofAttempts": 0,
    "FirstAttemptAnswer": "",
    "FirstAttemptValidity": "",
    "SecondAttemptAnswer": "",
    "SecondAttemptValidity": "",
    "eventType1": "clue_end",
    "clue_endTime": "",
    "clueScore": "00",
    "createdAt": ""
}
var icecubes = {
    start: function (lng) {
        localStorage.setItem("data", "");
        //setuserdetail();
        myData.language = lng;
        myData.userId = $.cookie("user_id");
        myData.buddyIds = $.cookie("buddy_ids");
        myData.sessionId = $.cookie("session_ids");
        myData.appData.tool_startTime = timeStamp();
        myData.appData.language = lng;
        icecubes.save();
    },
    addQuestion: function (q) {
        var obj = null;
        for (var i = 0; i <= myData.appData.attempt.length - 1; i++) {
            if (myData.appData.attempt[i].qid == qid) {
                obj = myData.appData.attempt[i];
                break;
            }
        }

        if (obj == null) {
            obj = $.extend(true, {}, attempt);
            obj.qid = qid;
            obj.currentClue = 'Activity ' + qid + '_' + q;
            myData.appData.attempt.push(obj);
        } else {
            obj.qid = qid;
        }
        myData.appData.attempt[qid - 1].cluestartTime = timeStamp();
        icecubes.save();
    },
    addAnswer: function (id, e, a) {
        var obj = null;
        for (var i = 0; i <= myData.appData.attempt.length - 1; i++) {
            if (myData.appData.attempt[i].qid == qid) {
                obj = myData.appData.attempt[i];
                break;
            }
        }
        if (obj != null) {
            obj.qid = qid;
            if (a == 0) {
                if (e) {
                    obj.NumberofAttempts = parseInt(a) + 1;
                    obj.FirstAttemptAnswer = id;
                    obj.FirstAttemptValidity = 'correct';
                    obj.language = lng;
                    obj.clueScore = '0';
                } else {
                    var att = $.extend(true, {}, attempt);
                    obj.NumberofAttempts = parseInt(a) + 1;
                    obj.FirstAttemptAnswer = id;
                    obj.FirstAttemptValidity = 'incorrect';
                    obj.language = lng;
                }
            } else {
                if (e) {
                    obj.NumberofAttempts = parseInt(a) + 1;
                    obj.SecondAttemptAnswer = id;
                    obj.SecondAttemptValidity = 'correct';
                    obj.clueScore = '0';
                    obj.language = lng;
                } else {
                    var att = $.extend(true, {}, attempt);
                    obj.NumberofAttempts = parseInt(a) + 1;
                    obj.SecondAttemptAnswer = id;
                    obj.SecondAttemptValidity = 'incorrect';
                    obj.language = lng;
                }
            }

        }
        icecubes.save();
        icecubes.updateScore();
    },
    save: function () {
        localStorage.setItem("data", JSON.stringify(myData));
        console.log(myData);
    },
    readData: function () {
        myData = $.parseJSON(localStorage.getItem("data"));
    },
    end: function (s) {
        myData.appData.createdAt = timeStamp();
        myData.appData.tool_endTime = timeStamp();
        myData.appData.totalScore = s;
        icecubes.save();
    },
    updateScore: function (s) {
        icecubes.save();
        csrftoken = $.cookie("csrftoken");
        /*$.ajax({
            type: "POST",
            data: {
                "payload": localStorage.getItem("data"),
                'csrfmiddlewaretoken': csrftoken,
            },
            url: "../../saveJson.php",
            datatype: "json",
            success: function (response) {
                window.open('../../data.json', '_blank');
            }
        });*/
        $.ajax({
            type: "POST",
            data: {
                "payload": localStorage.getItem("data"),
                'csrfmiddlewaretoken': csrftoken,
            },
            url: "/tools/logging",
            datatype: "json",
            success: function (data) {
                console.log(data);
            }
        });
    }
}

function timeStamp() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function setuserdetail() {
    //$.cookie("user_id", "1");
    //$.cookie("session_ids", "qe6wydl8mflsw3fol8u92t7e0os1q4z2");
    //$.cookie("buddy_ids", "1988");
}
