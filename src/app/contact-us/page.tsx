
export default function ContactUsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 font-headline text-4xl font-bold">Contact Us</h1>
      <div className="prose max-w-none text-foreground">
        <p className="mb-4 text-lg">
          We'd love to hear from you! If you have any questions, comments, or concerns, please don't hesitate to get in touch.
        </p>

        <h2 className="mt-8 mb-2 text-2xl font-semibold">Our Email</h2>
        <p className="mb-4">
          For general inquiries, please email us at: <a href="mailto:support@mrshopy.com">support@mrshopy.com</a>
        </p>

        <h2 className="mt-8 mb-2 text-2xl font-semibold">WhatsApp Support</h2>
        <p className="mb-4">
          For immediate assistance, you can chat with us on WhatsApp: <a href="https://wa.me/918590814673" target="_blank" rel="noopener noreferrer">+91 85908 14673</a>
        </p>

        <h2 className="mt-8 mb-2 text-2xl font-semibold">Business Hours</h2>
        <p className="mb-4">
          Our support team is available from Monday to Friday, 9:00 AM to 6:00 PM IST.
        </p>
      </div>
    </div>
  );
}
