function back_search_sb(prod_deets) {
	var search_term = prod_deets.prod_title;

	if (prod_deets.book_page) {
		search_term = prod_deets.prod_srch;
	}

	var searchURL =
		'https://www.strandbooks.com/search-results?searchVal=' + encodeURIComponent(search_term) + '&type=product';
	var dyn_req = backPostGet({
		type: 'post',
		url: 'https://www-api.strandbooks.com/api',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({
			operationName: 'search',
			variables: { searchTerm: 'ikigai' },
			query:
				'query search($searchTerm: String, $order: OrderCommonIn, $filter: FilterCommonIn) {\n  searchProductResult(searchTerm: $searchTerm, order: $order, filter: $filter) {\n    param {\n      searchTerm\n      __typename\n    }\n    productList {\n      copyright\n      gtin13\n      imageUrl\n      bookBinding\n      bookFormat\n      retailPrice\n      inventory {\n        salePriceStv\n        catalogId\n        onHand\n        sku\n        __typename\n      }\n      apparel {\n        apparelId\n        size\n        inventory {\n          catalogId\n          condition\n          sku\n          onHand\n          salePriceStv\n          __typename\n        }\n        __typename\n      }\n      isbn10\n      originator\n      outOfPrint\n      publisher\n      rank\n      title\n      id\n      __typename\n    }\n    __typename\n  }\n  searchOriginator(searchTerm: $searchTerm) {\n    card\n    originator\n    rank\n    __typename\n  }\n  searchProductKeyword(searchTerm: $searchTerm) {\n    copyright\n    gtin13\n    imageUrl\n    isbn10\n    originator\n    outOfPrint\n    publisher\n    rank\n    title\n    id\n    __typename\n  }\n  searchSection(searchTerm: $searchTerm) {\n    rank\n    section\n    __typename\n  }\n}\n'
		})
	});
	dyn_req.done(function(response) {
		var extracted_deets = extract_result(response);
		if (extracted_deets.is_found && title_filter(prod_deets.prod_title, extracted_deets.title)) {
			insert_price_result_box(make_results_box(extracted_deets, 'searchid', false));
		} else {
			// nothing found
			// insert manual search
			insert_manual_search_box(
				make_manual_search_box(
					{
						prod_site: 'sb',
						prod_link: searchURL,
						website: 'strandbooks',
						title: prod_deets.prod_title,
						img_src: prod_deets.prod_img
					},
					'searchid'
				)
			);
		}
	});

	function extract_result(response) {
		var deets = {};
		var data = {};
		if (response.data) {
			data = response.data;
		}
		if (
			data.searchProductResult &&
			data.searchProductResult.productList &&
			data.searchProductResult.productList.length > 0
		) {
			var result = data.searchProductResult.productList[0];
			var product_id = result.id;
			deets['prod_link'] = 'https://www.strandbooks.com/product/' + product_id;
			deets['title'] = result.title;
			deets['prod_price'] = result.retailPrice / 100;
			deets['website'] = 'sb';
			deets['prod_site'] = 'strandbooks';
			deets['img_src'] = result.imageUrl;
			deets['is_found'] = true;
		}
		console.log('strand deets');
		console.log(deets);
		console.log(response);
		if (!(deets['prod_link'] && deets['title'] && deets['prod_price'] && deets['website'])) {
			deets['is_found'] = false;
		}
		return _.clone(deets);
	}
}
