window.assert = chai.assert;

describe('Mediawiki2markdown', function() {
  describe('#convertHeader()', function() {    
    it('should convert == Title == to ## Title', function() {
      var source = "== Title ==";
      var result = MediawikiTo2Markdown.convertHeader(source);
      var expectResult = "## Title";
      assert.deepEqual(result, expectResult);
    });
  });
}); 
