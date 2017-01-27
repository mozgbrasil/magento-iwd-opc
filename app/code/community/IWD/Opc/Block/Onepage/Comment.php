<?php

class IWD_Opc_Block_Onepage_Comment extends Mage_Checkout_Block_Onepage_Abstract
{
    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    public function getComment()
    {
        $comment = $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_COMMENT, '');
        return $comment ? $comment : '';
    }
}
