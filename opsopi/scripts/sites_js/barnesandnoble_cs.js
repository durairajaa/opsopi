console.log("barnesandnoble cs reloaded");

function isProductPage() {
    console.log("in bc cs ");
    if (window.location.href.indexOf("/w/") > -1) {
        //book page
        return true;
    }
    return false;
}

function getPageDeets() {

    function getProdTitle() {
        var title = $.trim($(".pdp-header-title").text());
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $(".a-breadcrumb li a");
        var crumbs = ""
        // for(i=0; i<breadcrumb_list.length;i++){
        // 	crumbs += $.trim($(breadcrumb_list[i]).text());
        // 	crumbs += "_";
        // }
        // if(crumbs){
        // 	crumbs = crumbs.slice(0,-1);
        // }
        // crumbs = crumbs?crumbs:"";
        return crumbs;
    }

    function getProdPrice() {
        var price = "";
        price = "";
        if ($("#pdp-cur-price").length > 0) {
            price = ($("#pdp-cur-price").text()).replace(/[\s$,]/g, '')
        }
        price = parseFloat(price);
        price = price ? price : "";
        return price;
    }

    function getProductId() {

        var product_id = "";

        if ($("#ProductDetailsTab th:contains('ISBN-13') + td").length > 0) {
            product_id = $("#ProductDetailsTab th:contains('ISBN-13') + td").text()
            product_id = product_id.replace("-", "");
        }

        var pid = "";
        if (product_id) {
            pid = product_id;
        }
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = "";
        if ($("#pdpMainImage").lenght > 0) {
            imageSrc = $("#pdpMainImage").attr("src");
            if (!imageSrc.startsWith("https")) {
                imageSrc = "https:" + imageSrc;
            }
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
            prod_srch: getProductId(),
            product_id: getProductId(),
            prod_img: getProductImage(),
            prod_site: "be",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true,
            book_page: true
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