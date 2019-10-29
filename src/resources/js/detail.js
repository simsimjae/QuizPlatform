import $ from 'jquery';
import Axios from 'axios';
import Constants from './constant';
import qs from 'query-string';
import { card } from './module';

export let xfile, vote, comment, reply;

$(function () {

	reply = (function(){
		const sReply = '.reply';
		const sReplyInp = sReply + '_inp';
		const sReplySubmit = sReply + '_submit';
		const sReplyNickArea = sReply + '_nickarea';

		const makeReplyData = ($reply) => {
			const $replyInp = $reply.find(sReplyInp);
			const replytx = $replyInp.val();
			const writing_no = $('.detail-sec').prop('id');
			const depth = 0;
			const parent = null;
			return { replytx, writing_no, depth, parent};
		};

		const makeSubReplyData = ($reply) => {
			
		}

		const onSubmit = async e => {
			const $reply = $(e.target).closest(sReply);
			const data = makeReplyData($reply);

			try {
				const result = await Axios.post(Constants.URL_CREATE_COMMENT, qs.stringify(data));

				clearInput();
				$(document).trigger('register.comment', result.data);
				$(document).trigger('scrolllast.comment');

				console.log("댓글 입력 성공", result);
			}catch(e) {
				console.log("댓글 입력 실패", e.config);
			}

		};

		const clearInput = () => {
			const $replyArea = $(sReply);
			const $replyInp = $replyArea.find(sReplyInp);

			$replyArea.removeClass('on');
			$replyInp.val('');
		}

		const onKeyUp = e => {
			const $input = $(e.target);
			const length = $input.val().length;
			const $replyArea = $(sReply);

			$replyArea.toggleClass('on', length > 0);
		};

		const onClickNick = e => {
			const $nickArea = $(e.currentTarget);
			const commentId = $nickArea.data('commentId');

			$nickArea.removeClass('on');
			$(document).trigger('clear.comment', commentId);
		};

		const handleNickName = (nickname, commentId) => {
			const $replyNickArea = $('.reply_nickarea');
			const $replyNick = $replyNickArea.find('.reply_nick');

			$replyNick.text(nickname);
			$replyNickArea.addClass('on');
			$replyNickArea.data('commentId', commentId);
		};

		$(document).on('nick.comment', (e, nickname, commentId) => handleNickName(nickname, commentId));
		$(document).on('click', sReplyNickArea, onClickNick);
		$(document).on('click', sReplySubmit, onSubmit);
		$(document).on('clear.reply', clearInput);
		$(document).on('keyup paste blur focus change', sReplyInp, onKeyUp);
	})();

	xfile = (function () {
		const sTarget = '.xfile';

		const showModal = e => {
			const $xfile = $(e.target).closest('.xfile');
			const $xfileLink = $(e.target);
			const modalId = $xfile.data('targetLayer');
			const link = $xfileLink.data('link');

			const data = { modalId, link };
			$(document).trigger('modal.iframe.open', data);
		};

		const onClickLink = e => {
			showModal(e);
		}

		$(document).on('click', sTarget, e => onClickLink(e));
	})();

	vote = (function () {

		const sBtnArea = '.js-vote-btn-wrap';
		const sBtnBefore = '.js-before';
		const sBtnAfter = '.js-after';
		const sBtnAfter1 = '.js-after-opt1';
		const sBtnAfter2 = '.js-after-opt2';

		let $btnArea, $btnBefore, $btnAfter, $btnAfter1, $btnAfter2;

		const handleBefore = e => {
			assignBtn();
			showAfterBtn(e);
		};

		const toggleUI = () => {
			const $howThink = $('.howthink');
			const $beforeArea = $('.contents.ty_before');
			const $afterArea = $('.contents.ty_after');
			const $appendTarget = $('.expand-detail');

			$howThink.remove();

			$beforeArea.removeClass('on').detach();
			$afterArea.addClass('on');

			$appendTarget.after($beforeArea);
			$appendTarget.on('click', () => $beforeArea.toggle());

			$btnArea.remove();

			updateProgress();
			window.scroll(0, 0);
		}

		const handleAfter = e => {
			const $btn = $(e.target).closest('.btn');
			const nVoteWhere = getBtnNumber($btn);
			const writing_no = $('.detail-sec').prop('id');

			vote(nVoteWhere, writing_no);
		};

		const showAfterBtn = (e) => {
			const $btnWrap = $(e.target).closest('.btnarea');
			$btnWrap.addClass('on');
		}

		const updateProgress = () => {
			const $result = $('.vote-result_progfill');
			const $total = $('.vote-result_count');
			const nTotal = $total.text();

			// $result.animate({
			// 	width: nTotal + '%'
			// }, 200);
			$result.css('width', nTotal + '%');
			
		};

		const attachEventHandlers = () => {
			$(document).on('voted', toggleUI);
			$(document).on('click', sBtnBefore, e => handleBefore(e));
			$(document).on('click', sBtnAfter, e => handleAfter(e));
		}

		const vote = async (vote, writing_no) => {
			try {

				const result = await Axios.post(Constants.URL_UPDATE_VOTECOUNT, qs.stringify({
					vote,
					writing_no
				}));

				const $targetBefore = $('.contents.ty_before');
				const tmpl = $.templates(Constants.ID_TMPL_DETAILPAGE_AFTER);
				const html = tmpl.render(result.data);

				$targetBefore.before(html);
				$(document).trigger('voted', { vote, writing_no });

				console.log("투표 정상 처리", result);
			} catch (e) {
				console.log("투표 처리 실패 : vote모듈", e);
			}

		};

		const assignBtn = () => {
			$btnArea = $(sBtnArea);
			$btnBefore = $btnArea.find(sBtnBefore);
			$btnAfter = $btnArea.find(sBtnAfter);
			$btnAfter1 = $btnArea.find(sBtnAfter1);
			$btnAfter2 = $btnArea.find(sBtnAfter2);
		}

		const getBtnNumber = $btn => {
			return $btn.val();
		}

		card.attachEventHandlers();
		attachEventHandlers();
	})();

	comment = (function () {
		const sBtnGroup = ".comment_header-optbar";
		const sBtn = ".comment_hdopts";
		const sBtnUp = ".comment_header-up";
		const sBtnDown = ".comment_header-down";
		const sBtnReply = ".comment_header-reply";
		let page_num = 1;

		const disableRecommend = ($btnGroup) => {
			setTimeout(() => $btnGroup.find('.recom_grp').prop('disabled', true), 0);
		};

		const onClickReply = e => {
			const $btn = $(e.target).closest(sBtn);
			const $input = $btn.find('.comment_inp');
			const isChecked = $input.is(":checked");
			
			if( isChecked ) {
				const $replyInp = $('.reply_inp');
				const $comment = $(e.target).closest('.comment');
				const commentId = $comment.prop('id');
				const $nick = $comment.find('.comment_nick');
				const sNick = $nick.text();

				$(document).trigger('nick.comment', [sNick, commentId]);
				$replyInp.focus();
			}
			
		}

		const renderComment = (json) => {
			const tmpl = $.templates(Constants.ID_TMPL_REPLY);
			const $commentList = $('.comment-list');
			
			$(json).each( (index, comment) => {
				const markup = tmpl.render(comment);
				$commentList.prepend(markup);
			});
	
		};

		const scrollToLast = () => {
			const nTopPos = $('.comment-list .comment:first').offset().top - $(window).innerHeight() / 3;
			$('html, body').animate({ scrollTop: nTopPos }, 0);
		}

		const getCommentList = async () => {
			const writing_no = $('.detail-sec').prop('id');
			try {

				const result = await Axios.get(Constants.URL_READ_COMMENT_LIST, {
					params: {
						writing_no,
						page_num,
					}
				});

				renderComment(result.data);
				page_num++;
				console.log('댓글 조회 성공', result);
			} catch (e) {
				console.log('댓글 조회 실패', e);
			}
		};

		const onClickVoteBtn = e => {
			const $btn = $(e.target).closest(sBtn);
			const $btnGroup = $btn.closest(sBtnGroup);

			recommend(e);
		}

		const updatePrefer = ($comment, json) => {
			const sum = Math.max(json.sum_prefer, 0);
			const $refcnt = $comment.find('.comment_refcnt');

			$refcnt.text(sum);
		}

		const recommend = async e => {
			const $comment = $(e.target).closest('.comment');
			const $btnGroup = $(e.target).closest(sBtnGroup);
			const comment_no = $comment.prop('id');
			const writing_no = $('.detail-sec').prop('id');
			const prefer = $(e.target).closest(sBtn).hasClass(sBtnUp.replace('.', '')) ? 0 : 1;
			const data = qs.stringify({ comment_no, prefer, writing_no });

			try {
				
				const result = await Axios.post(Constants.URL_UPDATE_RECOMCOUNT, data);

				updatePrefer($comment, result.data);
				disableRecommend($btnGroup);

				console.log('추천 처리 성공', result);
			}catch(e){
				console.log('추천 처리 실패', e.config);
				return false;
			}
		};

		const onClearReply = commentId => {
			const $comment = $(`.comment#${commentId}`);
			const $replyBtn = $comment.find('.comment_header-reply');
			const $replyInp = $replyBtn.find('.comment_inp');

			$replyInp.prop('checked', false);
		}

		$(document).on('clear.comment', (e, commentId) => onClearReply(commentId));
		$(document).on('click', sBtnUp + " input" + "," + sBtnDown + " input", onClickVoteBtn);
		$(document).on('click', sBtnReply + " input", onClickReply);
		$(document).on('voted', getCommentList);
		$(document).on('register.comment', (e, json) => renderComment(json));
		$(document).on('scrolllast.comment', scrollToLast);
	})();
});