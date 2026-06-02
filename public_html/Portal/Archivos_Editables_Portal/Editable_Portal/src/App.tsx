import React, { useState, useEffect, useRef } from 'react';
import { Shield, Send, Check, ArrowRight, Phone, Mail, Instagram, User, Calendar, AlertCircle } from 'lucide-react';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export default function App() {
  const [needs, setNeeds] = useState('');
  const [goals, setGoals] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroAnim = useInView(0.1);
  const routeAnim = useInView(0.1);
  const commsAnim = useInView(0.1);
  const addlAnim = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: 'Cliente Portal',
          email: 'optune@optune.tech',
          empresa: '',
          mensaje: `NECESIDADES:\n${needs}\n\nOBJETIVOS:\n${goals}`
        })
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const weeks = [
    {
      num: '01',
      week: 'Semana 1',
      title: 'Deep Dive',
      items: ['Mapeo completo de operaciones', 'Definición de objetivos clave', 'Demo al cierre de semana'],
      icon: <Calendar size={16} />,
    },
    {
      num: '02',
      week: 'Semana 2',
      title: 'Primera Entrega',
      items: ['Producto con feedback integrado', 'Revisión y ajustes finales', 'Validación del cliente'],
      icon: <Check size={16} />,
    },
    {
      num: '03',
      week: 'Semana 3',
      title: 'Finalización',
      items: ['Integración de sistemas', 'Capacitación del equipo', 'Entrega oficial del proyecto'],
      icon: <ArrowRight size={16} />,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0c1c2b;
          --surface:#122538;
          --surface2:#182f45;
          --border:rgba(255,255,255,0.08);
          --border-hover:rgba(0,174,239,0.3);
          --text:#f0f7fc;
          --muted:#74899c;
          --accent:#00aeef;
          --accent2:#00fff7;
          --line:rgba(0,174,239,0.25);
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
        .fade-up{opacity:0;transform:translateY(28px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1)}
        .fade-up.visible{opacity:1;transform:translateY(0)}
        .fade-up.d1{transition-delay:0.08s}
        .fade-up.d2{transition-delay:0.18s}
        .fade-up.d3{transition-delay:0.28s}
        .fade-up.d4{transition-delay:0.38s}

        textarea,input{
          background:var(--surface2);
          border:1px solid var(--border);
          color:var(--text);
          font-family:'DM Sans',sans-serif;
          font-size:15px;
          border-radius:10px;
          padding:14px 16px;
          width:100%;
          resize:vertical;
          outline:none;
          transition:border-color 0.2s;
          line-height:1.6;
        }
        textarea::placeholder,input::placeholder{color:var(--muted)}
        textarea:focus,input:focus{border-color:rgba(0,174,239,0.5);box-shadow:0 0 0 3px rgba(0,174,239,0.08)}

        .btn-primary{
          display:inline-flex;align-items:center;gap:10px;
          background:var(--accent);color:#0c1c2b;
          padding:13px 28px;border-radius:10px;border:none;
          font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;
          cursor:pointer;transition:all 0.2s;letter-spacing:0.01em;
        }
        .btn-primary:hover{background:#00fff7;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,174,239,0.35)}
        .btn-primary:active{transform:translateY(0)}
        .btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}

        .week-card{
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:14px;
          padding:28px;
          transition:border-color 0.25s,transform 0.25s;
          position:relative;overflow:hidden;
        }
        .week-card:hover{border-color:var(--border-hover);transform:translateY(-3px)}
        .week-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--accent),transparent);
          opacity:0;transition:opacity 0.3s;
        }
        .week-card:hover::before{opacity:1}

        .comm-card{
          background:var(--surface);border:1px solid var(--border);
          border-radius:14px;padding:28px;
        }

        .tag{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(0,174,239,0.1);color:var(--accent2);
          border:1px solid rgba(0,174,239,0.2);
          font-size:12px;font-weight:500;letter-spacing:0.05em;
          padding:4px 12px;border-radius:99px;
          text-transform:uppercase;
        }

        .section-label{
          font-size:12px;letter-spacing:0.12em;text-transform:uppercase;
          color:var(--muted);font-weight:500;
          display:flex;align-items:center;gap:10px;
        }
        .section-label::after{
          content:'';flex:1;height:1px;background:var(--border);
        }

        .num-badge{
          font-family:'Syne',sans-serif;font-size:13px;font-weight:700;
          color:var(--accent);opacity:0.6;letter-spacing:0.05em;
        }

        .list-dot{
          display:flex;align-items:flex-start;gap:10px;
          font-size:14px;color:rgba(240,239,244,0.7);line-height:1.5;
          margin-bottom:10px;
        }
        .list-dot::before{
          content:'';width:5px;height:5px;border-radius:50%;
          background:var(--accent);margin-top:6px;flex-shrink:0;opacity:0.7;
        }

        .divider{height:1px;background:var(--border);margin:0}

        .phone-num{
          font-family:'Syne',sans-serif;font-size:20px;font-weight:700;
          color:var(--text);letter-spacing:0.02em;line-height:1.6;
        }

        .sys-placeholder{
          border:1px dashed rgba(0,174,239,0.2);border-radius:12px;
          height:120px;display:flex;align-items:center;justify-content:center;
          background:rgba(0,174,239,0.03);
          transition:border-color 0.2s,background 0.2s;
        }
        .sys-placeholder:hover{
          border-color:rgba(0,174,239,0.4);background:rgba(0,174,239,0.06);
        }

        footer a{color:var(--muted);text-decoration:none;transition:color 0.2s;font-size:13px}
        footer a:hover{color:var(--text)}
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        {/* ── HEADER ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: scrolled ? 'rgba(12,28,43,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          padding: '16px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#0c1c2b',
            }}>O</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>Optune</span>
          </div>
          <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500 }}>
            Lanzamiento de proyecto · David Rodríguez
          </span>
        </header>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px 80px' }}>

          {/* ── SECTION 1: BIENVENIDA ── */}
          <section style={{ padding: '96px 0 80px' }} ref={heroAnim.ref}>
            <div className={`fade-up ${heroAnim.inView ? 'visible' : ''}`}>
              <div className="tag" style={{ marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                Bienvenido, David
              </div>
            </div>

            <h1 className={`fade-up d1 ${heroAnim.inView ? 'visible' : ''}`}
              style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(42px, 6vw, 72px)',
                lineHeight: 1.07, letterSpacing: '-0.03em',
                color: 'var(--text)', marginBottom: 28,
              }}>
              David, gracias por<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                confiar en nosotros.
              </span>
            </h1>

            <p className={`fade-up d2 ${heroAnim.inView ? 'visible' : ''}`}
              style={{ fontSize: 17, color: 'rgba(240,239,244,0.6)', lineHeight: 1.75, maxWidth: 560, marginBottom: 64 }}>
              Es un honor acompañar el crecimiento de tu negocio. Nuestra misión es encontrar ineficiencias dentro de los procesos de tu firma y asesorarte en la integración de sistemas para optimizarlos.
            </p>

            <div className="divider" style={{ marginBottom: 64 }} />

            <div className={`fade-up d3 ${heroAnim.inView ? 'visible' : ''}`}>
              <p style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500, marginBottom: 32 }}>
                Cuéntanos sobre tu empresa
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 620 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'rgba(240,239,244,0.8)', marginBottom: 10 }}>
                      ¿Cuáles son tus necesidades actuales?
                    </label>
                    <textarea
                      required rows={4} value={needs} onChange={e => setNeeds(e.target.value)}
                      placeholder="Describe los puntos críticos, cuellos de botella, tareas que más tiempo consumen y los sistemas que te gustaría implementar."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'rgba(240,239,244,0.8)', marginBottom: 10 }}>
                      ¿Qué te gustaría lograr con este proyecto?
                    </label>
                    <textarea
                      required rows={4} value={goals} onChange={e => setGoals(e.target.value)}
                      placeholder="Comparte tus objetivos, resultados esperados o métricas de éxito."
                    />
                  </div>

                  <div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? 'Enviando...' : (
                        <><Send size={15} /> Enviar información</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  background: 'rgba(0,174,239,0.08)', border: '1px solid rgba(0,174,239,0.25)',
                  borderRadius: 14, padding: '24px 28px', maxWidth: 500,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(0,174,239,0.2)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Check size={18} color="var(--accent2)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>¡Información recibida!</p>
                    <p style={{ fontSize: 14, color: 'rgba(240,239,244,0.6)', lineHeight: 1.6 }}>
                      Hemos recibido tu información. Nos pondremos en contacto pronto.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── SECTION 2: RUTA ── */}
          <section style={{ padding: '80px 0' }} ref={routeAnim.ref}>
            <div className={`fade-up ${routeAnim.inView ? 'visible' : ''}`} style={{ marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 20 }}>Horizonte de trabajo</div>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.025em', color: 'var(--text)',
              }}>
                Ruta de implementación
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {weeks.map((w, i) => (
                <div key={i} className={`week-card fade-up d${i + 1} ${routeAnim.inView ? 'visible' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span className="num-badge">{w.num}</span>
                    <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{w.week}</span>
                  </div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: 20, color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.01em',
                  }}>{w.title}</h3>
                  <div>
                    {w.items.map((item, j) => (
                      <div key={j} className="list-dot">{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 3: COMUNICACIÓN ── */}
          <section style={{ padding: '80px 0' }} ref={commsAnim.ref}>
            <div className={`fade-up ${commsAnim.inView ? 'visible' : ''}`} style={{ marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 20 }}>Soporte continuo</div>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.025em', color: 'var(--text)',
              }}>
                Canales directos
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {/* Canales */}
              <div className={`comm-card fade-up d1 ${commsAnim.inView ? 'visible' : ''}`}>
                <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Canales</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: <Mail size={14} />, label: 'Gmail', value: 'optune@optune.tech' },
                    { icon: <Instagram size={14} />, label: 'Instagram', value: '@optunetech' },
                    { icon: <User size={14} />, label: 'Consultor', value: 'Samuel Restrepo' },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
                        {row.icon} {row.label}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avances */}
              <div className={`comm-card fade-up d2 ${commsAnim.inView ? 'visible' : ''}`}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>Avances</p>
                <p style={{ fontSize: 14, color: 'rgba(240,239,244,0.65)', lineHeight: 1.7, flexGrow: 1 }}>
                  Llamadas semanales de <strong style={{ color: 'var(--text)' }}>15 minutos</strong> para calibrar resultados y mantener el proyecto en curso.
                </p>
                <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(0,174,239,0.08)', borderRadius: 8, fontSize: 13, color: 'var(--accent2)' }}>
                  Cada semana · Duración breve · Orientado a resultados
                </div>
              </div>

              {/* Consultas rápidas */}
              <div className={`comm-card fade-up d3 ${commsAnim.inView ? 'visible' : ''}`}
                style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Para consultas rápidas, inquietudes y orientación</p>
                  <AlertCircle size={13} color="var(--muted)" />
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>Llama a cualquiera de estos números:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                  {['323 802 87 50', '311 302 07 79'].map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Phone size={13} color="var(--accent)" />
                      <span className="phone-num">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: INFO ADICIONAL ── */}
          <section style={{ padding: '80px 0 0' }} ref={addlAnim.ref}>
            <div className={`fade-up ${addlAnim.inView ? 'visible' : ''}`} style={{ marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 20 }}>Información adicional</div>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.025em', color: 'var(--text)',
              }}>
                Transparencia total
              </h2>
            </div>

            {/* Disclaimer */}
            <div className={`fade-up d1 ${addlAnim.inView ? 'visible' : ''}`}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '28px 32px', marginBottom: 24,
              }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'rgba(0,174,239,0.12)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Shield size={18} color="var(--accent2)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Acuerdo de Confidencialidad (NDA)</p>
                <p style={{ fontSize: 14, color: 'rgba(240,239,244,0.6)', lineHeight: 1.7, maxWidth: 520 }}>
                  Tus datos serán tratados con total confidencialidad y usados únicamente para el desarrollo del proyecto. Toda la información compartida está protegida bajo acuerdo.
                </p>
              </div>
            </div>

            {/* Sistemas */}
            <div className={`fade-up d2 ${addlAnim.inView ? 'visible' : ''}`} style={{ marginTop: 80 }}>
              <div style={{ marginBottom: 32 }}>
                <div className="section-label" style={{ marginBottom: 20 }}>Sistemas</div>
                <h2 style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.025em', color: 'var(--text)',
                }}>
                  Sistemas a implementar
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
                Estos sistemas son solo un DEMO de los sistemas que podemos implementar, los desarrollamos a partir de la conversación que tuviste con Samuel.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
                justifyContent: 'center',
                maxWidth: 640,
                margin: '0 auto'
              }}>
                <div className="sys-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '24px', textAlign: 'center', height: 'auto', minHeight: 130 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Sistema 1</span>
                  <span style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>Clasificación de correos</span>
                </div>

                <div className="sys-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '24px', textAlign: 'center', height: 'auto', minHeight: 130 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Sistema 2</span>
                  <span style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>Automatización de información básica contratos</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '40px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          background: 'var(--surface)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            © {new Date().getFullYear()} Optune. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="#">Protocolo de Privacidad</a>
            <a href="#">Soporte Técnico</a>
          </div>
        </footer>

      </div>
    </>
  );
}
