$(document).ready(function() {

    $("body").on("click", ".remove_site", function() {
        console.log("in remove_site click process");
        var selected_inputs = $("#site_list input:checked");
        if (selected_inputs.length > 0) {
            console.log("selected sites found");
            var sites_to_remove = [];
            for (var i = 0; i < selected_inputs.length; i++) {
                var site_host_name = $(selected_inputs[i]).parent().attr('title');
                sites_to_remove.push(site_host_name);
                // $(selected_inputs[i]).parent().parent().remove();

            }
            chrome.storage.local.get({
                "user_added_sites": "",
                "user_added_sites_pp": {}
            }, function(response) {
                var user_added_sites = [];
                if (response.user_added_sites) {
                    user_added_sites = response.user_added_sites;
                    var sites_to_write = [];
                    for (var i = 0; i < user_added_sites.length; i++) {
                        var site = user_added_sites[i].host_name;
                        if (sites_to_remove.indexOf(site) > -1) {
                            // don't add it to list
                        } else {
                            sites_to_write.push(user_added_sites[i]);
                        }
                    }

                    var user_added_sites_pp = response.user_added_sites_pp;

                    var user_added_sites_pp_to_write = {};

                    for (var i = 0; i < sites_to_write.length; i++) {
                        var site = sites_to_write[i].hostname;

                        user_added_sites_pp_to_write[site] = user_added_sites_pp[site];

                    }

                    chrome.storage.local.set({
                        "user_added_sites": sites_to_write,
                        "user_added_sites_pp": user_added_sites_pp_to_write
                    }, function() {
                        update_user_added_sites_view();
                        $.toast('sites removed successfully');
                    });

                }
            });
        } else {
            $.toast("please select site site to remove")
        }
    });

    $("body").on("click", ".remove_site_script", function() {
        console.log("in remove_site click process");
        var selected_inputs = $("#site_script_list input:checked");
        if (selected_inputs.length > 0) {
            console.log("selected sites found");
            var sites_to_remove = [];
            for (var i = 0; i < selected_inputs.length; i++) {
                var site_host_name = $(selected_inputs[i]).parent().attr('title');
                sites_to_remove.push(site_host_name);
                // $(selected_inputs[i]).parent().parent().remove();

            }

            console.log(sites_to_remove);

            chrome.storage.local.get({
                "user_added_scripts": ""
            }, function(response) {
                var user_added_scripts = [];
                if (response.user_added_scripts) {
                    user_added_scripts = response.user_added_scripts;
                    var sites_to_write = [];
                    for (var i = 0; i < user_added_scripts.length; i++) {
                        var site = user_added_scripts[i];
                        if (sites_to_remove.indexOf(site) > -1) {
                            // don't add it to list
                        } else {
                            sites_to_write.push(user_added_scripts[i]);
                        }
                    }

                    var script_keys = [];

                    for (var i = 0; i < sites_to_remove.length; i++) {
                        var key = "ua_src_" + sites_to_remove[i];
                        var key1 = "ua_src_pp_" + sites_to_remove[i];
                        script_keys.push(key);
                        script_keys.push(key1);
                    }

                    console.log(sites_to_remove);
                    console.log(sites_to_write);
                    console.log(script_keys);

                    chrome.storage.local.set({
                        "user_added_scripts": sites_to_write
                    }, function() {
                        chrome.storage.local.remove(script_keys, function() {
                            update_user_added_script_sites_view();
                            $.toast('sites removed successfully');
                        });
                    });

                }
            });

        } else {
            $.toast("please select site site to remove")
        }
    });



    init();

    chrome.storage.local.get({
        "add_site_deets": ""
    }, function(storage_response) {
        if (storage_response.add_site_deets) {
            show_stop_adding_site();
            $(".site_being_added").text(storage_response.add_site_deets.hostname + " ");
        } else {
            get_domain_from_user();
        }
    });

});



