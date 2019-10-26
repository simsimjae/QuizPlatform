import $ from 'jquery';
import page from 'page';
import Constants from './constant';
import Axios from 'axios';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const closeAll = () => {
  $('.wrapper').children().hide();
};

const hideAll = (context, next) => {
  closeAll();
  next();
}

const openPage = ($page, topPos = 0) => {
  $page.show();
  window.scrollTo(0, topPos);
}

const write = () => {
  const $write = $('.write_form');
  openPage($write);
};

const main = (context, next) => {
  const $main = $('.main-sec');
  openPage($main, window.sessionStorage.getItem('prevScroll'));
}

const notfound = (context) => {
  console.log(context);
  console.log('page not founded!!!');
}

const setScrollPos = (context, next) => {
  window.sessionStorage.setItem('prevScroll', $(window).scrollTop());
  next();
};

const loadDetailData = async (context, next) => {
  try {
    const result = await Axios.get(Constants.URL_READ_DETAIL_DATA, {
      params: {
        writingNo: context.params.id
      }
    });
    context.data = result.data;
    await next();
  }catch(e) {
    console.log(e);
  }
}

const detail = (context, next) => {
  console.log("상세 페이지 데이터 \n", context.data);
  
  const $detail = $('.detail-sec');
  const tmpl = $.templates(Constants.ID_TMPL_DETAILPAGE); 
  const html = tmpl.render(context.data);

  $detail.append(html);
  $detail.prop('id', context.params.id);
  openPage($detail);
  next();
};

const makeLink = (context, next) => {
  const markup = context.data.fact_content.replace(/\((.*?)\)/g, '');
  const linkArr = context.data.fact_link.split('\n');
  const $xFileList = $('.xfile_list');
  $xFileList.append(markup);

  const $xFileItems = $xFileList.children();
  $xFileItems.each( (index, item) => {
    $(item).data('link', linkArr[index]);
  });
};

const removeChilds = (context, next) => {
  const firstIdx = 1;
  const secondIdx = context.path.indexOf('/', 1);
  const className = context.path.substr(firstIdx, secondIdx - 1);
  const rmContainer = '.' + className + '-sec';
  const $container = $(rmContainer);
  $container.empty();
  next();
};

const checkReferrer = (context, next) => {
  document.referrer === '' ? window.location.href = 'http://pickvs.com' : window.history.back();
  next();
}

page.base('');

page('/*', hideAll);
page('/', main);
page('/detail/:id', loadDetailData, detail, makeLink);
page('*', notfound);

page.exit('/', setScrollPos);
page.exit('/detail/:id', removeChilds);

page.start();


