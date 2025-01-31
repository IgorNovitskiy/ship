import {
  ClientSession, Collection, CollectionOptions, CreateCollectionOptions, MongoClient,
} from 'mongodb';
import { ObjectSchema } from 'joi';

export type DbChangeType = 'create' | 'update' | 'delete';

export type InMemoryEventHandler = (evt: InMemoryEvent) => Promise<void> | void;

export type OnUpdatedProperties<T = Record<string, unknown>> = Array<Partial<T> | keyof T>;

export type PublishEventOptions = {
  session: ClientSession | undefined
};

export type IChangePublisher = {
  publishDbChange: (
    collectionName: string,
    changeType: DbChangeType,
    eventData: DbChangeData,
    options?: PublishEventOptions,
  ) => Promise<void>,
  publishDbChanges: (
    collectionName: string,
    changeType: DbChangeType,
    eventsData: DbChangeData[],
    options?: PublishEventOptions,
  ) => Promise<void>,
};

export interface DbChangeData<T = any> {
  doc: T,
  prevDoc?: T
}

export type OutboxEvent<T = any> = {
  _id: string,
  type: 'create' | 'update' | 'delete',
  doc: T,
  prevDoc?: T,
  createdOn: Date
};

export type InMemoryEvent<T = any> = {
  doc: T,
  prevDoc?: T,
  name: string,
  createdOn: Date
};

export type IDocument = {
  _id?: string;
  updatedOn?: Date;
  deletedOn?: Date | null;
  createdOn?: Date;
};

export type FindResult<T> = {
  results: T[];
  pagesCount: number;
  count: number;
};

export type QueryDefaultsOptions = {
  requireDeletedOn?: boolean;
};

interface IDatabase {
  getOutboxService: () => IChangePublisher;
  waitForConnection: () => Promise<void>;
  getOrCreateCollection: <TCollection>(
    name: string,
    opt: {
      collectionCreateOptions: CreateCollectionOptions;
      collectionOptions: CollectionOptions;
    },
  ) => Promise<Collection<TCollection> | null>;

  getClient: () => Promise<MongoClient | undefined>;
}

interface ServiceOptions {
  addCreatedOnField?: boolean;
  addUpdatedOnField?: boolean;
  outbox?: boolean;
  schema?: ObjectSchema<any>;
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
  requireDeletedOn?: boolean;
}

export {
  IDatabase,
  ServiceOptions,
};
