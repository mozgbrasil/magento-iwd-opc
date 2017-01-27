<?php

class IWD_Opc_Block_Onepage_Review extends Mage_Checkout_Block_Onepage_Review_Info
{
    /**
     * @return Mage_Checkout_Model_Type_Onepage
     */
    public function getOnepage()
    {
        return Mage::getSingleton('checkout/session');
    }

    /**
     * @return Mage_Sales_Model_Quote
     */
    public function getQuote()
    {
        return $this->getOnepage()->getQuote();
    }

    public function getAddress()
    {
        $quote = $this->getQuote();
        return ($quote->getIsVirtual() ? $quote->getBillingAddress() : $quote->getShippingAddress());
    }

    public function getGrandTotalPrice()
    {
        if ($this->isInclTax() && $this->getTotalExclTax() > 0) {
            return $this->getGrandTotal();
        } else {
            return $this->getTotalExclTax();
        }
    }

    public function getGrandTotal()
    {
        return $this->getQuote()->getGrandTotal();
    }

    public function isInclTax()
    {
        return Mage::getSingleton('tax/config')->displayCartTaxWithGrandTotal($this->getQuote()->getStore());
    }

    public function getTotalExclTax()
    {
        $excl = $this->getGrandTotal();
        $excl = max($excl, 0);
        return $excl;
    }
}
