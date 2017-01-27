<?php

class IWD_Opc_Block_Adminhtml_System_Config_Form_Fieldset_Version extends Mage_Adminhtml_Block_System_Config_Form_Field
{

    protected function _getElementHtml(Varien_Data_Form_Element_Abstract $element)
    {
        $version = Mage::getConfig()->getModuleConfig("IWD_Opc")->version;
        return '<span class="notice">' . $version . ' - <span class="error">(free)</span></span>';
    }
}