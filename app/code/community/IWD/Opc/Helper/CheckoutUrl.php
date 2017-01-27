<?php

class IWD_Opc_Helper_CheckoutUrl extends Mage_Checkout_Helper_Url
{

    public function getCheckoutUrl()
    {
        if (Mage::helper('iwd_opc')->isEnable()) {
            return $this->_getUrl(IWD_Opc_Helper_Data::IWD_OPC_FRONT_NAME, array('_secure' => true));
        } else {
            return parent::getCheckoutUrl();
        }
    }

    public function getOPCheckoutUrl()
    {
        if (Mage::helper('iwd_opc')->isEnable()) {
            return $this->_getUrl(IWD_Opc_Helper_Data::IWD_OPC_FRONT_NAME, array('_secure' => true));
        } else {
            return parent::getOPCheckoutUrl();
        }
    }
}
