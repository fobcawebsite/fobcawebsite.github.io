var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
// fixes for builtin methods

$.validator.methods.range =
    function (value, element, param)
    {
        var globalizedValue = value.replace(",", ".");
        if (globalizedValue[0] === '.')
        {
            globalizedValue = '0' + globalizedValue;
        }

        return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
    };

$.validator.methods.number =
    function (value, element)
    {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s,]\d{3})+)*(?:[\.,]\d+)?$/.test(value);
    };


$.validator.methods.email =
    function (value, element, params)
    {
        if (this.optional(element))
        {
            return true;
        }

        if (
            value != null &&
            value != ''
            )
        {
            //tolerate leading/traling spaces and let server side remove them
            value = value.toString().trim();

            var hasPattern = !(typeof params.Pattern == 'undefined');
            var pattern = hasPattern ? params.Pattern : '^[A-Za-z0-9._%+\\-`&!#$\']+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$';

            return $.validator.methods.regex.call(this, value, element, pattern);
        }

        return true;
    };

// new methods

$.validator.
    addMethod(
        "regex",
        function (value, element, params)
        {
            if (this.optional(element))
            {
                return true;
            }

            var match = new RegExp(params).exec(value);
            return (match && (match.index === 0) && (match[0].length === value.length)); //complete string match
        }
    );

$.validator.
    addMethod(
        'timeRange',
        function (value, element, params)
        {
            var idRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Id = $el1.attr('id');
            var el2Id = el1Id.replace(idRe, params.PairedPropertyName);
            var $el2 = $form.find('#' + el2Id);
            var el1Val = $el1.val();
            var el2Val = $el2.val();

            if (
                $el1.hasClass('hasTimepicker') && $el2.hasClass('hasTimepicker') &&
                el1Val != undefined && el1Val != null && el1Val != '' &&
                el2Val != undefined && el2Val != null && el2Val != ''
                )
            {
                var t1 = getTimeInfoFromTimePickerInput($el1);
                var t2 = getTimeInfoFromTimePickerInput($el2);

                var valid = params.IsStartOfRange ? t1.totalMinutes < t2.totalMinutes : t2.totalMinutes < t1.totalMinutes;

                return valid;
            }

            return true;
        },
        'Time range is invalid'
    );

$.validator.
    addMethod(
        'manualTimeEntry',
        function (value, element, params)
        {
            if (!this.optional(element))
            {
                var $picker = $(element);

                if ($picker.hasClass('hasTimepicker'))
                {
                    //validate picker field

                    var info = getTimeInfoFromTimePickerInput($picker);

                    return info.isValid;
                }
                else
                {
                    //validate backing field

                    return parseInt($picker.val()) >= 0;
                }
            }

            return true;
        },
        'Time value is invalid'
    );

$.validator.
    addMethod(
        'dateRange',
        function (value, element, params)
        {
            var idRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Id = $el1.attr('id');
            var el2Id = el1Id.replace(idRe, params.PairedPropertyName);
            var $el2 = $form.find('#' + el2Id);
            var el1Val = $el1.val();
            var el2Val = $el2.val();

            if (
                $el1.hasClass('hasDatepicker') && $el2.hasClass('hasDatepicker') &&
                el1Val != undefined && el1Val != null && el1Val != '' &&
                el2Val != undefined && el2Val != null && el2Val != ''
                )
            {
                var dt1 = $el1.datepicker('getDate');
                var dt2 = $el2.datepicker('getDate');

                var fromDate = params.IsStartOfRange ? dt1.valueOf() : dt2.valueOf();
                var toDate = params.IsStartOfRange ? dt2.valueOf() : dt1.valueOf();

                var valid =
                    (params.AllowTheSameDay && fromDate <= toDate) ||
                    (!params.AllowTheSameDay && fromDate < toDate);

                return valid;
            }

            return true;
        },
        'Date range is invalid'
    );

