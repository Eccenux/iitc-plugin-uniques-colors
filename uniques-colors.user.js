// ==UserScript==
// @id             iitc-plugin-uniques-colors@3ch01c
// @name           IITC plugin: uniques-colors
// @category       Misc
// @version        0.0.1
// @namespace      https://github.com/3ch01c/ingress-intel-total-conversion
// @description    This is an overwrite for uniques highlitghter providing more distinct highlights of uncapture protals.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// @updateURL      https://github.com/Eccenux/iitc-plugin-uniques-colors/raw/master/uniques-colors.meta.js
// @downloadURL    https://github.com/Eccenux/iitc-plugin-uniques-colors/raw/master/uniques-colors.user.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

function myHighlight(data) {
	var guid = data.portal.options.ent[0];
	var uniqueInfo = window.plugin.uniques.uniques[guid];

	var style = {};

	if (uniqueInfo) {
		if (uniqueInfo.captured) {
			// captured (and, implied, visited too)
			//style.fillColor = 'white';
			style.fillOpacity = 0.2;
			style.opacity = 0.2;
		} else if (uniqueInfo.visited) {
			style.fillColor = 'gold';
			style.fillOpacity = 0.8;
		} else {
			// we have an 'uniqueInfo' entry for the portal, but it's not set visited or captured?
			// could be used to flag a portal you don't plan to visit, so use a less opaque red
			style.fillColor = 'red';
			style.fillOpacity = 0.7;
		}
	} else {
		// no visit data at all
		style.fillColor = 'red';
		style.fillOpacity = 0.7;
	}

	data.portal.setStyle(style);
}

// setup plugin
var setup = function() {
	if(window.plugin.uniques) {
		window.plugin.uniques.highlighter.highlight = myHighlight;
	} else {
		setTimeout(function() {
			if(window.plugin.uniques) {
				window.plugin.uniques.highlighter.highlight = myHighlight;
			}
		}, 500);
	}
}

//PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property

if(!window.bootPlugins) window.bootPlugins = [];

window.bootPlugins.push(setup);

// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();

} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
