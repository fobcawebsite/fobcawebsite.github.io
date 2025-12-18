var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
jQuery(function ($)
{
    function InitSubMenus()
    {
        $('.nav-side .mainmenu .menunode').
            each(
                function ()
                {
                    var $node = $(this);

                    if ($node.closest('.menubranch').find('.menubranchchildren').length > 0)
                    {
                        $node.addClass('parent-menu');
                    }
                }
            );
    }

    $('.nav-side .mainmenu').
        publicWebsiteMainMenu('disable').
        on('updated', function () { InitSubMenus(); });

    $('.menu-btn').
        click(
            function ()
            {
                $(this).toggleClass('menu-active');

                $('.nav-side').toggleClass('nav-open');

                if ($('.nav-side').hasClass('nav-open'))
                {
                    $('.nav-side').animate({ right: 0 });

                    $('.skinbody').animate({ right: $('.nav-side').width() });
                }
                else
                {
                    $('.nav-side').animate({ right: -1 * $('.nav-side').width() });

                    $('.skinbody').animate({ right: 0 });
                }
            }
        );

    $('.nav-side').
        on(
            'click',
            '.mainmenu .menunode a',
            function ()
            {
                $(this).closest('.menubranch').children('.menubranchchildren').slideToggle();
            }
        );

    $(window).
        resize(
            function ()
            {
                if ($('.nav-side').hasClass('nav-open'))
                {
                    $('.skinbody').css({ 'right': $('.nav-side').width() });
                }
                else
                {
                    $('.nav-side').removeAttr('style');
                }
            }
        );

    InitSubMenus();
});
}
/*
     FILE ARCHIVED ON 02:22:17 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:25 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.429 (2)
  exclusion.robots: 0.051 (2)
  exclusion.robots.policy: 0.022 (2)
  esindex: 0.025 (2)
  cdx.remote: 31.731 (2)
  LoadShardBlock: 151.042 (6)
  PetaboxLoader3.datanode: 161.491 (8)
  load_resource: 118.533 (2)
  PetaboxLoader3.resolve: 59.104 (2)
*/