/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
name: "Separator",

jqueryWidget: {
    _init: function () {
        this.cssPrefix = this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback;

        this.ignoreFailure = dget(this.options, "ignoreFailure", false);
        this.style = this.ignoreFailure ? "normal" : (this.utils.getValueFromPreviousElement("failed") ? "error" : "normal");
        var x = this.utils.getValueFromPreviousElement("style");
        if (x) this.style = x;
        assert(this.style == "normal" || this.style == "error", "'style' property of Separator must either be 'normal' or 'error'");

        this.transfer = dget(this.options, "transfer", "keypress");
        assert(this.transfer == "keypress" || this.transfer == "click" || typeof(this.transfer) == "number",
               "Value of 'transfer' option of Separator must either be the string 'keypress' or 'click'  or a number");

	if (this.transfer == "click") {
            this.continueMessage = dget(this.options, "continueMessage", "Click here to continue.");
            this.consentRequired = dget(this.options, "consentRequired", false);
            this.consentMessage = dget(this.options, "consentMessage", "I have read the above and agree to do the experiment.");
            this.consentErrorMessage = dget(this.options, "consentErrorMessage", "You must consent before continuing.");

            var t = this;
            // Get a proper lexical scope for the checkbox element so we can capture it in a closure.
            // ALEX: Looking at this again, I don't see why it's necessary to create a local scope here
            // but I am leaving it in as I may be missing something and it won't do any harm.
            (function (checkbox) {
                t.element.append(
                    $(document.createElement("p"))
                    .css('clear', 'left')
                        .append($(document.createElement("a"))
                            .attr('href', '')
                            .addClass(t.cssPrefix + 'continue-link')
                            .text("\u2192 " + t.continueMessage)
                            .click(function () {
                                if ((! checkbox) || checkbox.attr('checked'))
                                    t.finishedCallback();
                                else
                                    alert(t.consentErrorMessage);
                                return false;
                            }))
                );
            })(checkbox);
        }

        var normal_message = dget(this.options, "normalMessage", "Press any key to continue.");
        var x = this.utils.getValueFromPreviousElement("normalMessage");
        if (x) normal_message = x;

        var error_message = dget(this.options, "errorMessage", "Wrong. Press any key to continue.");
        var x = this.utils.getValueFromPreviousElement("errorMessage");
        if (x) error_message = x;

        var p = $(document.createElement("p"));
        this.element.append(p);
        if (this.style == "error") {
            this.element.addClass(this.cssPrefix + "next-item-failure-message");
            p.text(error_message);
        }
        else {
            this.element.addClass(this.cssPrefix + "next-item-message");
            p.text(normal_message);
        }

        if (this.transfer == "keypress") {
	    var t = this;
	    this.safeBind($(document), 'keydown', function () {
		t.finishedCallback(null);
		return false;
	    });
        }
        else {
            var t = this;
            this.utils.setTimeout(function () {
                t.finishedCallback(null);
            }, this.transfer);
        }
    }
},

properties: {
    countsForProgressBar: false,
    htmlDescription: function (opts) {
        return $(document.createElement("div")).text(opts.normalMessage)[0];
    }
}
});
