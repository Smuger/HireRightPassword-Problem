jQuery(document).ready(function () {
    jQuery.fn.removeClassWild = function (mask) {
        return this.removeClass(function (index, cls) {
            var re = mask.replace(/\*/g, '\\S+');
            return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
        });
    };

    $('#header_menu_text_size').on('change', function () {
        $this = $(this);
        $('html')
            .removeClassWild('font_size*')
            .addClass('font_size' + $this.val());
        $.ajax({
            method: 'POST',
            url: $('#changeTextSizeLink').attr('href'),
            data: {
                AC_2_FONT_SIZE: 'font_size' + $this.val()
            },
            success: function (msg) {

            }
        });
        var tframe = $('#iframeContent');
        if (tframe.length) {
            var frameWindow = $('#iframeContent')[0].contentWindow;
            if (frameWindow && typeof frameWindow.jQuery !== 'undefined') {
                frameWindow.jQuery('html').attr('class', $('html').attr('class'));
            }
        }
    });

    $('#header_menu_contrast').on('change', function () {
        $this = $(this)
        $('html')
            .removeClass('inverted')
            .removeClass('standard')
            .removeClass('high')
            .addClass($this.val());
        $.ajax({
            method: 'POST',
            url: $('#changeContrastLink').attr('href'),
            data: {
                AC_2_CONTRAST: $this.val()
            },
            success: function (msg) {

            }
        });
        var tframe = $('#iframeContent');
        if (tframe.length) {
            var frameWindow = $('#iframeContent')[0].contentWindow;
            if (frameWindow && typeof frameWindow.jQuery !== 'undefined') {
                frameWindow.jQuery('html').attr('class', $('html').attr('class'));
            }
        }
    });

    $('.header__menu__select').each(function () {
        var $this = $(this);
        if ($('option:selected', $this).val() && $('option:selected', $this).val() !== '') {
            $this.prev().html($('option:selected', $this).html());
        } else {
            $this.prev().html('&nbsp;');
        }
        $this.on('change', function () {
            var $this = $(this);
            if ($('option:selected', $this).val() && $('option:selected', $this).val() !== '') {
                $this.prev().html($('option:selected', $(this)).html());
            } else {
                $this.prev().html('&nbsp;');
            }
        });
        $this.on('focus', function () {
            $(this).parent().addClass('focus');
        }).on('blur', function () {
            $(this).parent().removeClass('focus');
        });
    });

    var inverted = window.matchMedia('(inverted-colors: inverted)').matches;
    if (inverted) {
        $('#header_menu_contrast').find(":selected").text('Inverted');
    }

    var current_item = jQuery('#header_menu_text_size');
    if (!current_item.closest("html[class^='font_size']").length) {
        current_item.prev('.header__menu__select__text').text('100%');
        jQuery('#header_menu_text_size option[value="100"]').attr("selected", true);
    }

    wcagACMethods.handleWcagCustomSelectorsOnLoadByState();

    jQuery(document)
        .on('click', function (event) {

            if (jQuery(event.target).closest('#header_menu_link').length) {
                toShow('header_menu', 'header_menu_link');
            } else if (jQuery(event.target).closest('#header_menu_close').length || jQuery(event.target).closest('#header_menu') === null) {
                toClose('header_menu', 'header_menu_link');
            }
        })
        .on('click', 'input[type="radio"]', function (event) {
            var $elem = jQuery(event.target);
            var isRadio = $elem.attr('type') === 'radio';
            if(!isRadio) {
                return;
            }

            var $allRadiosInGroup = $elem.closest('[role="radiogroup"]').find('[role="radio"]');
            var $currentRadio = $elem.siblings('[role="radio"]');

            if($currentRadio.length) {
                $allRadiosInGroup.attr('tabindex', '-1');
                $currentRadio.attr('tabindex', '0');
            }

            wcagACMethods.addAttrToSelectorDependingState(event.target);

            if(jQuery(event.target).attr('type') ==="radio" && jQuery(event.target).prev('[role="radio"]').length){
                jQuery(event.target).closest('[role="radiogroup"]').find('[role="radio"]').attr('tabindex', '-1');
                jQuery(event.target).prev().attr('tabindex', '0');
            }
        })
        .on('keydown', '#uploadDialog_proactive', function () {
            wcagACMethods.focusCustomProActiveElements();
        });
});

