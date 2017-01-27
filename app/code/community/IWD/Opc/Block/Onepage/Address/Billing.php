<?php

class IWD_Opc_Block_Onepage_Address_Billing extends Mage_Checkout_Block_Onepage_Billing
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
            $address = $this->getCustomer()->getPrimaryBillingAddress();
            if ($address) {
                $addressId = $address->getId();
            }
        }

        $select = $this->getLayout()->createBlock('core/html_select')
            ->setName('billing_address_id')
            ->setClass('iwd_opc_address_select iwd_opc_field iwd_opc_select')
            ->setTitle($this->__('Add New Address'))
            ->setValue($addressId)
            ->setOptions($options);
        $select->addOption('0', $this->__('Add New Address'));
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
            ->setName('billing[country_id]')
            ->setId('billing:country_id')
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
                $this->_address = $this->getQuote()->getBillingAddress();
                if (!$this->_address->getFirstname()) {
                    $this->_address->setFirstname($this->getQuote()->getCustomer()->getFirstname());
                }

                if (!$this->_address->getLastname()) {
                    $this->_address->setLastname($this->getQuote()->getCustomer()->getLastname());
                }
            } else {
                $billingAddress = $this->getQuote()->getBillingAddress();
                $billingCountryId = $billingAddress->getCountryId();
                if (!empty($billingCountryId)) {
                    $this->_address = $billingAddress;
                } else {
                    $this->_address = Mage::getModel('sales/quote_address');
                }
            }
        }

        return $this->_address;
    }
}
