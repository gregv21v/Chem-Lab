describe('Shape Tests', function() {
  it('Circle contains', function() {
    var testCircle = new Circle({x: 0, y: 0}, 5)
    expect(testCircle.contains(0, 0)).toEqual(true)
  })

  


});
