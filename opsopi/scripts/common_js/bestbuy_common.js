function back_search_bb(prod_deets) {
    console.log(prod_deets);
    var searchURL = "http://www.bestbuy.com/site/searchpage.jsp?st=" + encodeURIComponent(prod_deets.prod_title) + "&_dyncharset=UTF-8&id=pcat17071&type=page&sc=Global&cp=1&nrp=&sp=&qp=&list=n&af=true&iht=y&usc=All+Categories&ks=960&keys=keys";
    var dyn_req = backPostGet({
        type: "GET",
        url: searchURL
    });
    dyn_req.done(function(response) {
        var extracted_deets = extract_result(response);
        console.log(extracted_deets);
        if (extracted_deets.is_found) {
            insert_price_result_box(make_results_box(extracted_deets, 'searchid', false));
        } else {
            // nothing found
            console.log("nothing found for eb");
            // insert manual search
            insert_manual_search_box(make_manual_search_box({
                "prod_site": "bb",
                "prod_link": searchURL,
                "website": "bestbuy",
                "title": prod_deets.prod_title,
                "img_src": prod_deets.prod_img
            }, "searchid"));
        }

    })

    function extract_result(response) {
        var resp_elem_wm = $('<div/>').append($.parseHTML(response));
        var deets = {};
        if (resp_elem_wm.find('div.list-items div.list-item').length > 0) {

            try {

                var results = resp_elem_wm.find('div.list-items div.list-item');
                var firstResult = results[0];

                var priceJson = JSON.parse($(firstResult).attr("data-price-json"));

                var resData = {};
                var resLink = "http://www.bestbuy.com" + $($(firstResult).find("div.list-item-thumbnail div.thumb a")[0]).attr("href");
                var resImage = $($(firstResult).find("img.center-block")).attr("src");
                var resTitle = $(firstResult).attr("data-title");
                var resPrice = priceJson["currentPrice"];

                deets['prod_link'] = resLink;
                deets['title'] = resTitle;
                deets['prod_price'] = resPrice;
                deets['website'] = 'bb';
                deets['prod_site'] = 'bb';
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