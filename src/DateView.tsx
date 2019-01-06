import { Button } from "@material-ui/core";
import * as React from "react";

interface IProps {
  match: { params: { month: number; day: number; year: number } };
}

class DateView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
  }
  public render() {
    const { match } = this.props;
    const { month, day, year } = match.params;
    return (
      <>
        <Button onClick={this.listFiles}>dd</Button>
      </>
    );
  }
  private listFiles() {}

  private handleUpload(file: any) {
    const folderId = "16wFQQVAupq2Ohz_mlBhZ91z4jmy0SCot";
    const metadata = {
      name: file.name,
      mimeType: file.type
    };

    window.gapi.client.drive.files
      .create({
        "content-type": "application/json",
        uploadType: "multipart",
        name: file.name,
        mimeType: file.type,
        fields: "id, name, kind, size",
        parents: [folderId]
      })
      .then((response: any) => {
        fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${
            response.result.id
          }`,
          {
            method: "PATCH",
            headers: new Headers({
              Authorization: `Bearer ${
                window.gapi.client.getToken().access_token
              }`,
              "Content-Type": file.type
            }),
            body: file
          }
        ).then(res => console.log(res));
      });
  }
}

export default DateView;
