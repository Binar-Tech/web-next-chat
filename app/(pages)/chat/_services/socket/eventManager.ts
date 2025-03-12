import { EventEmitter } from "events";

class EventManager extends EventEmitter {
  constructor() {
    super();
  }
}

export const eventManager = new EventManager();
