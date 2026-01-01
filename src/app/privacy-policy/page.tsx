
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Privacy Policy</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4">
          Welcome to MRSHOPY. We are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information from you such as your name, email
          address, postal address, phone number, and payment information when you
          make a purchase, create an account, or contact us.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">How We Use Your Information</h2>
        <ul className="mb-4 list-disc pl-5">
          <li>To process and fulfill your orders.</li>
          <li>To communicate with you about your orders and provide customer support.</li>
          <li>To improve our website and services.</li>
          <li>To send you promotional materials, if you opt-in.</li>
        </ul>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Sharing Your Information</h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer to outside parties your
          Personally Identifiable Information unless we provide users with
          advance notice. This does not include website hosting partners and
          other parties who assist us in operating our website, conducting our
          business, or serving our users, so long as those parties agree to
          keep this information confidential.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Security of Your Information</h2>
        <p className="mb-4">
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="mt-6 mb-2 text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@mrshopy.com.
        </p>
      </div>
    </div>
  );
}
