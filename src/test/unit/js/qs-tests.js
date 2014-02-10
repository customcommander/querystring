YUI.add('qs-tests', function (Y) {

var suite = new Y.Test.Suite('Query String Tests Suite');

suite.add(new Y.Test.Case({

    name: "QS()",

    "is a global function": function () {
        Y.Assert.isFunction(window.QS);
    },

    "returns an object": function () {
        Y.Assert.isObject(window.QS());
    }
}));

suite.add(new Y.Test.Case({

    name: "QS() - get()",

    "returns the value of given key": function () {
        var qry = QS('foo=bar');
        Y.Assert.areSame('bar', qry.get('foo'));
    },

    "returns the decoded value of given key": function () {
        var qry = QS('foo='+encodeURIComponent('http://foo.url?a=1'));
        Y.Assert.areSame('http://foo.url?a=1', qry.get('foo'));
    },

    "returns undefined if given key is not found": function () {
        var qry = QS('foo=bar');
        Y.Assert.areSame(undefined, qry.get('xyz'));
    },

    "returns the default value if given key is not found": function () {
        var qry = QS('foo=bar');
        Y.Assert.areSame(123, qry.get('xyz', 123));
        Y.Assert.areSame(0, qry.get('xyz', 0));
        Y.Assert.areSame(false, qry.get('xyz', false));
        Y.Assert.areSame(null, qry.get('xyz', null));
    },

    "use the query string from the current location if not supplied to QS()": function () {
        Y.one(document.body).append('<iframe src="assets/iframe.html?foo=bar"></iframe>');
        function ready() {
            return window.frames[0] && window.frames[0].qry;
        }
        this.waitFor(ready, function () {
            Y.Assert.areSame('bar', window.frames[0].qry.get('foo'));
            Y.one('iframe').remove();
        });
    }
}));

Y.Test.Runner.add(suite);

});