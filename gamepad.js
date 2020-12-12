class ScratchGamepad {
    constructor(runtime) {
        this.id = null
        this.runtime = runtime
        this.currentMSecs = -1
        this.previousButtons = []
        this.currentButtons = []
        this.previousAxes = []
        this.currentAxes = []
    }
    
    getInfo() {
        return {
            "id": "Gamepad",
            "name": "Gamepad",
            "blocks": [{
                        "opcode": "buttonPressedReleased",
                        "blockType": "hat",
                        "text": "button [b] [pr]",
                        "arguments": {
                            "b": {
                                "type": "number",
                                "defaultValue": "0"
                            },
                            "pr": {
                                "type": "number",
                                "defaultValue": "1",
                                "menu": "pressReleaseMenu"
                            },
                        },
                    },
                    {
                        "opcode": "buttonDown",
                        "blockType": "Boolean",
                        "text": "button [b] is down",
                        "arguments": {
                            "b": {
                                "type": "number",
                                "defaultValue": "0"
                            },
                        },                    
                    },
                    {
                        "opcode": "axisMoved",
                        "blockType": "hat",
                        "text": "axis [b] moved",
                        "arguments": {
                            "b": {
                                "type": "number",
                                "defaultValue": "0"
                            },
                        },
                    },
                    {
                        "opcode": "axisValue",
                        "blockType": "reporter",
                        "text": "position of axis [b]",
                        "arguments": {
                            "b": {
                                "type": "number",
                                "defaultValue": "0"
                            },
                        },                    
                    }
            ],
            "menus": {
                "pressReleaseMenu": [{text:"press",value:1}, {text:"release",value:0}],
            }            
        };
    }
    
    update() {
        if (this.runtime.currentMSecs == this.currentMSecs)
            return
        this.currentMSecs = this.runtime.currentMSecs
        var gamepads = navigator.getGamepads()
        if (gamepads == null || gamepads.length == 0 || gamepads[0] == null) {
            this.previousButtons = []
            this.currentButtons = []
            this.axes = []
            return
        }
        var gamepad = gamepads[0]
        if (gamepad.id != this.id) {
            this.id = gamepad.id
            this.previousButtons = []
            for (var i = 0; i < gamepad.buttons.length; i++) 
                this.previousButtons.push(false)
            this.previousAxes = []
            for (var i = 0; i < gamepad.axes.length; i++) 
                this.previousAxes.push(0)
        }
        this.previousButtons = this.currentButtons
        this.currentButtons = []
        for (var i = 0; i < gamepad.buttons.length; i++) 
            this.currentButtons.push(gamepad.buttons[i].pressed)
        this.previousAxes = this.currentAxes
        this.currentAxes = []
        for (var i = 0; i < gamepad.axes.length; i++)
            this.currentAxes.push(gamepad.axes[i])
    }
    
    buttonPressedReleased({b,pr}) {
        this.update()
        if (b < this.currentButtons.length) {
            if (pr == 1) {
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

    axisMoved({b}) {
        this.update()
        if (b < this.currentAxes.length) {
            return this.currentAxes[b] != this.previousAxes[b]
        }
        return false
    }
    
    axisValue({b}) {
        this.update()
        if (b < this.currentAxes.length)
            return this.currentAxes[b]
        else
            return 0
    }
    
    buttonDown({b}) {
        this.update()
        if (b < this.currentButtons.length)
            return this.currentButtons[b]
        else
            return 0
    }
}

(function() {
    var extensionInstance = new ScratchGamepad(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
