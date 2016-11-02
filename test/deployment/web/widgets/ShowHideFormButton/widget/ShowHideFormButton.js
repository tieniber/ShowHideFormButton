/*
    ShowHideFormButton
    ========================

    @file      : ShowHideFormButton.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Wed, 2 Nov 2015 03:05:59 EDT
    @copyright :
    @license   :

    Documentation
    ========================
    A Mendix custom widget that presents a button. On click, it will open a Mendix form inline inside a given target div.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/lang",
    "dojo/text",
	"dojo/on",
	"dojo/query",
	"dojo/dom-construct",
    //"ShowHideFormButton/lib/jquery-1.11.2",
    "dojo/text!ShowHideFormButton/widget/template/ShowHideFormButton.html",
    "dojo/NodeList-traverse"
], function(declare, _WidgetBase, _TemplatedMixin, dojoLang, dojoText, on, query, domConstruct, /*_jQuery,*/ widgetTemplate, traverse) {
    "use strict";

    //var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("ShowHideFormButton.widget.ShowHideFormButton", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
		theButton: null,

        // Parameters configured in the Modeler.
		buttonText: "",
		tooltipForm: "",
		toggleClass: "",
		targetDivClass: "",
		sharedParentClass: "",

		// internal variables
		_contextObj: null,
		_currentForm:null,
		_targetNode: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {

			this.theButton.innerHTML = this.buttonText;
            on(this.theButton, "click", dojoLang.hitch(this,this._showHideForm));
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            this._contextObj = obj;
            callback();
        },

		_showHideForm: function() {
			if (this._currentForm) {
				this._closeForm();
			} else {
				this._openForm();
			}
		},

		_openForm: function() {
			var sharedParent;

			sharedParent = query(this.domNode).closest("." + this.sharedParentClass);
			if (sharedParent) {
				this._targetNode = sharedParent.children("." + this.targetDivClass)[0];
				if (this._targetNode) {
					mx.ui.openForm(this.tooltipForm, {
					location: "content",
					domNode: this._targetNode,
					context: this.mxcontext,
					callback: dojoLang.hitch(this, function(form) {
							this._currentForm = form;
						})
					});
				} else {
					console.log("no target DOM node found");
				}
			} else {
				console.log("no shared parent DOM node found");
			}
		},

		_closeForm: function() {
			this._currentForm = null;
			domConstruct.empty(this._targetNode);
		},

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }
    });
});

require(["ShowHideFormButton/widget/ShowHideFormButton"], function() {
    "use strict";
});
