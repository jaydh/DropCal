import * as React from "react";
import { AppBar, Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import Progress from "./Progress";

interface IProps {
  signedIn: boolean;
}

class Bar extends React.Component<IProps> {
  public render() {
    const { signedIn } = this.props;
    return (
      <>
        <Progress />
        <AppBar position="static">
          <Typography variant="h6" color="inherit">
            DropCal
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

export default connect(mapState)(Bar);
