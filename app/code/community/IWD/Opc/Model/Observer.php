<?php

class IWD_Opc_Model_Observer
{
    /**
     * @return IWD_Opc_Helper_Data
     */
    public function getOpcHelper()
    {
        return Mage::helper('iwd_opc');
    }

    /**
     * @return Mage_Core_Model_Session
     */
    public function getCoreSession()
    {
        return Mage::getSingleton('core/session');
    }

    public function checkRequiredModules(Varien_Event_Observer $observer)
    {
        if (Mage::getSingleton('admin/session')->isLoggedIn()) {
            if (!Mage::getConfig()->getModuleConfig('IWD_All')->is('active', 'true')) {
                $cache = Mage::app()->getCache();
                if ($cache->load('iwd_opc_message') === false) {
                    $message = 'Important: Please setup IWD All extension in order to finish 
                        <strong>Checkout Suite</strong> 
                        installation.<br />
						Please download 
						<a href="http://iwdextensions.com/media/modules/iwd_all.tgz" target="_blank">
						    IWD All extension
						</a> and setup it via Magento Connect.';
                    Mage::getSingleton('adminhtml/session')->addNotice($message);
                    $cache->save('true', 'iwd_opc_message', array('iwd_opc_message'), $lifeTime = 5);
                }
            }
        }
    }

    public function saveNewsletter(Varien_Event_Observer $observer)
    {
        $email = $observer->getEvent()->getOrder()->getCustomerEmail();
        $subscribe = $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_SUBSCRIBE);
        $subscribeEnabled = $this->getOpcHelper()->isShowSubscribe();
        if ($subscribe && $email && $subscribeEnabled) {
            /**
             * @var $subscribeModel Mage_Newsletter_Model_Subscriber
             */
            $subscribeModel = Mage::getModel('newsletter/subscriber');
            $subscribeModel->loadByEmail($email);
            if ($subscribeModel->getStatus() != Mage_Newsletter_Model_Subscriber::STATUS_SUBSCRIBED
                && $subscribeModel->getStatus() != Mage_Newsletter_Model_Subscriber::STATUS_UNSUBSCRIBED
            ) {
                $subscribeModel->setImportMode(true)->subscribe($email);
                $subscribeModel = Mage::getModel('newsletter/subscriber');
                $subscribeModel->loadByEmail($email);
                $subscribeModel->sendConfirmationSuccessEmail();
            }
        }
    }

    public function saveComment(Varien_Event_Observer $observer)
    {
        $comment = $this->getCoreSession()->getData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_COMMENT, '');
        $commentEnabled = $this->getOpcHelper()->isShowCommentField();
        /**
         * @var $order Mage_Sales_Model_Order
         */
        $order = $observer->getEvent()->getOrder();
        if ($comment && $commentEnabled) {
            $order->setCustomerComment($comment);
            $order->setCustomerNoteNotify(false);
            $order->setCustomerNote($comment);
            $order->addStatusHistoryComment($comment)
                ->setIsVisibleOnFront(true)
                ->setIsCustomerNotified(false);
            $order->save();
        }
    }

    public function clearSession(Varien_Event_Observer $observer)
    {
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_COMMENT);
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_SUBSCRIBE);
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_FOUNDED_CUSTOMERS);
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_EMAIL);
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_PAYMENT_METHOD_CODE);
        $this->getCoreSession()->unsetData(IWD_Opc_Helper_Data::IWD_OPC_CUSTOMER_SHIPPING_GROUP);
    }
}
