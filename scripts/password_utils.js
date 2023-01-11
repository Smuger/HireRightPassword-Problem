function isContainCapitalLetter(input) {
	return input != input.toLowerCase();
}

function isContainNumber(input) {
	var reg = /[0-9]/;
	return reg.test(input);
}

function isContainSpecial(input) {
	var reg = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/;
	return reg.test(input);
}

function isValidLength(input) {
	var reg = /^[^%\s]{8,}/;
    return reg.test(input);
}

function isContainEmail(input, email) {
	var username = email.split("@")[0];
	return username && input.toLowerCase().indexOf(username.toLowerCase()) !== -1;
}

function isContainNameOrPhone(input, firstName, lastName, phone) {
	return	(firstName && input.toLowerCase().indexOf(firstName.toLowerCase()) !== -1) ||
			(lastName && input.toLowerCase().indexOf(lastName.toLowerCase()) !== -1) ||
			(phone && input.toLowerCase().indexOf(phone.replace(/[^0-9.]/g, '')) !== -1);
}

function isContainSpace(input) {
	var reg = /[\s]/;
	return reg.test(input);
}

function isContainRepeat(input) {
	var reg =  /(.)\1{4}/;
	return reg.test(input);
}

function validatePasswordConfirm(password, passwordConfirm) {
    if (password != passwordConfirm) return false;
    return true;
}

function validatePasswordPartsConfirm(password, passwordConfirm) {
    if (password.substring(0,passwordConfirm.length) != passwordConfirm) return false;
    return true;
}

function checkPasswordQuality () {
    var $passwordInput=$("#password");
    var $passwordErrorMessageLength=$("#pass_req_length");
    var $passwordErrorMessageNumber=$("#pass_req_number");
    var $passwordErrorMessageSpecial=$("#pass_req_special");
    var $passwordErrorMessageUpper=$("#pass_req_upper");

	var email_dont = jQuery('#pass_has_email');
	var name_dont = jQuery('#pass_has_name');
	var space_dont = jQuery('#pass_has_space');
	var repeat_dont = jQuery('#pass_has_repeat');
	var donts_container = jQuery('.login_form__terms').find('.wrong');

	var isValid=true;
	if (!isValidLength($passwordInput.val())) {
        isValid=false;
        $passwordErrorMessageLength.removeClass("good");
	} else {
        $passwordErrorMessageLength.addClass('good');
    }

    if (!isContainCapitalLetter($passwordInput.val())) {
        isValid=false;
        $passwordErrorMessageUpper.removeClass("good");
	} else {
        $passwordErrorMessageUpper.addClass('good');
    }

    if (!isContainNumber($passwordInput.val())) {
        isValid=false;
        $passwordErrorMessageNumber.removeClass("good");
    } else {
        $passwordErrorMessageNumber.addClass('good');
    }

    if (!isContainSpecial($passwordInput.val())) {
        isValid=false;
        $passwordErrorMessageSpecial.removeClass("good");
    } else {
        $passwordErrorMessageSpecial.addClass('good');
    }

	var email = jQuery('#email').val();
	if (isContainEmail($passwordInput.val(), email)) {
		email_dont.addClass('wrong');
        isValid=false;
	} else {
		email_dont.removeClass('wrong');
	}

	var first_name = jQuery('#first_name').val();
	var last_name = jQuery('#last_name').val();
	var phone = jQuery('#phone').val();
	if (isContainNameOrPhone($passwordInput.val(), first_name, last_name, phone)) {
		name_dont.addClass('wrong');
        isValid=false;
	} else {
		name_dont.removeClass('wrong');
	}

	if (isContainSpace($passwordInput.val())) {
        isValid=false;
		space_dont.addClass('wrong');
	} else {
		space_dont.removeClass('wrong');
	}

	if (isContainRepeat($passwordInput.val())) {
        isValid=false;
		repeat_dont.addClass('wrong');
	} else {
		repeat_dont.removeClass('wrong');
	}

	if (!isValid) {
        $passwordInput.attr('snodevalid',false);
        $passwordInput.closest('.form__block').removeClass('form__block-white_bg');
		$('#confirm_password_label').attr('disabled',true);
        $('#passwordConfirm').prop('disabled',true);
        return false;
    } else {
        $passwordInput.closest('.form__block').addClass('form__block-white_bg');
        $passwordInput.attr('snodevalid',true);
		$('#confirm_password_label').attr('disabled',false);
        $('#passwordConfirm').prop('disabled',false);
        return true;
    }
}

function checkPasswordMatch () {
    var $passwordErrorMessage=$("#pwErrorMessage");
    var $passwordSuccessMessage=$("#pwSuccessMessage");
    var $passwordConfirmInput=$("#passwordConfirm");
    var $passwordInput=$("#password");

    var commonPassword = $('#commonPassword').val();
    if(commonPassword && !checkCommonPasswordErrorWasFixed($passwordInput.val(), commonPassword)) {
        return false;
    } else {
        $('#pwPasswordIsCommonErrorMessage').hide();
    }

        if (!checkPasswordQuality()) {
        $passwordSuccessMessage.slideUp();
        $passwordConfirmInput.closest('.form__block').removeClass('form__block-white_bg');
        $passwordConfirmInput.attr('snodevalid',false);
        $passwordErrorMessage.slideUp();
        return false;
    } else if (!validatePasswordConfirm($passwordInput.val(), $passwordConfirmInput.val())) {
        $passwordSuccessMessage.slideUp();
        $passwordConfirmInput.closest('.form__block').removeClass('form__block-white_bg');
        $passwordConfirmInput.attr('snodevalid',false);
        if (!validatePasswordPartsConfirm($passwordInput.val(), $passwordConfirmInput.val())) {
            if (!$passwordErrorMessage.is(':visible')) $passwordErrorMessage.slideDown();
        } else {
            $passwordErrorMessage.slideUp();
        }
        return false;
    } else {
        $passwordConfirmInput.closest('.form__block').addClass('form__block-white_bg');
        $passwordConfirmInput.attr('snodevalid',true);
        $passwordErrorMessage.slideUp();
        $passwordSuccessMessage.slideDown();
        return true;
    }
}

function checkCommonPasswordErrorWasFixed(password, commonPassword) {
    return commonPassword !== password;
}
