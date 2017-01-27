<?php

require_once Mage::getModuleDir('controllers', 'Mage_Checkout') . DS . 'OnepageController.php';

class IWD_Opc_Checkout_OnepageController extends Mage_Checkout_OnepageController
{

    public function indexAction()
    {
        $scheme = Mage::app()->getRequest()->getScheme();
        if ($scheme == 'http') {
            $secure = false;
        } else {
            $secure = true;
        }

        if (Mage::helper('iwd_opc')->isEnable()) {
            $this->_redirect(IWD_Opc_Helper_Data::IWD_OPC_FRONT_NAME, array('_secure' => $secure));
            return;
        } else {
            parent::indexAction();
        }
    }
}
