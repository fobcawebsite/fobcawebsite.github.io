var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
function TriggerReactionAndUpdateControl(reactionTrigger, controlJqSelectorOrObject)
{
    var $form = $(reactionTrigger).closest('form');

    var html = SubmitControlReaction($form, true);

    if (html !== null)
    {
        UpdateControlView(controlJqSelectorOrObject, $form, html);
    }
}

function TriggerCustomActionAndUpdateControl(actionTrigger, actionName, actionArg, controlJqSelectorOrObject)
{
    var $form = $(actionTrigger).closest('form');

    var html = SubmitControlCustomAction($form, actionName, actionArg, true);

    if (html !== null)
    {
        UpdateControlView(controlJqSelectorOrObject, $form, html);
    }
}

function TriggerControlReaction(reactionTrigger, isAjax)
{
    var $form = $(reactionTrigger).closest('form');

    if ($form.length === 0)
    {
        $form = $(reactionTrigger).find('form');
    }

    return SubmitControlReaction($form, isAjax);
}

function TriggerControlCustomAction(actionTrigger, actionName, actionArg, isAjax)
{
    return SubmitControlCustomAction($(actionTrigger).closest('form'), actionName, actionArg, isAjax);
}

function SubmitControlReaction($form, isAjax)
{
    return SubmitControlFormSync($form, isAjax, true);
}

function SubmitControlCustomAction($form, actionName, actionArg, isAjax)
{
    var result = null;

    if ($form.length == 1)
    {
        var field = $form.find('.js-custom-action-name-hidden').first();
        field.val(actionName);

        var field2 = $form.find('.js-custom-action-value-hidden').first();
        if (
            actionArg === undefined ||
            actionArg === null
            )
        {
            actionArg = '';
        }
        if (typeof (actionArg) === 'object')
        {
            actionArg = $.toJSON(actionArg);
        }

        field2.val(actionArg);

        result = SubmitControlFormSync($form, isAjax, false);

        field.val('');
        field2.val('');
    }

    return result;
}

function SubmitControlFormSync($form, isAjax, withValidation)
{
    if (isAjax === true)
    {
        var response = null;
        var validator = $form.validate();

        if (
            withValidation !== true ||
            validator.form() === true
            )
        {
            validator.cancelSubmit = true;

            $form.ajaxSubmit({
                cache: false,
                async: false,
                success: function (result)
                {
                    response = result;
                },
                complete: function ()
                {
                    validator.cancelSubmit = false;
                },
                error: function ()
                {
                    showNonModalErrorMessage('There was an error. Please try again and contact support if the problem persists.', 'Server error');
                }
            });
        }

        return response;
    }
    else
    {
        if (withValidation === true)
        {
            $form.submit();
        }
        else
        {
            $form.get(0).submit(); // do native submit
        }

        return null;
    }
}

function UpdateControlView(controlJqSelectorOrObject, $form, newHtml)
{
    var $control;
    if (typeof controlJqSelectorOrObject == 'string')
    {
        $control = $form.closest(controlJqSelectorOrObject);
        if ($control.length === 0) // maybe the control is *inside* the form?
        {
            $control = $form.find(controlJqSelectorOrObject);
        }
    }
    else
    {
        $control = $(controlJqSelectorOrObject);
    }

    $control.
        trigger('beforeViewUpdate').
        replaceWith($.parseHTML(newHtml, true));

    if (typeof MVC_BindClientValidation == 'function')
    {
        MVC_BindClientValidation();
    }
}

function recalculateJqDialogPosition($dialog)
{
    var currentPosition = $dialog.dialog('option', 'position');

    //make it async to let dialog a chance to render content
    setTimeout(
        function ()
        {
            //re-set position to trigger recalc
            $dialog.dialog('option', 'position', currentPosition);
        },
        10
    );
}

function FitJqDialogWithinWindow($dialog)
{
    var overflow = false;

    var $dim = { width: $dialog.width('option', 'width'), height: $dialog.dialog('option', 'height') };
    if ($dim.width === 'auto')
    {
        $dim.width = $dialog.width();
    }
    if ($dim.height === 'auto')
    {
        $dim.height = $dialog.height();
    }

    var $doc = $(document);
    if ($doc.width() < $dim.width)
    {
        $dim.width = parseInt($doc.width() * 0.5);
        overflow = true;
    }
    if ($doc.height() < $dim.height)
    {
        $dim.height = parseInt($doc.height() * 0.7);
        overflow = true;
    }
    if (overflow)
    {
        $dialog.dialog('option', $dim);
    }
}

