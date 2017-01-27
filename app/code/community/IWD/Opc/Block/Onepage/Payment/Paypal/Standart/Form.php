<?php

class IWD_Opc_Block_Onepage_Payment_Paypal_Standart_Form extends Mage_Paypal_Block_Standard_Form
{

    protected function _construct()
    {
        if (Mage::helper('iwd_opc')->isCheckoutPage()) {
            $this->_config = Mage::getModel('paypal/config')->setMethod($this->getMethodCode());
            $this->setTemplate('iwd/opc/onepage/payment/form/paypal_redirect.phtml');
            return $this;
        } else {
            return parent::_construct();
        }
    }
}
