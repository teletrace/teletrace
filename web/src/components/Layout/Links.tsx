import { Article, GitHub } from "@mui/icons-material";
import { Button, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { Fragment, useState } from "react";

import { ResourceIcon } from "../Elements/ResourceIcon";

import { LUPA_BUILD_COMMIT, LUPA_BUILD_TAG } from "@/config";

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
