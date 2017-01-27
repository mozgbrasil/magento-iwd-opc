<?php
/**
 * Created by PhpStorm.
 * User: IWD
 * Date: 05.04.2016
 * Time: 15:27
 */
if (Mage::helper('core')->isModuleEnabled('Shipperhq_Splitrates')) {
    class IWD_Opc_Block_Onepage_Shipping_Method_AvailableBase extends Shipperhq_Splitrates_Block_Checkout_Onepage_Shipping_Method_Available {
        public function getTemplate()
        {
            return 'shipperhq/checkout/onepage/shipping_method/available.phtml';
        }
    }
} else {
    class IWD_Opc_Block_Onepage_Shipping_Method_AvailableBase extends Mage_Checkout_Block_Onepage_Shipping_Method_Available { }
}
class IWD_Opc_Block_Onepage_Shipping_Method_Available extends IWD_Opc_Block_Onepage_Shipping_Method_AvailableBase {}