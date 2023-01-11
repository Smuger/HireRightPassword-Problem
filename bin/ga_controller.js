var GoogleAnalyticsController = (function($){

    var VIRTUAL_PAGE_EVENT = 'VirtualPageview';
var AC20_URL_PREFIX = '/applicant_center2/';

    var ac20_page_titles = {
    'AC2_LOGIN_PAGE':			'Login Page',
    'AC2_INSTRUCTIONS_PAGE':	'Instructions Page',
    'AC2_PASSWORD_RESET_PAGE':	'Password Reset Page',
    'AC2_STATUS_PAGE':			'Status Page',
    'AC2_WARNING_PAGE':			'Warning Page'
};

    var currentPageURL = undefined;
var currentPageTitle = undefined;

    var sendVirtualPageEvent = function(url, title) {
    if(!title){
        if(ac20_page_titles.hasOwnProperty(url)){
            title = ac20_page_titles[url];
        } else {
            title = 'Untitled Page [' + url + ']';
        }
    } else {
        title = title.replace("&nbsp;::", "").trim();
    }

            if(url && currentPageURL != url && currentPageTitle != title){
        var event = {
                'event': VIRTUAL_PAGE_EVENT,
                'virtualPageURL': AC20_URL_PREFIX + url,
                'virtualPageTitle': title
        };
        if(dataLayer){
            dataLayer.push(event);
            currentPageURL = url;
            currentPageTitle = title;
        }
    }
}

    var init = function(){
    var $pageKeyInput = $('input[name = "page_key"]');
    var url = $pageKeyInput.val();
    if(url){
        sendVirtualPageEvent(url);
    }
};

    return {
    init: init,
    sendVirtualPageEvent: sendVirtualPageEvent
};
}(jQuery));