export const metadata = {
  title: 'About',
  description: 'Learn more about ShopHub—our mission, values, and what drives us.'
};

export default function AboutPage() {
  return (
    <main>
      <section className="container">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1>About ShopHub</h1>
          <p className="mt-4">
            We are building a modern shopping experience that is fast, secure, and delightful. 
            Our mission is to connect people with products they love through thoughtful design and reliable technology.
          </p>
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-header">
              <h3>Customer First</h3>
            </div>
            <div className="card-body text-text-secondary">
              We obsess over details to ensure every interaction feels simple, clear, and helpful.
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Quality & Trust</h3>
            </div>
            <div className="card-body text-text-secondary">
              From product listings to checkout, we prioritize transparency, security, and reliability.
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Performance</h3>
            </div>
            <div className="card-body text-text-secondary">
              Built on modern web tech, our platform is optimized for speed and accessibility.
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="card-body">
              <p className="text-3xl font-semibold text-text">99.9%</p>
              <p className="text-text-secondary">Uptime</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-3xl font-semibold text-text">Fast</p>
              <p className="text-text-secondary">Secure checkout</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-3xl font-semibold text-text">Global</p>
              <p className="text-text-secondary">Scalable platform</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <p className="text-3xl font-semibold text-text">Support</p>
              <p className="text-text-secondary">We’re here to help</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


