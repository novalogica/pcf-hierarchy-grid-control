import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { cellEditorOverrides } from "./customizers/CellEditorOverrides";
import { PAOneGridCustomizer } from "./types";
import * as React from "react";
import { EntityMetada } from "./interfaces/entity";
import { cellRendererOverrides } from "./customizers/CellRendererOverrides";

export class PAHierarchyGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
	constructor() {
		// Empty
	}

	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary
	): void {
		const eventName = context.parameters.EventName.raw;

		if (!eventName)
			return;

		//@ts-expect-error - contextInfo is not recognized
		const entityLogicalName: string | undefined = context?.mode.contextInfo.entityTypeName;

		if(entityLogicalName) {
			context.utils.getEntityMetadata(entityLogicalName)
				.then((metadata) => {
					const gridCustomizer: PAOneGridCustomizer = { 
					cellRendererOverrides: cellRendererOverrides(context, entityLogicalName, metadata as EntityMetada), 
					cellEditorOverrides 
					};

					(context as any).factory.fireEvent(eventName, gridCustomizer);
				})
				.catch(e => {
					console.error("Error fetching entity metadata:", e);
				});
		}
	}

	public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
		return React.createElement(React.Fragment);
	}

	public getOutputs(): IOutputs {
		return {};
	}

	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}
