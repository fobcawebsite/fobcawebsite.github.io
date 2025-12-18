var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
/// <reference path="jquery.min.js" />
/// <reference path="jquery.validate-1.8.1.min.js" />

// glue

function __MVC_ApplyValidator_Range(object, min, max) {
    object["range"] = [min, max];
}

function __MVC_ApplyValidator_RegularExpression(object, pattern) {
    object["regex"] = pattern;
}

function __MVC_ApplyValidator_Required(object) {
    object["required"] = true;
}

function __MVC_ApplyValidator_StringLength(object, maxLength) {
    object["maxlength"] = maxLength;
}

function __MVC_ApplyValidator_Unknown(object, validationType, validationParameters) {
    object[validationType] = validationParameters;
}

function __MVC_CreateFieldToValidationMessageMapping(validationFields, formId) {
    var mapping = {};

    for (var i = 0; i < validationFields.length; i++) {
        var thisField = validationFields[i];
        //note: changed by ivan
        mapping[formId + "." + thisField.FieldName] = "form#" + formId + " #" + thisField.ValidationMessageId;
    }

    return mapping;
}

function __MVC_CreateErrorMessagesObject(validationFields) {
    var messagesObj = {};

    for (var i = 0; i < validationFields.length; i++) {
        var thisField = validationFields[i];
        var thisFieldMessages = {};
        messagesObj[thisField.FieldName] = thisFieldMessages;
        var validationRules = thisField.ValidationRules;

        for (var j = 0; j < validationRules.length; j++) {
            var thisRule = validationRules[j];
            if (thisRule.ErrorMessage) {
                var jQueryValidationType = thisRule.ValidationType;
                switch (thisRule.ValidationType) {
                	case "regularExpression":
                	case "regex":
                        jQueryValidationType = "regex";
                        break;

                    case "stringLength":
                    case "length":
                        jQueryValidationType = "maxlength";
                        break;
                }

                thisFieldMessages[jQueryValidationType] = thisRule.ErrorMessage;
            }
        }
    }

    return messagesObj;
}

function __MVC_CreateRulesForField(validationField) {
    var validationRules = validationField.ValidationRules;

    // hook each rule into jquery
    var rulesObj = {};
    for (var i = 0; i < validationRules.length; i++) {
        var thisRule = validationRules[i];
        switch (thisRule.ValidationType) {
        	case "range":
        		var min = thisRule.ValidationParameters["minimum"] || thisRule.ValidationParameters["min"],
        			max = thisRule.ValidationParameters["maximum"] || thisRule.ValidationParameters["max"];
        		__MVC_ApplyValidator_Range(rulesObj, min, max);
        		break;

            case "regularExpression":
            case "regex":
                __MVC_ApplyValidator_RegularExpression(rulesObj, thisRule.ValidationParameters["pattern"]);
                break;

            case "required":
                __MVC_ApplyValidator_Required(rulesObj);
                break;

            case "stringLength":
                __MVC_ApplyValidator_StringLength(rulesObj, thisRule.ValidationParameters["maximumLength"]);
                break;

            case "length"://new
               	__MVC_ApplyValidator_StringLength(rulesObj, thisRule.ValidationParameters["max"]);
               	break;

            default:
                __MVC_ApplyValidator_Unknown(rulesObj, thisRule.ValidationType, thisRule.ValidationParameters);
                break;
        }
    }

    return rulesObj;
}

function __MVC_CreateValidationOptions(validationFields) {
    var rulesObj = {};
    for (var i = 0; i < validationFields.length; i++) {
        var validationField = validationFields[i];
        var fieldName = validationField.FieldName;
        rulesObj[fieldName] = __MVC_CreateRulesForField(validationField);
    }

    return rulesObj;
}

