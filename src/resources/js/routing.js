import page from 'page';

const closeAll = () => {
  $('.wrapper').children().hide();
};

const before = (context, next) => {
  closeAll();
  next();
}

const openPage = ($page) => {
  $page.show();
}

const write = () => {
  const $write = $('.write_form');
  openPage($write);
};

const main = () => {
  const $main = $('.main-sec');
  openPage($main);
}

const notfound = (context) => {
  console.log(context);
  console.log('page not founded!!!');
}

page.base('/DevPickVs/resources');
page('/', main);
page('/*', before);
page('/write', write);

page.exit('/*', before);
page('*', notfound);
page.start();

