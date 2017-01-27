<?php

class IWD_Opc_Block_Onepage_Payment_Paypal_Iframe extends Mage_Paypal_Block_Iframe
{

    protected function _construct()
    {
        parent::_construct();
        if (Mage::helper('iwd_opc')->isCheckoutPage()) {
            $paymentCode = $this->_getCheckout()
                ->getQuote()
                ->getPayment()
                ->getMethod();
            if (in_array($paymentCode, $this->helper('paypal/hss')->getHssMethods())) {
                $this->_paymentMethodCode = $paymentCode;
                $templatePath = str_replace('_', '', $paymentCode);
                $templateFile = "iwd/opc/onepage/payment/paypal/{$templatePath}/iframe.phtml";
                if (file_exists(Mage::getDesign()->getTemplateFilename($templateFile))) {
                    $this->setTemplate($templateFile);
                } else {
                    $this->setTemplate('iwd/opc/onepage/payment/paypal/hss/iframe.phtml');
                }
            }
        }
    }
}