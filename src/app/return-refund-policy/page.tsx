
export default function ReturnRefundPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Return & Refund Policy</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4">
          We want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Returns</h2>
        <p className="mb-4">
          You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging. Your item needs to have the receipt or proof of purchase.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Refunds</h2>
        <p className="mb-4">
          Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Shipping</h2>
        <p className="mb-4">
          You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions on how to return your item to us, contact us at <a href="mailto:support@mrshopy.com">support@mrshopy.com</a>.
        </p>
      </div>
    </div>
  );
}
