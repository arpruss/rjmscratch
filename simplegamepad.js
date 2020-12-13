class ScratchSimpleGamepad {
    constructor(runtime) {
        this.runtime = runtime
        this.currentMSecs = -1
        this.previousButtons = []
        this.currentButtons = []
    }
    
    getInfo() {
        return {
            "id": "SimpleGamepad",
            "name": "SimpleGamepad",
            "blocks": [{
                        "opcode": "buttonPressedReleased",
                        "blockType": "hat",
                        "text": "button [b] [eventType]",
                        "arguments": {
                            "b": {
                                "type": "number",
                                "defaultValue": "0"
                            },
                            "eventType": {
                                "type": "number",
                                "defaultValue": "1",
                                "menu": "pressReleaseMenu"
                            },
                        },
                    },
            ],
            "menus": {
                "pressReleaseMenu": [{text:"press",value:1}, {text:"release",value:0}],
            }            
        };
    }
    
    update() {
        if (this.runtime.currentMSecs == this.currentMSecs) 
            return // not a new polling cycle
        this.currentMSecs = this.runtime.currentMSecs
        var gamepads = navigator.getGamepads()
        if (gamepads == null || gamepads.length == 0 || gamepads[0] == null) {
            // different number of buttons, so new gamepad
            this.previousButtons = []
            this.currentButtons = []
            return
        }
        var gamepad = gamepads[0]
        if (gamepad.buttons.length != this.previousButtons.length) {
            this.previousButtons = []
            for (var i = 0; i < gamepad.buttons.length; i++) 
                this.previousButtons.push(false)
        }
        else {
            this.previousButtons = this.currentButtons
        }
        this.currentButtons = []
        for (var i = 0; i < gamepad.buttons.length; i++) 
            this.currentButtons.push(gamepad.buttons[i].pressed)
    }
    
    buttonPressedReleased({b,eventType}) {
        this.update()
        if (b < this.currentButtons.length) {
            if (eventType == 1) { // note: this will be a string, so better to compare it to 1 than to treat it as a Boolean
                if (this.currentButtons[b] && ! this.previousButtons[b]) {
                    return true
                }
            }
            else {
                if (!this.currentButtons[b] && this.previousButtons[b]) {
                    return true
                }
             }
        }
        return false
    }
}

(function() {
    var extensionInstance = new ScratchSimpleGamepad(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
