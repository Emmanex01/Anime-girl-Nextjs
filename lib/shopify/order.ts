import {
  customerAccountQuery,
} from "./customer-account";

const ORDERS_QUERY = /* GraphQL */ `
  query Orders($first: Int!) {
    customer {
      orders(first: $first) {
        nodes {
          id
          number
          processedAt

          financialStatus

          fulfillmentStatus

          totalPrice {
            amount
            currencyCode
          }

          lineItems(first: 10) {
            nodes {
              title
              quantity
            }
          }
        }
      }
    }
  }
`;

export type CustomerOrder = {
  id: string;
  number: string;
  processedAt: string;

  financialStatus: string | null;
  fulfillmentStatus: string | null;

  totalPrice: {
    amount: string;
    currencyCode: string;
  };

  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
    }>;
  };
};

export async function getCustomerOrders() {
  const result =
    await customerAccountQuery<{
      customer: {
        orders: {
          nodes: CustomerOrder[];
        };
      };
    }>(
      ORDERS_QUERY,
      {
        first: 20,
      },
      "Orders",
    );

  return result.customer.orders.nodes;
}