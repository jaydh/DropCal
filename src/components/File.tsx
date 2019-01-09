import * as React from "react";
import { Avatar, Fab, Tooltip, withStyles } from "@material-ui/core";

interface IProps {
  file: any;
  classes: any;
}

const styles = {
  avatar: {
    height: "20px",
    width: "20px"
  }
};

class File extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  public render() {
    const { classes, file } = this.props;
    return (
      <Tooltip title={file.name}>
        <Fab size="small" onClick={this.handleClick}>
          <a target={file.webContentLink}>
            <Avatar
              className={classes.avatar}
              src={file.hasThumbnail ? file.thumbnailLink : file.iconLink}
            />
          </a>
        </Fab>
      </Tooltip>
    );
  }

  private handleClick() {
    window.open(this.props.file.webContentLink);
  }
}

export default withStyles(styles)(File);
