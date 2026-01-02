
export default function PaymentPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Payment Policy</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4 text-lg">
          To make your shopping experience as simple as possible, we currently offer one primary payment method.
        </p>

        <h2 className="mt-8 mb-2 text-2xl font-semibold">Cash on Delivery (COD)</h2>
        <p className="mb-4">
          All orders placed through our website are eligible for Cash on Delivery. This means you can pay for your order in cash at the time of delivery when you collect it from the courier office.
        </p>
        <p className="mb-4">
          Please ensure you have the exact amount ready to avoid any inconvenience. The courier will not be able to provide change.
        </p>
        
        <h2 className="mt-8 mb-2 text-2xl font-semibold">No Online Payments</h2>
        <p className="mb-4">
          Currently, we do not accept online payments (credit cards, debit cards, net banking, etc.). We are working on integrating more payment options in the future.
        </p>

        <h2 className="mt-8 mb-2 text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about our Payment Policy, please feel free to contact us.
        </p>
      </div>
    </div>
  );
}
