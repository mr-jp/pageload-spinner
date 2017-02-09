<?php

/**
 * Signal / Slot pattern
 *
 * This class will have a list of slots that listen to a signal, and call the given function
 * Each slot has an object, method name and signal name
 * You register the objects via connect(), supplying the object, method name and signal name
 * Once dispatch() is called with a signal, we go through each slot and call the given function
 * 
 * This file will output a var_dump of the service object, and a list of messages from the 2 objects
 */
class DispatcherService {

	/**
	 * @var array List of slots
	 */
	public $slots = array();

	/**
	 * Register the object
	 * @param $obj Object to register
	 * @param $method Name of the Method to register
	 * @param $signalName Signal to listen for this slot
	 */
	public function connect($obj, $method, $signalName) {

		if (!isset($this->slots[$signalName])) {
			$this->slots[$signalName] = array();
		}
		$this->slots[$signalName][] = array('obj' => $obj, 'method' => $method);
	}

	/**
	 * Dispatch goes through each slot with the signal and call the given function name for the object
	 * @param $signalName Signal name
	 *
	 * @return string
	 */
	public function dispatch($signalName) {

		$messages = '';
		foreach ($this->slots[$signalName] as $slot) {
			if (method_exists($slot['obj'], $slot['method'])) {
				$messages .= $slot['obj']->{$slot['method']}();
			}
		}
		return $messages;
	}
}

/**
 * Example object to register with the Dispatcher
 */
class MessageSlotA {
	public function getMessage() {
		return "Message from A<br>";
	}

	public function getAnotherMessage() {
		return "Another message from A<br>";
	}
}

/**
 * Example object to register with the Dispatcher
 */
class MessageSlotB {
	public function getMessage() {
		return "Message from B<br>";
	}
}

//Instantiate the objects
$service = new DispatcherService();
$slotA = new MessageSlotA();
$slotB = new MessageSlotB();

//Register the slots
$service->connect($slotA, 'getMessage', 'Signal1');
$service->connect($slotB, 'getMessage', 'Signal1');
$service->connect($slotA, 'getAnotherMessage', 'Signal2');

//Just show the service object
var_dump($service);

//Dispatch with the signal Signal1
echo $service->dispatch('Signal1');

//Dispatch with the signal Signal2
echo $service->dispatch('Signal2');
