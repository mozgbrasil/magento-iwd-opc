<?php

class IWD_Opc_Block_Onepage_Payment_Method extends Mage_Checkout_Block_Onepage_Payment_Methods
{
    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    public function getSelectedMethodCode()
    {
        return $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE, '');
    }

    public function getMethodTitle(Mage_Payment_Model_Method_Abstract $method)
    {
        /**
         * @var $opcHelper IWD_Opc_Helper_Data
         */
        $opcHelper = $this->helper('iwd_opc');
        if (($opcHelper->getPaymentTitleType() === IWD_Opc_Model_Source_Payment_Title::TYPE_TITLE
                || $opcHelper->getPaymentTitleType() === IWD_Opc_Model_Source_Payment_Title::TYPE_LOGO_TITLE)
            || !$this->getMethodLogo($method)
        ) {
            $title = parent::getMethodTitle($method);
        } else {
            $title = '';
        }

        return $title;
    }

    public function getMethodLogo(Mage_Payment_Model_Method_Abstract $method)
    {
        /**
         * @var $opcHelper IWD_Opc_Helper_Data
         */
        $opcHelper = $this->helper('iwd_opc');
        if ($opcHelper->getPaymentTitleType() == IWD_Opc_Model_Source_Payment_Title::TYPE_LOGO
            || $opcHelper->getPaymentTitleType() === IWD_Opc_Model_Source_Payment_Title::TYPE_LOGO_TITLE
        ) {
            switch ($method->getCode()) {
                case 'paypal_standard':
                case 'paypal_express':
                case 'paypaluk_express':
                case 'paypal_express_bml':
                case 'paypal_direct':
                case 'paypaluk_direct':
                case 'paypaluk_express_bml':
                case 'verisign':
                case 'payflow_link':
                case 'payflow_advanced':
                case 'hosted_pro':
                case 'paypal_billing_agreement':
                    return  Mage::getDesign()->getSkinUrl('css/iwd/opc/images/paypal_logo.png');
                case 'amazon_payments':
                    return Mage::getDesign()->getSkinUrl('css/iwd/opc/images/amazon_logo.png');
                default:
                    return '';
            }
        } else {
            return '';
        }
    }
}
