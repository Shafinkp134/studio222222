
export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Shipping Policy</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4">
          Thank you for visiting and shopping at MRSHOPY. The following are the terms and conditions that constitute our Shipping Policy.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Shipment processing time</h2>
        <p className="mb-4">
          All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Shipping rates & delivery estimates</h2>
        <p className="mb-4">
          Shipping charges for your order will be calculated and displayed at checkout. For our Cash on Delivery (COD) service, a nominal fee might be applied. Delivery delays can occasionally occur.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Shipment confirmation & Order tracking</h2>
        <p className="mb-4">
          You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Damages</h2>
        <p className="mb-4">
          MRSHOPY is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
        </p>
      </div>
    </div>
  );
}
