import { useCallback } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { EntityMetada, RelationshipInfo } from "../interfaces/entity";

export const UseDataverse = (
  context: ComponentFramework.Context<IInputs>,
  entityName: string,
  metadata: EntityMetada
) => {
  const checkIfHasHierarchy = useCallback(
    async (id: string): Promise<boolean> => {
      const relationship = fetchHierarchicalRelationship();

      if (!relationship) {
        console.log("Hierarchical relationship not found.");
        return false;
      }

      const referencingAttr = `_${relationship.ReferencingAttribute}_value`;
      const columns = [
        metadata._entityDescriptor.PrimaryNameAttribute,
        referencingAttr,
      ].join(",");
      const data = (await fetchHierarchy(relationship, columns, id)).filter(
        (r) => (r[relationship.ReferencedAttribute] as string) !== id
      );
      const hasHierarchy = Array.isArray(data) && data.length > 0;
      return hasHierarchy;
    },
    []
  );

  const fetchHierarchicalRelationship =
    useCallback((): RelationshipInfo | null => {
      const hierarchicalRelationship = Object.values(
        metadata._entityDescriptor.OneToManyRelationships
      ).find((rel) => rel.IsHierarchical);

      return hierarchicalRelationship ?? null;
    }, []);

  const fetchHierarchy = useCallback(
    async (
      relationship: RelationshipInfo,
      columns: string,
      id: string
    ): Promise<ComponentFramework.WebApi.Entity[]> => {
      const query = `?$filter=(Microsoft.Dynamics.CRM.Above(PropertyName='${relationship.ReferencedAttribute}',PropertyValue='${id}') or Microsoft.Dynamics.CRM.UnderOrEqual(PropertyName='${relationship.ReferencedAttribute}',PropertyValue='${id}'))&$select=${columns}`;
      return (await context.webAPI.retrieveMultipleRecords(entityName, query))
        .entities;
    },
    []
  );

  return { checkIfHasHierarchy };
};
