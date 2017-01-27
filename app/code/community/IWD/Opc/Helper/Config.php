<?php

class IWD_Opc_Helper_Config extends Mage_Core_Helper_Abstract
{

    const XML_PATH_PAYMENT_METHODS = 'payment';
    const XML_PATH_PAYMENT_GROUPS = 'global/payment/groups';

    public function getPaymentMethodList($sorted = true, $asLabelValue = false, $withGroups = false, $store = null)
    {
        $methods = array();
        $groups = array();
        $groupRelations = array();
        foreach ($this->getPaymentMethods($store) as $code => $data) {
            if ((isset($data['title']))) {
                $methods[$code] = $data['title'];
            } else {
                if ($this->getMethodInstance($code)) {
                    $methods[$code] = $this->getMethodInstance($code)->getConfigData('title', $store);
                }
            }

            if ($asLabelValue && $withGroups && isset($data['group'])) {
                $groupRelations[$code] = $data['group'];
            }
        }

        if ($asLabelValue && $withGroups) {
            $groups = Mage::app()->getConfig()->getNode(self::XML_PATH_PAYMENT_GROUPS)->asCanonicalArray();
            foreach ($groups as $code => $title) {
                $methods[$code] = $title; // for sorting, see below
            }
        }

        if ($sorted) {
            asort($methods);
        }

        if ($asLabelValue) {
            $labelValues = array(array('value' => '', 'label' => $this->__('-- Please select a payment method --')));
            foreach ($methods as $code => $title) {
                $labelValues[$code] = array();
            }

            foreach ($methods as $code => $title) {
                if ($code == 'googlecheckout' || $code == '') {
                    unset($methods[$code]);
                    unset($labelValues[$code]);
                    continue;
                }

                $title = '[' . $code . '] ' . $title;
                if (isset($groups[$code])) {
                    $labelValues[$code]['label'] = $title;
                } elseif (isset($groupRelations[$code])) {
                    unset($labelValues[$code]);
                    $labelValues[$groupRelations[$code]]['value'][$code] = array('value' => $code, 'label' => $title);
                } else {
                    $labelValues[$code] = array('value' => $code, 'label' => $title);
                }
            }

            return $labelValues;
        }

        return $methods;
    }

    public function getPaymentMethods($store = null)
    {
        return Mage::getStoreConfig(self::XML_PATH_PAYMENT_METHODS, $store);
    }

    public function getMethodInstance($code)
    {
        $key = self::XML_PATH_PAYMENT_METHODS . '/' . $code . '/model';
        $class = Mage::getStoreConfig($key);
        return Mage::getModel($class);
    }

    public function getShippingMethodsList()
    {
        $methods = array(array('value' => '', 'label' => $this->__('-- Please select a shipping method --')));
        $carriers = Mage::getSingleton('shipping/config')->getAllCarriers();
        foreach ($carriers as $carrierCode => $carrierModel) {
            $carrierMethods = $carrierModel->getAllowedMethods();
            if (!$carrierMethods) {
                continue;
            }

            $carrierTitle = Mage::getStoreConfig('carriers/' . $carrierCode . '/title');
            $methods[$carrierCode] = array(
                'label' => $carrierTitle,
                'value' => array(),
            );
            foreach ($carrierMethods as $methodCode => $methodTitle) {
                $methods[$carrierCode]['value'][] = array(
                    'value' => $carrierCode . '_' . $methodCode,
                    'label' => '[' . $carrierCode . '] ' . $methodTitle,
                );
            }
        }

        return $methods;
    }
}
