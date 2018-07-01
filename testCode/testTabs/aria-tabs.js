/*
 * A very primitive tab system based on ARIA roles:
 * http://www.w3.org/TR/wai-aria/roles
 *
 * This is heavily inspired by Heydon Pickering's Practical ARIA Examples:
 * http://heydonworks.com/practical_aria_examples/
 *
 * Your markup should look something like this:
 *
 * <div>
 *   <!-- note: we only look for panels within the tablist's parent -->
 *   <ul role="tablist">
 *     <li><a role="tab" aria-selected="true" href="#panel1">Panel 1</a></li>
 *     <li><a role="tab" href="#panel2">Panel 2</a></li>
 *     <li><a role="tab" href="#panel1">Panel 3</a></li>
 *   </ul>
 *   <section id="panel1">Panel 1</section>
 *   <section id="panel2">Panel 2</section>
 *   <section id="panel3">Panel 3</section>
 * </div>
 */
d3.selectAll("*[role='tablist']")
  .each(function() {
    // grab all of the tabs and panels
    var tabs = d3.select(this).selectAll("*[role='tab'][href]")
          .datum(function() {
            var href = this.href,
                target = document.getElementById(href.split("#").pop());
            return {
              selected: this.getAttribute("aria-selected") === "true",
              target: target
            };
          }),
        targets = tabs.data()
          .map(function(d) {
            return d.target;
          }),
        panels = d3.selectAll("*[role='tabpanel']")
          .filter(function() {
            return targets.indexOf(this) > -1;
          })
          .datum(function(d) {
            return d || {selected: false};
          });

    // when a tab is clicked, update the panels
    tabs.on("click.tab", function(d) {
      d3.event.preventDefault();
      tabs.each(function(tab) { tab.selected = false; });
      d.selected = true;
      update();
    });

    // update them to start
    update();

    function update() {
      var selected;
      tabs
        .attr("aria-selected", function(tab) {
          if (tab.selected) selected = tab.target;
          return tab.selected;
        });
      panels
        .attr("aria-hidden", function(panel) {
          panel.selected = (selected === this);
          return !panel.selected;
        })
        .style("display", function(d) {
          return d.selected ? null : "none";
        });
    }
  });
