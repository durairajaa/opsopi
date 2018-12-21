console.log("abebooks cs reloaded");

function isProductPage() {
    console.log("in ak cs ");
    if ($("#itemOverview").length > 0) {
        //book page
        return true;
    }
    return false;
}

function getPageDeets() {

    function getProdTitle() {
        var title = $.trim($("#book-title").text());
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
        if ($(".price").length > 0) {
            price = ($("#book-price").text().replace("US$", "")).replace(/[\s$,]/g, '')
        }
        price = parseFloat(price);
        price = price ? price : "";
        return price;
    }

    function getProductId() {

        var product_id = "";

        if ($("#isbn a:eq(-1)").length > 0) {
            product_id = $("#isbn a:eq(-1)").text()
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
        if ($("#imageContainer img").length > 0) {
            imageSrc = $("#imageContainer img").attr("src");
        }
        return imageSrc ? imageSrc : "";
    }

    function getOOSstate() {
        return false;
    }



    function getISbn() {

        var product_id = "";

        if ($("#isbn a:eq(-1)").length > 0) {
            product_id = $("#isbn a:eq(-1)").text()
            product_id = product_id.replace("-", "");
        }
        var pid = "";
        if (product_id) {
            pid = product_id;
        }
        return pid ? pid : "";
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
            prod_site: "ak",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true,
        }
        if (getISbn()) {
            pageDeets['book_page'] = true;
            pageDeets['prod_srch'] = getISbn();
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