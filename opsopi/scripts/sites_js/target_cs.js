var page_load_check_timer = "";
var page_url_check_timer = "";
var page_old_url = window.location.href;
var old_pid = "";


function get_searches() {
    // search button click
    // works for keyboard click 
    $('body').on('click', "button#searchReset[data-search='submit']", function(e) {
        console.log('search detected');
        try {
            var search_term = $("input#search").val();
            if (search_term != "") {
                // send search event
                console.log('ta', search_term);
            }
        } catch (err) {

        }
    });

    $('body').on('click', ".typeahead--list li a", function(e) {
        console.log('search detected');
        try {
            var search_term = $(this).text();
            if (search_term != "") {
                // send search event
                console.log('ta', search_term);
            }
        } catch (err) {

        }
    });


}

function page_load_checker() {
    if (page_load_check_timer) {
        window.clearTimeout(page_load_check_timer);
    }
    // ($(".TGTloading").css("display") != "none")
    // if(($(".TGTloading").css("display") != "none") || (!$("#AddToCartAreaId button").attr('data-tcin'))  || (is_old_pid())  )
    if ((($(".TGTloading").length > 0) && ($(".TGTloading").css("display") != "none")) || (is_old_pid())) {
        //page still loading
        console.log("page still loading")
        page_load_check_timer = setTimeout(page_load_checker, 1000);
        return;
    } else {
        if (window.location.href.match("/p/")) {
            console.log("page loaded");
            console.log($("#AddToCartAreaId button").attr('data-tcin'));
            console.log($("#AddToCartAreaId button"));
            old_pid = $("#AddToCartAreaId button").attr('data-tcin');
            page_task();
        }

    }
}

function is_old_pid() {
    var curr_pid = ($("#AddToCartAreaId button").attr('data-tcin'));
    if (curr_pid == old_pid || $("#AddToCartAreaId button").attr('data-tcin') == undefined) {
        return true;
    } else {
        return false;
    }
}

var old_img = "";

function page_task() {
    //check for product page
    if (window.location.href.match("/p/")) {
        var img = getPageDeets().prod_img
        if (img != "" && old_img != img) {
            console.log("calling update data for spa");
            old_img = img;
            update_data_for_spa(getPageDeets());
        } else {
            setTimeout(function() {
                console.log("same image is there waiting for some time");
                page_task();
            }, 1000)
        }


    } else {
        // do nothing here
        console.log("not  a product page");
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
        // page_load_checker();
        page_task();
    } else {
        page_old_url = window.location.href;
        page_url_check_timer = setTimeout(page_url_change_checker, 1000);
    }
}


function getPageDeets() {

    function getProdTitle() {
        var title = $.trim($(".title-product").text());
        if (!title) {
            title = $("[data-test='product-title']").text();
        }
        title = title ? title : "";
        return title;
    }

    function getCategoryFromCrumbs() {
        var breadcrumb_list = $("a.js-breadCrumb");
        var crumbs = ""
        crumbs = crumbs ? crumbs : "";
        return crumbs;
    }

    function getProdPrice() {
        var price = parseFloat($(".details-pdp .price").text().replace(/[$,\s]/g, ''));
        if (!price) {
            price = parseFloat($("[data-test='product-price']").text().replace(/[$,\s]/g, ''));
        }
        price = price ? price : "";
        return price;
    }

    function getProductId() {
        var pid = "";
        var src = $(".slick-active.slick-center img").attr('src');
        var pid = ""
        return pid ? pid : "";
    }

    function getProductImage() {
        var imageSrc = $(".slick-active.slick-center img").attr('src');
        if (!imageSrc) {
            imageSrc = $(".lenszoom img:eq(0)").attr("src");
        }

        if (!imageSrc) {
            if ($(".ijCYDw").length > 0 && $(".ijCYDw").parent().find("img").length > 0) {
                imageSrc = $(".ijCYDw").parent().find("img").attr("src");
            }

            if (imageSrc && imageSrc.startsWith("//")) {
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
            prod_srch: getProdTitle(),
            product_id: getProductId(),
            prod_img: getProductImage(),
            prod_site: "ta",
            prod_mrp: getProdPrice(),
            is_oos: getOOSstate(),
            backsearch_site: true
        }

        return pageDeets;
    }
    return getDeets();
}

if (window.location.href.match('target.com')) {
    // page_load_checker();
    page_url_change_checker();

    if (window.location.href.match("/p/")) {
        page_task();
    }

}