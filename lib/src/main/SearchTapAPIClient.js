"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DataCentre;
(function (DataCentre) {
    DataCentre[DataCentre["IN_1"] = 1000] = "IN_1";
    DataCentre[DataCentre["US_1"] = 2000] = "US_1";
    DataCentre[DataCentre["US_2"] = 2100] = "US_2";
    DataCentre[DataCentre["AU_1"] = 4000] = "AU_1";
})(DataCentre = exports.DataCentre || (exports.DataCentre = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = 2] = "Descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var Messages = /** @class */ (function () {
    function Messages() {
    }
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
    return Messages;
}());
exports.Messages = Messages;
var StatusCode = /** @class */ (function () {
    function StatusCode() {
    }
    StatusCode.Ok = 200;
    StatusCode.BadRequest = 400;
    StatusCode.InternalServerError = 500;
    StatusCode.NotFound = 404;
    StatusCode.Created = 201;
    StatusCode.Unauthorised = 401;
    StatusCode.Conflict = 409;
    return StatusCode;
}());
exports.StatusCode = StatusCode;
var AppToken = /** @class */ (function () {
    function AppToken() {
    }
    AppToken.appReadToken = "App Read Token";
    AppToken.appWriteToken = "App Write Token";
    return AppToken;
}());
exports.AppToken = AppToken;
var SearchTapAPIClient = /** @class */ (function () {
    function SearchTapAPIClient(token) {
        this.userId = token;
        this.restClient = axios_1.default.create({
            baseURL: "http://beta-api.searchtap.net/v2",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }
    SearchTapAPIClient.prototype.createApp = function (appTitle, locations) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = { title: appTitle, locations: locations };
                        return [4 /*yield*/, this.restClient.post("/apps", data).catch(function (e) { return e.response; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.deleteApp = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.delete("/apps/" + appId).catch(function (e) { return e.response; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.getApps = function (skip, count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.restClient.get("/apps", {
                        params: {
                            skip: skip,
                            count: count
                        }
                    }).catch(function (e) { return e.response; })];
            });
        });
    };
    SearchTapAPIClient.prototype.getCollections = function (appId, skip, count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.restClient.get("/collections", {
                        // headers: {
                        //   "Authorization": "Bearer " + appWriteToken
                        // },
                        params: {
                            appId: appId,
                            skip: skip,
                            count: count
                        }
                    }).catch(function (e) { return e.response; })];
            });
        });
    };
    SearchTapAPIClient.prototype.getTokens = function (appId, skip, count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.restClient.get("/tokens", {
                        params: {
                            appId: appId,
                            skip: skip,
                            count: count
                        }
                    }).catch(function (e) { return e.response; })];
            });
        });
    };
    SearchTapAPIClient.prototype.getAppByTitle = function (appTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, pageSize, response, responseData, app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = 0;
                        pageSize = 50;
                        return [4 /*yield*/, this.getApps(skip, pageSize)];
                    case 1:
                        response = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(response.data.count >= skip * pageSize)) return [3 /*break*/, 4];
                        responseData = response.data.data;
                        app = responseData.find(function (x) { return x.title === appTitle; });
                        if (app)
                            return [2 /*return*/, app];
                        return [4 /*yield*/, this.getApps(++skip, pageSize)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.getCollectionByTitle = function (appId, collectionTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, pageSize, response, responseData, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = 0;
                        pageSize = 50;
                        return [4 /*yield*/, this.getCollections(appId, skip, pageSize)];
                    case 1:
                        response = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(response.data.count >= skip * pageSize)) return [3 /*break*/, 4];
                        responseData = response.data.data;
                        collection = responseData.find(function (x) { return x.title === collectionTitle; });
                        if (collection)
                            return [2 /*return*/, collection];
                        return [4 /*yield*/, this.getCollections(appId, ++skip, pageSize)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.getCollection = function (collectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.get("/collections/" + collectionId, {
                        // headers: {
                        //   "Authorization": "Bearer " + appWriteToken
                        // }
                        }).catch(function (e) { return e.response; })];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200)
                            return [2 /*return*/, response.data];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.createCollection = function (appWriteToken, appId, collectionData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = collectionData.title == undefined ?
                            {
                                title: collectionData,
                                appId: appId
                            } : collectionData;
                        return [4 /*yield*/, this.restClient.post("/collections", data, {
                                headers: {
                                    "Authorization": "Bearer " + appWriteToken
                                },
                                params: {
                                    appId: appId
                                }
                            }).catch(function (e) { return e.response; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.deleteCollection = function (appWriteToken, collectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restClient.delete("/collections/" + collectionId, {
                            headers: {
                                "Authorization": "Bearer " + appWriteToken
                            }
                        }).catch(function (e) { return e.response; })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.createOrElseGetCollection = function (appWriteToken, appId, collectionTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, collectionResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createCollection(appWriteToken, appId, collectionTitle)];
                    case 1:
                        collectionResponse = _a.sent();
                        if (!(collectionResponse.status === StatusCode.Ok)) return [3 /*break*/, 2];
                        collection = collectionResponse.data;
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(collectionResponse.status === StatusCode.BadRequest && collectionResponse.data.message === Messages.CollectionExists)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCollectionByTitle(appWriteToken, appId, collectionTitle)];
                    case 3:
                        collection = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, collection];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.createOrElseGetApp = function (appTitle, locations) {
        return __awaiter(this, void 0, void 0, function () {
            var app, appResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createApp(appTitle, locations)];
                    case 1:
                        appResponse = _a.sent();
                        if (!(appResponse.status === StatusCode.Ok)) return [3 /*break*/, 2];
                        app = appResponse.data;
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(appResponse.status === StatusCode.Conflict && appResponse.data.message === Messages.DuplicateAppName)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getAppByTitle(appTitle)];
                    case 3:
                        app = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, app];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.getAllToken = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, pageSize, response, tokens, responseData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = 0;
                        pageSize = 50;
                        return [4 /*yield*/, this.getTokens(appId, skip, pageSize)];
                    case 1:
                        response = _a.sent();
                        tokens = [];
                        _a.label = 2;
                    case 2:
                        if (!(response.data.count >= skip * pageSize)) return [3 /*break*/, 4];
                        responseData = response.data.data;
                        tokens.push.apply(tokens, responseData);
                        return [4 /*yield*/, this.getTokens(appId, ++skip, pageSize)];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, tokens];
                }
            });
        });
    };
    SearchTapAPIClient.prototype.getWriteToken = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, appWriteToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllToken(appId)];
                    case 1:
                        tokens = _a.sent();
                        appWriteToken = tokens ? tokens.find(function (x) { return x.title === AppToken.appWriteToken; }) : undefined;
                        return [2 /*return*/, appWriteToken];
                }
            });
        });
    };
    return SearchTapAPIClient;
}());
exports.SearchTapAPIClient = SearchTapAPIClient;
//# sourceMappingURL=SearchTapAPIClient.js.map