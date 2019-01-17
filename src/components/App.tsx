import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import Calendar from "./Calendar";
import DateView from "./DateView";
import { AppBar, Button, Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Bar from "./Bar";

declare global {
  interface Window {
    gapi: any;
  }
}

interface IProps {
  setSignIn: (t: boolean) => void;
  setRoot: (t: any) => void;
  getFiles: () => void;
}

interface IState {
  gapiLoaded: boolean;
}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      gapiLoaded: false
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.getFolderId = this.getFolderId.bind(this);
  }
  public componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = this.handleLoad;
    document.body.appendChild(script);
  }
  public render() {
    const { gapiLoaded } = this.state;
    return (
      <>
        <Bar />
        {gapiLoaded ? (
          <BrowserRouter>
            <Switch>
              <>
                <Route path="/" exact={true} component={Calendar} />
                <Route path="/cal" component={Calendar} />
                <Route path="/date/:month/:day/:year" component={DateView} />
              </>
            </Switch>
          </BrowserRouter>
        ) : (
          <CircularProgress />
        )}
      </>
    );
  }

  private handleLoad() {
    const callback = () =>
      this.initClient().then(() => this.setState({ gapiLoaded: true }));

    window.gapi.load("client:auth2", callback);
  }
  private initClient() {
    const CLIENT_ID =
      "77453659148-i2e4h57lga0lr5lhr4691u72nf8emr41.apps.googleusercontent.com";
    const API_KEY = "AIzaSyC1fHkOSa-v1F4TOo_1gCS23ItJZQltxvE";

    // Array of API discovery doc URLs for APIs used by the quickstart
    const DISCOVERY_DOCS = [
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    ];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = "https://www.googleapis.com/auth/drive.file";

    return window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(() => {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(this.updateSigninStatus);

        // Handle the initial sign-in state.
        this.updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
      });
  }

  private getFolderId() {
    return window.gapi.client.drive.files
      .list({
        q:
          "mimeType = 'application/vnd.google-apps.folder' and name = 'DropCal'",
        includeTeamDriveItems: false,
        spaces: "drive",
        fields: "nextPageToken, files"
      })
      .then((response: any) => {
        const files = response.result.files;
        return files && files.length > 0 ? files[0] : undefined;
      })
      .then((folder?: { id: string; name: string }) =>
        folder ? this.props.setRoot(folder) : this.createFolder()
      );
  }

  private createFolder() {
    const fileMetadata = {
      name: "DropCal",
      mimeType: "application/vnd.google-apps.folder"
    };
    window.gapi.client.drive.files
      .create({
        resource: fileMetadata,
        fields: "id"
      })
      .then((res: any) => {
        if (res.err) {
          // Handle error
          console.error(res.err);
        }
      });
  }

  private updateSigninStatus(isSignedIn: boolean) {
    if (isSignedIn) {
      this.getFolderId();
      this.props.getFiles();
    }
    this.props.setSignIn(isSignedIn);
  }
}

const mapDispatch = (dispatch: any) =>
  bindActionCreators(
    {
      setSignIn: (value: boolean) => {
        return { type: "SET_SIGN_IN", value };
      },
      setRoot: (value: any) => {
        return { type: "SET_ROOT", value };
      },
      getFiles: () => {
        return { type: "FETCH_FILES_REQUESTED" };
      }
    },
    dispatch
  );

export default connect(
  undefined,
  mapDispatch
)(App);
