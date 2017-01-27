<?php

class IWD_Opc_Block_Onepage_Review_Renderer_Subtotal extends Mage_Tax_Block_Checkout_Subtotal
{

    protected $_template = 'iwd/opc/onepage/review/totals/subtotal.phtml';

    public function getSubtotalPrice()
    {
        if ($this->displayBoth()) {
            return $this->getTotal()->getValueExclTax();
        } else {
            return $this->getTotal()->getValue();
        }
    }
}
