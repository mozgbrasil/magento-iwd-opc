<?php

class IWD_Opc_Helper_Address extends Mage_Core_Helper_Abstract
{

    const XML_PATH_VAT_FRONTEND_VISIBILITY = 'customer/create_account/vat_frontend_visibility';

    protected $_attributes = array();
    protected $_customerAttributes = array();

    public function getAttributeValidationClass($attributeCode)
    {
        /** @var $attribute Mage_Customer_Model_Attribute */
        $attribute = isset($this->_attributes[$attributeCode]) ?
            $this->_attributes[$attributeCode]
            : ($this->_attributes[$attributeCode] =
                Mage::getSingleton('eav/config')->getAttribute('customer_address', $attributeCode));
        $class = $attribute ? $attribute->getFrontend()->getClass() : '';

        if (in_array($attributeCode, array('firstname', 'middlename', 'lastname', 'prefix', 'suffix', 'taxvat'))) {
            if ($class && !$attribute->getIsVisible()) {
                $class = '';
            }

            /** @var $customerAttribute Mage_Customer_Model_Attribute */
            $customerAttribute = isset($this->_customerAttributes[$attributeCode]) ?
                $this->_customerAttributes[$attributeCode]
                : ($this->_customerAttributes[$attributeCode] =
                    Mage::getSingleton('eav/config')->getAttribute('customer', $attributeCode));
            $class .= $customerAttribute && $customerAttribute->getIsVisible()
                ? $customerAttribute->getFrontend()->getClass() : '';
            $class = implode(' ', array_unique(array_filter(explode(' ', $class))));
        }

        return $class;
    }

    public function isVatAttributeVisible()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_VAT_FRONTEND_VISIBILITY);
    }
}
