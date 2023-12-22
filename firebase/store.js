import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
/*
{
  reducer: rootReducer,
  middleware: () => new Tuple(additionalMiddleware, logger),
  //middleware: [thunk],
}
*/