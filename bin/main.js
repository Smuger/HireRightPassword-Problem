(function ($) {
    $(function () {
  
      var search_field = jQuery('#search');
      var form = search_field.closest('form');
      var submit_input = form.find('[type="submit"]');
  
      window.showWrapperAfterSplash = function (event) {
        var frame;
  
        if (typeof event.data !== undefined) {
          frame = event.data;
        } else {
          frame = event;
        }
        if (
            $(frame).contents().find('form input[name="event"]').val() !== 'com_on_sign_consent' &&
            $(frame).contents().find('form input[name="event"]').val() !== 'submit_application_print_receipt'
        ) {
          $(frame).off('load', showWrapperAfterSplash);
          $('body').css('overflow-y', 'auto');
        }
      };
  
      window.hideWrapperForSplash = function (frame) {
        if (typeof frame !== 'undefined') {
          $(frame).on('load', $(frame), showWrapperAfterSplash);
        }
      };
  
      form.on('submit', function (event) {
        event.preventDefault();
  
        var userText = search_field.val().replace(/^\s+/, '').replace(/\s+$/, '');
  
        if (!submit_input.hasClass('spinner') && search_field.val() !== '' && userText !== '') {
          searchFAQ();
        }
      });
  
      window.showCommunicationPreferences = function () {
        $('.communicationPreferencesChanged').css('display', 'none');
        $('.communicationPreferencesContainer').css('display', 'block');
        $('#communicationPreferences').show();
        scrollTo('communicationPreferences');
      };
  
      $('#communicationPreferencesTimePeriodDisable').on('change', function () {
        if ($(this).prop('checked')) {
          disableTimeSelects()
        }
      })
      $('#communicationPreferencesTimePeriodEnable').on('change', function () {
        if ($(this).prop('checked')) {
          enableTimeSelects();
        }
      });
  
      $('.communicationPreferences h2 a').on('click', function (event) {
        event.preventDefault();
        $('.communicationPreferences').slideUp();
      });
      $('.communicationPreferencesLink').on('click', function (event) {
        event.preventDefault();
        $(this).remove();
        $('.communicationPreferencesEdit').show();
      });
  
      if ($('.communicationPreferencesPhoneNumber input').length) {
        $('.communicationPreferencesPhoneNumber input').on('keyup', CommunicationPreferences.validateMobilePhone);
      }
  
      if ($('.communicationPreferencesCountryCode input').length) {
        var countryCode = $('.communicationPreferencesCountryCode input').val();
        if (countryCode != null) {
          CommunicationPreferences.setPhoneValidationPattern('countryCode', 'mobilePhoneNumber');
          CommunicationPreferences.formatPhone('countryCode', 'mobilePhoneNumber');
        }
      }
  
      $('.feedbackContainer h2 a').on('click', function (event) {
        event.preventDefault();
        $('.feedbackContainer').slideUp();
      });
  
      $('.hintFaq').on('click', function (event) {
        event.preventDefault();
        scrollTo('faq');
        $('#faq')
            .delay(500)
            .click()
            .delay(1500)
            .next()
            .animate({ backgroundColor: '#fdf1a0' }, 'fast')
            .animate({ backgroundColor: 'transparent' }, 'slow');
      });
  
      $('.communicationPreferencesButtons a').on('click', function (event) {
        event.preventDefault();
  
        var error_message = jQuery('#error_fader');
        var country_code = jQuery('#countryCode');
  
        if ($(this).hasClass('button')) {
          if ($(this).parent().parent().find('.communicationPreferencesEdit').is(':visible')) {
            if (country_code.val().length < 1) {
              country_code.attr('nodevalid', 'false');
              country_code.next().addClass('error');
              error_message.find('.error_header').after('<a href="#">' + country_code.attr('data-error-message') + '</a>');
              error_message.show();
              return false;
            } else {
              country_code.attr('nodevalid', 'true');
              country_code.next().removeClass('error');
              error_message.hide();
            }
  
            var $input = $(this).parent().parent().find('.communicationPreferencesPhoneNumber input');
            var regexp = new RegExp($input.attr('regexp'));
  
            if (!regexp.test($input.val())) {
              $input.attr('nodevalid', 'false');
              $input.next().addClass('error');
  
              if (!error_message.find('#errorLink-' + $input.attr('id')).length) {
                error_message.find('.error_header').after('<a href="#' + $input.attr('id') + '"' + 'class="error_header-link" id="errorLink-' +
                    $input.attr('id') + '"' + '>' + $input.attr('data-error-message') + '</a>');
              }
  
              error_message.show();
  
              if (typeof isWcag !== 'undefined' && isWcag && wcagACMethods) {
                wcagACMethods.focusErrorHeader();
              }
  
              return false;
            } else {
              $input.attr('nodevalid', 'true');
              $input.next().removeClass('error');
              error_message.hide();
            }
          }
          saveCommunicationPref(true);
        } else {
          saveCommunicationPref(false);
        }
      });
  
      $('.feedbackButton a').on('click', function (event) {
        event.preventDefault();
        scrollTo('feedbackContainer');
        $('.feedbackFormContainer').slideUp();
        $('.feedbackFormSubmited').slideDown();
        $('.feedbackContainer').delay(5000).slideUp();
  
        var link = $('#post_feedback').attr('href');
  
        $.ajax({
          type: 'POST',
          url: link,
          data: $('#feedbackForm').serialize(),
        });
      });
  
      $('.timeLineLink a, .timeLineContainer .timeIcon span, .timeRequired').on('click', function (event) {
        event.preventDefault();
        if ($(window).width() < 960) {
          $('.timeLineContainer').slideToggle();
          $('.timeLineLink').slideToggle();
        }
      });
  
      $('.defaultSelect').each(function () {
        $(this).wrap('<div class="defaultSelectWrapper"></div>');
        $(this).before('<div class="defaultSelectText"></div>');
        if ($('option:selected', $(this)).attr('title') && $('option:selected', $(this)).attr('title') !== '') {
          $(this)
              .prev()
              .html($('option:selected', $(this)).attr('title'));
        } else {
          $(this)
              .prev()
              .html($('option:selected', $(this)).html());
        }
        $(this).on('change', function () {
          if ($('option:selected', $(this)).attr('title') && $('option:selected', $(this)).attr('title') !== '') {
            $(this)
                .prev()
                .html($('option:selected', $(this)).attr('title'));
          } else {
            $(this)
                .prev()
                .html($('option:selected', $(this)).html());
          }
        });
        $(this)
            .focus(function () {
              $(this).parent().addClass('changed');
            })
            .blur(function () {
              if ($(this).val() === null) {
                $(this).removeClass('changed');
              } else {
                if ($('option:selected', $(this)).attr('title') && $('option:selected', $(this)).attr('title') !== '') {
                  $(this)
                      .prev()
                      .html($('option:selected', $(this)).attr('title'));
                } else {
                  $(this)
                      .prev()
                      .html($('option:selected', $(this)).html());
                }
              }
            });
      });
  
      $('.defaultInput').each(function () {
        if ($(this).val().length < 1) {
          $(this).addClass('defaultInputShadow').removeClass('changed');
        } else {
          $(this).addClass('changed').removeClass('defaultInputShadow');
        }
        $(this)
            .focus(function () {
              $(this).addClass('changed').removeClass('defaultInputShadow');
            })
            .blur(function () {
              if ($(this).val().length < 1) {
                $(this).removeClass('changed').addClass('defaultInputShadow');
              }
            });
      });
  
      $('.elementPhone, .elementDateBirth')
          .focus(function () {
            $(this).next('span').find('a').addClass('hover');
          })
          .blur(function () {
            $(this).next('span').find('a').removeClass('hover');
          });
  
      $('.hintWhere')
          .mouseover(function () {
            $('#reportStatus').animate({ backgroundColor: '#fdf1a0' }, 'fast');
          })
          .mouseout(function () {
            $('#reportStatus').animate({ backgroundColor: '#efefef' }, 'slow');
          });
      $('.hintWhere').on('click', function (event) {
        event.preventDefault();
        scrollTo('reportStatus');
        $('#reportStatus')
            .delay(500)
            .animate({ backgroundColor: '#fdf1a0' }, 'fast')
            .animate({ backgroundColor: '#efefef' }, 'slow');
      });
  
      $('.uploadDesc a, .uploadAdd a').on('click', function (event) {
        event.preventDefault();
        $('#fileupload').click();
      });
  
      $('#fileupload').change(function () {
        $('.uploadProcess').find('.uploadOneFile').remove();
  
        var files = this.files;
        if (files) {
          $('.uploadDesc').hide();
          $('.uploadProcess').addClass('showing');
        }
        for (var a = 0; a < files.length; a++) {
          $('.uploadProgressAll').after(
              '<div class="uploadOneFile"><a href="#" class="uploadOneFileLink">' +
              files[a].name +
              '</a> <a href="#" class="uploadOneFileRemove"></a></div>'
          );
        }
        $('.uploadOneFile a:first-child').on('click', function (event) {
          event.preventDefault();
          $('.uploadProgressAll').addClass('done').html(UPLOAD_COMPLETED);
        });
        $('.uploadProgressAll').removeClass('done').html(UPLOADING);
        recountPopupOffset();
      });
  
      $('.questionsQuestion').on('click', function (event) {
        event.preventDefault();
        $('.questionsQuestion').removeClass('current');
        if ($(this).next('.questionsAnswer').is(':visible')) {
          $(this).next('.questionsAnswer').slideUp();
        } else {
          $('.questionsAnswer').slideUp();
          $(this).next('.questionsAnswer').slideDown();
          $(this).addClass('current');
        }
      });
  
      $('.helpHeader a').click(function (event) {
        event.preventDefault();
        if (!$('.helpHidden').is(':visible')) {
          $('.helpHeader').slideUp();
          $('.helpHidden').slideDown();
        }
      });
  
      if ($('#languageSelector').length) {
        $('#languageSelector').change(function (event) {
          $('#change_language_form').submit();
        });
      }
  
      function preload(arrayOfImages) {
        $(arrayOfImages).each(function () {
          $('<img alt=""/>').attr('src', this).appendTo('body').hide();
        });
      }
    });
  })(jQuery);
  
  var isDobValid = false;
  
  function radioHandler(elem) {
    var element = jQuery(elem);
    var custom_input =
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path> </svg>';
    var custom_input_checked =
        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM12 6.984q2.063 0 3.539 1.477t1.477 3.539-1.477 3.539-3.539 1.477-3.539-1.477-1.477-3.539 1.477-3.539 3.539-1.477z"></path> </svg>';
    var input = element.find('input[type="radio"]').length ? element.find('input[type="radio"]') : element.next('input[type="radio"]');
    var svg_container = input.prev();
  
    input.prop('checked', true);
    svg_container.empty().prepend(custom_input_checked);
    svg_container.attr('aria-checked', 'true');
  
    input.attr('id') === 'communicationPreferencesTimePeriodDisable' ? disableTimeSelects() : enableTimeSelects();
  
    if (jQuery(element).parent().find('input[type="radio"]:not(:checked)').length) {
      jQuery(element).parent().find('input[type="radio"]:not(:checked)').prev().empty().prepend(custom_input);
      jQuery(element).parent().find('input[type="radio"]:not(:checked)').prev().attr('aria-checked', 'false');
    } else {
      jQuery(element).closest('.custom-radio-item').parent().find('input[type="radio"]:not(:checked)').prev().empty().prepend(custom_input);
      jQuery(element).closest('.custom-radio-item').parent().find('input[type="radio"]:not(:checked)').prev().attr('aria-checked', 'false');
    }
  }
  
  function popupHideAnimation(element) {
    var currentDate = new Date();
  
    $('.informationReceivedContainer h2').after(
        '<div class="reportInfoReceived" style="display: block; opacity: 1;"><table><tbody><tr><td>' +
        $(element).attr('data-name') +
        '</td><td><span>' +
        getCurrentDateFormatted(currentDate) +
        '</span></td></tr></tbody></table></div>'
    );
    $('.informationReceivedContainer .opacity').slideDown('normal', function () {
      $(this).find('a').css('backgroundColor', '#fdf1a0');
      $(this).animate({ opacity: 1 }, 'fast', function () {
        $(this).removeClass('opacity');
        $(this).find('a').animate({ backgroundColor: 'transparent' }, 'slow');
      });
    });
  }
  
  function showQuestionDialog(element, target) {
    var dialogId = jQuery(target).attr('id');
    var linkId = jQuery(element).attr('id');
  
    popupShowAnimation(element);
  
    $(target).fadeIn('fast').attr('aria-labelledby', linkId);
  
    recountPopupOffset();
  
    if ($('#answerForm').hasClass('needValidate')) {
      var form = $('#answerForm');
      form = form.hr_validator();
    }
  
    if (element !== undefined) {
      $('#answerForm').on('submit', false);
      $('.popupBox .uploadButtons a:nth-child(1)').on('click', function (event) {
        var aForm = $('#answerForm');
  
        event.preventDefault();
  
        if ($('#answerForm').hasClass('needValidate')) {
          if (!$('.notApplicable', form).prop('checked')) {
            if (!form.hr_validator('check')) {
              return false;
            }
          }
        }
  
        $.ajax({
          type: aForm.attr('method'),
          url: aForm.attr('action'),
          data: aForm.serialize(),
          success: function (data) {
            if (data && data.errorMessage) {
              $('#answerForm .popupDesc').removeClass('popupDesc').addClass('formError');
              $('#answerForm').empty().append('<div class="formError"><p>' + data.errorMessage + '</p></div>');
            } else {
              hideUploadDialog();
              var $thisAction = $(element).closest('.one-action-container');
              var $thisNumber = $thisAction.find('.one-action-number');
              var $thisLinks = $thisAction.find('a');
              var $thisText = $thisAction.find('.one-action-desc');
              $thisLinks.animate({color: '#b0b0b0'}, 'fast');
              $thisNumber.animate({backgroundColor: '#b0b0b0'}, 'slow');
              $thisText.animate({color: '#ffffff'});
              $thisAction
                  .delay(500)
                  .addClass('greyAction')
                  .slideUp('normal', function () {
                    $(this).remove();
                    popupHideAnimation(element);
                    recountActions();
                    showAdditionalRequestIfNeeded(element, data);
                  });
            }
          }
        });
      });
    } else {
      $('.popupBox .uploadButtons a:nth-child(1)').on('click', function (event) {
        event.preventDefault();
        popupHideAnimation(element);
        hideUploadDialog();
      });
    }
  
    if (typeof isWcag !== 'undefined' && isWcag && wcagACMethods) {
      wcagACMethods.holdFocusWcagDialog(dialogId);
    }
  }
  
  function showAdditionalRequestIfNeeded(element, data) {
    var itemUID = $(data).find('#itemUID').val(); 
    var isAdditionalRequest = itemUID ? true : false;
    if (isAdditionalRequest) {
      var dialogId = $(data).attr('id');
      var cancelCallback = function () {
        window.location.reload();
      };
      var callbacks = {
        '.cancelButton, .popupClose>button': cancelCallback,
      };
      var isUploadDialog = dialogId && dialogId.indexOf('uploadDialog_') == 0 ? true : false;
      if (isUploadDialog) {
        var target = '#' + dialogId;
        var link = 'rfai_upload_dialog_link';
        createUploadDialogFromHTML(target, data, callbacks);
        getUploadDialog(undefined, target, link, itemUID, callbacks);
      } else {
        $('#questionDialog').html(data);
        setEvents();
        $.each(callbacks, function (selector, onclick) {
          $('#questionDialog').find(selector).on('click', onclick);
        });
        showQuestionDialog(element, '#questionDialog');
      }
    }
  }
  
  function getCurrentDateFormatted(curDate) {
    return (
        ('0' + (curDate.getMonth() + 1)).slice(-2) + '/' + ('0' + curDate.getDate()).slice(-2) + '/' + curDate.getFullYear()
    );
  }
  
  function getCurrentLocaleDateFormatted(curDate) {
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    var LANG = window.navigator.userLanguage || window.navigator.language;
    return curDate.toLocaleDateString(LANG, options);
  }
  
  function popupShowAnimation(element) {
    $('#overlay').fadeIn('fast');
  }
  
  function getUploadDialog(element, target, dialog_link_id, objCommUID, callbacks) {
    popupShowAnimation(element);
  
    var wcag_status_container = jQuery(target).find('.wcag-status-helper');
  
    if (objCommUID != 0) {
      $(target).find('.uploadFiles').html('');
      $(target).find('#itemUID').val(objCommUID);
  
      $.ajax({
        type: 'GET',
        url: $('#show_uploaded_docs').attr('href') + objCommUID,
        dataType: 'json',
        success: function (data) {
          $.each(data, function (index, file) {
            if (!file.defaultErrorMessage) {
              var fileTemplate = $(
                  '<div class="uploadOneFile"><a href="' +
                  $('#open_document_link').attr('href') +
                  file.itemUID +
                  '&docID=' +
                  file.documentID +
                  '" class="uploadOneFileLink" target="_blank">' +
                  file.name +
                  '</a><a href="#"  class="uploadOneFileRemove" data-delete-link="' +
                  $('#delete_document_link').attr('href') +
                  file.itemUID +
                  '&docID=' +
                  file.documentID +
                  '"></a></div>'
              );
              $('.uploadOneFileRemove', $(fileTemplate)).on('click', function (event) {
                event.preventDefault();
                var url = $(this).attr('data-delete-link');
                var _this = this;
                $.ajax({ url: url }).done(function (data) {
                  $(_this).parent().remove();
                  if ($(target).find('.uploadOneFile').length < 1) {
                    removeUploadStatus(wcag_status_container, target);
                  }
                  supportWcagInitialFocus();
                });
              }).attr({'role': 'button', 'aria-label': removeBtn});
              $(target).find('.uploadFiles').append(fileTemplate);
            }
          });
        },
      });
    }
  
    var link = $('#' + dialog_link_id).attr('href');
    var dialog_link = link + '&itemUID=' + objCommUID;
  
    if ($(target).length === 0) {
      $.get(
          dialog_link,
          '',
          function (data) {
            createUploadDialogFromHTML(target, data, callbacks);
            showUploadDialog1(element, target, objCommUID);
          },
          'html'
      );
    } else {
      showUploadDialog1(element, target, objCommUID);
    }
  }
  
  function removeUploadStatus(wcagContainer, dialog){
    wcagContainer.text('');
    $(dialog).find('.progressStatus').css('width', '0');
    $(dialog).find('.uploadProgressAll').removeClass('done invalid').attr('data-title', '');
  }
  
  function createUploadDialogFromHTML(target, data, callbacks) {
    var jqXHR = [];
    var $data = $(data).appendTo('body');
    var maxFilesCount = 2;
    if ($(target).length == 0) {
      $data.find('.popupBox').addBack('.popupBox').attr('id', target.substring(1));
    }
    $('.popupCancel', target).on('click', function (event) {
      event.preventDefault();
      for (i = 0; i < jqXHR.length; i++) {
        jqXHR[i].abort();
      }
      hideUploadDialog('hide');
      $(target).remove();
    });
    $('.fileupload', target).each(function () {
      var wcag_status_container = jQuery(target).find('.wcag-status-helper');
      var currentUploadCount = 0;
      var isdropzone = !!$(this).attr('no-dropzone');
      var fileUpload = $(this)
          .fileupload({
            dataType: 'json',
            limitConcurrentUploads: maxFilesCount,
            add: function (e, data) {
              var uploadErrors = [];
  
              wcag_status_container.text('');
  
              if (data.files[0].name.length) {
                var fileExt = data.files[0].name.split('.').pop().toLowerCase();
  
                if (
                    fileExt !== 'png' &&
                    fileExt !== 'jpeg' &&
                    fileExt !== 'jpg' &&
                    fileExt !== 'tif' &&
                    fileExt !== 'pdf'
                ) {
                  uploadErrors.push($(this).attr('data-ext-error-message'));
                }
              }
              if (data.files[0].size && data.files[0].size > 1024 * 1000 * 20) {
                uploadErrors.push($(this).attr('data-size-error-message'));
              }
              if (typeof data.files[0].size !== 'undefined' && data.files[0].size === 0) {
                uploadErrors.push($(this).attr('data-empty-file-error-message'));
              }
              var allFiles = $(target).find('.uploadOneFileLink').length + currentUploadCount + 1;
              if (allFiles > 10) {
                uploadErrors.push($(this).attr('data-max-file-reached-error-message'));
              }
              if (uploadErrors.length > 0) {
                var fileTemplate = $(
                    '<div class="uploadOneFile"><span class="uploadOneFileLinkError">' +
                    data.files[0].name +
                    '</span><a href="#"  class="uploadOneFileRemove"></a><div class="uploadOneFileLinkErrorMessage">' +
                    uploadErrors[0] +
                    '</div></div>'
                );
                $('.uploadOneFileRemove', $(fileTemplate)).on('click', function (event) {
                  event.preventDefault();
  
                  $(this).parent().remove();
  
                  $(target).find('.uploadProgressAll').removeClass('done invalid').addClass('done').attr('data-title', fileRemoved);
                  wcag_status_container.text(data.files[0].name + '. ' +  fileRemoved);
  
                  setTimeout(function (){
                    removeUploadStatus(wcag_status_container, target);
                  }, 5000);
  
                  supportWcagInitialFocus();
                }).attr({'role': 'button', 'aria-label': removeBtn});
                $(target).find('.uploadFiles').append(fileTemplate);
                $('.uploadProgressAll', target).removeClass('done').addClass('invalid').attr('data-title', 'Upload Error');
  
                setTimeout(function (){
                  wcag_status_container.text('Upload Error. ' + data.files[0].name + ' ' + uploadErrors[0]);
                }, 100);
  
                setTimeout(function (){
                  supportWcagInitialFocus();
                }, 200);
  
              } else {
                currentUploadCount++;
                $(target).addClass('uploadCustom-loading');
                wcag_status_container.text(uploadingTheFile);
                data.submit();
              }
            },
            done: function (e, data) {
              $.each(data.result, function (index, file) {
                currentUploadCount--;
                if (!file.defaultErrorMessage) {
  
                  var fileTemplate = $(
                      '<div class="uploadOneFile"><a href="' +
                      $('#open_document_link').attr('href') +
                      file.itemUID +
                      '&docID=' +
                      file.documentID +
                      '" class="uploadOneFileLink" target="_blank">' +
                      file.name +
                      '</a><a href="#"  class="uploadOneFileRemove" data-delete-link="' +
                      $('#delete_document_link').attr('href') +
                      file.itemUID +
                      '&docID=' +
                      file.documentID +
                      '"></a></div>'
                  );
                  $('.uploadOneFileRemove', $(fileTemplate)).on('click', function (event) {
                    event.preventDefault();
                    $(target).addClass('uploadCustom-loading');
                    wcag_status_container.text(removingTheFile);
                    var url = $(this).attr('data-delete-link');
                    var _this = this;
                    $.ajax({ url: url }).done(function (data) {
                      $(_this).parent().remove();
                      $(target).find('.uploadProgressAll').removeClass('done invalid').addClass('done').attr('data-title', fileRemoved);
                      wcag_status_container.text(file.name + '. ' +  fileRemoved);
                      $(target).removeClass('uploadCustom-loading');
  
  
                      setTimeout(function (){
                        removeUploadStatus(wcag_status_container, target);
                      }, 5000);
  
                      recountPopupOffset();
                      supportWcagInitialFocus();
                    });
                  }).attr({'role': 'button', 'aria-label': removeBtn});
  
                  $(target).find('.uploadFiles').append(fileTemplate);
                  wcag_status_container.text(jQuery('.uploadProgressAll', target).attr('data-title') + ' ' + file.name + '.');
                  $(target).find('.uploadPlaceholder').next('.formError').remove();
                  $(target).find('.formErrorAll').remove();
                  recountPopupOffset();
                } else {
                  var fileTemplate = $(
                      '<div class="uploadOneFile"><span class="uploadOneFileLinkError">' +
                      file.fileName +
                      '</span><a href="#"  class="uploadOneFileRemove"></a><div class="uploadOneFileLinkErrorMessage">' +
                      file.defaultErrorMessage +
                      '</div></div>'
                  );
                  $('.uploadOneFileRemove', $(fileTemplate)).on('click', function (event) {
                    event.preventDefault();
                    $(this).parent().remove();
                    if ($(target).find('.uploadOneFile').length < 1) {
                      removeUploadStatus(wcag_status_container, target);
                    }
                    recountPopupOffset();
                    supportWcagInitialFocus();
                  }).attr({'role': 'button', 'aria-label': removeBtn});
                  $(target).find('.uploadFiles').append(fileTemplate);
                  wcag_status_container.text(file.fileName + ' ' + file.defaultErrorMessage);
                  recountPopupOffset();
                  supportWcagInitialFocus();
                }
                if (currentUploadCount === 0) {
                  $(target).removeClass('uploadCustom-loading');
                  supportWcagInitialFocus();
                }
              });
            },
            progressall: function (e, data) {
              var uploadContainerId = $(this).closest('.popupBox').attr('id');
              var progress = parseInt((data.loaded / data.total) * 100, 10);
  
              if (progress === 100) {
  
                $('.uploadProgressAll', target).removeClass('invalid').addClass('done').attr('data-title', $(this).attr('data-progress-finish'));
                $('.uploadProgressAll .progressStatus', target).css('width', progress + '%');
  
              } else {
                $('.uploadProgressAll', target)
                    .removeClass('invalid')
                    .attr('data-title', $(this).attr('data-progress') + progress + '%');
                $('.uploadProgressAll .progressStatus', target).css('width', progress + '%');
              }
            },
            dropZone: (function () {
              return isdropzone ? null : $('.uploadPlaceholder', target);
            })(),
          })
          .on('fileuploadadd', function (e, data) {
            jqXHR.push(data);
          });
      fileUpload
          .prop('disabled', !$.support.fileInput)
          .parent()
          .addClass($.support.fileInput ? undefined : 'disabled');
    });
    if (callbacks) {
      $.each(callbacks, function (selector, onclick) {
        $data.find(selector).on('click', onclick);
      });
    }
  }
  
  function deleteAllDocuments(objCommUID) {
    $('.uploadFiles').html('');
    $('.progressStatus').css('width', '0');
    $('.uploadProgressAll').removeClass('done invalid').attr('data-title', '');
  
    $.ajax({
      type: 'GET',
      url: $('#delete_all_documents_link').attr('href') + objCommUID,
    });
  }
  
  function deleteDocument(objCommUID, documentID) {
    $.ajax({
      type: 'GET',
      url: $('#delete_document_link').attr('href') + objCommUID + '&docID=' + documentID,
    });
  }
  
  function initOnUpload(element, target, objCommUID) {
    var custom_select = jQuery('#fileType', target);
  
    if ($(target).find('form').hasClass('needValidate')) {
      var form = $(target).find('form');
      form = form.hr_validator();
    }
  
    $('.uploadButtons a:nth-child(1)', $(target)).off('click');
  
    $('.uploadButtons a:nth-child(1)', $(target)).on('click', function (event) {
      onUpload(event, element, target, objCommUID, form);
    });
  
    if (typeof isWcag !== 'undefined' && !custom_select.is(':focus') && isWcag && wcagACMethods) {
      wcagACMethods.holdFocusWcagDialog(jQuery(target).attr('id'))
    }
  }
  
  function onUpload(event, element, target, objCommUID, form) {
    event.preventDefault();
    var formValid = true;
    if ($(this).hasClass('checkFiles')) {
      if ($(this).parent().parent().find('.uploadFiles').find('.uploadOneFileLink').length < 1) {
        var $uploadPlaceholder = $(this).parent().parent().find('.uploadPlaceholder');
        var errorMessage = $uploadPlaceholder.parent().attr('data-error-message');
  
        if (errorMessage == null) {
          errorMessage = $uploadPlaceholder.parent().parent().attr('data-error-message');
        }
  
        if (!$uploadPlaceholder.next().hasClass('formError')) {
          $uploadPlaceholder.after('<div class="formError">' + errorMessage + '</div>');
        } else {
          $uploadPlaceholder.next().html(errorMessage).show();
        }
        formValid = false;
      }
    }
    if ($(form).hasClass('needValidate')) {
      if (!$('.notApplicable', form).prop('checked')) {
        if (!form.hr_validator('check')) formValid = false;
      } else {
        formValid = true;
      }
    }
    if (!formValid) return false;
  
    var isDecriptionPresent = $('#description').length > 0;
    var isNotApplicableChecked = $('.notApplicable', form).prop('checked') ? 'true' : 'false';
    var postData = { not_applicable: isNotApplicableChecked };
    var postObjCommUID = objCommUID;
  
    if (isDecriptionPresent) {
      postData.itemDescription = $(target).find('textarea.downloadFileDescription').val();
      postObjCommUID = $(target).find('#itemUID').val();
    }
  
    var showErrorFunc = function (errorMessage) {
      var $textareaDescr = $(target).find('textarea.downloadFileDescription');
      if (!$textareaDescr.length) {
        $textareaDescr = $(target).find('.uploadPlaceholder');
      }
      if (!$textareaDescr.next().hasClass('formError')) {
        $textareaDescr.after('<div class="formError">' + errorMessage + '</div>');
      } else {
        $textareaDescr.next().html(errorMessage).show();
      }
    };
  
    $.ajax({
      type: 'POST',
      data: postData,
      url: $('#process_upload_complete_link').attr('href') + postObjCommUID,
    })
        .done(function (data) {
          var errorMessage;
          if (data.error) {
            errorMessage =
                (data.error.message || 'Unexpected error') +
                (data.error.id && data.error.id > 0 ? ' (ID=' + data.error.id + ')' : '');
          } else if (data.defaultErrorMessage) {
            errorMessage = data.defaultErrorMessage;
          }
  
          if (errorMessage) {
            showErrorFunc(errorMessage);
          } else {
            uploadDone(element, target, postData.itemDescription);
          }
        })
        .fail(function () {
          showErrorFunc('Unexpected error');
        });
  }
  
  function showUploadDialog1(element, target, objCommUID) {
    $(target).find('.formError').remove();
    $(target).find('.formErrorAll').remove();
  
    $(target)
        .find('input[type="text"], input[type="password"], textarea, label')
        .each(function () {
          $(this).attr('nodevalid', 'true');
        });
  
    $(target).fadeIn('fast').attr('tabindex', '-1').focus();
    recountPopupOffset();
    $(target).hr_selectstyler();
  
    initOnUpload(element, target, objCommUID);
  }
  
  function uploadDone(element, target, itemDescription) {
    var currentDate = new Date();
    if (element) {
      hideUploadDialog();
      var thisAction = $(element).closest('.one-action-container');
      var thisNumber = $(thisAction).find('.one-action-number');
      var thisLinks = $(thisAction).find('a');
      var thisText = $(thisAction).find('.one-action-desc');
      $(thisLinks).animate({ color: '#b0b0b0' }, 'fast');
      $(thisNumber).animate({ backgroundColor: '#b0b0b0' }, 'slow');
      $(thisText).animate({ color: '#ffffff' });
      $(thisAction)
          .delay(500)
          .addClass('greyAction')
          .slideUp('normal', function () {
            $(this).remove();
            var customName = itemDescription || $(element).attr('data-name');
            $('.informationReceivedContainer h2').after(
                '<div class="reportInfoReceived opacity"><table><tr><td>' +
                customName +
                '</td><td><span>' +
                getCurrentLocaleDateFormatted(currentDate) +
                '</span></td></tr></table></div>'
            );
            $('.informationReceivedContainer .opacity').slideDown('normal', function () {
              $(this).find('a').css('backgroundColor', '#fdf1a0');
              $(this).animate({ opacity: 1 }, 'fast', function () {
                $(this).removeClass('opacity');
                $(this).find('a').animate({ backgroundColor: 'transparent' }, 'slow');
              });
            });
            recountActions();
          });
    } else {
      var customName = itemDescription || $('#fileType option:selected').text();
      var $linksArray = $('.uploadOneFileLink').clone().removeClass('uploadOneFileLink').addClass('link');
      var $containerHeader = $('.reportInfoReceived span').filter(function () {
        return $(this).text() === customName;
      });
      var $container;
      if ($containerHeader.length == 0) {
        $container = $(
            '<div class="reportInfoReceived opacity"><table><tr><td><span>' +
            customName +
            '</span></td><td><span>' +
            getCurrentLocaleDateFormatted(currentDate) +
            '</span></td></tr></table></div>'
        );
        $('.informationReceivedContainer h2').after($container);
      } else {
        $container = $containerHeader.first().parent();
      }
      $linksArray.appendTo($container);
      $container.find('> .link').wrap('<div class="document_upload_file"/>');
      hideUploadDialog();
      if ($(target).hasClass('uploadCustom')) {
        $(target).remove();
      }
      $('.informationReceivedContainer .opacity').slideDown('normal', function () {
        $(this).find('a').css('backgroundColor', '#fdf1a0');
        $(this).animate({ opacity: 1 }, 'fast', function () {
          $(this).removeClass('opacity');
          $(this).find('a').animate({ backgroundColor: 'transparent' }, 'slow');
        });
      });
    }
  }
  
  function showPasswordResetDialog() {
    $('#overlay').fadeIn('fast');
    $('#passwordResetDialog').fadeIn('fast');
    recountPopupOffset();
  }
  
  function showCountryCodeDialog() {
    $('#overlay').fadeIn('fast');
    $('#countryCodeDialog').fadeIn('fast');
    recountPopupOffset();
    $('#countryCodeLookupFrame').attr('src', $('#country_code_dialog_link').attr('href'));
    $('#countryCodeLookupFrame').load(function () {
      this.style.height = this.contentWindow.document.body.offsetHeight + 'px';
      $('#countryCodeLookupFrame').contents().find('.countryCodeDialogInput').find('input').focus();
    });
  }
  
  function updateCountryCode(countryCode) {
    $('#countryCode').val(countryCode);
    if (countryCode != null) {
      CommunicationPreferences.setPhoneValidationPattern('countryCode', 'mobilePhoneNumber');
      CommunicationPreferences.formatPhone('countryCode', 'mobilePhoneNumber');
      CommunicationPreferences.validateMobilePhone();
    }
    closeModalDialog();
  }
  
  function closeModalDialog() {
    $('#overlay').fadeOut('fast');
    $('.popupBox').fadeOut('fast');
    $('#mobilePhoneNumber').focus();
    $('.wrapper').show();
  }
  
  function supportWcagInitialFocus(str) {
    var dialog = jQuery('.popupBox:visible');
    var hide = str === 'hide';
    var invalidFile = dialog.find('.uploadOneFileLinkErrorMessage:visible');
    var filesContainer = dialog.find('.uploadFiles .uploadOneFile');
  
  
    if (typeof isWcag !== 'undefined' && isWcag && wcagACMethods) {
  
      var btn = jQuery('#' + wcagACMethods.focusHandling.uploadDocument + ':visible');
      var selectFilesBtn = dialog.find('#' + wcagACMethods.focusHandling.selectFiles + ':visible');
  
      if (hide && btn.length) {
        wcagACMethods.focusHandling = {};
        btn.focus();
  
      } else if (!hide && wcagACMethods.focusHandling.selectFiles.length) {
  
        if (invalidFile.length &&
            (filesContainer.index(invalidFile.last().closest('.uploadOneFile')) === filesContainer.length - 1)) {
          invalidFile.parent().find('.uploadOneFileRemove').focus();
        } else {
          selectFilesBtn.focus();
        }
  
      }
    }
  }
  
  function hideUploadDialog() {
    var currentPopup = jQuery('.popupBox:visible');
    var wcagContainer = currentPopup.find('.wcag-status-helper');
  
    removeUploadStatus(wcagContainer, currentPopup);
  
    $('#overlay').fadeOut('fast');
    $('.popupBox').fadeOut('fast');
    $('.popupBox .uploadButtons a:nth-child(1)').off('click');
    $('.wrapper').show();
    setTimeout(function(){
      $('#wrapper').removeAttr('aria-hidden');
    }, 100)
  
    supportWcagInitialFocus('hide');
  }
  
  function recountActions() {
    var counter = 0;
    $('.actionsContainer .one-action-container').each(function (index) {
      counter++;
      $(this)
          .find('.one-action-number')
          .html(index + 1);
    });
  
    if (counter < 1) {
      $('.actionsContainer').slideUp('normal', function () {
        $(this).remove();
      });
      $('.thxContainer').slideDown();
      $('.wrapper').wrap('<div class="back"></div>');
      $('#circle_verify').attr('class', 'circle circleGreen');
      $('#line_report').attr('class', 'circleLine lineGreenBlue');
      $('#lbl_verification').attr('class', 'textGreen');
    }
  }
  
  Date.prototype.getMonthName = function () {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][this.getMonth()];
  };
  
  function isMobile() {
    var userAgent = navigator.userAgent.toLowerCase();
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  }
  
  function isIOS(){
    return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].indexOf(navigator.platform) !== -1
        || (navigator.userAgent.indexOf("Mac") !== -1 && "ontouchend" in document)
  }
  
  function isTablet(){
    var userAgent = navigator.userAgent.toLowerCase();
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
  }
  
  function detectDevice(){
    return isTablet() ? 'Tablet' : isMobile() ? 'Mobile' : 'Desktop';
  }
  
  function recountPopupOffset() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
  
    $('.popupBox:visible').each(function () {
      var popupWidth = $(this).innerWidth() / 2;
      var popupHeight = $(this).innerHeight() / 2;
      if ((popupHeight * 2 < windowHeight) && (popupWidth * 2 < windowWidth) && (detectDevice() === 'Desktop')) {
        $(this).css('position', 'fixed');
        $(this).css('margin-top', '-' + popupHeight + 'px');
        $(this).css('margin-left', '-' + popupWidth + 'px');
        $(this).css('top', '50%');
        $(this).css('left', '50%');
      } else if(detectDevice() === 'Mobile' || windowWidth <= 600){
        jQuery(this).css({
          'margin': '0',
          'left': '0',
          'top': '50%',
          'right': '0',
          'bottom': 'auto',
          'transform': 'translateY(-50%)',
          'width': '100%'
        })
      } else {
        $(this).css('position', 'absolute');
        var scrollTop = $(window).scrollTop();
        var topX = scrollTop + (windowHeight - popupHeight * 2) / 2;
        if (topX < 0) topX = 0;
        $(this).css('margin-top', topX + 'px');
        $(this).css('top', '0%');
        if (popupWidth * 2 == windowWidth) {
          $(this).css('left', '0%');
          $(this).css('margin-left', '0%');
        } else {
          $(this).css('left', '50%');
          $(this).css('margin-left', '-' + popupWidth + 'px');
        }
      }
      if (windowWidth <= 480) {
        $('.wrapper').hide();
        $(this).css('margin-top', '0');
        $('#overlay').addClass('popupWhiteBg');
      } else {
        $('.wrapper').show();
        $('#overlay').removeClass('popupWhiteBg');
      }
    });
  }
  
  function recountCreatePasswordContainerLabel() {
    var maxheight = 0;
    $('.createPasswordContainerLabel').each(function () {
      $(this).css('height', 'auto');
    });
    $('.createPasswordContainerLabel').each(function () {
      if (maxheight < $(this).height()) maxheight = $(this).height();
    });
    $('.createPasswordContainerLabel').each(function () {
      if ($(this).height() < maxheight && $(this).parent().css('display') !== 'block') $(this).height(maxheight);
    });
  }
  
  $(document).ready(function () {
    recountCreatePasswordContainerLabel();
  });
  
  if (window.attachEvent) {
    window.attachEvent('onresize', function () {
      recountPopupOffset();
      recountCreatePasswordContainerLabel();
    });
  } else if (window.addEventListener) {
    window.addEventListener(
        'resize',
        function () {
          recountPopupOffset();
          recountCreatePasswordContainerLabel();
        },
        false
    );
  }
  
  function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return myNav.indexOf('msie') != -1 ? parseInt(myNav.split('msie')[1]) : false;
  }
  
  function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }
  
  if (typeof BackgroundCheck !== 'undefined' && !(isIE() && isIE() <= 9 && isIE() > 1)) {
    document.addEventListener('DOMContentLoaded', function () {
      BackgroundCheck.init({
        targets: '.bgCheck',
        maxDuration: 5000,
        threshold: 90,
      });
    });
  }
  
  $(document).bind('dragover', function (e) {
    var dropZone = $('.uploadPlaceholder'),
        foundDropzone,
        timeout = window.dropZoneTimeout;
    dropZone.addClass('in');
    if (!timeout) {
      dropZone.addClass('in');
    } else {
      clearTimeout(timeout);
    }
    var found = false,
        node = e.target;
    do {
      if ($(node).hasClass('uploadPlaceholder')) {
        found = true;
        foundDropzone = $(node);
        break;
      }
      node = node.parentNode;
    } while (node != null);
    dropZone.removeClass('hover');
    if (found) {
      foundDropzone.addClass('hover');
    }
    window.dropZoneTimeout = setTimeout(function () {
      window.dropZoneTimeout = null;
      dropZone.removeClass('in hover');
    }, 100);
  });
  
  $(document).bind('drop dragover', function (e) {
    e.preventDefault();
  });
  
  function showAjaxFormDialog(link) {
    $.ajax(link).done(function (data) {
      $('.ajaxFormContainer').html(data);
      $('#overlay').fadeIn('fast');
      $('#ajaxForm').fadeIn('fast');
      recountPopupOffset();
    });
  }
  
  function updateDate() {
    var label = $('#dobLabel');
    var dobValue = $('#hiddenDobValue');
    var yControl = $('#dobYear');
    var year = yControl.val();
    var mControl = $('#dobMonth');
    var month = mControl.val();
    var dControl = $('#dobDay');
    var day = dControl.val();
    if (year == null || month == null || day == null) {
      label.attr('nodevalid', 'false');
      dobValue.val('');
      isDobValid = false;
      return;
    }
  
    var februaryLength = 28;
    if ($.isNumeric(year) && isLeapYear(year)) {
      februaryLength = 29;
    }
    if (month == '02' && $.isNumeric(day) && parseInt(day) > februaryLength) {
      label.attr('nodevalid', 'false');
      dobValue.val('');
      isDobValid = false;
      return;
    }
  
    if ((month == '04' || month == '06' || month == '09' || month == '11') && $.isNumeric(day) && parseInt(day) > 30) {
      label.attr('nodevalid', 'false');
      dobValue.val('');
      isDobValid = false;
      return;
    }
  
    label.attr('nodevalid', 'true');
    dobValue.val(year + '-' + month + '-' + day);
    isDobValid = true;
  }
  
  function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }
  
  function APopenChat() {
    var width = 750;
    var height = 600;
    var top, left;
  
    if (document.layers || (navigator.appName.indexOf('Netscape') != -1 && navigator.appVersion >= '5')) {
      left = window.screenX + window.innerWidth / 2 - width / 2;
      top = window.screenY + window.innerHeight / 2 - height / 2;
    } else {
      left = window.screenLeft + window.document.body.clientWidth / 3 - width / 2;
      top = window.screenTop + window.document.body.clientHeight / 3 - height / 2;
    }
  
    var openChatLink = $('#open_chat_link_id')[0].href;
  
    var params =
        'width=' + width + ',height=' + height + ',screenX=' + left + ',screenY=' + top + ',left=' + left + ',top=' + top;
  
    var wnd = window.open(openChatLink, 'help', params);
    if (wnd.opener == null) wnd.opener = self;
    wnd.focus();
  
    return wnd;
  }
  
  function showLogoutConfirm() {
    $('#overlay').fadeIn('fast');
    $('#confirmLogout').fadeIn('fast').attr('tabindex', '-1').focus();
    recountPopupOffset();
    $('#wrapper').attr('data-target-focus', 'logout_link');
  }
  
  function hideLogoutConfirm() {
    hideUploadDialog();
  }
  
  function logout(redirectUrl) {
    if (isFormCurrentlyOpened()) {
      redirectUrl += '&formIsCurrentlyOpen=true';
    }
    window.location.href = redirectUrl;
  }
  
  function showSubrequestCreationErrorPopup() {
    $('#overlay').fadeIn('fast');
    $('#subrequestCreationErrorPopup').fadeIn('fast');
    recountPopupOffset();
  }
  
  var sCurrentOpenedFormUID = null;
  function setCurrentOpenedFormUID(sFormUID) {
    sCurrentOpenedFormUID = sFormUID;
  }
  
  function getCurrentOpenedFormUID() {
    return sCurrentOpenedFormUID;
  }
  
  function isFormCurrentlyOpened() {
    return sCurrentOpenedFormUID != null;
  }
  
  function disableTimeSelects(){
    var timeSelects =  jQuery('.communicationPreferencesTimeFrom select, .communicationPreferencesTimeTo select, .communicationPreferencesTimeZone select');
  
    timeSelects.attr('disabled', 'disabled');
    timeSelects.parent().addClass('disabled');
  }
  
  function enableTimeSelects(){
    var timeSelects =  jQuery('.communicationPreferencesTimeFrom select, .communicationPreferencesTimeTo select, .communicationPreferencesTimeZone select');
  
    timeSelects.removeAttr('disabled');
    timeSelects.parent().removeClass('disabled');
  }
  
  function uploadControl(event, el) {
    event.preventDefault();
    var element = jQuery(el);
    var inputFile = element.parent().find('.fileupload');
  
    inputFile.click();
  
    if ((typeof isWcag !== 'undefined' && isWcag && wcagACMethods) &&
        (element.attr('class') === 'upload_input' || element.is('[class*="uploadOneFileRemove"]'))) {
      wcagACMethods.focusHandling.selectFiles = element.attr('id');
    }
  }
  
  function supportScreenReaders(event, el){
    event.preventDefault();
  
    var element = jQuery(el)
    var key = event.key;
    var isNavigationKey = key === "ArrowDown" || key === "ArrowUp";
    var isNavigationKeyIE = key === "Down" || key === "Up"; 
    var wcagStatusContainer = element.find('.phoneCustomBoxCodeImage .wcag-status-helper');
  
    wcagStatusContainer.attr('aria-hidden', 'true');
  
    if(isNavigationKey || isNavigationKeyIE) {
      wcagStatusContainer.attr('aria-hidden', 'false')
          .text(element.closest('.phoneCustomBox').next().find('.phoneCodeCurrent .phoneCustomBoxPopupCountryName').text());
    }
  }
  