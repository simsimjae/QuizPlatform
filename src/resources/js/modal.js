var ssj = ssj || {};
ssj.view = ssj.view || {};

ssj.view.modal = function (options) {
    const df = {
        sOpen: '.modal_fix_open',
        sClose : '.modal_close',
        sContents : '.modal_conts',
    };
    $.extend(this, df, options || {});

    $modal !== null && this.init();
}

ssj.view.modal.prototype = {
    init() {
        this.assignElements();
        this.attachEventHandler();
    },
    assignElements() {
        this.$openBtn = $(sOpen);
    },
    attachEventHandler() {
        this.$openBtn.on('click', this.onShow.call(this, e));
    },
    onShow(e) {
        this.$modal = $(e.target).data('targetLayer');
        
        if( this.$modal.length === 0 ) {
            return false;
        }

        this.assignModalElements();
        this.attachModalEventHandler();
        this.freeze();
    },
    assignModalElements() {
        this.$closeBtn = this.$modal.find(sClose);
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
        document.addEventListener('touchmove', this.prevent, { passive: true });
    }
};