function toShow(menuOpenedStateId, menuClosedStateId) {
    var menuOpenedState = jQuery('#' + menuOpenedStateId);
    var menuClosedState = jQuery('#' + menuClosedStateId);
    menuOpenedState.attr('aria-hidden', false).show().focus();

    menuClosedState.hide();

    wcagACMethods.holdFocusWcagDialog(menuOpenedStateId);
}

function toClose(menuOpenedStateId, menuClosedStateId) {
    var menuOpenedState = jQuery('#' + menuOpenedStateId);
    var menuClosedState = jQuery('#' + menuClosedStateId);
    menuOpenedState.attr('aria-hidden', true).hide();
    menuClosedState.show().focus();
}

function clickAccountSettingsWcag(event, element){
    var elem = jQuery(element);
    var key = event.key;
    var isSelectionKey = key === "Enter" || key === " ";
    var isNavigationKey = key === "ArrowDown" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowLeft";
    var isNavigationKeyIE = key === "Down" || key === "Right" || key === "Up" || key === "Left";
    var radioGroup = elem.closest('[role="radiogroup"]');
    var radioItems = radioGroup.find('[role="radio"]');

    if (isSelectionKey) {
        elem.closest('[role="radiogroup"]').find('[role="radio"]').attr('tabindex', '-1');
        elem.attr('tabindex', '0');
        elem.click();
        elem.focus();

        elem.parent().find('input[type="radio"]').attr('id') === 'communicationPreferencesTimePeriodDisable' ?
            disableTimeSelects() : enableTimeSelects();
        event.preventDefault()
    }

    if (isNavigationKey || isNavigationKeyIE) {
        var currentIndex = radioItems.index(elem);
        var maxIndex = radioItems.length - 1;
        var nextIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
        var nextRadio = radioItems[nextIndex];
        var prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
        var prevRadio = radioItems[prevIndex];

        if ((key === "ArrowDown" || key === 'Down') || (key === "ArrowRight" || "Right")) {
            jQuery(radioItems[currentIndex]).attr('tabindex', '-1');
            jQuery(nextRadio).click();
            jQuery(nextRadio).attr('tabindex', '0').focus();

        }

        if ((key === "ArrowUp" || key === "Up") || (key === "ArrowLeft" || key === "Left")) {
            jQuery(radioItems[currentIndex]).attr('tabindex', '-1');
            jQuery(prevRadio).click();
            jQuery(prevRadio).attr('tabindex', '0').focus();

        }
        event.preventDefault()
    }
}

function clickWcagSupport(event, element) {
    var elem = jQuery(element);
    var key = event.key;
    var code = event.keyCode || event.which;

    var isSelectionKey = key === "Enter" || key === " ";
    var isIESelectionKeyCode = (code === 13 || code === 32);
    var isNavigationKey = key === "ArrowDown" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowLeft";
    var isNavigationKeyIE = key === "Down" || key === "Right" || key === "Up" || key === "Left";

    var radioGroup = elem.closest('[role="radiogroup"]');
    var radioItems = radioGroup.find('[role="radio"]');

    var isRadio = elem.is('[role="radio"]');
    var isCheckbox = elem.is('[role="checkbox"]');

    var radio = jQuery(elem).parent().find('input[type="radio"]:first');
    var checkbox = jQuery(elem).parent().find('input[type="checkbox"]:first');

    if ((isRadio || isCheckbox) && (isSelectionKey || isIESelectionKeyCode)) {
        event.preventDefault();
        if (radio.length) {
            if (typeof isWcag !== 'undefined' && isWcag) {
                wcagACMethods.addAttrToSelectorDependingState(radio);
            }
            radioItems.attr('tabindex', '-1');
            radioItems.attr('aria-checked', 'false');
            elem.attr('aria-checked', 'true');
            elem.attr('tabindex', '0');
            elem.click();
            elem.focus();

        } else if(checkbox.length){
            checkbox.click();
            elem.focus();

            if (typeof isWcag !== 'undefined' && isWcag) {
                wcagACMethods.addAttrToSelectorDependingState(checkbox);
            }
        }
    }

    if (isRadio && (isNavigationKey || isNavigationKeyIE)) {
        event.preventDefault();
        var currentIndex = radioItems.index(elem);
        var maxIndex = radioItems.length - 1;
        var nextIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
        var nextRadio = radioItems[nextIndex];
        var prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
        var prevRadio = radioItems[prevIndex];

        if ((key === "ArrowDown" || key === 'Down') || (key === "ArrowRight" || "Right")) {
            radioItems.attr('tabindex', '-1');
            radioItems.attr('aria-checked', 'false');
            jQuery(nextRadio).attr('aria-checked', 'true');
            jQuery(nextRadio).click();
            jQuery(nextRadio).attr('tabindex', '0');
            jQuery(nextRadio).focus();
        }

        if ((key === "ArrowUp" || key === "Up") || (key === "ArrowLeft" || key === "Left")) {
            radioItems.attr('tabindex', '-1');
            radioItems.attr('aria-checked', 'false');
            jQuery(prevRadio).attr('aria-checked', 'true');
            jQuery(prevRadio).click();
            jQuery(prevRadio).attr('tabindex', '0');
            jQuery(prevRadio).focus();
        }
    }
}

