<?php

class IWD_Opc_Model_Giftcardaccount_Source_Format extends Mage_Core_Model_Abstract
{
    /**
     * Return list of gift card account code formats
     *
     * @return array
     */
    public function getOptions()
    {
        return array(
            'alphanum'
                => Mage::helper('opc')->__('Alphanumeric'),
            'alpha'
                => Mage::helper('opc')->__('Alphabetical'),
            'num'
                => Mage::helper('opc')->__('Numeric'),
        );
    }

    /**
     * Return list of gift card account code formats as options array.
     * If $addEmpty true - add empty option
     *
     * @param boolean $addEmpty
     * @return array
     */
    public function toOptionArray($addEmpty = false)
    {
        $result = array();

        if ($addEmpty) {
            $result[] = array('value' => '',
                              'label' => '');
        }

        foreach ($this->getOptions() as $value=>$label) {
            $result[] = array('value' => $value,
                              'label' => $label);
        }

        return $result;
    }
}
