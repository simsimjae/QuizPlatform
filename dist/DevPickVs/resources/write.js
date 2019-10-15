$(function () {

$(".write_form").submit(function (e) {
  e.preventDefault();
  var form = $(this).get(0);
  var url = Constants.URL_CREATE_POST;
  var btnSubmit = $('button.submit');

  var data = new FormData(form);
  var summaryBlob = new Blob([oEditorSum.getHTML()], { type: "text/xml" });
  var contentBlob = new Blob([oEditorConts.getHTML()], { type: "text/xml" });
  data.append('summary_file', summaryBlob);
  data.append('content_file', contentBlob);
  console.log("전송할 데이터 \n", ...data);

  btnSubmit.prop('disabled', true);

  $.ajax({
    type: "POST", url, data,
    enctype: 'multipart/form-data',
    processData: false, contentType: false, cache: false,
    success: function (data) {
      page('/');
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
  const oEditorSum = new Squire($target.get(0),
    {
      blockTag: 'P',
      blockAttributes: { style: 'font-size: 16px;', class: "summary" }
    }
  );
  const oEditorConts = new Squire($target.get(1),
  {
    blockTag: 'P',
    blockAttributes: { style: 'font-size: 16px;', class: "contents" }
  })
  let oEditor = oEditorSum;

  $('.write_cont').click(function (e) {
    const $target = $(e.delegateTarget);
    const index = $('.write_cont').index($target);
    oEditor = index === 0 ? oEditorSum : oEditorConts;
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