function get_domain_from_user() {
    var template = document.querySelector("#get_domain").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function show_stop_adding_site() {
    var template = document.querySelector("#site_being_added").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function ask_user_to_search() {
    var template = document.querySelector("#ask_user_for_search").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function get_method_from_user() {
    var template = document.querySelector("#add_option_container").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function get_js_from_user() {
    var template = document.querySelector("#file_upload").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}


function get_js_pp_from_user() {
    var template = document.querySelector("#file_upload_pp").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function get_js_test_from_user() {
    var template = document.querySelector("#user_script_test").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);

}


function display_loading() {
    var template = document.querySelector("#loading").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function display_test_results(result) {
    if (result.result_found) {
        // display the results
        var template = document.querySelector("#test_results").content;
        var elem = template.cloneNode(true);

        elem.querySelector(".title_text").textContent = result.title;

        elem.querySelector(".price_text").textContent = result.prod_price;

        elem.querySelector(".image_text a").textContent = result.img_src;
        elem.querySelector(".image_text a").setAttribute("href", result.img_src);

        elem.querySelector(".image_container img").setAttribute("src", result.img_src);

        elem.querySelector(".res_link a").textContent = result.prod_link;
        elem.querySelector(".res_link a").setAttribute("href", result.prod_link);



        document.querySelector("#disp_div").innerHTML = "";
        document.querySelector("#disp_div").appendChild(elem);


    } else {
        // display warning message
        var template = document.querySelector("#no_results_found_on_test").content;
        var elem = template.cloneNode(true);
        document.querySelector("#disp_div").innerHTML = "";
        document.querySelector("#disp_div").appendChild(elem);
    }
}

function populate_user_added_sites(user_added_sites) {
    var listing_template_main = document.querySelector("template#site_listing").content;

    if (user_added_sites.length > 0) {
        $("#site_list .no_sites_msg").hide();
    }
    for (var i = 0; i < user_added_sites.length; i++) {
        var listing_template = listing_template_main.cloneNode(true);
        listing_template.querySelector("label").textContent = user_added_sites[i].host_name;
        listing_template.querySelector(".contnent_div").setAttribute("title", user_added_sites[i].host_name);

        $(".site_listing_container .list").append(listing_template.cloneNode(true));
    }
}


function populate_user_added_script_sites(user_added_sites) {
    var listing_template_main = document.querySelector("template#site_listing").content;

    if (user_added_sites.length > 0) {
        $("#site_script_list .no_sites_msg").hide();
    }
    for (var i = 0; i < user_added_sites.length; i++) {
        var listing_template = listing_template_main.cloneNode(true);
        listing_template.querySelector("label").textContent = user_added_sites[i];
        listing_template.querySelector(".contnent_div").setAttribute("title", user_added_sites[i]);

        $(".script_site_listing_container .list").append(listing_template.cloneNode(true));
    }
}

function update_user_added_sites_view() {
    chrome.storage.local.get({
        "user_added_sites": ""
    }, function(response) {
        if (response.user_added_sites) {
            $(".site_listing_container .list").empty();
            if (response.user_added_sites.length > 0) {
                populate_user_added_sites(response.user_added_sites);
            } else {
                $("#site_list .no_sites_msg").show();
            }
        }
    });
}


function update_user_added_script_sites_view() {
    chrome.storage.local.get({
        "user_added_scripts": ""
    }, function(response) {
        if (response.user_added_scripts) {
            $(".script_site_listing_container .list").empty();
            if (response.user_added_scripts.length > 0) {
                populate_user_added_script_sites(response.user_added_scripts);
                $("#site_script_list").show();
            } else {
                $("#site_script_list").hide();
            }

        }
    });

}

function show_script_added_msg() {
    var template = document.querySelector("#script_added_msg").content;
    var elem = template.cloneNode(true);
    document.querySelector("#disp_div").innerHTML = "";
    document.querySelector("#disp_div").appendChild(elem);
}

function init() {


    update_user_added_sites_view();

    update_user_added_script_sites_view();


    $("body").on("click", "#get_url_button", function(e) {
        console.log("found button click");
        var url = $("#get_url_input").val();
        //validate url
        if (!(url && isUrl(url))) {
            $.toast("Enter a valid url")
            return;
        } else {
            console.log("valid url");
            var link = document.createElement("a");
            link.href = url;
            console.log(link.hostname);

            chrome.storage.local.get({
                "add_site_deets": "",
                "user_added_sites": "",
                "user_added_scripts": []
            }, function(response) {
                if (response) {
                    console.log("got response");
                    console.log(response);
                    if (response.add_site_deets.hostname == link.hostname) {
                        console.log("host is being added");
                        $.toast(link.hostname + " is being added currently");
                        return;
                    } else if (response && response.user_added_sites) {
                        var user_added_sites = response.user_added_sites;

                        var host_name_exist = false;
                        for (var i = 0; i < user_added_sites.length; i++) {
                            console.log(user_added_sites[i].hostname);
                            if (user_added_sites[i].host_name == link.hostname) {
                                host_name_exist = true;
                                break;
                            } else {
                                console.log(user_added_sites[i].host_name, " is not equal to ", link.host_name);
                            }
                        }

                        if (response.user_added_scripts.indexOf(link.hostname) > -1) {
                            host_name_exist = true;

                        } else {
                            console.log("link name does not exist ", link.hostname);
                            console.log(response.user_added_scripts);
                        }


                        if (host_name_exist) {
                            $.toast(link.hostname + "is already added, pls remove it in the list below to add it again");
                            return;
                        } else {
                            chrome.storage.local.set({
                                "add_site_deets": {
                                    "hostname": link.hostname,
                                    "state": "waiting_for_user_search",
                                }
                            }, function() {
                                console.log("asking user to search");
                                //display the text, once the user clicks ok take him to the site and let him search with the given phrase
                                // ask_user_to_search();
                                get_method_from_user();
                            });
                        }
                    } else if (response && response.user_added_scripts && response.user_added_scripts.indexOf(link.hostname) > -1) {

                        $.toast(link.hostname + "is already added, pls remove it in the list below to add it again");
                        return;


                    } else if (response && !response.user_added_sites && !response.add_site_deets) {

                        chrome.storage.local.set({
                            "add_site_deets": {
                                "hostname": link.hostname,
                                "state": "waiting_for_user_search",
                            }
                        }, function() {
                            console.log("asking user to search");
                            //display the text, once the user clicks ok take him to the site and let him search with the given phrase
                            // ask_user_to_search();
                            get_method_from_user();
                        });


                    }
                } else {
                    console.log("no response found");
                }

            });


        }
    });

    $("body").on("click", "#ask_user_for_search_ok_button", function(e) {
        console.log("user clicked ok while asking for search");
        chrome.storage.local.get({
            "add_site_deets": ""
        }, function(response) {
            if (response.add_site_deets) {
                var link = response.add_site_deets.hostname;
                if (!link.startsWith("http")) {
                    link = "http://" + link;
                }
                window.open(link);
                window.close();
            }
        })
    });


    $("body").on("change", "input#js_upload", function(e) {
        var file = this.files[0];
        console.log(file);
        js_upload_handle(file);

    });

    $("body").on("change", "input#js_upload_pp", function(e) {
        var file = this.files[0];
        console.log(file);
        js_upload_pp_handle(file);

    });

    $("body").on("click", ".js_up_button", function(e) {
        // show js up menu
        chrome.storage.local.get({
            "add_site_deets": {}
        }, function(response) {
            var add_site_deets = response.add_site_deets;
            if (add_site_deets['state']) {
                add_site_deets['state'] = "getting_js_from_user"
                chrome.storage.local.set()
            }
        });


        console.log("js up menu display");
        get_js_from_user();
    });

    $("body").on("click", ".guide_button", function(e) {
        // show guide menu
        console.log("guide add menu display");
        ask_user_to_search();
    });

    $("body").on("click", "#test_script_button", function() {
        // do the test and display the results
        var title = "";

        title = $("#test_script_input").val();

        chrome.storage.local.get({
            "add_site_deets": ""
        }, function(response) {
            if (response.add_site_deets) {
                var add_site_deets = response.add_site_deets;
                display_loading();
                chrome.runtime.sendMessage({
                    "method": "test_js_with_title",
                    "prod_title": title,
                    "site": add_site_deets.host_name
                }, function(src_response) {
                    console.log(src_response);
                    display_test_results(src_response);
                });
            }
        });

    });

    $("body").on("click", "#add_current_script", function() {
        // add_current_script
        chrome.storage.local.get({
            "add_site_deets": "",
            "curr_user_added_script_ss": "",
            "user_added_scripts": ""
        }, function(src_read_resp) {
            if (src_read_resp["add_site_deets"] && src_read_resp["curr_user_added_script_ss"]) {
                var add_site_deets = src_read_resp["add_site_deets"];
                var src = src_read_resp["curr_user_added_script_ss"];

                var curr_site = add_site_deets['hostname'];

                var script_store_key = "ua_src_" + curr_site;

                var user_added_scripts = [];
                if (src_read_resp["user_added_scripts"]) {
                    user_added_scripts = src_read_resp["user_added_scripts"];
                }

                if (!(user_added_scripts.indexOf(curr_site) > -1)) {
                    user_added_scripts.push(curr_site);
                }

                var src_obj = {};
                src_obj[script_store_key] = src;

                chrome.storage.local.set({
                    "user_added_scripts": user_added_scripts
                }, function(response) {
                    chrome.storage.local.set(src_obj);
                    get_js_pp_from_user();
                    // chrome.storage.local.remove("add_site_deets");
                    // update_user_added_script_sites_view();
                    // // show msg saying site has been added 
                    // show_script_added_msg();
                });


            }
        })

    });

    $("body").on("click", "#test_with_new_phrase", function() {
        // test_with_new_phrase
        get_js_test_from_user();
    });

    $("body").on("click", "#upload_new_script", function() {
        // upload_new_script
        get_js_from_user();
    });

    $("body").on("click", "#script_added_ok", function(e) {
        // window.close();
        get_domain_from_user();
    })

    $("body").on("click", "#stop_adding_site", function(e) {
        chrome.storage.local.remove(["add_site_deets"], function() {
            get_domain_from_user();
        });
    });

}

var f = "";

function js_upload_handle(file) {
    if (file.size) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            var file_bin_string = e.target.result;
            console.log(file_bin_string);
            //use the string for further processing

            chrome.storage.local.get({
                "add_site_deets": ""
            }, function(response) {
                var add_deets = "";
                if (response.add_site_deets) {
                    add_deets = response.add_site_deets;
                    add_deets['state'] = 'user_js_upload';


                    // chrome.storage.local.set({"user_added_scripts":""},function(script_read_resp){
                    // 	var user_added_scripts = {};
                    // 	if(!user_added_scripts){
                    // 		user_added_scripts = script_read_resp['user_added_scripts'];
                    // 	}
                    // 	user_added_scripts[add_deets.hostname] = file_bin_string;

                    // 	chrome.storage.local.set({"user_added_scripts":user_added_scripts},function(){
                    // 		// saved the script do other things from here
                    // 	});

                    // });

                    chrome.storage.local.set({
                        "curr_user_added_script_ss": file_bin_string
                    }, function(script_read_resp) {
                        // saved the script do other things from here
                        // display the test ui (ask user for test title, run the script and get feedback);
                        get_js_test_from_user();
                    });

                }
            });

        }
    }
}



function js_upload_pp_handle(file) {
    if (file.size) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
            var file_bin_string = e.target.result;
            console.log(file_bin_string);
            //use the string for further processing

            chrome.storage.local.get({
                "add_site_deets": ""
            }, function(response) {
                var add_deets = "";
                if (response.add_site_deets) {
                    add_deets = response.add_site_deets;
                    add_deets['state'] = 'user_js_upload';

                    var key = 'ua_src_pp_' + add_deets.hostname;
                    var obj_to_store = {};
                    obj_to_store[key] = file_bin_string;

                    chrome.storage.local.set(obj_to_store, function(script_read_resp) {
                        chrome.storage.local.remove("add_site_deets");
                        update_user_added_script_sites_view();
                        // show msg saying site has been added 
                        show_script_added_msg();

                    });

                }
            });

        }
    }
}


function size_in_words_format(size_in_bytes) {
    var nBytes = size_in_bytes;
    var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    var nMultiple = 0;
    var iter_start = true;
    var nApprox = nBytes / 1024;
    var sOutput = "";
    nApprox = nBytes / 1024;
    while (1) {
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
        if (!(nApprox > 1)) {
            break;
        }
        nApprox /= 1024;
        nMultiple++;
    }

    var fin_data = "";
    fin_data = {
        "size_pf": nApprox.toFixed(3),
        "size_sf": aMultiples[nMultiple],
        "size_in_bytes": nBytes,
        "size_strings": nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)",
    }

    return fin_data;
}