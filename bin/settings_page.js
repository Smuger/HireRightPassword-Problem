function saveInstructionsPage() {
    $("#pwErrorMessage1").text("");
    $("#pwErrorMessage2").text("");
    $('.communicationPreferencesError').hide();

    if (!checkPasswordQuality())
    {
        $('html, body').animate({scrollTop: $(".passwordFormContainer").offset().top-20}, 200);
        return;
    }

    if (!checkPasswordMatch())
    {
        $('html, body').animate({scrollTop: $(".passwordFormContainer").offset().top-20}, 200);
        return;
    }

	var isRecieveSmsSelected=$("#sms_subscribe_yes").prop("checked");
	if (isRecieveSmsSelected) {
		var phoneInput=$('.communicationPreferencesPhoneNumber input');
		var phoneNumber = phoneInput.val().trim();
		if (!phoneNumber || !CommunicationPreferences.validateMobilePhone()) {
    		$('.smsPhoneError').html(phoneInput.attr('data-error-message'));
    		$('.smsPhoneError').show();
			$('#mobilePhoneNumber').attr('snodevalid',false);
    		$('html, body').animate({scrollTop: $(".passwordFormContainer").offset().top-20}, 200);
    		return;
    	}
		$("#hiddenCountryCode").val(CommunicationPreferences.getSmsPhoneCountryCode('countryCode'));
    	$("#hiddenCountryA2").val(CommunicationPreferences.getSmsPhoneCountryA2('countryCode'));
	}
    $("#change_password_form").submit();
}

function returnToForm()
{
	var link = $("#status_page_link_id")[0].href;
	window.location.href = link;
	window.focus();
}

function openHelpDesk()
{
	var url = getServletContext();
	var data = {
		event:	'ac2_show_help_desk'
	};
	$.ajax({
		type: 'POST',
		url: url,
		data: data
	}).done(function(data, textStatus, originalRequest){
		if(data.hasOwnProperty("title") && data.hasOwnProperty("text")) {
				$("#helpDialog").find(".popupHeader").html(data.title);
				$("#helpDialog").find(".popupDesc").html(data.text);
				$("body").css("overflow-y", "hidden");
				$('#overlay').fadeIn('fast');
				$("#helpDialog").fadeIn('fast');
				recountPopupOffset();
		}
	});
}

function checkPhone () {
    var $codeControl=$('#countryCode');
    if ($codeControl.val()!=='' && CommunicationPreferences.validateMobilePhone()) {
        $('#yes_no2').find('.form__block').addClass('form__block-white_bg');
        return true;
    } else {
        $('#yes_no2').find('.form__block').removeClass('form__block-white_bg');
        return false;
    }
}

function handleErrorFader() {

	clearErrorFader();

	var errors = jQuery('.required_error .form__block__center__label, .label-required-error');
	var sections_container = jQuery('.accent_error_section');
	var fader_error_content = {};

	if (errors.length) {

		for (var i = 0; i < errors.length; i++) {
			fader_error_content[i] = {
				title: jQuery(errors[i]).closest('.fc__block__body').prev().text(),
				name: jQuery(errors[i]).text()
			};

			if (sections_container.find(':contains(' + fader_error_content[i].title + ')').length === 0) {
				sections_container.find('fieldset').append('<div class="section_error">' + fader_error_content[i].title + '</div>');
			}
			sections_container.find('fieldset').append('<a href="#' + jQuery(errors[i]).next().find('input:visible').attr('id') + '" class="field_error" role="button">' + fader_error_content[i].name + '</a>');
		}
		sections_container.show();

		if(typeof isWcag !== 'undefined' && isWcag && wcagACMethods){
			wcagACMethods.focusErrorHeader();
		}
	}
}

function clearErrorFader() {

	jQuery('.accent_error_section .section_error, .accent_error_section .field_error').each(function () {
		jQuery(this).remove();
	});

}

function closePasswordModal(modalId, wrapperId, focusedLinkId) {
	jQuery('#' + modalId).fadeOut(200);
	jQuery('#' + wrapperId).fadeOut(200);

	setTimeout(function (){jQuery('#' + focusedLinkId).focus()},100);
}

function openPasswordModal(modalId, wrapperId, closeBtnId) {

	var modal = jQuery('#' + modalId);
	var closeBtn = jQuery('#' + closeBtnId);
	var modalWrapper = jQuery('#' + wrapperId);

	jQuery(':focus').blur();
	modal.fadeIn(200);
	modalWrapper.fadeIn(200);

	if (isWcag && !!wcagACMethods) {
		wcagACMethods.holdFocusWcagDialog(modalId);
	} else {
		closeBtn.focus();
	}
}

