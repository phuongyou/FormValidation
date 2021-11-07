






function Validator(option) {

    var selecRules = {}


    function validate(inputElement, rule) {

        var mgs = inputElement.parentElement.querySelector(option.errorMessage)
        // const errorMgs = rule.test(inputElement.value)


        var errorMgs
        var rules = selecRules[rule.selector]




        for (var i = 0; i < rules.length; i++) {

            errorMgs = rules[i](inputElement.value)

            if (errorMgs) break
        }


        if (errorMgs) {

            mgs.innerText = errorMgs
            inputElement.parentElement.classList.add('invalid')

        } else {

            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMgs
    }


    var formElement = document.querySelector(option.form)

    if (formElement) {

        //Xử lý submit form
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var isValid = true

            option.rules.forEach(function (rule) {

                var inputElement = formElement.querySelector(rule.selector)
                var currentValid = validate(inputElement, rule)

                if (!currentValid) {
                    isValid = false
                }

            })


            if (isValid) {
                if (typeof option.onSubmit === "function") {

                    var selectInputs = formElement.querySelectorAll('[name]')
                    var valueInputs = Array.from(selectInputs).reduce((initalValue, currentValue) => {
                        initalValue[currentValue.name] = currentValue.value
                        return  initalValue
                    }, {})

                    option.onSubmit(valueInputs)

                }else{
                    formElement.onsubmit()
                }
            }
        }



        //Xừ lý dữ liệu form 
        option.rules.forEach(function (rule) {


            if (Array.isArray(selecRules[rule.selector])) {
                selecRules[rule.selector].push(rule.test)
            } else {
                selecRules[rule.selector] = [rule.test]
            }


            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {

                inputElement.onblur = function () {

                    validate(inputElement, rule)

                }

                inputElement.oninput = function () {

                    var mgs = inputElement.parentElement.querySelector(option.errorMessage)
                    mgs.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')

                }
            }
        })



    }


}


Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này"
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || "Vui lòng nhập email hợp lệ"
        }
    }

}

Validator.isPassword = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/
            // var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

            return regex.test(value) ? undefined : message || "Mật khẩu bao gồm chữ ,số và tối thiểu 8 kí tự !"
        }

    }
}



Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "Vui lòng nhập lại mật khẩu !"
        }

    }
}

