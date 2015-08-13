function getUsername(){
    return $('#header span.user > a').text();
}
function isLoggedIn(){
    return (getUsername() !== "sign in or create an account");
}

function log(level) {
    if(!(logLevel & level)) return;

    var args = [];
    for(var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    if(level === ERROR) {
        console.error.apply(console, args);
    }
    else {
        console.log.apply(console, args);
    }
}

function htmlDecode(str){
    var ele = document.createElement('span');
    ele.innerHTML = str;
    return ele.innerText;
}

function ObjectValues(obj){
    var arr = [];
    var keys = Object.keys(obj);
    for(var i = 0; i < keys.length; i++) {
        arr.push(obj[keys[i]]);
    }
    return arr;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    string = "" + string;
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function CSVEscapeValue(str){
    //str = replaceAll(str, '\\', '\\\\');
    //str = replaceAll(str, '"', '\\"');
    //return replaceAll(JSON.stringify("" + str), ';', '\;');
    return '"' + replaceAll(str, '"', '""') + '"';
}

function array2DtoCSV(arr){
    var csvSeparator = ';';
    var output = '';
    for(var i = 0; i < arr.length; i++) {
        var row = arr[i];
        for(var j = 0; j < row.length; j++) {
            output += CSVEscapeValue(row[j]) + csvSeparator;
        }
        output += "\r\n";
    }
    return output;
}

function parseQueryString(str){
    if(!str) return {};
    str = str.substring(1);
    
    var obj = {};
    while(str.length > 0) {
        var i = str.indexOf('&');
        var chunk;
        
        if(i >= 0) {
            chunk = str.substring(0, i);
            str = str.substring(i + 1);
        }
        else {
            chunk = str;
            str = "";
        }
        
        var j = chunk.indexOf('=');
        if(j < 0) obj[chunk] = null;
        else {
            var k = chunk.substring(0, j);
            var v = chunk.substring(j + 1);
            obj[k] = v;
        }
        
    }
    return obj;
}

function parseSearchQuery(str){
    str = decodeURIComponent(str);
    var obj = { from: null, subject: null, message: null };
    if(str.length > 5 && str.substring(0, 5) === "from:") {
        obj.from = str.substring(5);
        return obj;
    }
    if(str.length > 8 && str.substring(0, 8) === "subject:") {
        obj.subject = str.substring(8).split(' ');
        return obj;
    }
    if(str.length > 8 && str.substring(0, 8) === "message:") {
        obj.message = str.substring(8).split(' ');
        return obj;
    }
    obj.from = str;
    obj.subject = str.split(' ');
    obj.message = str.split(' ');
    return obj;
}

function getTime(){
    return new Date().getTime();
}

function sysDateStr(date){
    if(typeof d === "undefined") {
        date = new Date();
    }
    var str = date.getFullYear() + '-';
    
    var m = date.getMonth() + 1;
    if(m < 10) m = "0" + m;
    str += m + '-';
    
    var d = date.getDate();
    if(d < 10) d = "0" + d;
    str += d;
    
    return str;
}

function sysTimeStr(date, sep){
    if(typeof sep !== "string") sep = '.';
    
    if(typeof d === "undefined") {
        date = new Date();
    }
    var h = date.getHours();
    if(h < 10) h = "0" + h;
    
    var m = date.getMinutes();
    if(m < 10) m = "0" + m;
    
    var s = date.getSeconds();
    if(s < 10) s = "0" + s;
    
    return h + sep + m + sep + s;
}

function dateString(datetime) {
    var d = new Date(datetime * 1000);
    var dY = d.getFullYear();
    var dD = d.getDate();
    var dM = d.getMonth();

    var c = new Date();
    var cY = c.getFullYear();
    var cD = c.getDate();
    var cM = c.getMonth();

    if(dY !== cY) return dD + ' ' + MONTHS[dM] + ', ' + dY;
    if(dD !== cD || dM !== cM) return dD + ' ' + MONTHS[dM];

    var hour = d.getHours() % 12;
    if (hour === 0) hour = 12;
    var minutes = d.getMinutes();
    if(minutes < 10) minutes = "0" + minutes;
    return hour + ':' + minutes + ' ' + ((d.getHours() >= 12) ? 'pm' : 'am');
}

function longDateString(datetime){
    return dateString(datetime);
}

function array_shuffle(input){
    var output = [];
    var copy = input.slice();
    while(copy.length > 0) {
        var r = Math.floor(Math.random() * copy.length);
        var item = copy.splice(r, 1)[0];
        output.push(item);
    }
    return output;
}

function dummyFunc(){}

function logFunc(){
    var paramsArr = [];
    for(var i = 0; i < arguments.length; i++) {
        paramsArr.push(arguments[i]);
    }
    console.log.apply(console, paramsArr);
}

function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if(!el || !el.parentNode) {
        return false;
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}