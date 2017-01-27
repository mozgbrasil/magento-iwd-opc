;
function OnePage() {
    this.config = this.initConfig();
    this.sectionContainer = '.iwd_opc_wrapper .iwd_opc_alternative_wrapper';
    this.name = 'onepage';
    this.saveDelay = 4000;
    this.blurDelay = 200;
    this.areFieldsChanged = false;
    this.validateTimeout = null;
    this.blurTimeout = null;
    this.ajaxCalls = [];
    this.noValidationForms = [
        'iwd_opc_billing_form',
        'iwd_opc_shipping_form',
        'iwd_opc_shipping_method_form',
        'iwd_opc_gift_message_form'
    ];
}

OnePage.prototype = {
    init: function () {
        var _this = this;
        _this.decorateFields(_this.sectionContainer);
        _this.initConfig();

        _this.saveUrl = this.config.saveOrderUrl;

        _this.initCustomSelectEvents();
        _this.initTextAreaAutoResize();
        _this.initShowHidePassword();
        _this.initClosePopup();
        _this.initPlaceOrder();
        _this.initPreventChangeFieldOnSectionUpdate();

        $ji.when($ji.when(_this.initSections()).then(function () {
            $ji.when(_this.decorateSelects(_this.sectionContainer)).then(function () {
                Singleton.get(PaymentMethod).decorateCcTypes();
            });

            _this.validateCheckout(false);
        })).then(function () {
            _this.initColumns();
            _this.checkColumnsStatus();
        });
    },
    decorateFields: function (section) {
        $ji(section + ' .iwd_opc_field.required-entry, ' + section + ' .iwd_opc_select.validate-select').each(function () {
            var element = $ji(this);
            if (element.is(':disabled') || element.hasClass('disabled')) {
                return;
            }

            if (element.hasClass('iwd_opc_select')) {
                var option = element.find('option[value=""]');
                if (option.length) {
                    option.html(option.html() + '\xa0*');
                }
            } else {
                var placeholder = element.attr('placeholder');
                if (placeholder) {
                    element.attr('placeholder', placeholder + '\xa0*');
                }
            }
        });
    },
    initCustomSelectEvents: function () {
        var _this = this;
        var section = '.iwd_opc_universal_wrapper';
        $ji(document).on('click',
            section + ' .iwd_opc_select_container:not(.disabled) .iwd_opc_select_option', function () {
                var option = $ji(this);
                if (option.hasClass('selected')) {
                    _this.unSelectValueInCustomSelect(option);
                } else {
                    _this.selectValueInCustomSelect(option);
                }
            });

        $ji(document).on('change', section + ' .iwd_opc_select', function (e) {
            var option = '';
            if ($ji(this).attr('name') && $ji(this).attr('name').indexOf('country_id') !== -1) {
                _this.decorateSelect($ji(section + ' .iwd_opc_select[name="billing[region_id]"]'));
                _this.decorateSelect($ji(section + ' .iwd_opc_select[name="shipping[region_id]"]'));
            }

            // if ($ji(this).val()) {
            option = $ji(section + ' .iwd_opc_select_container[data-element-name="' +
                $ji(this).attr('name') + '"] .iwd_opc_select_option[data-value="' + $ji(this).val() + '"]');
            if (option.length) {
                // if (!option.hasClass('selected')) {
                _this.selectValueInCustomSelect(option, false);
                // }
            } else {
                option = $ji(section + ' .iwd_opc_select_container[data-element-name="' +
                    $ji(this).attr('name') + '"] .iwd_opc_select_option.selected');
                if (option.length) {
                    _this.unSelectValueInCustomSelect(option, false);
                }
            }
            // } else {
            //     option = $ji(section + ' .iwd_opc_select_container[data-element-name="' +
            //         $ji(this).attr('name') + '"] .iwd_opc_select_option.selected');
            //     if (option.length) {
            //         _this.unSelectValueInCustomSelect(option, false);
            //     }
            // }
        });

        $ji(document).on('focus', section + ' .iwd_opc_select', function (e) {
            if ($ji(e.relatedTarget).attr('data-element-name') !== $ji(this).attr('name')
                || !$ji(e.relatedTarget).length) {
                e.preventDefault();
                var newSelect = $ji(section + ' .iwd_opc_select_container[data-element-name="' +
                    $ji(this).attr('name') + '"]');
                if (newSelect.length) {
                    var cEvent = document.createEvent("HTMLEvents");
                    cEvent.relatedTarget = e.relatedTarget;
                    cEvent.initEvent('focus', false, true);
                    newSelect.get(0).dispatchEvent(cEvent);
                    newSelect.focusWithoutScrolling();
                }

                return false;
            } else {
                if ($ji(document.activeElement).hasClass('iwd_opc_select')) {
                    $ji.tabPrev();
                }
            }
        });

        $ji(document).on('focus', section + ' .iwd_opc_select_container:not(.disabled)', function (e) {
            var newSelect = $ji(this);
            if (newSelect.closest('.scroll-wrapper').length) {
                newSelect.closest('.scroll-wrapper').addClass('focused');
            }
        });

        $ji(document).on('focusout', section + ' .iwd_opc_select_container:not(.disabled)',
            function (event) {
                var newSelect = $ji(this);
                setTimeout(function () {
                    if (newSelect.find('.iwd_opc_select_option.selected').length) {
                        newSelect.addClass('selected');
                    }
                }, _this.blurTimeout);

                if (newSelect.closest('.scroll-wrapper').length) {
                    newSelect.closest('.scroll-wrapper').removeClass('focused');
                }

                $ji(section + ' .iwd_opc_select[name="' + $ji(this).attr('data-element-name') + '"]')
                    .trigger('blur');
            });

        $ji(document).on('keydown', section + ' .iwd_opc_select_container:not(.disabled), '
            + section + ' .scroll-wrapper.focused', function (e) {

            var newSelect = $ji(this);
            if (newSelect.hasClass('scroll-wrapper')) {
                newSelect = newSelect.find('.iwd_opc_select_container').first();
            }

            if (e.keyCode === 13) {
                if (newSelect.hasClass('selected')) {
                    newSelect.removeClass('selected');
                    if (newSelect.find('.iwd_opc_select_option.selected').length) {
                        var option = newSelect.find('.iwd_opc_select_option.selected').first();
                        newSelect.animate({
                            scrollTop: option.position().top - parseInt(option.attr('data-position-top'))
                        }, 0);
                    }
                }
            } else if (e.keyCode === 27) {
                if (newSelect.find('.iwd_opc_select_option.selected').length) {
                    newSelect.addClass('selected');
                }
            } else {
                var key = String.fromCharCode(e.keyCode).toLowerCase();
                newSelect.find('.iwd_opc_select_option').each(function () {
                    var option = $ji(this);
                    if (option.attr('data-first-letter').indexOf(key) === 0) {
                        option.parent().animate({
                            scrollTop: option.get(0).offsetTop
                        }, 0);
                        return false;
                    }
                });
            }
        });
    },
    initTextAreaAutoResize: function () {
        $ji(this.sectionContainer + ' .iwd_opc_textarea').textareaAutoSize();
    },
    initSections: function () {
        if (!this.config.isLoggedIn) {
            Singleton.get(Login).init();
        }

        Singleton.get(BillingAddress).init();
        if (!this.config.isVirtual) {
            Singleton.get(ShippingAddress).init();
            Singleton.get(ShippingMethod).init();
        }

        if (this.config.isShowComment) {
            Singleton.get(Comment).init();
        }

        if (this.config.isShowGiftMessage && !this.config.isVirtual && Singleton.get(GiftMessage).isEnable()) {
            Singleton.get(GiftMessage).init();
        }

        if (Singleton.get(Agreements).isEnable()) {
            Singleton.get(Agreements).init();
        }

        if (this.config.isShowDiscount) {
            Singleton.get(Discount).init();
        }

        Singleton.get(Payment).init();
        Singleton.get(PaymentMethod).init();
        Singleton.get(Review).init();
    },
    initPlaceOrder: function () {
        var _this = this;
        $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_place_order_button', function (e) {
            e.preventDefault();
            _this.tryPlaceOrder();
            return false;
        });
    },
    initPreventChangeFieldOnSectionUpdate: function () {
        $ji(document).on('keypress keydown change', this.sectionContainer + ' .iwd_opc_field', function (e) {
            if ($ji(this).closest('div[data-showed-by]').length
                && $ji(this).closest('div[data-showed-by]').attr('data-showed-by') !== ''
                || $ji('.iwd_opc_popup_wrapper').hasClass('active')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    },
    initColumns: function () {
        var _this = this;
        $ji(document).on('change input', '.iwd_opc_column .iwd_opc_field', function (e) {
            $ji(this).closest('.iwd_opc_column_content').attr('data-was-updated', 1);
        });

        $ji(document).on('focus blur',
            _this.sectionContainer + ' .iwd_opc_column_content .iwd_opc_field:not(.iwd_opc_select), ' +
            _this.sectionContainer + ' .iwd_opc_column_content .iwd_opc_select_container, ' +
            _this.sectionContainer + ' .iwd_opc_column_content .iwd_opc_button', function (event) {
                var column = $ji(this).closest('.iwd_opc_column_content');

                if ($ji(event.relatedTarget).closest('.iwd_opc_column_content').length
                    && $ji(event.target).closest('.iwd_opc_column_content').length
                    && $ji(event.relatedTarget).closest('.iwd_opc_column_content').get(0)
                    === $ji(event.target).closest('.iwd_opc_column_content').get(0)
                    && event.type === 'focusout'
                ) {
                    return;
                }

                if (event.type === 'focusin'
                    && $ji(event.relatedTarget).closest('.iwd_opc_column_content').length
                    && $ji(event.target).closest('.iwd_opc_column_content').length
                    && $ji(event.relatedTarget).closest('.iwd_opc_column_content').get(0)
                    !== $ji(event.target).closest('.iwd_opc_column_content').get(0)
                ) {
                    if ($ji(event.relatedTarget).hasClass('iwd_opc_select')) {
                        _this.checkColumnStatus($ji(event.relatedTarget)
                            .closest('.iwd_opc_column_content'), {type: 'focusout'});
                    }
                }

                _this.checkColumnStatus(column, event);
            });

        $ji(document).on('blur', _this.sectionContainer + ' .iwd_opc_column_content', function () {
            $ji(this).removeClass('focused');
        });

        $ji(document).on('focus', _this.sectionContainer + ' .iwd_opc_column_content', function () {
            var column = $ji(this);
            column.addClass('focused');
            $ji(_this.sectionContainer + ' .iwd_opc_column_content').each(function (e) {
                if (column.get(0) == $ji(this).get(0)) {
                    return;
                }

                $ji(this).trigger('iwdOpcValidateColumnBlur');
            });
        });
    },
    initConfig: function () {
        if (typeof(iwdOpcConfig) === 'string' && iwdOpcConfig) {
            return $ji.parseJSON(iwdOpcConfig);
        } else {
            this.addError('Initial config is missing');
        }

        return '';
    },
    initShowHidePassword: function () {
        $ji(document).on('click', this.sectionContainer + ' .iwd_opc_show_hide_password', function () {
            if ($ji(this).hasClass('active')) {
                $ji(this).removeClass('active');
                $ji(this).closest('.iwd_opc_universal_wrapper').find('input[type="password"]').attr('type', 'text');
            } else {
                $ji(this).addClass('active');
                $ji(this).closest('.iwd_opc_universal_wrapper').find('input[type="text"]').attr('type', 'password');
            }
        });
    },
    initClosePopup: function () {
        var _this = this;
        $ji(document).on('click', '.iwd_opc_popup_close', function () {
            _this.closePopup();
        });

        $ji(document).on('keydown', function (e) {
            if (e.keyCode === 27) {
                if ($ji('.iwd_opc_popup_close').is(':visible')) {
                    _this.closePopup();
                }
            }
        });
    },

    checkColumnsStatus: function () {
        var _this = this;
        $ji.when($ji(_this.sectionContainer + ' .iwd_opc_column_content').each(function () {
            var state = _this.checkColumnStatus($ji(this), {type: 'focusout'});
            if (state === 'complete') {
                $ji(this).attr('data-was-updated', 1);
            }
        })).then(function () {
            _this.selectFirstElement();
        });
    },
    checkColumnStatus: function (column, event) {
        var state = '';
        var wasUpdated = column.attr('data-was-updated') == 1;
        var eventType = event.type;
        if (eventType === 'focusin') {
            if (this.columnIsValid(column)) {
                state = 'active';
            } else {
                if (this.columnHasVisibleErrors(column)) {
                    state = 'error';
                } else {
                    state = 'active';
                }
            }
        } else {
            if (this.columnIsValid(column)) {
                state = 'complete';
            } else {
                if (this.columnHasVisibleErrors(column)) {
                    state = 'error';
                } else if (wasUpdated) {
                    state = 'incomplete';
                }
            }
        }

        this.setColumnStatus(column, state, eventType);
        return state;
    },
    columnIsValid: function (column) {
        return column.find('.iwd_opc_form.iwd_opc_form_invalid').length === 0
            && column.find('.iwd_opc_section_message:visible').length === 0;
    },
    columnHasVisibleErrors: function (column) {
        if (column.find('.iwd_opc_universal_wrapper.validation-error:not(.iwd_opc_empty_field)').length
            // || column.find('.iwd_opc_checkbox.validation-failed').length
            || column.find('.iwd_opc_section_message:visible').length) {
            return true;
        } else {
            return false;
        }
    },
    columnHasErrors: function (column) {
        if (column.find('.iwd_opc_universal_wrapper.validation-error').length
            || column.find('.iwd_opc_field.validation-failed').length
            || column.find('.iwd_opc_section_message:visible').length) {
            return true;
        } else {
            return false;
        }
    },
    setColumnStatus: function (column, state, eventType) {
        var _this = this;
        column.closest('.iwd_opc_column')
            .find('.iwd_opc_column_status .iwd_opc_column_alternative_status')
            .attr('data-status', state);

        if ((state === 'incomplete' || state === 'error') && eventType === 'focusout') {
            column.find('form.iwd_opc_form.iwd_opc_form_invalid').each(function () {
                if (!_this.columnHasErrors($ji(this))) {
                    var formId = $ji(this).attr('id');
                    if ($ji.inArray(formId, _this.noValidationForms) !== -1) {
                        column.closest('.iwd_opc_column')
                            .find('.iwd_opc_column_status .iwd_opc_column_alternative_status')
                            .attr('data-status', 'active');
                    } else {
                        var tmpForm = new VarienForm(formId);
                        tmpForm.validator.options = {
                            onSubmit: false,
                            stopOnFirst: false,
                            immediate: false,
                            focusOnError: false,
                            useTitles: false,
                            onFormValidate: function (result, form) {
                            },
                            onElementValidate: function (result, elm) {
                            }
                        };
                        if (!tmpForm.validator.validate()) {
                            if ($ji(tmpForm.form).closest('.iwd_opc_column_content').find($ji(document.activeElement)).length) {
                                _this.checkColumnStatus($ji(tmpForm.form).closest('.iwd_opc_column_content'), {type: 'focusin'});
                            } else {
                                _this.checkColumnStatus($ji(tmpForm.form).closest('.iwd_opc_column_content'), {type: 'focusout'});
                            }
                        }
                    }
                }
            });
        }
    },
    selectFirstElement: function () {
        var column = $ji(this.sectionContainer)
            .find('.iwd_opc_column_status .iwd_opc_column_alternative_status:not([data-status="complete"])').first();
        if (column.length) {
            column = column.closest('.iwd_opc_column').find('.iwd_opc_column_content');
            var element = column.closest('.iwd_opc_column').find('.iwd_opc_field:visible').filter(function () {
                if ($ji(this).is(':checkbox')) {
                    return !$ji(this).is(':checked');
                } else {
                    return $ji(this).val() == '';
                }
            });
            if (element.length) {
                element.first().trigger('focus');
            } else {
                column.trigger('focus');
            }
        }
    },

    validateCheckout: function (showErrors) {
        Singleton.get(BillingAddress).validate(showErrors);
        if (!this.config.isVirtual) {
            Singleton.get(ShippingAddress).validate(showErrors);
            Singleton.get(ShippingMethod).validate(showErrors);
            if (this.config.isShowGiftMessage && Singleton.get(GiftMessage).isEnable()) {
                Singleton.get(GiftMessage).validate(showErrors);
            }
        }

        Singleton.get(PaymentMethod).validate(showErrors);
        if (Singleton.get(Agreements).isEnable()) {
            Singleton.get(Agreements).validate(showErrors);
        }
    },
    isCheckoutValid: function () {
        var billingAddressValid = $ji(Singleton.get(BillingAddress).getForm().form).hasClass('iwd_opc_form_valid');
        var shippingAddressValid = true;
        var shippingMethodsValid = true;
        var giftMessageValid = true;
        if (!this.config.isVirtual) {
            shippingAddressValid = $ji(Singleton.get(ShippingAddress).getForm().form).hasClass('iwd_opc_form_valid');
            shippingMethodsValid = $ji(Singleton.get(ShippingMethod).getForm().form).hasClass('iwd_opc_form_valid');
            if (this.config.isShowGiftMessage && Singleton.get(GiftMessage).isEnable()) {
                giftMessageValid = $ji(Singleton.get(GiftMessage).getForm().form).hasClass('iwd_opc_form_valid');
            }
        }

        paymentMethodValid = $ji(Singleton.get(PaymentMethod).getForm().form).hasClass('iwd_opc_form_valid');
        var AgreementsValid = true;
        if (Singleton.get(Agreements).isEnable()) {
            AgreementsValid = $ji(Singleton.get(Agreements).getForm().form).hasClass('iwd_opc_form_valid');
        }

        return billingAddressValid
            && shippingAddressValid
            && shippingMethodsValid
            && giftMessageValid
            && paymentMethodValid
            && AgreementsValid;
    },
    tryPlaceOrder: function () {
        if (this.isCheckoutValid()) {
            this.toggleCheckoutNotification(false);
            Singleton.get(PaymentMethod).saveSection();
        } else {
            $ji(this.sectionContainer + ' .iwd_opc_column_content').each(function () {
                $ji(this).attr('data-was-updated', 1);
            });

            this.validateCheckout(true);
            this.toggleCheckoutNotification(true);
        }
    },
    togglePlaceOrderButton: function () {
        if (this.isCheckoutValid() && Singleton.get(OnePage).ajaxCalls.length === 0) {
            $ji(Singleton.get(OnePage).sectionContainer + ' #iwd_opc_place_order_button')
                .addClass('active')
                .removeAttr('tabindex')
                .removeClass('disabled');
            this.toggleCheckoutNotification(false);
        } else {
            $ji(Singleton.get(OnePage).sectionContainer + ' #iwd_opc_place_order_button')
                .addClass('disabled')
                .attr('tabindex', -1)
                .removeClass('active');
        }
    },
    toggleCheckoutNotification: function (state) {
        $ji(Singleton.get(OnePage).sectionContainer + ' #iwd_opc_place_order .iwd_opc_message').toggle(state);
    },
    saveOrder: function () {
        switch (Singleton.get(PaymentMethod).getPaymentMethodCode()) {
            case Singleton.get(PaymentMethodAuthorizeNetDirectPost).code:
                this.validateCheckout(true);
                if (this.isCheckoutValid()) {
                    Singleton.get(PaymentMethodAuthorizeNetDirectPost).saveOrder();
                }
                break;
            default:
                this.validateCheckout(true);
                if (this.isCheckoutValid()) {
                    this.saveSection(this.saveOrderOnSuccess);
                }
        }
    },
    saveOrderOnSuccess: function (result) {
        if (typeof(result.status) !== 'undefined') {
            if (result.status) {
                this.parseSuccessResult(result);
            } else {
                this.parseErrorResultSaveOrder(result);
            }
        }

        return false;
    },
    parseErrorResultSaveOrder: function (result) {
        Singleton.get(OnePage).hideLoader(Singleton.get(OnePage).sectionContainer);
        if (typeof(result.message) !== 'undefined' && result.message) {
            this.showPopup(result.message);
        } else if (typeof(result.popup) !== "undefined" && result.popup) {
            this.showPopup(result.popup.content, result.popup.allow_close_popup);
        }

        if (typeof(result.payment_methods) !== 'undefined') {
            Singleton.get(PaymentMethod).applyResponse(result.payment_methods);
        }
    },

    initChangeFields: function () {
        var _this = this;
        $ji(document).on('input', this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_input, ' +
            this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_textarea', function () {
            _this.changeField($ji(this));
        });

        $ji(document).on('change', this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_select', function () {
            _this.changeField($ji(this));
        });

        $ji(document).on('focus', _this.sectionContainer + ' .iwd_opc_form', function () {
            $ji(this).addClass('focused');
        });

        $ji(document).on('blur', _this.sectionContainer + ' .iwd_opc_form', function () {
            $ji(this).removeClass('focused');
        });

        $ji(document).on('blur', this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_select:not(:disabled), ' +
            this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_input:not(:disabled), ' +
            this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_checkbox:not(:disabled), ' +
            this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_radio:not(:disabled), ' +
            this.sectionContainer + ' .iwd_opc_universal_wrapper .iwd_opc_textarea:not(:disabled)', function (e) {
            clearTimeout(_this.blurTimeout);
            var element = $ji(this);
            _this.blurTimeout = setTimeout(function () {
                if (_this.saveDelay === -1 && _this.areFieldsChanged) {
                    _this.changeField(element, e);
                } else {
                    if (_this.areFieldsChanged
                        && !element.closest('.iwd_opc_form').first().hasClass('focused')
                        && _this.validate()) {
                        _this.saveSection();
                    }
                }
            }, _this.blurDelay);

        });
    },
    changeField: function (element, e) {
        var _this = this;
        clearTimeout(_this.validateTimeout);
        clearTimeout(_this.blurTimeout);
        _this.areFieldsChanged = true;
        if (_this.saveDelay === -1) {
            var column = element.closest('.iwd_opc_column_content');
            if (!column.hasClass('focused')) {
                if(e){
                    var relatedTarget = $ji(e.relatedTarget);
                    if (relatedTarget.length) {
                        var relatedColumn = relatedTarget.closest('.iwd_opc_column_content');
                        if (relatedColumn.length) {
                            if (_this.validate()) {
                                _this.saveSection();
                            }
                        }
                    }
                }
            } else {
                $ji(column).off('iwdOpcValidateColumnBlur');
                $ji(column).on('iwdOpcValidateColumnBlur', function () {
                    if (_this.areFieldsChanged && Singleton.get(OnePage).ajaxCalls.indexOf(_this.name) === -1) {
                        if (_this.validate()) {
                            _this.saveSection();
                        }
                    }
                });
            }
        } else {
            _this.validateTimeout = setTimeout(function () {
                if (_this.validate()) {
                    _this.saveSection();
                }
            }, _this.saveDelay);
        }
    },
    validate: function (showErrors) {
        if (typeof(showErrors) === 'undefined') {
            showErrors = true;
        }

        var validator = this.getForm().validator;
        if (!showErrors) {
            validator.options.stopOnFirst = true;
            validator.options.onFormValidate = function (result, form) {
                validator.reset();
            }
        } else {
            validator.options.stopOnFirst = false;
            validator.options.onFormValidate = function (result, form) {
            }
        }

        var isValid = validator.validate();
        if (this.columnHasErrors($ji(this.sectionContainer))) {
            this.toggleFormValidClass(false);
        } else {
            this.toggleFormValidClass(isValid);
        }

        this.togglePlaceOrderButton();
        if ($ji(this.getForm().form).closest('.iwd_opc_column_content').find($ji(document.activeElement)).length) {
            this.checkColumnStatus($ji(this.sectionContainer).closest('.iwd_opc_column_content'), {type: 'focusin'});
        } else {
            this.checkColumnStatus($ji(this.sectionContainer).closest('.iwd_opc_column_content'), {type: 'focusout'});
        }

        return isValid;
    },
    toggleFormValidClass: function (isValid) {
        if (this.getForm()) {
            if (isValid) {
                $ji(this.getForm().form).removeClass('iwd_opc_form_invalid').addClass('iwd_opc_form_valid');
            } else {
                $ji(this.getForm().form).removeClass('iwd_opc_form_valid').addClass('iwd_opc_form_invalid');
            }
        }
    },
    saveSection: function (onSuccess, onComplete, onError) {
        var data = this.getSaveData();
        clearTimeout(this.validateTimeout);
        clearTimeout(this.blurTimeout);
        this.showLoader(this.sectionContainer);
        this.ajaxCall(this.saveUrl, data, onSuccess, onComplete, onError);
    },
    getSaveData: function () {
        var data = Singleton.get(PaymentMethod).getSaveData();
        if (Singleton.get(Agreements).isEnable()) {
            data = $ji.merge(data, Singleton.get(Agreements).getSaveData());
        }

        return data;
    },

    addError: function (message, error) {
        if (typeof(error) !== 'undefined') {
            console.group(message);
            console.debug(error);
            console.groupEnd();
        } else {
            console.error(message);
        }
    },
    addInfo: function (message) {
        console.info(message);
    },
    showLoader: function (section) {
        if ($ji(section).length) {
            if (!$ji(section).attr('data-showed-by')) {
                $ji(section).attr('data-showed-by', this.name);
            } else {
                var showedBy = $ji(section).attr('data-showed-by').split(';');
                showedBy.push(this.name);
                $ji(section).attr('data-showed-by', showedBy.join(';'));
            }

            $ji(section).find('> .iwd_opc_loader_wrapper').first().addClass('active');
        }
    },
    hideLoader: function (section) {
        if ($ji(section).length && $ji(section).attr('data-showed-by')) {
            var showedBy = $ji(section).attr('data-showed-by').split(';');
            showedBy = showedBy.remove(this.name);
            $ji(section).attr('data-showed-by', showedBy.join(';'));
            if (showedBy.length === 0) {
                $ji(section).find('> .iwd_opc_loader_wrapper').first().removeClass('active');
            }
        }
    },
    showPopup: function (content, allowClose) {
        if (typeof(allowClose) === 'undefined') {
            allowClose = true;
        }

        $ji('.iwd_opc_popup_wrapper').addClass('active').find('.iwd_opc_popup_content').html(content).focus();
        if (!allowClose) {
            $ji('.iwd_opc_popup_wrapper').find('.iwd_opc_popup_close').hide();
        }
    },
    closePopup: function () {
        $ji('.iwd_opc_popup_wrapper').removeClass('active').find('.iwd_opc_popup_content').html('');
        $ji('.iwd_opc_popup_wrapper').find('.iwd_opc_popup_close').show();
    },

    ajaxCall: function (url, data, onSuccess, onComplete, onError) {
        var _this = this;
        Singleton.get(OnePage).ajaxCalls.push(this.name);
        this.togglePlaceOrderButton();
        $ji.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (result) {
                _this.ajaxSuccess(result, onSuccess);
            },
            complete: function (result) {
                _this.ajaxComplete(result.responseJSON, onComplete);
            },
            error: function (result) {
                _this.ajaxError(result, onError);
            }
        });
    },
    ajaxSuccess: function (result, onSuccess) {
        this.hideAjaxError();

        if (typeof(onSuccess) === 'function') {
            if (!onSuccess.call(this, result)) {
                return false;
            }
        }

        if (typeof(result.status) !== 'undefined') {
            if (result.status) {
                this.parseSuccessResult(result);
            } else {
                this.parseErrorResult(result);
            }
        }

        return true;
    },
    parseSuccessResult: function (result) {
        if (typeof(result.shipping_methods) !== 'undefined') {
            Singleton.get(ShippingMethod).applyResponse(result.shipping_methods);
            this.hideLoader(Singleton.get(ShippingMethod).sectionContainer);
        }

        if (typeof(result.payment_methods) !== 'undefined') {
            Singleton.get(PaymentMethod).applyResponse(result.payment_methods);
            this.hideLoader(Singleton.get(Payment).sectionContainer);
        }

        if (typeof(result.review) !== 'undefined') {
            Singleton.get(Review).applyResponse(result.review);
        }

        if (typeof(result.discount) !== 'undefined') {
            Singleton.get(Discount).applyResponse(result.discount);
        }

        if (typeof(result.redirect_url) !== 'undefined' && result.redirect_url) {
            window.location.href = result.redirect_url;
            return false;
        }

        return true;
    },
    parseErrorResult: function (result) {
        if (typeof (this.onErrorResult) === 'function') {
            if (!this.onErrorResult.call(this, result)) {
                return false;
            }
        }

        if (typeof(result.message) !== 'undefined' && result.message) {
            this.showAjaxError(result.message);
        }

        return true;
    },
    showAjaxError: function (message) {
        var sectionErrorContainer = $ji(this.sectionContainer + ' .iwd_opc_section_message').first();
        if (sectionErrorContainer.length) {
            sectionErrorContainer.html(message).show();
            if (this.getForm()) {
                this.validate(true);
            }
        }
    },
    hideAjaxError: function () {
        var sectionErrorContainer = $ji(this.sectionContainer + ' .iwd_opc_section_message');
        if (sectionErrorContainer.length) {
            var isError = sectionErrorContainer.html().trim().length;
            sectionErrorContainer.html('').hide();
            if (isError) {
                if (this.getForm()) {
                    this.validate(false);
                }
            }
        }
    },
    ajaxComplete: function (result, onComplete) {
        Singleton.get(OnePage).ajaxCalls.remove(this.name);
        if (typeof(onComplete) === 'function') {
            if (!onComplete.call(this, result)) {
                return false;
            }
        }

        this.areFieldsChanged = false;
        this.togglePlaceOrderButton();
        this.toggleCheckoutNotification(false);
        this.hideLoader(this.sectionContainer);
        return true;
    },
    ajaxError: function (result, onError) {
        if (typeof(onError) === 'function') {
            if (!onError.call(this, result)) {
                return false;
            }
        }

        var errorMessage = this.config.errorMessageDefault;
        if (result.status === 403) {
            errorMessage = this.config.errorMessageForbidden;
        }

        this.showPopup(errorMessage, false);
        setTimeout(function () {
            location.reload();
        }, 3500);
    },

    decorateSelects: function (section) {
        var _this = this;
        $ji(section + ' .iwd_opc_select:not([multiple])').each(function () {
            _this.decorateSelect($ji(this));
        });
    },
    decorateSelect: function (select) {
        var _this = this;
        var parent = select.parent();
        if (select.find('option').length && select.is(':visible')) {
            var newSelectClass = '';
            if (select.attr('data-can-unselect') && !select.find('option:selected').html().trim().length || select.attr('multiple')) {

            } else if (select.find('option:selected').html().trim().length) {
                newSelectClass = 'selected';
            }

            newSelectClass = newSelectClass + (select.is(':disabled') ? ' disabled selected' : '');
            newSelectClass = newSelectClass + (select.attr('multiple') ? ' multiple' : '');
            var newSelect = $ji('<div></div>');
            newSelect
                .attr('tabindex', -1)
                .attr('title', select.attr('title'))
                .attr('data-element-name', select.attr('name'))
                .attr('data-can-unselect', select.attr('data-can-unselect'))
                .addClass('iwd_opc_select_container ' + newSelectClass);
            select.find('option').each(function () {
                var option = $ji(this);
                if (select.attr('data-can-unselect') && !option.val()) {
                    return;
                }
                if (option.html().trim().length) {
                    var newOptionClass = option.is(':selected') ? 'selected' : '';
                    var new_option = $ji('<div></div>');
                    var optionHtml = option.html();
                    if (option.attr('data-image')) {
                        optionHtml = '<img style="display: inline;vertical-align: middle;" src="' + option.attr('data-image') + '" />&nbsp;' + optionHtml;
                    }
                    new_option
                        .html(optionHtml)
                        .attr('data-value', option.val())
                        .attr('data-position-top', 0)
                        .attr('data-first-letter', option.html().charAt(0).toLowerCase())
                        .addClass('iwd_opc_select_option ' + newOptionClass);
                    newSelect.append(new_option);
                }
            });

            _this.destroyScrollBar(parent.find('.iwd_opc_select_container'));
            parent.find('.iwd_opc_select_container').remove();
            parent.append(newSelect);
            if (newSelect.hasClass('selected')) {
                newSelect.removeClass('selected');
                _this.appendScrollBar(newSelect);
                newSelect.addClass('selected');
                newSelect.css('height', 'auto');
            } else {
                _this.appendScrollBar(newSelect);
            }
        } else {
            _this.destroyScrollBar(parent.find('.iwd_opc_select_container'));
            parent.find('.iwd_opc_select_container').remove();
        }
    },
    unSelectValueInCustomSelect: function (option, selectNative) {
        var newSelect = option.parent();
        if (typeof(selectNative) === 'undefined') {
            selectNative = true;
        }

        if (newSelect.hasClass('selected')) {
            newSelect.removeClass('selected');
            newSelect.animate({
                scrollTop: option.position().top - parseInt(option.attr('data-position-top'))
            }, 0);
            if (newSelect.attr('data-can-unselect') === "true") {
                option.removeClass('selected');
                if (selectNative) {
                    this.selectValueInNativeSelect(newSelect.attr('data-element-name'), "");
                }
            }
        } else {
            option.attr('data-position-top', option.position().top);
            newSelect.addClass('selected');
        }

        this.appendScrollBar(newSelect);
    },
    selectValueInCustomSelect: function (option, selectNative) {
        if (typeof(selectNative) === 'undefined') {
            selectNative = true;
        }

        var newSelect = option.parent();
        option.attr('data-position-top', option.position().top);
        newSelect.find('.iwd_opc_select_option').removeClass('selected');
        option.addClass('selected');
        newSelect.addClass('selected');
        if (selectNative) {
            this.selectValueInNativeSelect(newSelect.attr('data-element-name'), option.attr('data-value'));
        }

        newSelect.css('height', 'auto');
    },
    selectValueInNativeSelect: function (elementName, value) {
        var select = $ji('.iwd_opc_select[name="' + elementName + '"]');
        if (select.length) {
            select.val(value);
            if ("createEvent" in document) {
                var c_event = document.createEvent("HTMLEvents");
                c_event.initEvent("change", false, true);
                select.get(0).dispatchEvent(c_event);
            } else {
                select.get(0).fireEvent("onchange");
            }

            select.trigger('change');
        }
    },
    destroyScrollBar: function (container) {
        container.scrollbar('destroy');
    },
    appendScrollBar: function (container) {
        if (container.children().length > 5 || container.get(0).scrollHeight > parseInt(container.css('max-height').replace('px', ''))) {
            container.scrollbar();
        }
    }
};

$ji(document).ready(function () {
    Singleton.get(OnePage).init();
});