// Make the stupid Chrome ports act like Firefox ones
var PortWrapper = function (port, name) {
    
    var sub = {};
    var disconnected = false;
    
    port.onMessage.addListener(function (data) {
       
        if( !sub[data.type] ) return;
       
        var i, length = sub[data.type].length;
        for( i=0; i < length; i++ ) {
            sub[data.type][i](data.payload);
        }
        
    });

    port.onDisconnect.addListener(function () {
        disconnected = true;
    });
    
    return {
        on: function (type, cb) {
            if( !sub[type] ) sub[type] = [];
            sub[type].push(cb);
        },
        emit: function(type, payload) {
            if( disconnected ) return;
            port.postMessage({
                type: type,
                payload: payload
            });
        },
        sub: function () { return sub; },
        destroy: function () {
            sub = {};
            port = null;
        },
        name: port.name,
        raw: port
    };
    
};

if(!xt) var xt = {};
xt = {
    port: {
        on: function () {console.log("port.on called before initialised.", arguments)},
        emit: function () {console.log("port.emit called before initialised.", arguments)}
    }
};