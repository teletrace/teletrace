import { Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Loader } from "@/components/Elements/Loader";
import BasicEdge from "@/components/Graph/BasicEdge";
import BasicNode from "@/components/Graph/BasicNode";
import { getLayoutElements } from "@/components/Graph/utils/dynamic_layout";
import {
  basicEdgeType,
  basicNodeType,
  position,
} from "@/components/Graph/utils/global";

import "reactflow/dist/style.css";

interface NodeData {
  name: string;
  image: string;
  type: string;
}

interface EdgeData {
  time: string;
  count?: number;
}

export const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: basicNodeType,
    data: {
      name: "/checkout",
      image:
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7421 43.961H40.1971H43.9611V40.197V32.849H12.7421V43.961ZM10.7421 30.849H45.9611V40.197V45.961H40.1971H10.7421V30.849ZM7.76412 2C4.58612 2 2.00012 4.586 2.00012 7.765V40.197C2.00012 43.375 4.58612 45.961 7.76412 45.961H9.12012V43.961H7.76412C5.68812 43.961 4.00012 42.273 4.00012 40.197V7.765C4.00012 5.689 5.68812 4 7.76412 4H40.1971C42.2721 4 43.9611 5.689 43.9611 7.765V29.226H45.9611V7.765C45.9611 4.586 43.3751 2 40.1971 2H7.76412ZM43.0491 41.468H40.1951C41.0061 40.419 41.5801 39.642 41.9151 39.134C42.2521 38.627 42.4811 38.202 42.6081 37.859C42.7341 37.518 42.7971 37.185 42.7971 36.863C42.7971 36.255 42.6461 35.781 42.3461 35.441C42.0461 35.103 41.6251 34.933 41.0871 34.933C40.7791 34.933 40.4781 34.987 40.1851 35.096C39.8911 35.203 39.5871 35.377 39.2721 35.614V36.507C39.9361 36.059 40.4851 35.835 40.9201 35.835C41.4861 35.835 41.7681 36.198 41.7681 36.926C41.7681 37.255 41.6881 37.602 41.5271 37.965C41.3671 38.328 41.1011 38.785 40.7301 39.333C40.3601 39.883 39.8211 40.622 39.1141 41.552V42.339H43.0491V41.468ZM34.4781 43.85H35.4651L38.3071 34.429H37.3211L34.4781 43.85ZM33.1301 36.249C32.9451 36.001 32.6871 35.877 32.3591 35.877H31.3201V38.709H32.3591C32.6871 38.709 32.9451 38.584 33.1301 38.331C33.3141 38.08 33.4071 37.733 33.4071 37.293C33.4071 36.846 33.3141 36.497 33.1301 36.249ZM34.4141 37.293C34.4141 37.965 34.2341 38.503 33.8751 38.909C33.5141 39.315 33.0441 39.517 32.4641 39.517H31.3201V42.339H30.3341V35.069H32.4641C32.8541 35.069 33.1991 35.163 33.4971 35.352C33.7941 35.541 34.0211 35.804 34.1791 36.139C34.3371 36.475 34.4141 36.859 34.4141 37.293ZM24.7641 35.919H26.5691V42.339H27.5861V35.919H29.4011V35.069H24.7641V35.919ZM19.5181 35.919H21.3231V42.339H22.3411V35.919H24.1551V35.069H19.5181V35.919ZM17.5681 35.069H18.5861V42.339H17.5681V39.034H14.9251V42.339H13.9071V35.069H14.9251V38.206H17.5681V35.069Z" fill="#3F8624"/>\n' +
        "</svg>\n",
      type: "Http",
    },
    position,
  },
  {
    id: "2",
    type: basicNodeType,
    data: {
      name: "/invoices",
      image:
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M24 44C12.972 44 4 35.028 4 24C4 12.972 12.972 4 24 4C35.028 4 44 12.972 44 24C44 35.028 35.028 44 24 44ZM24 2C11.869 2 2 11.869 2 24C2 36.131 11.869 46 24 46C36.131 46 46 36.131 46 24C46 11.869 36.131 2 24 2ZM17.231 35.25H11.876L18.221 21.959L20.902 27.492L17.231 35.25ZM19.114 19.215C18.946 18.87 18.597 18.651 18.214 18.651H18.211C17.826 18.652 17.477 18.874 17.312 19.221L9.389 35.819C9.24 36.129 9.262 36.493 9.445 36.783C9.628 37.074 9.947 37.25 10.291 37.25H17.864C18.251 37.25 18.603 37.027 18.769 36.678L22.915 27.915C23.044 27.642 23.043 27.323 22.911 27.051L19.114 19.215ZM36.125 35.25H30.673L20.761 13.953C20.597 13.601 20.243 13.375 19.854 13.375H16.251L16.255 9.25H23.475L33.339 30.545C33.503 30.898 33.856 31.125 34.246 31.125H36.125V35.25ZM37.125 29.125H34.885L25.021 7.83C24.856 7.477 24.503 7.25 24.113 7.25H15.256C14.704 7.25 14.257 7.697 14.256 8.249L14.25 14.374C14.25 14.64 14.355 14.894 14.543 15.082C14.73 15.27 14.984 15.375 15.25 15.375H19.217L29.129 36.672C29.293 37.024 29.646 37.25 30.035 37.25H37.125C37.678 37.25 38.125 36.803 38.125 36.25V30.125C38.125 29.572 37.678 29.125 37.125 29.125Z" fill="#D45B07"/>\n' +
        "</svg>\n",
      type: "Node.js",
    },
    position,
  },
  {
    id: "3",
    type: basicNodeType,
    data: {
      name: "update-subscription",
      image:
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M25.909 24.955H27.817V23.046H25.909V24.955ZM23.045 24.955H24.954V23.046H23.045V24.955ZM20.182 24.955H22.091V23.046H20.182V24.955ZM37.318 31.003L30.728 36.802V11.332L37.318 17.13V31.003ZM30.944 8.926C30.74 8.839 29.856 8.579 29.242 8.92L28.728 9.205V38.929L29.242 39.214C29.471 39.341 29.737 39.385 29.993 39.385C30.421 39.385 30.816 39.263 30.944 39.208L31.092 39.146L38.565 32.569C39.028 32.299 39.318 31.813 39.318 31.284V16.849C39.318 16.321 39.029 15.835 38.566 15.564L31.092 8.988L30.944 8.926ZM17.273 36.803L10.682 31.004V17.129L17.273 11.331V36.803ZM17.055 8.926L16.907 8.988L9.432 15.565C8.971 15.836 8.682 16.321 8.682 16.849V31.284C8.682 31.812 8.971 32.299 9.433 32.568L16.907 39.146L17.055 39.208C17.182 39.263 17.578 39.385 18.006 39.385C18.261 39.385 18.527 39.341 18.756 39.215L19.273 38.93V9.204L18.756 8.919C18.144 8.582 17.258 8.839 17.055 8.926ZM44 32.284L32.284 44H15.715L4 32.284V15.716L15.715 4H32.284L44 15.716V32.284ZM33.112 2H14.887L2 14.888V33.112L14.887 46H33.112L46 33.112V14.888L33.112 2Z" fill="#B0084D"/>\n' +
        "</svg>\n",
      type: "SNS",
    },
    position,
  },
  {
    id: "4",
    type: basicNodeType,
    data: {
      name: "/payment",
      image:
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7421 43.961H40.1971H43.9611V40.197V32.849H12.7421V43.961ZM10.7421 30.849H45.9611V40.197V45.961H40.1971H10.7421V30.849ZM7.76412 2C4.58612 2 2.00012 4.586 2.00012 7.765V40.197C2.00012 43.375 4.58612 45.961 7.76412 45.961H9.12012V43.961H7.76412C5.68812 43.961 4.00012 42.273 4.00012 40.197V7.765C4.00012 5.689 5.68812 4 7.76412 4H40.1971C42.2721 4 43.9611 5.689 43.9611 7.765V29.226H45.9611V7.765C45.9611 4.586 43.3751 2 40.1971 2H7.76412ZM43.0491 41.468H40.1951C41.0061 40.419 41.5801 39.642 41.9151 39.134C42.2521 38.627 42.4811 38.202 42.6081 37.859C42.7341 37.518 42.7971 37.185 42.7971 36.863C42.7971 36.255 42.6461 35.781 42.3461 35.441C42.0461 35.103 41.6251 34.933 41.0871 34.933C40.7791 34.933 40.4781 34.987 40.1851 35.096C39.8911 35.203 39.5871 35.377 39.2721 35.614V36.507C39.9361 36.059 40.4851 35.835 40.9201 35.835C41.4861 35.835 41.7681 36.198 41.7681 36.926C41.7681 37.255 41.6881 37.602 41.5271 37.965C41.3671 38.328 41.1011 38.785 40.7301 39.333C40.3601 39.883 39.8211 40.622 39.1141 41.552V42.339H43.0491V41.468ZM34.4781 43.85H35.4651L38.3071 34.429H37.3211L34.4781 43.85ZM33.1301 36.249C32.9451 36.001 32.6871 35.877 32.3591 35.877H31.3201V38.709H32.3591C32.6871 38.709 32.9451 38.584 33.1301 38.331C33.3141 38.08 33.4071 37.733 33.4071 37.293C33.4071 36.846 33.3141 36.497 33.1301 36.249ZM34.4141 37.293C34.4141 37.965 34.2341 38.503 33.8751 38.909C33.5141 39.315 33.0441 39.517 32.4641 39.517H31.3201V42.339H30.3341V35.069H32.4641C32.8541 35.069 33.1991 35.163 33.4971 35.352C33.7941 35.541 34.0211 35.804 34.1791 36.139C34.3371 36.475 34.4141 36.859 34.4141 37.293ZM24.7641 35.919H26.5691V42.339H27.5861V35.919H29.4011V35.069H24.7641V35.919ZM19.5181 35.919H21.3231V42.339H22.3411V35.919H24.1551V35.069H19.5181V35.919ZM17.5681 35.069H18.5861V42.339H17.5681V39.034H14.9251V42.339H13.9071V35.069H14.9251V38.206H17.5681V35.069Z" fill="#3F8624"/>\n' +
        "</svg>\n",
      type: "Http",
    },
    position,
  },
];

export const initialEdges: Edge<EdgeData>[] = [
  {
    id: "e1-2",
    type: basicEdgeType,
    source: "1",
    target: "2",
    label: "2",
    data: { time: "20ms", count: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-3",
    type: basicEdgeType,
    source: "2",
    target: "3",
    label: "3",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "e2-4",
    type: basicEdgeType,
    source: "2",
    target: "4",
    label: "4",
    data: { time: "20ms" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
];

const nodeTypes = { basicNode: BasicNode };

const edgeTypes = { basicEdge: BasicEdge };

export const TraceGraph = () => {
  const { nodes: layoutNodes, edges: layoutEdges } = getLayoutElements(
    initialNodes,
    initialEdges
  );

  const [loader, setLoader] = useState(false);
  const [nodes, , onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  useEffect(() => {
    const isGraphElReady = () => {
      return nodes.length > 0 && edges.length >= 0;
    };
    setLoader(isGraphElReady);
  }, []);

  return (
    <Paper sx={{ width: "100%" }}>
      {loader ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
        </ReactFlow>
      ) : (
        <Loader />
      )}
    </Paper>
  );
};
