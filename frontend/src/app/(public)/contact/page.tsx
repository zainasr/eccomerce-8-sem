export const metadata = {
  title: 'Contact',
  description: 'Get in touch with the ShopHub team for support and inquiries.'
};

export default function ContactPage() {
  return (
    <main>
      <section className="container">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1>Contact Us</h1>
          <p className="mt-4">
            Have a question or feedback? We’d love to hear from you. Reach out using the form below
            or via the contact details.
          </p>
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3>Send us a message</h3>
              </div>
              <div className="card-body">
                <form className="space-y-4" action="#" method="post">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={5} placeholder="How can we help?" required />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary w-full">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3>Support</h3>
              </div>
              <div className="card-body text-text-secondary">
                <p>Email: support@shophub.com</p>
                <p className="mt-2">Hours: Mon–Fri, 9:00–17:00 (UTC)</p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Address</h3>
              </div>
              <div className="card-body text-text-secondary">
                <p>123 Commerce St</p>
                <p>Web City, WW 40404</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


