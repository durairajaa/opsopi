// var cssSelector = {
// 	prodTitle: "h1",
// 	prodTitleSuffix: "h1 .by"
// };

// function isProductPage() {
// 	var siteURL = window.location.href;
// 	if (siteURL.match('/product/')) {
// 		return true;
// 	}
// 	return false;
// }

// function afterProdContentLoaded(callBackFunc) {
// 	setTimeout(function() {
// 		if ($(cssSelector.prodTitle).length > 0) {
// 			callBackFunc();
// 		} else {
// 			return afterProdContentLoaded(callBackFunc);
// 		}
// 	}, 200);
// }

// function afterGatherProdData(callBackFunc) {
// 	afterProdContentLoaded(function() {
// 		var prodData = {};
// 		var prodTitleFull = $(cssSelector.prodTitle).text().trim();
// 		var prodTitleSuff = $(cssSelector.prodTitleSuffix).text().trim();
// 		var prodTitle = prodTitleFull.replace(new RegExp(escapeRegExp(prodTitleSuff) + "$", "g"), '');
// 		console.log(prodTitleFull);
// 		console.log(prodTitleSuff);
// 		console.log(prodTitle);
// 		prodData.title = prodTitle;
// 		prodData.site = "jt";
// 		callBackFunc(prodData);
// 	});
// }

// if (isProductPage()) {
// 	afterGatherProdData(function(prodData) {
// 		findMatches(prodData);
// 	});	
// }
var page_load_check_timer = "";
var page_url_check_timer = "";
var page_old_url = window.location.href;
var old_title = "";


function page_load_checker() {

    if (page_load_check_timer) {
        window.clearTimeout(page_load_check_timer);
    }

    if ($("h1").length == 0 || ($("h1").length != 0 && old_title == $("h1").text())) {
        //page still loading
        console.log(old_title);
        console.log($("h1").text());
        page_load_check_timer = setTimeout(page_load_checker, 1000);
        return;
    } else {
        old_title = $("h1").text();
        page_task();
    }
}

function page_task() {
    //check for product page
    if (window.location.href.match('/product/')) {
        // get data and insert deets
        update_data_for_spa(getPageDeets());

    } else {
        // do nothing here
        old_title = "";
    }
}

function page_url_change_checker() {
    if (page_url_check_timer) {
        window.clearTimeout(page_url_check_timer);
    }
    if (page_old_url != window.location.href) {
        //url change detected
        page_old_url = window.location.href;
        page_url_check_timer = setTimeout(page_url_change_checker, 1000);
        $("#mc_main_host").remove();
        page_load_checker();
    } else {
        page_old_url = window.location.href;
        page_url_check_timer = setTimeout(page_url_change_checker, 1000);
    }
}


function getPageDeets() {

    function getProdTitle() {
        // var title = $.trim($("#product h1").contents().filter(function(){return this.nodeType==3;})[0].textContent);
        var title = $("h1").text();
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        // no categ informaaation available
        var breadcrumb_list = $(".breadcrumb li a");
        var crumbs = ""
        for (i = 0; i < breadcrumb_list.length; i++) {
            crumbs += $(breadcrumb_list[i]).text();
            crumbs += "_";
        }
        if (crumbs) {
            crumbs = crumbs.slice(0, -1);
        }
        crumbs = crumbs ? crumbs : "";
        return crumbs;
    }

    function getProdPrice() {
        var priceRaw = "";
        if ($(".product-detail-container .price .formatted-value:eq(0)").length > 0) {
            priceRaw = $(".product-detail-container .price .formatted-value").text();
        }
        var price = parseFloat(priceRaw.replace("$", "").replace(/[\s$,]/g, ''));
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        console.log("getting pid for jet");
        var pid = $("[id='input-article']").attr('value');
        if (!pid) {
            pid = $("#pdv [data-sku]:eq(0)").attr('data-sku');
        }
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = 'http' + $("#product-image-box img").attr('src');
        if (!($("#product-image-box img") > 0)) {
            imageSrc = $("#main-image-0").attr("src");
        }
        return imageSrc ? imageSrc : "";
    }

    function getOOSstate() {
        return false;
    }

    function getDeets() {
        var pageDeets = {
            prod_title: getProdTitle(),
            prod_categ: getCategoryFromCrumbs(),
            prod_price: getProdPrice(),
            prod_link: window.location.href,
            prod_srch: getProdTitle(),
            product_id: getProductId(),
            prod_img: getProductImage(),
            prod_site: "je",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true
        }

        return pageDeets;
    }
    return getDeets();
}

if (window.location.href.match('jet.com')) {
    page_load_checker();
    page_url_change_checker();
}