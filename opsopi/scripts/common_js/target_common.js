function back_search_ta(prod_deets) {
    console.log(prod_deets);
    var searchURL = "http://redsky.target.com/v1/plp/search?kwr=y&keyword=" + encodeURIComponent(prod_deets.prod_title) + "&count=10&offset=0";
    var dyn_req = backPostGet({
        type: "GET",
        url: searchURL,
        headers: {
            "Accept-Language": "en-US,en;q=0.8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    dyn_req.done(function(response) {
        var extracted_deets = extract_result(response);
        console.log(extracted_deets);
        if (extracted_deets.is_found && title_filter(prod_deets.prod_title, extracted_deets.title)) {
            insert_price_result_box(make_results_box(extracted_deets, 'searchid', false));
        } else {
            // nothing found
            console.log("nothing found for eb");
            // insert manual search
            insert_manual_search_box(make_manual_search_box({
                "prod_site": "ta",
                "prod_link": searchURL,
                "website": "target",
                "title": prod_deets.prod_title,
                "img_src": prod_deets.prod_img
            }, "searchid"));
        }

    })

    function extract_result(response) {
        if (response.search_response.items.Item.length > 0) {
            var deets = {};
            try {
                var firstResult = response.search_response.items.Item[0];
                var resLink = "https://www.target.com" + firstResult.url;
                var resImage = firstResult.images[0].base_url + firstResult.images[0].primary;
                var resTitle = firstResult.title;
                var minPrice = firstResult.offer_price.min_price;
                var maxPrice = firstResult.offer_price.max_price;
                var justPrice = firstResult.offer_price.price;
                var resPrice = justPrice;
                if (justPrice <= 0) {
                    if (minPrice > 0) {
                        resPrice = minPrice;
                    } else {
                        resPrice = maxPrice;
                    }
                }
                deets['prod_link'] = resLink;
                deets['title'] = resTitle;
                deets['prod_price'] = resPrice;
                deets['website'] = 'ta';
                deets['prod_site'] = 'ta';
                deets['img_src'] = resImage;
                deets['is_found'] = true;
            } catch (err) {
                deets['is_found'] = false;
                console.log("setting is_found false");
            }

        }
        if (!(deets['prod_link'] && deets['title'] && deets['prod_price'] && deets['website'])) {
            console.log("setting is_found false");
            deets['is_found'] = false;
        }
        console.log(deets);
        console.log(_.clone(deets));
        return _.clone(deets);
    }
}


function back_price_ta(result_from_backend) {
    // insert_price_result_box(make_results_box(result_from_backend,'',false));

    // var link = result_from_backend['link'];

    var link = "https://redsky.target.com/v2/pdp/tcin/" + result_from_backend['pid'] + "?excludes=taxonomy"

    var back_price_req = backPostGet({
        type: "GET",
        url: link,
        timeout: 3000,
    });

    back_price_req.done(function(response) {
        var resp_elem = response;
        var price = "";
        price = get_price(resp_elem);
        if (price) {
            // insert product
            console.log("target price found");
            result_from_backend['prod_price'] = price;
            if (result_from_backend.is_dittory) {
                // console.log("target price found");
                insertDittoryProduct(result_from_backend);
            } else {
                insert_price_result_box(make_results_box(result_from_backend, '', false));
            }
        } else {
            // price not found do something
            console.log("target price not found");
            if (result_from_backend.is_dittory) {
                // console.log("price found");
                insertDittoryProduct(result_from_backend);
            } else {
                insert_price_result_box(make_results_box(result_from_backend, '', false));
            }
        }
    });

    function get_price(deets) {
        var price = "";
        console.log(deets);
        if (deets.product.price) {
            if (deets.product.price.offerPrice) {
                price = deets.product.price.offerPrice.price;
            } else if (deets.product.price.listPrice) {
                price = deets.product.price.listPrice.price;
            }
        }
        price = price ? price : "";
        return price;
    }
}