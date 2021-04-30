function isProductPage() {
	if (window.location.href.match('/book/')) {
		return true;
	} else {
		return false;
	}
}

function getPageDeets() {
	function getProdTitle() {
		var title = $('h1.page-title').text();
		title = title ? title : '';
		return title;
	}

	function getCategoryFromCrumbs() {
		var crumbs = '';
		crumbs = crumbs ? crumbs : '';
		return crumbs;
	}

	function getProdPrice() {
		var price = '';
		price = $('.abaproduct-price').text().replace(/[\s$,]/g, '');
		price = parseFloat(price);
		price = price ? price : '';
		return price;
	}

	function getProductId() {
		var product_id = '';
		if (window.location.pathname.split('/').length >= 3) {
			product_id = window.location.pathname.split('/')[2];
		}
		var pid = '';
		if (product_id) {
			pid = product_id;
		}
		return pid ? pid : '';
	}

	function getProductImage() {
		var imageSrc = $('#imageBlock img#landingImage').attr('src');
		return imageSrc ? imageSrc : '';
	}

	function getOOSstate() {
		return false;
	}

	function isBookPage() {
		var isbn_text = '';
		if ($("li:contains('ISBN-13')").length > 0) {
			if ($("li:contains('ISBN-13')").text().split('ISBN-13:').length > 0) {
				isbn_text = $.trim($("li:contains('ISBN-13')").text().split('ISBN-13:')[1]).replace('-', '');
			}
		}
		if (isbn_text) {
			return true;
		}
	}

	function getISbn() {
		var isbn_text = '';
		if ($("li:contains('ISBN-13')").length > 0) {
			if ($("li:contains('ISBN-13')").text().split('ISBN-13:').length > 0) {
				isbn_text = $.trim($("li:contains('ISBN-13')").text().split('ISBN-13:')[1]).replace('-', '');
				return isbn_text;
			}
		}
		return '';
	}

	function getDeets() {
		var pageDeets = {
			prod_title: getProdTitle(),
			prod_categ: getCategoryFromCrumbs(),
			prod_price: getProdPrice(),
			prod_link: window.location.href,
			prod_srch: getProdTitle(),
			product_id: getProductId(),
			prod_img: getProductImage(),
			prod_site: 'bs',
			prod_mrp: getProdPrice(),
			is_oos: getOOSstate(),
			backsearch_site: true
		};
		if (isBookPage()) {
			pageDeets['book_page'] = true;
			pageDeets['prod_srch'] = getISbn();
		}
		return pageDeets;
	}
	return getDeets();
}
if (isProductPage()) {
	update_data_for_spa(getPageDeets());
}
