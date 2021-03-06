import * as React from "react";
import { AppBar, Button, Typography, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import Progress from "./Progress";
import { Link } from "react-router-dom";

const styles = {
  link: {
    decorations: "none"
  }
};

interface IProps {
  signedIn: boolean;
  classes: any;
}

class Bar extends React.Component<IProps> {
  public render() {
    const { signedIn, classes } = this.props;
    return (
      <>
        <Progress />
        <AppBar position="static">
          <Typography className={classes.link} variant="h6" color="inherit">
            <Link className={classes.link} to="/">
              DropCal
            </Link>
          </Typography>
          {signedIn ? (
            <Button onClick={this.handleSignoutClick}>Sign Out</Button>
          ) : (
            <Button onClick={this.handleAuthClick}>Sign In</Button>
          )}
        </AppBar>
      </>
    );
  }

  private handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  private handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };
}
const mapState = (state: any) => {
  return { signedIn: state.user.signedIn };
};

export default connect(mapState)(withStyles(styles)(Bar));
