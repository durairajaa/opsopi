console.log("walmart cs reloaded");

function isProductPage() {
    console.log("in bc cs ");
    if (window.location.href.match("/ip/")) {
        console.log("product page");
        return true;
    } else {
        console.log("not a product page");
        return false;
    }
}

function getPageDeets() {

    function getProdTitle() {
        var title = $(".prod-ProductTitle").text();
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $(".breadcrumb-list  a");
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
        var priceRaw = $(".prod-PriceHero .Price-group [itemprop='price']").attr('content');
        var price = parseFloat(priceRaw.replace("$", "").replace(/[\s$,]/g, ''));
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        pid = $('[itemprop="sku"]').attr("content");
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $(".prod-HeroImage img").attr('src');
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
            prod_site: "wm",
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