function openCKFinderPopup(destinationInputId, resourceType)
{
    if (CKFinder)
    {
        CKFinder.
            modal(
                {
                    resourceType: resourceType,
                    chooseFiles: true,
                    width: 800,
                    height: 600,
                    onInit:
                        function (finder)
                        {
                            finder.
                                on(
                                    'files:choose',
                                    function (eventInfo)
                                    {
                                        var urlSetter =
                                            function (url)
                                            {
                                                $('#' + destinationInputId).
                                                    val(url).
                                                    change(); //imitate Change event
                                            };

                                        if (
                                            eventInfo.data.files != null &&
                                            eventInfo.data.files.length > 0
                                            )
                                        {
                                            var file = eventInfo.data.files.first();
                                            var imageUrl = file.getUrl();

                                            if (imageUrl === false)
                                            {
                                                eventInfo.finder.
                                                    request('file:getUrl', { file: file }).
                                                    then(urlSetter);
                                            }
                                            else
                                            {
                                                urlSetter(imageUrl);
                                            }
                                        }
                                    }
                                );
                        }
                }
            );
    }
}

function askConfirmation(title, message, confirmedAction, confirmedActionContext, okButtonText, canceledAction, cancelButtonText)
{
    var $dialog = $('.js-confirmation-dialog');
    if ($dialog.length == 1)
    {
        var $submitBtn = $dialog.find('.js-submit');
        var $cancelBtn = $dialog.find('.js-cancel');

        //initialize on demand
        if ($dialog.data('confirmationDialogInitialized') !== true)
        {
            $dialog.
                dialog(
                    {
                        autoOpen: false,
                        modal: true,
                        draggable: false,
                        resizable: false,
                        autoWidth: 500
                    }
                ).
                on('dialogopen', DialogResponsiveWidth);

            $submitBtn.
                click(
                    function ()
                    {
                        $(this).closest('.js-confirmation-dialog').dialog('close');
                        var action = $dialog.data('confirmedAction');
                        var ctx = $dialog.data('confirmedActionContext');
                        if (typeof (action) == 'function')
                        {
                            action(ctx);
                        }
                    }
                ).
                data('defaultText', $submitBtn.text());

            $cancelBtn.
                click(
                    function ()
                    {
                        $(this).closest('.js-confirmation-dialog').dialog('close');
                        var action = $dialog.data('canceledAction');
                        if (typeof (action) == 'function')
                        {
                            action();
                        }
                    }
                ).
                data('defaultText', $cancelBtn.text());

            $dialog.data('confirmationDialogInitialized', true);
        }

        $dialog.data('confirmedAction', confirmedAction);
        $dialog.data('confirmedActionContext', confirmedActionContext);

        $dialog.data('canceledAction', canceledAction);

        $dialog.dialog('option', 'title', title);
        $dialog.find('.js-message').html(message);
        if (
            okButtonText !== undefined &&
            okButtonText != null &&
            okButtonText != ''
            )
        {
            $submitBtn.text(okButtonText);
        }
        else
        {
            $submitBtn.text($submitBtn.data('defaultText'));
        }
        if (
            cancelButtonText !== undefined &&
            cancelButtonText != null &&
            cancelButtonText != ''
            )
        {
            $cancelBtn.text(cancelButtonText);
        }
        else
        {
            $cancelBtn.text($cancelBtn.data('defaultText'));
        }
        $dialog.dialog('open');
    }
    else
    {
        //fall back to native dialog
        if (
            typeof (confirmedAction) == 'function' &&
            confirm(message)
            )
        {
            confirmedAction(confirmedActionContext);
        }
    }
}

function getTimeInfoFromTimePickerInput($input)
{
    var hour = parseInt($input.timepicker('getHour'));
    var minute = parseInt($input.timepicker('getMinute'));
    var m = hour * 60 + minute;

    var valid =
        hour >= 0 &&
        hour <= 23 &&
        minute >= 0 &&
        minute <= 59;

    var info =
            {
                hour: hour,
                minute: minute,
                totalMinutes: m,
                isValid: valid
            };

    return info;
}

function updateTimepickerBackingField($pickerField, $backingField)
{
    var sec = null;

    var h = parseInt($pickerField.timepicker('getHour'));
    var m = parseInt($pickerField.timepicker('getMinute'));

    if (
        !isNaN(h) &&
        !isNaN(m)
        )
    {
        sec = (h * 60 + m) * 60;
    }

    $backingField.val(sec);
}

