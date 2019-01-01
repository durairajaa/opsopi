isdevuse = true;

function getDataAndDisplay(prodDeetsToProcess) {
    var prodDeets = _.clone(prodDeetsToProcess);
    chrome.storage.local.get({
        gcm_id: "",
        user_id: ""
    }, function(msgResponse) {
        if (msgResponse.gcm_id && msgResponse.user_id) {
            prodDeets['gcm_id'] = msgResponse.gcm_id;
            prodDeets['user_id'] = msgResponse.user_id;
        } else if (!msgResponse.gcm_id) {
            prodDeets['gcm_id'] = "";
        } else if (!msgResponse.user_id) {
            prodDeets['user_id'] = "";
        }
        selectSourceAndGetData(prodDeets);
    });

    function selectSourceAndGetData(prodDeetsToProcess) {
        var prodDeets = _.clone(prodDeetsToProcess);

        if (isBookPage()) {
            // get from backsearch
        } else {
            // get from backend
            fetchSimServerData(prodDeets);
        }
    }

    function isBookPage() {
        return false;
    }

    function fetchSimServerData(prodDeetsToProcess) {
        console.log('doing postpid');
        var prodDeets = _.clone(prodDeetsToProcess);
        prodDeets['isDevUse'] = isdevuse;
        prodDeets['ext_id'] = chrome.runtime.id;
        // prodDeets['req_sites']=["fk", "sd", "az", "pt", "tc"];
        prodDeets['req_sites'] = [];
        prodDeets['window_height'] = $(window).height();
        prodDeets['window_width'] = $(window).width();
        prodDeets['screen_height'] = screen.height;
        prodDeets['screen_width'] = screen.width;

        var reqSend = backPostGet({
            type: "POST",
            // url: "http://139.162.26.46:8082/postpidv3",
            url: "https://data2.makkhichoose.com/makkhitopfour",
            data: JSON.stringify(prodDeets),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            timeout: 3000,
        });

        reqSend.done(function(response) {
            console.log("postpid success");
            processBackEndData(response, prodDeets);
        });

        reqSend.fail(function() {
            // set aww show empty results
            console.log("postpid fail");
            $(mc_root).find("#preview_root").css("display", "none");
            hide_results_display_preview_min();
            $(mc_root).find("#preview_min_root #price").text("aww");
            $(mc_root).find("#preview_min_root #price").css("color", "gray");
            $(result_view).find("#price_results").append("<div style='text-align:center; position:relative; top:50px;'>sorry, we are most likely not tracking this product or category at the moment</div>")
            $("#mc_main_host").css("display", "block");

        });
    }
}
is_manual_bundle = false;

function processBackEndData(responseToProcess, prodDeetsToProcess) {
    var response = _.clone(responseToProcess);
    var prodDeets = _.clone(prodDeetsToProcess);

    if (response['isManualBundle']) {
        console.log('calling is manual bundle');
        is_manual_bundle = true;
    }


    chrome.storage.local.get({
        "auto_preview_display": true
    }, function(storage_response) {

        auto_preview_display_flag = storage_response.auto_preview_display;
        $(result_view).find('#auto_display_preview input:checkbox').prop('checked', storage_response.auto_preview_display);

        if (storage_response.auto_preview_display) {
            // do nothing
        } else {
            // display preview min
            $(mc_root).find("#preview_root").css("display", "none");
            // $(mc_root).find("#preview_min_root").css("display","block");
            hide_results_display_preview_min();
        }

        if (response['found']) {
            if (response["isDittory"] == true) {
                populateDittoryProducts(response, _.clone(prodDeets));
            } else {
                populateSimServerData(response, _.clone(prodDeets));
            }
        } else {
            // hide loading results
            // display toast
            prod_deets.request_finished = true;
            // set aww

            $(mc_root).find("#preview_root").css("display", "none");
            hide_results_display_preview_min();
            $(mc_root).find("#preview_min_root #price").text("aww");
            $(mc_root).find("#preview_min_root #price").css("color", "gray");
            $(result_view).find("#price_results").append("<div style='text-align:center; position:relative; top:50px;'>sorry, we are most likely not tracking this product or category at the moment</div>")
            $("#mc_main_host").css("display", "block");

        }

    });

}

