import { Button } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import * as React from "react";
import { connect } from "react-redux";
import File from "./File";
import { withRouter } from "react-router-dom";

interface IProps {
  match: { params: { month: number; day: number; year: number } };
  files: any;
  history: any;
}

class DateView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  public render() {
    const { files } = this.props;
    return (
      <>
        <Button onClick={this.goHome} children={<Home />} />
        {files &&
          Object.keys(files).map((t: any) => (
            <File key={files[t].id} file={files[t]} />
          ))}
      </>
    );
  }
  private goHome = () => this.props.history.push("/");
}

const mapState = (state: any, ownProps: any) => {
  const { match } = ownProps;
  const { month, day, year } = match.params;
  return {
    files: state.files.dateMap[`${month}/${day}/${year}`]
      ? state.files.dateMap[`${month}/${day}/${year}`].files
      : undefined
  };
};

export default withRouter(connect(mapState)(DateView));
