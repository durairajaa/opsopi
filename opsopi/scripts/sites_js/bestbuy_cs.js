console.log("bestbuy cs reloaded");

function isProductPage() {
    console.log("in bc cs ");
    if ($("#pdp-content").length > 0) {
        console.log("product page");
        return true;
    } else {
        console.log("not a product page");
        return false;
    }
}

function getPageDeets() {

    function getProdTitle() {
        var title = $("#sku-title").text();
        if (!title) {
            title = $(".sku-title").text()
        }
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $("#breadcrumb-list li  a");
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
        var priceRaw = $(".pb-purchase-price").text();
        var price = parseFloat(priceRaw.replace("$", "").replace(",", "").replace(/[\s$,]/g, ''));
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        pid = $("#sku-value").text();
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $(".primary-image ").attr('src');
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
            prod_site: "bb",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true
        }

        return pageDeets;
    }
    return getDeets();
}

$(window).on("load", function() {
    if (isProductPage()) {
        console.log("calling update data for spa");
        update_data_for_spa(getPageDeets());
        console.log(getPageDeets());
        // var deets = getPageDeets();
        // console.log("%c Got Details","color:red;");
        // console.log(deets);
    }
});