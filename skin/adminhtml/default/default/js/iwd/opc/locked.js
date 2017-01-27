;if (typeof(jQueryIWD) == "undefined") {
    if (typeof(jQuery) != "undefined") {
        jQueryIWD = jQuery;
    }
}

$ji = jQueryIWD;
$ji(document).ready(function () {
    if ($ji('#config_edit_form .section-config #iwd_opc_fake_iwd_opc_store_credit, ' +
            '#config_edit_form .section-config #iwd_opc_fake_iwd_opc_gift_cards, ' +
            '#config_edit_form .section-config #iwd_opc_fake_iwd_recurringpayments').length) {
        $ji('#config_edit_form .section-config #iwd_opc_fake_iwd_opc_store_credit, ' +
            '#config_edit_form .section-config #iwd_opc_fake_iwd_opc_gift_cards, ' +
            '#config_edit_form .section-config #iwd_opc_fake_iwd_recurringpayments').each(function () {
            $ji(this).append('<span class="iwd_free_opc_locked_button"><i class="fa fa-lock" aria-hidden="true"></i>Unlock Pro</span>');
        });
    }

    if ($ji('#iwd_free_opc_locked_table_container').length) {
        $ji('#iwd_free_opc_locked_table_container')
            .append('<span class="iwd_free_opc_locked_button"><i class="fa fa-lock" aria-hidden="true"></i>Unlock Pro</span>');
    }

    if ($ji('#config_edit_form .section-config #carriers_fake_iwd_opc_storepickup')) {
        $ji('#config_edit_form .section-config #carriers_fake_iwd_opc_storepickup')
            .append('<span class="iwd_free_opc_locked_button"><i class="fa fa-lock" aria-hidden="true"></i>Unlock Pro</span>');
    }

    $ji('body').append(
        '<div id="iwd_free_opc_locked_popup_container">' +
        '<div class="iwd_free_opc_locked_mask"></div>' +
        '<div class="iwd_free_opc_locked_pop_up">' +
        '<div class="iwd_free_opc_locked_pop_up_close"><i class="fa fa-times" aria-hidden="true"></i></div>' +
        '<div class="iwd_free_opc_locked_pop_up_title_img"></div>' +
        '<div class="iwd_free_opc_locked_pop_up_content">' +
        'IWD’s Checkout Suite enhances your checkout experience to make the process quicker, while still offering a suite of robust features to beef up your orders. Upgrade to Pro today for these great features:' +
        '</div>' +
        '<div class="iwd_free_opc_locked_pop_up_features">' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Address Validation</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">In-Store Pickup</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Store Credits</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Gift Cards</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Subscriptions</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Customer Support</div>' +
        '<div class="iwd_free_opc_locked_pop_up_one_feature">Installation & Upgrades</div>' +
        '</div>' +
        '<div class="clear"></div>' +
        '<a title="Unlock Pro" href="https://www.iwdagency.com/extensions/one-step-page-checkout.html?add" target="_blank" class="iwd_free_opc_locked_button_small"><i class="fa fa-lock" aria-hidden="true"></i>Unlock Pro</a>' +
        '</div>' +
        '</div>'
    );

    $ji(document).on('click', '.iwd_free_opc_locked_button', function () {
        $ji('#iwd_free_opc_locked_popup_container').css('height', $ji('html').height() + 'px');
        $ji('#iwd_free_opc_locked_popup_container').show();
        $ji('html, body').animate({
            scrollTop: $ji(".iwd_free_opc_locked_pop_up").offset().top -
            ($ji('.content-header-floating').length ? ($ji('.content-header-floating').height() + 5) : 50)
        }, 500);
    });

    $ji(document).on('click', '.iwd_free_opc_locked_pop_up_close', function () {
        $ji('#iwd_free_opc_locked_popup_container').hide();
    });

    $ji(window).on('keydown', function (e) {
        if (e.keyCode == 27) {
            $ji('#iwd_free_opc_locked_popup_container').hide();
        }
    });
});