function populateSimServerData(response, peodDeets) {
    var resultsArr = response['result'];
    var foundSites = [];
    for (var i = 0; i < resultsArr.length; i++) {
        // check title score
        // check old price (do back price if old)
        insert_price_result_box(make_results_box(resultsArr[i]));
    }

}


function setTrackerDeets() {

    console.log('mc: do we already have a Tracker?');
    return;
}


function checkTrackStatus(response) {

    if (response.status == 'tracking') {

        console.log('product in your kitty!');
        is_product_tracked = true;
        $(result_view).find(".track_button").removeClass("track");
        $(result_view).find(".track_button span:eq(0)").removeClass("fa fa-envelope");
        $(result_view).find(".track_button span:eq(0)").addClass("fa fa-heart");
        $(result_view).find(".track_button span:eq(1)").text("Wishlist");
        $(result_view).find(".track_button").attr("title", "You can see all the product you have been following by clicking here");

        // change preview_min button
        $(mc_root).find("#preview_min_root #pv_track_button #track_icon").removeClass('track');
        $(mc_root).find("#preview_min_root #pv_track_button #track_icon").css("color", "#82ceee");
        $(mc_root).find("#preview_min_root #pv_track_button").attr("title", "You can see all the product you have been following by clicking here");



    } else if (response.status == 'nottracking') {
        //console.log('product not being tracked, but others are!');
        is_product_tracked = false;

    } else if (response.status == 'empty') {
        console.log('product not being tracked!');
        is_product_tracked = false;
    }

    return true;
}

function is_price_old(site, time_elapsed_after_update) {
    return false;
}

function backPrice(result) {
    console.log("no matching backprice function found for " + result.website);

}


function back_search(prod_deets, website) {
    console.log("dping bs for ", website);
    if (website == "ub") {
        back_search_eb(prod_deets);
    } else if (website == "wm") {
        back_search_wm(prod_deets);
    } else if (website == "au") {
        back_search_au(prod_deets);
    } else if (website == "ta") {
        back_search_ta(prod_deets);
    } else if (website == "ne") {
        back_search_ne(prod_deets);
    } else if (website == "os") {
        back_search_os(prod_deets);
    } else if (website == "bb") {
        back_search_bb(prod_deets);
    } else if (website == "co") {
        back_search_co(prod_deets);
    } else if (website == "je") {
        back_search_je(prod_deets);
    } else if (website == "je") {
        back_search_je(prod_deets);
    } else if (website == "be") {
        back_search_be(prod_deets);
    } else if (website == "sb") {
        back_search_sb(prod_deets);
    } else if (website == "ab") {
        back_search_ab(prod_deets);
    } else if (website == "tk") {
        back_search_tk(prod_deets);
    } else if (website == "po") {
        back_search_po(prod_deets);
    } else if (website == "ak") {
        back_search_ak(prod_deets);
    } else {
        console.log("no matching backsearch function found for " + website);
    }
}

var back_search_sites = ['ub', 'wm', 'au', 'ta', 'ne', 'os', "bb", "co", "je", "be", "sb", "ab", "tk", "po", "ak","ae"];

function do_backsearch_and_get_results(prod_deets) {
    for (var i = 0; i < back_search_sites.length; i++) {
        if (prod_deets.prod_site != back_search_sites[i]) {
            back_search(prod_deets, back_search_sites[i]);
        }
    }
    //do back search on user added sites
    console.log("doing backsearch for user added sites");
    do_back_search_for_user_added_sites(prod_deets);
}

