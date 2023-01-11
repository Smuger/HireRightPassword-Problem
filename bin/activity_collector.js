window.activityLogger = window.activityLogger || {
	log : function (sPageName, sElementName, sActionName, actionParams)
	{
		var url = getServletContext();
		var data = actionParams || {};
		data.event = 'ac2_log_page_activity';
		data.pageName = sPageName;
		data.elementName = sElementName;
		data.actionName = sActionName;
		jQuery.ajax({
			type: 'POST',
			url: url,
			data: data
		}).done(function(data, textStatus){
		});
	},
	logVideo : function(sPageName, sElementName, sActionName, sVideoUrl)
	{
		this.log(sPageName, sElementName, sActionName, {actionParamVideoUrl : sVideoUrl});
	},
	ACTION_VIDEO_STARTED: 'video_started'
}

function getYoutubeApiLoader()
{
	if (!window.youtubeApiLoader) 
	{
		window.youtubeApiLoader = {
			bApiRequested : false,
			pendingAdapterList : [],
			load : function(adapter)
			{
				if (typeof(window.YT) == 'undefined' || typeof(window.YT.Player) == 'undefined')
				{
					this.pendingAdapterList.push(adapter);
					if (!this.bApiRequested)
					{
						this.bApiRequested = true;
						jQuery(document).ready(function() 
						{
							jQuery.getScript("https://www.youtube.com/iframe_api");
						});
					}
				}
				else
				{
					adapter.initAdapter();
				}
			},
			initPendingAdapters :	function()
			{
				for(var i = 0; i < this.pendingAdapterList.length; i++)
				{
					this.pendingAdapterList[i].initAdapter();
				}
			}
		}
	}
	return window.youtubeApiLoader;
}

function onYouTubePlayerAPIReady()
{
	getYoutubeApiLoader().initPendingAdapters();
}

function YoutubeActivityCollector(options)
{
	this.options = options;
	this.player = null;
	this.bStarted = false;
	getYoutubeApiLoader().load(this);

			this.initAdapter = function()
	{
		var _this = this;
		this.player = new YT.Player(this.options.sIFrameDomId, {
				events: {
					'onStateChange': function(event) { 
						if ((event.data==YT.PlayerState.PLAYING) && !_this.bStarted)
						{
							_this.bStarted = true;
							activityLogger.logVideo(_this.options.sPageName, _this.options.sElementName, 
								activityLogger.ACTION_VIDEO_STARTED, _this.options.sVideoUrl);
						}
					}
				}
			});
	};
}

function getVimeoApiLoader()
{
	if (!window.vimeoApiLoader) 
	{
		window.vimeoApiLoader = {
			bApiRequested : false,
			pendingAdapterList : [],
			load : function(adapter)
			{
				if (typeof(window.Vimeo) == 'undefined' || typeof(window.Vimeo.Player) == 'undefined')
				{
					this.pendingAdapterList.push(adapter);
					if (!this.bApiRequested)
					{
						this.bApiRequested = true;
						var _this = this;
						jQuery(document).ready(function() 
						{
							jQuery.getScript("https://player.vimeo.com/api/player.js", function(){
								_this.initPendingAdapters();
								});
						});
					}
				}
				else
				{
					adapter.initAdapter();
				}
			},
			initPendingAdapters :	function()
			{
				for(var i = 0; i < this.pendingAdapterList.length; i++)
				{
					this.pendingAdapterList[i].initAdapter();
				}
			}
		}
	}
	return window.vimeoApiLoader;
}

function VimeoActivityCollector(options)
{
	this.options = options;
	this.player = null;
	this.bStarted = false;
	getVimeoApiLoader().load(this);

			this.initAdapter = function()
	{
		var iframe = $('#' + this.options.sIFrameDomId)[0];
		this.player = new Vimeo.Player(iframe);
		var _this = this;
		this.player.on('play', function() {
			if (!_this.bStarted)
			{
				_this.bStarted = true;
				activityLogger.logVideo(_this.options.sPageName, _this.options.sElementName, 
						activityLogger.ACTION_VIDEO_STARTED, _this.options.sVideoUrl);
			}
		});
	};
}

function addVideoActivityCollector(videoIframe)
{
	var jIFrame = jQuery(videoIframe);
	var sSrc = jIFrame.attr('src');
	var options = {
		sIFrameDomId: jIFrame.attr('id'),
		sPageName: jIFrame.attr('trackingPageName'),
		sElementName: jIFrame.attr('trackingElement'),
		sVideoUrl: sSrc.indexOf('?')>-1?sSrc.substring(0, sSrc.indexOf('?')):sSrc
	};
	if (sSrc.indexOf('https://www.youtube.com/embed/')==0)
	{
		new YoutubeActivityCollector(options);
	}
	else if (sSrc.indexOf('https://player.vimeo.com/video/')==0)
	{
		new VimeoActivityCollector(options);
	}
}

jQuery(document).ready(function() 
{
	jQuery('.trackable-video').each(function() {
		addVideoActivityCollector(this);
	});
});