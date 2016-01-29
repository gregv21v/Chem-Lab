/*
	Each "item" is a scale version of
	the original with a tooltip that mentions
	its actual dimensions and or properties


	TODO:
		add icons
		adjust text sizes
		make everything prettier

*/


function Inventory(world, position, width, height)
{
	this.world = world;
	this.position = position;
	this.objs = [];
	this.currentButton = null; // the button currently selected
	this.followObj = null;
	this.width = width;
	this.height = height;
	this.buttons = [];

	var self = this;
	var svg = document.querySelector("svg");
	this.testRect = new Rect({x: 0, y: 0}, 0, 0, "orange", 0.5);
	this.testRect.createSVG();


	svg.addEventListener('mousedown', function(evnt) {
		if(!self.contains({x: evnt.clientX, y: evnt.clientY}) && self.currentButton != null)
		{
			// move the object to the world
			self.world.objs.push(self.followObj);

			// remove the obj
			self.objs.splice(self.currentButton.index, 1);

			// remove the button
			self.currentButton.destroySVG();
			self.buttons.splice(self.currentButton.index, 1);

			// resign indicies
			for(var i = 0; i < self.buttons.length; i++) {
				self.buttons[i].index = i;
			}

			self.followObj = null;
			self.currentButton = null;
		}

	});

	/**********************
			Mouse Movement
	***********************/
	svg.addEventListener('mousemove', function(evnt) {

		var tanks = self.world.findTanks();
		if(self.followObj != null) {
			// TODO: Move this to the world.
			// snap following pipe to tank if pipe is within the tanks snapping radius
			if(self.followObj instanceof Pipe) {

				//console.log("Instance of Pipe");
				var snapping = false // determines whether the pipe is snapping to a tank
				// check if part of pipe is in snapping zone
				var mousePos = {x: evnt.clientX, y: evnt.clientY} // try making this curser point and see what happens

				for(var i = 0; i < tanks.length; i++) {
					//console.log(tanks[i].snapArea);
					if(tanks[i].snapArea.contains(mousePos)) {
						snapping = true
						// create a line from the center of the tank to the edge of the
						// circular snap area
						// y = mx + b
						// m = (y2 - y1) / (x2 - x1)
						// b = y - mx
						// (y - b) / m = x


						var tankCenter = tanks[i].getCenter();
						var m = (mousePos.y - tankCenter.y) / (mousePos.x - tankCenter.y)
						var b = mousePos.y - m * mousePos.x

						// find intersections with tank
						var intersections = []
						var intersection = {x: 0, y: 0, edge: ""} // possible edges: left, right, bottom

						



						// check to see if the line intersects with the **left** wall
						// of the tank
						intersection.x = tanks[i].position.x;
						intersection.y = m * intersection.x + b;
						intersection.edge = "left"

						if(
							intersection.y > tanks[i].position.y &&
							intersection.y < tanks[i].position.y + tanks[i].getHeight()
						) {
							intersections.push(intersection)
							intersection = {x: 0, y: 0, edge: ""}
						}


						// check to see if the line intersects with the **right** wall
						// of the tank
						intersection.x = tanks[i].position.x + tanks[i].getWidth();
						intersection.y = m * intersection.x + b;
						intersection.edge = "right"

						if(
							intersection.y > tanks[i].position.y &&
							intersection.y < tanks[i].position.y + tanks[i].getHeight()
						) {
							intersections.push(intersection)
							intersection = {x: 0, y: 0, edge: ""}
						}


						// check to see if the line intersects with the **buttom** wall
						// of the tank
						intersection.y = tanks[i].position.y + tanks[i].getHeight();
						intersection.x = (intersection.y - b) / m;
						intersection.edge = "bottom"

						if(
							intersection.x > tanks[i].position.x &&
							intersection.x < tanks[i].position.x + tanks[i].getWidth()
						) {
							intersections.push(intersection)
							intersection = {x: 0, y: 0, edge: ""}
						}

						// check if all points contain edge mid point
						for(var i = 0; i < intersections.length; i++) {
							/*
								construct a square from the center of the tank to the
								intersection point. If the edge mid point is within that
								square, then you have your desired intersection point.
								otherwise, continue searching.
							*/

							// construct a square from (center, intersection[i])
							var max = {x: 0, y: 0}
							var min = {x: 0, y: 0}

							// x
							if(self.followObj.center.x > intersections[i].x) {
								max.x = self.followObj.center.x
								min.x = intersections[i].x
							} else {
								max.x = intersections[i].x
								min.x = self.followObj.center.x
							}

							// y
							if(self.followObj.center.y > intersections[i].y) {
								max.y = self.followObj.center.y
								min.y = intersections[i].y
							} else {
								max.y = intersections[i].y
								min.y = self.followObj.center.y
							}

							//this.testRect.fromPoints(min, max);
							//this.updateSVG();

							// check if edge mid point is in that rectangle
							if(
								min.x <= mousePos.x && max.x >= mousePos.x &&
								min.y <= mousePos.y && max.y >= mousePos.y
							) {
								intersection = intersections[i]
							}


						}


						self.followObj.center = {x: intersection.x, y: intersection.y}
						if(intersection.edge == "left" || intersection.edge == "right") {
							self.followObj.setAlignment("horizontal")
							if(intersection.edge == "left")
								self.followObj.center.x -= self.followObj.getWidth()/2;
							else
								self.followObj.center.x += self.followObj.getWidth()/2;
						} else {
							self.followObj.setAlignment("vertical")
							self.followObj.center.y += self.followObj.getHeight()/2;
						}
						self.followObj.updatePosition();
						self.followObj.updateSVG();

					}
				}
				if (!snapping) {
					console.log("Mouse moving");
					self.followObj.center = mousePos
					self.followObj.updatePosition();
					self.followObj.updateSVG();
				}
			}
		}
	});

	document.addEventListener('keypress', function(evnt) {
		if(evnt.keyCode == 114 && self.followObj instanceof Pipe) {
			self.followObj.rotate();
			self.followObj.updateSVG();
		}
	})





}
Inventory.prototype.createSVG = function() {
	var self = this;
	var buttonHeight = 80;


	var svg = document.querySelector("svg");

	var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	background.setAttribute("height", this.height);
	background.setAttribute("width", this.width);
	background.setAttribute("x", this.position.x);
	background.setAttribute("y", this.position.y);
	background.setAttribute("stroke-width", 10);
	background.setAttribute("fill", "blue");
	background.setAttribute("stroke", "black");

	svg.appendChild(background);

	// create the buttons
	for(var i = 0; i < this.objs.length; i++) {
		this.buttons.push(new Button({x: this.position.x, y: this.position.y + i * buttonHeight}, this.width, 80));
		this.buttons[i].setTextFill({color: "black"});
		this.buttons[i].setFill({color: "blue", opacity: 0.5});
		this.buttons[i].setText(this.objs[i].getInfo());
		this.buttons[i].setStroke({color: "black", width: 10});
		this.buttons[i].index = i;

		this.buttons[i].createSVG();
		this.buttons[i].setOnClickWithParam(function(button) {
			self.currentButton = button;

			for(var k = 0; k < self.buttons.length; k++)
				self.buttons[k].setFill({color: "blue"});
			button.setFill({color: "green"}); // color as selected

			self.followObj = self.objs[button.index];
			self.followObj.createSVG();


		}, this.buttons[i]);


	}
};


Inventory.prototype.contains = function(point) {
	return point.x <= this.position.x + this.width
		&& point.x >= this.position.x
		&& point.y <= this.position.y + this.height
		&& point.y >= this.position.y;
};
