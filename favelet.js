(function(){

	var v = "1.7";

	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initMyBookmarklet();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} 
	else {
		initMyBookmarklet();
	}
	
	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
      
      var element;

      // 1. Click element to select it
      var selectElement = function() {

        var box = new Overlay();

        $("body").mouseover(function(e){
          var el = $(e.target);
          var offset = el.offset();
          box.render(el.outerWidth(), el.outerHeight(), offset.left, offset.top);
        });

        $("body").click(function(ev) {
          ev.preventDefault();
          element = ev.target;

          // turn off selection
          box.kill();
          $("body").unbind("click");

          // highlight selection
          $(ev.target).addClass("highlighted");

          // show overlay to select properties
          if ($("#overlay").length == 0) {
            var propertySelection = $("<style>.outer { display:none; }.outer div { position:absolute; background:rgb(255,0,0); z-index:65000; }.box { width:100px; height:100px; margin:10px; }#overlay { border: 1px solid #000;padding: 10px;position:fixed;background-color: rgba(70, 70, 70, 0.9);width:370px;height:80%;top:20px;right:20px;z-index:1000;box-shadow: inset 1px 1px 15px 0 #333;}#overlay h1, #overlay h2, #overlay p, #overlay li { margin: 0 0 10px;color: #eee; font-size: 14px}#overlay h1 {font-size: 18px}#overlay h2 { font-size: 16px}#overlay ul { margin: 0 0 20px; padding: 0;}#overlay li { margin: 0;list-style-type: none; padding: 0 0 10px; overflow: hidden}#overlay label { width: 175px; float:left; }#overlay input[type=number] { width: 50px}#overlay ul.selectors li, #overlay ul.single-selectors li { padding: 0; text-align: right; font-size: 16px}#overlay ul.single-selectors li{ display: none}.highlighted { outline: 2px solid red !important; background-color: rgba(255, 0, 0, 0.4) !important;}#overlay li.same { display: none}</style><div id='overlay' draggable='true'></div>").appendTo("body");
            
            setupPropertiesOverlay();
          }
        });

        function Overlay(width, height, left, top) {

            this.width = this.height = this.left = this.top = 0;

            // outer parent
            var outer = $("<div class='outer' />").appendTo("body");

            // red lines (boxes)
            var topbox    = $("<div />").css("height", 1).appendTo(outer);
            var bottombox = $("<div />").css("height", 1).appendTo(outer);  
            var leftbox   = $("<div />").css("width",  1).appendTo(outer);
            var rightbox  = $("<div />").css("width",  1).appendTo(outer);

            // don't count it as a real element
            outer.mouseover(function(){ 
                outer.hide(); 
            });    

            this.resize = function resize(width, height, left, top) {
              if (width != null)
                this.width = width;
              if (height != null)
                this.height = height;
              if (left != null)
                this.left = left;
              if (top != null)
                this.top = top;      
            };

            this.show = function show() {
               outer.show();
            };

            this.hide = function hide() {
               outer.hide();
            };

            this.kill = function kill() {
              outer.remove();
            }; 

            this.render = function render(width, height, left, top) {

                this.resize(width, height, left, top);

                topbox.css({
                  top:   this.top,
                  left:  this.left,
                  width: this.width
                });
                bottombox.css({
                  top:   this.top + this.height - 1,
                  left:  this.left,
                  width: this.width
                });
                leftbox.css({
                  top:    this.top, 
                  left:   this.left, 
                  height: this.height
                });
                rightbox.css({
                  top:    this.top, 
                  left:   this.left + this.width - 1, 
                  height: this.height  
                });

                this.show();
            };      
        }
      };

  		// 2. Select CSS property
  		var setupPropertiesOverlay = function() {
  		  $("#overlay")
  		    .append("<h1>CSS3 visualiser and generator</h1>")
  		    .append("<p><select><option value=''>Select CSS property</option><option value='border-radius'>Border radius</option><option value='box-shadow'>Box shadow</option><option value='text-shadow'>Text shadow</option></select></p>")
  		    .append("<div class='wrapper'></div>");

        $("#overlay select").on("change", function() {
          // turn off highlight
          $(element).removeClass("highlighted");
          showValues($("#overlay select option:selected").val());
        });
  		};

  		// 3. Show possible values
      var showValues = function(property) {
        var overlayWrapper = $("#overlay .wrapper");
        $(element).removeAttr("style");
        overlayWrapper.empty();

        switch (property){
          case "border-radius":
            overlayWrapper
              .append("<ul id='"+property+"'><li><input type='checkbox' id='same' /> 4 corners equal?</li><li class='same'><label>Corner size</label><input type='number' value='' id='all' /></li><li class='diff'><label>Top left</label><input type='number' value='' id='top-left' /></li><li class='diff'><label>Top right</label><input type='number' value='' id='top-right' /></li><li class='diff'><label>Bottom right</label><input type='number' value='' id='bottom-right' /></li><li class='diff'><label>Bottom left</label><input type='number' value='' id='bottom-left' /></li></ul>")
              .append("<h2>Cross-browser selectors</h2><ul class='selectors'><li class='diff'>-webkit-border-radius: <span>0 0 0 0</span>;</li><li class='diff'>-moz-border-radius: <span>0 0 0 0</span>;</li><li class='diff'>border-radius: <span>0 0 0 0</span>;</li><li class='same'>-webkit-border-radius: <span>0</span>;</li><li class='same'>-moz-border-radius: <span>0</span>;</li><li class='same'>border-radius: <span>0</span>;</li></ul>")
              .append("<h2 class='diff'>Long-hand or single selectors</h2><ul class='single-selectors diff'><li>-webkit-border-top-left-radius: <span class='tl'>0</span>;</li><li>-webkit-border-top-right-radius: <span class='tr'>0</span>;</li><li>-webkit-border-bottom-right-radius: <span class='br'>0</span>;</li><li>-webkit-border-bottom-left-radius: <span class='bl'>0</span>;</li><li>-moz-border-radius-topleft: <span class='tl'>0</span>;</li><li>-moz-border-radius-topright: <span class='tr'>0</span>;</li><li>-moz-border-radius-bottomright: <span class='br'>0</span>;</li><li>-moz-border-radius-bottomleft: <span class='bl'>0</span>;</li><li>border-top-left-radius: <span class='tl'>0</span>;</li><li>border-top-right-radius: <span class='tr'>0</span>;</li><li>border-bottom-right-radius: <span class='br'>0</span>;</li><li>border-bottom-left-radius: <span class='bl'>0</span>;</li></ul>");
            break;

          case "box-shadow":
            overlayWrapper
              .append("<ul id='"+property+"'><li><label>Horizontal offset</label><input type='number' value='' id='horizontal' /></li><li><label>Vertical offset</label><input type='number' value='' id='vertical' /></li><li><label>Blur radius (optional)</label><input type='number' value='' id='blur' /></li><li><label>Spread radius (optional)</label><input type='number' value='' id='spread' /></li><li><label>Colour</label><input type='text' value='' id='colour' /></li><li><label>&nbsp;</label><input type='checkbox' id='inset' /> Inset?</li></ul>")
              .append("<h2>Cross-browser selectors</h2><ul class='selectors'><li>-webkit-box-shadow: <span>0 0 0 0 #000</span>;</li><li>-moz-box-shadow: <span>0 0 0 0 #000</span>;</li><li>box-shadow: <span>0 0 0 0 #000</span>;</li></ul>");
            break;

          case "text-shadow":
            overlayWrapper
              .append("<ul id='"+property+"'><li><label>X co-ordinate</label><input type='number' value='' id='x' /></li><li><label>Y co-ordinate</label><input type='number' value='' id='y' /></li><li><label>Blur radius (optional)</label><input type='number' value='' id='blur' /></li><li><label>Colour</label><input type='text' value='' id='colour' /></li></ul>")
              .append("<h2>Cross-browser selectors</h2><p class='selectors'>text-shadow: <span>0 0 0 #000</span></p>");
            break;

          default: console.log("unknown property");
        }
      };

  		// 4. Change element based off values
  		// 5. Generate cross-browser code for copying

      $('#overlay input#same').on('change', function() {
        $("#overlay li.same, #overlay .diff").toggle();
        if($("input#same").is(":checked")) {
          $("#overlay .selectors span").text("0");
        }
        else {
          $("#overlay .selectors span").text("0 0 0 0");
        }
      });

      $("#overlay input#inset").on("change", function() {
        $("#overlay li input").trigger("keyup");
      });

  		$("#overlay li input").on("keyup", function() {
  		  var list = $(this).closest("ul"),
  		      property = list.attr("id");

        switch (property){
          case "border-radius":
            var all = list.find("input#all").val(),
                topLeft = list.find("input#top-left").val(),
                topRight = list.find("input#top-right").val(),
                bottomRight = list.find("input#bottom-right").val(),
                bottomLeft = list.find("input#bottom-left").val(),

                value = (topLeft == "") ? "0 " : topLeft + "px ";

            value += (topRight == "") ? "0 " : topRight + "px ",
            value += (bottomRight == "") ? "0 " : bottomRight + "px ",
            value += (bottomLeft == "") ? "0" : bottomLeft + "px";

            $(element).css("border-radius", value);


            if(list.find("input#same").is(":checked")) {
              $("#overlay .selectors span").text(all + "px");
            }
            else {
              $("#overlay .selectors span").text(value);

              $("#overlay .single-selectors li").hide();

              if(topLeft != "")
                $("#overlay .single-selectors .tl").text(topLeft + "px").closest("li").show();
              if(topRight != "")
                $("#overlay .single-selectors .tr").text(topRight + "px").closest("li").show();
              if(bottomRight != "")
                $("#overlay .single-selectors .br").text(bottomRight + "px").closest("li").show();
              if(bottomLeft != "")
                $("#overlay .single-selectors .bl").text(bottomLeft + "px").closest("li").show();
            }

            break;

          case "box-shadow":

            var inset = list.find("input#inset").is(":checked"),
                horizontal = list.find("input#horizontal").val(),
                vertical = list.find("input#vertical").val(),
                blur = list.find("input#blur").val(),
                spread = list.find("input#spread").val(),
                colour = list.find("input#colour").val();

                value = (inset) ? "inset " : "";

            value += (horizontal == "") ? "0 " : horizontal + "px ",
            value += (vertical == "") ? "0 " : vertical + "px ",
            value += (blur == "") ? "0 " : blur + "px ",
            value += (spread == "") ? "0 " : spread + "px ",
            value += (colour == "") ? "#000" : colour;

            $(element).css("box-shadow", value);
            $("#overlay .selectors span").text(value);
            break;

          case "text-shadow":
            var x = list.find("input#x").val(),
                y = list.find("input#y").val(),
                blur = list.find("input#blur").val(),
                colour = list.find("input#colour").val();

                value = (x == "") ? "0 " : x + "px ",
                value += (y == "") ? "0 " : y + "px ",
                value += (blur == "") ? "0 " : blur + "px ",
                value += (colour == "") ? "#000" : colour;

            $(element).css("text-shadow", value);
            $("#overlay .selectors span").text(value);
            break;

          default: console.log("unknown property");
        }

  		});

      selectElement();
			
		})();
	}

})();