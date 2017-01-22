function checkRegex() {
    let r = document.getElementById("regex").value;
    if (r == "") {
        alert("Please input regex. It may be empty.");
        return;
    }
    try {
        new RegExp(r);
    } catch(err) {
        alert('Raised Regex Syntax Error. Please solve this.');
        return;
    };
    return r;
}
function testRegex() {
    let r = checkRegex();
    if (!r) {
        return;
    }
    let re = new RegExp(r);
    document.querySelectorAll("input.test").forEach(function(e){
        console.log(e.value)
        if (re.test(e.value)) {
            e.nextSibling.innerHTML = "<span style='color: green'>PASS :)</span>";
        } else if (e.value == "") {
            e.nextSibling.innerText = "";
        } else {
            e.nextSibling.innerHTML = "<span style='color: red'>FAIL :(</span>";
        }
    });
}
function saveOptions() {
    let r = checkRegex();
    let t1 = document.getElementById("t1").value;
    let t2 = document.getElementById("t2").value;
    let t3 = document.getElementById("t3").value;
    let t4 = document.getElementById("t4").value;
    let t5 = document.getElementById("t5").value;
    let t6 = document.getElementById("t6").value;
    let t7 = document.getElementById("t7").value;
    let t8 = document.getElementById("t8").value;
    let t9 = document.getElementById("t9").value;
    let t10 = document.getElementById("t10").value;
    chrome.storage.sync.set({
        regex: r,
        t1: t1, t2: t2, t3: t3, t4: t4, t5: t5,
        t6: t6, t7: t7, t8: t8, t9: t9, t10: t10,
    });
}
function restoreOptions() {
    chrome.storage.sync.get({
        regex: "Delete this. And then input text you want to filter by harukaeru",
        t1: "", t2: "", t3: "", t4: "", t5: "",
        t6: "", t7: "", t8: "", t9: "", t10: ""
    }, function(items) {
        document.getElementById("regex").value = items.regex;
        document.getElementById("t1").value = items.t1;
        document.getElementById("t2").value = items.t2;
        document.getElementById("t3").value = items.t3;
        document.getElementById("t4").value = items.t4;
        document.getElementById("t5").value = items.t5;
        document.getElementById("t6").value = items.t6;
        document.getElementById("t7").value = items.t7;
        document.getElementById("t8").value = items.t8;
        document.getElementById("t9").value = items.t9;
        document.getElementById("t10").value = items.t10;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("save").addEventListener('click', saveOptions);
document.getElementById("test").addEventListener('click', testRegex);
