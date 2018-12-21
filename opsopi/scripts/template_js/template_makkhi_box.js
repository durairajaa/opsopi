var attachDomJS = function (container_dom) {
	function dummy(obj) {
		// alert($(obj).find(".pnmprkbtmf").text() + " clicked");
	}

	$(container_dom).on("click", "div.hvimproxhuawg", function(event) {
		dummy(this);
		// event.stopPropagation();
		// event.preventDefault();
	});
}