import $ from 'jquery';

const modal = function (options) {
    const df = {
        sOpen: '.modal_fix_open',
        sClose : '.modal_close',
        sContents : '.modal_conts',
    };
    $.extend(this, df, options || {});

    this.init();
}

modal.prototype = {
    init() {
        this.assignElements();
        this.attachEventHandler();
    },
    assignElements() {
        this.$openBtn = $(this.sOpen);
    },
    attachEventHandler() {
        this.$openBtn.on('click', e => this.onShow.call(this, e));

        $(document).on('modal.iframe.open', 
            (e, data) => this.onIframeOpen.call(this, data));
    },
    onIframeOpen(data) {
        const { modalId, link } = data;

        this.$modal = $(modalId);
        if(!this.$modal.length) return false;

        this.freeze();
        this.assignModalElements();
        this.attachModalEventHandler();
        this.setIframe(link);
        this.show();
    },
    onShow(e) {
        this.$modal = $(e.target).data('targetLayer');
        
        if( this.$modal.length === 0 ) {
            return false;
        }

        this.freeze();
        this.assignModalElements();
        this.attachModalEventHandler();
        this.show();
    },
    setIframe(link) {
        const $iframe = this.$modal.find('iframe');
        $iframe.get(0).src = link;
    },
    show() {
        this.$modal.show();
    },
    assignModalElements() {
        this.$closeBtn = this.$modal.find(this.sClose);
    },
    attachModalEventHandler() {
        this.$closeBtn.on('click', this.onClose.bind(this));
    },
    onClose() {
        this.unfreeze();
        this.$modal.hide();
    },
    prevent(e) {
        e.preventDefault();
    },
    freeze() {
        document.addEventListener('touchmove', this.prevent, {passive : false});
    },
    unfreeze() {
        document.removeEventListener('touchmove', this.prevent);
    }
};

export default modal;