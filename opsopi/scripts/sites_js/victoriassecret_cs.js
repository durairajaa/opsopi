console.log("victoriassecret_cs.js");

function isProductPage() {
    if (window.location.href.match("/product/") && ((($("#region_select").contents().filter(function() {
            return this.nodeType == 3
        })[0]).data == "$") && $("#region_select div").hasClass("United States"))) {
        console.log("product page");
        return true;
    } else {
        console.log("not a product page");
        return false;
    }
}

function getPageDeets() {

    function getProdTitle() {
        var title = $(".product_details h1").text();
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $("#nav_breadcrumb li")
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
        var priceRaw = ($("#product-detail .product_prices .product_price").contents().filter(function() {
            return this.nodeType == 3
        })[0].data);
        var price = parseFloat(priceRaw.replace("$", ""));
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $(".product_images .current img").attr("src");
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
            prod_site: "ts"
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