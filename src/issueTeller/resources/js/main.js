import $ from 'jquery';
import Constants from './constant';
import './routing';
import modal from './modal';
import { mainInfinity } from './infinity';

require('./jsrender')($);

const setCardVoted = cardId => {
	const $card = $(`#${cardId}`);
	const $img = $card.find('.img:first');
	$img.addClass('on');
};

$(function() {
	window.mainInfinity = new mainInfinity();
	window.oModal = new modal();
	$(document).on('card.setVoted', (e, cardId) => setCardVoted(cardId));
});
