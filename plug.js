var Plug = window.Plug || {};
Plug.data = {};
/**
 * Returns a value from an object by evaluating a string.
 * @param {object} object - the object to be accessed
 * @param {string} map - The string to evaulte. Example: "json.profile.name"
 */
Plug.getVal = function getVal(obj, map) {
    var path = map.split(".");
    if (path.length === 1) {
        return obj[path[0]];
    }  
    return window.Plug.getVal(obj[path[0]], path.slice(1).join("."));
}

/**
 * Downloads a file and returns a promise.
 * @param {string} path - The path to the file.
 */
Plug.download = function download(path) {
    return new Promise(function (resolve, reject) {
        $.get(path, function (data) {
            resolve(data);
        }).fail(function () {
            reject("error downloading file");
        });
    });
    
}

/**
 * Downloads and registers a file with Plug for access in HTML. Returns a promise.
 * @param {string} path - the path to the file to download
 * @param {string} name - the name for the variable to store the file's contents in.
 */
Plug.load = function load(path, name) {
    var Plug = window.Plug;
    return new Promise(function (resolve, reject) {
        if (name.split(" ").length !== 1) {
            reject("name must not contain spaces");
        } else {
            Plug.download(path).then(function (data) {
                Plug.data[name] = data;
                resolve();
            });
        }
    });
}

/**
 * Loads all the files given and return a promise.
 * @param {array} list - list containing arrays in the format [path,name]
 */

Plug.loadAll = function loadAll(list) {
    var promises = [];
    var Plug = window.Plug;
    for (var i = 0; i < list.length; i ++) {
        promises.push(Plug.load(list[i][0], list[i][1]));
    }
    return new Promise(function (resolve, reject) {
        Promise.all(promises).then(function () {
                console.log("Loaded.");
                resolve();
            }, function (err) {
                reject(err);
            });
    });
}

/**
 * Scans the entire DOM for elements with attr and passes the element and the contents of the attr to a callback.
 * @param {string} attr - The attribute name
 */
Plug.scan = function scan(attr, callback) {
    var elements = $("[" + attr + "]");
    for (var i = 0; i < elements.length; i++) {
        callback(elements[i], elements[i].getAttribute(attr));
    }
}

/**
 * Should be called to activate Plug on the page. Scans the page and loads configuration into the DOM. Returns a Promise
 */
Plug.go = function go() {
    var Plug = window.Plug;
    return new Promise(function (resolve, reject) {
        Plug.loadAll(Plug.files).then(function () {
            console.log("Scanning");
            Plug.scan("plug", function (el, data) {
                var root = data.split(".").splice(0,1)[0];
                el.textContent = Plug.getVal(Plug.data[root], data.substring(data.indexOf(".") + 1));
            });
            resolve();
        }, function onError() {
            console.error("All files were not loaded successfully.");
            reject();
        })
    });
}

/**
 * Adds a file to be registered, which downloads and namespaces it in Plug.
 * @param {string} path - The path to the file
 * @param {string} name - The name of the namespace to put this file in.
 */
Plug.use = function use(path, name) {
    var Plug = window.Plug;
    if (Plug.files === undefined) {
        Plug.files = [];
    }
    Plug.files.push([path, name]);
}