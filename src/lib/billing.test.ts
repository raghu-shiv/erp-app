import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateBilling, toCents } from "./billing";

describe("calculateBilling", () => {
  it("calculates GST and discounts in integer cents", () => {
    const result = calculateBilling(
      [{ productId: "rice", name: "Rice", quantity: 2, unitPrice: 99.99, taxRate: 5 }],
      10,
    );

    assert.deepEqual(result, {
      lines: [{
        productId: "rice",
        name: "Rice",
        quantity: 2,
        unitPrice: 99.99,
        taxRate: 5,
        grossAmount: 199.98,
        discountAmount: 20,
        subtotal: 179.98,
        taxAmount: 9,
        totalAmount: 188.98,
      }],
      subtotal: 179.98,
      taxAmount: 9,
      discountAmount: 20,
      totalAmount: 188.98,
    });
  });

  it("rejects invalid quantities and discount percentages", () => {
    assert.throws(() => calculateBilling([{ productId: "x", name: "X", quantity: 0, unitPrice: 1, taxRate: 0 }]));
    assert.throws(() => calculateBilling([], 101));
  });

  it("rounds floating-point money values to cents", () => {
    assert.equal(toCents(0.1 + 0.2), 30);
  });
});

