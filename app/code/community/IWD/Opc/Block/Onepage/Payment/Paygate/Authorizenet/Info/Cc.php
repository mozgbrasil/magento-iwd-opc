<?php

class IWD_Opc_Block_Onepage_Payment_Paygate_Authorizenet_Info_Cc extends Mage_Paygate_Block_Authorizenet_Info_Cc
{

    protected function _construct()
    {
        parent::_construct();
        if ($this->helper('iwd_opc')->isCheckoutPage()) {
            $this->setTemplate('iwd/opc/onepage/payment/form/authorizenet_cc_info.phtml');
        }
    }
}
