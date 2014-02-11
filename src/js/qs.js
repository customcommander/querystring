function split_pairs(qstr, psep, vsep) {
    return qstr.split(psep).map(function (pair) {
        pair = pair.split(vsep);
        return { key: pair[0], value: pair[1] };
    });
}

function merge_pairs_into_object(pairs) {
    var obj =  {};
    pairs.forEach(function (pair) {
        obj[pair.key] = pair.value;
    });
    return obj;
}

/**
 * Parse or build a query string.
 *
 * @example
 *      // By default, QueryString will use the document url
 *      // e.g. http://foo.bar?hello=word
 *      var qry = QS();
 *
 * @example
 *      // Or you can supply your own query string
 *      var qry = QS('a=1&b=2');
 *
 * @class QS
 * @constructor
 * @param {String} [qstr] The query string. Default to the current query string.
 * @param {String} [psep] Parameter separator. Default to '&'.
 * @param {String} [vsep] Value separator. Default to '='.
 */
function QS(qstr, psep, vsep) {

    var qry_obj = {};

    qstr = typeof qstr === 'undefined' ? document.location.search.substr(1) : qstr;
    psep = psep === undefined || psep === null ? '&' : psep;
    vsep = vsep === undefined || vsep === null ? '=' : vsep;

    if (typeof qstr === 'string' && qstr) {
        qry_obj = merge_pairs_into_object(split_pairs(qstr, psep, vsep));
    }

    return {

        /**
         * Returns the value of given parameter.
         *
         * @example
         *      // http://foo.bar?hello=world
         *      var qry = QS();
         *      qry.get('hello'); // world
         *
         * @example
         *      var qry = QS('a=1');
         *      qry.get('a'); // 1
         *
         * @method get
         * @for QS
         * @param {String} key Name of the parameter to get.
         * @param {Any} [def_val] Default value to return should the parameter not be found.
         * @return {Any} The parameter value or the default value (`def_val`) or `undefined`.
         */
        get: function (key, def_val) {
            if (qry_obj[key] === undefined) {
                return def_val;
            }
            return decodeURIComponent(qry_obj[key]);
        }
    }
}

NS.QS = QS;