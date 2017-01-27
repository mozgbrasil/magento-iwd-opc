<?php

class IWD_Opc_IndexController extends Mage_Checkout_Controller_Action
{

    public $needRecollectQuoteTotals = false;

    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    /**
     * @return Mage_Checkout_Model_Session
     */
    public function getCheckoutSession()
    {
        return Mage::getSingleton('checkout/session');
    }

    /**
     * @return Mage_Customer_Model_Session
     */
    public function getCustomerSession()
    {
        return Mage::getSingleton('customer/session');
    }

    /**
     * @return Mage_Sales_Model_Quote
     */
    public function getQuote()
    {
        return $this->getOnepage()->getQuote();
    }

    /**
     * @return Mage_Checkout_Model_Type_Onepage
     */
    public function getOnepage()
    {
        return Mage::getSingleton('checkout/type_onepage');
    }

    /**
     * @return IWD_Opc_Helper_Data
     */
    public function getOpcHelper()
    {
        return Mage::helper('iwd_opc');
    }

    /**
     * @return Mage_Checkout_Helper_Data
     */
    public function getCheckoutHelper()
    {
        return Mage::helper('checkout');
    }

    public function preDispatch()
    {
        parent::preDispatch();
        $this->_preDispatchValidateCustomer();

        $checkoutSessionQuote = $this->getQuote();
        if ($checkoutSessionQuote->getIsMultiShipping()) {
            $checkoutSessionQuote->setIsMultiShipping(false);
            $checkoutSessionQuote->removeAllAddresses();
        }

        if (!$this->canShowForUnregisteredUsers()) {
            $this->_redirect('customer/account/login');
        }

        if (!$this->getOpcHelper()->isEnable()) {
            $this->norouteAction();
            $this->setFlag('', self::FLAG_NO_DISPATCH, true);
            return false;
        }

        return $this;
    }

    public function indexAction()
    {
        if (!$this->getCheckoutHelper()->canOnepageCheckout()) {
            $this->getCheckoutSession()->addError($this->__('The onepage checkout is disabled.'));
            $this->_redirect('checkout/cart');
            return;
        }

        $quote = $this->getQuote();
        if (!$quote->hasItems() || $quote->getHasError()) {
            $this->_redirect('checkout/cart');
            return;
        }

        if (!$quote->validateMinimumAmount()) {
            $error = Mage::getStoreConfig('sales/minimum_order/error_message') ?
                Mage::getStoreConfig('sales/minimum_order/error_message') :
                $this->getCheckoutHelper()->__('Subtotal must exceed minimum order amount');

            $this->getCheckoutSession()->addError($error);
            $this->_redirect('checkout/cart');
            return;
        }

        $this->getCheckoutSession()->setCartWasUpdated(false);
        $this->getCheckoutSession()->setBeforeAuthUrl(Mage::getUrl('*/*/*', array('_secure' => true)));
        $this->getOnepage()->initCheckout();

        if ($this->getCustomerSession()->isLoggedIn()) {
            $this->recollectQuoteTotals();
        }

        if (!$this->getCustomerSession()->isLoggedIn()) {
            $this->initDefaultAddress();
        }

        if (!$quote->getIsVirtual()) {
            $this->setDefaultShippingMethod();
        }

        $this->setDefaultPaymentMethod();
        if ($this->needRecollectQuoteTotals) {
            $this->recollectQuoteTotals();
        }

        Mage::app()->getCacheInstance()->cleanType('layout');

        $this->loadLayout();
        $this->_initLayoutMessages('customer/session');
        $this->getLayout()->getBlock('head')->setTitle($this->getOpcHelper()->getPageTitle());
        $this->renderLayout();
    }

    public function recollectQuoteTotals()
    {
        if (!$this->getQuote()->getIsVirtual()) {
            $this->getQuote()->getShippingAddress()->setCollectShippingRates(true);
        }

        $this->getQuote()->setTotalsCollectedFlag(false)->collectTotals()->save();
        return $this;
    }

    public function canShowForUnregisteredUsers()
    {
        return $this->getCustomerSession()->isLoggedIn()
            || $this->getCheckoutHelper()->isAllowedGuestCheckout($this->getQuote())
            || !$this->getCheckoutHelper()->isCustomerMustBeLogged();
    }


