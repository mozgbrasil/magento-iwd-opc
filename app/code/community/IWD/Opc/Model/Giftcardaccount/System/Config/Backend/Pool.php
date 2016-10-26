<?php

class IWD_Opc_Model_Giftcardaccount_System_Config_Backend_Pool extends Mage_Core_Model_Config_Data
{

    protected function _checkMaxLength()
    {
        $groups = $this->getGroups();
        if (isset($groups['general']['fields'])) {
            $fields = $groups['general']['fields'];
        }

        $len = 0;
        $codeLen = 0;
        if (isset($fields['code_length']['value'])) {
            $codeLen = (int) $fields['code_length']['value'];
            $len += $codeLen;
        }
        if (isset($fields['code_suffix']['value'])) {
            $len += strlen($fields['code_suffix']['value']);
        }
        if (isset($fields['code_prefix']['value'])) {
            $len += strlen($fields['code_prefix']['value']);
        }
        if (isset($fields['code_split']['value'])) {
            $v = (int) $fields['code_split']['value'];
            if ($v > 0 && $v < $codeLen) {
                $sep = ',';
                $len += (ceil($codeLen/$v) * strlen($sep))-1;
            }
        }

        if ($len > 255) {
            Mage::throwException(
                Mage::helper('opc')->__('Maximum generated code length is 255. Please correct your settings.')
            );
        }
    }
}
