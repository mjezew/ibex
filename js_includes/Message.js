/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
name: "Message",

jqueryWidget: {
    _init: function () {
        this.cssPrefix = this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback;

        this.html = this.options.html;
        this.element.addClass(this.cssPrefix + "message");
        this.element.append(htmlCodeToDOM(this.html));
	

    }
},

properties: {
    obligatory: ["html"],
    countsForProgressBar: false,
    htmlDescription: function (opts) {
        return truncateHTML(htmlCodeToDOM(opts.html), 100);
    }
}
});
