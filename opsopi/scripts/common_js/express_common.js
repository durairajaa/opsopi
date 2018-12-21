function back_price_ex(result_from_backend) {
    // insert_price_result_box(make_results_box(result_from_backend,'',false));

    // var link = result_from_backend['link'];
    var product_id = result_from_backend['pid']
    if (product_id.match('__')) {
        product_id = product_id.split('__')[0];
    }
    var query = {
        "query": "query ProductQuery($productId: String!) {\n  product(id: $productId) {\n    collection\n    crossRelDetailMessage\n    crossRelProductURL\n    fabricCare\n    gender\n    internationalShippingAvailable\n    listPrice\n    name\n    onlineExclusive\n    onlineExclusivePromoMsg\n    productDescription {\n      type\n      content\n      __typename\n    }\n    productId\n    productImage\n    productInventory\n    productURL\n    promoMessage\n    recsAlgorithm\n    salePrice\n    breadCrumbCategory {\n      categoryName\n      h1CategoryName\n      links {\n        rel\n        href\n        __typename\n      }\n      breadCrumbCategory {\n        categoryName\n        h1CategoryName\n        links {\n          rel\n          href\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    colorSlices {\n      color\n      defaultSlice\n      ipColorCode\n      swatchURL\n      imageMap {\n        LARGE\n        __typename\n      }\n      skus {\n        displayMSRP\n        displayPrice\n        skuId\n        sizeName\n        inventoryMessage\n        onlineInventoryCount\n        inStoreInventoryCount\n        sizeExtension1\n        sizeExtension2\n        __typename\n      }\n      __typename\n    }\n    relatedProducts {\n      listPrice\n      name\n      productId\n      productImage\n      productURL\n      salePrice\n      __typename\n    }\n    __typename\n  }\n  reviewStats(id: $productId) {\n    totalReviewCount\n    averageOverallRating\n    __typename\n  }\n}\n",
        "variables": {
            "productId": product_id
        },
        "operationName": "ProductQuery"
    }

    var back_price_req = backPostGet({
        type: "POST",
        // url: "http://shades.makkhichoose.com/dorecomb",
        url: "https://www.express.com/graphql",
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 3500,
    });

    back_price_req.done(function(response) {
        var resp_elem = response;
        var price = "";
        price = get_price(resp_elem);
        if (price) {
            // insert product
            console.log("express price found");
            result_from_backend['prod_price'] = price;
            if (result_from_backend.is_dittory) {
                // console.log("target price found");
                insertDittoryProduct(result_from_backend);
            } else {
                insert_price_result_box(make_results_box(result_from_backend, '', false));
            }
        } else {
            // price not found do something
            console.log("express price not found");
            if (result_from_backend.is_dittory) {
                // console.log("price found");
                insertDittoryProduct(result_from_backend);
            } else {
                insert_price_result_box(make_results_box(result_from_backend, '', false));
            }
        }
    });

    function get_price(deets) {
        var price = "";
        console.log(deets);
        if (deets.product.price) {
            if (deets.product.price.offerPrice) {
                price = deets.product.price.offerPrice.price;
            } else if (deets.product.price.listPrice) {
                price = deets.product.price.listPrice.price;
            }
        }
        price = price ? price : "";
        return price;
    }
}