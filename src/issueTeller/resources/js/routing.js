import page from 'page';
import $ from 'jquery';
import Constants from './constant';
import Axios from 'axios';

if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

const closeAll = () => {
	$('.wrapper')
		.children()
		.hide();
};

const hideAll = (context, next) => {
	closeAll();
	next();
};

const openPage = ($page, topPos = 0) => {
	$page.show();
	window.scrollTo(0, topPos);
};

const write = () => {
	const $write = $('.write_form');
	openPage($write);
};

const main = (context, next) => {
	const $main = $('.main-sec');
	openPage($main, window.sessionStorage.getItem('prevScroll'));
};

const notfound = context => {
	console.log(context);
	console.log('page not founded!!!');
};

const setScrollPos = (context, next) => {
	window.sessionStorage.setItem('prevScroll', $(window).scrollTop());
	next();
};

const loadDetailData = async (context, next) => {
	try {
		const result = await Axios.get(Constants.URL_READ_DETAIL_DATA, {
			params: {
				writing_no: context.params.id
			}
		});
		context.data = result.data;
		await next();

		console.log('상세 데이터 로드', result);
	} catch (e) {
		console.log(e);
	}
};

const detail = (context, next) => {
	console.log('상세 페이지 데이터 \n', context.data);

	const $detail = $('.detail-sec');
	const tmpl = $.templates(Constants.ID_TMPL_DETAILPAGE);
	const html = tmpl.render(context.data);

	$detail.append(html);
	$detail.prop('id', context.params.id);
	openPage($detail);
	next();
};

const makeLink = (context, next) => {
	const { fact_content, fact_link } = context.data;
	const markup = fact_content.replace(/\((.*?)\)/g, '');
	const linkArr = fact_link !== null && fact_link.split('\n');
	const $xFileList = $('.xfile_list');
	const $xFile = $xFileList.closest('.xfile');

	fact_link === null ? $xFile.remove() : $xFileList.append(markup);

	const $xFileItems = $xFileList.children();
	$xFileItems.each((index, item) => {
		$(item).data('link', linkArr[index]);
	});

	next();
};

const initComment = (context, next) => {
	const $after = $('.contents.ty_after');

	if ($after.css('display') === 'block') {
		const vote = $after.data('vote');
		const writing_no = context.params.id;

		$(document).trigger('appendBestCommentList', [vote, writing_no]);
		$(document).trigger('voted.detail');
	}
};

const removeChilds = (context, next) => {
	const firstIdx = 1;
	const secondIdx = context.path.indexOf('/', 1);
	const className = context.path.substr(firstIdx, secondIdx - 1);
	const rmContainer = '.' + className + '-sec';
	const $container = $(rmContainer);
	const $after = $container.find('.contents.ty_after');
	const isVote = $after.data('vote').length > 0;

	context.data.isVote = isVote;

	$container.empty();
	next();
};

const triggerEvents = (context, next) => {
	context.data.isVote && $(document).trigger('card.setVoted', context.params.id);
	next();
};

page.base('');

page('/*', hideAll);
page('/issueTeller', main);
page('/issueTeller/detail/:id', loadDetailData, detail, makeLink, initComment);
page('*', notfound);

page.exit('/issueTeller', setScrollPos);
page.exit('/issueTeller/detail/:id', removeChilds, triggerEvents);

page.start();
