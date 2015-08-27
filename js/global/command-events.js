var eventCmd;
var extensionNamespace = "RIR";

(function(undefined){
    
    var whiteList = [
        'getUsername',
        'rir.view.update'
    ];
    
    function argsToArr(args){
        var arr = [];
        for(var i = 0; i < args.length; i++) {
            arr.push(args[i]);
        }
        return arr;
    }
    
    function randomKey(len){
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
        if(len === undefined) len = 10;
        var output = "";
        for(var i = 0; i < len; i++) {
            output += chars[Math.floor(Math.random() * chars.length)];
        }
        return output;
    }
    
    eventCmd = function(target, path, params, callback, persistCallback){
        if(persistCallback === undefined) persistCallback = false;
        if(!params) params = [];
        var eventData = {
            path: path,
            params: params
        };
        if(typeof callback === "function"){
            var cmdKey = randomKey(10);
            eventData.cmdKey = cmdKey;
            responseCallbacks[cmdKey] = {
                func: callback,
                persist: persistCallback
            };
        }
        
        var event = new CustomEvent(target + 'EventCmd', { detail: eventData });
        window.dispatchEvent(event);
    };
    
    function whitelistCheck(path){
        if(!(path instanceof Array)) return false;
        var pathStr = path.join('.');
        return (whiteList.indexOf(pathStr) > 0);
    }
    
    function parsePath(path){
        var func = window;
        var context;
        
        var pathCopy = path.slice();
        while(pathCopy.length > 0) {
            var target = pathCopy.shift();
            if(func[target] === undefined) {
                return response(extensionNamespace + ": The command could not be found");
            }
            context = func;
            func = func[target];
        }
        return {f: func, c: context};
    }
    
    var responseCallbacks = {};
    
    window.addEventListener(extensionNamespace + 'EventCmd', function(e){
        function response(){
            if(!e.detail.cmdKey) return;
            var args = argsToArr(arguments);
            var returnData = {
                args: args,
                cmdKey: e.detail.cmdKey
            };
            var responseEvent = new CustomEvent('EventResponse', { detail: returnData});
            window.dispatchEvent(responseEvent);
        }
        
        if(!whitelistCheck(e.detail.path)) {
            return false;
        }
        
        var func = parsePath(e.detail.path);
        if(!func || typeof func.f !== 'function'){
            return response(extensionNamespace + ": The requested command is not a function");
        }
        
        var returnValue = func.f.apply(func.c, e.detail.params);
        if(!returnValue) return;
        if(!e.detail.cmdKey) return;
        
        if(returnValue instanceof Promise) {
            returnValue.then(response);
        }
        else {
            response(returnValue);
        }
    });
    
    window.addEventListener('EventResponse', function(e){
        var responseCallback = responseCallbacks[e.detail.cmdKey];
        if(responseCallback === undefined) return;
        
        responseCallback.func.apply(undefined, e.detail.args);
    });
    
})();