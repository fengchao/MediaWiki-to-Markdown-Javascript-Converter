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
	describe('#convertHc()', function() {
		it('should convert {{hc|text1|text2}} to ```\ntext1\ntext2\n```',
				function() {
					var source = "{{hc|text1|line1\nline2}}";
					var result = MediawikiTo2Markdown.convertHc(source);
					var expectResult = "```\ntext1\n\line1\nline2\n```";
					assert.deepEqual(result, expectResult);
				});
	});
}); 
