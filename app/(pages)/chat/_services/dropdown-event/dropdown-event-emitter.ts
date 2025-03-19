import { EventEmitter } from "events";

class EventDropDown extends EventEmitter {
  constructor() {
    super();
  }
}

export const dropdownEventEmitter = new EventDropDown();
