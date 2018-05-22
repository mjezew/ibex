/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
name: "AcceptabilityJudgment",

jqueryWidget: {
    _init: function () {
        var opts = {
            options:     this.options,
            triggers:    [0],
            children:    [//"newFlash", this.options,
 			  "newFlash", this.options,
			  "Question", this.options]
        };

        this.element.VBox(opts);
    }
},

properties: {
    obligatory: ["s", "as"],
    htmlDescription:
        function (opts) {
            var s = ibex_controller_get_property("newFlash", "htmlDescription")(opts);
            var q = ibex_controller_get_property("Question", "htmlDescription")(opts);
//	    var m = ibex_controller_get_property("newCont", "htmlDescription");
            var p =
                $("<p>")
                .append($("<p>").append("Q: ").append($(q)))
                .append("<br>").append($("<b>").text("S:"))
//		.append($(m))
                .append($(s));
             return p;
        }
}
});
