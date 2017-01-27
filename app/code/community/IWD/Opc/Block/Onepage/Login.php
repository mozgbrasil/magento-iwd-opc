<?php

class IWD_Opc_Block_Onepage_Login extends IWD_Opc_Block_Onepage_Address_Billing
{
    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    public function isEmailFounded()
    {
        $email = $this->getEmail();
        if ($email) {
            $foundedEmails = $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_FOUNDED_CUSTOMERS);
            if (isset($foundedEmails[$email])) {
                return true;
            }
        }

        return false;
    }

    public function getEmail()
    {
        if (!$this->getAddress()->getEmail()) {
            return $this->escapeHtml($this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_EMAIL));
        } else {
            return $this->escapeHtml($this->getAddress()->getEmail());
        }
    }
}
