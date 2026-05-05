import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background Image with Overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
          <Image 
            src="/hero_robotics_match.png" 
            alt="Artemis 6621 Drive Team at Competition"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          {/* Gradient Overlay for text readability */}
          <div style={{ 
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
            background: "linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 50%, rgba(5,5,5,0.3) 100%)" 
          }}></div>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "800px" }}>
            <div className="animate-fade-in" style={{ display: "inline-block", padding: "0.5rem 1rem", backgroundColor: "rgba(0, 119, 255, 0.15)", border: "1px solid rgba(0, 119, 255, 0.3)", borderRadius: "30px", color: "var(--primary-blue)", fontWeight: "600", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              🚀 Welcome to Artemis 6621
            </div>
            
            <h1 className="animate-fade-in delay-100" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: "900", lineHeight: "1.1", marginBottom: "1.5rem" }}>
              Small Team. <br />
              <span className="text-gradient-orange">Big Impact.</span>
            </h1>
            
            <p className="animate-fade-in delay-200" style={{ fontSize: "1.25rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "2.5rem", maxWidth: "600px" }}>
              Help Artemis 6621 Reach the World Stage. We are Chatham High School&apos;s student-led FIRST Robotics team. We build robots, but more importantly, we build the next generation of innovators.
            </p>
            
            <div className="animate-fade-in delay-300" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#sponsorship" className="btn btn-primary">Support Our Journey</a>
              <a href="#robot" className="btn btn-secondary">Meet the Robot</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Section */}
      <section id="sponsorship" className="section" style={{ backgroundColor: "var(--bg-color)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 className="section-title">Fuel the <span className="text-gradient-blue">Future</span></h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Chatham is a small rural school with limited tech resources, yet we compete at the highest levels. 
              We refuse to charge students to participate, covering all meals, shirts, and travel. 
              Help us reach our $65,395 budget for regional competitions and the World Championship.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            <div className="glass-card">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Hermes Tier</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>&lt; $250</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", color: "#ccc" }}>
                <li>✓ Company name & logo on the team banner</li>
                <li>✓ Shoutout on our social media channels</li>
              </ul>
            </div>
            
            <div className="glass-card" style={{ borderColor: "rgba(0, 119, 255, 0.4)", transform: "scale(1.05)" }}>
              <div style={{ display: "inline-block", background: "var(--primary-blue)", color: "white", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "1rem" }}>MOST POPULAR</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Apollo Tier</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>$251 - $499</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", color: "#ccc" }}>
                <li>✓ Everything in Hermes</li>
                <li>✓ Name/logo displayed on the competition robot</li>
                <li>✓ Framed team photo</li>
              </ul>
            </div>
            
            <div className="glass-card" style={{ borderColor: "rgba(255, 102, 0, 0.4)" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>ZEUS Tier</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>$500+</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", color: "#ccc" }}>
                <li>✓ Everything in Apollo</li>
                <li>✓ Official team merchandise</li>
                <li>✓ VIP pit tour at local competitions</li>
              </ul>
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Proudly supported by</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", opacity: 0.7, fontWeight: "bold", fontSize: "1.2rem" }}>
              <span>Bank of Greene County</span>
              <span>Gene Haas Foundation</span>
              <span>IBM</span>
              <span>Local Elks Lodge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Further sections (Robot, Community, Contact) will be added next */}
    </main>
  );
}
