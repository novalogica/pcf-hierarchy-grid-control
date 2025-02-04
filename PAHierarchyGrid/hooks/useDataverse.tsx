import { IInputs } from "../generated/ManifestTypes";
import { EntityMetada, RelationshipInfo } from "../interfaces/entity";

export const UseDataverse = (context: ComponentFramework.Context<IInputs>, entityName: string, metadata: EntityMetada) => {
  const checkIfHasHierarchy = async (id: string): Promise<boolean> => {
      const relationship = fetchHierarchicalRelationship();
      
      if (!relationship) 
        throw new Error("Hierarchical relationship not found.");

      const referencingAttr = `_${relationship.ReferencingAttribute}_value`;
      const columns = [metadata._entityDescriptor.PrimaryNameAttribute, referencingAttr].join(",")
      const parentRecord = await fetchParent(relationship, columns, id);
      const childrenRecords = await fetchChildren(relationship, columns, id);

      const hasHierarchy = (parentRecord[referencingAttr] != null || (Array.isArray(childrenRecords) && childrenRecords.length > 0));
      return hasHierarchy;
  };

  const fetchHierarchicalRelationship = (): RelationshipInfo | null => {
    const hierarchicalRelationship = Object.values(metadata._entityDescriptor.OneToManyRelationships).find(
      (rel) => rel.IsHierarchical
    );

    return hierarchicalRelationship ?? null;
  };

  const fetchParent = async (relationship: RelationshipInfo, columns: string, id: string): Promise<ComponentFramework.WebApi.Entity> => {
    const query = `?$select=${columns}&$expand=${relationship.ReferencingAttribute}($select=${relationship.ReferencedAttribute})`;
    return await context.webAPI.retrieveRecord(entityName, id, query);
  };

  const fetchChildren = async (relationship: RelationshipInfo, columns: string, parentId: string,): Promise<ComponentFramework.WebApi.Entity[] | null> => {
    if (!parentId)
      return null;

    const query = `?$select=${columns}&$filter=_${relationship.ReferencingAttribute}_value eq ${parentId}`;
    const result = await context.webAPI.retrieveMultipleRecords(entityName, query);
    return result.entities;
  };

  return { checkIfHasHierarchy };
};