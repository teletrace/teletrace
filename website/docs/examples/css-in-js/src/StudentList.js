import { ThemeProvider } from "react-jss";
import { createTheme } from "@mui/material/styles";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";

const theme = createTheme();

const StudentList = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <List
        dense
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      >
        <ListItem>
          <ListItemIcon>
            <BackpackIcon />
          </ListItemIcon>
          <ListItemText primary={props.name} secondary={props.addr} />
        </ListItem>
      </List>
    </ThemeProvider>
  );
};

export default StudentList;
