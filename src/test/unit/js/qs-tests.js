YUI.add('qs-tests', function (Y) {

var suite = new Y.Test.Suite('Query String Tests Suite');

suite.add(new Y.Test.Case({

    name: "QS()",

    "is a global function": function () {
        Y.Assert.isFunction(window.QS);
    }
}));

Y.Test.Runner.add(suite);

});