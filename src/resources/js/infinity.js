import Constants from './constant';
import $ from 'jquery';

export const mainInfinity = function (options) {
    const df = {
        loading: false,
        URL: Constants.URL_READ_MAIN_CARD_DATA,
        tmplId: Constants.ID_TMPL_MAIN_CARD,
        page: 1,
    }
    $.extend(this, df, options);

    this._assignElements = function () {
        this.$appendTarget = $('.crdlst');
        this.$infinityTarget = $('.main-sec');
    },

    this._makeRequestData = function () {
        return { mainCategory: 1, page: this.page };
    },

    this.init();
};

export const commentInfinity = function (options) {
    const df = {
        loading: false,
        URL: Constants.URL_READ_COMMENT_LIST,
        tmplId: Constants.ID_TMPL_REPLY,
        page: 1,
    }
    $.extend(this, df, options);

    this._assignElements = function () {
        this.$appendTarget = $('.comment-list');
        this.$infinityTarget = $('.contents.ty_after');
        this.$curPage = $('.detail-sec');
    },

    this._makeRequestData = function () {
        const writing_no = this.$curPage.prop('id');
        return { writing_no , page_num: this.page };
    },

    this.init();
};

const infiniteScroll = {
    init() {
        this._assignElements();
        this._attachEventHandler();
        this._appendInitialData();
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
            .then(data => {

                if (!data.length) {
                    this._setFull();
                    return;
                }

                this.appendElement(data);
                this.loading = false;

            }).catch(e => {
                console.log(e);
            });
    },
    isOpened() {
        return this.$infinityTarget.css('display') === 'block';
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
    appendElement(json) {
        console.log("인피니티 조회 데이터", json);
        var tmpl = $.templates(this.tmplId);
        var html = tmpl.render(json);
        this.$appendTarget.append(html);
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

mainInfinity.prototype = infiniteScroll;