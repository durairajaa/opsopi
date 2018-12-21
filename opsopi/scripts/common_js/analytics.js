var isDevUse = true;

if (!isDevUse) {
    console.log = function() {};
}

jQuery.fn.extend({
    getPath: function() {
        var path, node = this;
        while (node.length) {
            var realNode = node[0],
                name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) {
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

function trackMakkhiboxDisplay(prod_site) {}


function sendsearchIntent(site, value) {
    var deets_obj = {};

}

function sendcartevent(site, button_name, product_id, location, title) {

}



function send_sd_match(link) {

    var id_val = "";
    if (link == "") {
        // console.log("%c manual search","color:red;font-size:large");        
    } else {
        id_val = link.split('/').pop().split('?')[0];
        id_val = id_val.match(/^\d+/gim)[0];
    }
}



function send_copied_coupon(coupon) {
    try {
        var page_pid = "";
        if (typeof prod_deets != "undefined") {

            page_pid = prod_deets.product_id;
        }

        var deets_obj = {};
    } catch (err) {
        console.log(err);
    }
}


function is_smart_makkhi(pid) {
    return true;
}