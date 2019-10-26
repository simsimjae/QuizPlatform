import $ from 'jquery';
import Axios from 'axios';
import Constants from './constant';
import qs from 'query-string';
import {card} from './module';

export let xfile, prosandcons;

$(function() {
	
	xfile = (function () {
		const sTarget = '.xfile';

		const showModal = e => {
			const $xfile = $(e.target).closest('.xfile');
			const $xfileLink = $(e.target);
			const modalId = $xfile.data('targetLayer');
			const link = $xfileLink.data('link');

			const data = { modalId, link};
			$(document).trigger('modal.iframe.open', data);
		};

		const onClickLink = e => {
			showModal(e);
		}

		$(document).on('click', sTarget, e => onClickLink(e));
	})();

	prosandcons = (function () {

		const sBtnArea = '.prosandcons';
		const $btnArea = $(sBtnArea);

		const updateProgress = () => {
			const $result = $('.vote-result_progfill');
			const $total = $('.vote-result_count');
			const nTotal = $total.text();

			$result.css('width', nTotal + '%');
		};

		const toggleUI = () => {
			const $howThink = $('.howthink');
			const $beforeArea = $('.contents.ty_before');
			const $afterArea = $('.contents.ty_after');
			const $btnArea = $('.prosandcons');
			const $appendTarget = $('.expand-detail');

			$howThink.remove();
			$btnArea.remove();

			$beforeArea.removeClass('on').detach();
			$afterArea.addClass('on');

			$appendTarget.after($beforeArea);
			$appendTarget.on('click', () => $beforeArea.toggle());

			updateProgress();
			window.scroll(0, 0);
		}

		const attachEventHandlers = () => {
			$(document).on('prosandcons.clicked', toggleUI);
			$(document).on('click', sBtnArea, e => handleClick(e));
		}

		const vote = async (voteNum, writingNo) => {
			try {

				const sType = voteNum === 1 ? 'pros' : 'cons';

				const result = await Axios.post(Constants.URL_UPDATE_VOTECOUNT, qs.stringify({
					voteNum,
					writingNo
				}));

				$(document).trigger('prosandcons.clicked', { sType, writingNo });
				
				console.log("투표 정상 처리", result);
			} catch (e) {
				console.log("투표 처리 실패 : prosandcons모듈", e);
			}

		};

		const handleClick = e => {
			const $btn = $(e.target);
			const nVoteWhere = isProsClicked($btn) ? 1 : 2;
			const writingNo = $('.detail-sec').prop('id');

			vote(nVoteWhere, writingNo);
		};

		const isProsClicked = $btn => {
			return $btn.hasClass('btn--pros');
		}

		card.attachEventHandlers();
		attachEventHandlers();
	})();

});