function setTimePickerCultureOptions(picker, is12Hours, doesHourHaveLeadingZero, timeSeparator)
{
    picker.timepicker('option', 'showPeriod', is12Hours);
    picker.timepicker('option', 'showPeriodLabels', is12Hours);
    picker.timepicker('option', 'showLeadingZero', doesHourHaveLeadingZero);
    picker.timepicker('option', 'timeSeparator', $.type(timeSeparator) == 'string' ? timeSeparator : ':');
}

//dynamic multi-instance dialog
function showMessage(title, message, buttonText, onClose)
{
    if (
        buttonText == undefined ||
        buttonText == null
        )
    {
        buttonText = 'OK';
    }

    var $dialog =
        $(
            '<div class="dialogue message-box js-message-box" style="display: none;">' +
            '<div class="message">' + message + '</div>' +
            '<ul class="btn-list">' +
            '<li><a href="javascript:void(0)" class="js-btn-cancel">' + buttonText + '</a></li>' +
            '</ul>' +
            '</div>'
        );

    $('body').append($dialog);

    $dialog.find('.js-btn-cancel').click(function () { $(this).closest('.js-message-box').dialog('close'); });
    $dialog.
        dialog(
            {
                width: 500,
                autoOpen: false,
                modal: true,
                draggable: false,
                resizable: false,
                close:
                    function ()
                    {
                        if (typeof onClose == 'function')
                        {
                            try
                            {
                                onClose();
                            }
                            catch (ex)
                            {
                                console.log('Failed to execute onClose callback: ' + ex);
                            }
                        }

                        $(this).remove();
                    }
            }
        ).
        show().
        dialog('option', 'title', title).
        dialog('open');
}

//icons are chars from Entypo font
function showNonModalMessage(title, message, icon)
{
    if (!icon)
    {
        icon = 'W';
    }

    $.notification(
        {
            title: title,
            content: message,
            timeout: 7000,
            border: true,
            fill: true,
            icon: icon
        }
    );
}

function showNonModalErrorMessage(message, title)
{

    $.notification(
        {
            title: title || 'Error',
            content: message,
            timeout: 7000,
            border: true,
            fill: true,
            error: true
        }
    );
}

//used for array binding
function setInputNameAndIdIndex($input, collectionName, index)
{
    var attr = $input.attr('name');
    if (attr != undefined && attr != null && attr != '')
    {
        var re = new RegExp(collectionName + '\\[\\d+]', 'g');
        attr = attr.replace(re, collectionName + '[' + index + ']');
        $input.attr('name', attr);
    }

    attr = $input.attr('id');
    if (attr != undefined && attr != null && attr != '')
    {
        re = new RegExp(collectionName + '_\\d+_', 'g');
        attr = attr.replace(re, collectionName + '_' + index + '_');
        $input.attr('id', attr);
    }
}

if (!String.prototype.htmlEncode)
{
    String.prototype.htmlEncode = function ()
    {
        if ($.type(this) === 'string')
        {
            var $span = $('<span></span>');
            $span.text(this.toString());

            return $span.html();
        }

        return null;
    };
}

if (!String.prototype.htmlDecode)
{
    String.prototype.htmlDecode = function ()
    {
        if ($.type(this) === 'string')
        {
            var $span = $('<span></span>');
            $span.html(this.toString());

            return $span.text();
        }

        return null;
    };
}

Date.prototype.addDaysWithDst =
    Date.prototype.addDaysWithDst ||
    function (days)
    {
        return this.setTime(864E5 * days + this.valueOf()) && this;
    };

Date.prototype.addDaysWithoutDst =
    Date.prototype.addDaysWithoutDst ||
    function (days)
    {
        return this.setDate(this.getDate() + days) && this;
    };

function printPage()
{
    setTimeout(
        function ()
        {
            try
            {
                window.print();
            }
            catch (err) { }
        },
        500
    );
}

function getFileNameFromPath(path)
{
    if (path && path.length > 0)
    {
        var pos = path.replace('/', '\\').lastIndexOf('\\');
        if (pos > -1)
        {
            return path.substr(pos + 1);
        }
    }

    return path;
}

//todo: this method can be affected by a difference between time zone in server-side profile and time zone on local machine.
//so, if they are different, then local DateTime value generated on server (using profile's zone) will differ from Date object generated by this function.
//depends on MomentJS
function createLocalDateFromUtcTicks(ticks)
{
    var date = new Date(ticks);

    return new Date(date.valueOf() + moment(date).zone() * 60 * 1000);
}

function createLocalDateFromUtcDateTimeJson(dtJson)
{
    var ticks = parseInt(dtJson.substr(6));

    return createLocalDateFromUtcTicks(ticks);
}

