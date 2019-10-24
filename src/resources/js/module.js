import $ from 'jquery';

export const card = (function () {

    const addType = (sType, writingNo) => {
        const sModifier = 'crd--' + sType;
        const $card = $(`#${writingNo}`);

        $card.addClass(sModifier);
    };

    const handlePaC = (e, { sType, writingNo }) => {

        $(window).one('popstate', e => {
            addType(sType, writingNo);
        });

    };

    const attachEventHandlers = () => {
        $(document).on('prosandcons.clicked', handlePaC);
    };
    
    return {
        addType,
        attachEventHandlers
    };

})();