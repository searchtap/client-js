import Axios from "axios";

export enum DataCentre {
  IN_1 = 1000,
  US_1 = 2000,
  US_2 = 2100,
  AU_1 = 4000
}

export class Messages {
  static CollectionExists = "A collection with same name exists for the App";
  static InvalidCollectionData = "The collection data is invalid";
  static InvalidAppData = "The app data is invalid";
  static EntityNotFound = "The Entity for given Id was not found";
  static EmptyCollectionData = "The collection data was empty.";
  static DataLimitExceeded = "Collection data limit exceeded.";
  static EmptyArray = "Body of the array is empty";
  static InvalidSynonymData = "The synonym data was invalid";
  static BadRequest = "Bad request";
  static InvalidCollection = "Invalid Collection";
  static DuplicateUser = "This email is already registered, try signing in.";
  static UserCredentialsFailure = "Username and Password do not match";
  static SchedulerAlreadyInit = "Job Scheduler is already init, ignoring init";
  static ApiUnauthorised = "Not Allowed to access this resource";
  static PasswordError = "Old password cannot be same as new password";
  static DuplicateAppName = "App with same name already exists";
}

export class StatusCode {
  static Ok = 200;
  static BadRequest = 400;
  static InternalServerError = 500;
  static NotFound = 404;
  static Created = 201;
  static Unauthorised = 401;
  static Conflict = 409;
}


export class AppToken {
  static appReadToken = "App Read Token";
  static appWriteToken = "App Write Token";
}

export class SearchTapAPIClient {
  protected userId: String;
  protected restClient;

  constructor(token: String) {
    this.userId = token;
    this.restClient = Axios.create({
      baseURL: "https://manage.searchtap.net/v2",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
  }

  async createApp(appTitle: string, locations: DataCentre[]) {
    let data = {title: appTitle, locations: locations};
    let response = await this.restClient.post("/apps", data).catch(e => e.response);
    return response;
  }

  async getApps(skip: number, count: number) {
    return this.restClient.get("/apps", {
      params: {
        skip: skip,
        count: count
      }
    }).catch(e => e.response);
  }

  async getCollections(appWriteToken: string, appId: String, skip: number, count: number) {
    return this.restClient.get("/collections", {
      headers: {
        "Authorization": "Bearer " + appWriteToken
      },
      params: {
        appId: appId,
        skip: skip,
        count: count
      }
    }).catch(e => e.response);
  }

  async getTokens(appId: String, skip: number, count: number) {
    return this.restClient.get("/tokens", {
      params: {
        appId: appId,
        skip: skip,
        count: count
      }
    }).catch(e => e.response);
  }

  async getAppByTitle(appTitle: String) {
    let skip = 0;
    let pageSize = 50;
    let response = await this.getApps(skip, pageSize);
    while (response.data.count >= skip * pageSize) {
      let responseData = response.data.data;
      let app = responseData.find(x => x.title === appTitle);
      if (app)
        return app;
      response = await this.getApps(++skip, pageSize)
    }
  }

  async getCollectionByTitle(appWriteToken: string, appId: String, collectionTitle: string) {
    let skip = 0;
    let pageSize = 50;
    let response = await this.getCollections(appWriteToken, appId, skip, pageSize);
    while (response.data.count >= skip * pageSize) {
      let responseData = response.data.data;
      let collection = responseData.find(x => x.title === collectionTitle);
      if (collection)
        return collection;
      response = await this.getCollections(appWriteToken, appId, ++skip, pageSize)
    }
  }

  async createCollection(appWriteToken: string, appId: String, collectionTitle: string) {
    let data = {
      title: collectionTitle,
      appId: appId
    };
    let response = await this.restClient.post("/collections", data, {
      headers: {
        "Authorization": "Bearer " + appWriteToken
      },
      params: {
        appId: appId
      }
    }).catch(e => e.response);
    return response;
  }

  async createOrElseGetCollection(appWriteToken: string, appId: string, collectionTitle: string) {
    let collection: any;
    let collectionResponse = await this.createCollection(appWriteToken, appId, collectionTitle);

    if (collectionResponse.status === StatusCode.Ok) {
      collection = collectionResponse.data;
    }
    else if (collectionResponse.status === StatusCode.BadRequest && collectionResponse.data.message === Messages.CollectionExists) {
      collection = await this.getCollectionByTitle(appWriteToken, appId, collectionTitle)
    }
    return collection;
  }

  async createOrElseGetApp(appTitle: string, locations: DataCentre[]) {
    let app: any;
    let appResponse = await this.createApp(appTitle, locations);

    if (appResponse.status === StatusCode.Ok) {
      app = appResponse.data;
    }
    else if (appResponse.status === StatusCode.Conflict && appResponse.data.message === Messages.DuplicateAppName) {
      app = await this.getAppByTitle(appTitle)
    }
    return app;
  }


  async getAllToken(appId: string) {
    let skip = 0;
    let pageSize = 50;
    let response = await this.getTokens(appId, skip, pageSize);
    let tokens: any[] = [];
    while (response.data.count >= skip * pageSize) {
      let responseData = response.data.data;
      tokens.push(...responseData);
      response = await this.getTokens(appId, ++skip, pageSize)
    }
    return tokens;

  }

}