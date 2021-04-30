function back_search_wm(prod_deets) {
	var searchURL = 'https://www.walmart.com/search/?query=' + encodeURIComponent(prod_deets.prod_title);
	var dyn_req = backPostGet({
		type: 'GET',
		url: searchURL
	});
	dyn_req.done(function(response) {
		var extracted_deets = extract_result(response);
		console.log(extracted_deets);
		if (extracted_deets.is_found && title_filter(prod_deets.prod_title, extracted_deets.title)) {
			insert_price_result_box(make_results_box(extracted_deets, 'searchid', false));
		} else {
			insert_manual_search_box(
				make_manual_search_box(
					{
						prod_site: 'wm',
						prod_link: searchURL,
						website: 'walmart',
						title: prod_deets.prod_title,
						img_src: prod_deets.prod_img
					},
					'searchid'
				)
			);
		}
	});

	function extract_result(response) {
		var resp_elem_wm = $('<div/>').append($.parseHTML(response));
		response_from_wm = resp_elem_wm;
		var deets = {};
		if ($(resp_elem_wm).find('#searchProductResult .product-title-link').attr('aria-label')) {
			try {
				var resPrice = $(resp_elem_wm).find('#searchProductResult .Price-group').attr('aria-label');
				if (!resPrice) {
					resPrice = $(resp_elem_wm).find('#searchProductResult .price-group').attr('aria-label');
				}
				if (resPrice) {
					resPrice = resPrice.replace(/[$,]/g, '');
				}
				deets['prod_link'] =
					'https://www.walmart.com' +
					$(resp_elem_wm).find('#searchProductResult .product-title-link').attr('href');
				deets['title'] = $(resp_elem_wm).find('#searchProductResult .product-title-link').attr('aria-label');
				deets['prod_price'] = resPrice;
				deets['website'] = 'wm';
				deets['prod_site'] = 'wm';
				if ($(resp_elem_wm).find('#searchProductResult .search-result-productimage').length > 0) {
					deets['img_src'] = $(resp_elem_wm)
						.find('#searchProductResult .search-result-productimage img')
						.attr('src');
				} else if ($(resp_elem_wm).find('#searchProductResult .Tile-img').length > 0) {
					deets['img_src'] = $(resp_elem_wm).find('#searchProductResult .Tile-img').attr('src');
				}
				deets['is_found'] = true;
			} catch (err) {
				deets['is_found'] = false;
			}
		} else if ($(resp_elem_wm).find('.search-result-listview-items').length > 0) {
			try {
				var results = resp_elem_wm.find('.search-result-listview-items div');
				var firstResult = results[0];
				var resData = {};
				var prod_link = $($(firstResult).find('.product-title-link')).attr('href');
				var resLink = 'https://www.walmart.com' + prod_link;
				var resImage = $($(firstResult).find('.search-result-productimage img')).attr('src');
				var resTitle = $($(firstResult).find('.product-title-link')).text().trim();
				var resPrice = $($(firstResult).find('.price-main .visuallyhidden')).text().trim();
				resPrice = parseFloat(resPrice.replace(/[$,]/g, ''));
				deets['prod_link'] = resLink;
				deets['title'] = resTitle;
				deets['prod_price'] = resPrice;
				deets['website'] = 'wm';
				deets['prod_site'] = 'wm';
				deets['img_src'] = resImage;
				deets['is_found'] = true;
			} catch (err) {
				deets['is_found'] = false;
			}
		}
		if (!(deets['prod_link'] && deets['title'] && deets['prod_price'] && deets['website'])) {
			deets['is_found'] = false;
		}
		return _.clone(deets);
	}
}