function do_back_search_for_user_added_sites(prod_deets) {
    console.log("in do_backsearch_and_get_results");
    console.log(prod_deets);
    chrome.storage.local.get({
        "user_added_sites": ""
    }, function(response) {
        if (response.user_added_sites) {
            if (response.user_added_sites.length > 0) {
                // fetch results for each site and display
                var user_added_sites = response.user_added_sites;
                for (var i = 0; i < user_added_sites.length; i++) {
                    if (user_added_sites[i]) {
                        if (user_added_sites[i].host_name != window.location.hostname) {
                            fetch_site_for_user_site(user_added_sites[i], prod_deets.prod_title);
                        }
                    } else {
                        // don't have js
                    }
                }
            } else {
                // do nothing
            }
        }

    });

    chrome.storage.local.get({
        "user_added_scripts": ""
    }, function(response) {
        if (response.user_added_scripts) {
            var user_added_scripts = response.user_added_scripts;
            for (var i = 0; i < user_added_scripts.length; i++) {
                // do bs for user added sites
                if (window.location.hostname != user_added_scripts[i]) {
                    console.log("doing bs with js on", prod_deets.prod_title);
                    do_bs_for_user_added_script(user_added_scripts[i], prod_deets.prod_title);
                }
            }
        } else {
            // no sites available do nothing
        }
    })

}


function do_bs_for_user_added_script(site, title) {
    var key_to_check = "ua_src" + "_" + site;
    var search_obj = {};
    search_obj[key_to_check] = "";
    console.log(search_obj);
    chrome.storage.local.get(search_obj, function(response) {
        if (response[key_to_check]) {
            // script available do 
            search_obj['method'] = "do_bs_with_js";
            search_obj['src_key'] = key_to_check;
            search_obj['site'] = site;
            search_obj['prod_title'] = title;


            chrome.runtime.sendMessage(search_obj, function(bs_response) {
                console.log(bs_response);
                // got response populate the response
                bs_response['is_found'] = true;
                if (bs_response["result_found"]) {
                    insert_price_result_box(make_results_box(bs_response, 'searchid', false));
                }

            })
        } else {

        }
    });
}


function fetch_site_for_user_site(deets, title_to_search) {
    //make search url
    // make request

    //from results obtained using css selectors

    //in price remove commas and decimals and currency symbols
    //for product link check if the url starts with http
    //for image link check for proper url format and http if it is required

    // use domain name in the place of site name 

    //format the required data 
    //use the existing functions to display the search results
    console.log("fetching user site");
    console.log(deets);

    var request_url = make_search_url_from_pattern(deets.search_url_pattern, deets.url_space_delimiter, title_to_search);
    console.log("fetch request url");
    console.log(request_url);

    var user_site_fetch_req = backPostGet({
        "type": "GET",
        "url": request_url,
    });

    user_site_fetch_req.done(function(response, b, c) {
        console.log("got results for user added site");
        console.log(deets);

        div = document.createElement("div");
        div.innerHTML = response;

        var first_result_element;
        var result_deets = {};
        if (div.querySelector(deets.first_elem_selector)) {
            first_result_element = $(div).find(deets.first_elem_selector + ":eq(0)");

            var title_select = $(first_result_element).find(deets.title + ":eq(0)");
            if (title_select.length > 0) {
                result_deets["title"] = $(title_select).text();
            } else {
                console.log("titile select element not found");
            }

            var image_select = $(first_result_element).find(deets.img_src + ":eq(0)");
            if (image_select.length > 0) {
                result_deets["image"] = $(image_select).attr("src");
            } else {
                console.log("image select element not found");
                var img_from_first_slector = get_img_src_from_result_selector(div, deets.first_elem_selector);
                if (img_from_first_slector) {
                    result_deets['image'] = img_from_first_slector;
                }
            }

            var price_select = $(first_result_element).find(deets.price + ":eq(0)");
            if (price_select.length > 0) {
                result_deets["price"] = $(price_select).text();
            } else {
                console.log("price select element not found");
            }

            var link_select = $(first_result_element).find(deets.link + ":eq(0)");
            if (link_select.length > 0) {
                result_deets["link"] = $(link_select).attr("href");
            } else {
                console.log("link select element not found");
                var link_from_first_slector = get_link_from_first_result_selector(div, deets.first_elem_selector);
                if (link_from_first_slector) {
                    result_deets['link'] = link_from_first_slector;
                }
            }

            console.log("got results");

            console.log(result_deets);

            //check if required deets are available 

            if (result_deets["title"] && result_deets["image"] && result_deets["price"] && result_deets["link"]) {
                //all deets are available display it on results
                var deets_to_display = {};

                deets_to_display['prod_link'] = make_valid_link_for_user_added_sites(result_deets["link"], deets.host_name);
                deets_to_display['title'] = result_deets["title"];
                deets_to_display['prod_price'] = process_price_for_user_added_site(result_deets["price"]);
                deets_to_display['website'] = deets.host_name;
                deets_to_display['prod_site'] = deets.host_name;
                deets_to_display['img_src'] = make_valid_link_for_user_added_sites(result_deets["image"], deets.host_name);
                deets_to_display['is_found'] = true;

                insert_price_result_box(make_results_box(deets_to_display, 'searchid', false));
            } else {
                // don't display anything 
            }

        } else {
            console.log("something is not working");
        }
    });

}

