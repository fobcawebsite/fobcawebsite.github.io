var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
(function ()
{
    //
    $(
        function ()
        {
            //if MutationObserver is supported, then wrap native checkbox with a mockup,
            //make the checkbox invisible and sync any checkbox changes to the mockup
            if (IsMutationObserverSupported())
            {
                //style already available checkboxes
                $('.styled-checkbox').
                    each(
                        function (i, el)
                        {
                            var $cb = $(el);

                            ApplyCheckboxStyleAndObserveMutations($cb);
                        }
                    );

                //observe DOM changes and style new checkboxes
                $(document).mutationSummary('connect', { callback: DomMutationObserver, queries: [{ element: '.styled-checkbox' }] });
            }
            else if (IsMutationEventSupported())
            {
                //style already available checkboxes
                $('.styled-checkbox').
                    each(
                        function (i, el)
                        {
                            var $cb = $(el);

                            DeferredApplyCheckboxStyleAndHandleMutationEvents.apply($cb);
                        }
                    );

                //observe DOM changes and style new checkboxes
                document.addEventListener('DOMNodeInserted', DomMutationEventHandler, false);
            }
        }
    );

    //
    function ApplyCheckboxStyleAndObserveMutations($cb)
    {
        //apply style
        ApplyCheckboxStyle($cb);

        //watch for changes
        $cb.
            mutationSummary('connect', { callback: CheckboxMutationObserver, queries: [{ all: true }] }).
            change(CheckboxChangeHandler);
    }

    //
    function DomMutationObserver(summaryArray)
    {
        var summary = summaryArray[0];

        if (
            $.isArray(summary.added) &&
            summary.added.length > 0
            )
        {
            for (var index in summary.added)
            {
                var $cb = $(summary.added[index]);

                ApplyCheckboxStyleAndObserveMutations($cb);
            }
        }
    }

    //
    function DeferredApplyCheckboxStyleAndHandleMutationEvents()
    {
        var $cb = $(this);

        //apply style
        ApplyCheckboxStyle($cb);

        //watch for changes
        $cb.get(0).addEventListener('DOMAttrModified', CheckboxMutationEventHandler, false);
        $cb.change(CheckboxChangeHandler);
    }

    //
    function DomMutationEventHandler(ev)
    {
        var $el = $(ev.target);

        if (
            $el.hasClass('styled-checkbox') &&
            !$el.parent().hasClass('styled-checkbox-face') //make sure the checkbox is not styled yet
            )
        {
            setTimeout($.proxy(DeferredApplyCheckboxStyleAndHandleMutationEvents, $el), 1);
        }
    }

    //
    function ApplyCheckboxStyle($cb)
    {
        //create mockup
        var $mockup = $('<div class="styled-checkbox-face styled-checkbox-face-off"/>');

        //add custom class if needed
        var cbStyle = $cb.attr('checkboxStyle');
        if (cbStyle && cbStyle.length > 0)
        {
            $mockup.addClass(cbStyle);
        }

        //replace checkbox with mockup
        if ($.support.opacity)
        {
            $cb.css('opacity', '0');
        }
        else
        {
            $cb.css('filter', 'alpha(opacity=0)');
        }
        $cb.wrap($mockup);

        //transfer some CSS to mockup
        CopyCssToMockup($cb, ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'position', 'top', 'left']);

        //fix checkbox CSS to make it fit into mockup
        $cb.
            css('margin-top', '0').
            css('margin-left', '0').
            css('padding-top', '0').
            css('padding-left', '0');

        //copy state from checkbox to mockup
        SyncCheckboxToMockup($cb);
    }

    //
    function CheckboxMutationObserver(summaryArray)
    {
        var summary = summaryArray[0];

        if (summary.attributeChanged != null)
        {
            for (var propName in summary.attributeChanged)
            {
                var attrHolders = summary.attributeChanged[propName];

                if (attrHolders.length > 0)
                {
                    for (var index in attrHolders)
                    {
                        var $cb = $(attrHolders[index]);

                        //merge checkbox changes into mockup
                        SyncCheckboxToMockup($cb);
                    }
                }
            }
        }
    }

    //
    function CheckboxMutationEventHandler(ev)
    {
        var $cb = $(ev.target);

        //merge checkbox changes into mockup.
        //use deferred sync to work around an issue with IE9.
        setTimeout($.proxy(DeferredSyncCheckboxToMockup, $cb), 1);
    }

    //
    function CheckboxChangeHandler(ev)
    {
        var $cb = $(ev.target);

        //merge checkbox changes into mockup.
        //use deferred sync to work around an issue with too early Change event in Chrome.
        setTimeout($.proxy(DeferredSyncCheckboxToMockup, $cb), 50);
    }

    //
    function DeferredSyncCheckboxToMockup()
    {
        var $cb = $(this);

        SyncCheckboxToMockup($cb);
    }

    //
    function SyncCheckboxToMockup($cb)
    {
        var $mockup = $cb.parent();
        var isChecked = $cb.prop('checked');
        var isDisabled = $cb.prop('disabled');

        if (isChecked)
        {
            $mockup.
                removeClass('styled-checkbox-face-off').
                addClass('styled-checkbox-face-on');
        }
        else
        {
            $mockup.
                removeClass('styled-checkbox-face-on').
                addClass('styled-checkbox-face-off');
        }

        if (isDisabled)
        {
            $mockup.addClass('styled-checkbox-face-disabled');
        }
        else
        {
            $mockup.removeClass('styled-checkbox-face-disabled');
        }
    }

    //
    function CopyCssToMockup($cb, propArray)
    {
        var $mockup = $cb.parent();
        for (var index in propArray)
        {
            var cssProp = propArray[index];

            $mockup.css(cssProp, ($cb.css(cssProp)));
        }
    }
}
)();
}
/*
     FILE ARCHIVED ON 02:22:17 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:24 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.893 (2)
  exclusion.robots: 0.028 (2)
  exclusion.robots.policy: 0.014 (2)
  esindex: 0.019 (2)
  cdx.remote: 27.626 (2)
  LoadShardBlock: 304.954 (6)
  PetaboxLoader3.datanode: 334.662 (8)
  load_resource: 104.832 (2)
*/