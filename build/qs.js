(function (NS) {

/**
@private
@param {Object} pair
@param {Object} obj
**/
function merge_into_object(pair, obj) {
    var key = pair.key,
        subkey;

    if (key.indexOf('.')>0) {
        subkey = key.substr(key.indexOf('.')+1);
        key    = key.substr(0, key.indexOf('.'));
    }

    if (obj[key] === undefined) {
        if (!subkey) {
            obj[key] = decodeURIComponent(pair.value);
        } else {
            obj[key] = {};
            merge_into_object({ key: subkey, value: pair.value }, obj[key]);
        }
    } else if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
        if (!subkey) {
            obj[key] = [ obj[key] ];
            obj[key].push( decodeURIComponent(pair.value) );
        }
    } else if (Array.isArray(obj[key])) {
        if (!subkey) {
            obj[key].push( decodeURIComponent(pair.value) );
        }
    // assume object
    } else {
        if (!subkey) {
            obj[key] = decodeURIComponent( pair.value );
        } else {
            merge_into_object({ key: subkey, value: pair.value }, obj[key]);
        }
    }
}

function split_pairs(qstr, psep, vsep) {
    return qstr.split(psep).map(function (pair) {
        pair = pair.split(vsep);
        return { key: pair[0], value: pair[1] };
    });
}

function merge_pairs_into_object(pairs) {
    var obj =  {};
    pairs.forEach(function (pair) {
        merge_into_object(pair, obj);
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

    qstr = qstr === undefined || qstr === null ? document.location.search.substr(1) : qstr;
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
            return qry_obj[key];
        }
    };
}

NS.QS = QS;

})(window);