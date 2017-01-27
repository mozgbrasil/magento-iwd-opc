<?php

class IWD_Opc_Block_Onepage_Payment extends Mage_Checkout_Block_Onepage_Abstract
{
    /**
     * @return  IWD_Opc_Helper_Data
     */
    public function getOpcHelper()
    {
        return $this->helper('iwd_opc');
    }
}
