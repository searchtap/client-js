import { SearchTapAPIClient } from "../src/main/SearchTapAPIClient";
export declare class SearchTapApiClientSpec {
    searchtapApiClient: SearchTapAPIClient;
    private appTitle;
    private collectionTitle;
    before(): Promise<void>;
    private deleteAppIfExist;
    private createAppIfDoesNotExist;
    private deleteCollectionIfExist;
    private createCollectionIfDoesNotExist;
    createApp(): Promise<void>;
    deleteApp(): Promise<void>;
    createCollectionByTitle(): Promise<void>;
    createCollectionByBody(): Promise<void>;
    getCollectionByTitle(): Promise<void>;
    getCollectionById(): Promise<void>;
}
