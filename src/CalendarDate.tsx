import * as React from "react";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  withStyles,
  Typography
} from "@material-ui/core";
import { Fullscreen } from "@material-ui/icons";
import { isToday } from "date-fns";
import { Link } from "react-router-dom";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import File from "./File";

interface IProps {
  day: Date;
  driveData: any;
  classes: any;
  rootDir: any;
  updateProgress: (val: number) => void;
  uploadFile: (file: any, rootDir: any, day: Date, driveData: any) => void;
}

interface IState {
  showExpand: boolean;
}

const styles = {
  root: {
    width: "12vw",
    height: "19vh"
  },
  today: {
    backgroundColor: "#CAE9F5"
  },
};

class Calendar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { showExpand: false };

    this.dropHandler = this.dropHandler.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.toggleShowExpand = this.toggleShowExpand.bind(this);
  }

  public render() {
    const { classes, day, driveData } = this.props;
    const { showExpand } = this.state;
    return (
      <div
        onDrop={this.dropHandler}
        onDragOver={this.handleDrag}
        onMouseEnter={this.toggleShowExpand}
        onMouseLeave={this.toggleShowExpand}
      >
        <Card className={classes.root}>
          <CardHeader
            title={day.getDate()}
            className={isToday(day) ? classes.today : ""}
            action={
              <Fade in={showExpand}>
                <IconButton
                  children={
                    <Link to={"/date/" + day.toLocaleDateString()}>
                      <Fullscreen />
                    </Link>
                  }
                />
              </Fade>
            }
          />
          <CardContent>
            <List dense={true}>
              {driveData &&
                driveData.files.map((t: any) => (
                  <ListItem key={"files" + t.id}>
                    <ListItemIcon children={<File file={t} />} />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </div>
    );
  }

  private createDir() {
    const { rootDir, day } = this.props;
    const rootDirId = rootDir.id;
    const fileMetadata = {
      name: day.toLocaleDateString(),
      mimeType: "application/vnd.google-apps.folder",
      parents: [rootDir]
    };
    return window.gapi.client.drive.files
      .create({
        resource: fileMetadata,
        fields: "id"
      })
      .then((res: any) => res.result.id);
  }

  private dropHandler(ev: any) {
    const { rootDir, day, driveData, uploadFile } = this.props;
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          const file = ev.dataTransfer.items[i].getAsFile();
          uploadFile(file, rootDir, day, driveData);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        uploadFile(ev.dataTransfer.files[i], rootDir, day, driveData);
      }
    }
    this.removeDragData(ev);
    return undefined;
  }
  private handleDrag(event: any) {
    event.preventDefault();
    return undefined;
  }
  private toggleShowExpand() {
    this.setState({ showExpand: !this.state.showExpand });
  }
  private removeDragData(ev: any) {
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }
}

const mapState = (state: any, ownProps: any) => {
  return {
    driveData: state.files.dateMap
      ? state.files.dateMap[ownProps.day.toLocaleDateString()]
      : undefined,
    rootDir: state.files.rootDir
  };
};

const mapDispatch = (dispatch: any) =>
  bindActionCreators(
    {
      updateProgress: (value: number) => {
        return { type: "UPDATE_UPLOAD_PROGRESS", value };
      },
      uploadFile: (file: any, rootDir: any, day: Date, driveData: any) => {
        return { type: "UPLOAD_FILE_REQUESTED", file, rootDir, day, driveData };
      }
    },
    dispatch
  );

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Calendar));
