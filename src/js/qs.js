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
        get: function (key, def_val) {
            if (qry_obj[key] === undefined) {
                return def_val;
            }
            return decodeURIComponent(qry_obj[key]);
        }
    }
}

NS.QS = QS;