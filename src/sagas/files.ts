import { call, put, takeLatest } from 'redux-saga/effects';
import { parse } from 'date-fns';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action: any) {
  try {
    const files = yield call(getFiles);
    yield put({ type: 'FETCH_FILES_SUCCESS', files: files });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}
function* mySaga() {
  yield takeLatest('FETCH_FILES_REQUESTED', fetchUser);
}

const getFiles = async () => {
  const files = await window.gapi.client.drive.files
    .list({
      includeTeamDriveItems: false,
      spaces: 'drive',
      fields: 'nextPageToken, files'
    })
    .then((res: any) => (res.result.files ? res.result.files : undefined));

  const folders = Object.entries(files).filter(
    (t: any) => t[1].mimeType === 'application/vnd.google-apps.folder'
  );
  const file = Object.entries(files).filter(
    (t: any) => t[1].mimeType !== 'application/vnd.google-apps.folder'
  );

  const dateM: any = {};
  folders.forEach((entry: any) => {
    const val = entry[1];
    const name = val.name;
    if (parse(name).toLocaleDateString() !== 'Invalid Date') {
      dateM[parse(name).toLocaleDateString()] = {
        id: val.id,
        files: []
      };
    }
  });
  file.forEach((t: any) => {
    const p = Object.entries(dateM).find(
      (entry: any) => entry[1].id === t[1].parents[0]
    );
    if (p) {
      const parentKey = p[0];
      dateM[parentKey].files.push(t[1]);
    }
  });
  return dateM;
};

export default mySaga;
