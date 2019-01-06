import produce from "immer";

export default (state = { signedIn: false }, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case "SET_SIGN_IN":
        draft.signedIn = action.value;
        break;
    }
  });
