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
  static EntityNotFoundException="Entity Not Found";
  static NotAuthorisedException="Not Authorised";
  static InvalidSchemaException="Invalid Schema";
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
