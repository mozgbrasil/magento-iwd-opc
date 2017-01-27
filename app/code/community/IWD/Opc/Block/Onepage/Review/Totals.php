<?php

class IWD_Opc_Block_Onepage_Review_Totals extends Mage_Checkout_Block_Cart_Totals
{

    public static $iwdOpcAvailableTotals = array(
        'subtotal' => 'iwd_opc/onepage_review_renderer_subtotal',
        'discount' => 'iwd_opc/onepage_review_renderer_discount',
        'shipping' => 'iwd_opc/onepage_review_renderer_shipping',
        'tax' => 'iwd_opc/onepage_review_renderer_tax',
    );

    public function renderTotal($total, $area = null, $colspan = 1)
    {
        $code = $total->getCode();

        if (!$this->isShowTotal($code)) {
            return '';
        }

        if ($total->getAs()) {
            $code = $total->getAs();
        }

        return $this->_getTotalRenderer($code)
            ->setTotal($total)
            ->setColspan($colspan)
            ->setRenderingArea($area === null ? -1 : $area)
            ->toHtml();
    }

    protected function _getTotalRenderer($code)
    {
        $block = $this->getLayout()
            ->createBlock(self::$iwdOpcAvailableTotals[$code], self::$iwdOpcAvailableTotals[$code] . '_total_renderer');
        $block->setTotals($this->getTotals());
        return $block;
    }

    public function isShowTotal($code)
    {
        $arr = self::$iwdOpcAvailableTotals;
        return isset($arr[$code]);
    }
}
