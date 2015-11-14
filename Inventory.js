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

	// create the icon on the cursor
	svg.addEventListener('mousemove', function(evnt) {
		if(self.followObj != null) {
			if(self.followObj instanceof Pipe) {
				self.followObj.center = {x: evnt.clientX, y: evnt.clientY};
				self.followObj.updateSVG();
			} else {
				self.followObj.position = {x: evnt.clientX, y: evnt.clientY};
				self.followObj.updateSVG();
			}
		}

		// TODO: Move this to the world.
		// snap following pipe to tank if pipe is within the tanks snapping radius
		if(self.followObj instanceof Pipe) {
			var tanks = self.world.findTanks();


			// check if part of pipe is in snapping zone
			for(var i = 0; i < tanks.length; i++) {
				tanks[i].updateSnapAreas();

				// check the left side
				if(
					(
						   tanks[i].snapAreas.left.external.intersects(self.followObj.getRect())
						|| tanks[i].snapAreas.left.internal.intersects(self.followObj.getRect())
					)
				) {
					// align right side of pipe with left side of tank
					// left wall is at position of tank rect
					// center should be at tank.x - pipe.width / 2
					self.followObj.alignment = "horizontal";
					self.followObj.center.x = tanks[i].position.x - self.followObj.getWidth()/2;
					self.followObj.updateSVG();
				}




				// check the right side
				if(
					(
						   tanks[i].snapAreas.right.external.intersects(self.followObj.getRect())
						|| tanks[i].snapAreas.right.internal.intersects(self.followObj.getRect())
					) 
				) {
					// align right side of pipe with right side of tank
					// right wall is at position of tank rect
					// center should be at tank.x - pipe.width / 2
					self.followObj.alignment = "horizontal";
					self.followObj.center.x = tanks[i].position.x + tanks[i].getWidth() + self.followObj.getWidth()/2;
					self.followObj.updateSVG();
				}


				// check the bottom side
				if(
					(
						   tanks[i].snapAreas.bottom.external.intersects(self.followObj.getRect())
						|| tanks[i].snapAreas.bottom.internal.intersects(self.followObj.getRect())
					) 
				) {
					// align bottom side of pipe with bottom side of tank
					// bottom wall is at position of tank rect
					// center should be at tank.x - pipe.width / 2
					self.followObj.alignment = "vertical";
					self.followObj.center.y = tanks[i].position.y + tanks[i].getHeight() + self.followObj.getHeight()/2;
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
	console.log("Inventory: createSVG");

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

	console.log(this.buttons);

};


Inventory.prototype.contains = function(point) {
	return point.x <= this.position.x + this.width
		&& point.x >= this.position.x
		&& point.y <= this.position.y + this.height
		&& point.y >= this.position.y;
};