function initPasswordModal() {
	var $passwordModal = jQuery("#passwordModal");
	var $passwordModalWrapper = jQuery('#passwordModalWrapper');
	var $passwordLink = jQuery('#passwordLink');
	var $closeBtn = jQuery('#closeBtn');

	if(isIOS() && isWcag){
		$passwordLink.attr('aria-hidden', true).css('pointer-event', 'none');
		return
	}

	$passwordLink.on('click keydown', function (event) {
		event.stopPropagation();

		var code = event.keyCode || event.which;

		if (event.type === 'click' || code === 13) {
			event.preventDefault();
			openPasswordModal('passwordModal', 'passwordModalWrapper', 'closeBtn');
		}
	});

	$closeBtn.on('click keydown', function (event) {
		event.stopPropagation();

		var code = event.keyCode || event.which;

		if (event.type === 'click' || code === 13 || code === 27) {
			event.preventDefault();
			closePasswordModal('passwordModal', 'passwordModalWrapper', 'passwordLink');
		}
	});

	if (!isMobile()) {
		$passwordModal.on('keydown', function (event) {
			event.stopPropagation();

			var isVisible = $passwordModal.is(':visible');
			var code = event.keyCode || event.which;

			if (code === 27 && isVisible) {
				closePasswordModal($passwordModal.attr('id'), $passwordModalWrapper.attr('id'), $passwordLink.attr('id'));
			}
		});
	}
}

jQuery(window).on('load', initPasswordModal);

