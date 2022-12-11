/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Box } from "@mui/material";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { ResourceIcon } from "@/components/Elements/ResourceIcon";

import { NodeData } from "../types";
import { styles } from "./styles";

const BasicNodeImpl = (props: NodeProps<NodeData>) => {
  const { image, name, type, color } = props.data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
      />
      <Box sx={styles.nodeBox}>
        <Box
          sx={{
            ...styles.nodeIconBox,
            borderColor: color,
          }}
        >
          <ResourceIcon name={image} style={styles.nodeIcon} />
        </Box>
        <Box sx={styles.nodeName}>{name}</Box>
        <Box sx={styles.nodeService}>{type}</Box>
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ visibility: "hidden" }}
      />
    </>
  );
};

export const BasicNode = memo(BasicNodeImpl);
