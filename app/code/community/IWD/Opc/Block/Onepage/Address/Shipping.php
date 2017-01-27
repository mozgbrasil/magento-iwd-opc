<?php

class IWD_Opc_Block_Onepage_Address_Shipping extends Mage_Checkout_Block_Onepage_Shipping
{

    public function getAddressHtmlSelect()
    {
        $options = array();
        foreach ($this->getCustomer()->getAddresses() as $address) {
            $options[] = array(
                'value' => $address->getId(),
                'label' => $address->format('oneline')
            );
        }

        $addressId = $this->getAddress()->getCustomerAddressId();
        if (empty($addressId)) {
            $address = $this->getCustomer()->getPrimaryShippingAddress();
            if ($address) {
                $addressId = $address->getId();
            }
        }

        $select = $this->getLayout()->createBlock('core/html_select')
            ->setName('shipping_address_id')
            ->setClass('iwd_opc_address_select iwd_opc_field iwd_opc_select')
            ->setTitle(Mage::helper('iwd_opc')->__('Add New Address'))
            ->setValue($addressId)
            ->setOptions($options);

        $select->addOption('0', Mage::helper('iwd_opc')->__('Add New Address'));

        return $select->getHtml();
    }

    public function getCountrySelect()
    {
        $countryId = $this->getAddress()->getCountryId();
        if ($countryId === null) {
            $countryId = Mage::helper('core')->getDefaultCountry();
        }

        $countries = $this->getCountryOptions();
        if (isset($countries[0]) && !$countries[0]['value'] && !trim($countries[0]['label'])) {
            $countries[0]['label'] = $this->__('Country');
        }

        $select = $this->getLayout()->createBlock('core/html_select')
            ->setName('shipping[country_id]')
            ->setId('shipping:country_id')
            ->setTitle($this->__('Country'))
            ->setClass('iwd_opc_field iwd_opc_select required-entry')
            ->setOptions($countries)
            ->setValue($countryId);
        return $select->getHtml();
    }

    public function getAddress()
    {
        if ($this->_address === null) {
            if ($this->isCustomerLoggedIn()) {
                $this->_address = $this->getQuote()->getShippingAddress();
            } else {
                $shippingAddress = $this->getQuote()->getShippingAddress();
                $billingCountryId = $shippingAddress->getCountryId();
                if (!empty($billingCountryId))
                    $this->_address = $shippingAddress;
                else
                    $this->_address = Mage::getModel('sales/quote_address');
            }
        }

        return $this->_address;
    }
}