window.wcagACMethods = {
    focusHandling: {},
    holdFocusWcagDialog: function (id) {
        var modal = $('#' + id);
        var selectors = modal.find('select, input, textarea, button, a').filter(':visible');
        var first_input = selectors.first();
        var last_input = selectors.last();


        modal.on('keydown', function(event){
            var key = event.key;
            if(key === 'Escape'){
                toClose('header_menu', 'header_menu_link');
            }
        });

        last_input.on('keydown', function (e) {
            var code = e.keyCode || e.which;

            if ((code === 9 && !e.shiftKey)) {
                e.preventDefault();
                first_input.focus();
            }
        });

        first_input.on('keydown', function (e) {
            var code = e.keyCode || e.which;
            if ((code === 9 && e.shiftKey)) {
                e.preventDefault();
                last_input.focus();
            }
        });

        first_input.focus();
    },
    handleWcagCustomSelectorsOnLoadByState: function(){
        var radios = jQuery('input[type="radio"]');

        radios.each(function () {
            if (jQuery(this).is(':checked')) {
                jQuery(this).parent().find('label[class*="fc__i__radio_label"]').attr('aria-checked', true);
            } else {
                jQuery(this).parent().find('label[class*="fc__i__radio_label"]').attr('aria-checked', false);
            }
        });
    },
    focusErrorHeader: function () {
        var sections_container = jQuery('.accent_error_section');
        var error_header = sections_container.find('.error_header').parent().find('a:visible').first();

        error_header.focus();
    },
    addAttrToSelectorDependingState: function (elem) {
        var element = jQuery(elem);
        var checked = element.is(':checked');
        var radio_label = element.parent().find('label.fc__i__radio_label');
        var radios_container = jQuery('.form__block__center__wrapper').find('label.fc__i__radio_label');

        if (element.attr('type') === 'radio') {
            radios_container.attr('aria-checked', false);
            checked ? radio_label.attr('aria-checked', true) : radio_label.attr('aria-checked', false)
        }
    },
    focusToLogoWhenPageLoaded: function () {
        var AC_logo = jQuery('.header .logo');
        var error_section = jQuery('.accent_error_section').is(':visible');

        error_section ? wcagACMethods.focusErrorHeader() : AC_logo.focus();
    },
    focusCustomProActiveElements: function () {
        var default_select = jQuery('select.defaultSelect');

        default_select
            .on('focus', function () {
                jQuery(this).closest('.defaultSelectWrapper').addClass('focused');
            })
            .on('blur', function () {
                jQuery(this).closest('.defaultSelectWrapper').removeClass('focused')
            });
    },
    setElementToFocus: function (el) {
        var target_element = jQuery(el);
        var element_id = target_element.attr('id');

        if (target_element.hasClass("upload-link")) {
            wcagACMethods.focusHandling.uploadDocument = element_id;
        }
    },
    isIOS: function(){
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
}

jQuery(window).on('load', function(){
    if(isWcag){
        wcagACMethods.focusToLogoWhenPageLoaded();
    }

    jQuery('.upload-link').each(function ()  {
        var hasOnClick = jQuery(this).attr('onclick') !== undefined;

        if(hasOnClick &&  jQuery(this).attr('onclick').indexOf('setElementToFocus') === -1) {
            jQuery(this).attr('onclick', 'wcagACMethods.setElementToFocus(this); ' + jQuery(this).attr('onclick'))
        } else if(!hasOnClick){
            jQuery(this).attr('onclick', 'wcagACMethods.setElementToFocus(this)');
        }
    });
});