function createLocalDateFromLocalTicks(ticks)
{
    //the ticks value already contains time zone shift.
    //when JS Date is created from ticks it takes local time zone into account.
    //we do not want local time zone to affect resulting Date object,
    //so we parse ticks to get exact number of years, month, etc.
    var mmt = moment(ticks).utc();

    //then we create exact Date object which does not add local time zone shift
    return new Date(mmt.year(), mmt.month(), mmt.date(), mmt.hour(), mmt.minute());
}

function createLocalDateFromLocalDateTimeJson(dtJson)
{
    var ticks = parseInt(dtJson.substr(6));

    return createLocalDateFromLocalTicks(ticks);
}

if (!String.prototype.formatWith)
{
    String.prototype.formatWith = function ()
    {
        if ($.type(this) === 'string')
        {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) { return typeof args[number] != 'undefined' ? args[number] : match; });
        }

        return null;
    };
}

//String.trim function fix for IE8
if (String.prototype.trim === undefined)
{
    String.prototype.trim =
        function ()
        {
            return $.trim(this);
        };
}

var _cultureSpecificNumberSeparator = (1.1).toLocaleString().substr(1, 1);
var _jsNumberSeparator = '.';
function normalizeDecimalString(str)
{
    if (
        typeof str == 'string' &&
        _cultureSpecificNumberSeparator != _jsNumberSeparator
        )
    {
        str = str.replace(_cultureSpecificNumberSeparator, _jsNumberSeparator);
    }

    return str;
}

function roundNumberToHundredths(number)
{
    return Math.round(number * 100) / 100;
}

Number.prototype.toLocaleStringWithFractionalPart =
    function (digits)
    {
        return this.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    };

//hides option in x-browser way
function HideSelectOption($option)
{
    var $select = $option.parent('select');

    if ($select.length == 1)
    {
        //replace instead of wrap so that option is removed from the select and its state is changed
        $option.
            replaceWith($('<span class="hide"/>').append($option.clone()));
    }
}

function UnhideSelectOption($option)
{
    if ($option.parent('span.hide').length == 1)
    {
        $option.unwrap();
    }
}

function DisableLink($link)
{
    $link.closest('a').
        attr('disabled', 'disabled'). //IE support 'disabled' attr directly, other browsers will use associated CSS
        blur(); //remove focus from the link to clear any hover-related CSS
}

function DisableLinkWithProgress($link)
{
    DisableLink($link);

    var progressText = $link.data('progressText');
    if (
        progressText != null &&
        progressText != ''
        )
    {
        $link.text(progressText);
    }
}

function SetSelectedOption($select, value)
{
    var $options = $select.children('option');
    var $option = $options.filter(function (i, el) { return $(el).val() == value; });
    var index = $options.index($option);

    if (index > -1)
    {
        $select.get(0).selectedIndex = index;
    }
}

function TriggerPrintPreview(css, html)
{
    var printWindow = window.open(null, 'appPrintWindow');

    if (
        printWindow !== null &&
        printWindow !== undefined
        )
    {
        var $html = $($.parseHTML(html, true));
        var $body = $html.find('body');

        var js =
            '<script type="text/javascript">' +
            'setTimeout(function (){ window.print(); window.close(); }, 500);' +
            '</script>';

        if ($body.length === 1)
        {
            $body.append(js);

            html = $('<div/>').append($html).html();
        }
        else
        {
            html = html + js;
        }

        printWindow.document.write(css + html);
        printWindow.document.close();
        printWindow.focus();
    }
}

//note: adapted from mutation-summary.js, may require rework
function IsMutationObserverSupported()
{
    var mutationObserverFunction = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    return typeof mutationObserverFunction == 'function';
}

function IsMutationEventSupported()
{
    return typeof (document.addEventListener) === 'function';
}

function navigateToLinkSafe($a)
{
    if ($a.length !== 1)
    {
        return false;
    }

    var url = $a.attr('href');

    return navigateToUrlSafe(url, $a.attr('target') === '_blank');
}

function navigateToUrlSafe(url, newWindow)
{
    if (
        typeof url !== 'string' ||
        url === ''
        )
    {
        return false;
    }

    if (url === '#')
    {
        return false;
    }

    var js = 'javascript';

    if (
        url.length > js.length &&
        url.substr(0, js.length) === js
        )
    {
        return false;
    }

    if (newWindow === true)
    {
        window.open(url);
    }
    else
    {
        window.location.href = url;
    }

    return true;
}

function FillSelectWithSLI($select, sli)
{
    if (
        $.isArray(sli) &&
        sli.length > 0
    )
    {
        for (var i in sli)
        {
            $select.append($('<option></option>').text(sli[i].Text).val(sli[i].Value));
        }
    }
}

