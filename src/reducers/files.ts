import produce from "immer";

export default (state = { rootDir: undefined, dateMap: {} }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case "FETCH_FILES_SUCCESS":
        draft.dateMap = action.files;
        break;
      case "SET_ROOT":
        draft.rootDir = action.value;
        break;
    }
  });
