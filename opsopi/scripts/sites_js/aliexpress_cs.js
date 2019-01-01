console.log("aliexpress_cs.js loaded");

function get_searches() {
    // search button click
    // pressing enter also works
    $('body').on('click', 'input.search-button', function(e) {
        try {
            var search_term = $("input#search-key").val();
            if (search_term != "") {
                // send search event
                console.log('ae', search_term);
            }
        } catch (err) {

        }
    });

}


function isProductPage() {
    if (window.location.href.match("/item/") && ($(".currency").text() == "USD")) {
        console.log("product page");
        return true;
    } else {
        console.log("not a product page");
        return false;
    }
}

function getPageDeets() {

    function getProdTitle() {
        var title = $("h1.product-name").text();
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $(".ui-breadcrumb a");
        var crumbs = ""
        for (i = 0; i < breadcrumb_list.length; i++) {
            crumbs += $.trim($(breadcrumb_list[i]).text());
            crumbs += "_";
        }
        if (crumbs) {
            crumbs = crumbs.slice(0, -1);
        }
        crumbs = crumbs ? crumbs : "";
        return crumbs;
    }

    function getProdPrice() {
        var priceRaw = $("#j-sku-discount-price[itemprop = 'price']").text();
        if (!priceRaw) {
            priceRaw = $("[itemprop = 'lowPrice']").text();
        }
        var price = parseFloat(priceRaw.replace("$", ""));
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $(".ui-image-viewer img").attr("src");
        return imageSrc ? imageSrc : "";
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
            prod_site: "ae"
        }

        return pageDeets;
    }
    return getDeets();
}

$(window).on("load", function() {
    if (isProductPage()) {
        console.log("calling update data for spa");
        // update_data_for_spa(getPageDeets());
        // console.log(getPageDeets());
        var deets = getPageDeets();
        console.log("%c Got Details", "color:red;");
        console.log(deets);
    }
});

get_searches();