function DialogResponsiveWidth(ev)
{
    var $dlg = $(ev.target);

    var width = $dlg.dialog('option', 'autoWidth') || 700;
    var availableWidth = $(window).width() * 0.8;

    if (availableWidth < width)
    {
        width = availableWidth;
    }

    $dlg.dialog('option', 'width', width);
}

function CreateHelperForSortableTable(ev, el)
{
    var $originalRow = $(el);
    var $newRow = $originalRow.clone();

    //use different names for radios so that they do not loose their checked state
    $newRow.find('input[type=radio]').each(function () { $(this).attr('name', 'cloned-radio') });

    var cellWidth = $originalRow.find('td').map(function () { return $(this).css('width'); }).toArray();

    //make cell width fixed so that row is not shrinked when being dragged
    $newRow.find('td').each(function (i) { $(this).css('width', cellWidth[i]); });

    return $newRow;
}

function IsJsStringEqualToJsToken(str, token)
{
    var isEqual =
        str === token || //exact match
        (
            token !== null &&
            token !== undefined &&
            (
                str === token.toString() || //stringified match
                (
                    str !== null &&
                    str !== undefined &&
                    str.toString().toLowerCase() === token.toString().toLowerCase() //even more loose match, like 'True' = true
                )
            )
        );

    return isEqual;
}

function GetInputValueForValidation($input)
{
    var val = null;

    if ($input.length === 1)
    {
        val = $input.val();
    }
    else
    {
        //MVC uses hidden input for unchecked checkbox

        var $cb = $input.filter('input[type=checkbox]');
        if ($cb.length === 1)
        {
            if ($cb.is(':checked'))
            {
                //take value from checked checkbox
                val = $cb.val();
            }
            else
            {
                //take default value
                val = $input.not($cb).val();
            }
        }

        //there can be multiple radio

        var $rb = $input.filter('input[type=radio]');
        if ($rb.length > 0)
        {
            var $rbChecked = $rb.filter(':checked');

            if ($rbChecked.length === 1)
            {
                //take value from checked radio
                val = $rbChecked.val();
            }
            else
            {
                //treat as no value
                val = null;
            }
        }
    }

    return val;
}

function CreateMomentTimeFormat(is24HoursTimeFormat, doesHourFormatHaveLeadingZero, timeFormatSeparator, forceMinutes, shortAmPm)
{
    var timeFormat = is24HoursTimeFormat === true ? 'H' : 'h';

    if (doesHourFormatHaveLeadingZero === true)
    {
        timeFormat += timeFormat;
    }

    timeFormat += forceMinutes ? timeFormatSeparator + 'mm' : '(' + timeFormatSeparator + 'mm)';

    if (is24HoursTimeFormat === false)
    {
        timeFormat += shortAmPm ? 't' : ' A';
    }

    return timeFormat;
}

function recaptchaExplicitRender($container)
{
    return grecaptcha.render($container.get(0));
}

//JQuery extensions
jQuery(function ($)
{
    $.fn.changeChecked =
        function (isChecked)
        {
            isChecked = isChecked === true;

            this.
                each(
                    function ()
                    {
                        var $el = $(this);
                        var wasChecked = $el.prop('checked') === true;

                        if (wasChecked !== isChecked)
                        {
                            $el.prop('checked', isChecked).change();
                        }
                    }
                );

            return this;
        }

    $.fn.changeDisabled =
        function (isDisabled)
        {
            isDisabled = isDisabled === true;

            this.
                each(
                    function ()
                    {
                        var $el = $(this);
                        var wasDisabled = $el.prop('disabled') === true;

                        if (wasDisabled !== isDisabled)
                        {
                            $el.prop('disabled', isDisabled).change();
                        }
                    }
                );

            return this;
        }
});

function FormInputFilter($input, inputName)
{
    var fieldName = $input.attr('name');

    if (!fieldName)
    {
        return false;
    }

    if (fieldName === inputName)
    {
        return true;
    }

    var nameSuffix = '.' + inputName;
    var lastIndex = fieldName.lastIndexOf(nameSuffix);
    var endsWithSuffix = lastIndex > -1 && lastIndex === fieldName.length - nameSuffix.length;

    return endsWithSuffix;
};
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
  captures_list: 2.025 (2)
  exclusion.robots: 0.064 (2)
  exclusion.robots.policy: 0.027 (2)
  esindex: 0.034 (2)
  cdx.remote: 21.538 (2)
  LoadShardBlock: 246.149 (6)
  PetaboxLoader3.datanode: 369.108 (8)
  load_resource: 252.529 (2)
  PetaboxLoader3.resolve: 60.232
*/