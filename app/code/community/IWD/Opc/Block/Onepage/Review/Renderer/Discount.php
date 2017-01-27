<?php

class IWD_Opc_Block_Onepage_Review_Renderer_Discount extends Mage_Tax_Block_Checkout_Discount
{

    protected $_template = 'iwd/opc/onepage/review/totals/discount.phtml';

    public function getDiscountPrice()
    {
        return $this->helper('iwd_opc')->formatPrice($this->getTotal()->getValue(), false);
    }
}