(function($) {
	$(function() {
		$('#text_notification_yes').on('change',function(){
			if ($(this).prop('checked')) {
				setTimeout(function () {
					$('#phone_select2').slideDown('fast');
					$('#mobilePhoneNumber').prop("disabled", false);
				}, 100);
			}
			$('#yes_no2').find('.form__block').removeClass('form__block-white_bg');
			$('#yes_no2').find('.required_error_hidden').removeClass('required_error_hidden');
			$('#yes_no2').find('.required_error').removeClass('required_error').addClass('required_error_hidden');
			CommunicationPreferences.formatPhone('countryCode', 'mobilePhoneNumber');
			CommunicationPreferences.setPhoneValidationPattern('countryCode', 'mobilePhoneNumber');
			checkPhone ();
		});
        $('#text_notification_no').on('change',function(){
			if ($(this).prop('checked')) {
				$('#phone_select2').slideUp('fast');
				$('#mobilePhoneNumber').prop("disabled", true);
			}
			$('#yes_no2').find('.form__block').addClass('form__block-white_bg');
			$('#yes_no2').find('.required_error_hidden').removeClass('required_error_hidden');
			$('#yes_no2').find('.required_error').removeClass('required_error').addClass('required_error_hidden');
		});

		$('.fc__i__text').each(function(){checkUp(this)});

		function checkUp (element) {
			var $input=$(element);
			$input.on('focus',function(){
				var $this=$(this);
				if ($this.hasClass('radio_child')) {
					$(this).closest('.required_error').parent().find('.required_error').removeClass('required_error').addClass('required_error_hidden');
				} else {
					$(this).closest('.required_error').removeClass('required_error').addClass('required_error_hidden');
				}
			});
		}

		$('.fc__next__button').on('click',function(event){
			event.preventDefault();

			var tel_label = jQuery('[for="mobilePhoneNumber"]');
			var radio_yes = jQuery('#text_notification_yes');
			var radio_no = jQuery('#text_notification_no');

			var $notValid=$('*:visible[snodevalid=false]');

			if (!radio_yes.prop('checked') && !radio_no.prop('checked')) {
				$('#yes_no2').find('.form__block').removeClass('required_error_hidden').addClass('required_error');
			} else if (!$('#text_notification_no').prop('checked')) {
				if(!checkPhone()){
					tel_label.addClass('label-required-error');
					tel_label.closest('#phone_select2').addClass('required_error')
				}  else {
					tel_label.removeClass('label-required-error');
					tel_label.closest('#phone_select2').removeClass('required_error')
				}
			} else {
				tel_label.removeClass('label-required-error');
			}

			if($notValid.length || $('.required_error').length) {
				$notValid.each(function(){
					var $this=$(this);
					if ($this.hasClass('radio_child')) {
						$this.closest('.form__block').parent().find('.form__block').removeClass('required_error_hidden').addClass('required_error');
					} else {
						$this.closest('.form__block').removeClass('required_error_hidden').addClass('required_error');
					}
				});

				handleErrorFader();
				jQuery("html, body", parent.document).animate({ scrollTop: 0 }, "fast");
				return false;
			}

			if ($('#text_notification_yes').prop('checked')) {
				$("#hiddenCountryCode").val(CommunicationPreferences.getSmsPhoneCountryCode('countryCode'));
				$("#hiddenCountryA2").val(CommunicationPreferences.getSmsPhoneCountryA2('countryCode'));
			}
			$("#change_password_form").submit();
		});


		if(countries){
            var countriesOffset={'AF':'-2311px','AL':'-1034px','DZ':'-528px','AS':'-1562px','AD':'-594px','AO':'-1947px','AI':'-1980px','AG':'-869px','AR':'-2377px','AM':'-176px','AW':'-792px','AC':'-55px','AU':'-1716px','AT':'-1331px','AZ':'-1243px','BS':'-363px','BH':'-1496px','BD':'-1771px','BB':'-1573px','BY':'-1100px','BE':'0px','BZ':'-484px','BJ':'-1298px','BM':'-1914px','BT':'-1848px','BO':'-1650px','BA':'-1584px','BW':'-2707px','BR':'-770px','IO':'-55px','VG':'-1408px','BN':'-1683px','BG':'-2586px','BF':'-726px','BI':'-1892px','KH':'-242px','CM':'-2057px','CA':'-1375px','CV':'-2652px','BQ':'-2719px','KY':'-308px','CF':'-1837px','TD':'-814px','CL':'-1342px','CN':'-825px','CO':'-330px','KM':'-1430px','ZR':'-1518px','CG':'-1793px','CK':'-2267px','CR':'-2090px','CI':'-1661px','HR':'-902px','CU':'-748px','CW':'-2729px','CY':'-561px','CZ':'-2256px','DK':'-1386px','DJ':'-2101px','DM':'-2432px','DO':'-1529px','EC':'-1188px','EG':'-2201px','EH':'-2916px','SV':'-1639px','GQ':'-1507px','ER':'-715px','EE':'-2410px','ET':'-2443px','FK':'-2762px','FO':'-1111px','FJ':'-1859px','FI':'-1903px','FR':'-1012px','GF':'-2234px','PF':'-1705px','GA':'-880px','GM':'-627px','GE':'-858px','DE':'-2509px','GH':'-2112px','GI':'-275px','GR':'-165px','GL':'-1760px','GD':'-2399px','GP':'-407px','GU':'-2366px','GT':'-935px','GN':'-2575px','GW':'-1925px','GY':'-803px','HT':'-319px','HN':'-2156px','HK':'-2696px','HU':'-682px','IS':'-1991px','IN':'-1694px','ID':'-1958px','IR':'-2013px','IQ':'-649px','IE':'-1969px','IL':'-341px','IT':'-143px','JM':'-1727px','JP':'-429px','JO':'-1463px','KZ':'-1210px','KE':'-2630px','KI':'-374px','KW':'-2487px','KG':'-1617px','LA':'-451px','LV':'-1936px','LB':'-1254px','LS':'-2190px','LR':'-2068px','LY':'-132px','LI':'-979px','LT':'-1122px','LU':'-1474px','MO':'-2597px','MK':'-1353px','MG':'-1287px','MW':'-2145px','MY':'-1870px','MV':'-616px','ML':'-2520px','MT':'-1551px','MH':'-1144px','MQ':'-198px','MR':'-253px','MU':'-2179px','MX':'-2024px','FM':'-1738px','MD':'-2685px','MC':'-913px','MN':'-2553px','ME':'-2167px','MS':'-583px','MA':'-2333px','MZ':'-638px','MM':'-11px','NA':'-1881px','NR':'-1749px','NP':'-110px','NL':'-1441px','NC':'-1276px','NZ':'-1540px','NI':'-154px','NE':'-550px','NG':'-2476px','NU':'-2079px','NF':'-209px','MP':'-704px','KP':'-1804px','NO':'-836px','OM':'-2454px','PK':'-2035px','PW':'-231px','PS':'-1199px','PA':'-847px','PG':'-1485px','PY':'-2344px','PE':'-946px','PH':'-1815px','PL':'-1177px','PT':'-517px','PR':'-473px','QA':'-462px','RE':'-264px','RO':'-671px','RU':'-660px','RW':'-2674px','WS':'-2300px','SM':'-2123px','ST':'-2388px','SA':'-33px','SN':'-2134px','RS':'-2465px','SC':'-1045px','SL':'-737px','SG':'-22px','SX':'-2773px','SK':'-2212px','SI':'-1221px','SB':'-1067px','SO':'-1364px','ZA':'-2355px','KR':'-2245px','SS':'-2741px','ES':'-1155px','LK':'-2641px','BL':'-1012px','SH':'-495px','KN':'-99px','LC':'-1397px','MF':'-55px','PM':'-1078px','VC':'-2619px','SD':'-352px','SR':'-2663px','SZ':'-2278px','SE':'-385px','CH':'-1320px','SY':'-1826px','TW':'-506px','TJ':'-187px','TZ':'-2289px','TH':'-957px','TP':'-2784px','TG':'-605px','TK':'-2751px','TO':'-1089px','TT':'-440px','TN':'-539px','TR':'-1606px','TM':'-2542px','TC':'-1309px','TV':'-286px','VI':'-1782px','UG':'-1166px','UA':'-2002px','AE':'-2223px','GB':'-55px','US':'-44px','UY':'-2608px','UZ':'-1001px','VU':'-1265px','VA':'-2322px','VE':'-1056px','VN':'-968px','WF':'-1012px','YE':'-1672px','ZM':'-1595px','ZW':'-2046px', 'AX':'-2795px','BV':'-836px','HM':'-1716px','YT':'-1012px','AN':'-1441px','SJ':'-836px','AQ':'-2806px','CX':'-2817px','CC':'-2828px','TF':'-2839px','GG':'-2850px','IM':'-2861px','JE':'-2872px','KO':'-2883px','PN':'-2894px','GS':'-2905px', 'CD':'-1518px', 'TL':'-2784px'};
            for (i=0,j=countries.length;i<j;i++) {
                countries[i].offset=countriesOffset[countries[i].shortName]||'44px';
            }

            for (var i= 0, j=countries.length;i<j;i++) {
                $('#phone_combo_code').append('<option value="'+countries[i]['code']+'" data-image-offset="'+countries[i]['offset']+'" data-shortname="'+countries[i]['shortName']+'">+'+countries[i]['code']+' '+countries[i]['name']+'</option>');
            }
		}

		jQuery('#phone_combo_code').select2({
			templateResult: addUserPic,
			templateSelection: addUserPic
		}).on('select2:open',function(event){
			setTimeout(function(){
				var evt = document.createEvent('UIEvents');
				evt.initUIEvent('resize', true, false,window,0);
				window.dispatchEvent(evt);
			},5);
			var $this=$(this);
			if ($this.hasClass('radio_child')) {
				$(this).closest('.required_error').parent().find('.required_error').removeClass('required_error').addClass('required_error_hidden');
			} else {
				$(this).closest('.required_error').removeClass('required_error').addClass('required_error_hidden');
			}
		}).on('change',function(){
			checkPhone();
			$('#countryCode').val(getPhoneCodeInputValueByCountryA2OrCode($(this).find('option:selected').attr('data-shortname'),$(this).val())).change();
		});

		function addUserPic (opt) {
			if (!opt.id) {
				return opt.text;
			}
			var optimage = $(opt.element).data('image-offset');
			if(!optimage){
				return opt.text;
			} else {
				var $opt = $('<span class="phone_code_line"><span class="phone_code_flag" style="background-position: 0 '+optimage+';">&nbsp;</span><span class="phone_code_text">'+$(opt.element).text()+'</span></span>');
				return $opt;
			}
		}
	});

    function getCodeInputValueByCountryA2OrCode(sA2, sCode)
    {
        var sResult = '';
        if (sCode && sCode.charAt(0)==='+')
        {
            sCode = sCode.substr(1);
        }
        for (var i= 0, j=countries.length; i<j;i++)
        {
            if (sA2 &&  sA2.length && (countries[i].shortName===sA2))
            {
                sResult = '+' + countries[i].code + ' ' + countries[i].shortName;
                break;
            }
            if (!sResult.length && sCode && sCode.length && (countries[i].code===sCode))
            {
                sResult = '+' + countries[i].code + ' ' + countries[i].shortName;
            }
        }
        return sResult;
    }

    window.getPhoneCodeInputValueByCountryA2OrCode = (typeof window.getPhoneCodeInputValueByCountryA2OrCode === "undefined")?getCodeInputValueByCountryA2OrCode
        :window.getPhoneCodeInputValueByCountryA2OrCode;

})(jQuery);
