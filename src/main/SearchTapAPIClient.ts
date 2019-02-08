import Axios from "axios";

export enum DataCentre {
  IN_1 = 1000,
  US_1 = 2000,
  US_2 = 2100,
  AU_1 = 4000
}

export enum SortDirection {
  Ascending = 1,
  Descending = 2
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

declare type Collection = {
  title: string,
  indexFields?: string[],
  searchFields?: string[],
  sortDirection?: SortDirection,//=	SortDirection.Descending
  stopWordEnabled?: boolean, //true
  stemmingEnabled?: boolean, //true
  pluralsEnabled?: boolean, //false
  minCharsTypoTolerance?: number, //  4
  textFacetFields?: string[],
  numericFacetFields?: string[],//  empty
  maxFacetCount?: number,//  100
  pageSize?: number, // 50
  maxFetchCount?: number, //1000
  whitelistedFields?: string[], //empty
}

export class SearchTapAPIClient {
  protected userId: String;
  protected restClient;

  constructor(token: String) {
    this.userId = token;
    this.restClient = Axios.create({
      baseURL: "http://beta-api.searchtap.net/v2",
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

  async deleteApp(appId: string) {
    let response = await this.restClient.delete(`/apps/${appId}`).catch(e => e.response);
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

  async getCollections(appId: String, skip: number, count: number) {
    return this.restClient.get("/collections", {
      // headers: {
      //   "Authorization": "Bearer " + appWriteToken
      // },
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

  async getCollectionByTitle(appId: String, collectionTitle: string) {
    let skip = 0;
    let pageSize = 50;
    let response = await this.getCollections(appId, skip, pageSize);
    while (response.data.count >= skip * pageSize) {
      let responseData = response.data.data;
      let collection = responseData.find(x => x.title === collectionTitle);
      if (collection)
        return collection;
      response = await this.getCollections(appId, ++skip, pageSize)
    }
    return null;
  }

  async getCollection(collectionId: string) {
    let response = await this.restClient.get(`/collections/${collectionId}`, {
      // headers: {
      //   "Authorization": "Bearer " + appWriteToken
      // }
    }).catch(e => e.response);
    if (response.status === 200)
      return response.data;

    return null;
  }

  async createCollection(appId: String, collectionData: string | Collection) {
    let data = (<Collection>collectionData).title == undefined ?
      {
        title: collectionData,
        appId: appId
      } : collectionData;
    let response = await this.restClient.post("/collections", data, {
      // headers: {
      //   "Authorization": "Bearer " + "PNWDFXFHMWK4EAWMS8NUE45L"
      // },
      params: {
        appId: appId
      }
    }).catch(e => e.response);
    return response;
  }

  async updateCollection(collectionId: string, collectionData: Collection) {
    let response = await this.restClient.put(`/collections/${collectionId}`, collectionData, {
      // headers: {
      //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
      // }
    }).catch(e => e.response);
    return response;
  }

  async deleteCollection(collectionId: string) {
    let response = await this.restClient.delete(`/collections/${collectionId}`, {
      // headers: {
      //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
      // }
    }).catch(e => e.response);
    return response;
  }

  async createOrElseGetCollection(appWriteToken: string, appId: string, collectionTitle: string) {
    let collection: any;
    let collectionResponse = await this.createCollection(appId, collectionTitle);

    if (collectionResponse.status === StatusCode.Ok) {
      collection = collectionResponse.data;
    }
    else if (collectionResponse.status === StatusCode.BadRequest && collectionResponse.data.message === Messages.CollectionExists) {
      collection = await this.getCollectionByTitle(appId, collectionTitle)
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

  async getWriteToken(appId: string): Promise<any> {
    let tokens = await this.getAllToken(appId);
    let appWriteToken = tokens ? tokens.find(x => x.title === AppToken.appWriteToken) : undefined;
    return appWriteToken;
  }

  async addRecords(collectionId: string, records: { id: string, [props: string]: any }[]) {
    if (records.some(x => !x.id)) {

    }
    let response = this.restClient.post(`/collections/${collectionId}/records`, records).catch(e => e.response);
    return response;
  }

  async reindexRecords(collectionId: string) {
    let response = this.restClient.post(`/collections/${collectionId}/reindex`).catch(e => e.response);
    return response;
  }

  async deleteRecords(collectionId: string, ids: string[]) {
    let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=false`, ids).catch(e => e.response);
    return response;
  }
  async clearRecords(collectionId: string) {
    let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=true`).catch(e => e.response);
    return response;
  }

}