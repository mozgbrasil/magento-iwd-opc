<?php

class IWD_Opc_Block_Onepage_Payment_Authorizenet_Directpost_Iframe extends Mage_Authorizenet_Block_Directpost_Iframe
{

    protected function _construct()
    {
        parent::_construct();
        if (Mage::helper('iwd_opc')->isEnable()) {
            $this->setTemplate('iwd/opc/onepage/payment/form/authorizenet_directpost_iframe.phtml');
        }

    }
}