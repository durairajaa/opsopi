function back_search_eb(prod_deets) {
    console.log(prod_deets);
    var searchURL = "http://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(prod_deets.prod_title) + "&rt=nc&LH_BIN=1";
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
                "prod_site": "ub",
                "prod_link": searchURL,
                "website": "Ebay",
                "title": prod_deets.prod_title,
                "img_src": prod_deets.prod_img
            }, "searchid"));
        }

    })

    function extract_result(response) {
        var resp_elem_eb = $('<div/>').append($.parseHTML(response));
        var deets = {};
        if (resp_elem_eb.find("#srp-river-results .s-item").length > 0) {
            var firstResult = resp_elem_eb.find("#srp-river-results .s-item")[0];
            try {
                deets['prod_link'] = $(firstResult).find("a:eq(0)").attr("href");
                deets['title'] = $(firstResult).find("h3").text().trim();
                deets['prod_price'] = $($(firstResult).find(".s-item__price")[0]).text().trim().replace(/[$,]/g, "");
                deets['website'] = 'ub';
                deets['prod_site'] = 'ub';
                deets['img_src'] = $($(firstResult).find("img")[0]).attr("src");
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