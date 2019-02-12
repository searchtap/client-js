import {suite, test, timeout} from "mocha-typescript";
import {DataCentre, Index, SortDirection} from "../src/index";
import {expect} from "chai";


@suite("SearchClientSpec", timeout(100000))
export class SearchTapApiClientSpec {
  searchtapApiClient: Index;
  private appTitle = "testApp";

  private collectionTitle = "testCollection";

  async before() {
    this.searchtapApiClient = new Index("PNWDFXFHMWK4EAWMS8NUE45L")
  }

  private async deleteAppIfExist() {
    let app = (await this.searchtapApiClient.getAppByTitle(this.appTitle));
    if (app)
      await this.searchtapApiClient.deleteApp(app.uniqueId);
  }

  private async createAppIfDoesNotExist(): Promise<string> {
    await this.searchtapApiClient.createApp(this.appTitle, [DataCentre.IN_1]);
    return (await this.searchtapApiClient.getAppByTitle(this.appTitle)).uniqueId;
  }

  private async deleteCollectionIfExist(): Promise<string> {
    let appId = await this.createAppIfDoesNotExist();
    let appWriteToken = await this.searchtapApiClient.getWriteToken(appId);
    let collection = (await this.searchtapApiClient.getCollectionByTitle(appId, this.collectionTitle));
    if (collection)
      await this.searchtapApiClient.deleteCollection(collection.uniqueId);
    return appId;
  }

  private async createCollectionIfDoesNotExist() {
    let appId = await this.createAppIfDoesNotExist();
    let appWriteToken = await this.searchtapApiClient.getWriteToken(appId);
    await this.searchtapApiClient.createCollection(appId, this.collectionTitle);
    return {
      collectionId: (await this.searchtapApiClient.getCollectionByTitle(appId, this.collectionTitle)).uniqueId,
      appId: appId,
      appWriteToken: appWriteToken.uniqueId
    }
  }

  @test("test app is created")
  async createApp() {
    await this.deleteAppIfExist();
    let result = await this.searchtapApiClient.createApp(this.appTitle, [DataCentre.IN_1]);
    expect(result.status).equals(200)
  }

  @test("test app is deleted")
  async deleteApp() {
    await this.createAppIfDoesNotExist();
    let appId = (await this.searchtapApiClient.getAppByTitle(this.appTitle)).uniqueId;
    let result = await this.searchtapApiClient.deleteApp(appId);
    expect(result.status).equals(200)
  }

  @test("test collection is created for title params")
  async createCollectionByTitle() {
    let appId = await this.deleteCollectionIfExist();
    let appWriteToken = await this.searchtapApiClient.getWriteToken(appId);
    let response = await this.searchtapApiClient.createCollection(appId, this.collectionTitle);
    expect(response.status).equals(200);
  }

  @test("test collection is created for collection params")
  async createCollectionByBody() {
    let appId = await this.deleteCollectionIfExist();
    let appWriteToken = await this.searchtapApiClient.getWriteToken(appId);
    let body = {
      title: this.collectionTitle,
      indexFields: ["if1", "if2"],
      searchFields: ["sf1", "sf2"],
      sortDirection: SortDirection.Ascending,
      stopWordEnabled: false,
      stemmingEnabled: false,
      pluralsEnabled: true,
      minCharsTypoTolerance: 5,
      textFacetFields: ["tf1", "tf2"],
      numericFacetFields: ["nf1", "nf2"],
      maxFacetCount: 200,
      pageSize: 100,
      maxFetchCount: 2000,
      whitelistedFields: ["wf1", "wf2"]
    };
    let response = await this.searchtapApiClient.createCollection(appId, body);
    expect(response.status).equals(200);
  }

  @test("can get collection by title")
  async getCollectionByTitle() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.getCollectionByTitle(data.appId, this.collectionTitle);
    expect(response.title).equals(this.collectionTitle);
  }

  @test("can get collection by id")
  async getCollectionById() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.getCollection(data.collectionId);
    expect(response.title).equals(this.collectionTitle);
  }

  @test("can delete a collection")
  async deleteCollection() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.deleteCollection(data.collectionId);
    expect(response.status).equals(200);
  }

  @test("can update a collection")
  async updateCollection() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.updateCollection(data.collectionId, {
      title: this.collectionTitle,
      sortDirection: SortDirection.Ascending
    });
    expect(response.status).equals(200);
  }

  @test("can add records to collection")
  async addRecords() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.addRecords(data.collectionId, [{
      id: "1",
      "name": "n1"
    }, {
      id: "2",
      "name": "n2"
    }]);
    expect(response.status).equals(201);
  }

  @test("can reIndex records in collection")
  async reIndexRecords() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.reindexRecords(data.collectionId);
    expect(response.status).equals(200);
  }

  @test("can delete records in collection")
  async deleteRecords() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.deleteRecords(data.collectionId, ["1", "2"]);
    expect(response.status).equals(200);
  }

  @test("can clear records in collection")
  async clearRecords() {
    let data = await  this.createCollectionIfDoesNotExist();
    let response = await this.searchtapApiClient.clearRecords(data.collectionId);
    expect(response.status).equals(200);
  }

}
