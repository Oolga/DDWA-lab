import {createWorkerClick} from '../managers/elements-events-manager'

export function initValidator(){
    jQuery.validator.addMethod(
        'regexp',
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    $('#formWorker').validate({
        rules:{
            firstname: {
                required: true,
                regexp: '^[а-яА-ЯёЁ]+$',
                maxlength: 50
            },
            lastname: {
                required: true,
                regexp: '^[а-яА-ЯёЁa]+$',
                maxlength: 50
            },
            middlename: {
                required: true,
                regexp: '^[а-яА-Яё]+$',
                maxlength: 50
            },
            gender: {
                required: true
            },
            position: {
                required: true,
                maxlength: 100
            },
            numberOfHoursInAir:{
                required: true,
                regexp: '^[0-9]+'
            },
            oldWorkplaces:{
                required: true
            },
            experience:{
                required: true,
                regexp: '^[0-9]+'
            },
            salary:{
                required: true,
                regexp: '^[0-9]+'
            },
            startDate: {
                required: true
            }
        },
        messages: {
            firstname:  {
                required: 'Поле является обязательным',
                regexp: 'Поле должно содержать только буквы русского алфавита'
            },
            lastname:  {
                required: 'Поле является обязательным',
                regexp: 'Поле должно содержать только буквы русского алфавита'
            },
            middlename:  {
                required: 'Поле является обязательным',
                regexp: 'Поле должно содержать только буквы русского алфавита'
            },
            gender:{
                required: 'Поле является обязательным'
            },
            position: {
                required: 'Поле является обязательным'
            },
            numberOfHoursInAir:{
                required: 'Поле является обязательным',
                diget: 'Поле должно содержать только цифры'
            },
            oldWorkplaces:{
                required: 'Поле является обязательным'
            },
            experience:{
                required: 'Поле является обязательным',
                diget: 'Поле должно содержать только цифры'
            },
            salary:{
                required: 'Поле является обязательным',
                diget: 'Поле должно содержать только цифры'
            },
            startDate: {
                required: 'Поле является обязательным'
            }
        },
        submitHandler: function (event) {
            debugger;
            createWorkerClick(event);
        },
        errorLabelContainer: '.error-label'
    });
}


/*export function isValidForm(event){
    event = (event ? event : window.event);
    let form = event;
    let field;
    let formvalid = true;

    for (let i = 0; i < form.elements.length; i++) {
        field = form.elements[i];
        if (!isInputField(field)) continue;

        if (typeof field.willValidate !== "undefined") {
            if (field.nodeName === "INPUT") {
                field.setCustomValidity(LegacyValidation(field) ? "" : "error");
            }

            field.checkValidity();
        } else {

            field.validity = field.validity || {};

            field.validity.valid = LegacyValidation(field);
        }

        if (field.validity.valid) {
            field.style.border = "1px solid rgba(0, 0, 0, 0.15)";
            if (field.parentElement.children[1].nodeName !== "INPUT")
                field.parentElement.children[1].style.display = "none";

        } else {

            field.style.border = "1px solid red";
            field.parentElement.children[1].style.display = "inline-table";

            formvalid = false;
        }

    }

    return formvalid;
}

function isInputField(field) {
    return (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA" || field.nodeName !== "SELECT") && field.style.display !== "none" && field.type != "submit";
}

function LegacyValidation(field) {

    let
        valid = true,
        val = field.value,
        type = field.getAttribute("type"),
        chkbox = (type === "checkbox" || type === "radio"),
        required = field.getAttribute("required"),
        minlength = field.getAttribute("minlength"),
        maxlength = field.getAttribute("maxlength"),
        pattern = field.getAttribute("pattern");

    if (field.disabled) return valid;

    valid = valid && (!required ||
        (chkbox && field.checked) ||
        (!chkbox && val !== "")
    );

    valid = valid && (chkbox || (
        (!minlength || val.length >= minlength) &&
        (!maxlength || val.length <= maxlength)
    ));

    if (valid && pattern) {
        pattern = new RegExp(pattern);
        valid = pattern.test(val);
    }

    return valid;
}*/