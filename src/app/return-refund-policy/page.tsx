
export default function ReturnRefundPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Return & Refund Policy</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4">
          Thank you for shopping at MRSHOPY.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">All Sales Are Final</h2>
        <p className="mb-4">
          All sales are final. We do not accept returns, exchanges, or provide refunds for any products purchased through our store. Please make your selection carefully.
        </p>
        
        <h2 className="mt-6 mb-2 text-2xl font-semibold">Damaged or Incorrect Items</h2>
        <p className="mb-4">
          In the unlikely event that you receive a damaged or incorrect item, please contact our customer support within 48 hours of receiving your order. We will work with you to resolve the issue on a case-by-case basis.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about our Return & Refund Policy, please contact us at <a href="mailto:support@mrshopy.com">support@mrshopy.com</a>.
        </p>
      </div>
    </div>
  );
}
