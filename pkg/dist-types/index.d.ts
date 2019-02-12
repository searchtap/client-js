export { AppToken } from "./AppToken";
import { DataCentre, SortDirection } from "./enums";
export { DataCentre, SortDirection } from "./enums";
export { Messages, StatusCode } from "./utils/Constants";
declare type Collection = {
    title: string;
    indexFields?: string[];
    searchFields?: string[];
    sortDirection?: SortDirection;
    stopWordEnabled?: boolean;
    stemmingEnabled?: boolean;
    pluralsEnabled?: boolean;
    minCharsTypoTolerance?: number;
    textFacetFields?: string[];
    numericFacetFields?: string[];
    maxFacetCount?: number;
    pageSize?: number;
    maxFetchCount?: number;
    whitelistedFields?: string[];
};
export declare class Index {
    protected userId: String;
    protected restClient: any;
    constructor(token: String);
    createApp(appTitle: string, locations: DataCentre[]): Promise<any>;
    deleteApp(appId: string): Promise<any>;
    getApps(skip: number, count: number): Promise<any>;
    getCollections(appId: String, skip: number, count: number): Promise<any>;
    getTokens(appId: String, skip: number, count: number): Promise<any>;
    getAppByTitle(appTitle: String): Promise<any>;
    getCollectionByTitle(appId: String, collectionTitle: string): Promise<any>;
    getCollection(collectionId: string): Promise<any>;
    createCollection(appId: String, collectionData: string | Collection): Promise<any>;
    updateCollection(collectionId: string, collectionData: Collection): Promise<any>;
    deleteCollection(collectionId: string): Promise<any>;
    createOrElseGetCollection(appWriteToken: string, appId: string, collectionTitle: string): Promise<any>;
    createOrElseGetApp(appTitle: string, locations: DataCentre[]): Promise<any>;
    getAllToken(appId: string): Promise<any[]>;
    getWriteToken(appId: string): Promise<any>;
    addRecords(collectionId: string, records: {
        id: string;
        [props: string]: any;
    }[]): Promise<any>;
    reindexRecords(collectionId: string): Promise<any>;
    deleteRecords(collectionId: string, ids: string[]): Promise<any>;
    clearRecords(collectionId: string): Promise<any>;
}
