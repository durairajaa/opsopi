function back_search_wm(prod_deets) {
    console.log(prod_deets);
    var searchURL = "https://www.walmart.com/search/?query=" + encodeURIComponent(prod_deets.prod_title);
    var dyn_req = backPostGet({
        type: "GET",
        url: searchURL
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
                "prod_site": "wm",
                "prod_link": searchURL,
                "website": "walmart",
                "title": prod_deets.prod_title,
                "img_src": prod_deets.prod_img
            }, "searchid"));
        }

    })

    function extract_result(response) {
        resp_elem_wm = $('<div/>').append($.parseHTML(response));
        var deets = {};
        if ($(resp_elem_wm).find("#searchProductResult .product-title-link").attr('aria-label')) {

            try {
                var resPrice = $(resp_elem_wm).find("#searchProductResult .Price-group").attr('aria-label');
                if (resPrice) {
                    resPrice = resPrice.replace(/[$,]/g, "");
                }
                deets['prod_link'] = "https://www.walmart.com" + $(resp_elem_wm).find("#searchProductResult .product-title-link").attr("href");
                deets['title'] = $(resp_elem_wm).find("#searchProductResult .product-title-link").attr('aria-label');
                deets['prod_price'] = resPrice;
                deets['website'] = 'wm';
                deets['prod_site'] = 'wm';
                deets['img_src'] = $(resp_elem_wm).find("#searchProductResult .Tile-img").attr('src');
                deets['is_found'] = true;
            } catch (err) {
                console.log(err);
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