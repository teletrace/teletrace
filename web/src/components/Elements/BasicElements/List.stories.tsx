import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Drafts, Inbox } from "../ResouceIcon";

export default {
  component: List,
  title: "List",
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = () => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 360,
      bgcolor: "background.paper",
      color: "white",
    }}
  >
    <nav aria-label="main mailbox folders">
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Drafts />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
    <Divider />
    <nav aria-label="secondary mailbox folders">
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Trash" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Spam" />
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  </Box>
);

export const Primary = Template.bind({});
