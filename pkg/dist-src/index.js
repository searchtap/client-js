const Axios = require("axios").default;
import { AppToken } from "./AppToken";
export { AppToken } from "./AppToken";
export { DataCentre, SortDirection } from "./enums";
import { Messages, StatusCode } from "./utils/Constants";
export { Messages, StatusCode } from "./utils/Constants";
export class Index {
    constructor(token) {
        this.userId = token;
        this.restClient = Axios.create({
            baseURL: "http://beta-api.searchtap.net/v2",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    }
    async createApp(appTitle, locations) {
        let data = { title: appTitle, locations: locations };
        let response = await this.restClient.post("/apps", data).catch(e => e.response);
        return response;
    }
    async deleteApp(appId) {
        let response = await this.restClient.delete(`/apps/${appId}`).catch(e => e.response);
        return response;
    }
    async getApps(skip, count) {
        return this.restClient.get("/apps", {
            params: {
                skip: skip,
                count: count
            }
        }).catch(e => e.response);
    }
    async getCollections(appId, skip, count) {
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
    async getTokens(appId, skip, count) {
        return this.restClient.get("/tokens", {
            params: {
                appId: appId,
                skip: skip,
                count: count
            }
        }).catch(e => e.response);
    }
    async getAppByTitle(appTitle) {
        let skip = 0;
        let pageSize = 50;
        let response = await this.getApps(skip, pageSize);
        while (response.data.count >= skip * pageSize) {
            let responseData = response.data.data;
            let app = responseData.find(x => x.title === appTitle);
            if (app)
                return app;
            response = await this.getApps(++skip, pageSize);
        }
    }
    async getCollectionByTitle(appId, collectionTitle) {
        let skip = 0;
        let pageSize = 50;
        let response = await this.getCollections(appId, skip, pageSize);
        while (response.data.count >= skip * pageSize) {
            let responseData = response.data.data;
            let collection = responseData.find(x => x.title === collectionTitle);
            if (collection)
                return collection;
            response = await this.getCollections(appId, ++skip, pageSize);
        }
        return null;
    }
    async getCollection(collectionId) {
        let response = await this.restClient.get(`/collections/${collectionId}`, {
        // headers: {
        //   "Authorization": "Bearer " + appWriteToken
        // }
        }).catch(e => e.response);
        if (response.status === 200)
            return response.data;
        return null;
    }
    async createCollection(appId, collectionData) {
        let data = collectionData.title == undefined ?
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
    async updateCollection(collectionId, collectionData) {
        let response = await this.restClient.put(`/collections/${collectionId}`, collectionData, {
        // headers: {
        //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
        // }
        }).catch(e => e.response);
        return response;
    }
    async deleteCollection(collectionId) {
        let response = await this.restClient.delete(`/collections/${collectionId}`, {
        // headers: {
        //   "Authorization": "Bearer " + "CN3FDVSEIA1D2MX812BDLQVC"
        // }
        }).catch(e => e.response);
        return response;
    }
    async createOrElseGetCollection(appWriteToken, appId, collectionTitle) {
        let collection;
        let collectionResponse = await this.createCollection(appId, collectionTitle);
        if (collectionResponse.status === StatusCode.Ok) {
            collection = collectionResponse.data;
        }
        else if (collectionResponse.status === StatusCode.BadRequest && collectionResponse.data.message === Messages.CollectionExists) {
            collection = await this.getCollectionByTitle(appId, collectionTitle);
        }
        return collection;
    }
    async createOrElseGetApp(appTitle, locations) {
        let app;
        let appResponse = await this.createApp(appTitle, locations);
        if (appResponse.status === StatusCode.Ok) {
            app = appResponse.data;
        }
        else if (appResponse.status === StatusCode.Conflict && appResponse.data.message === Messages.DuplicateAppName) {
            app = await this.getAppByTitle(appTitle);
        }
        return app;
    }
    async getAllToken(appId) {
        let skip = 0;
        let pageSize = 50;
        let response = await this.getTokens(appId, skip, pageSize);
        let tokens = [];
        while (response.data.count >= skip * pageSize) {
            let responseData = response.data.data;
            tokens.push(...responseData);
            response = await this.getTokens(appId, ++skip, pageSize);
        }
        return tokens;
    }
    async getWriteToken(appId) {
        let tokens = await this.getAllToken(appId);
        let appWriteToken = tokens ? tokens.find(x => x.title === AppToken.appWriteToken) : undefined;
        return appWriteToken;
    }
    async addRecords(collectionId, records) {
        if (records.some(x => !x.id)) {
        }
        let response = this.restClient.post(`/collections/${collectionId}/records`, records).catch(e => e.response);
        return response;
    }
    async reindexRecords(collectionId) {
        let response = this.restClient.post(`/collections/${collectionId}/reindex`).catch(e => e.response);
        return response;
    }
    async deleteRecords(collectionId, ids) {
        let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=false`, ids).catch(e => e.response);
        return response;
    }
    async clearRecords(collectionId) {
        let response = this.restClient.delete(`/collections/${collectionId}/records?isClear=true`).catch(e => e.response);
        return response;
    }
}
