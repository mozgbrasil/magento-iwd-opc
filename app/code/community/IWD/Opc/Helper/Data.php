<?php

class IWD_Opc_Helper_Data extends Mage_Core_Helper_Abstract
{

    CONST IWD_OPC_FRONT_NAME = 'onepage';

    CONST XML_PATH_OPC_ENABLE = 'iwd_opc/general/enable';
    CONST XML_PATH_OPC_TITLE = 'iwd_opc/default/title';
    const XML_PATH_SUBSCRIBE_VISIBILITY = 'iwd_opc/default/subscribe';
    const XML_PATH_SUBSCRIBE_BY_DEFAULT = 'iwd_opc/default/subscribe_default';
    const XML_PATH_SHIPPING_VISIBILITY = 'iwd_opc/default/show_shipping';
    const XML_PATH_COMMENT_VISIBILITY = 'iwd_opc/default/show_comment';
    const XML_PATH_GIFT_MESSAGE_VISIBILITY = 'iwd_opc/default/show_gift_message';
    const XML_PATH_LOGIN_BUTTON_VISIBILITY = 'iwd_opc/default/show_login_button';
    const XML_PATH_DISCOUNT_VISIBILITY = 'iwd_opc/default/show_discount';
    const XML_PATH_DEFAULT_SHIPPING = 'iwd_opc/default/shipping';
    const XML_PATH_DEFAULT_PAYMENT = 'iwd_opc/default/payment';
    const XML_PATH_PAYMENT_TITLE_TYPE = 'iwd_opc/default/payment_title_type';

    CONST IWD_OPC_FOUNDED_CUSTOMERS = 'iwd_opc_founded_customers_emails';
    CONST IWD_OPC_CUSTOMER_EMAIL = 'iwd_opc_customer_email';
    CONST IWD_OPC_CUSTOMER_COMMENT = 'iwd_opc_customer_comment';
    CONST IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE = 'iwd_opc_customer_payment_method_code';
    CONST IWD_OPC_CUSTOMER_SUBSCRIBE = 'iwd_opc_customer_subscribe';
    CONST IWD_OPC_CUSTOMER_SHIPPING_GROUP = 'iwd_opc_customr_shipping_group';

    public function isEnable($store = null)
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_OPC_ENABLE, $store);
    }

    public function isCheckoutPage()
    {
        return $this->_getRequest()->getControllerModule() == 'IWD_Opc'
            && $this->_getRequest()->getModuleName() == self::IWD_OPC_FRONT_NAME
            && $this->isEnable();
    }

    public function getPageTitle()
    {
        return Mage::getStoreConfig(self::XML_PATH_OPC_TITLE);
    }

    public function isShowSubscribe()
    {
        $isEnabled = (bool)Mage::getStoreConfig(self::XML_PATH_SUBSCRIBE_VISIBILITY);
        $isLoggedIn = Mage::getSingleton('customer/session')->isLoggedIn();
        $isModuleEnabled = Mage::helper('core')->isModuleOutputEnabled('Mage_Newsletter');
        return $isEnabled && !$isLoggedIn && $isModuleEnabled;
    }

    public function isSubscribeByDefault()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_SUBSCRIBE_BY_DEFAULT);
    }

    public function isShowShippingForm()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_SHIPPING_VISIBILITY);
    }

    public function isShowDiscountForm()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_DISCOUNT_VISIBILITY);
    }

    public function isShowCommentField()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_COMMENT_VISIBILITY);
    }

    public function isShowGiftMessage()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_GIFT_MESSAGE_VISIBILITY);
    }

    public function isShowLoginButton()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_LOGIN_BUTTON_VISIBILITY);
    }

    public function getDefaultShipping()
    {
        return Mage::getStoreConfig(self::XML_PATH_DEFAULT_SHIPPING);
    }

    public function getDefaultPayment()
    {
        return Mage::getStoreConfig(self::XML_PATH_DEFAULT_PAYMENT);
    }

    public function getPaymentTitleType()
    {
        return Mage::getStoreConfig(self::XML_PATH_PAYMENT_TITLE_TYPE);
    }

    public function getCheckout()
    {
        return Mage::getSingleton('checkout/session');
    }

    public function getQuote()
    {
        return $this->getCheckout()->getQuote();
    }

    public function formatPrice($price, $includeContainer = true)
    {
        return $this->getQuote()->getStore()->formatPrice($price, $includeContainer);
    }

    public static function getCardIcon($cardType)
    {
        switch (str_replace(' ', '', strtolower($cardType))) {
            case 'mastercard':
            case 'mc':
                return 'MC.png';
            case 'visa':
            case 'vi':
                return 'VI.png';
            case 'americanexpress':
            case 'amex':
            case 'ae':
                return 'AE.png';
            case 'discover':
            case 'di':
                return 'DI.png';
            case 'jcb':
                return 'JCB.png';
            case 'maestro':
            case 'me':
                return 'ME.png';
        }

        return 'card.png';
    }
}
