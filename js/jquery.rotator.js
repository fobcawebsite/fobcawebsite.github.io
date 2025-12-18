var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
/*
changeSpeed :		speed of transition [integer, milliseconds, defaults to 300]
effect :			transition effect [string: 'fade', 'slideLeft' or 'none', defaults to 'fade']
speed :				time each slide is shown [integer, milliseconds, defaults to 3000]
fill :				flag indicating whether image should fill container [true/false, defaults to false]. requires imgLiquid plugin.
*/

(function ($)
{
    $.fn.rotatorControl =
        function (settings)
        {
            var config =
                {
                    changeSpeed: 300,
                    effect: 'fade',
                    speed: 3000,
                    fill: false,
                    liquid: false
                };

            if (settings)
            {
                $.extend(true, config, settings);
            }

            // make sure speed is at least 20ms longer than changeSpeed
            if (config.speed < (config.changeSpeed + 20))
            {
                console.log('rotatorControl: Make speed at least 20ms longer than changeSpeed; the fades aren\'t always right on time.');

                return this;
            };

            this.each(
                function ()
                {
                    var $control = $(this);

                    if ($control.data('rotatorControl') == null)
                    {
                        $control.data('rotatorControl', config);
                    }
                    else
                    {
                        return; //element is initialized already
                    }

                    var $gallery = $control.children().remove();
                    var timer = null;
                    var counter = 0; //start from first slide
                    var preloadedImg = [];
                    var howManyInstances = $('.rotatorControl').length + 1;
                    var uniqueClass = 'rotatorControl-' + howManyInstances;

                    // set up wrapper
                    $control.
                        css('position', 'relative').
                        wrap('<div class="rotatorControl ' + uniqueClass + '" />');
                    var $wrapper =
                        $('.' + uniqueClass).
                        css('position', 'relative');

                    if ($gallery.length > 0)
                    {
                        // add first slide to wrapper
                        appendSlideTo($gallery.eq(counter).clone(), $control);

                        // preload slide images into memory
                        preloadImg();

                        //setup transition
                        if ($gallery.length > 1)
                        {
                            timer = setTimeout(function () { play(); }, config.speed);
                        };
                    }

                    //
                    function appendSlideTo($slide, $container)
                    {
                        $slide.appendTo($container);

                        if (
                            config.liquid === true &&
                            typeof $.fn.imgLiquid == 'function'
                            )
                        {
                            $slide.imgLiquid({ fill: config.fill === true });
                        }

                        return $slide;
                    }

                    // utility for loading slides
                    function transitionTo(index)
                    {
                        var slideCount = $gallery.length;
                        var oldCounter = counter;

                        if (
                            counter >= slideCount ||
                            index >= slideCount
                            )
                        {
                            counter = 0;
                        }
                        else if (
                                counter < 0 ||
                                index < 0
                                )
                        {
                            counter = slideCount - 1;
                        }
                        else
                        {
                            counter = index;
                        }

                        if (config.effect === 'slideLeft')
                        {
                            var newSlideDir, oldSlideDir;

                            function slideDir(dir)
                            {
                                newSlideDir = dir === 'right' ? 'left' : 'right';
                                oldSlideDir = dir === 'left' ? 'left' : 'right';
                            };

                            counter >= oldCounter ? slideDir('left') : slideDir('right');

                            appendSlideTo($gallery.eq(counter).clone(), $control).
                                slideRotator({ direction: newSlideDir, changeSpeed: config.changeSpeed });

                            if ($control.children().length > 1)
                            {
                                $control.children().eq(0).
                                    css('position', 'absolute').
                                    slideRotator(
                                        { direction: oldSlideDir, showHide: 'hide', changeSpeed: config.changeSpeed },
                                        function () { $(this).remove(); }
                                    );
                            };
                        }
                        else if (config.effect === 'fade')
                        {
                            appendSlideTo($gallery.eq(counter).clone(), $control).
                                hide().
                                fadeIn(
                                    config.changeSpeed,
                                    function ()
                                    {
                                        //fix for legacy IE
                                        $(this).css('filter', '');
                                    }
                                );

                            if ($control.children().length > 1)
                            {
                                $control.children().eq(0).
                                    css('position', 'absolute').
                                    fadeOut(
                                        config.changeSpeed,
                                        function () { $(this).remove(); }
                                    );
                            };
                        }
                        else if (config.effect === 'none')
                        {
                            appendSlideTo($gallery.eq(counter).clone(), $control);

                            if ($control.children().length > 1)
                            {
                                $control.children().eq(0).
                                    css('position', 'absolute').
                                    remove();
                            };
                        };
                    };

                    // start slide rotation on specified interval
                    function play()
                    {
                        if (!isBusy())
                        {
                            counter++;

                            transitionTo(counter);
                        };

                        timer = setTimeout(function () { play(); }, config.speed);
                    };

                    // is the rotator in mid-transition
                    function isBusy()
                    {
                        return $control.children().length > 1 ? true : false;
                    };

                    // load images into memory
                    function preloadImg()
                    {
                        var index = 0;

                        $gallery.
                            each(
                                function ()
                                {
                                    $(this).find('img').
                                        each(
                                            function ()
                                            {
                                                preloadedImg[index++] = $('<img>').attr('src', $(this).attr('src'));
                                            }
                                        );
                                }
                            );
                    };
                }
            );

            return this;
        };

    $.fn.slideRotator =
        function (settings, callback)
        {
            var config =
                {
                    direction: 'left',
                    showHide: 'show',
                    changeSpeed: 600
                };

            if (settings)
            {
                $.extend(config, settings);
            }

            this.each(
                function ()
                {
                    var $slide = $(this);

                    $slide.css({ left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' });

                    var measurement =
                        config.direction === 'left' ||
                        config.direction === 'right'
                            ? $slide.outerWidth()
                            : $slide.outerHeight();

                    var startStyle = {};
                    startStyle['position'] = $slide.css('position') === 'static' ? 'relative' : $slide.css('position');
                    startStyle[config.direction] = config.showHide === 'show' ? '-' + measurement + 'px' : 0;

                    var endStyle = {};
                    endStyle[config.direction] = config.showHide === 'show' ? 0 : '-' + measurement + 'px';

                    $slide.
                        css(startStyle).
                        animate(endStyle, config.changeSpeed, callback);
                }
            );

            return this;
        };
})(jQuery);
}
/*
     FILE ARCHIVED ON 02:22:15 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:23 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.542 (2)
  exclusion.robots: 0.07 (2)
  exclusion.robots.policy: 0.023 (2)
  esindex: 0.027 (2)
  cdx.remote: 22.431 (2)
  LoadShardBlock: 159.489 (6)
  PetaboxLoader3.datanode: 161.884 (8)
  load_resource: 183.539 (2)
  PetaboxLoader3.resolve: 149.799 (3)
*/