class ScratchFetch {
    constructor() {
        console.log("regi")
    }
    
    getInfo() {
        return {
            "id": "Fetch",
            "name": "Fetch",
            "blocks": [
                        {
                        "opcode": "fetchURL",
                        "blockType": "reporter",
                        "text": "fetch data from [url]",
                        "arguments": {
                            "url": {
                                "type": "string",
                                "defaultValue": "https://api.weather.gov/stations/KNYC/observations"
                            },
                        }
                        },
                        {
                        "opcode": "jsonExtract",
                        "blockType": "reporter",
                        "text": "extract [datum] from [data]",
                        "arguments": {
                            "datum": {
                                "type": "string",
                                "defaultValue": "temperature"
                            },
                            "data": {
                                "type": "string",
                                "defaultValue": '{"temperature": 12.3}'
                            },
                        }
                        },
            ],
        };
    }
    
    fetchURL({url}) {
        console.log("fetching")
        return fetch(url).then(response => { console.log("have resp"); return response.text() } )
    }
    
    jsonExtract({datum,data}) {
        var parsed = JSON.parse(data)
        if (datum in parsed) {
            var out = parsed[datum]
            var t = typeof(out)
            if (t == "string" || t == "number")
                return out
            if (t == "boolean")
                return t ? 1 : 0
            return JSON.stringify(out)
        }
        else {
            return ""
        }
    }
}

Scratch.extensions.register(new ScratchFetch());
/*
(function() {
    var extensionInstance = new ScratchFetch(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
*/