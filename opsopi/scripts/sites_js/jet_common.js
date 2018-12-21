function searchJet(prodData, processSiteResult) {
    var searchURL = "https://jet.com/search?term=" + encodeURIComponent(prodData.title);
    var dyn_req = backPostGet({
        type: "GET",
        url: searchURL
    });
    dyn_req.done(handleJetSearchToken(prodData, processSiteResult));
}

var handleJetSearchToken = function(prodData, processTokenPage) {
    return function(response, textStatus, sent_req) {
        var resp_elem_eb = $('<div/>').append($.parseHTML(response));
        if (resp_elem_eb.find("div[data-id=\"csrf\"]").length > 0) {
            var tokenElement = resp_elem_eb.find("div[data-id=\"csrf\"]")[0];
            var csrfToken = $(tokenElement).attr("data-val");
            csrfToken = csrfToken.replace(/["]/g, '');
            var dyn_req = backPostGet({
                type: "POST",
                url: "https://jet.com/api/search/",
                headers: {
                    "x-csrf-token": csrfToken,
                    "x-requested-with": "XMLHttpRequest",
                    "content-type": "application/json",
                    "accept": "application/json, text/javascript, */*; q=0.01"
                },
                data: JSON.stringify({
                    "term": prodData.title,
                    "origination": "PLP"
                })
            });
        }
        dyn_req.done(handleJetSearchSuccess(prodData, processSiteResult));
    }
}

var handleJetSearchSuccess = function(prodData, processSiteResult) {
    return function(response, textStatus, sent_req) {
        if (response.success == true && response.result.products.length > 0) {
            var bestMatchProd = response.result.products[0];
            var resData = {};
            var resTitle = bestMatchProd.title;
            var tempTerm = bestMatchProd.title;
            tempTerm = tempTerm.replace(/[,'"]/g, '');
            tempTerm = tempTerm.replace(/[ ]/g, "-");
            var resLink = "https://jet.com/product/" + tempTerm + "/" + bestMatchProd.id;
            var resImage = bestMatchProd.image.raw;
            var resPrice = bestMatchProd.productPrice.referencePrice;
            resData["site"] = "jt";
            resData["siteName"] = "Jet";
            resData["prodTitle"] = resTitle;
            resData["imageSrc"] = resImage;
            resData["link"] = resLink;
            resData["prodPrice"] = parseFloat(resPrice);
            processSiteResult(resData);
        }
    }
}