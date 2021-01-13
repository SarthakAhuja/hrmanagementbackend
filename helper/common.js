// const async = require('async');
// var app = require('../../server/server');
// const serverConfig = require('../helper/server-config');
// const customMessage = require('../helper/message');
// const loopback = require('loopback');


module.exports = {

  checkValue: function (data) {
    if (data === "" || data === undefined || data === null) return true;
    else false;
  },

  checkPhoneNumber: function (inputtxt) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if ((inputtxt.match(phoneno))) {
      return true;
    } else {
      return false;
    }
  },

  CheckValidateEmail: function (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    } else {
      return false;
    }
  },
  
}