function get_link_from_first_result_selector(div, selector) {
    var first_result = $(div).find(selector);
    if ($(first_result).length > 0) {
        var link_element = $(first_result).find("a");
        if (link_element) {
            var link = $(link_element).attr("href");
            if (link) {
                return link;
            }
        }
    }
    return "";
}

function get_img_src_from_result_selector(div, selector) {
    var first_result = $(div).find(selector);
    if ($(first_result).length > 0) {
        var img_element = $(first_result).find("img");
        if (img_element) {
            var link = $(img_element).attr("src");
            if (link) {
                return link;
            }
        }
    }
    return "";
}

function make_valid_link_for_user_added_sites(link, host_name, settings) {
    // add info whthere to add host_name or not
    if (link.startsWith("//")) {
        console.log("url sratrts with //");
        link = "http:" + link;
    } else if (!link.startsWith("http")) {
        link = "http://" + host_name + "/" + link;
    }
    return link;
}

function process_price_for_user_added_site(price, settings) {
    // make settings to remove things like comma and dot symbols
    var price_modified = price.replace(/[^\d^.^,]/g, "");
    return price_modified;
}


function title_filter(product_page_title, search_result_title) {
    var ppt_words_array = product_page_title.split(" ");
    var ppt_split_pos = ppt_words_array.length / 2;
    var ppt_1st_half = ppt_words_array.slice(0, ppt_split_pos);
    var ppt_2nd_half = ppt_words_array.slice(ppt_split_pos);


    var srt_words_array = search_result_title.split(" ");
    var srt_split_pos = srt_words_array.length / 2;
    var srt_1st_half = srt_words_array.slice(0, srt_split_pos);
    var srt_2nd_half = srt_words_array.slice(srt_split_pos);

    var first_half_ok = false;
    var second_half_ok = false;

    if (ppt_words_array.length == 1 && srt_words_array.length == 1) {
        if (product_page_title.toLowerCase() == search_result_title.toLowerCase()) {
            return true;
        }
    }

    for (var i = 0; i < ppt_1st_half.length; i++) {
        if (srt_1st_half.indexOf(ppt_1st_half[i]) > -1) {
            first_half_ok = true;
            break;
        }
    }
    for (var i = 0; i < ppt_2nd_half.length; i++) {
        if (srt_2nd_half.indexOf(ppt_2nd_half[i]) > -1) {
            second_half_ok = true;
            break;
        }
    }
    return first_half_ok && second_half_ok;
}