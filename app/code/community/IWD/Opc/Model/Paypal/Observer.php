<?php

class IWD_Opc_Model_Paypal_Observer
{
    /**
     * Set data for response of frontend saveOrder action
     *
     * @param Varien_Event_Observer $observer
     * @return IWD_Opc_Model_Paypal_Observer
     */
    public function setResponseAfterSaveOrder(Varien_Event_Observer $observer)
    {
        /**
         * @var $order Mage_Sales_Model_Order
         */
        $order = Mage::registry('hss_order');

        if ($order && $order->getId()) {
            $payment = $order->getPayment();
            if ($payment && in_array($payment->getMethod(), Mage::helper('paypal/hss')->getHssMethods())) {
                /** @var $controller Mage_Core_Controller_Varien_Action */
                $controller = $observer->getEvent()->getData('controller_action');
                $result = Mage::helper('core')->jsonDecode(
                    $controller->getResponse()->getBody('default'),
                    Zend_Json::TYPE_ARRAY
                );

                if (empty($result['message']) && $result['status']) {
                    $controller->loadLayout('checkout_onepage_review');
                    $html = $controller->getLayout()->getBlock('paypal.iframe')->toHtml();
                    $result['popup'] = array(
                        'allow_close_popup' => false,
                        'content' => $html
                    );
                    if (isset($result['redirect_url'])) {
                        unset($result['redirect_url']);
                    }

                    $result['status'] = false;
                    $controller->getResponse()->clearHeader('Location');
                    $controller->getResponse()->setBody(Mage::helper('core')->jsonEncode($result));
                }
            }
        }

        return $this;
    }
}
