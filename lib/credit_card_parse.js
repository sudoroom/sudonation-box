
module.exports = function(str) {

    var m = str.match(/%?B(\d{16})\^([^\^]+)\^(\d{2})(\d{2})/);
    if(!m) {
        return null;
    }

    return {
        number: m[1],
        name: m[2],
        exp_year: parseInt(m[3]),
        exp_month: parseInt(m[4])
    }
};
