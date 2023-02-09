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

import { memo, useEffect, useState } from "react";
import type { FC, PropsWithChildren } from "react";
import {
  ControlButton,
  Panel,
  useReactFlow,
  useStore,
  useStoreApi,
} from "reactflow";
import type { ReactFlowState } from "reactflow";

import {
  FitViewIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  UnlockIcon,
} from "./Icons";
import type { ControlProps } from "./types";
import "./styles.css";

const isInteractiveSelector = (s: ReactFlowState) =>
  s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;
const CustomControlsImpl: FC<PropsWithChildren<ControlProps>> = ({
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  position = "bottom-left",
}) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const isInteractive = useStore(isInteractiveSelector);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn?.();
  };

  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut?.();
  };

  const onFitViewHandler = () => {
    fitView(fitViewOptions);
    onFitView?.();
  };

  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive,
    });

    onInteractiveChange?.(!isInteractive);
  };

  return (
    <Panel position={position}>
      {showZoom && (
        <>
          <ControlButton
            onClick={onZoomInHandler}
            title="zoom in"
            aria-label="zoom in"
          >
            <PlusIcon />
          </ControlButton>
          <ControlButton
            onClick={onZoomOutHandler}
            title="zoom out"
            aria-label="zoom out"
          >
            <MinusIcon />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <FitViewIcon />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton
          onClick={onToggleInteractivity}
          title="toggle interactivity"
          aria-label="toggle interactivity"
        >
          {isInteractive ? <UnlockIcon /> : <LockIcon />}
        </ControlButton>
      )}
    </Panel>
  );
};

export const CustomControls = memo(CustomControlsImpl);
