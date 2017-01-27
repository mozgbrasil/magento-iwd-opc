;
function Review() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_top_review';
    this.name = 'review';
}

Review.prototype = Object.create(OnePage.prototype);
Review.prototype.constructor = Review;

Review.prototype.init = function () {
    this.initOpenReview();
};

Review.prototype.initOpenReview = function () {
    var _this = this;
    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_top_review_head', function () {
        $ji(_this.sectionContainer).toggleClass('active').focus();
    });

    $ji(document).on('focusout', _this.sectionContainer, function () {
        $ji(_this.sectionContainer).removeClass('active');
    });
};

Review.prototype.applyResponse = function (review) {
    $ji(this.sectionContainer).html(review);
};


function Comment() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_comment';
    this.name = 'comment';
}

Comment.prototype = Object.create(OnePage.prototype);
Comment.prototype.constructor = Comment;

Comment.prototype.init = function () {
    this.saveUrl = this.config.saveCommentUrl;
    this.initChangeFields();
};

Comment.prototype.getForm = function () {
    return iwdOpcCommentForm;
};

Comment.prototype.getSaveData = function () {
    return $ji(this.getForm().form).serializeArray();
};


function GiftMessage() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_gift_message';
    this.name = 'gift_message';
    this.saveDelay = -1;
    this.blurDelay = -1;
}

GiftMessage.prototype = Object.create(OnePage.prototype);
GiftMessage.prototype.constructor = GiftMessage;

GiftMessage.prototype.init = function () {
    this.saveUrl = this.config.saveGiftMessageUrl;
    this.initChangeFields();
    this.initChangeGiftCheckboxes();
};

GiftMessage.prototype.initChangeGiftCheckboxes = function () {
    var _this = this;
    $ji(document).on('change', _this.sectionContainer + ' #allow_gift_messages', function () {
        if ($ji(this).is(':checked')) {
            _this.showGiftMessages();
        } else {
            _this.hideGiftMessages();
        }

        _this.changeField($ji(this));
    });

    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_gift_message_type_checkbox', function () {
        if ($ji(this).is(':checked')) {
            _this.showGiftMessageType($ji(this).attr('id'));
        } else {
            _this.hideGiftMessageType($ji(this).attr('id'));
        }

        _this.changeField($ji(this));
    });

    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_gift_message_item_checkbox', function () {
        if ($ji(this).is(':checked')) {
            _this.showGiftMessageItem($ji(this).attr('id'));
        } else {
            _this.hideGiftMessageItem($ji(this).attr('id'));
        }

        _this.changeField($ji(this));
    });

    $ji(_this.sectionContainer).find('.iwd_opc_field').each(function () {
        if (!$ji(this).is(':visible')) {
            $ji(this).prop('disabled', true);
        }
    });
};

GiftMessage.prototype.getForm = function () {
    return iwdOpcGiftMessageForm;
};

GiftMessage.prototype.getSaveData = function () {
    return $ji(this.getForm().form).serializeArray();
};

GiftMessage.prototype.showGiftMessages = function () {
    $ji(this.sectionContainer + ' #iwd_opc_gift_message_types')
        .addClass('selected').show().find('.iwd_opc_field:visible').removeAttr('disabled');
};

GiftMessage.prototype.hideGiftMessages = function () {
    $ji(this.sectionContainer + ' #iwd_opc_gift_message_types')
        .removeClass('selected').hide().find('.iwd_opc_field:not(:visible)').prop('disabled', true);
};

GiftMessage.prototype.showGiftMessageType = function (type) {
    if ($ji(this.sectionContainer + ' .iwd_opc_gift_message_type[data-type="' + type + '"]').length) {
        $ji(this.sectionContainer + ' .iwd_opc_gift_message_type[data-type="' + type + '"]')
            .addClass('selected').show().find('.iwd_opc_field:visible').removeAttr('disabled');
    }
};

GiftMessage.prototype.hideGiftMessageType = function (type) {
    if ($ji(this.sectionContainer + ' .iwd_opc_gift_message_type[data-type="' + type + '"]').length) {
        $ji(this.sectionContainer + ' .iwd_opc_gift_message_type[data-type="' + type + '"]')
            .removeClass('selected').hide().find('.iwd_opc_field:not(:visible)').prop('disabled', true);
    }
};

GiftMessage.prototype.showGiftMessageItem = function (item) {
    if ($ji(this.sectionContainer + ' .iwd_opc_gift_message_quote_item[data-gift-item="' + item + '"]').length) {
        $ji(this.sectionContainer + ' .iwd_opc_gift_message_quote_item[data-gift-item="' + item + '"]')
            .addClass('selected').show().find('.iwd_opc_field:visible').removeAttr('disabled');
    }
};

GiftMessage.prototype.hideGiftMessageItem = function (item) {
    if ($ji(this.sectionContainer + ' .iwd_opc_gift_message_quote_item[data-gift-item="' + item + '"]').length) {
        $ji(this.sectionContainer + ' .iwd_opc_gift_message_quote_item[data-gift-item="' + item + '"]')
            .removeClass('selected').hide().find('.iwd_opc_field:not(:visible)').prop('disabled', true);
    }
};

