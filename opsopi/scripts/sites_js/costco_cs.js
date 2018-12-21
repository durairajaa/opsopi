console.log("costco cs reloaded");

function isProductPage() {
    console.log("in bc cs ");
    if ($("#product-details").length > 0) {
        console.log("product page");
        return true;
    } else {
        console.log("not a product page");
        return false;
    }
}

function getPageDeets() {

    function getProdTitle() {
        var title = $.trim($(".product-h1-container:eq(0)").text());
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        // var breadcrumb_list = $(".a-breadcrumb li a");
        var crumbs = ""
        // for(i=0; i<breadcrumb_list.length;i++){
        // 	crumbs += $.trim($(breadcrumb_list[i]).text());
        // 	crumbs += "_";
        // }
        // if(crumbs){
        // 	crumbs = crumbs.slice(0,-1);
        // }
        crumbs = crumbs ? crumbs : "";
        return crumbs;
    }

    function getProdPrice() {
        var price = "";
        if ($(".your-price .value")) {
            console.log("found price");
            console.log($(".your-price .value").text());
            price = $(".your-price .value").text().replace(/[$,]/g, "");
        } else {
            console.log("price not found");
        }
        price = parseFloat(price);
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        var pid_match = window.location.href.match(/[\d]+\.html/g)[0];
        if (pid_match.length > 0) {
            pid = window.location.href.match(/[\d]+\.html/g)[0].replace(".html", "");
        }
        if ($("[data-sku]:eq(1)").length > 0) {
            pid = $("[data-sku]:eq(1)").attr("data-sku");
        }
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $("#productImage").attr("src");
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
            prod_site: "co",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true
        }

        return pageDeets;
    }
    return getDeets();
}


if (isProductPage()) {
    console.log("calling update data for spa");
    update_data_for_spa(getPageDeets());
    console.log(getPageDeets());
    // var deets = getPageDeets();
    // console.log("%c Got Details","color:red;");
    // console.log(deets);
}