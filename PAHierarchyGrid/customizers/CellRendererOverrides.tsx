import * as React from "react";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { CellRendererProps, CellRendererOverrides, RECID } from "../types";
import { Button } from "@fluentui/react-components";
import { OrganizationRegular } from "@fluentui/react-icons";
import { IInputs } from "../generated/ManifestTypes";
import { EntityMetada } from "../interfaces/entity";
import { UseDataverse } from "../hooks/useDataverse";
import { RendererProps } from "../interfaces/renderer";

export const cellRendererOverrides = (
  context: ComponentFramework.Context<IInputs>,
  entityName: string,
  metadata: EntityMetada
): CellRendererOverrides => {
  return {
    ["Text"]: (props: CellRendererProps, col) => {
      return (
        <CellRenderer
          context={context}
          entityName={entityName}
          metadata={metadata}
          props={props}
          col={col}
        />
      );
    },
  };
};

const CellRenderer = memo(
  ({ context, entityName, metadata, props, col }: RendererProps) => {
    const { checkIfHasHierarchy } = UseDataverse(context, entityName, metadata);
    const primaryColumn = useMemo(
      () => metadata._entityDescriptor.PrimaryNameAttribute,
      []
    );
    const [hasHierarchy, setHasHierarchy] = useState<boolean>(false);

    const fetchHierarchy = useCallback(async (id: string): Promise<boolean> => {
      try {
        return await checkIfHasHierarchy(id);
      } catch {
        return false;
      }
    }, []);

    useEffect(() => {
      if (
        col.colDefs[col.columnIndex].name != primaryColumn ||
        !col.rowData?.[RECID]
      ) {
        return;
      }

      void fetchHierarchy(col.rowData?.[RECID])
        .then((result) => {
          setHasHierarchy(result);
        })
        .catch(() => setHasHierarchy(false));
    }, []);

    const onHierarchyClicked = useCallback(() => {
      const paneInput = {
        pageType: "control",
        controlName: "nl_novalogica.HierarchyPCFControl",
        data: { etn: entityName, id: col.rowData?.[RECID] },
        title: `Hierarchy for ${entityName}`,
      };

      const navigationOptions = {
        target: 2,
        width: 500,
        height: 400,
        position: 1,
      };

      //@ts-expect-error - Xrm is not recognized
      Xrm.Navigation.navigateTo(paneInput, navigationOptions);
    }, [entityName, col.rowData]);

    const onRecordTitleClicked = useCallback(() => {
      void context.navigation.openForm({
        entityName: entityName,
        entityId: col.rowData?.[RECID],
        openInNewWindow: false,
      });
    }, [col.rowData?.[RECID]]);

    if (col.colDefs[col.columnIndex].name === primaryColumn) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            height: "100%",
            alignItems: "center",
            paddingLeft: 8,
          }}
        >
          {hasHierarchy ? (
            <Button
              style={{ color: "rgb(17, 94, 163)" }}
              icon={<OrganizationRegular />}
              onClick={onHierarchyClicked}
              appearance="transparent"
            />
          ) : (
            <Button
              style={{ color: "transparent", cursor: "default" }}
              icon={<OrganizationRegular />}
              appearance="transparent"
            />
          )}
          <div onClick={onRecordTitleClicked}>
            <span className="clickable-title">
              {props ? (props as any).formattedValue : ""}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div onClick={onRecordTitleClicked}>
        <span className="clickable-title">
          {props ? (props as any).formattedValue : ""}
        </span>
      </div>
    );
  }
);

CellRenderer.displayName = "CellRenderer";
export default CellRenderer;
