(function(root) {
  'use strict';

  var VALID_WORKERS_CHANGE_EVENT = "VALID_WORKERS_CHANGE_EVENT";
  var _validWorkers = [];

  var _resetValidWorkers = function(workers) {
    _validWorkers = workers;
    WorkerUserStore.emit(VALID_WORKERS_CHANGE_EVENT);
  };

  var CURRENT_USER_DETAILS_CHANGE_EVENT = "CURRENT_USER_DETAILS_CHANGE_EVENT";
  var _workTimes = {};
  var _bio = "";
  var _flashProfile = "";

  var _resetCurrentUserDetails = function(details) {
    _bio = details.bio;
    _workTimes = details.work_times;
    WorkerUserStore.emit(CURRENT_USER_DETAILS_CHANGE_EVENT);
  };

  // NOTE: just do this in Jbuilder
  // var _formatDetailsArrayToPOJO = function (work_times) {
  //   var _formattedDetails = {};
  //   work_times.forEach(function(work_time) {
  //     _formattedDetails.work_time =  _formattedDetails.work_time || {};
  //     _formattedDetails(work_time.day)
  //   });
  // };

  // NOTE: go back to this if decide to implement flash like system
  // var _flashProfileUpdateOK = function() {
  //
  // };

  var _clearFlash = function() { _flashProfile = ""; };

  var WorkerUserStore = root.WorkerUserStore = $.extend({}, EventEmitter.prototype, {
    all: function() {
      return _validWorkers.slice();
    },

    getBio: function() {
      return _bio;
    },

    getWorkTimes: function() {
      // NOTE: WARNING: this returns a pointer to this private store variable
      // NOTE: Ideally, want to return a deep duplication of this object if have
      // NOTE: time to make it
      return _workTimes;
    },

    addChangeListener: function(callback) {
      this.on(VALID_WORKERS_CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(VALID_WORKERS_CHANGE_EVENT, callback);
    },

    addCurrentUserChangeListener: function(callback) {
      this.on(CURRENT_USER_DETAILS_CHANGE_EVENT, callback);
    },

    removeCurrentUserChangeListener: function(callback) {
      this.removeListener(CURRENT_USER_DETAILS_CHANGE_EVENT, callback);
    },

    dispatcherId: root.AppDispatcher.register(function(payload) {
      switch (payload.actionType) {
        case root.UserConstants.VALID_WORKERS_RECEIVED:
          _resetValidWorkers(payload.action);
          break;
        case root.UserConstants.CURRENT_USER_DETAILS_RECEIVED:
          _resetCurrentUserDetails(payload.action);
          break;

        // NOTE: these two methods are getting replaced by a CURRENT_USER_DETAILS_RECEIVED
        // case root.UserConstants.USER_BIO_RECEIVED:
        //   _receiveBio(payload.action);
        //   break;
        // case root.UserConstants.USER_WORK_TIMES_UPDATED:
        //   _resetWorkTimes(payload.action);
        //   break;


        // NOTE: having second thoughts about making a flash action...
        // case root.FlashConstants.PROFILE_FORM_OK:
        //   _flashProfileUpdateOK();
        //   break;
      }
    })

  });
}(this));
