import { useContext } from "react";
import {
  Handle,
  Position,
  NodeToolbar,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";

import type { Node as ApiNode, EntityItem } from "../diagram-api";
import { DiagramContext } from "../diagram-controller";

import "./entity-node.css";
import { usePrefixForIri } from "../../service/prefix-service";

// We can select zoom option and hide content when zoom is on given threshold.
// const zoomSelector = (state: ReactFlowState) => state.transform[2] >= 0.9;
// Following in the entity:
// const showContent = useStore(zoomSelector);

export const EntityNode = (props: NodeProps<Node<ApiNode>>) => {
  // We can use the bellow to set size based on the content.
  // useLayoutEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.width = `${data.label.length * 8}px`;
  //   }
  // }, [data.label.length]);

  // We can use bellow to get information about active connection
  // and for example highligh possible targets.
  // const connection = useConnection()

  const data = props.data;

  const description: undefined | string = data.description ?? undefined;

  let usageNote: undefined | string = undefined;
  if (data.profileOf !== null && data.profileOf.usageNote !== null) {
    usageNote = data.profileOf.usageNote;
  }

  return (
    <>
      {props.selected ? <SelectedHighlight /> : null}
      <div className={"border border-black entity-node min-h-14 min-w-56"}>
        <EntityNodeToolbar {...props} />
        <div className="entity-node-content">

          <div className="drag-handle bg-slate-300 p-1"
            style={{ backgroundColor: data.color }}
            title={description}
          >
            {data.profileOf === null ? null : (
              <div className="text-gray-600">
                <span className="underline" title={usageNote}>
                  profile
                </span>
                &nbsp;of&nbsp;
                <span>
                  {data.profileOf.label}
                </span>
              </div>
            )}
            {data.label}
          </div>

          <div className="overflow-x-clip text-gray-500 px-1">
            {usePrefixForIri(data.iri)}
          </div>

          <ul className="px-1">
            {data.items.map(item =>
              <EntityNodeItem key={item.identifier} item={item} />)}
          </ul>
        </div>
        {/* We need a permanent source and target. */}
        <Handle type="target" position={Position.Right} />
        <Handle type="source" position={Position.Right} />
      </div>
    </>
  );
};

function SelectedHighlight() {
  return (
    <div style={{ position: "fixed", zIndex: -1, left: "-.25em", top: "-.25em", bottom: "-.25em", right: "-.25em" }} className={"entity-node selected"} />
  );
}

function EntityNodeToolbar(props: NodeProps<Node<ApiNode>>) {
  const context = useContext(DiagramContext);
  // TODO: Put all handler code into controller (... but what about the screenToFlowPosition method on reactflow
  const reactFlow = useReactFlow();
  const onShowDetail = () => context?.callbacks().onShowNodeDetail(props.data);
  const onEdit = () => context?.callbacks().onEditNode(props.data);
  const onCreateProfile = () => context?.callbacks().onCreateNodeProfile(props.data);
  const onHide = () => context?.callbacks().onHideNode(props.data);
  const onDelete = () => context?.callbacks().onDeleteNode(props.data);
  // TODO: Or should it NOT be part of context? and therefore the information of not showing toolbar because other one is shown, should be on the node?
  //       Also we may keep opening menu from menu from menu, etc... But that probably doesn't matter from the node's view.
  //       Also if we don't want to have opened canvas toolbar and node toolbar at the same time then we need to store the information inside the context.
  if(context?.openedCanvasToolbar !== null && context?.openedCanvasToolbar !== undefined) {
    return <></>;
  }


  const onAnchor = () => context?.callbacks().onAnchorNode(props.data);
  // TODO: Might be better to create 2 components - EntitySelectionToolbar, EntityNodeToolbar
  //
  const onShowSelectionActions = (event: React.MouseEvent) => {
    const absoluteFlowPosition = reactFlow.screenToFlowPosition({x: event.clientX, y: event.clientY});
    // TODO: I probably don't need the relative position to the viewport (and I don't have it here), so just remove it from the method signature and props
    context?.callbacks().onShowSelectionActions(props.data, {x: event.clientX, y: event.clientY}, absoluteFlowPosition);
  }
  const onLayoutSelection = () => context?.callbacks().onLayoutSelection();
  const onCreateGroup = () => context?.callbacks().onCreateGroup();
  const onShowExpandSelection = () => context?.callbacks().onShowExpandSelection();
  const onShowFilterSelection = () => context?.callbacks().onShowFilterSelection();


  // const isVisible = props.selected === true && props.data.isLastSelected;
  const isLastSelected = props.selected === true && context?.getLastSelected() === props.id;
  if((context?.getNumberOfSelectedNodes() ?? 0) === 1) {
    return (
      <>
      <NodeToolbar isVisible={props.selected === true} position={Position.Top} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onShowDetail}>ℹ</button>
        &nbsp;
        <button onClick={onEdit}>✏️</button>
        &nbsp;
        <button onClick={onCreateProfile}>🧲</button>
        &nbsp;
      </NodeToolbar>
      <NodeToolbar isVisible={props.selected === true} position={Position.Right} className="flex gap-2 entity-node-toolbar" >
        <Handle type="source" position={Position.Right}>🔗</Handle>
      </NodeToolbar>
      <NodeToolbar isVisible={props.selected === true} position={Position.Bottom} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onHide}>🕶</button>
        &nbsp;
        <button onClick={onDelete}>🗑</button>
        &nbsp;
        <button onClick={onAnchor}>⚓</button>
        &nbsp;
      </NodeToolbar>
    </>);
  }
  if (isLastSelected === true && context?.getLastSelected() === props.id) {
    return (<>
      <NodeToolbar isVisible={isLastSelected} position={Position.Top} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onShowSelectionActions}>🎬</button>
        &nbsp;
        <button onClick={onLayoutSelection}>🔀</button>
        &nbsp;
      </NodeToolbar>
      <NodeToolbar isVisible={isLastSelected} position={Position.Right} className="flex gap-2 entity-node-toolbar" >
      <button onClick={onCreateGroup}>🤝</button>
      </NodeToolbar>
      <NodeToolbar isVisible={isLastSelected} position={Position.Bottom} className="flex gap-2 entity-node-toolbar" >
        <button onClick={onShowExpandSelection}>📈</button>
        &nbsp;
        <button onClick={onShowFilterSelection}>📉</button>
        &nbsp;
      </NodeToolbar>
    </>
    );
  }
  return <></>;
}

function EntityNodeItem({ item }: {
  item: EntityItem,
}) {

  let usageNote: undefined | string = undefined;
  if (item.profileOf !== null && item.profileOf.usageNote !== null) {
    usageNote = item.profileOf.usageNote;
  }

  return (
    <li>
      <span>
        - {item.label}
      </span>
      {item.profileOf === null ? null : (
        <>
          &nbsp;
          <span className="text-gray-600 underline" title={usageNote}>
            profile
          </span>
          &nbsp;of&nbsp;
          <span>
            {item.profileOf.label}
          </span>
        </>
      )}
    </li>
  );
}

export const EntityNodeName = "entity-node";
