import { ModelDsIdentifier } from "../entity-model";
import { InMemorySemanticModel } from "@dataspecer/core-v2/semantic-model/in-memory";
import { InvalidState } from "../../application/error";
import { CmeClass, CmeClassProfile, CmeReference, CmeRelationship, CmeRelationshipProfile, NewCmeClass, NewCmeClassProfile, NewCmeGeneralization, NewCmeRelationship, NewCmeRelationshipProfile } from "./model";
import { EntityModel } from "@dataspecer/core-v2";
import { isInMemorySemanticModel } from "../../utilities/model";
import { createLogger } from "../../application";
import { createCmeClassProfile } from "./operation/create-cme-class-profile";
import { createCmeClass } from "./operation/create-cme-class";
import { createCmeGeneralization } from "./operation/create-cme-generalization";
import { createCmeRelationshipProfile } from "./operation/create-cme-relationship-profile";
import { createCmeRelationship } from "./operation/create-cme-relationship";
import { deleteCmeClass } from "./operation/delete-cme-class";
import { deleteCmeClassProfile } from "./operation/delete-cme-class-profile";
import { deleteCmeGeneralization } from "./operation/delete-cme-generalization";
import { deleteCmeRelationshipProfile } from "./operation/delete-cme-relationship-profile";
import { deleteCmeRelationship } from "./operation/delete-cme-relationship";
import { updateCmeClassProfile } from "./operation/update-cme-class-profile";
import { updateCmeClass } from "./operation/update-cme-class";
import { updateCmeRelationshipProfile } from "./operation/update-cme-relationship-profile";

const LOG = createLogger(import.meta.url);

export interface CmeModelOperationExecutor {

  // Class profile

  /**
   * @throws {DataspecerError}
   * @throws {InvalidState}
   */
  createClassProfile(value: NewCmeClassProfile): CmeReference;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  updateClassProfile(value: CmeClassProfile): void;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  deleteClassProfile(value: CmeReference): void;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  changeClassProfile(value: CmeReference & Partial<CmeClassProfile>): void;

  // Class

  /**
   * @throws {DataspecerError}
   * @throws {InvalidState}
   */
  createClass(value: NewCmeClass): CmeReference;

  /**
   * @throws {DataspecerError}
   * @throws {InvalidState}
   */
  updateClass(value: CmeClass): void;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  deleteClass(value: CmeReference): void;

  // Generalization

  /**
   * @throws {DataspecerError}
   * @throws {InvalidState}
   */
  createGeneralization(value: NewCmeGeneralization): CmeReference;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  deleteGeneralization(value: CmeReference): void;

  // Relationship profile

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  createRelationshipProfile(value: NewCmeRelationshipProfile): CmeReference;

  /**
   * @throws {DataspecerError}
   * @throws {InvalidState}
   */
  updateRelationshipProfile(value: CmeRelationshipProfile): void;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  deleteRelationshipProfile(value: CmeReference): void;

  // Relationship

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  createRelationship(value: NewCmeRelationship): CmeReference;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  updateRelationship(value: NewCmeRelationship): void;

  /**
   * @throws {InvalidState}
   * @throws {DataspecerError}
   */
  deleteRelationship(value: CmeReference): void;

}

class DefaultCmeModelOperationExecutor implements CmeModelOperationExecutor {

  private readonly models: InMemorySemanticModel[];

  constructor(models: InMemorySemanticModel[]) {
    this.models = models;
  }

  // Class profile

  createClassProfile(value: NewCmeClassProfile): CmeReference {
    const model = this.findModel(value.model);
    return createCmeClassProfile(model, value);
  }

  /**
   * @returns Model with given identifier.
   * @throws {InvalidState}
   */
  private findModel(identifier: ModelDsIdentifier) {
    const result = this.models.find(model => model.getId() === identifier);
    if (result === undefined) {
      LOG.error("Missing model.", { identifier, models: this.models });
      throw new InvalidState();
    }
    return result;
  }

  updateClassProfile(value: CmeClassProfile): void {
    const model = this.findModel(value.model);
    updateCmeClassProfile(model, value);
  }

  changeClassProfile(value: CmeReference & Partial<CmeClassProfile>): void {
    const model = this.findModel(value.model);
    updateCmeClassProfile(model, value);
  }

  deleteClassProfile(value: CmeReference): void {
    const model = this.findModel(value.model);
    deleteCmeClassProfile(model, value);
  }

  // Class

  createClass(value: NewCmeClass): CmeReference {
    const model = this.findModel(value.model);
    return createCmeClass(model, value);
  }

  updateClass(value: CmeClass): void {
    const model = this.findModel(value.model);
    updateCmeClass(model, value);
  }

  deleteClass(value: CmeReference): void {
    const model = this.findModel(value.model);
    deleteCmeClass(model, value);
  }

  // Generalization

  createGeneralization(value: NewCmeGeneralization): CmeReference {
    const model = this.findModel(value.model);
    return createCmeGeneralization(model, value);
  }

  deleteGeneralization(value: CmeReference): void {
    const model = this.findModel(value.model);
    deleteCmeGeneralization(model, value);
  }

  // Relationship profile

  createRelationshipProfile(value: NewCmeRelationshipProfile): CmeReference {
    const model = this.findModel(value.model);
    return createCmeRelationshipProfile(model, value);
  }

  updateRelationshipProfile(value: CmeRelationshipProfile): void {
    const model = this.findModel(value.model);
    updateCmeRelationshipProfile(model, value);
  }

  deleteRelationshipProfile(value: CmeReference): void {
    const model = this.findModel(value.model);
    deleteCmeRelationshipProfile(model, value);
  }

  // Relationship

  createRelationship(value: NewCmeRelationship): CmeReference {
    const model = this.findModel(value.model);
    return createCmeRelationship(model, value);
  }

  updateRelationship(value: CmeRelationship): void {
    const model = this.findModel(value.model);
    createCmeRelationship(model, value);
  }

  deleteRelationship(value: CmeReference): void {
    const model = this.findModel(value.model);
    deleteCmeRelationship(model, value);
  }

}

export function createCmeModelOperationExecutor(
  models: EntityModel[] | Map<string, EntityModel>,
) {
  let entityModels: EntityModel[] = [];
  if (models instanceof Map) {
    entityModels = [...models.values()];
  } else {
    entityModels = models;
  }
  //
  const semanticModels = entityModels.filter(isInMemorySemanticModel);
  return new DefaultCmeModelOperationExecutor(semanticModels);
}
