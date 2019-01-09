import * as React from "react";
import { LinearProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { IUpload } from "../reducers/upload";

interface IProps {
  uploads: IUpload[];
}

class Progress extends React.Component<IProps> {
  public render() {
    const { uploads } = this.props;
    return (
      <>
        {uploads.map((t: IUpload) => (
          <LinearProgress
            key={t.file}
            color="secondary"
            variant="determinate"
            value={Math.round(t.progress * 100)}
          />
        ))}
      </>
    );
  }
}

const mapState = (state: any) => {
  return { uploads: state.upload.uploads };
};

export default connect(mapState)(Progress);
