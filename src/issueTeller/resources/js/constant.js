const Constants = {
  ID_TMPL_SLIDE: "#slideTmpl",
  ID_TMPL_REPLY: "#replyTmpl",
  ID_TMPL_BEST_REPLY: "#bestReplyTmpl",
  ID_TMPL_MAIN_CARD: "#cardTmpl",
  ID_TMPL_SUBREPLY: "#subReplyTmpl",
  ID_TMPL_RECOMCOUNTTX: "#recomCountTx",
  ID_TMPL_DETAILPAGE: "#page_detail",
  ID_TMPL_DETAILPAGE_AFTER: "#page_detail-after",

  URL_CREATE_COMMENT: `${URL_BASE}writeComment`,
  URL_CREATE_COMPLAIN: `${URL_BASE}reportWriting`,
  URL_CREATE_MEMBER: `${URL_BASE}enroll`,
  URL_CREATE_SESSION: `${URL_BASE}login`,
  URL_CREATE_POST: `${URL_BASE}writePost`,

  URL_UPDATE_VOTECOUNT: `${URL_BASE}vote`,
  URL_UPDATE_RECOMCOUNT: `${URL_BASE}commentPreferUpdate`,

  URL_READ_SLIDE_DATA: `${URL_BASE}getDetailDtoList`,
  URL_READ_DETAIL_DATA: `${URL_BASE}getWritingDtlDto`,
  URL_READ_MAIN_CARD_DATA: `${URL_BASE}getPagingList`,
  URL_READ_SEARCH_CARD_DATA: `${URL_BASE}searchWrtingList`,
  URL_READ_NICKNAME: `${URL_BASE} + 'getNickname'`,
  URL_READ_USERINFO: `${URL_BASE}getUserInfo`,
  URL_READ_COMMENT_LIST: `${URL_BASE}getCommentDtoList`,
  URL_READ_BESTCOMMENT_LIST: `${URL_BASE}getBestCommentList`,

  URL_REMOVE_SESSION: `${URL_BASE}logout`,
  URL_REMOVE_COMMENT: `${URL_BASE}deleteComment`,

  PAGE_NAME_SWIPE: "swipe",
  PAGE_NAME_SEARCH: "search",

  TYPE_COMMENT: '000',
  TYPE_LOWCOMMENT: '111',
};

export default Constants;