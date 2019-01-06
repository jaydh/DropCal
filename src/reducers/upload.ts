import produce from "immer";

export default (state = { progress: undefined }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case "UPDATE_UPLOAD_PROGRESS":
        draft.progress = action.value;

        break;
    }
  });
