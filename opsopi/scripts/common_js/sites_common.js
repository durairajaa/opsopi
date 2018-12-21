var prodResults = [];
var searchSites = ["uz", "wm", "ub", "jt", "tr", "co", "bb", "ne", "os"];

function beginSiteSearch(siteCode, prodData, processSiteResult) {
    switch (siteCode) {
        case "uz":
            searchAmazon(prodData, processSiteResult);
            break;
        case "ub":
            searchEbay(prodData, processSiteResult);
            break;
        case "wm":
            searchWalmart(prodData, processSiteResult);
            break;
        case "jt":
            searchJet(prodData, processSiteResult);
            break;
        case "tr":
            searchTarget(prodData, processSiteResult);
            break;
        case "co":
            searchCostco(prodData, processSiteResult);
            break;
        case "bb":
            searchBestBuy(prodData, processSiteResult);
            break;
        case "ne":
            searchNewEgg(prodData, processSiteResult);
            break;
        case "os":
            searchOverStock(prodData, processSiteResult);
            break;
    }
}

function processSiteResult(resData) {
    prodResults.push(resData);
    prodResults.sort(function(obj1, obj2) {
        return obj1["prodPrice"] - obj2["prodPrice"];
    });
    displayResults();
}

function findMatches(prodData) {
    insertTemplateToPage();
    for (i = 0; i < searchSites.length; ++i) {
        if (searchSites[i] != prodData.site) {
            beginSiteSearch(searchSites[i], prodData, processSiteResult);
        }
    }
}

var templateFileContent;

function insertTemplateToPage() {
    var dyn_req = backPostGet({
        type: "GET",
        url: chrome.runtime.getURL("templates/makkhi_box.html")
    });
    dyn_req.done(function(response, textStatus, sent_req) {
        templateFileContent = response;
        Mustache.parse(templateFileContent);
        $("#makkhiRootPlaceHolder").remove();
        var divElement = $("<div id='makkhiRootPlaceHolder'/>");
        $('body').append(divElement);
        var host = document.getElementById('makkhiRootPlaceHolder');
        var container_dom = host.createShadowRoot();
        var cssPath = chrome.runtime.getURL("styles/makkhi_box.css");
        var rendered = Mustache.render(templateFileContent, {
            prodResults: prodResults,
            cssPath: cssPath
        });
        $(container_dom).html(rendered);
        var shadDumRoot = container_dom.querySelector("#mprod-sargjhni");
        attachDomJS(shadDumRoot);
    });
}

function displayResults() {
    var cssPath = chrome.runtime.getURL("styles/makkhi_box.css");
    var rendered = Mustache.render(templateFileContent, {
        prodResults: prodResults,
        cssPath: cssPath
    });
    var host = document.getElementById('makkhiRootPlaceHolder');
    var container_dom = host.createShadowRoot();
    $(container_dom).html(rendered);
    var shadDumRoot = container_dom.querySelector("#mprod-sargjhni");
    attachDomJS(shadDumRoot);
}

function backPostGet(json_obj) {
    var deferredObject = $.Deferred();
    chrome.runtime.sendMessage({
        method: "backPostGet",
        key: json_obj
    }, function(response) {
        if (response.status) {
            if (response.req == 'succ') {
                deferredObject.resolve(response.data, response.text_status, response.jq_xhr);
            } else {
                deferredObject.reject(response.jq_xhr, response.text_status, response.error);
            }
        }
    });
    return deferredObject.promise();
}

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}