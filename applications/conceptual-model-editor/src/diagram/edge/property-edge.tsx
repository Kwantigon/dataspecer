import React, { useContext } from "react";
import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  useInternalNode,
  useReactFlow,
} from "@xyflow/react";

import { createLogger } from "../../application/";

import { defaultDiagramOptions, DiagramOptions, EdgeType, EntityColor, LabelVisual, ProfileOfVisual, type Edge as ApiEdge } from "../diagram-model";
import { DiagramContext } from "../diagram-controller";
import { createSvgPath, createOrthogonalWaypoints, findLabelPosition } from "./edge-utilities";
import { Waypoints } from "./waypoints";
import { Point } from "./math";

const logger = createLogger(import.meta.url);

export const PropertyEdge = (props: EdgeProps<Edge<ApiEdge>>) => {
  const sourceNode = useInternalNode(props.source);
  const targetNode = useInternalNode(props.target);
  const reactFlow = useReactFlow();
  const context = useContext(DiagramContext);

  if (sourceNode === undefined || targetNode === undefined) {
    logger.error("Missing source or target.", { props, sourceNode, targetNode });
    return null;
  }

  const data = props.data;

  // Prepare waypoints for the path.
  const waypoints = createOrthogonalWaypoints(sourceNode, props.data?.waypoints ?? [], targetNode);

  // Select label position.
  const labelPosition = findLabelPosition(waypoints);

  // Create path.
  const path = createSvgPath(waypoints);

  // Handler when user clicks the edge, the first click
  // is consumed when not selected
  const onPathClick = (event: React.MouseEvent) => {
    const { x, y } = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    context?.onOpenEdgeContextMenu(props, x, y);
  };

  const sourceWaypoint = waypoints[0];
  const sourceShift = getLabelTranslate(
    sourceWaypoint, sourceNode.position, sourceNode.measured);

  const targetWaypoint = waypoints[waypoints.length - 1];
  const targetShift = getLabelTranslate(
    targetWaypoint, targetNode.position, targetNode.measured);

  const label = data === undefined ? props.label : prepareEdgeLabel(data.options, data);

  const style = { ...props.style };
  if (data !== undefined) {
    style.stroke = prepareColor(data);
  }

  return (
    <>
      <g onClick={onPathClick}>
        <BaseEdge id={props.id} path={path} markerEnd={props.markerEnd} style={style} />
      </g>
      <>
        {props.selected ? <Waypoints edge={props} waypoints={waypoints} data={props.data} /> : null}
      </>
      <EdgeLabelRenderer>
        {props.data === undefined || props.data.cardinalitySource === null ? null : (
          <div style={{
            position: "absolute",
            transform: `${sourceShift} translate(${sourceWaypoint.x}px,${sourceWaypoint.y}px)`
          }}
          >
            {props.data.cardinalitySource}
          </div>
        )}
        {props.selected || props.label === null ? null : (
          <div
            style={{
              textAlign: "center",
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelPosition.x}px,${labelPosition.y}px)`,
              // We need this to make the content click-able.
              pointerEvents: "all",
              color: "black",
              backgroundColor: "#F0FDFA",
              // Line break from text, we can split into multiple component and center.
              whiteSpace: "pre-line",
              // Round the edges.
              padding: "5px",
              borderRadius: "15px",
              opacity: props.style?.opacity,
            }}
          >
            {label}
          </div>
        )}
        {props.data === undefined || props.data.cardinalityTarget === null ? null : (
          <div style={{
            position: "absolute",
            transform: `${targetShift} translate(${targetWaypoint.x}px,${targetWaypoint.y}px)`
          }}
          >
            {props.data.cardinalityTarget}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export const PropertyEdgeName = "property-edge";

function prepareEdgeLabel(
  options: DiagramOptions,
  data: {
    label: string | null,
    iri: string | null,
    type: EdgeType,
    vocabulary: { label: string | null }[],
    profileOf: {
      label: string;
      iri: string | null;
    }[] | undefined
  },
) {
  return selectArchetype(options, data.type)
    + selectEntityLabel(options, data)
    + selectProfileLabel(options, data.profileOf ?? []);
}

function selectArchetype(options: DiagramOptions, type: EdgeType) {
  if (!options.displayRelationshipProfileArchetype) {
    return "";
  }
  switch (type) {
    case EdgeType.AssociationProfile:
      return "<<profile>>\n";
    default:
      return ""
  }
}

function selectEntityLabel(
  options: DiagramOptions,
  data: {
    label: string | null,
    iri: string | null,
    type: EdgeType,
    vocabulary: { label: string | null }[],
  },
) {
  switch (options.labelVisual) {
    case LabelVisual.Entity:
      return data.label;
    case LabelVisual.Iri:
      return data.iri;
    case LabelVisual.VocabularyOrEntity:
      return data.vocabulary
        .map(item => item.label)
        .filter(item => item !== null)
        .join(", ");
  }
}

function selectProfileLabel(
  options: DiagramOptions,
  profileOf: {
    label: string;
    iri: string | null;
  }[],
) {
  let labels: (string | null)[] = [];
  switch (options.profileOfVisual) {
    case ProfileOfVisual.Entity:
      labels = profileOf.map(item => item.label);
      break;
    case ProfileOfVisual.Iri:
      labels = profileOf.map(item => item.iri);
      break;
    case ProfileOfVisual.None:
      return;
  }
  if (labels.length === 0) {
    return "";
  }
  return "\n(" + labels.filter(item => item !== null).join(", ") + ")";
}

function prepareColor(data: ApiEdge) {
  switch (data.options.entityMainColor) {
    case EntityColor.Entity:
      return data.color;
    case EntityColor.VocabularyOrEntity:
      if (data.vocabulary.length === 0) {
        return data.color;
      }
      // Just use the first one.
      return data.vocabulary[0].color;
  }
}

/**
 * @returns Shift of the object in percentage.
 */
function getLabelTranslate(
  point: Point,
  nodePosition: Point,
  { width, height }: { width?: number, height?: number },
): string {
  if (width === undefined || height === undefined) {
    // No translation.
    return "translate(0px,0px)";
  }
  let shiftX = "0%";
  if (point.x < (nodePosition.x)) {
    // Left
    shiftX = "-110%"
  } else if (point.x > (nodePosition.x + width)) {
    // Right
    shiftX = "10%";
  }
  let shiftY = "0%";
  if (point.y < (nodePosition.y)) {
    // Top
    shiftY = "-110%"
  } else if (point.y > (nodePosition.y + height)) {
    // Bottom
    shiftY = "10%";
  }
  return `translate(${shiftX},${shiftY})`;
}
