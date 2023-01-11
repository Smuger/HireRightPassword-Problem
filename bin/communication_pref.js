var CommunicationPreferences = new (function() {

	this.validateMobilePhone = function()
	{
		var formField = $(".communicationPreferencesPhoneNumber input");
		var formFieldObj = formField.get(0);
		var zeroLengthPhoneAllowed = false;
		if (formField.attr("zero-length-allowed") == "true")
			zeroLengthPhoneAllowed = true;

				if ((formFieldObj.value.length == 0 && zeroLengthPhoneAllowed) 
				|| (formFieldObj.value.length > 0 && isFieldValid(formFieldObj)))
		{	
			formField.attr("nodevalid", "true");
			return true;
		}
		else
		{
			formField.attr("nodevalid", "false");
			return false;
		}
	};

	this.setPhone = function(sPhoneNumber, sCountryCode, sCountryA2, sPhoneNumberInputID, sCountryCodeInputID)
	{
		var phoneCode;
		var phone;
		var pattern = /^(\+\d{0,7}\ )?([^x.]{0,20})((?:[x\ ])?[^x.]{0,6})?$/;
		var nameList = pattern.exec(sPhoneNumber);

			if (nameList != null && nameList[1]) {
			re = /\D/g;		
			phoneCode = nameList[1].replace(re,"");
			phone = nameList[2]? nameList[2] : '';
		} else {
			phone = sPhoneNumber;
		}

				if (sCountryCode && sCountryCode.length)
		{
			phoneCode = sCountryCode;
		}
		if (!sCountryA2 && (!phoneCode || phoneCode == '1'))
		{
			sCountryA2 = 'US';
		}

				var phoneNumberInput = document.getElementById(sPhoneNumberInputID);
		var countryCodeInput = document.getElementById(sCountryCodeInputID);
		countryCodeInput.value = window.getPhoneCodeInputValueByCountryA2OrCode(sCountryA2, phoneCode);
		phoneNumberInput.value = phone;
		jQuery(countryCodeInput).change();	
		this.formatPhone(sCountryCodeInputID, sPhoneNumberInputID);
		this.setPhoneValidationPattern(sCountryCodeInputID, sPhoneNumberInputID);
	};

	this.formatPhone = function(sCountryCodeInputID, sPhoneNumberInputID)
	{
		re = /\D/g;                

				var countryCode = document.getElementById(sCountryCodeInputID);
		var phoneText = document.getElementById(sPhoneNumberInputID);

		var codeText=countryCode.value.substr(1);
		var codeArray=codeText.split(' ');
		var code = codeArray[0];

				if (code == '1') {
			str = phoneText.value.replace(re,"");
			if(str.length > 3)
				str = "(" + str.substring(0,3) + ") " + str.substring(3, str.length);
			if(str.length > 9)
				str = str.substring(0,9) + " " + str.substring(9, str.length);
			if(str.length > 20)
				str = str.substring(0,20);
			phoneText.value = str;
		} else {
			re = /\(|\)|x/g;                
			str = phoneText.value.replace(re,"");
			phoneText.value = str;
			showDivDispay(document.getElementById("div_" + sCountryCodeInputID));
		}
	};

	this.setPhoneValidationPattern = function(sCountryCodeInputID, sPhoneNumberInputID) 
	{
		var countryCode = document.getElementById(sCountryCodeInputID);
		var phoneText = document.getElementById(sPhoneNumberInputID);

			if (countryCode && phoneText)
		{
			var regexp;
			if (this.getSmsPhoneCountryCode(sCountryCodeInputID) == "1")
			{
				regexp = "^((?:[\\(]?)[0-9]\\d{2}(?:[\\)]?)(?:[\\ -.]?))([0-9]\\d{2})(?:[\\ -.]?)(\\d{4})$";
			}
			else
			{
				regexp = "^([\\d\\ -\\(\\)]{4,20})$";
			}
			phoneText.setAttribute("regexp", regexp);
		}
	};

	this.getSmsPhoneCountryCode = function(sCountryCodeInputID)
	{
		var countryCode = document.getElementById(sCountryCodeInputID);
		var codeText=countryCode.value.substr(1);
		var codeArray=codeText.split(' ');
		var code = codeArray[0];
		return code;
	};

	this.getSmsPhoneCountryA2 = function(sCountryCodeInputID)
	{
		var countryCode = document.getElementById(sCountryCodeInputID);
		var codeText=countryCode.value.substr(1);
		var codeArray=codeText.split(' ');
		var a2 = (codeArray.length>1)?codeArray[1]:null;
		return a2;
	};

	})();