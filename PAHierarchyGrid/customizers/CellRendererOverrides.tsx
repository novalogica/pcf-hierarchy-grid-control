import * as React from "react";
import { useState, useEffect, useMemo, memo } from "react";
import { CellRendererProps, CellRendererOverrides, RECID, GetRendererParams } from "../types";
import { Button } from "@fluentui/react-components";
import { OrganizationRegular } from "@fluentui/react-icons";
import { IInputs } from "../generated/ManifestTypes";
import { EntityMetada } from "../interfaces/entity";
import { UseDataverse } from "../hooks/useDataverse";

export const cellRendererOverrides = (context: ComponentFramework.Context<IInputs>, entityName: string, metadata: EntityMetada): CellRendererOverrides => {
	return {
		["Text"]: (props: CellRendererProps, col) => {
			return <CellRenderer context={context} entityName={entityName} metadata={metadata} props={props} col={col} />;
		}
	};
};
  
interface IProps {
	context: ComponentFramework.Context<IInputs>;
	entityName: string;
	metadata: EntityMetada;
	props: CellRendererProps;
	col: GetRendererParams;
}

const CellRenderer = memo(({ context, entityName, metadata, props, col }: IProps) => {
	const { checkIfHasHierarchy } = UseDataverse(context, entityName, metadata);
	const primaryColumn = useMemo(() => metadata._entityDescriptor.PrimaryNameAttribute, [metadata]);
	const [hasHierarchy, setHasHierarchy] = useState<boolean>(false);

	useEffect(() => {
		const fetchHierarchy = async () => {
			if (col.rowData?.[RECID]) {
				const result = await checkIfHasHierarchy(col.rowData[RECID]);
				setHasHierarchy(result);
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchHierarchy();
	}, [col.rowData, checkIfHasHierarchy]);

	const onHierarchyClicked = () => {
		const paneInput = {
			pageType: "control",
			controlName: "nl_novalogica.HierarchyPCFControl",
			data: { etn: entityName, id: col.rowData?.[RECID] },
			title: `Hierarchy for ${entityName}`
		};

		const navigationOptions = {
			target: 2,
			width: 500, 
			height: 400,
			position: 1
		};

		//@ts-expect-error - Xrm is not recognized
		Xrm.Navigation.navigateTo(paneInput, navigationOptions);
	};

	if (col.colDefs[col.columnIndex].name === primaryColumn) {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', gap: 16, height: '100%', alignItems: 'center', paddingLeft: 8 }}>
				{
					hasHierarchy ? 
						<Button style={{ color: 'rgb(17, 94, 163)'}} icon={<OrganizationRegular />} onClick={onHierarchyClicked} appearance="transparent" /> 
						: <div id="empty_block" style={{ height: 32, width: 32 }} />
				}
				<div>
					{
						// eslint-disable-next-line react/prop-types
						props.formattedValue ?? ""
					}
				</div>
			</div>
		);
	}

	return (
		<div>
			{
				// eslint-disable-next-line react/prop-types
				props.formattedValue ?? ""
			}
		</div>
	);
});

CellRenderer.displayName = "CellRenderer"
export default CellRenderer; 