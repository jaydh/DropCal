import * as React from "react";
import { LinearProgress } from "@material-ui/core";
import { connect } from "react-redux";

interface IProps {
  value: number;
}

class Progress extends React.Component<IProps> {
  public render() {
    const { value } = this.props;
    return (
      <LinearProgress
        color="secondary"
        variant="determinate"
        value={Math.round(value * 100)}
      />
    );
  }
}

const mapState = (state: any) => {
  return { value: state.upload.progress };
};

export default connect(mapState)(Progress);
