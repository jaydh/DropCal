import * as React from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardHeader,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import { Details, Edit, OpenInBrowser, Save } from "@material-ui/icons";
import axios from "axios";

interface IState {
  open: boolean;
  val?: string;
}

interface IProps {
  file: any;
  classes: any;
}

const styles = {
  root: {
    width: "300px",
    height: "200px"
  },
  actions: { display: "flex" },
  avatar: {
    height: "20px",
    width: "20px"
  }
};

class File extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      open: false
    };
  }
  public render() {
    const { classes, file } = this.props;
    console.log(file);
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              src={file.hasThumbnail ? file.thumbnailLink : file.iconLink}
            />
          }
          title={file.name}
          action={
            <>
              <IconButton onClick={this.handleGoogleOpen}>
                <OpenInBrowser />
              </IconButton>
              <IconButton onClick={this.handleClick}>
                <Save />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Details />
            <Typography component="p">{file.description}</Typography>

            <IconButton color="primary" onClick={this.handleClickOpen}>
              <Edit />
            </IconButton>
          </CardActions>
        </CardContent>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>Change file description</DialogContentText>
            <form onSubmit={this.handleEdit}>
              <TextField
                autoFocus={true}
                onChange={this.handleChange}
                defaultValue={file.description}
                margin="dense"
                id="name"
                label="Description"
                type="text"
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleEdit} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>{" "}
      </Card>
    );
  }
  private handleClick = () => window.open(this.props.file.webContentLink);

  private handleEdit = () =>
    axios({
      url: `https://www.googleapis.com/drive/v3/files/${this.props.file.id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${window.gapi.client.getToken().access_token}`
      },
      data: {
        description: this.state.val
      }
    }).then((res: any) => this.setState({ open: false }));

  private handleClickOpen = () => this.setState({ open: true });
  private handleClose = () => this.setState({ open: false });
  private handleChange = (e: any) => {
    e.preventDefault();
    this.setState({ val: e!.target!.value });
  };
  private handleGoogleOpen = () => window.open(this.props.file.webPreviewLink);
}

export default withStyles(styles)(File);
