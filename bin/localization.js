(
	function($)
	{
		var bundle_line_re = /([^=]+)=(.+)/;
		var re_special_chars_re = /[-[\]{}()*+?.,\\^$|#\s]/g;
		var props_special_chars_re = /\\([#:!=\\])/g;

				var defaults = 
		{ 
			base_name: "messages_", 
			extension: ".properties",
			lng: "en",
			path: null
		};

				var settings;

				var inited = false;

				var bundles = null;

				var methods = 
		{
			init: function(options) 
			{
				inited = false;
				settings = $.extend(defaults, options);
				localized = true; 
			},

			get: function(key, args)
			{
				if (!inited) methods.getMsgBundle();
				var default_value;
				if (args && args.default_value) default_value = args.default_value;
				var value = bundles[key]?bundles[key]:default_value?default_value:key;
				if (args && args.tokens)
				{
					value = methods.replaceTokens(value, args.tokens);
				}
				return value;
			},

						replaceTokens: function(str, tokens)
			{
				for (var token in tokens)
				{
					var token_expression = token.replace(re_special_chars_re, "\\$&"); 
					str = str.replace(RegExp(token_expression, 'g'), tokens[token]);
				}
				return str;
			},

						getMsgBundle: function() 
			{
				if (!settings.path)
				{
					console.error("Unknown message bundle path");
					return;
				}
				$.ajax({
					url: settings.path + "/" + settings.base_name + settings.lng + settings.extension,
					async: false,
					dataType: 'text',
					success: methods.parseBundle,
					error: function(jqXHR, textStatus, errorThrown)
						{
							console.error(
								"jqXHR: " + jqXHR
								+ "\n textStatus: " + textStatus
								+ "\n errorThrown: " + errorThrown
							)
						}
				});
			},

						parseBundle: function(content, status) 
			{
				bundles = {};
				var miltln_key = '';
				$(content.split( /\n/ )).each(function(line)
					{
						line = this;
						line = jQuery.trim(line);
						if (line[0] == "#" || line.length == 0) return;
						if (!miltln_key)
						{
							var mch = bundle_line_re.exec(line);
							if (!mch || mch.length != 3 && miltln_key == '') return;
						}
						var key = miltln_key != '' ? miltln_key : jQuery.trim(mch[1]);
						var value = miltln_key != '' ? line : jQuery.trim(mch[2]);
						value = value.replace(props_special_chars_re, "$1").replace(/\\n/g, "\n");
						if (miltln_key) value =bundles[key] + value;
						if (value.match(/\\$/)=="\\") 
						{
							value = value.substring(0, value.length - 1);
							miltln_key = key;
						} else if (miltln_key) miltln_key = '';
						bundles[key] = value;
					});
				inited = true;
			}
		};

				$.messages = function(method) 
		{
			if (methods[method]) 
			{
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof method === 'object' || !method)
			{
				return methods.init.apply(this, arguments);
			} else {
				console.error('Localization: Unknown plugin method: ' + method);
			}
		};

	}
)(jQuery);