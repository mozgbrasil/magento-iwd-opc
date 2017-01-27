<?php
class IWD_Opc_GiftController extends Mage_Core_Controller_Front_Action{
	
    /**
     * No index action, forward to 404
     *
     */
    public function indexAction(){
        $this->_forward('noRoute');
    }

    /**
     * Add Gift Card to current quote
     *
     */
    public function addAction(){
        $data = $this->getRequest()->getPost();
        $responseData = array();
        if (isset($data['giftcard_code'])) {
            $code = $data['giftcard_code'];
            try {
                Mage::getModel('enterprise_giftcardaccount/giftcardaccount')
                    ->loadByCode($code)
                    ->addToCart();
                    
                $responseData['error'] = false;
                $responseData['message'] = $this->__('Gift Card "%s" was added.', Mage::helper('core')->htmlEscape($code));
                
            } catch (Mage_Core_Exception $e) {
                Mage::dispatchEvent('enterprise_giftcardaccount_add', array('status' => 'fail', 'code' => $code));
                
                $responseData['error'] = true;
                $responseData['message'] =  $e->getMessage();
              
            } catch (Exception $e) {
            	$responseData['error'] = true;
            	$responseData['message'] =  $this->__('Cannot apply gift card.');
            }
        }
        
        $this->getResponse()->setHeader('Content-type','application/json', true);
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($responseData));
    }

    public function removeAction(){
    	$responseData = array();
    	
        if ($code = $this->getRequest()->getParam('code')) {
            try {
                Mage::getModel('enterprise_giftcardaccount/giftcardaccount')
                    ->loadByCode($code)
                    ->removeFromCart();
                    
				$responseData['error'] = false;
				$responseData['message'] = $this->__('Gift Card "%s" was removed.', Mage::helper('core')->htmlEscape($code));
                    
            } catch (Mage_Core_Exception $e) {
               	$responseData['error'] = true;
                $responseData['message'] =  $e->getMessage();
            } catch (Exception $e) {
            	$responseData['error'] = true;
               $responseData['message'] =  $this->__('Cannot remove gift card.');
            }
            
        } else {
            $this->_forward('noRoute');
            return;
        }
        
        $this->getResponse()->setHeader('Content-type','application/json', true);
        $this->getResponse()->setBody(Mage::helper('core')->jsonEncode($responseData));
    }

    /**
     * Check a gift card account availability
     *
     */
    public function checkAction()
    {
        return $this->quickCheckAction();
    }

    /**
     * Check a gift card account availability
     *
     */
    public function quickCheckAction()
    {
        /* @var $card Enterprise_GiftCardAccount_Model_Giftcardaccount */
        $card = Mage::getModel('enterprise_giftcardaccount/giftcardaccount')
            ->loadByCode($this->getRequest()->getParam('giftcard_code', ''));
        Mage::register('current_giftcardaccount', $card);
        try {
            $card->isValid(true, true, true, false);
        }
        catch (Mage_Core_Exception $e) {
            $card->unsetData();
        }

        $this->loadLayout();
        $this->renderLayout();
    }
}
