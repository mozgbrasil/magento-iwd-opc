<?php

class IWD_Opc_Model_System_Config_Source_Payment_Allmethods
{

    public function toOptionArray()
    {
        $methods = Mage::helper('iwd_opc/config')->getPaymentMethodList(true, true, true);
        return $methods;
    }
}
