<?php

class IWD_Opc_Model_System_Config_Source_Shipping_Allmethods
{

    public function toOptionArray()
    {
        $methods = Mage::helper('iwd_opc/config')->getShippingMethodsList();
        return $methods;
    }
}
