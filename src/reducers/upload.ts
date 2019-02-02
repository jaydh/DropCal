import produce from "immer";

export interface IUpload {
  file: any;
  progress: number;
}

export default (state = { uploads: [] as IUpload[] }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case "UPLOAD_FILE_REQUESTED":
        draft.uploads.push({ file: action.fileName, progress: 0 });
        break;
      case "UPDATE_UPLOAD_PROGRESS":
        draft.uploads = draft.uploads.map((t: IUpload) =>
          t.file === action.name ? { ...t, progress: action.value } : t
        );
        break;
      case "UPLOAD_FILE_SUCCESS":
        draft.uploads = draft.uploads.filter(
          (t: IUpload) => t.file !== action.files.data.name
        );
        break;
    }
  });
