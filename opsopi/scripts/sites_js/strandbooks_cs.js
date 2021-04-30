var page_load_check_timer = '';
var page_url_check_timer = '';
var page_old_url = window.location.href;

var old_img = '';

function page_task() {
	console.log('target page task');
	if (window.location.href.match('/product/')) {
		var img = getPageDeets().prod_img;
		var price = getPageDeets().prod_price;
		if (img != '' && old_img != img && price) {
			old_img = img;
			update_data_for_spa(getPageDeets());
		} else {
			setTimeout(function() {
				page_task();
			}, 1000);
		}
	} else {
	}
}

function page_url_change_checker() {
	if (page_url_check_timer) {
		window.clearTimeout(page_url_check_timer);
	}
	if (page_old_url != window.location.href) {
		page_old_url = window.location.href;
		page_url_check_timer = setTimeout(page_url_change_checker, 1000);
		$('#mc_main_host').remove();
		page_task();
	} else {
		page_old_url = window.location.href;
		page_url_check_timer = setTimeout(page_url_change_checker, 1000);
	}
}

function getPageDeets() {
	function getProdTitle() {
		var title = $.trim($('.singleproductpage-item-title__h1').text());
		title = title ? title : '';
		return title;
	}

	function getCategoryFromCrumbs() {
		var breadcrumb_list = $('a.js-breadCrumb');
		var crumbs = '';
		crumbs = crumbs ? crumbs : '';
		return crumbs;
	}

	function getProdPrice() {
		var price = parseFloat(
			$('.singleproductpage-item-detail-prices__div .singleproductpage-item-detail__p:eq(0)')
				.text()
				.replace(/[$,\s]/g, '')
		);
		price = price ? price : '';
		return price;
	}

	function getProductId() {
		var pid = '';
		if ($(".singleproductpage-item-more__div .singleproductpage-item-more__p:contains('ISBN-10')").text()) {
			pid = $(".singleproductpage-item-more__div .singleproductpage-item-more__p:contains('ISBN-10')")
				.text()
				.replace('ISBN-10:', '');

			pid = $.trim(pid);
		}
		return pid ? pid : '';
	}

	function getProductImage() {
		var imageSrc = $('.singleproductpage-item-image__img').attr('src');
		return imageSrc ? imageSrc : '';
	}

	function getOOSstate() {
		return false;
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
			prod_site: 'sb',
			prod_mrp: getProdPrice(),
			is_oos: getOOSstate(),
			backsearch_site: true
		};
		return pageDeets;
	}
	return getDeets();
}
if (window.location.href.match('strandbooks.com')) {
	page_url_change_checker();
	if (window.location.href.match('/product/')) {
		page_task();
	}
}
