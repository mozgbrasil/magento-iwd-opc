;
function ShippingMethod() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_shipping_method';
    this.name = 'shipping_method';
}

ShippingMethod.prototype = Object.create(OnePage.prototype);
ShippingMethod.prototype.constructor = ShippingMethod;

ShippingMethod.prototype.init = function () {
    this.saveUrl = this.config.saveShippingMethodUrl;
    this.removeUrl = this.config.removeShippingMethodUrl;
    this.initSelectShippingRateGroup();
    this.initSelectShippingRate();
};

ShippingMethod.prototype.getForm = function () {
    return iwdOpcShippingMethodForm;
};

ShippingMethod.prototype.applyResponse = function (methods) {
    $ji(this.sectionContainer + ' #iwd_opc_shipping_load_container').replaceWith(methods);
    this.decorateSelects(this.sectionContainer);
    if ($ji(Singleton.get(ShippingMethod).sectionContainer)
            .closest('.iwd_opc_column_content').attr('data-was-updated') == 1) {
        this.validate();
    } else {
        this.validate(false);
    }
};

ShippingMethod.prototype.initSelectShippingRateGroup = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' #iwd_opc_shipping_method_group_select', function () {
        if (!$ji(this).val()) {
            _this.deselectShippingRateGroup();
        } else {
            _this.selectShippingRateGroup($ji(this).val());
        }
    });
};

ShippingMethod.prototype.deselectShippingRateGroup = function () {
    var selectedRate = $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group.selected .iwd_opc_shipping_one_rate');
    $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group').removeClass('selected').hide();
    selectedRate.val("").trigger('change');
    $ji(this.sectionContainer + ' #iwd_opc_shipping_method_group_select').focusWithoutScrolling();
    $ji(this.sectionContainer + ' div[data-element-name="iwd_opc_shipping_method_group_select"]').focusWithoutScrolling();
};

ShippingMethod.prototype.selectShippingRateGroup = function (code) {
    $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group').removeClass('selected').hide();
    $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group[data-group-code="' + code + '"]').addClass('selected').show();
    this.decorateSelects(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group[data-group-code="' + code + '"]');
    if ($ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group.selected .iwd_opc_shipping_one_rate option').length === 2) {
        $ji(this.sectionContainer + ' #iwd_opc_shipping_method_group').hide();
        $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group.selected .iwd_opc_shipping_one_rate').val(
            $ji(this.sectionContainer + ' #iwd_opc_shipping_rates .iwd_opc_shipping_one_rate_group.selected .iwd_opc_shipping_one_rate option')[1].value
        ).trigger('change');
    } else {
        this.remove();
    }
};

ShippingMethod.prototype.initSelectShippingRate = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_shipping_one_rate_group .iwd_opc_shipping_one_rate', function () {
        if (!$ji(this).val()) {
            if(!$ji(_this.sectionContainer + ' #iwd_opc_shipping_method_group').is(':visible')){
                $ji(_this.sectionContainer + ' #iwd_opc_shipping_method_group').show();
                _this.decorateSelect($ji(_this.sectionContainer + ' #iwd_opc_shipping_method_group #iwd_opc_shipping_method_group_select'))
            }

            if ($ji(this).find('option').length === 2 && $ji(_this.sectionContainer + ' #iwd_opc_shipping_method_group_select').val()) {
                $ji(_this.sectionContainer + ' #iwd_opc_shipping_method_group_select').val("").trigger('change');
            } else {
                _this.remove();
            }
        } else {
            if (_this.validate()) {
                _this.saveSection();
            }
        }

        _this.validate()
    });
};

ShippingMethod.prototype.remove = function () {
    var data = [];
    var shippingGroup = $ji(this.sectionContainer + ' #iwd_opc_shipping_method_group_select').val();
    data.push({
        'name': 'shipping_group',
        'value': shippingGroup
    });

    this.showLoader(Singleton.get(Payment).sectionContainer);
    this.showLoader(this.sectionContainer);
    this.ajaxCall(this.removeUrl, data);
};

ShippingMethod.prototype.saveSection = function () {
    this.showLoader(Singleton.get(Payment).sectionContainer);
    OnePage.prototype.saveSection.apply(this, arguments);
};

ShippingMethod.prototype.onErrorResult = function () {
    this.hideLoader(Singleton.get(Payment).sectionContainer);
    return true;
};

ShippingMethod.prototype.getSaveData = function () {
    var data = [];
    data.push({
        'name': 'shipping_method',
        'value': $ji(this.sectionContainer + ' .iwd_opc_shipping_one_rate_group.selected .iwd_opc_shipping_one_rate').val()
    });

    return data;
};