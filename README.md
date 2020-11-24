# Chem-Lab

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=9E4Q4QVX7FMCA&item_name=To+contribute+to+the+development+of+the+Chemistry+Lab+game.&currency_code=USD)

An idle game about mixing chemicals. <br>
Inspired by Minecraft's Buildcraft Mod

<strong>Objective:</strong>
Mix chemicals together. Create a network of connecting pipes and tanks to separate liquids so that you can create the liquid that gives you the most credits.

Developed with JavaScript/HTML, JQuery, and D3.

<strong> Items </strong>
- Valves                  --> Pipes that you can open and close
- Tank                    --> Stores liquid
- Pump                    --> Produces liquid
- Sell Tank               --> Allows you to sell liquids
- Liquid Distributor Pipe --> Distributes liquids evenly among connecting tanks
- Liquid Sorter Pipe      --> Sorts liquids by color


<strong> Mechanics </strong>
- A <b>store</b> where you can buy, and sell tanks, pipes, pumps, and whatever else I decide to add.
- An <b>inventory</b> where you store your items.
- A <b>world</b> where you place your items.
- The ability to sort various liquids, by chemical properties


<strong> TODO:</strong>
- ~~Snap Pipes to the edge of tanks~~
  - ~~there are some issues with the snapping mechanics~~
    ~~pipes snap to tanks, but the reverse is sometimes messed up~~
- ~~Snap valves to the edge of tanks~~
- Create the liquid distributor pipe
- Create the liquid sorter pipe
- Create a class for the sell tank (extra)
- Create the store interface
* Design the store interface
- Connect pipes together
- Overflow mechanic: tanks spill drops over the edges
  when they have been filled too much. (extra)
- Create snappable class that allows you to create generic snappable objects (extra)
- Display a miniturized graphic of the actual world object on the icons
  for an each item (extra)
- Display opening in tank when pipes are attached. (extra)



<strong>Where did I leave off?</strong>
Last time I was working on chemistry lab. I was working on reorganizing the structure of the classes.
