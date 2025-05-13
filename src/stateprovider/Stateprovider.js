// This line imports necessary hooks and functions from the React library.
// createContext: Used to create a new context object.
// useContext: Used to consume the context value.
// useReducer: A hook used for managing state using the reducer pattern.
import { createContext, useContext, useReducer } from "react";

// This line creates a new context object named StateContext using the createContext() function. This context will be used to share state between components.
export const StateContext = createContext();

// reducer: A function that specifies how state transitions occur.
// initialState: The initial state of the application.
// children: The child components wrapped by the StateProvider
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
