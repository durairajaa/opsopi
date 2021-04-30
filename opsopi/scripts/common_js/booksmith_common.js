function back_search_bs(prod_deets) {
	var search_term = prod_deets.prod_title;
	if (prod_deets.book_page) {
		search_term = prod_deets.prod_srch;
	}
	if (!prod_deets.book_page) {
		return;
	}
	var searchURL = 'https://www.booksmith.com/search/site/' + encodeURIComponent(search_term);
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
						prod_site: 'bs',
						prod_link: searchURL,
						website: 'booksmith',
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
		var deets = {};
		if (resp_elem_wm.find('.search-results').length > 0) {
			try {
				var results = resp_elem_wm.find('.search-result:eq(0)');
				var firstResult = results[0];
				var resData = {};
				var path = $($(firstResult).find('h3.title a')).attr('href');
				var resLink = 'https://www.booksmith.com' + path;
				var resImage = $($(firstResult).find('.abaproduct-image img')).attr('src');
				var resTitle = $($(firstResult).find('h3.title')).text().trim();
				var resPrice = $($(firstResult).find('.abaproduct-details h3')).text().trim();
				resPrice = parseFloat(resPrice.replace(/[$,]/g, ''));
				deets['prod_link'] = resLink;
				deets['title'] = resTitle;
				deets['prod_price'] = resPrice;
				deets['website'] = 'bs';
				deets['prod_site'] = 'bs';
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
