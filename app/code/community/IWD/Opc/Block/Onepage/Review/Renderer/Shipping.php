<?php

class IWD_Opc_Block_Onepage_Review_Renderer_Shipping extends Mage_Tax_Block_Checkout_Shipping
{

    protected $_template = 'iwd/opc/onepage/review/totals/shipping.phtml';

    public function getShippingPrice()
    {
        if ($this->displayBoth()) {
            return $this->getShippingExcludeTax();
        } elseif ($this->displayIncludeTax()) {
            return $this->getShippingIncludeTax();
        } else {
            return $this->getShippingExcludeTax();
        }
    }
}
