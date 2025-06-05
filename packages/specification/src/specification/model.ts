import { Package } from "@dataspecer/core-v2/project";
import { LanguageString } from "@dataspecer/core/core/core-resource";

export type DataSpecification = Package & {
  /**
   * ID of the parent package that is being interpreted as Data Specification.
   */
  id: string;

  type: string;

  label: LanguageString;
  tags: string[];

  /**
   * List of IDs of models that are being interpreted as CIMs.
   * @deprecated Use {@link modelCompositionConfiguration} instead.
   * */
  sourceSemanticModelIds: string[];

  /**
   * List of IDs of models that are being interpreted as PIMs.
   * @deprecated Use {@link modelCompositionConfiguration} instead.
   */
  localSemanticModelIds: string[];

  /**
   * Information about models and how they are composed.
   * Overrides {@link sourceSemanticModelIds} and {@link localSemanticModelIds}.
   */
  modelCompositionConfiguration: object | null;

  dataStructures: DataSpecificationStructure[];

  importsDataSpecificationIds: string[];

  /**
   * List of artifact configurations.
   */
  artifactConfigurations: ArtifactConfigurationDescriptor[];

  /**
   * Additional data that can be used to store user preferences.
   */
  userPreferences: object;
};

export type DataSpecificationStructure = {
  id: string;
  label: LanguageString;
}

export type ArtifactConfigurationDescriptor = {
  id: string;
  label: LanguageString;
}
