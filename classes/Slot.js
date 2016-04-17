function Slot(position, width, height) {
  Button.call(this, position, width, height);
  this.empty = false;
  this.index = 0;
}


Slot.prototype = Button.prototype;