$.validator.
    addMethod(
        'orgUnitMemberRequired',
        function (value, element, params)
        {
            var idRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Id = $el1.attr('id');
            var el2Id = el1Id.replace(idRe, params.PairedPropertyName);
            var $el2 = $form.find('input#' + el2Id);
            var el2Val = $el2.val();

            var maxInt32 = Math.pow(2, 32);

            var isValid = $.validator.methods.range.call(this, el2Val, $el2.get(0), [1, maxInt32]);

            return isValid;
        },
        'Member should be selected from suggested list'
    );

$.validator.
    addMethod(
        'groupMemberRequired',
        function (value, element, params)
        {
            var idRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Id = $el1.attr('id');
            var el2Id = el1Id.replace(idRe, params.PairedPropertyName);
            var $el2 = $form.find('input#' + el2Id);
            var el2Val = $el2.val();

            var maxInt32 = Math.pow(2, 32);

            var isValid = $.validator.methods.range.call(this, el2Val, $el2.get(0), [1, maxInt32]);

            return isValid;
        },
        'Member should be selected from suggested list'
    );

$.validator.
    addMethod(
        'requiredIfOtherPropertyEquals',
        function (value, element, params)
        {
            var nameRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Name = $el1.attr('name');
            var el2Name = el1Name.replace(nameRe, params.ReferencedPropertyName);
            var $el2 = $form.find('*[name="' + el2Name + '"]');
            var el2Val = GetInputValueForValidation($el2);
            var el2RequiredVals = $.parseJSON(params.ReferencedPropertyValues);

            if ($.isArray(el2RequiredVals))
            {
                for (var i in el2RequiredVals)
                {
                    var isEqual = IsJsStringEqualToJsToken(el2Val, el2RequiredVals[i]);

                    if (isEqual)
                    {
                        var isValid = $.validator.methods.required.call(this, value, element);

                        if (!isValid)
                        {
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        'Required'
    );

$.validator.
    addMethod(
        'requiredIfOtherPropertyDoesNotEqual',
        function (value, element, params)
        {
            var nameRe = new RegExp(params.PropertyName + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Name = $el1.attr('name');
            var el2Name = el1Name.replace(nameRe, params.ReferencedPropertyName);
            var $el2 = $form.find('*[name="' + el2Name + '"]');
            var el2Val = GetInputValueForValidation($el2);
            var el2RequiredVals = $.parseJSON(params.ReferencedPropertyValues);

            if ($.isArray(el2RequiredVals))
            {
                var isEqual = false;

                for (var i in el2RequiredVals)
                {
                    isEqual = IsJsStringEqualToJsToken(el2Val, el2RequiredVals[i]);

                    if (isEqual)
                    {
                        break;
                    }
                }

                if (!isEqual)
                {
                    return $.validator.methods.required.call(this, value, element);
                }
            }

            return true;
        },
        'Required'
    );

$.validator.
    addMethod(
        'compareTo',
        function (value, element, params)
        {
            var idRe = new RegExp(params.Property + '$');
            var $el1 = $(element);
            var $form = $el1.closest('form');
            var el1Id = $el1.attr('id');
            var el2Id = el1Id.replace(idRe, params.OtherProperty);
            var $el2 = $form.find('#' + el2Id);

            return $el2.val() === value;
        }
    );

$.validator.
    addMethod(
        'propertiesCompare',
        function (value, element, params)
        {
            var otherValue;
            var thisValue;

            var areValuesSetFromDatePicker = false;

            if (params.IsDateTimeValue)
            {

                var thisId = $(element).attr('id');
                if ((thisId != null) && (thisId != '') && (thisId !== undefined))
                {
                    var thisDateDataInput = $('#' + thisId + '_DateTimeData');
                    if (thisDateDataInput.length > 0)
                    {
                        var otherInput = $('#' + params.OtherProperty);
                        if (otherInput.length > 0)
                        {
                            var otherId = otherInput.attr('id');
                            if ((otherId != null) && (otherId != '') && (otherId !== undefined))
                            {
                                var otherDateDataInput = $('#' + otherId + '_DateTimeData');
                                if (otherDateDataInput.length > 0)
                                {
                                    thisValue = parseInt(thisDateDataInput.val());
                                    otherValue = parseInt(otherDateDataInput.val());
                                    areValuesSetFromDatePicker = true;
                                }
                            }
                        }
                    }
                }
            }

            if (!areValuesSetFromDatePicker)
            {
                otherValue = $('#' + params.OtherProperty).val();
                thisValue = value;
            }

            switch (params.CompareOperation)
            {
                case params.EQUAL_operation:
                    return thisValue === otherValue;
                case params.GREATER_operation:
                    return thisValue > otherValue;
                case params.GREATER_EQUAL_operation:
                    return thisValue >= otherValue;
                case params.LESS_operation:
                    return thisValue < otherValue;
                case params.LESS_EQUAL_operation:
                    return thisValue <= otherValue;
                case params.NOT_EQUAL_operation:
                    return thisValue !== otherValue;
                default:
                    return true;
            }
        }
    );

$.validator.
    addMethod(
        'uniqueBillingCode',
        function (value, element, params)
        {
            var isValid = true;

            var code = (value == null || value == undefined) ? '' : value.toString();

            //do not require it
            if (code.length > 0)
            {
                var $idField =
                    $(element).
                    closest('form').
                    find('input').
                    filter( 
                        function ()
                        {
                            return FormInputFilter($(this), params.IdName);
                        }
                    );

                if ($idField.length !== 1)
                {
                    throw new Error('Code Id field is not found');
                }

                var id = $idField.val();

                $.ajax({ async: false, cache: false, url: params.Url, type: 'post', data: { id: id, code: code }, success: function (resp) { isValid = (resp === true); } });
            }

            return isValid;
        },
        'Billing code is invalid or in use'
    );

$.validator.
    addMethod(
        'uniqueUserEmail',
        function (value, element, params)
        {
            var isValid = true;

            var email = (value == null || value == undefined) ? '' : value.toString();

            //do not require it
            if (email.length > 0)
            {
                var $form = $(element).closest('form');

                var $userIdField =
                    $form.
                    find('input').
                    filter(
                        function ()
                        {
                            return FormInputFilter($(this), params.UserIdName);
                        }
                    );

                if ($userIdField.length !== 1)
                {
                    throw new Error('User Id field is not found');
                }

                var $orgUnitIdField =
                    $form.
                    find('input').
                    filter(
                        function ()
                        {
                            return FormInputFilter($(this), params.OrgUnitIdName);
                        }
                    );

                if ($orgUnitIdField.length !== 1)
                {
                    throw new Error('OU Id field is not found');
                }

                var userId = $userIdField.val();
                var orgUnitId = $orgUnitIdField.val();

                $.ajax(
                    {
                        async: false,
                        cache: false,
                        url: params.Url,
                        type: 'post',
                        data: { id: userId, orgUnitId: orgUnitId, email: email },
                        success:
                            function (resp)
                            {
                                isValid = (resp === true);

                                $form.trigger('UniqueUserEmailValidation', [isValid]);
                            },
                        error:
                            function ()
                            {
                                $form.trigger('UniqueUserEmailValidation', [isValid]);
                            }
                    }
                );
            }

            return isValid;
        },
        'Specified email address can\'t be used'
    );

$.validator.
    addMethod(
        'customDomain',
        function (value, element, params)
        {
            var isValid =
                $.validator.methods.regex.call(this, value, element, params.DomainExpression) &&
                value.toLowerCase().indexOf('www.') !== 0;

            return isValid;
        },
        'Custom domain name is invalid'
    );

$.validator.
    addMethod(
        'subDomain',
        function (value, element, params)
        {
            var isValid =
                $.validator.methods.regex.call(this, value, element, params.SubdomainExpression) &&
                value.toLowerCase() !== 'www';

            if (isValid === true)
            {
                $.ajax(
                    {
                        async: false,
                        url: params.Url,
                        type: 'post',
                        data: { subdomain: value },
                        dataType: 'json',
                        success: function (resp) { isValid = resp !== true; },
                        error: function () { isValid = false; }
                    }
                );
            }

            return isValid;
        },
        'Sub-domain name is invalid or in use'
    );

$.validator.
    addMethod(
        "websitePageAlias",
        function (value, element, params)
        {
            var idRe = new RegExp(params.AliasPropertyName + '$');
            var $aliasField = $(element);
            var $form = $aliasField.closest('form');
            var aliasFieldId = $aliasField.attr('id');

            var $pageIdField = $form.find('#' + aliasFieldId.replace(idRe, params.PageIdPropertyName));

            var isValid = false;

            var alias = value;
            var pageId = $pageIdField.val();

            $.ajax(
                {
                    async: false,
                    type: 'post',
                    url: params.ValidationUrl,
                    data: { pageId: pageId, alias: alias },
                    success:
                        function (resp)
                        {
                            isValid = resp === true;
                        }
                }
            );

            return isValid;
        },
        'Page alias is invalid or in use'
    );

$.validator.
    addMethod(
        "nonEmptyValueCollection",
        function (value, element, params)
        {
            var isValid = false;

            var $el = $(element);

            if ($el.prop('tagName') === 'SELECT')
            {
                isValid = $el.find('option').length > 0;
            }

            return isValid;
        },
        'At least one value is required'
    );

$.validator.
    addMethod(
        "callback",
        function (value, element, params)
        {
            if (
                params &&
                typeof params.callback === 'function'
                )
            {
                var fn = params.callback;

                return fn.call(this, value, element, params) === true;
            }

            return true;
        },
        'Not valid'
    );

$.validator.
    addMethod(
        "stripeCardElement",
        function (value, element, params)
        {
            var $form = $(element).closest('form');

            var isVisible = $form.find('.StripeElement:visible').length > 0;

            if (!isVisible)
            {
                return true;
            }

            var required = params.Required === true;

            var isValid =
                $form.find('.StripeElement--invalid').length === 0 &&
                (
                    !required ||
                    $form.find('.StripeElement--empty').length === 0
                );

            return isValid;
        },
        'Card data is not valid'
    );

$.validator.
    addMethod(
        'notClubEmailAccount',
        function (value, element, params)
        {
            var isValid = true;

            var email = (value == null || value == undefined) ? '' : value.toString();

            //do not require it
            if (email.length > 0)
            {
                var $form = $(element).closest('form');

                var $orgUnitIdField =
                    $form.
                    find('input').
                    filter(
                        function ()
                        {
                            return FormInputFilter($(this), params.OrgUnitIdName);
                        }
                    );

                if ($orgUnitIdField.length !== 1)
                {
                    throw new Error('OU Id field is not found');
                }

                var orgUnitId = $orgUnitIdField.val();

                $.ajax(
                    {
                        async: false,
                        url: params.Url,
                        type: 'post',
                        data: { orgUnitId: orgUnitId, email: email },
                        success:
                            function (resp)
                            {
                                isValid = (resp === false);
                            }
                    }
                );
            }

            return isValid;
        },
        'Group email account can\'t be used'
    );
}
/*
     FILE ARCHIVED ON 02:22:15 Apr 05, 2025 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:29:25 Dec 18, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.621 (2)
  exclusion.robots: 0.032 (2)
  exclusion.robots.policy: 0.016 (2)
  esindex: 0.019 (2)
  cdx.remote: 18.589 (2)
  LoadShardBlock: 338.573 (6)
  PetaboxLoader3.datanode: 453.948 (8)
  load_resource: 243.374 (2)
  PetaboxLoader3.resolve: 64.956
*/