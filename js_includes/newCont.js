define_ibex_controller({
name: "newCont",

jqueryWidget: {
    _init: function() {
        // Boilerplate code that appears in all controllers.
        this.cssPrefix = this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback;

        this.moreHTML = this.options.moreHTML;
        this.element.addClass(this.cssPrefix + "message");
	this.element.css('text-align', 'center !important');
        this.element.append(htmlCodeToDOM(this.moreHTML));

    }
},

properties: {
    obligatory: ["moreHTML"],
    countsForProgressBar: false,
    htmlDescription: function (opts) {
        var d = htmlCodeToDOM(opts.moreHTML);
        return truncateHTML(d, 100);
    }
}
});
