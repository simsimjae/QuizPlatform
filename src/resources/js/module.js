import $ from 'jquery';

export const card = (function () {

    const addType = (voteNum, writingNo) => {
        const sModifier = 'crd--' + voteNum;
        const $card = $(`#${writingNo}`);

        $card.addClass(sModifier);
    };

    const handlePaC = (e, { voteNum, writingNo }) => {

        $(window).one('popstate', e => {
            addType(voteNum, writingNo);
        });

    };

    const attachEventHandlers = () => {
        $(document).on('voted', handlePaC);
    };
    
    return {
        addType,
        attachEventHandlers
    };

})();