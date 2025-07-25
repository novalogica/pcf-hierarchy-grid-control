import { IInputs } from "../generated/ManifestTypes";
import { CellRendererProps, GetRendererParams } from "../types";
import { EntityMetada } from "./entity";

export interface RendererProps {
    context: ComponentFramework.Context<IInputs>;
    entityName: string;
    metadata: EntityMetada;
    props: CellRendererProps;
    col: GetRendererParams;
}