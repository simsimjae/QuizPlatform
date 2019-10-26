import $ from 'jquery';
import Constants from './constant';
import './routing';
import modal from './modal';

require('./jsrender')($);

var ssj = ssj || {};
ssj.view = ssj.view || {};
ssj.view.infiniteScroll = function (options) {
  $.extend(this, options);
  this.init();
};

ssj.view.infiniteScroll.prototype = {
  init() {
    this._assignElements();
    this._attachEventHandler();
    this._initVar();
    this._appendInitialData();
  },
  _initVar() {
    this.loading = false;
    this.URL = Constants.URL_READ_MAIN_CARD_DATA;
    this.tmplId = Constants.ID_TMPL_MAIN_CARD;
    this.page = 1;
  },
  _assignElements() {
    this.$cardList = $('.crdlst');
  },
  _attachEventHandler() {
    $(window).scroll(this.onScroll.bind(this));
  },
  _appendInitialData() {
    this._onTrigger();
  },
  onScroll() {
    if (!this.isOpened()) return;

    if (this.shouldTrigger() && !this.loading && !this.bEnded) {
      this._onTrigger();
    }
  },
  _onTrigger() {
    this.loading = true;
    const data = this._makeRequestData();

    this.loadData(this.URL, data)
      .then(cardData => {

        if (!cardData.length) {
          this._setFull();
          return;
        }

        this.appendCard(cardData);
        this.loading = false;

      }).catch(e => {
        console.log(e);
      });
  },
  isOpened() {
    return $('.main-sec').css('display') === 'block';
  },
  _makeRequestData() {
    return { mainCategory: 1, page: this.page };
  },
  loadData(url, data) {
    return new Promise((resolve, reject) => {
      $.get({
        url, data,
        success: function (data) { resolve(data) },
        error: function (e) { reject(e) }
      });
    });
  },
  appendCard(json) {
    console.log(json);
    var tmpl = $.templates(this.tmplId);
    var html = tmpl.render(json);
    this.$cardList.append(html);
    this.page++;
  },
  shouldTrigger() {
    var winH = $(window).height();
    var docH = $(document).height();
    var winTop = $(window).scrollTop();
    return Math.ceil(winTop) >= docH - winH;
  },
  _setFull() {
    this.bEnded = true;
  }
};

$(function () {
  window.oSsjViewInfinite = new ssj.view.infiniteScroll();
  window.oModal = new modal();
});
