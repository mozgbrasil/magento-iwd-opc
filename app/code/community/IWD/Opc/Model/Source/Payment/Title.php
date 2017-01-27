<?php

class IWD_Opc_Model_Source_Payment_Title extends Mage_Core_Model_Abstract
{
    const TYPE_LOGO = 'logo';
    const TYPE_TITLE = 'title';
    const TYPE_LOGO_TITLE = 'logo_title';

    public function toOptionArray()
    {
        return array(
            array(
                'value' => self::TYPE_LOGO,
                'label' => Mage::helper('iwd_opc')->__('Show logo only'),
            ),
            array(
                'value' => self::TYPE_LOGO_TITLE,
                'label' => Mage::helper('iwd_opc')->__('Show logo and title'),
            ),
            array(
                'value' => self::TYPE_TITLE,
                'label' => Mage::helper('iwd_opc')->__('Show title only'),
            ),
        );
    }
}