;
function ShippingAddress() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_shipping_address';
    this.reloadShippingAndPaymentMethods = 0;
    this.name = 'shipping_address';
    this.saveDelay = -1;
    this.blurDelay = -1;
}

ShippingAddress.prototype = Object.create(OnePage.prototype);
ShippingAddress.prototype.constructor = ShippingAddress;

ShippingAddress.prototype.init = function () {
    this.saveUrl = this.config.saveShippingUrl;
    this.initChangeFields();
    if (this.config.isLoggedIn) {
        this.initChangeCustomerAddressSelect();
        this.initChangeSaveInAddressBook();
    }
};

ShippingAddress.prototype.initChangeSaveInAddressBook = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_checkbox[name="shipping[save_in_address_book]"]', function () {
        _this.changeField($ji(this));
    });
};

ShippingAddress.prototype.changeField = function (element) {
    OnePage.prototype.changeField.apply(this, arguments);
    this.reloadShippingAndPaymentMethods = this.checkReloadShippingPaymentMethods(element);
};

ShippingAddress.prototype.checkReloadShippingPaymentMethods = function (element) {
    if (this.reloadShippingAndPaymentMethods) {
        return 1;
    }

    var elementName = element.attr('name');
    if (this.config.isLoggedIn && elementName === 'shipping_address_id') {
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
        elementName.indexOf('street') !== -1
    )) ? 1 : 0;
};

ShippingAddress.prototype.getForm = function () {
    return iwdOpcShippingAddressForm;
};

ShippingAddress.prototype.getSaveData = function () {
    var data = $ji(this.getForm().form).serializeArray();
    data.push({
        'name': 'reload_shipping_and_payment_methods',
        'value': this.reloadShippingAndPaymentMethods
    });

    return data;
};

ShippingAddress.prototype.saveSection = function (onSuccess, onComplete, onError) {
    if (this.reloadShippingAndPaymentMethods) {
        this.showLoader(Singleton.get(ShippingMethod).sectionContainer);
        this.showLoader(Singleton.get(Payment).sectionContainer);
    }

    OnePage.prototype.saveSection.apply(this, arguments);
};

ShippingAddress.prototype.onErrorResult = function () {
    this.hideLoader(Singleton.get(ShippingMethod).sectionContainer);
    this.hideLoader(Singleton.get(Payment).sectionContainer);
    return true;
};

ShippingAddress.prototype.ajaxComplete = function (result, onComplete) {
    if (OnePage.prototype.ajaxComplete.apply(this, arguments)) {
        this.reloadShippingAndPaymentMethods = 0;
    }
};

ShippingAddress.prototype.initChangeCustomerAddressSelect = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_address_select', function () {
        this.reloadShippingAndPaymentMethods = _this.checkReloadShippingPaymentMethods($ji(this));
        if (parseInt($ji(this).val()) !== 0) {
            $ji(_this.sectionContainer + ' #iwd_opc_shipping_address_fields').hide();
            _this.validate();
            _this.saveSection();
        } else {
            $ji(_this.sectionContainer + ' #iwd_opc_shipping_address_fields').show();
            _this.decorateSelects(_this.sectionContainer);
            if (_this.validate(false)) {
                _this.saveSection();
            }
        }
    });
};