GiftMessage.prototype.isEnable = function () {
    return $ji(this.sectionContainer).length;
};


function Agreements() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_agreements';
    this.name = 'agreements';
    this.saveDelay = 0;
}

Agreements.prototype = Object.create(OnePage.prototype);
Agreements.prototype.constructor = Agreements;

Agreements.prototype.init = function () {
    this.initChangeAgreementsCheckboxes();
};

Agreements.prototype.getSaveData = function () {
    return $ji(this.getForm().form).serializeArray();
};

Agreements.prototype.getForm = function () {
    return iwdOpcAgreementsForm;
};

Agreements.prototype.isEnable = function () {
    return $ji(this.sectionContainer).length;
};

Agreements.prototype.initChangeAgreementsCheckboxes = function () {
    var _this = this;
    $ji(document).on('click', _this.sectionContainer + ' .iwd_opc_checkbox_label_value', function (e) {
        if ((e.offsetX - parseInt($ji(this).css('padding-left'))) > ($ji(this).width() - $ji(this).textWidth())) {
            if ($ji(_this.sectionContainer + ' .iwd_opc_one_agreement_content_container[data-agreement-id="' +
                    $ji(this).attr('data-agreement-id') + '"]').length) {
                e.preventDefault();
                e.stopPropagation();
                $ji(_this.sectionContainer + ' .iwd_opc_one_agreement_content_container[data-agreement-id="' +
                    $ji(this).attr('data-agreement-id') + '"]').toggle();
                _this.destroyScrollBar(
                    $ji(_this.sectionContainer + ' .iwd_opc_one_agreement_content_container[data-agreement-id="' +
                        $ji(this).attr('data-agreement-id') + '"]')
                );
                _this.appendScrollBar(
                    $ji(_this.sectionContainer + ' .iwd_opc_one_agreement_content_container[data-agreement-id="' +
                        $ji(this).attr('data-agreement-id') + '"] .iwd_opc_one_agreement_content')
                );
                return false;
            }
        }
    });

    $ji(document).on('change', _this.sectionContainer + ' .iwd_opc_checkbox', function () {
        _this.changeField($ji(this));
    });
};

Agreements.prototype.saveSection = function () {
    this.areFieldsChanged = false;
    return true;
};


function Discount() {
    OnePage.apply(this);
    this.sectionContainer = this.sectionContainer + ' #iwd_opc_discount';
    this.name = 'discount';
}

Discount.prototype = Object.create(OnePage.prototype);
Discount.prototype.constructor = Discount;

Discount.prototype.init = function () {
    this.applyUrl = this.config.applyDiscountUrl;
    this.removeUrl = this.config.removeDiscountUrl;
    this.initChangeDiscountFields();
};

Discount.prototype.initChangeDiscountFields = function () {
    var _this = this;
    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_add_discount_button, ' + _this.sectionContainer + ' #iwd_opc_cancel_button', function () {
        $ji(_this.sectionContainer).find('#iwd_opc_discount_form').toggleClass('selected');
    });

    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_apply_discount_button', function () {
        if (!$ji(_this.sectionContainer + ' #iwd_opc_discount_input').val()) {
            // _this.remove();
        } else {
            _this.apply();
        }
    });

    $ji(document).on('click', _this.sectionContainer + ' #iwd_opc_remove_discount_button', function () {
        _this.remove();
    });

    $ji(document).on('keydown', _this.sectionContainer + ' #iwd_opc_discount_input', function (e) {
        if (e.keyCode === 13) {
            if ($ji(this).val()) {
                _this.apply();
            } else {
                // _this.remove();
            }
        }
    });
};

Discount.prototype.apply = function () {
    var data = [];
    data.push({
        'name': 'coupon_code',
        'value': $ji(this.sectionContainer + ' #iwd_opc_discount_input').val()
    });

    this.showLoader(Singleton.get(Payment).sectionContainer);
    this.showLoader(Singleton.get(ShippingMethod).sectionContainer);
    this.ajaxCall(this.applyUrl, data);
};

Discount.prototype.remove = function () {
    var data = [];
    this.showLoader(Singleton.get(Payment).sectionContainer);
    this.showLoader(Singleton.get(ShippingMethod).sectionContainer);
    this.ajaxCall(this.removeUrl, data);
};

Discount.prototype.ajaxComplete = function (result, onComplete) {
    this.hideLoader(Singleton.get(Payment).sectionContainer);
    this.hideLoader(Singleton.get(ShippingMethod).sectionContainer);
    OnePage.prototype.ajaxComplete.apply(this, arguments);
};

// Discount.prototype.applyResponse = function (discount) {
//     $ji(this.sectionContainer).html(discount);
// };

Discount.prototype.getForm = function () {
    return false;
};