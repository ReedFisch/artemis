import Image from "next/image";
import { getTeamInfo } from "@/lib/tba";

export default async function Home() {
  const teamInfo = await getTeamInfo();
  
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

      {/* About & Impact Section */}
      <section id="impact" className="section">
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem", alignItems: "center" }}>
            <div style={{ flex: "1 1 500px" }}>
              <h2 className="section-title">Small Town. <span className="text-gradient-orange">Global Stage.</span></h2>
              <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                Chatham High School is a small rural school where 42% of students qualify for free-reduced lunch. With fewer than 90 students per graduating class, we compete against districts 5-10x our size with dedicated tech labs and corporate sponsors.
              </p>
              <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "2rem" }}>
                <strong>But here is what sets us apart:</strong> We refuse to charge students to participate. Every meal, every shirt, every travel expense is covered. Because talent shouldn't be limited by a district's tax base.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center" }}>
                  <h3 style={{ fontSize: "2.5rem", color: "var(--primary-blue)", marginBottom: "0.5rem" }}>20+</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Active Members</p>
                </div>
                <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center" }}>
                  <h3 style={{ fontSize: "2.5rem", color: "var(--primary-orange)", marginBottom: "0.5rem" }}>$0</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Student Fees</p>
                </div>
              </div>
            </div>
            
            <div style={{ flex: "1 1 400px" }} className="glass-card">
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>Community Outreach</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", color: "#ccc" }}>
                <li style={{ display: "flex", gap: "1rem" }}><span style={{ color: "var(--primary-blue)" }}>▶</span> Established FTC team at middle school</li>
                <li style={{ display: "flex", gap: "1rem" }}><span style={{ color: "var(--primary-orange)" }}>▶</span> Launched Lego League at Morris Memorial Center</li>
                <li style={{ display: "flex", gap: "1rem" }}><span style={{ color: "var(--primary-blue)" }}>▶</span> Board of Education & Science Fair exhibitions</li>
                <li style={{ display: "flex", gap: "1rem" }}><span style={{ color: "var(--primary-orange)" }}>▶</span> RCS STEM Night & Elks Lodge presentations</li>
                <li style={{ display: "flex", gap: "1rem" }}><span style={{ color: "var(--primary-blue)" }}>▶</span> Developing a K-12 STEM pipeline</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Robot & Competitions Section */}
      <section id="robot" className="section" style={{ backgroundColor: "rgba(0, 119, 255, 0.03)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">The <span className="text-gradient-blue">Competitions</span></h2>
          <p className="section-subtitle" style={{ margin: "0 auto 3rem auto" }}>
            Last season, we won the Tech Valley Regional and earned our spot at the World Championship in Houston. We led our alliance to the highest-scoring match in our entire division.
          </p>
          
          {teamInfo ? (
            <div className="glass-card" style={{ display: "inline-block", textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#00ff00", boxShadow: "0 0 10px #00ff00" }}></div>
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Live TBA Data Synced</h3>
              </div>
              <p style={{ color: "#aaa", marginBottom: "0.5rem" }}><strong>Team:</strong> {teamInfo.nickname} ({teamInfo.team_number})</p>
              <p style={{ color: "#aaa", marginBottom: "0.5rem" }}><strong>Location:</strong> {teamInfo.city}, {teamInfo.state_prov}</p>
              <p style={{ color: "#aaa", marginBottom: "0.5rem" }}><strong>Rookie Year:</strong> {teamInfo.rookie_year}</p>
            </div>
          ) : (
            <div className="glass-card" style={{ display: "inline-block", textAlign: "left" }}>
              <p style={{ color: "var(--text-muted)" }}>Competition schedule loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h2 className="section-title" style={{ fontSize: "2rem" }}>Ready to invest in the future?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              We'd love to hear from you. For immediate questions or sponsorship inquiries, reach out directly.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginBottom: "3rem" }}>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ color: "var(--primary-blue)", marginBottom: "0.5rem" }}>Coach Sandra Fischer</h4>
                <a href="mailto:fischers@chatham.k12.ny.us" style={{ textDecoration: "underline", color: "#fff" }}>fischers@chatham.k12.ny.us</a>
              </div>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ color: "var(--primary-orange)", marginBottom: "0.5rem" }}>Captain Reed Fisch</h4>
                <a href="mailto:Reed.L.Fisch@gmail.com" style={{ textDecoration: "underline", color: "#fff" }}>Reed.L.Fisch@gmail.com</a>
              </div>
            </div>
            
            <a href="mailto:fischers@chatham.k12.ny.us?subject=Artemis 6621 Sponsorship" className="btn btn-primary" style={{ width: "100%", maxWidth: "300px" }}>Email Us Now</a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--glass-border)", padding: "2rem 0", textAlign: "center", color: "var(--text-muted)" }}>
        <p>© {new Date().getFullYear()} Artemis 6621, Chatham High School Robotics. All rights reserved.</p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1rem" }}>
          <a href="https://www.thebluealliance.com/team/6621" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>The Blue Alliance</a>
          <a href="https://youtube.com/@ArtemisFrc6621" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>YouTube</a>
        </div>
      </footer>
    </main>
  );
}
