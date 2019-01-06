import * as React from "react";
import { Avatar, Button, Tooltip, withStyles } from "@material-ui/core";

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
    console.log(file);
    return (
      <Tooltip title={file.name}>
        <Button variant="fab" mini={true} onClick={this.handleClick}>
          <a target={file.webContentLink}>
            <Avatar
              className={classes.avatar}
              src={file.hasThumbnail ? file.thumbnailLink : file.iconLink}
            />
          </a>
        </Button>
      </Tooltip>
    );
  }

  private handleClick() {
    window.open(this.props.file.webContentLink);
  }
}

export default withStyles(styles)(File);
