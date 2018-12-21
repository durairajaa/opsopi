function searchWalmart(prodData, processSiteResult) {
    var searchURL = "https://www.walmart.com/search/?query=" + encodeURIComponent(prodData.title);
    var dyn_req = backPostGet({
        type: "GET",
        url: searchURL
    });
    dyn_req.done(handleWalmartSearchSuccess(prodData, processSiteResult));
}

var handleWalmartSearchSuccess = function(prodData, processSiteResult) {
    return function(response, textStatus, sent_req) {
        var resp_elem_wm = $('<div/>').append($.parseHTML(response));
        if (resp_elem_wm.find('div[data-tl-id="ProductTileListView-0"]').length > 0) {
            var firstResult = resp_elem_wm.find('div[data-tl-id="ProductTileListView-0"]');
            var resData = {};
            var resLink = "https://www.walmart.com" + $($(firstResult).find("a.product-title-link")[0]).attr("href");
            var resImage = $($(firstResult).find("img.Tile-img")[0]).attr("src");
            var resTitle = $($(firstResult).find("h2.prod-ProductTitle")[0]).text().trim();
            var resPrice = $($(firstResult).find("div.price-main-block")[0]).text().trim().replace("$", "");
            resData["site"] = "wm";
            resData["siteName"] = "Walmart";
            resData["prodTitle"] = resTitle;
            resData["imageSrc"] = resImage;
            resData["link"] = resLink;
            resData["prodPrice"] = parseFloat(resPrice);
            processSiteResult(resData);
        }
    }
}