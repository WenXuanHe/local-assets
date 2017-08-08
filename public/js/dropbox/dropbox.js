(function()
{
    "use strict";

    var panels = {
            'search': 'search',
            'search-result': 'search-result',
            'contact-method': 'contact-method',
            'create-ticket': 'create-ticket',
            'contact-info': 'contact-info',
            'livechat-box': 'livechat-box'
        },
        _options = {
            container: 'body',
            selectors: {
                'panels': '.dropbox-wrap',
                'search': '#search',
                'search-result': '#search-result',
                'contact-method': '#contact-method',
                'create-ticket': '#create-ticket',
                'contact-info': '#contact-info',
                'livechat-box': '#livechat-box'
            }
        };

    function Dropbox(options)
    {
        this._initialize(options || {});
    }

    window.Dropbox = Dropbox;

    Dropbox.prototype = {

        currentPanel: null,

        _initialize: function(options)
        {
            this.options = $.extend(true, {}, _options);
            this.options = $.extend(true, this.options, options);

            this.$el = $(this.options.container || document.body);

            this.reset();
        },

        getSelector: function(type)
        {
            return this.options.selectors[type];
        },

        getElements: function(type)
        {
            return this.$el.find(this.getSelector(type));
        },

        getElement: function(type)
        {
            return this.getElements(type).first();
        },

        reset: function()
        {
            this.panels = {};

            return this;
        },

        navigate: function(type)
        {
            var prev = this.currentPanel;

            this.currentPanel = this.panels[type].activate();
            prev && (prev.next = this.currentPanel);
            this.currentPanel.prev = prev;

            return this;
        },

        addPanel: function(type)
        {
            this.panels[type] = new Dropbox.Panel(this, type);

            return this.panels[type];
        },

        getPanel: function(type)
        {
            return this.panels[type];
        },

        forward: function()
        {
            if(this.currentPanel && this.currentPanel.next)
            {
                this.currentPanel = this.currentPanel.next.activate();
            }

            return this;
        },

        back: function()
        {
            if(this.currentPanel && this.currentPanel.prev)
            {
                this.currentPanel = this.currentPanel.prev.activate();
            }

            return this;
        }
    };

    Dropbox.Panel = function(parent, type)
    {
        this._initialize(parent, type);
    };

    Dropbox.Panel.prototype = {

        type: '',
        parent: null,

        prev: null,
        next: null,

        _initialize: function(parent, type)
        {
            this.parent = parent;
            this.type = type;

            this.$el = parent.getElement(type);
        },

        activate: function()
        {
            if(this.parent && this.parent.currentPanel)
            {
                this.parent.currentPanel.deactivate();
            }

            this.$el.show();

            $(this).triggerHandler('active');

            return this;
        },

        deactivate: function()
        {
            this.$el.hide();

            return this;
        }
    };
})();
