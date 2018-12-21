
var search_string_placeholder = "~ditto_search_string~";

$(document).on("click","#validate_button",function(e){
	var deets = read_form_data()
	validate_form_data(deets)
});


function read_form_data(){

	var url = $("input.url").val();
	var response_type = $("input[name='response_type']:checked").val();
	var request_type = $("input[name='request_type']:checked").val();
	var request_body = $("textarea[name = 'request_body']").val();
	var request_header = $("textarea[name = 'request_header']").val();
	var div_selector = $("input.title_selector").val();
	var title_selector = $("input.title_selector").val();
	var title_attr = $(".title_attr").val();
	var price_selector = $("input.price_selector").val();
	var price_attr = $(".price_attr").val();
	var link_selector = $("input.link_selector").val();
	var link_attr = $(".link_attr").val();
	var image_selector = $("input.image_selector").val();
	var image_attr = $(".image_attr").val();
	var test_search_str = $(".test_string").val();
	var deets =
	{
		url,
		response_type,
		request_type,
		request_body,
		request_header,
		div_selector,	
		title_selector,
		title_attr,
		price_selector,
		price_attr,
		link_selector,
		link_attr,
		image_selector,
		image_attr,
		test_search_str
	};

	return deets;

}




function validate_form_data(deets){
	if(!deets.url){
		$.toast({
			"text":"enter url",
			"position":"mid-center"
		});
		return;
	}

	if(!is_valid_response_type(deets.response_type)){
		$.toast({
			"text":"Choose a response type",
			"position":"mid-center"
		});
		return;
	}

	if(!is_valid_request_type(deets.request_type)){
		$.toast({
			"text":"Choose a request type",
			"position":"mid-center"
		});
		return;
	}

	if(deets.request_type == "POST" && ! deets.request_body){
		$.toast({
			"text":"Give a Json request body for post request",
			"position":"mid-center"
		});
		return;
	}else if(deets.response_type == "POST"){
		if(!isJson(deets.request_body)){
			$.toast({
				"text":"Give request body in Json format",
				"position":"mid-center"
			});
			return;
		}
	}

	if(deets.request_headers &&  !isJson(deets.request_headers)){
		$.toast({
			"text":"Give request headers in Json format",
			"position":"mid-center"
		});
		return;
	}	

	if(!deets.title_selector){
		$.toast({
			"text":"please give a title selector",
			"position":"mid-center"
		});
		return;
	}

	if(!deets.price_selector){
		$.toast({
			"text":"please give a price selector",
			"position":"mid-center"
		});
		return;
	}

	if(!deets.link_selector){
		$.toast({
			"text":"please give a link selector",
			"position":"mid-center"
		});
		return;
	}
	
	if(!deets.image_selector){
		$.toast({
			"text":"please give a image selector",
			"position":"mid-center"
		});
		return;
	}

	if(!deets.url.match(search_string_placeholder)){

		if(deets.request_type == "POST"){
			if(!deets.request_body.match(search_string_placeholder).length>0){
				$.toast({
					"text":"could not find search string placeholder, give it in the url or request body",
					"position":"mid-center"
				});
				return;
			}
		}else{
			$.toast({
				"text":"could not find search string placeholder, give it in the url or request body",
				"position":"mid-center"
			});
			return;
		}

	}

	if(deets.response_type == "HTML"){
		if(!deets.title_attr){
			$.toast({
				"text":"please enter attr to read in the title element, give text if you want to read text",
				"position":"mid-center"
			});
			return;
		}

		if(!deets.price_attr){
			$.toast({
				"text":"please enter attr to read in the price element, give text if you want to read text",
				"position":"mid-center"
			});
			return;
		}

		if(!deets.link_attr){
			$.toast({
				"text":"please enter attr to read in the link element, give text if you want to read text",
				"position":"mid-center"
			});
			return;
		}

		if(!deets.image_attr){
			$.toast({
				"text":"please enter attr to read in the image element, give text if you want to read text",
				"position":"mid-center"
			});
			return;
		}

	}

	console.log("all is well");
	return true;
}


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function is_valid_request_type(request_type){
	if(request_type === "GET" || request_type==="POST"){
		return true;
	}else{
		return false;
	}
}

function is_valid_response_type(response_type){
	if(response_type === "HTML" || response_type==="JSON"){
		return true;
	}else{
		return false;
	}
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}



$(document).on("click","#test_config",function(e){
	test_configuration();
});

function test_configuration(){
	var config = read_form_data();
	if(validate_form_data(config)){
		test_fetch_results_from_configuration(config);
	}
}


