$(document).ready(function() {
  let method = 'upload';

  $('#computerButton, #urlButton').click(function() {
    method = $(this).data('value');
    $('#computerButton, #urlButton').removeClass('active');
    $(this).addClass('active');
    $('#fileSelectionContainer, #urlContainer').hide();
    if (method === 'upload') {
      $('#fileSelectionContainer').show();
    } else {
      $('#urlContainer').show();
    }
  });

  $('#fileMock').click(function() {
    $('#file').click();
  });

  $('#file').change(function() {
    const fileName = $(this).val().split('\\').pop();
    $('#fileName').val(fileName);
  });

  $('#inputForm').submit(function(e) {
    e.preventDefault();
    const model = $('#model').val().trim();
    const version = $('#version').val().trim();
    const apiKey = $('#api_key').val().trim();
    let data;

    if (method === 'upload') {
      const fileInput = $('#file')[0].files[0];
      if (!fileInput) return alert('Select a file');
      data = fileInput;
    } else {
      const url = $('#url').val().trim();
      if (!url) return alert('Enter a URL');
      data = url;
    }

    const formData = new FormData();
    formData.append(method === 'upload' ? 'file' : 'url', data);
    formData.append('api_key', apiKey);
    formData.append('model', model);
    formData.append('version', version);

    $.ajax({
      url: `https://api.roboflow.com/${model}/${version}/infer`,
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        $('#output').text(JSON.stringify(response, null, 2));
        $('#resultContainer').show();
      },
      error: function(err) {
        console.error(err);
        alert('Error during inference');
      }
    });
  });

  $('#copyButton').click(function(e) {
    e.preventDefault();
    const text = $('#output').text();
    navigator.clipboard.writeText(text).then(() => alert('Copied!'));
  });
});
