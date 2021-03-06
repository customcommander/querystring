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

suite.add(new Y.Test.Case({

    name: "QS() - separators",

    "default separator for parameters is '&'": function () {
        var qry = QS('a=1&b=2');
        Y.Assert.areEqual(1, qry.get('a'));
        Y.Assert.areEqual(2, qry.get('b'));
    },

    "default separator for values is '='": function () {
        var qry = QS('a=1&b=2');
        Y.Assert.areEqual(1, qry.get('a'));
        Y.Assert.areEqual(2, qry.get('b'));
    },

    "allow custom separator for parameters": function () {
        var qry = QS('a=1@b=2', '@');
        Y.Assert.areEqual(1, qry.get('a'));
        Y.Assert.areEqual(2, qry.get('b'));
    },

    "allow custom separator for values": function () {
        var qry = QS('a:1&b:2', null, ':');
        Y.Assert.areEqual(1, qry.get('a'));
        Y.Assert.areEqual(2, qry.get('b'));
    }
}));

suite.add(new Y.Test.Case({

    name: "array support",

    "should support arrays": function () {
        var qry = QS('foo=1&foo=2&foo=3&bar=4&bar=5&bar=6');
        Y.Assert.isArray(qry.get('foo'), 'Expected foo to be an array');
        Y.Assert.isArray(qry.get('bar'), 'Expected bar to be an array');
        Y.ArrayAssert.itemsAreEqual([1,2,3], qry.get('foo'));
        Y.ArrayAssert.itemsAreEqual([4,5,6], qry.get('bar'));
    },

    "array values should be decoded": function () {
        var qry = QS( 'url='+encodeURIComponent('http://url?a=1')
                    +'&url='+encodeURIComponent('http://url?a=2') );
        Y.ArrayAssert.itemsAreEqual(['http://url?a=1','http://url?a=2'], qry.get('url'));
    }
}));

suite.add(new Y.Test.Case({

    name: "object support",

    "basic stuff: 'foo.bar=1' ~> { foo: { bar: 1 } }": function () {
        var qry = QS('foo.bar=1');
        var foo = qry.get('foo');
        Y.Assert.isObject(foo);
        Y.Assert.areEqual(1, foo.bar);
    },

    "should support deep hierarchy object": function () {
        var qry = QS( 'foo.bar.baz.bat_1='+encodeURIComponent('#@!&?1')
                    +'&foo.bar.baz.bat_2='+encodeURIComponent('#@!&?2')
                    +'&foo.bar.baz.bat_3='+encodeURIComponent('#@!&?3') );

        var foo = qry.get('foo');

        Y.Assert.isObject(foo);
        Y.Assert.isObject(foo.bar);
        Y.Assert.isObject(foo.bar.baz);

        Y.Assert.areSame('#@!&?1', foo.bar.baz.bat_1);
        Y.Assert.areSame('#@!&?2', foo.bar.baz.bat_2);
        Y.Assert.areSame('#@!&?3', foo.bar.baz.bat_3);
    },


    "object can have array": function () {
        var qry = QS( 'foo.bar.baz.bat='+encodeURIComponent('?=@#(1)')
                    +'&foo.bar.baz.bat='+encodeURIComponent('?=@#(2)')
                    +'&foo.bar.baz.bat='+encodeURIComponent('?=@#(3)') );

        var foo = qry.get('foo');

        Y.Assert.isObject(foo);
        Y.Assert.isObject(foo.bar);
        Y.Assert.isObject(foo.bar.baz);
        Y.Assert.isArray(foo.bar.baz.bat);

        Y.ArrayAssert.itemsAreEqual(['?=@#(1)','?=@#(2)','?=@#(3)'], foo.bar.baz.bat);
    },

    "object can have multiple properties": function () {
        var qry = QS( 'foo.bar_1.baz_1.bat='+encodeURIComponent('&%$£~~<1>')
                    +'&foo.bar_1.baz_1.bat='+encodeURIComponent('&%$£~~<2>')

                    +'&foo.bar_1.baz_2.bat='+encodeURIComponent('&%$£~~<3>')
                    +'&foo.bar_1.baz_2.bat='+encodeURIComponent('&%$£~~<4>')

                    +'&foo.bar_2.baz_1.bat='+encodeURIComponent('&%$£~~<5>')
                    +'&foo.bar_2.baz_1.bat='+encodeURIComponent('&%$£~~<6>')

                    +'&foo.bar_2.baz_2.bat='+encodeURIComponent('&%$£~~<7>')
                    +'&foo.bar_2.baz_2.bat='+encodeURIComponent('&%$£~~<8>') );

        var foo = qry.get('foo');

        Y.Assert.isObject( foo                 );

        Y.Assert.isObject( foo.bar_1           );
        Y.Assert.isObject( foo.bar_1.baz_1     );
        Y.Assert.isArray ( foo.bar_1.baz_1.bat );
        Y.Assert.isObject( foo.bar_1.baz_2     );
        Y.Assert.isArray ( foo.bar_1.baz_2.bat );

        Y.Assert.isObject( foo.bar_2           );
        Y.Assert.isObject( foo.bar_2.baz_1     );
        Y.Assert.isArray ( foo.bar_2.baz_1.bat );
        Y.Assert.isObject( foo.bar_2.baz_2     );
        Y.Assert.isArray ( foo.bar_2.baz_2.bat );

        Y.ArrayAssert.itemsAreEqual(['&%$£~~<1>','&%$£~~<2>'], foo.bar_1.baz_1.bat);
        Y.ArrayAssert.itemsAreEqual(['&%$£~~<3>','&%$£~~<4>'], foo.bar_1.baz_2.bat);
        Y.ArrayAssert.itemsAreEqual(['&%$£~~<5>','&%$£~~<6>'], foo.bar_2.baz_1.bat);
        Y.ArrayAssert.itemsAreEqual(['&%$£~~<7>','&%$£~~<8>'], foo.bar_2.baz_2.bat);
    }
}));

Y.Test.Runner.add(suite);

});