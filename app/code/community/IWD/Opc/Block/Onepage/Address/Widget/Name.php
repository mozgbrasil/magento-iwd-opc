<?php

class IWD_Opc_Block_Onepage_Address_Widget_Name extends Mage_Customer_Block_Widget_Name
{

    public function _construct()
    {
        parent::_construct();
        $this->setTemplate('iwd/opc/onepage/address/widget/name.phtml');
    }
}
