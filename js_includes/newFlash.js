define_ibex_controller({
    name: "newFlash",

    jqueryWidget: {
        _init: function () {
            this.options.transfer = null; // Remove 'click to continue message'.
            this.element.VBox({
                options: this.options,
                triggers: [1],
                children: [
                    "FlashSentence", this.options,
                    "newCont", this.options,
                ]
            });
        }
    },

    properties: { }
});
