window.RoomService = {
    _cache: {
        // eventName: callbacks
    },
    subscribe: function (event, callback) {
        var _c = RoomService._cache[event] = RoomService._cache[event] || [];
        _c.push(callback);
    },
    trigger: function (event, arg) {
        var _c = RoomService._cache[event];
        if(_c){
            _c.forEach(function (callback) {
                callback(arg);
            });
        }
    }
};
