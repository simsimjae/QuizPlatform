import $ from 'jquery';
import Axios from 'axios';
import Constants from './constant';
import qs from 'query-string';
import { card } from './module';
import { commentInfinity } from './infinity';
import page from 'page';

export let xfile, vote, comment, reply, nav;

$(function () {

	nav = (function() {
		
		const back = () => {
			window.history.back();
		};

		const home = () => {
			page('/');
		}

		$(document).on('click', '.detail-sec_header .back', back);
		$(document).on('click', '.detail-sec_header .logo', home);
	})();

	reply = (function () {
		const sReply = '.reply';
		const sReplyInp = sReply + '_inp';
		const sReplySubmit = sReply + '_submit';
		const sReplyNickArea = sReply + '_nickarea';

		const makeReplyData = ($reply) => {
			const $replyInp = $reply.find(sReplyInp);
			const comment_content = $replyInp.val();
			const writing_no = $('.detail-sec').prop('id');
			const depth = 0;
			const parent = null;

			return qs.stringify({ comment_content, writing_no, depth, parent });
		};

		const makeSubReplyData = ($reply, commentId) => {
			const $replyInp = $reply.find(sReplyInp);
			const comment_content = $replyInp.val();
			const writing_no = $('.detail-sec').prop('id');
			const depth = 1;
			const parent = commentId;

			return qs.stringify({ comment_content, writing_no, depth, parent });
		}

		const registerReply = async ($reply) => {
			const data = makeReplyData($reply);

			try {
				const result = await $.post(Constants.URL_CREATE_COMMENT, data);

				clearInput();
				$(document).trigger('register.comment', result);
				$(document).trigger('scrollTo.comment', $('.comment-list .comment:first'));

				console.log("댓글 입력 성공", result);
			} catch (e) {
				console.log("댓글 입력 실패", e.config);
			}

		};

		const registerSubReply = async ($subReply, commentId) => {
			const data = makeSubReplyData($subReply, commentId);

			try {
				const result = await $.post(Constants.URL_CREATE_COMMENT, data);
				const $comment = $(`.comment#${commentId}`);

				clearInput();
				$(document).trigger('register.subcomment', [$comment, result]);
				$(document).trigger('scrollTo.comment', $comment.find('.subcomment_item:last'));

				console.log("댓글 입력 성공", result);
			} catch (e) {
				console.log("댓글 입력 실패", e);
			}
		}

		const onSubmit = e => {
			const $reply = $(e.target).closest(sReply);
			const data = makeReplyData($reply);
			const $nickArea = $reply.find(sReplyNickArea);
			const isReply = $nickArea.css('display') === "none";
			const $replyInp = $reply.find('input');
			if (!$replyInp.val().length) {
				alert('댓글을 입력해주세요');
				return false;
			}


			if (isReply) {
				registerReply($reply);
			} else {
				const commentId = $nickArea.data('commentId');
				registerSubReply($reply, commentId);
			}

		};

		const clearInput = () => {
			const $replyArea = $(sReply);
			const $replyInp = $replyArea.find(sReplyInp);

			$replyArea.removeClass('on');
			$replyInp.val('').blur();
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

		$(document).on('reply.makeNick', (e, nickname, commentId) => handleNickName(nickname, commentId));
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

			$btnArea.remove();

			updateProgressFill();
			window.scroll(0, 0);
		}

		const handleAfter = e => {
			const $btn = $(e.target).closest('.btn');
			const $detail = $('.detail-sec');
			const $after = $('.contents.ty_after');
			const nVoteWhere = getBtnNumber($btn);
			const writing_no = $detail.prop('id');

			$after.data('vote', nVoteWhere);

			vote(nVoteWhere, writing_no);
		};

		const showAfterBtn = (e) => {
			const $btnWrap = $(e.target).closest('.btnarea');
			$btnWrap.addClass('on');
		}

		const updateProgressFill = () => {
			const $result = $('.vote-result_progfill');
			const $total = $('.vote-result_count');
			const nTotal = $total.text();

			$result.css('width', nTotal + '%');
		};

		const updateProgressInfo = (choice, total, current, perc) => {
			const $voteResult = $('.vote-result');
			const $total = $voteResult.find('.vote-result_subtit .total');
			const $current = $voteResult.find('.vote-result_subtit .current');
			const $perc = $voteResult.find('.vote-result_count');
			const $choice = $voteResult.find('.vote-result_choice');
			const $progfill = $voteResult.find('.vote-result_progfill');

			$total.text(total);
			$current.text(current);
			$perc.text(perc);
			$choice.text(choice);
			$progfill.css('width', perc + '%');
		}

		const vote = async (vote, writing_no) => {

			if(vote === null) return;
			
			try {

				const result = await Axios.post(Constants.URL_UPDATE_VOTECOUNT, qs.stringify({
					vote,
					writing_no
				}));

				const data = result.data;
				let total, current, perc, choice;
				if (vote == 1) {
					total = data.totalVoteNum;
					current = data.fir_vote_no;
					perc = data.fir_vote_perc;
					choice = data.choice1;
				}else if(vote == 2){
					total = data.totalVoteNum;
					current = data.sec_vote_no;
					perc = data.sec_vote_perc;
					choice = data.choice2;
				}

				updateProgressInfo(choice, total, current, perc);
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

		const triggerBestComment = () => {
			const vote = $('.contents.ty_after').data('vote');
			const writing_no = $('.detail-sec').prop('id');

			$(document).trigger('appendBestCommentList', [vote, writing_no]);
		};

		const fillCommentByVote = (target) => {
			const curVote = $('.contents.ty_after').data('vote');
			const $comments = (target && $(target)) || $('.comment');

			$comments.each((index, comment) => {
				const vote = $(comment).data('vote');
				const isOurTeam = curVote == vote;
				const $comment = $(comment).first();

				$comment.toggleClass('comment--pros', isOurTeam);
				$comment.toggleClass('comment--cons', !isOurTeam);

				$comment.toggleClass('comment--before', (isOurTeam && vote == 1) || (!isOurTeam && vote == 1));
				$comment.toggleClass('comment--after', (isOurTeam && vote == 2) || (!isOurTeam && vote == 2));
			});
		};

		const onVoted = async () => {
			window.commentInfinity = await new commentInfinity();
			assignBtn();
			toggleUI();
			triggerBestComment();
		};

		const toggleContents = e => {
			const $beforeArea = $(e.currentTarget).next('.ty_before');
			$beforeArea.toggle()
		}

		$(document).on('fillcomment', (e, $comments) => fillCommentByVote($comments));
		$(document).on('voted.detail', onVoted);
		$(document).on('click', sBtnBefore, e => handleBefore(e));
		$(document).on('click', sBtnAfter, e => handleAfter(e));
		$(document).on('click', '.expand-detail', e => toggleContents(e));

		card.attachEventHandlers();
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

			if (isChecked) {
				const $replyInp = $('.reply_inp');
				const $comment = $(e.target).closest('.comment');
				const commentId = $comment.prop('id');
				const $nick = $comment.find('.comment_nick:first');
				const sNick = $nick.text();

				$(document).trigger('reply.makeNick', [sNick, commentId]);
				$replyInp.focus();
			}
		}

		const renderComment = (json) => {
			const tmpl = $.templates(Constants.ID_TMPL_REPLY);
			const $commentList = $('.comment-list');

			$(json).each((index, comment) => {
				const markup = tmpl.render(comment);
				$commentList.prepend(markup);
				const $target = $commentList.find('.comment:first');

				$(document).trigger('fillcomment', $target);
			});
		};

		const renderSubComment = ($comment, json) => {
			const tmpl = $.templates(Constants.ID_TMPL_SUBREPLY);
			const $commentList = $comment.find('.subcomment-list');

			$(json).each((index, comment) => {
				const markup = tmpl.render(comment);
				$commentList.append(markup);
				const $target = $commentList.find('.comment:last');

				$(document).trigger('fillcomment', $target);
			});
		}

		const scrollToTarget = (target) => {

			const nTopPos = $(target).offset().top - $(window).innerHeight() / 3;
			$('html, body').animate({ scrollTop: nTopPos }, 0);
		}

		const renderCommentList = async () => {
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
			const $refcnt = $comment.find('.comment_refcnt:first');

			$refcnt.text(sum);
		}

		const recommend = async e => {
			const $comment = $(e.target).closest('.comment');
			const $btnGroup = $(e.target).closest(sBtnGroup);
			const comment_no = $comment.prop('id');
			const writing_no = $('.detail-sec').prop('id');
			const prefer = $(e.target).closest('.comment_hdopts').val();
			const vote = parseInt($comment.data('vote'), 10);
			const data = qs.stringify({ comment_no, prefer, writing_no });
			const currentVote = parseInt($('.contents.ty_after').data('vote'), 10);

			if (vote != currentVote) {
				alert('다른 의견에는 추천/비추천이 불가능합니다.');
				$(e.target).prop('checked', false);

				return false;
			}

			try {

				const result = await Axios.post(Constants.URL_UPDATE_RECOMCOUNT, data);

				updatePrefer($comment, result.data);
				disableRecommend($btnGroup);

				console.log('추천 처리 성공', result);
			} catch (e) {
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

		const appendBestCommentList = async (vote, writing_no) => {

			try {
				const result = await Axios.get(Constants.URL_READ_BESTCOMMENT_LIST, {
					params: {
						writing_no,
						vote
					}
				});

				const $target = $('.comment-bestlist');
				const tmpl = $.templates(Constants.ID_TMPL_BEST_REPLY);
				const html = tmpl.render(result.data);

				!result.data.length && $target.hide();
				$target.append(html);

				console.log('베댓 조회 완료', result);
			} catch (e) {
				console.log(e);
			}

		}

		$(document).on('appendBestCommentList', (e, vote, writing_no) => appendBestCommentList(vote, writing_no));
		$(document).on('click', sBtnUp + " input" + "," + sBtnDown + " input", onClickVoteBtn);
		$(document).on('click', sBtnReply + " input", onClickReply);
		$(document).on('clear.comment', (e, commentId) => onClearReply(commentId));
		$(document).on('register.comment', (e, json) => renderComment(json));
		$(document).on('register.subcomment', (e, $comment, json) => renderSubComment($comment, json));
		$(document).on('scrollTo.comment', (e, target) => scrollToTarget(target));
	})();

});