function test_fetch_results_from_configuration(config){

	var  request = make_request_from_config(config);
	console.log(request);
	var fetch_req = backPostGet(request);
	fetch_req.done(function(response){
		var results = "";
		if(config.response_type == "HTML"){
			console.log("calling parsehtml");
			var result = parse_from_html_and_get_results(config,response);
			console.log(result);
		}else if(config.response_type == "JSON") {
			parse_from_json_and_get_results(config,response);
		}
	});

	fetch_req.fail(function(a,b,c){
		console.log("request failed");
		console.log(a,b,c);
	})

}

function parse_from_html_and_get_results(config,response){
	// check for results div if not found err
	var resp_elem = $('<div/>').append($.parseHTML(response));
	if($(resp_elem).find(config.div_selector).length>0){
		// element found
	}else{
		// err out
		console.log("could nor find element");
	}
	var deets = {}

	if(config.title_attr ===  "text"){
		deets['title'] = $(resp_elem).find(config.title_selector).text();
	}else{
		deets['title'] = $(resp_elem).find(config.title_selector).attr(config.title_attr);
	}

	if(deets["title"]){
		deets["title"] = $.trim(deets["title"]);
	}

	if(config.price_attr ===  "text"){
		deets['price'] = $(resp_elem).find(config.price_selector).text();
	}else{
		deets['price'] = $(resp_elem).find(config.price_selector).attr(config.price_attr);
	}
	if(deets["price"]){
		deets["price"] = $.trim(deets["price"]);
	}


	
	if(config.link_attr ===  "text"){
		deets['link'] = $(resp_elem).find(config.link_selector).text();
	}else{
		deets['link'] = $(resp_elem).find(config.link_selector).attr(config.link_attr);
	}

	if(config.image_attr ===  "text"){
		deets['image'] = $(resp_elem).find(config.image_selector).text();
	}else{
		deets['image'] = $(resp_elem).find(config.image_selector).attr(config.image_attr);
	}

	var data_to_send_back = {};

	if(deets.title && deets.price && deets.link && deets.image){
		data_to_send_back['all_data_found'] = true;
	}else{
		data_to_send_back['all_data_found'] = false;	
	}

	data_to_send_back['state'] = 'read_data'
	data_to_send_back['deets'] = deets;

	return data_to_send_back;



}

function parse_from_json_and_get_results(config,response){
	// check for results
	console.log("not implemented yet");
}

function make_request_from_config(config){
	// ask for content type for request if any add in the request
	var url = "";
	if(config.request_type == "GET"){
		url = config.url.replace("~ditto_search_string~",config.test_search_str);
		var req_body = {
			"type" : "GET",
			"url" : url,
			"timeout" : 3000
		}
		if(config.request_header){
			req_body['headers'] = config.request_header;
		}
		return req_body;
	}

	if(config.request_type == "POST"){
		var post_payload = config.request_body;
		if(config.url.match("~ditto_search_string~")){
			url = config.url.replace("~ditto_search_string~",config.test_search_str);
		}else{
			if(post_payload.match("~ditto_search_string~")){
				post_payload.replace("~ditto_search_string~",config.test_search_str);	
			}
		}

		var dataType = "";

		if(config.response_type == "JSON"){
			dataType = "json"
		}

		var request_body = {
			"type" : "POST",
			"url" : url,
			"timeout" : 3000,
			"data" : JSON.parse(post_payload),
			"dataType" : dataType
		}

		if(config.request_header){
			req_body['headers'] = config.request_header;
		}
		return req_body;
	}

}



function backPostGet(json_obj) {
	var deferredObject = $.Deferred();
	chrome.runtime.sendMessage({method: "backPostGet", key:json_obj}, function(response) {
		if (response.status) {
			if (response.req == 'succ') {
				deferredObject.resolve(response.data, response.text_status, response.jq_xhr);
			} else {
				deferredObject.reject(response.jq_xhr, response.text_status, response.error);
			}
		}
	});
	return deferredObject.promise();
}



function fill_test_data(){
	$("input.url").val("https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=~ditto_search_string~");

	$("input.title_selector").val("ul.s-result-list li.s-result-item:eq(0)");

	$("input.title_attr").val("text");

	$("input.price_selector").val("ul.s-result-list li.s-result-item:eq(0) span.sx-price-whole:eq(0)");

	$(".price_attr").val("text");

	$("input.link_selector").val("ul.s-result-list li.s-result-item:eq(0)");

	$(".link_attr").val('data-asin');

	$("input.image_selector").val("ul.s-result-list li.s-result-item:eq(0) img.s-access-image");

	$(".image_attr").val("src");

	$(".test_string").val("Apple iPhone 6 GSM Unlocked, 128 GB");


}

fill_test_data();