    public function setDefaultShippingMethod()
    {
        $shippingAddress = $this->getQuote()->getShippingAddress();
        $defaultShipping = $this->getOpcHelper()->getDefaultShipping();
        if (!$shippingAddress->getShippingMethod()
            && $defaultShipping
            && !$this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_SHIPPING_GROUP)
        ) {
            foreach ($shippingAddress->getGroupedAllShippingRates() as $code => $rates) {
                foreach ($rates as $rate) {
                    if ($rate->getCode() == $defaultShipping) {
                        $this->getOnepage()->saveShippingMethod($defaultShipping);
                        $this->needRecollectQuoteTotals = true;
                        break;
                    }
                }
            }
        } elseif (!$shippingAddress->getShippingMethod()) {
            if (count($shippingAddress->getGroupedAllShippingRates()) == 1) {
                foreach ($shippingAddress->getGroupedAllShippingRates() as $rates) {
                    if (count($rates) == 1) {
                        foreach ($rates as $rate) {
                            $this->getOnepage()->saveShippingMethod($rate->getCode());
                            $this->needRecollectQuoteTotals = true;
                            break;
                        }

                        break;
                    }
                }
            }
        }
    }

    public function setDefaultPaymentMethod()
    {
        $store = $this->getQuote() ? $this->getQuote()->getStoreId() : null;
        if (count(Mage::helper('payment')->getStoreMethods($store, $this->getQuote())) == 1) {
            foreach (Mage::helper('payment')->getStoreMethods($store, $this->getQuote()) as $method) {
                if ($this->canUseMethod($method)
                    && $method->isApplicableToQuote(
                        $this->getQuote(),
                        Mage_Payment_Model_Method_Abstract::CHECK_ZERO_TOTAL
                    )
                ) {
                    $this->getCoreSession()->setData(
                        IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE,
                        $method->getCode()
                    );
                    return;
                }

                break;
            }
        }

        $defaultPayment = $this->getOpcHelper()->getDefaultPayment();
        $paymentMethodCode = $this->getCoreSession()->getData(
            IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE
        );

        if (!$paymentMethodCode && $defaultPayment) {
            foreach (Mage::helper('payment')->getStoreMethods($store, $this->getQuote()) as $method) {
                if ($this->canUseMethod($method)
                    && $method->isApplicableToQuote(
                        $this->getQuote(),
                        Mage_Payment_Model_Method_Abstract::CHECK_ZERO_TOTAL
                    )
                    && $method->getCode() == $defaultPayment
                ) {
                    $this->getCoreSession()->setData(
                        IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE,
                        $method->getCode()
                    );
                    return;
                }
            }
        }
    }

    public function canUseMethod($method)
    {
        return $method->isApplicableToQuote(
            $this->getQuote(),
            Mage_Payment_Model_Method_Abstract::CHECK_USE_FOR_COUNTRY
            | Mage_Payment_Model_Method_Abstract::CHECK_USE_FOR_CURRENCY
            | Mage_Payment_Model_Method_Abstract::CHECK_ORDER_TOTAL_MIN_MAX
        );
    }

    public function initDefaultAddress()
    {
        $isVirtual = $this->getQuote()->getIsVirtual();
        $billingAddress = $this->getQuote()->getBillingAddress();
        $billingCountryId = $billingAddress->getCountryId();
        if (!$isVirtual) {
            $shippingAddress = $this->getQuote()->getShippingAddress();
            $shippingCountryId = $shippingAddress->getCountryId();
        } else {
            $shippingCountryId = true;
        }

        if ($billingCountryId && $shippingCountryId) {
            return $this;
        }

        $defaultAddress = array(
            'country_id' => Mage::helper('core')->getDefaultCountry(),
        );
        if (!$isVirtual) {
            if (!$shippingCountryId) {
                $shippingAddress->addData($defaultAddress);
                $shippingAddress->implodeStreetAddress();
                $shippingAddress->setCollectShippingRates(true);
            }
        }

        if (!$billingCountryId) {
            $billingAddress->addData($defaultAddress);
            $billingAddress->implodeStreetAddress();
        }

        $this->recollectQuoteTotals();
        return $this;
    }
}
