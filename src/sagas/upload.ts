import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { store } from "../index";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* uploadFile(action: any) {
  try {
    const files = yield call(handleUpload, action);
    yield put({ type: "UPLOAD_FILE_SUCCESS", files });
    yield put({ type: "FETCH_FILES_REQUESTED" });
  } catch (e) {
    yield put({ type: "UPLOAD_FILE_FAILED", message: e.message });
  }
}
function* mySaga() {
  yield takeEvery("UPLOAD_FILE_REQUESTED", uploadFile);
}

const handleUpload = async (action: any) => {
  const { driveData, file } = action;
  const dir = driveData
    ? driveData.id
    : await createDir(action.rootDir, action.day);

  return window.gapi.client.drive.files
    .create({
      "content-type": "application/json",
      uploadType: "multipart",
      name: file.name,
      mimeType: file.type,
      fields: "id, name, kind, size",
      parents: [dir]
    })
    .then((response: any) => {
      return axios({
        url: `https://www.googleapis.com/upload/drive/v3/files/${
          response.result.id
        }`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${window.gapi.client.getToken().access_token}`,
          "Content-Type": file.type
        },
        data: file,
        onUploadProgress: (p: any) =>
          store.dispatch({
            type: "UPDATE_UPLOAD_PROGRESS",
            name: file.name,
            value: p.loaded / p.total
          })
      });
    });
};

const createDir = (rootDir: any, day: any) => {
  const rootDirId = rootDir.id;
  const fileMetadata = {
    name: day.toLocaleDateString(),
    mimeType: "application/vnd.google-apps.folder",
    parents: [rootDirId]
  };
  return window.gapi.client.drive.files
    .create({
      resource: fileMetadata,
      fields: "id"
    })
    .then((res: any) => res.result.id);
};

export default mySaga;
