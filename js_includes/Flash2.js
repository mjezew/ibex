/* This software is licensed under a BSD license; see the LICENSE file for details. */

(function () {
var soundId2 = 2;

define_ibex_controller({
name: "Flash2",

init: function () {

},

jqueryWidget: {
    _init: function () {
        var self = this;
        self.cssPrefix = self.options._cssPrefix;
        var $loading;
	var failure = false;
	var firsttime = true;
        var doneLoading = false;
		function hideM(m){
			if ($(document).ready){
				$(m).hide();
			}

		}
	var img1 =  dget(this.options, "img1");
	var img2 =  dget(this.options, "img2");
        function showM(p) {
            if ($(document).ready){
              	$(p).show();
            }    
        } 

	function fisherYates(myArray) {
    	    var i = myArray.length;
    	    if (i == 0)
        	return false;
    	    while (--i) {
        	var j = Math.floor(Math.random() * (i + 1));
        	var tempi = myArray[i];
        	var tempj = myArray[j];
        	myArray[i] = tempj;
        	myArray[j] = tempi;
   	    }   
	    return myArray;
	}

        if (typeof(self.options.s2) != "string") {
            if (self.options.s2.audio2) {
                if (self.options.audioMessage2) {
                    self.element.append($loading = $("<div>").addClass(self.cssPrefix + 'loading'));
                    setTimeout(function () {
                        if (! doneLoading && self.options.s2.length >1)
                            $loading.text(conf_loadingMessage);
                    }, 250);
                }
                withSoundManager(completeInit);
            }
            else {
                self.sentenceDom = htmlCodeToDOM(self.options.s2)
                completeInit();
            }
        }
        else {
            self.sentenceDom = $("<div>").text(self.options.s2);
            completeInit();
        }

        this.sentenceDescType = dget(this.options, "sentenceDescType", "literal");
        assert(this.sentenceDescType == "literal", "Bad value for 'sentenceDescType' option of Flash2 controller ('md5' no longer supported).");
        function completeInit(sm2) {
	    var y = document.getElementsByClassName("Message-continue-link");
            hideM(y);
            if (sm2) {
                if (self.options.audioMessage2) {
                    if (typeof(self.options.audioMessage2) != "string") {
                        self.sentenceDom = $(htmlCodeToDOM(self.options.audioMessage2));
                    }
                    else {
                        self.sentenceDom = $("<div>").text(self.options.audioMessage2);
                    }
                }
                var names2 = null;
                if ($.isArray(self.options.s2.audio2)){
                    names2 = self.options.s2.audio2;
		}
                else
                    names2 = [self.options.s2.audio2];
                var urls2 = [ ];
                for (var i = 0; i < names2.length; ++i) {
                    if (names2[i].match(/^(?:https?)|(?:ftps?):\/\//))
                        urls2.push(names2[i]);
                    else
                        urls2.push(__server_py_script_name__ + '?resource=' + escape(names2[i]));
                }
                var sids2 = [ ];
                for (var i = 0; i < names2.length; ++i)
		    soundId2 += 2;
                    sids2.push(soundId2);
                for (var i = 0; i < names2.length; ++i)
                    sm2.createSound('sound' + sids2[i], urls2[i]);

                var nextSoundToPlayIndex = 0;

                function hideSD() { if (self.sentenceDom) self.sentenceDom.hide(); }
                if (self.options.audioTrigger == "click") {
                    self.sentenceDom.css('cursor', 'pointer');
                    self.sentenceDom.click(function () {
                        //hideSD();
			    sm2.stopAll();
			    if (firsttime ==false){ nextSoundToPlayIndex = 0;}
			    firsttime = false;
                            sm2.play('sound' + sids2[nextSoundToPlayIndex++], { onfinish: fin });
                    });
                }
                else if (self.options.audioTrigger == "keypress") {
			$('body').keypress(function (e) {
			    var whichKey = e.which|| e.keyCode;
			    if(whichKey == 32){
                      	  	//hideSD();
                          	sm2.play('sound' + sids2[nextSoundToPlayIndex++], { onfinish: fin }); 
                    	}
		    }); 
        	}	
                else { // Immediate
                    //hideSD();
                    sm2.play('sound' + sids2[nextSoundToPlayIndex++], { onfinish: fin });
                }

                function fin() {
		    var m = document.getElementsByClassName("Question-Question");
                    if (nextSoundToPlayIndex >= names2.length){
			//showM(m);
			nextSoundToPlayIndex-=1;
                        setTimeout(function () { self.finishedCallback([[["Sentence (or sentence MD5)", self.sentenceMD5]]]); }, 200);
                    }
		    else if (failure == true){
			setTimeout(function () { self.finishedCallback([[["Sentence (or sentence MD5)", self.sentenceMD5+"FAILURE"]]]); }, 200); 	
		    }
		    else if (names2[nextSoundToPlayIndex]!="null.wav"){
			console.log(names2);
				setTimeout(function() { 
					sm2.play('sound' + sids2[nextSoundToPlayIndex++], { onfinish: fin });
			}, 750);//750
		   }
		    else {
			 setTimeout(function() { 
                             sm2.play('sound' + sids2[nextSoundToPlayIndex++], { onfinish: fin });
                        }, 50);//750	
		    }
                
            }
	    }

            self.finishedCallback = self.options._finishedCallback;
            self.utils = self.options._utils;

            self.timeout = dget(self.options, "timeout", 100);

            self.sentenceMD5 = csv_url_encode(self.options.s2.html ? self.options.s2.html : (self.options.s2.audio2 ? self.options.s2.audio2+'' : (self.options.s2+'')));

            self.element.addClass(self.cssPrefix + "flashed-sentence");
            if (self.sentenceDom) {
                if ($loading) {
                    doneLoading = true;
                    $loading.replaceWith(self.sentenceDom)
                }
                else
                    self.element.append(self.sentenceDom);
            }
            if (self.timeout) {
                self.utils.setTimeout(function() {
                    self.finishedCallback([[["Sentence (or sentence MD5)", self.sentenceMD5]]]);
                }, self.timeout);
            }
            else if (! self.options.s2.audio2) {
                // Give results without actually finishing.
                if (self.utils.setResults)
                    self.utils.setResults([[["Sentence (or sentence MD5)", self.sentenceMD5]]]);
            }
        }
    }
},

properties: {
    obligatory: ["s2"],
    htmlDescription: function (opts) {
        return $(document.createElement("div")).text(opts.s2)[0];
    }
}
});

})();
