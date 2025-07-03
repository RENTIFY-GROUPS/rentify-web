import React from 'react';

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I list my property?",
      answer: "You can list your property by navigating to the Landlord Dashboard and filling out the 'Create Listing' form. Make sure to provide all necessary details and upload high-quality images.",
      videoUrl: "https://www.youtube.com/embed/your-landlord-tutorial-video-id" // Replace with actual video ID
    },
    {
      question: "How do I pay my rent online?",
      answer: "Tenants can pay rent securely through the platform by going to their Tenant Dashboard and clicking on the 'Pay Rent' button. You will be guided through the payment process.",
      videoUrl: "https://www.youtube.com/embed/your-tenant-payment-tutorial-video-id" // Replace with actual video ID
    },
    {
      question: "How does roommate matching work?",
      answer: "Our roommate matching feature uses a questionnaire to understand your preferences and habits. Based on your answers, we suggest compatible roommates. You can fill out your profile and view matches from your Tenant Dashboard.",
      videoUrl: "https://www.youtube.com/embed/your-roommate-tutorial-video-id" // Replace with actual video ID
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">FAQ & Help Center</h1>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">{faq.question}</h2>
            <p className="text-gray-700 mb-4">{faq.answer}</p>
            {faq.videoUrl && (
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={faq.videoUrl}
                  title={faq.question}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}