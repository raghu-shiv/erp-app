"use client";

import { calculateBilling } from "@/lib/billing";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

export type PosProduct = {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  price: number;
  taxRate: number;
  stockQuantity: number;
  unit: string;
  category: string;
};

export type CartItem = PosProduct & { quantity: number };

export type ReceiptSummary = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
};

type PaymentMethod = "CASH" | "UPI";

type CartState = {
  items: CartItem[];
  discountPercent: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  receipt: ReceiptSummary | null;
};

type CartAction =
  | { type: "ADD_PRODUCT"; product: PosProduct }
  | { type: "SET_QUANTITY"; product: PosProduct; quantity: number }
  | { type: "SET_DISCOUNT"; discountPercent: number }
  | { type: "SET_PAYMENT_METHOD"; paymentMethod: PaymentMethod }
  | { type: "SET_PAYMENT_REFERENCE"; paymentReference: string }
  | { type: "COMPLETE_CHECKOUT"; receipt: ReceiptSummary };

const initialState: CartState = {
  items: [],
  discountPercent: 0,
  paymentMethod: "CASH",
  paymentReference: "",
  receipt: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const existing = state.items.find(
        (item) => item.id === action.product.id,
      );
      const quantity = (existing?.quantity ?? 0) + 1;
      if (quantity > action.product.stockQuantity) return state;
      return {
        ...state,
        items: existing
          ? state.items.map((item) =>
              item.id === action.product.id ? { ...item, quantity } : item,
            )
          : [...state.items, { ...action.product, quantity: 1 }],
      };
    }
    case "SET_QUANTITY":
      return {
        ...state,
        items:
          action.quantity <= 0
            ? state.items.filter((item) => item.id !== action.product.id)
            : state.items.map((item) =>
                item.id === action.product.id
                  ? { ...item, quantity: action.quantity }
                  : item,
              ),
      };
    case "SET_DISCOUNT":
      return { ...state, discountPercent: action.discountPercent };
    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.paymentMethod };
    case "SET_PAYMENT_REFERENCE":
      return { ...state, paymentReference: action.paymentReference };
    case "COMPLETE_CHECKOUT":
      return { ...initialState, receipt: action.receipt };
  }
}

type CartContextValue = CartState & {
  billing: ReturnType<typeof calculateBilling>;
  addProduct: (product: PosProduct) => boolean;
  setQuantity: (product: PosProduct, quantity: number) => boolean;
  setDiscountPercent: (discountPercent: number) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  setPaymentReference: (paymentReference: string) => void;
  completeCheckout: (receipt: ReceiptSummary) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const billing = useMemo(
    () =>
      calculateBilling(
        state.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          taxRate: item.taxRate,
        })),
        state.discountPercent,
      ),
    [state.items, state.discountPercent],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      billing,
      addProduct(product) {
        const current = state.items.find((item) => item.id === product.id);
        if ((current?.quantity ?? 0) + 1 > product.stockQuantity) return false;
        dispatch({ type: "ADD_PRODUCT", product });
        return true;
      },
      setQuantity(product, quantity) {
        if (quantity > product.stockQuantity) return false;
        dispatch({ type: "SET_QUANTITY", product, quantity });
        return true;
      },
      setDiscountPercent(discountPercent) {
        dispatch({ type: "SET_DISCOUNT", discountPercent });
      },
      setPaymentMethod(paymentMethod) {
        dispatch({ type: "SET_PAYMENT_METHOD", paymentMethod });
      },
      setPaymentReference(paymentReference) {
        dispatch({ type: "SET_PAYMENT_REFERENCE", paymentReference });
      },
      completeCheckout(receipt) {
        dispatch({ type: "COMPLETE_CHECKOUT", receipt });
      },
    }),
    [billing, state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
