<?php

class IWD_Opc_Model_Carrier_Pickup
    extends Mage_Shipping_Model_Carrier_Abstract
    implements Mage_Shipping_Model_Carrier_Interface
{

    protected $_code = 'iwdstorepickup';
    protected $_isFixed = true;

    public function collectRates(Mage_Shipping_Model_Rate_Request $request)
    {
        return false;
    }

    /**
     * Get allowed shipping methods
     *
     * @return array
     */
    public function getAllowedMethods()
    {
        return array();
    }

}
