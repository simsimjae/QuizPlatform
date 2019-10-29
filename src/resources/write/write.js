import Constants from '../js/constant';
import page from 'page';

$(function () {

$(".write_form").submit(function (e) {
  e.preventDefault();
  var form = $(this).get(0);
  var url = Constants.URL_CREATE_POST;
  var btnSubmit = $('button.submit');

  var data = new FormData(form);
  var summaryBlob = new Blob([oEditorSum.getHTML()], { type: "text/xml" });
  var prosBlob = new Blob([oEditorPros.getHTML()], { type: "text/xml" });
  var consBlob = new Blob([oEditorCons.getHTML()], { type: "text/xml" });
  var factBlob = new Blob([oEditorFact.getHTML()], { type: "text/xml" });

  data.append('summary_file', summaryBlob);
  data.append('pros_file', prosBlob);
  data.append('cons_file', consBlob);
  data.append('fact_file', factBlob);
  console.log("전송할 데이터 \n", ...data);

  btnSubmit.prop('disabled', true);

  $.ajax({
    type: "POST", url, data,
    enctype: 'multipart/form-data',
    processData: false, contentType: false, cache: false,
    success: function (data) {
      window.location.href = URL_BASE;
    },
    error: function(e) {
      alert('글 작성 실패');
      console.log(e);
      btnSubmit.prop('disabled', false);
    },
    done: function (data) {
      btnSubmit.prop('disabled', false);
    }
  });

});




function toggleBold() {
  const bold = $(this).data('bold');
  bold ? oEditor.bold() : oEditor.removeBold();
  $(this).data('bold', !bold);
}

function toggleUnderline() {
  const underline = $(this).data('underline');
  underline ? oEditor.underline() : oEditor.removeUnderline();
  $(this).data('underline', !underline);
}

function getImage(input) {
  if (input.files && input.files[0]) {
    if (/\.(jpe?g|png|gif)$/i.test(input.files[0].name)) {
      const reader = new FileReader();
      reader.onload = function (e) {
        oEditor.insertImage(
          reader.result,
          {
            class: 'inserted_image'
          }
        );
        input.value = "";
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      alert('png, gif, jpg 파일만 업로드 가능합니다');
    }
  }
}

  const $target = $('.write_cont');

  /* 요약 */
  const oEditorSum = new Squire($target.get(0),
    {
      blockTag: 'P',
      blockAttributes: {class: "content_desc" }
    }
  );

  /* 찬성측 의견 */
  const oEditorPros = new Squire($target.get(1),
  {
    blockTag: 'li',
    blockAttributes: {class: "list_item" }
  })

  /* 반대측 의견 */
  const oEditorCons = new Squire($target.get(2),
  {
    blockTag: 'li',
    blockAttributes: {class: "list_item" }
  })

  /* 팩트 링크 */
  const oEditorFact = new Squire($target.get(3),
  {
    blockTag: 'li',
    blockAttributes: {class: "list_item on" }
  })

  const editors = [oEditorSum, oEditorPros, oEditorCons, oEditorFact];

  let oEditor = editors[0];

  $('.write_cont').click(function (e) {
    const $target = $(e.delegateTarget);
    const index = $('.write_cont').index($target);
    oEditor = editors[index];
  })

  $('.colorpicker').each(function () {
    $(this).minicolors({
      control: $(this).attr('data-control') || 'hue',
      defaultValue: $(this).attr('data-defaultValue') || '#000',
      format: $(this).attr('data-format') || 'hex',
      keywords: $(this).attr('data-keywords') || '',
      inline: $(this).attr('data-inline') === 'true',
      letterCase: $(this).attr('data-letterCase') || 'lowercase',
      opacity: $(this).attr('data-opacity'),
      position: $(this).attr('data-position') || 'bottom',
      swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
      change: function (hex, opacity) {
        var log;
        try {
          log = hex ? hex : '#000';
          oEditor.setTextColour(log);
          if (opacity) log += ', ' + opacity;
          console.log(log);
        } catch (e) { }
      },
      theme: 'default',
      position: 'top bottom'
    });
  });

  $('body').on('click', '.inserted_image', function (e) {
    $(e.target).toggleClass('on');
  });

  $('.fontsize').on('blur keyup', 'input', function (e) {
    if (e.type === "keyup" && e.keyCode != 13) return;
    oEditor.setFontSize($(e.target).val() + 'px');
    e.preventDefault();
  });

  $('.bold').click(toggleBold);

  $('.underline').click(toggleUnderline);

  $('.ordered').click(function () {
    oEditor.makeOrderedList();
  });

  $('.unordered').click(function () {
    oEditor.makeUnorderedList();
  });

  $('.indent').click(function () {
    oEditor.increaseListLevel();
  });


});