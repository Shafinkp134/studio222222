
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What are the payment options available?",
        answer: "We currently support Cash on Delivery (COD) as our primary payment method."
    },
    {
        question: "How long does shipping take?",
        answer: "Shipping usually takes 5-7 business days depending on your location. You can find more details on our Shipping Policy page."
    },
    {
        question: "What is your return policy?",
        answer: "We have a 7-day return policy for eligible items. Please refer to our Return & Refund Policy page for detailed information on the process and eligibility."
    },
    {
        question: "How can I track my order?",
        answer: "Once you place an order, you will receive updates via the email you provided during checkout. If you create an account with that same email, you can also track your order status in the 'My Account' section."
    },
    {
        question: "Do you offer gift wrapping?",
        answer: "Yes, we offer a gift wrapping option for a small additional fee. You can select this option during the checkout process."
    }
]

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
