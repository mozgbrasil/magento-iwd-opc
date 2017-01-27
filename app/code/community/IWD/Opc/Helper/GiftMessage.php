<?php

class IWD_Opc_Helper_GiftMessage extends Mage_GiftMessage_Helper_Message
{

    public function getInline($type, Varien_Object $entity, $dontDisplayContainer = false)
    {
        if (!$this->isMessagesAvailable($type, $entity)) {
            return '';
        }

        return Mage::getSingleton('core/layout')->createBlock('iwd_opc/onepage_gift_inline')
            ->setId('giftmessage_form_' . $this->_nextId++)
            ->setDontDisplayContainer($dontDisplayContainer)
            ->setEntity($entity)
            ->setType($type)
            ->toHtml();
    }
}
