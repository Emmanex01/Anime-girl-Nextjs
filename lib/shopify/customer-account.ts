import {
  getCustomerApiConfiguration,
} from "@/lib/auth/oauth";
import {
  getCustomerSession,
} from "@/lib/auth/session";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
};

export async function customerAccountQuery<
  TData,
  TVariables extends Record<
    string,
    unknown
  > = Record<string, unknown>,
>(
  query: string,
  variables?: TVariables,
  operationName?: string,
): Promise<TData> {
  const session =
    await getCustomerSession();

  if (!session) {
    throw new Error(
      "CUSTOMER_UNAUTHENTICATED",
    );
  }

  const config =
    await getCustomerApiConfiguration();

  const response = await fetch(
    config.graphql_api,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: session.accessToken,
      },
      body: JSON.stringify({
        operationName,
        query,
        variables: variables ?? {},
      }),
      cache: "no-store",
    },
  );

if (response.status === 401) {
  const body = await response.text();

  console.error("Shopify Customer Account API 401:", {
    status: response.status,
    body,
    endpoint: config.graphql_api,
  });

  throw new Error(
    "CUSTOMER_UNAUTHENTICATED",
  );
}

  if (!response.ok) {
    throw new Error(
      `Customer Account API returned ${response.status}`,
    );
  }

  const result =
    (await response.json()) as GraphQLResponse<TData>;

  if (result.errors?.length) {
    console.error(
      "Customer Account API GraphQL errors",
      result.errors,
    );

    throw new Error(
      "Customer Account API request failed",
    );
  }

  if (!result.data) {
    throw new Error(
      "Customer Account API returned no data",
    );
  }

  return result.data;
}