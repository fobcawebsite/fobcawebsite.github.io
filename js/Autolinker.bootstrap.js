var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
jQuery(
    function ($)
    {
        var $targets = $('.js-urltolink');

        if ($targets.length > 0)
        {
            var autolinker = new Autolinker({ newWindow: false, stripPrefix: false, truncate: 50, urls: true, email: false, twitter: false });

            $targets.
                each(
                    function (i, el)
                    {
                        var $target = $(el);

                        var html = $target.html();

                        var linked = autolinker.link(html);

                        $target.html(linked);
                    }
                );
        }
    }
);
}
/*
     FILE ARCHIVED ON 02:22:16 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:23 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.914 (2)
  exclusion.robots: 0.029 (2)
  exclusion.robots.policy: 0.013 (2)
  esindex: 0.019 (2)
  cdx.remote: 14.695 (2)
  LoadShardBlock: 308.597 (6)
  PetaboxLoader3.datanode: 256.324 (8)
  load_resource: 115.486 (2)
  PetaboxLoader3.resolve: 79.435 (2)
*/