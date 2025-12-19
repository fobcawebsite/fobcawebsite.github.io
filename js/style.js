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
                    $('.nav-side').animate({ top: $('.header-in').height() }, 0);
                    
                    $('.nav-side').animate({ right: 0 });  
                    
                                      
                }
                else
                {
                    $('.nav-side').animate({ 'right': -1 * $('.nav-side').width() });

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
                $('.nav-side').animate({ top: $('.header-in').height()}, 0);

                if ($('.nav-side').hasClass('nav-open'))
                {
                    
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