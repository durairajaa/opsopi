function back_price_ap(result_from_backend) {
    // insert_price_result_box(make_results_box(result_from_backend,'',false));

    var link = result_from_backend['link'];


    var back_price_req = backPostGet({
        type: "GET",
        url: link,
        timeout: 5000,
    });

    back_price_req.done(function(response) {
        var resp_elem = $('<div/>').append($.parseHTML(response));
        var price = "";
        price = get_price(resp_elem);
        if (price) {
            // insert product
            result_from_backend['prod_price'] = price;
            if (result_from_backend.is_dittory) {
                console.log("price found");
                insertDittoryProduct(result_from_backend);
            } else {
                insert_price_result_box(make_results_box(result_from_backend, '', false));
            }
        } else {
            // price not found do something
            console.log("asos price not found");
        }
    });

    function get_price(resp_elem) {
        var priceRaw = "";
        if ($(resp_elem).find(".product-details__sale-price").length > 0) {
            priceRaw = $(resp_elem).find(".product-details__sale-price").text();
        }
        var price = parseFloat(priceRaw.replace("$", ""));
        price = price ? price : "";
        return price;
    }
}