//if we don't add a ValidationMessageFor for fields with no validation, jQuery.Validate will crash onBlur from these fields
//so we must add the class=noValidation to the fields - we will add empty rulles for it
function __MVC_AddDummiesForFieldsWithNoValidation(validationContext)
{
	var theForm = $("#" + validationContext.FormId);
	var fieldsWithNoValidation = theForm.find(".noValidation");
	for (var idx = 0; idx < fieldsWithNoValidation.length; ++idx)
	{
		validationContext.Fields.push({ FieldName: fieldsWithNoValidation.eq(idx).attr("name"), ValidationRules: [] });
	}
}

function __MVC_EnableClientValidation(validationContext) {
    // this represents the form containing elements to be validated
    var theForm = $("#" + validationContext.FormId);
    
	__MVC_AddDummiesForFieldsWithNoValidation(validationContext);
    var fields = validationContext.Fields;
    var rulesObj = __MVC_CreateValidationOptions(fields);
    var fieldToMessageMappings = __MVC_CreateFieldToValidationMessageMapping(fields, validationContext.FormId);
    var errorMessagesObj = __MVC_CreateErrorMessagesObject(fields);

    var options = {
        errorClass: "input-validation-error",
        errorElement: "span",
        errorContainer: 'span.field-validation-valid',
        errorLabelContainer: 'span.field-validation-error',
        errorPlacement:
            //note: changed by ivan
            function (error, element)
            {
                var messageSpan = fieldToMessageMappings[element.closest("form").attr("id") + "." + element.attr("name")];
                if (messageSpan == undefined)
                {
                    //support for dynamic rules
                    messageSpan = "#" + element.closest("form").attr("id") + " #" + element.attr("id") + "_validationMessage";
                }
                $(messageSpan).empty().removeClass("field-validation-valid").addClass("field-validation-error");
                error.removeClass("input-validation-error").attr("_for_validation_message", messageSpan).appendTo(messageSpan);
                error.closest('.field-validation-error').filter('.with-title').attr('title', error.text());
            },
        messages: errorMessagesObj,
        rules: rulesObj,
        success: function(label) {
            var messageSpan = $(label.attr("_for_validation_message"));
            $(messageSpan).empty().addClass("field-validation-valid").removeClass("field-validation-error");
        }
    };

    //note: added by ivan, apply form-specific options, above options have priority
    var formOptionsString = theForm.attr('validate');
    if (
        formOptionsString != null &&
        formOptionsString != '' &&
        formOptionsString != undefined
        )
    {
        var formOptions = $.parseJSON(formOptionsString);
        options = $.extend(formOptions, options);
    }

    // register callbacks with our AJAX system
    var formElement = document.getElementById(validationContext.FormId);
    var registeredValidatorCallbacks = formElement.validationCallbacks;
    if (!registeredValidatorCallbacks) {
        registeredValidatorCallbacks = [];
        formElement.validationCallbacks = registeredValidatorCallbacks;
    }
    registeredValidatorCallbacks.push(function() {
        theForm.validate();
        return theForm.valid();
    });

    theForm.validate(options);
}

// need to wait for the document to signal that it is ready
$(document).ready(function ()
{
	MVC_BindClientValidation();
});

//added this to enable binding the validation to form fields when the entire form was returned via ajax + it's validation rule object
function MVC_BindClientValidation()
{
	var allFormOptions = window.mvcClientValidationMetadata;
	if (allFormOptions)
	{
		while (allFormOptions.length > 0)
		{
			var thisFormOptions = allFormOptions.pop();
			__MVC_EnableClientValidation(thisFormOptions);
		}
	}
}

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
  captures_list: 1.994 (2)
  exclusion.robots: 0.041 (2)
  exclusion.robots.policy: 0.02 (2)
  esindex: 0.022 (2)
  cdx.remote: 126.135 (2)
  LoadShardBlock: 171.024 (6)
  PetaboxLoader3.datanode: 232.151 (8)
  load_resource: 416.003 (2)
  PetaboxLoader3.resolve: 322.62
*/