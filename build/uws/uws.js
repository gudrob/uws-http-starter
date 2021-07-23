"use strict";
module.exports = (() => {
    try {
        return require('./uws_' + process.platform + '_' + process.arch + '_' + process.versions.modules + '.node');
    }
    catch (e) {
        throw new Error('This version of µWS is not compatible with your Node.js build:\n\n' + e.toString());
    }
})();
