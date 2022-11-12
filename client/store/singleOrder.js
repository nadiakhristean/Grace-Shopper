import axios from "axios";

// ACTION TYPES
// Orders action types:
const SET_SINGLE_ORDER = "SET_SINGLE_ORDER";
const CREATE_SINGLE_ORDER = "CREATE_SINGLE_ORDER";

// Line items action types:
const GET_LINE_ITEMS = "GET_LINE_ITEMS";
const CREATE_LINE_ITEM = "CREATE_LINE_ITEM";
const DELETE_LINE_ITEM = "DELETE_LINE_ITEM";

// ACTION CREATORS
// Get order info:
export const setSingleOrder = (order) => {
  return {
    type: SET_SINGLE_ORDER,
    order,
  };
};

// Create new order:
export const _createSingleOrder = (order) => {
  return {
    type: CREATE_SINGLE_ORDER,
    order,
  };
};

// original version:
// export const _createSingleOrder = (product) => {
//   return {
//     type: CREATE_SINGLE_ORDER,
//     product,
//   };
// };

// Get line items for an order:
export const _getLineItems = (lineItems) => {
  return {
    type: GET_LINE_ITEMS,
    lineItems,
  };
};

// Create a new line item (adds line item to an order):
export const _createLineItem = (product) => {
  return {
    type: CREATE_LINE_ITEM,
    product,
  };
};

// Delete a line item:
export const _deleteLineItem = (product) => {
  return {
    type: DELETE_LINE_ITEM,
    product,
  };
};

// THUNKS
// Get order information for a specific order:
export const fetchSingleOrder = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      console.log("fetch single order data", data);
      dispatch(setSingleOrder(data));
    } catch (err) {
      console.log(err);
    }
  };
};

// Create new order and create a new line item with that order id:
export const createSingleOrder = (product) => {
  return async (dispatch) => {
    const { data: newOrder } = await axios.post(`/api/orders`);

    const { data: newLineItem } = await axios.post(
      `/api/orders/${newOrder.id}/lineItems`,
      product
    );

    dispatch(_createSingleOrder(newOrder));
    dispatch(_createLineItem(newLineItem));
  };
};

// original version:
// export const createSingleOrder = (product) => {
//   return async (dispatch) => {
//     const { data } = await axios.post(`/api/orders`, product);
//     dispatch(_createSingleOrder(data));
//   };
// };

// Get all line items for an order:
export const getLineItems = (orderId) => {
  return async (dispatch) => {
    try {
      const { data: lineItems } = await axios.get(
        `/api/orders/${orderId}/lineItems`
      );
      console.log("thunk get line items", lineItems);
      dispatch(_getLineItems(lineItems));
    } catch (error) {
      console.error(error);
    }
  };
};

// Create a new line item (without creating a new order):
export const createLineItem = (product, orderId) => {
  return async (dispatch) => {
    const { data: lineItem } = await axios.post(
      `/api/orders/${orderId}/lineItems`,
      product
    );
    dispatch(_createLineItem(lineItem));
  };
};

// Delete a line item
export const deleteLineItem = (product, orderId) => {
  console.log("thunk product", product);
  console.log("thunk order id", orderId);
  return async (dispatch) => {
    const { data: oldLineItem } = await axios.delete(
      `/api/orders/${orderId}/lineItems/${product.id}`,
      product
    );
    console.log("thunk delete line item data", oldLineItem);
    dispatch(_deleteLineItem(oldLineItem));
  };
};

// REDUCERS
// Orders Reducer:
export function singleOrderReducer(state = [], action) {
  switch (action.type) {
    case SET_SINGLE_ORDER:
      return action.order;
    case CREATE_SINGLE_ORDER:
      return action.order;
    default:
      return state;
  }
}

// Line Items Reducer:
export function lineItemsReducer(state = [], action) {
  switch (action.type) {
    case GET_LINE_ITEMS:
      return action.lineItems;
    case CREATE_LINE_ITEM:
      return [...state, action.product];
    case DELETE_LINE_ITEM:
      return state.filter((lineItem) => lineItem.id !== action.product.id);
    default:
      return state;
  }
}

// original version:
// const initialState = {
//   userId: "",
//   email: "",
//   status: "",
//   orderDate: "",
// };
// export default function singleOrderReducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_SINGLE_ORDER:
//       return action.order;
//     case CREATE_SINGLE_ORDER:
//       return action.product;
//     default:
//       return state;
//   }
// }
