var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
//main menu plugin
(function ($)
{
    //all methods should have 'this' = root jq element
    var methods =
        {
            //
            enable: function ()
            {
                var data = methods.impl.getData.apply(this);
                data.settings.disabled = false;

                return this;
            },

            //
            disable: function ()
            {
                var data = methods.impl.getData.apply(this);
                data.settings.disabled = true;

                return this;
            },

            //
            update: function ($html)
            {
                var data = methods.impl.getData.apply(this);
                this.html($html.children());
                methods.impl.init.apply($html, [data.settings]);

                this.trigger('updated', [this]);

                return this;
            },

            //
            horizontal: function (flag)
            {
                var data = methods.impl.getData.apply(this);
                data.settings.horizontal = flag === true ? true : false;

                return this;
            },

            //
            impl:
                {
                    //
                    getData: function ()
                    {
                        return this.data('publicWebsiteMainMenu');
                    },

                    //
                    setData: function (data)
                    {
                        this.data('publicWebsiteMainMenu', data);
                    },

                    //
                    init: function (settings)
                    {
                        var isInitialized = false;
                        var data = methods.impl.getData.apply(this);
                        if (data)
                        {
                            isInitialized = true;
                        }
                        else
                        {
                            data = { settings: settings };
                            methods.impl.setData.apply(this, [data]);
                        }

                        //initialize only once
                        if (!isInitialized)
                        {
                            this.
                                delegate('.menunode', 'mouseenter', $.proxy(methods.impl.nodeOverHandler, this)).
                                delegate('.menunode', 'mouseleave', $.proxy(methods.impl.nodeOutHandler, this)).
                                delegate('.menubranchchildren', 'mouseenter', $.proxy(methods.impl.childrenOverHandler, this)).
                                delegate('.menubranchchildren', 'mouseleave', $.proxy(methods.impl.childrenOutHandler, this));
                        }
                    },

                    //
                    clearElementTimer: function ($el)
                    {
                        var timer = $el.data('timer');
                        if (timer)
                        {
                            clearTimeout(timer);
                        }
                    },

                    //
                    setElementTimer: function ($el, handler)
                    {
                        var timer = setTimeout(handler, 100);

                        $el.data('timer', timer);
                    },

                    //
                    showChildrenByElement: function ($parent)
                    {
                        var id = $parent.attr('menunode');

                        if (id > 0)
                        {
                            var $children = this.find('.menubranchchildren[menunode="' + id + '"]');

                            if ($children.length == 1)
                            {
                                var data = methods.impl.getData.apply(this);
                                var isHorizontal = data.settings.horizontal === true;
                                var isNested = $children.parent().closest('.menubranchchildren').length > 0;

                                methods.impl.clearElementTimer.apply(this, [$children]);

                                if (
                                    isHorizontal &&
                                    !isNested
                                    )
                                {
                                    $children.
                                        css('position', 'absolute').
                                        css('top', $parent.position().top + $parent.height()).
                                        css('left', $parent.position().left).
                                        show();
                                }
                                else
                                {
                                    $children.
                                        css('position', 'absolute').
                                        css('top', $parent.position().top).
                                        css('left', $parent.position().left + $parent.width()).
                                        show();
                                }
                            }
                        }
                    },

                    //
                    hideChildrenById: function (id)
                    {
                        if (id > 0)
                        {
                            this.
                                find('.menunode[menunode="' + id + '"]').
                                    closest('.menubranch').
                                    children('.menubranchchildren').
                                    hide();
                        }
                    },

                    //
                    hideChildrenByElement: function ($el)
                    {
                        var id = $el.attr('menunode');

                        if (id > 0)
                        {
                            var $children = this.find('.menubranchchildren[menunode="' + id + '"]');

                            if ($children.length == 1)
                            {
                                var handler = $.proxy(function () { methods.impl.hideChildrenById.apply(this, [id]); }, this);

                                methods.impl.setElementTimer.apply(this, [$children, handler]);
                            }
                        }
                    },

                    //
                    nodeOverHandler: function (ev)
                    {
                        var data = methods.impl.getData.apply(this);

                        if (data.settings.disabled !== true)
                        {
                            methods.impl.showChildrenByElement.apply(this, [$(ev.currentTarget)]);
                        }
                    },

                    //
                    nodeOutHandler: function (ev)
                    {
                        var data = methods.impl.getData.apply(this);

                        if (data.settings.disabled !== true)
                        {
                            methods.impl.hideChildrenByElement.apply(this, [$(ev.currentTarget)]);
                        }
                    },

                    //
                    childrenOverHandler: function (ev)
                    {
                        var data = methods.impl.getData.apply(this);

                        if (data.settings.disabled !== true)
                        {
                            methods.impl.clearElementTimer.apply(this, [$(ev.currentTarget)]);
                        }
                    },

                    //
                    childrenOutHandler: function (ev)
                    {
                        var data = methods.impl.getData.apply(this);

                        if (data.settings.disabled !== true)
                        {
                            methods.impl.hideChildrenByElement.apply(this, [$(ev.currentTarget)]);
                        }
                    }
                }
        };

    $.fn.publicWebsiteMainMenu =
    function (method)
    {
        //init
        var defaults =
            {
                disabled: false,
                horizontal: false
            };
        if (method && typeof (method) === 'object')
        {
            $.extend(defaults, method);
        }
        methods.impl.init.apply(this, [defaults]);

        //execute method if needed
        if (method && typeof (method) === 'string')
        {
            if (methods[method])
            {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else
            {
                $.error('Method [' + method + '] is not supported by publicWebsiteMainMenu jQuery plugin');
            }
        }

        //allow jq chaining
        return this;
    };
})(jQuery);

//main menu auto-init
$(function () { $('.mainmenu').publicWebsiteMainMenu(); });
}
/*
     FILE ARCHIVED ON 02:22:16 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:24 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.318 (2)
  exclusion.robots: 0.047 (2)
  exclusion.robots.policy: 0.025 (2)
  esindex: 0.028 (2)
  cdx.remote: 140.883 (2)
  LoadShardBlock: 251.4 (6)
  PetaboxLoader3.datanode: 276.573 (8)
  load_resource: 149.002 (2)
  PetaboxLoader3.resolve: 95.618 (2)
*/