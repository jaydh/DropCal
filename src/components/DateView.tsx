import { Button } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import File from "./File";

interface IProps {
  match: { params: { month: number; day: number; year: number } };
  files: any;
}

class DateView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  public render() {
    const { files } = this.props;
    return (
      <>
        {files &&
          Object.keys(files).map((t: any) => (
            <File key={files[t].id} file={files[t]} />
          ))}
      </>
    );
  }
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

export default connect(mapState)(DateView);
