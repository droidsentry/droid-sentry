// type StripeCustomer = {
//   id: string;
//   object: string;
//   address: string | null;
//   balance: number;
//   created: number;
//   currency: string | null;
//   default_source: string | null;
//   delinquent: boolean;
//   description: string | null;
//   discount: string | null;
//   email: string;
//   invoice_prefix: string;
//   invoice_settings: {
//     custom_fields: string | null;
//     default_payment_method: string | null;
//     footer: string | null;
//     rendering_options: string | null;
//   };
//   livemode: boolean;
//   metadata: StripeCustomerMetadata;
//   name: string;
//   next_invoice_sequence: number;
//   phone: string | null;
//   preferred_locales: string[];
//   shipping: string | null;
//   tax_exempt: string;
//   test_clock: string | null;
// };

export type StripeCustomerMetadata = {
  appUserId?: string;
};
