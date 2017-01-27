<?php

class IWD_Opc_Block_Onepage_Wrapper extends Mage_Checkout_Block_Onepage_Abstract
{
    /**
     * @return Mage_Checkout_Model_Type_Onepage
     */
    public function getOnepage()
    {
        return Mage::getSingleton('checkout/type_onepage');
    }

    /**
     * @return Mage_Sales_Model_Quote
     */
    public function getQuote()
    {
        return $this->getOnepage()->getQuote();
    }

    public function isUseBillingAddressForShipping()
    {
        if (($this->isVirtual())
            || !$this->getQuote()->getShippingAddress()->getSameAsBilling()
        ) {
            return false;
        }

        return true;
    }

    public function getJsonConfig()
    {
        $config = array();
        $secure = (Mage::app()->getStore()->isCurrentlySecure()) ? true : false;
        $opcFrontName = IWD_Opc_Helper_Data::IWD_OPC_FRONT_NAME;
        $opcHelper = $this->getOpcHelper();
        $config['saveBillingUrl'] = $this->getUrl(
            $opcFrontName . '/json/saveBillingAddress',
            array('_secure' => $secure)
        );
        $config['saveShippingUrl'] = $this->getUrl(
            $opcFrontName . '/json/saveShippingAddress',
            array('_secure' => $secure)
        );
        $config['saveShippingMethodUrl'] = $this->getUrl(
            $opcFrontName . '/json/saveShippingMethod',
            array('_secure' => $secure)
        );
        $config['removeShippingMethodUrl'] = $this->getUrl(
            $opcFrontName . '/json/removeShippingMethod',
            array('_secure' => $secure)
        );
        $config['savePaymentUrl'] = $this->getUrl($opcFrontName . '/json/savePayment', array('_secure' => $secure));
        $config['savePaymentMethodCodeUrl'] = $this->getUrl(
            $opcFrontName . '/json/savePaymentMethodCode',
            array('_secure' => $secure)
        );
        $config['saveOrderUrl'] = $this->getUrl($opcFrontName . '/json/saveOrder', array('_secure' => $secure));
        $config['saveCommentUrl'] = $this->getUrl($opcFrontName . '/json/saveComment', array('_secure' => $secure));
        $config['saveGiftMessageUrl'] = $this->getUrl(
            $opcFrontName . '/json/saveGiftMessage',
            array('_secure' => $secure)
        );
        $config['applyDiscountUrl'] = $this->getUrl($opcFrontName . '/json/applyDiscount', array('_secure' => $secure));
        $config['removeDiscountUrl'] = $this->getUrl(
            $opcFrontName . '/json/removeDiscount',
            array('_secure' => $secure)
        );
        $config['loginUrl'] = $this->getUrl($opcFrontName . '/json/login', array('_secure' => $secure));
        $config['resetPasswordUrl'] = $this->getUrl($opcFrontName . '/json/resetPassword', array('_secure' => $secure));
        $config['emailCheckUrl'] = $this->getUrl($opcFrontName . '/json/emailCheck', array('_secure' => $secure));
        $config['authorizeNetCancelUrl'] = $this->getUrl(
            $opcFrontName . '/json/cancelAuthorizeNetPayment',
            array('_secure' => $secure)
        );
        $config['authorizeNetDirectPostSaveUrl'] = $this->helper('authorizenet')->getPlaceOrderFrontUrl();
        $config['authorizeNetDirectPostReturnQuoteUrl'] = str_replace(
            'place',
            'returnQuote',
            $this->helper('authorizenet')->getPlaceOrderFrontUrl()
        );
        $config['isLoggedIn'] = (int)$this->isCustomerLoggedIn();
        $config['isVirtual'] = (int)$this->isVirtual();
        $config['isShowComment'] = (int)$opcHelper->isShowCommentField();
        $config['isShowGiftMessage'] = (int)$opcHelper->isShowGiftMessage();
        $config['isShowDiscount'] = (int)$opcHelper->isShowDiscountForm();
        $config['isShowShipping'] = (int)$opcHelper->isShowShippingForm();
        $config['isShowLoginButton'] = (int)$opcHelper->isShowLoginButton();
        $config['allowGuestCheckout'] = Mage::helper('checkout')->isAllowedGuestCheckout(
            $this->getQuote(), $this->getQuote()->getStoreId()
        );
        $config['errorMessageDefault'] = $this->__('Some error was occurred on server side, page will be reloaded.');
        $config['errorMessageForbidden'] = $this->__('Your cart was updated, page will be reloaded.');
        return Mage::helper('core')->jsonEncode($config);
    }

    public function isVirtual()
    {
        return $this->getQuote()->getIsVirtual();
    }

    public function isShowShippingForm()
    {
        return !$this->isUseBillingAddressForShipping() || $this->getOpcHelper()->isShowShippingForm();
    }

    /**
     * @return  IWD_Opc_Helper_Data
     */
    public function getOpcHelper()
    {
        return $this->helper('iwd_opc');
    }
}
