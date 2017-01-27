;
function Login() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_login';
    this.name = 'login';
}

Login.prototype = Object.create(OnePage.prototype);
Login.prototype.constructor = Login;

Login.prototype.init = function () {
    this.initChangeFields();
    this.initButtons();
};

Login.prototype.getForm = function () {
    return iwdOpcBillingAddressForm;
};

Login.prototype.initChangeFields = function () {
    var _this = this;
    $ji(document).on('input', _this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]', function () {
        _this.areFieldsChanged = true;
        clearTimeout(_this.validateTimeout);
        _this.validateTimeout = setTimeout(function () {
            if (_this.validate()) {
                _this.checkExist();
            }
        }, _this.saveDelay);
    });

    $ji(document).on('blur', _this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]:not(:disabled)', function () {
        if (_this.areFieldsChanged && _this.validate()) {
            _this.checkExist();
        }
    });

    $ji(document).on('keydown', _this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]', function (e) {
        if (e.keyCode === 13 && _this.areFieldsChanged && _this.validate()) {
            _this.checkExist();
        }
    });

    $ji(document).on('keydown', _this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]', function (e) {
        if (e.keyCode === 13) {
            if (_this.validate(true)) {
                _this.login();
            }
        }
    });
};

Login.prototype.initButtons = function () {
    var _this = this;
    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_login_button', function () {
        if (_this.validate(true)) {
            _this.login();
        }
    });

    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_reset_password_button', function () {
        if (_this.validate()) {
            _this.resetPassword();
        }
    });

    if (_this.config.isShowLoginButton) {
        $ji(document).on('click', Singleton.get(OnePage).sectionContainer + ' #iwd_opc_top_login_button', function () {
            _this.parseSuccessResult();
            if ($ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').val()) {
                $ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').focus();
            } else {
                $ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').focus();
            }
        });
    }
};

Login.prototype.validate = function (validatePasswords) {
    var _this = this;
    if (typeof(validatePasswords) === 'undefined') {
        validatePasswords = false;
    }

    var emailValid = Validation.validate($ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').get(0),
        {onSubmit: false, stopOnFirst: false, focusOnError: false, onElementValidate: function(){
            Validation.reset($ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').get(0));
        }});
    var passwordValid = true;
    if (validatePasswords) {
        passwordValid = Validation.validate($ji(_this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').get(0),
            {onSubmit: false, stopOnFirst: false, focusOnError: false});
    }

    return emailValid && passwordValid;
};

Login.prototype.checkExist = function () {
    var data = [];
    data.push({
        'name': 'email',
        'value': $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').val()
    });

    this.clearMessage();
    clearTimeout(this.validateTimeout);
    this.showLoader(this.sectionContainer);
    this.ajaxCall(this.config.emailCheckUrl, data);
};

Login.prototype.login = function () {
    var data = [];
    data.push(
        {
            'name': 'email',
            'value': $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').val()
        },
        {
            'name': 'password',
            'value': $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').val()
        }
    );

    clearTimeout(this.validateTimeout);
    this.clearMessage();
    this.showLoader(this.sectionContainer);
    this.ajaxCall(this.config.loginUrl, data, this.onLoginSuccess);
};

Login.prototype.onLoginSuccess = function (result) {
    if (typeof(result.status) !== 'undefined') {
        if (result.status) {
            location.reload();
        } else {
            $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').addClass('validation-failed');
        }
    }
};

Login.prototype.resetPassword = function () {
    var data = [];
    data.push(
        {
            'name': 'email',
            'value': $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[email]"]').val()
        }
    );

    this.clearMessage();
    this.showLoader(this.sectionContainer);
    this.ajaxCall(this.config.resetPasswordUrl, data);
};

Login.prototype.parseSuccessResult = function (result) {
    $ji(this.sectionContainer + ' #iwd_opc_login_buttons').show();
    $ji(this.sectionContainer + ' #iwd_opc_login_password').show();
    $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').addClass('validate-password');
};

Login.prototype.parseErrorResult = function (result) {
    $ji(this.sectionContainer + ' #iwd_opc_login_buttons').hide();
    $ji(this.sectionContainer + ' #iwd_opc_login_password').hide();
    $ji(this.sectionContainer + ' .iwd_opc_input[name="billing[login_password]"]').removeClass('validate-password');
};

Login.prototype.ajaxComplete = function (result, onComplete) {
    OnePage.prototype.ajaxComplete.apply(this, arguments);
    if (typeof(result.message) !== 'undefined') {
        $ji(this.sectionContainer + ' .iwd_opc_message').html(result.message);
        if (typeof(result.status) !== 'undefined') {
            if (result.status) {
                $ji(this.sectionContainer + ' .iwd_opc_message').addClass('success_message').show();
            } else {
                $ji(this.sectionContainer + ' .iwd_opc_message').addClass('error_message').show();
            }
        }
    }
};

Login.prototype.clearMessage = function () {
    $ji(this.sectionContainer + ' .iwd_opc_message').hide().html('').removeClass('success_message error_message');
};