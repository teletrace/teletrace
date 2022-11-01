import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root-reducer";

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;
