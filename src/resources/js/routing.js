import page from 'page';

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

const main = () => {
  const $main = $('.main-sec');
  openPage($main, window.sessionStorage.getItem('prevScroll'));
}

const notfound = (context) => {
  console.log(context);
  console.log('page not founded!!!');
}

const detail = (context) => {
  const $detail = $('.detail-sec');
  openPage($detail);
};

const setScrollPos = (context, next) => {
  window.sessionStorage.setItem('prevScroll', $(window).scrollTop());
  next();
};

page.base('');

page('/', main);
page('/detail/:id', detail);
page('*', notfound);

page.exit('/', setScrollPos);
page.exit('/*', hideAll);

page.start();


