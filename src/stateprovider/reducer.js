// export const initialState = {
//   user: null,
// };

// const reducer = (state, action) => {
//   console.log(action);
//   switch (action.type) {
//     case "SET_USER":
//       return { ...state, user: action.user };
//     case "LOGOUT":
//       return { ...state, user: null };
//     default:
//       return state;
//   }
// };
// export default reducer;
// state.js
export const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      // Persist user to localStorage
      localStorage.setItem("user", JSON.stringify(action.user));
      return { ...state, user: action.user };
    case "LOGOUT":
      // Remove user from localStorage on logout
      localStorage.removeItem("user");
      return { ...state, user: null };
    default:
      return state;
  }
};

export default reducer;
