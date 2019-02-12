const Axios = require("axios").default;
import {AppToken} from "./AppToken";

export {AppToken} from "./AppToken";

import {DataCentre, SortDirection} from "./enums";

export {DataCentre, SortDirection} from "./enums";

import {Messages, StatusCode} from "./utils/Constants";

export {Messages, StatusCode} from "./utils/Constants";

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

export class Index {
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

  validateResponse(response): any {
    switch (response.status) {
      case StatusCode.Unauthorised:
        throw new Error(Messages.NotAuthorisedException);
      case StatusCode.NotFound:
        throw new Error(Messages.EntityNotFoundException);
      default:
        return response;
    }

  }

  async createApp(appTitle: string, locations: DataCentre[]) {
    let data = {title: appTitle, locations: locations};
    let response = await this.restClient.post("/apps", data).catch(e => e.response);
    return this.validateResponse(response);
  }

  async deleteApp(appId: string) {
    let response = await this.restClient.delete(`/apps/${appId}`).catch(e => e.response);
    return this.validateResponse(response);
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
    let response = this.restClient.get("/collections", {
      params: {
        appId: appId,
        skip: skip,
        count: count
      }
    }).catch(e => e.response);
    return this.validateResponse(response);
  }

  async getTokens(appId: String, skip: number, count: number) {
    let response = this.restClient.get("/tokens", {
      params: {
        appId: appId,
        skip: skip,
        count: count
      }
    }).catch(e => e.response);
    return this.validateResponse(response);
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
    return this.validateResponse(response);
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

  //todo:what have to be dome if no collection exist
  async getCollection(collectionId: string) {
    let response = await this.restClient.get(`/collections/${collectionId}`).catch(e => e.response);

    this.validateResponse(response);

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
      params: {
        appId: appId
      }
    }).catch(e => e.response);
    return this.validateResponse(response);
  }

  async updateCollection(collectionId: string, collectionData: Collection) {
    let response = await this.restClient.put(`/collections/${collectionId}`, collectionData,).catch(e => e.response);
    return this.validateResponse(response);
  }

  async deleteCollection(collectionId: string) {
    let response = await this.restClient.delete(`/collections/${collectionId}`).catch(e => e.response);
    return this.validateResponse(response);
  }

  async createOrElseGetCollection(appWriteToken: string, appId: string, collectionTitle: string) {
    let collection: any;
    let collectionResponse = await this.createCollection(appId, collectionTitle);
    this.validateResponse(collectionResponse);
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
    this.validateResponse(appResponse);
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
    this.validateResponse(response);
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
      throw new Error(Messages.InvalidSchemaException)
    }
    let response = this.restClient.post(`/collections/${collectionId}/records`, records).catch(e => e.response);
    return this.validateResponse(response);
  }

  async reindexRecords(collectionId: string) {
    let response = this.restClient.post(`/collections/${collectionId}/reindex`).catch(e => e.response);
    return this.validateResponse(response);
  }

  async deleteRecords(collectionId: string, ids: string[]) {
    let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=false`, ids).catch(e => e.response);
    return this.validateResponse(response);
  }

  async clearRecords(collectionId: string) {
    let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=true`).catch(e => e.response);
    return this.validateResponse(response);
  }

}