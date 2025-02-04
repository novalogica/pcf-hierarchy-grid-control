import { RelationshipInfo } from "./relationship-info";

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export interface EntityRelationship {
    [id: string]: RelationshipInfo;
}
