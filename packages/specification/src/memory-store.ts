import { CoreOperation, CoreResource, createExecutorMap, CreateNewIdentifier, ExecutorMap, MemoryStore } from "@dataspecer/core/core";
import { dataPsmExecutors } from "@dataspecer/core/data-psm/data-psm-executors";
import { pimExecutors } from "@dataspecer/core/pim/executor";
import { WritableBlobModel } from "./model-repository/blob-model.ts";

type StoreData = {
  operations: CoreOperation[];
  resources: {[resourceIri: string]: CoreResource}
};

type Connector = {
  load: () => Promise<StoreData>;
  save: (data: StoreData) => Promise<void>;
}

/**
 * Naive implementation of {@link MemoryStore} that can synchronize data with
 * the server using simple HTTP api.
 */
export class MemoryStoreFromBlob extends MemoryStore {
  protected connector: Connector;

  constructor(baseIri: string, executors: ExecutorMap, createNewIdentifier: CreateNewIdentifier | null, connector: Connector) {
    super(baseIri, executors, createNewIdentifier);
    this.connector = connector;
  }

  async save() {
    const operations = this.operations;
    const resources = this.resources;

    await this.connector.save({operations, resources});
  }

  async load() {
    const {operations, resources} = await this.connector.load();

    this.operations = operations;
    this.resources = resources;
  }

  static createFromConnector(connector: Connector): MemoryStoreFromBlob {
    return new MemoryStoreFromBlob(
      "https://ofn.gov.cz",
      createExecutorMap([...dataPsmExecutors, ...pimExecutors]),
      null,
      connector
    );
  }
}

export function blobModelAsConnector(blobModel: WritableBlobModel): Connector {
  return {
    load: () => blobModel.getJsonBlob() as any,
    save: (data: any) => blobModel.setJsonBlob(data),
  };
}