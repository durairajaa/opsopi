# OPSOPI

Opsopi is open source price comparision extension for google chrome, it helps to compare price of a product across many ecommerce websites.

# How to use:

### Find low prices without doing anything
- Opsopi will popup on product pages
- Click on the opsopi to see price of the product in other sites

![demo1](./opsopi_demo_img)


### Adding more sites:
Opsopi works on all major sites if you want to make opsopy to work on a site you can do by adding
custom javascript to the extension

##### Adding new sites using Javascipt:

- Click on the opsopi icon on the browser bar
- Click settings button in the popup
- Click Manage sites button in the settings page
- Give the url of the site you want to add press "Add site" button
- Click the "I will give my Javascript File" and follow the walk through
 
opsopi requires two javascript files for each site you want to add
- backsearch script
- product page script

#### backsearch script
This script will be executed on every product page, this script has to fetch price of the product from the site(site intended to add) and give it a call back so that the price will be displayed.
This script will have access to the following:
- prod_title (variable representing the title of the product in the productpage)
- website (Hostname of the produc page)
- success_call_back (function for the script to call when it successfully obtain results)
- success_call_back accepts prod_link,title,prod_price,website,img_src as arguments
- fail_call_back (function the script has to be called when something goes wrong)
-this script has access to jquery 

#### product page script
This script will be executed on every page of the site you want to add, this script has to extract the product details and call a function so that opsopi will get the price of the product from other sites and display

This script will have access to the following:
- page_html (html string of the page)
- website (hostname of the website)
- success_call_back (function the script has to call so that opsopi will get price of the product from other sites and display)
- fail_call_back (function the script has to be called when something goes wrong)
-this script has access to jquery 

#### Example adding script
The following scripts can be used to www.amazon.in

###### example backsearch script
```
var prod_srch_enc = encodeURIComponentFix($.trim(prod_title));

var req = $.ajax({
	"type" : "GET",
	"url" : 'https://www.amazon.in/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords='+prod_srch_enc
});
	

req.done(function(response) {
	var resp_elem = $('<div/>').append($.parseHTML(response));
	var avail_val = true;
	if (resp_elem.find('#atfResults #result_0 ul.rsltL > li:eq(0) span.grey').length>0){
		avail_val  = (resp_elem.find('#atfResults #result_0 ul.rsltL > li:eq(0) span.grey').html().indexOf('unavailable') == -1);
	}

	if  ((!avail_val) || (resp_elem.find('#noResultsTitle').length>0)){
		// results not available
		fail_call_back();
	}

	if (resp_elem.find('#atfResults #s-results-list-atf #result_0').length>0){

		price_hold_all = resp_elem.find('#atfResults #s-results-list-atf #result_0 span.s-price').contents();
		if (price_hold_all.length==0){

			price_hold_all = resp_elem.find('#atfResults #s-results-list-atf #result_0 span.a-color-price').contents();
		}

	} else if (resp_elem.find('#atfResults #result_0 ul.rsltL').length>0){

		price_hold_all = resp_elem.find('#atfResults #result_0 ul.rsltL li.newp span.bld, #atfResults #result_0 ul.rsltL li.mkp2 span.price, #atfResults #result_0 ul.rsltL li.digp span.bld').contents()

	} else if (resp_elem.find('#atfResults #result_0 ul.rsltGridList').length>0){

		price_hold_all = resp_elem.find('#atfResults #result_0 ul.rsltGridList li.newp span.bld, #atfResults #result_0 ul.rsltGridList li.mkp2 span.price, #atfResults #result_0 ul.rsltGridList li.digp span.bld').contents();
	} 

	price_str = textFind(price_hold_all);
	if (price_str.length==0){
		price_str = textFind(price_hold_all,-1);
	}
	var prodlink_href = resp_elem.find('#atfResults #result_0 a.s-access-detail-page').attr('href');
	var prodlink_txt = $.trim(resp_elem.find('#atfResults #result_0 a.s-access-detail').attr('title'));
	var prod_img = resp_elem.find('#atfResults #result_0 img.s-access-image').attr('src');
	if (prodlink_txt==''){
		prodlink_txt = $.trim(resp_elem.find('#atfResults #result_0 h2.s-access-title').html());
	}	
	var price_str=$.trim(price_str.replace(/rs\.*|\*|\,/gi,''));
	// success call back if everything is available
	success_call_back(prodlink_href,prodlink_txt,price_str,"amazon.in",prod_img);
});


req.fail(function(){
	fail_call_back();
})

function encodeURIComponentFix(in_str) {
	return encodeURIComponent(in_str).replace(/%20/g,'+').replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

function textFind(contents_arr, parse_type) {
	var price_val='';
	//nodetype only fetches textnode
	$.each(contents_arr, function () {
			if ((this.nodeType === 3) && $.trim($(this).text())!=''){
					price_val += ' '+$.trim($(this).text());
				} //ifloop
			}); // eachFunction

	return cleanPrice(price_val,parse_type);
	
}


function cleanPrice(in_str,parse_type) {

    if (in_str==undefined || in_str=='') {
        console.log('whoa price is bare naked!');
        return '';
    }

	parse_type = typeof parse_type !== 'undefined' ? parse_type : 0;

	//console.log('PARSE_TYPE IS: '+parse_type);

	var clean_price_str = $.trim(in_str.replace(/rs\.*|\*|\,|\:/gi,''));

	if (parse_type==0) {
		clean_price_str = clean_price_str.split(/\s+/g)[0];
	} else if (parse_type==-1) {
		clean_price_str = clean_price_str.split(/\s+/g).pop();
	} else {
		clean_price_str = clean_price_str.split(/\s+/g)[parse_type];
	}	


	if (isNaN(parseFloat(clean_price_str))) {
	//if the string is still notafloatthengocharbychar
	    return clean_price_str.split("").filter(function(each) {
        		if (!isNaN(each) || (each=='.')) {
               		return each;
        		}//if
    			}).join(''); //func                                                                           
        
	} //if
	else {
	 return clean_price_str;  
	}


} 
```

###### Example product page script

```
var html_elem = $('<div/>').append($.parseHTML(page_html));

var title = $(html_elem).find("#productTitle") && $(html_elem).find("#productTitle").text();
var price = $(html_elem).find("#priceblock_ourprice") && $(html_elem).find("#priceblock_ourprice").text();
var image_src = $(html_elem).find("#imgTagWrapperId img") && $(html_elem).find("#imgTagWrapperId img").attr("src");

if(title && price && image_src){
	console.log("found all 3 in az_pp");
	success_call_back(title,price,image_src,website);
}else{
	console.log("some attributes are not found in az_pp");
	fail_call_back();
}
```

#### Adding site without using javascript
This needs improvement as it fails often
- Click on the opsopi icon on the browser bar
- Click settings button in the popup
- Click Manage sites button in the settings page
- Give the url of the site you want to add press "Add site" button
- Click the "Guide me to add this site" and follow the walk through

#### Requesting others to add site
- Click on the opsopi icon on the browser bar
- Click on "Add this site button"
- we will add this site and push an update (sites with most requests will be given priority)
- people can track the number of requests to add sites on https://opsopi.appspot.com/

    
# opsopi