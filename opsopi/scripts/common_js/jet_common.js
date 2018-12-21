function back_search_je(prod_deets) {
    console.log(prod_deets);

    var search_term = prod_deets.prod_title;

    if (prod_deets.book_page) {
        search_term = prod_deets.prod_srch;
    }


    var searchURL = "https://jet.com/search?term=" + encodeURIComponent(prod_deets.prod_title);
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
                "prod_site": "je",
                "prod_link": searchURL,
                "website": "Jet",
                "title": prod_deets.prod_title,
                "img_src": prod_deets.prod_img
            }, "searchid"));
        }

    })

    function extract_result(response) {
        var resp_elem_wm = $('<div/>').append($.parseHTML(response));
        var deets = {};
        if (resp_elem_wm.find(".iKMVVd").length > 0) {

            try {

                var results = resp_elem_wm.find(".iKMVVd:eq(0)");
                var firstResult = results[0];

                var resData = {};

                deets['prod_link'] = $(firstResult).find("a").attr("href");
                if (!deets['prod_link'].startsWith("https://")) {
                    deets['prod_link'] = "https://www.jet.com" + deets['prod_link'];
                }

                deets['title'] = $(firstResult).find(".loUDst .knAVZA").text();
                deets['prod_price'] = $(firstResult).find(".gBFPgE").text().replace(/[$,]/g, "");
                deets['website'] = 'jet';
                deets['prod_site'] = 'je';
                deets['img_src'] = $(firstResult).find(".fIHTxs:eq(1) div:eq(0)").css("background-image").slice(4, -2);
                console.log("jet image debug");
                console.log($(firstResult).find(".fIHTxs:eq(1) div:eq(0)").css("background-image"));
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