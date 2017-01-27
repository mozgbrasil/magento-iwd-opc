<?php

class IWD_Opc_Block_Onepage_Address_Widget_Gender extends Mage_Customer_Block_Widget_Gender
{

    public function _construct()
    {
        parent::_construct();
        $this->setTemplate('iwd/opc/onepage/address/widget/gender.phtml');
    }
}
