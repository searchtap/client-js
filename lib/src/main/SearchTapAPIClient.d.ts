export declare enum DataCentre {
    IN_1 = 1000,
    US_1 = 2000,
    US_2 = 2100,
    AU_1 = 4000
}
export declare enum SortDirection {
    Ascending = 1,
    Descending = 2
}
export declare class Messages {
    static CollectionExists: string;
    static InvalidCollectionData: string;
    static InvalidAppData: string;
    static EntityNotFound: string;
    static EmptyCollectionData: string;
    static DataLimitExceeded: string;
    static EmptyArray: string;
    static InvalidSynonymData: string;
    static BadRequest: string;
    static InvalidCollection: string;
    static DuplicateUser: string;
    static UserCredentialsFailure: string;
    static SchedulerAlreadyInit: string;
    static ApiUnauthorised: string;
    static PasswordError: string;
    static DuplicateAppName: string;
}
export declare class StatusCode {
    static Ok: number;
    static BadRequest: number;
    static InternalServerError: number;
    static NotFound: number;
    static Created: number;
    static Unauthorised: number;
    static Conflict: number;
}
export declare class AppToken {
    static appReadToken: string;
    static appWriteToken: string;
}
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
export declare class SearchTapAPIClient {
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
    createCollection(appWriteToken: string, appId: String, collectionData: string | Collection): Promise<any>;
    deleteCollection(appWriteToken: string, collectionId: string): Promise<any>;
    createOrElseGetCollection(appWriteToken: string, appId: string, collectionTitle: string): Promise<any>;
    createOrElseGetApp(appTitle: string, locations: DataCentre[]): Promise<any>;
    getAllToken(appId: string): Promise<any[]>;
    getWriteToken(appId: string): Promise<any>;
}
export {};
