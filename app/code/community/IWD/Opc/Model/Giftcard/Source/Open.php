<?php

class IWD_Opc_Model_Giftcard_Source_Open extends Mage_Eav_Model_Entity_Attribute_Source_Abstract
{
    /**
     * Get all options
     *
     * @return array
     */
    public function getAllOptions()
    {
        $result = array();
        foreach ($this->_getValues() as $k => $v) {
            $result[] = array(
                'value' => $k,
                'label' => $v,
            );
        }

        return $result;
    }

    /**
     * Get option text
     *
     * @return string|null
     */
    public function getOptionText($value)
    {
        $options = $this->_getValues();
        if (isset($options[$value])) {
            return $options[$value];
        }
        return null;
    }

    /**
     * Get values
     *
     * @return array
     */
    protected function _getValues()
    {
        return array(
            0 => Mage::helper('opc')->__('No'),
            1  => Mage::helper('opc')->__('Yes'),
        );
    }

    /**
     * Retrieve flat column definition
     *
     * @return array
     */
    public function getFlatColums()
    {
        $attributeDefaultValue = $this->getAttribute()->getDefaultValue();
        $attributeCode = $this->getAttribute()->getAttributeCode();
        $attributeType = $this->getAttribute()->getBackendType();
        $isNullable = is_null($attributeDefaultValue) || empty($attributeDefaultValue);

        $column = array(
            'unsigned' => false,
            'extra'    => null,
            'default'  => $isNullable ? null : $attributeDefaultValue
        );

        if (Mage::helper('core')->useDbCompatibleMode()) {
            $column['type']     = $attributeType;
            $column['is_null']  = $isNullable;
        } else {
            $column['type']     = Mage::getResourceHelper('eav')->getDdlTypeByColumnType($attributeType);
            $column['nullable'] = $isNullable;
            $column['comment']  = 'IWD Opc pro Giftcard Open ' . $attributeCode . ' column';
        }

        return array($attributeCode => $column);
    }

    /**
     * Retrieve select for flat attribute update
     *
     * @param int $store
     * @return Varien_Db_Select|null
     */
    public function getFlatUpdateSelect($store)
    {
        return Mage::getResourceModel('eav/entity_attribute')
            ->getFlatUpdateSelect($this->getAttribute(), $store);
    }
}
