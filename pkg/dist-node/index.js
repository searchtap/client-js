'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

class AppToken {}
AppToken.appReadToken = "App Read Token";
AppToken.appWriteToken = "App Write Token";

(function (DataCentre) {
  DataCentre[DataCentre["IN_1"] = 1000] = "IN_1";
  DataCentre[DataCentre["US_1"] = 2000] = "US_1";
  DataCentre[DataCentre["US_2"] = 2100] = "US_2";
  DataCentre[DataCentre["AU_1"] = 4000] = "AU_1";
})(exports.DataCentre || (exports.DataCentre = {}));

(function (SortDirection) {
  SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
  SortDirection[SortDirection["Descending"] = 2] = "Descending";
})(exports.SortDirection || (exports.SortDirection = {}));

class Messages {}
Messages.CollectionExists = "A collection with same name exists for the App";
Messages.InvalidCollectionData = "The collection data is invalid";
Messages.InvalidAppData = "The app data is invalid";
Messages.EntityNotFound = "The Entity for given Id was not found";
Messages.EmptyCollectionData = "The collection data was empty.";
Messages.DataLimitExceeded = "Collection data limit exceeded.";
Messages.EmptyArray = "Body of the array is empty";
Messages.InvalidSynonymData = "The synonym data was invalid";
Messages.BadRequest = "Bad request";
Messages.InvalidCollection = "Invalid Collection";
Messages.DuplicateUser = "This email is already registered, try signing in.";
Messages.UserCredentialsFailure = "Username and Password do not match";
Messages.SchedulerAlreadyInit = "Job Scheduler is already init, ignoring init";
Messages.ApiUnauthorised = "Not Allowed to access this resource";
Messages.PasswordError = "Old password cannot be same as new password";
Messages.DuplicateAppName = "App with same name already exists";
class StatusCode {}
StatusCode.Ok = 200;
StatusCode.BadRequest = 400;
StatusCode.InternalServerError = 500;
StatusCode.NotFound = 404;
StatusCode.Created = 201;
StatusCode.Unauthorised = 401;
StatusCode.Conflict = 409;

