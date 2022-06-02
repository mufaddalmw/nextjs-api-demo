import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.value += 1
      
      // const existingItem = state.cart.length && state.cart.find(({productId}) => productId === action.payload);
      const result = state.find( ({ productId }) => productId === action.payload );
      const resultIndex = state.findIndex( ({ productId }) => productId === action.payload );
      
      if (result && resultIndex > -1) {
        state[resultIndex].count = result.count + 1;
      } else {
        const cartObj = {
          productId: action.payload,
          count: 1
        }
        state.push(cartObj);
      }
    },
    decrement: (state, action) => {
      const result = state.find( ({ productId }) => productId === action.payload );
      const resultIndex = state.findIndex( ({ productId }) => productId === action.payload );
      if (result && resultIndex > -1) {
        state[resultIndex].count -= 1;
      }
    },
    increment: (state, action) => {
      const result = state.find( ({ productId }) => productId === action.payload );
      const resultIndex = state.findIndex( ({ productId }) => productId === action.payload );
      if (result && resultIndex > -1) {
        state[resultIndex].count += 1;
      }
    },
    /* incrementByAmount: (state, action) => {
      state.value += action.payload
    }, */
  },
})

// Action creators are generated for each case reducer function
export const { addToCart, decrement, increment } = cartSlice.actions

export default cartSlice.reducer