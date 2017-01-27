<?php

class IWD_Opc_Block_Onepage_Shipping_Method extends Mage_Checkout_Block_Onepage_Shipping_Method_Available
{
    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    public function getShippingPrice($price, $flag)
    {
        return $this->getQuote()->getStore()->convertPrice(
            Mage::helper('tax')->getShippingPrice($price, $flag, $this->getAddress()),
            true,
            false
        );
    }

    public function getShippingRateGroup()
    {
        return $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_SHIPPING_GROUP);
    }
}