const Axios = require("axios").default;
class Index {
  constructor(token) {
    this.userId = token;
    this.restClient = Axios.create({
      baseURL: "http://beta-api.searchtap.net/v2",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
  }

  createApp(appTitle, locations) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = {
        title: appTitle,
        locations: locations
      };
      let response = yield _this.restClient.post("/apps", data).catch(e => e.response);
      return response;
    })();
  }

  deleteApp(appId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let response = yield _this2.restClient.delete(`/apps/${appId}`).catch(e => e.response);
      return response;
    })();
  }

  getApps(skip, count) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3.restClient.get("/apps", {
        params: {
          skip: skip,
          count: count
        }
      }).catch(e => e.response);
    })();
  }

  getCollections(appId, skip, count) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return _this4.restClient.get("/collections", {
        // headers: {
        //   "Authorization": "Bearer " + appWriteToken
        // },
        params: {
          appId: appId,
          skip: skip,
          count: count
        }
      }).catch(e => e.response);
    })();
  }

  getTokens(appId, skip, count) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return _this5.restClient.get("/tokens", {
        params: {
          appId: appId,
          skip: skip,
          count: count
        }
      }).catch(e => e.response);
    })();
  }

  getAppByTitle(appTitle) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      let skip = 0;
      let pageSize = 50;
      let response = yield _this6.getApps(skip, pageSize);

      while (response.data.count >= skip * pageSize) {
        let responseData = response.data.data;
        let app = responseData.find(x => x.title === appTitle);
        if (app) return app;
        response = yield _this6.getApps(++skip, pageSize);
      }
    })();
  }

  getCollectionByTitle(appId, collectionTitle) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      let skip = 0;
      let pageSize = 50;
      let response = yield _this7.getCollections(appId, skip, pageSize);

      while (response.data.count >= skip * pageSize) {
        let responseData = response.data.data;
        let collection = responseData.find(x => x.title === collectionTitle);
        if (collection) return collection;
        response = yield _this7.getCollections(appId, ++skip, pageSize);
      }

      return null;
    })();
  }

  getCollection(collectionId) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      let response = yield _this8.restClient.get(`/collections/${collectionId}`, {// headers: {
        //   "Authorization": "Bearer " + appWriteToken
        // }
      }).catch(e => e.response);
      if (response.status === 200) return response.data;
      return null;
    })();
  }

  createCollection(appId, collectionData) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      let data = collectionData.title == undefined ? {
        title: collectionData,
        appId: appId
      } : collectionData;
      let response = yield _this9.restClient.post("/collections", data, {
        // headers: {
        //   "Authorization": "Bearer " + "PNWDFXFHMWK4EAWMS8NUE45L"
        // },
        params: {
          appId: appId
        }
      }).catch(e => e.response);
      return response;
    })();
  }

  updateCollection(collectionId, collectionData) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      let response = yield _this10.restClient.put(`/collections/${collectionId}`, collectionData, {// headers: {
        //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
        // }
      }).catch(e => e.response);
      return response;
    })();
  }

  deleteCollection(collectionId) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      let response = yield _this11.restClient.delete(`/collections/${collectionId}`, {// headers: {
        //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
        // }
      }).catch(e => e.response);
      return response;
    })();
  }

  createOrElseGetCollection(appWriteToken, appId, collectionTitle) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      let collection;
      let collectionResponse = yield _this12.createCollection(appId, collectionTitle);

      if (collectionResponse.status === StatusCode.Ok) {
        collection = collectionResponse.data;
      } else if (collectionResponse.status === StatusCode.BadRequest && collectionResponse.data.message === Messages.CollectionExists) {
        collection = yield _this12.getCollectionByTitle(appId, collectionTitle);
      }

      return collection;
    })();
  }

  createOrElseGetApp(appTitle, locations) {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      let app;
      let appResponse = yield _this13.createApp(appTitle, locations);

      if (appResponse.status === StatusCode.Ok) {
        app = appResponse.data;
      } else if (appResponse.status === StatusCode.Conflict && appResponse.data.message === Messages.DuplicateAppName) {
        app = yield _this13.getAppByTitle(appTitle);
      }

      return app;
    })();
  }

  getAllToken(appId) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      let skip = 0;
      let pageSize = 50;
      let response = yield _this14.getTokens(appId, skip, pageSize);
      let tokens = [];

      while (response.data.count >= skip * pageSize) {
        let responseData = response.data.data;
        tokens.push(...responseData);
        response = yield _this14.getTokens(appId, ++skip, pageSize);
      }

      return tokens;
    })();
  }

  getWriteToken(appId) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      let tokens = yield _this15.getAllToken(appId);
      let appWriteToken = tokens ? tokens.find(x => x.title === AppToken.appWriteToken) : undefined;
      return appWriteToken;
    })();
  }

  addRecords(collectionId, records) {
    var _this16 = this;

    return _asyncToGenerator(function* () {
      if (records.some(x => !x.id)) ;

      let response = _this16.restClient.post(`/collections/${collectionId}/records`, records).catch(e => e.response);

      return response;
    })();
  }

  reindexRecords(collectionId) {
    var _this17 = this;

    return _asyncToGenerator(function* () {
      let response = _this17.restClient.post(`/collections/${collectionId}/reindex`).catch(e => e.response);

      return response;
    })();
  }

  deleteRecords(collectionId, ids) {
    var _this18 = this;

    return _asyncToGenerator(function* () {
      let response = _this18.restClient.delete(`/collections/${collectionId}/records?isClear=false`, ids).catch(e => e.response);

      return response;
    })();
  }

  clearRecords(collectionId) {
    var _this19 = this;

    return _asyncToGenerator(function* () {
      let response = _this19.restClient.delete(`/collections/${collectionId}/records?isClear=true`).catch(e => e.response);

      return response;
    })();
  }

}

exports.Index = Index;
exports.AppToken = AppToken;
exports.Messages = Messages;
exports.StatusCode = StatusCode;
