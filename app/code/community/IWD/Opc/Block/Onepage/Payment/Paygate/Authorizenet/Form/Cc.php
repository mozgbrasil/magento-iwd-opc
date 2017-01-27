<?php

class IWD_Opc_Block_Onepage_Payment_Paygate_Authorizenet_Form_Cc extends Mage_Paygate_Block_Authorizenet_Form_Cc
{
    protected function _construct()
    {
        parent::_construct();
        if ($this->helper('iwd_opc')->isCheckoutPage()) {
            $this->setTemplate('iwd/opc/onepage/payment/form/authorizenet_cc.phtml');
        }
    }

    public function getMethodFormBlock()
    {
        if ($this->helper('iwd_opc')->isCheckoutPage()) {
            return $this->getLayout()->createBlock('payment/form_cc')
                ->setTemplate('iwd/opc/onepage/payment/form/cc.phtml')
                ->setMethod($this->getMethod());
        } else {
            return parent::getMethodFormBlock();
        }
    }
}
