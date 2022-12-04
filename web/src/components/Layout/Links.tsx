/**
 * Copyright 2022 Epsagon
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

import { Article, GitHub } from "@mui/icons-material";
import { Button, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { Fragment, useState } from "react";

import { LUPA_BUILD_COMMIT, LUPA_BUILD_TAG } from "@/config";

import { ResourceIcon } from "../Elements/ResourceIcon";

const links = [
  {
    icon: <ResourceIcon name="slack" />,
    label: "Slack",
    link: "https://join.slack.com/t/lupa-space/shared_invite/zt-1kyuehmaq-Dbut6qMpKak~SHx1DmZTEQ",
  },
  {
    icon: <GitHub />,
    label: "Github",
    link: "https://github.com/epsagon/lupa",
  },
  {
    icon: <Article />,
    label: "Documentation",
    link: "",
  },
];

export const Links = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const openLink = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <Fragment>
      {links.map((link, i) => (
        <Button
          key={i}
          startIcon={link.icon}
          onClick={() => openLink(link.link)}
        >
          {link.label}
        </Button>
      ))}

      <Button onClick={handleClick}>About</Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClick={handleClose}
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem disabled>
            <ListItemText>
              Lupa {LUPA_BUILD_TAG}{" "}
              {LUPA_BUILD_COMMIT && `(${LUPA_BUILD_COMMIT})`}
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Fragment>
  );
};
