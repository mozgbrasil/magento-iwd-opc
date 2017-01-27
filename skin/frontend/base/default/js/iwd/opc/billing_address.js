;
function BillingAddress() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_billing_address';
    this.reloadShippingAndPaymentMethods = 0;
    this.name = 'billing_address';
    this.saveDelay = -1;
    this.blurDelay = -1;
}

BillingAddress.prototype = Object.create(OnePage.prototype);
BillingAddress.prototype.constructor = BillingAddress;

BillingAddress.prototype.init = function () {
    this.saveUrl = this.config.saveBillingUrl;
    this.initChangeFields();
    if (this.config.isLoggedIn) {
        this.initChangeCustomerAddressSelect();
        this.initChangeSaveInAddressBook();
    }

    if (!this.config.isShowShipping && !this.config.isVirtual) {
        this.initUseForShippingCheckbox();
    }
};

BillingAddress.prototype.initChangeSaveInAddressBook = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_checkbox[name="billing[save_in_address_book]"]', function () {
        _this.changeField($ji(this));
    });
};

BillingAddress.prototype.getForm = function () {
    return iwdOpcBillingAddressForm;
};

BillingAddress.prototype.getSaveData = function () {
    var data = $ji(this.getForm().form).serializeArray();
    data.push({
        'name': 'reload_shipping_and_payment_methods',
        'value': this.reloadShippingAndPaymentMethods
    });

    return data;
};

BillingAddress.prototype.changeField = function (element) {
    OnePage.prototype.changeField.apply(this, arguments);
    this.reloadShippingAndPaymentMethods = this.checkReloadShippingPaymentMethods(element);
};

BillingAddress.prototype.checkReloadShippingPaymentMethods = function (element) {
    if (this.reloadShippingAndPaymentMethods) {
        return 1;
    }

    if (!this.config.isVirtual) {
        if (this.config.isShowShipping
            || $ji(this.sectionContainer + ' .iwd_opc_checkbox[name="billing[use_for_shipping]"]').is(':checked')) {
            return 0;
        }
    }

    var elementName = element.attr('name');
    if (this.config.isLoggedIn && elementName === 'billing_address_id') {
        return 1;
    }

    if ($ji(this.sectionContainer).find('.iwd_opc_section_message:visible').length) {
        return 1;
    }

    return (element.length &&
    (
        elementName.indexOf('postcode') !== -1 ||
        elementName.indexOf('country_id') !== -1 ||
        elementName.indexOf('region_id') !== -1 ||
        elementName.indexOf('region') !== -1 ||
        elementName.indexOf('city') !== -1 ||
        elementName.indexOf('street') !== -1 ||
        elementName.indexOf('use_for_shipping') !== -1
    )) ? 1 : 0;
};

BillingAddress.prototype.saveSection = function (onSuccess, onComplete, onError) {
    if (this.reloadShippingAndPaymentMethods) {
        this.showLoader(Singleton.get(ShippingMethod).sectionContainer);
        this.showLoader(Singleton.get(Payment).sectionContainer);
    }

    OnePage.prototype.saveSection.apply(this, arguments);
};

BillingAddress.prototype.ajaxComplete = function (result, onComplete) {
    if (OnePage.prototype.ajaxComplete.apply(this, arguments)) {
        this.reloadShippingAndPaymentMethods = 0;
    }
};

BillingAddress.prototype.onErrorResult = function () {
    this.hideLoader(Singleton.get(ShippingMethod).sectionContainer);
    this.hideLoader(Singleton.get(Payment).sectionContainer);
    return true;
};

BillingAddress.prototype.initChangeCustomerAddressSelect = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_address_select', function () {
        _this.reloadShippingAndPaymentMethods = _this.checkReloadShippingPaymentMethods($ji(this));
        if (parseInt($ji(this).val()) !== 0) {
            $ji(_this.sectionContainer + ' #iwd_opc_billing_address_fields').hide();
            _this.validate();
            _this.saveSection();
        } else {
            $ji(_this.sectionContainer + ' #iwd_opc_billing_address_fields').show();
            _this.decorateSelects(_this.sectionContainer);
            if (_this.validate(false)) {
                _this.saveSection();
            }
        }
    });
};

BillingAddress.prototype.initUseForShippingCheckbox = function () {
    var _this = this;
    $ji(_this.sectionContainer + ' .iwd_opc_checkbox[name="billing[use_for_shipping]"]').on('change', function () {
        if ($ji(this).is(':checked')) {
            $ji(Singleton.get(ShippingAddress).sectionContainer).show();
            $ji(this).val(0);
            $ji(Singleton.get(ShippingAddress).sectionContainer + ' input[name="shipping[same_as_billing]"]')
                .val(0).attr('checked', false);
            _this.decorateSelects(Singleton.get(ShippingAddress).sectionContainer);
            if (Singleton.get(ShippingAddress).validate(false)) {
                Singleton.get(ShippingAddress).reloadShippingAndPaymentMethods = 1;
                Singleton.get(ShippingAddress).saveSection();
            }
        } else {
            $ji(Singleton.get(ShippingAddress).sectionContainer).hide();
            $ji(this).val(1);
            $ji(Singleton.get(ShippingAddress).sectionContainer + ' input[name="shipping[same_as_billing]"]')
                .val(1).attr('checked', true);
            _this.decorateSelects(Singleton.get(ShippingAddress).sectionContainer);
            clearTimeout(Singleton.get(ShippingAddress).validateTimeout);
            clearTimeout(Singleton.get(ShippingAddress).blurTimeout);
            if (_this.validate(false)) {
                _this.reloadShippingAndPaymentMethods = _this.checkReloadShippingPaymentMethods($ji(this));
                _this.saveSection();
            }
        }
    });
};