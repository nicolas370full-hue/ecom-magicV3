import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [productImg, setProductImg] = useState(null);
  const [productBase64, setProductBase64] = useState(null);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload');
  const [form, setForm] = useState({
    productName: '',
    scene: 'workshop',
    person: 'man30',
    style: 't1',
    titulo1: 'MAXIMIZA TU',
    titulo2: 'POTENCIAL SIN LÍMITES',
    descripcion: 'La solución definitiva para profesionales que buscan calidad y precisión.',
    ben1: 'RENDIMIENTO SUPERIOR',
    ben2: 'DISEÑO ERGONÓMICO',
    ben3: 'GARANTÍA TOTAL',
    precio: '29.990',
    cta: '¡Pide el tuyo hoy mismo!',
  });

  const fileRef = useRef();

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductImg(ev.target.result);
      setProductBase64(ev.target.result);
      setStep('configure');
    };
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!productBase64) return setError('Sube una imagen del producto primero');
    setLoading(true);
    setError(null);
    setProgress(0);

    const iv = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 4, 88));
    }, 600);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: productBase64,
          productName: form.productName,
          scene: form.scene,
          person: form.person,
          style: form.style,
        }),
      });

      const data = await res.json();
      clearInterval(iv);
      setProgress(100);

      if (data.error) { setError(data.error); setLoading(false); return; }

      setGeneratedImg(data.imageUrl);
      setStep('result');
    } catch (err) {
      clearInterval(iv);
      setError(err.message);
    }
    setLoading(false);
  };

  const styles_opts = [
    { value: 't1', label: '🌙 Aventura oscura', desc: 'Fondo oscuro dramático' },
    { value: 't2', label: '⬛ Negro moderno', desc: 'Elegante y profesional' },
    { value: 't3', label: '🤍 Claro fitness', desc: 'Fondo claro y fresco' },
    { value: 't4', label: '💙 Tech oscuro', desc: 'Futurista con glow azul' },
    { value: 't5', label: '🩷 Rosa kids', desc: 'Colorido y divertido' },
  ];

  return (
    <>
      <Head>
        <title>Ecom Magic — Generador de Imágenes de Marketing con IA</title>
        <meta name="description" content="Genera imágenes de marketing profesionales para tu e-commerce con IA" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

        {/* HEADER */}
        <header style={{ background: '#111', borderBottom: '1px solid #1e1e1e', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 24, letterSpacing: 3, color: '#1a6fff' }}>
              ECOM <span style={{ color: '#fff' }}>MAGIC</span>
            </div>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: 1, marginTop: 2 }}>GENERADOR DE IMÁGENES DE MARKETING CON IA</div>
          </div>
          <div style={{ background: '#1a6fff', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1 }}>
            ✨ POWERED BY FAL.AI
          </div>
        </header>

        <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>

          {/* SIDEBAR */}
          <div style={{ width: 300, minWidth: 300, background: '#111', borderRight: '1px solid #1e1e1e', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Upload */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1e1e1e', paddingBottom: 4, marginBottom: 10 }}>
                📦 Tu producto
              </div>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border: `1.5px dashed ${productImg ? '#333' : '#252525'}`, borderRadius: 8, padding: productImg ? 6 : '1rem', textAlign: 'center', cursor: 'pointer', background: '#141414', transition: 'all .2s' }}
              >
                {productImg ? (
                  <img src={productImg} alt="producto" style={{ maxHeight: 100, width: '100%', objectFit: 'contain', borderRadius: 6 }} />
                ) : (
                  <>
                    <div style={{ fontSize: 28 }}>🖼️</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Subir foto del producto</div>
                    <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>PNG con fondo blanco — ideal</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
            </div>

            {/* Nombre */}
            <Field label="Nombre del producto">
              <input value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} placeholder="Ej: Pistola de soldar 60W" />
            </Field>

            {/* Estilo */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1e1e1e', paddingBottom: 4, marginBottom: 10 }}>
                🎨 Estilo del banner
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {styles_opts.map(s => (
                  <div
                    key={s.value}
                    onClick={() => setForm({ ...form, style: s.value })}
                    style={{ border: `2px solid ${form.style === s.value ? '#1a6fff' : '#222'}`, borderRadius: 7, padding: '7px 10px', cursor: 'pointer', background: form.style === s.value ? '#081428' : '#141414', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span style={{ fontSize: 16 }}>{s.label.split(' ')[0]}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: form.style === s.value ? '#1a6fff' : '#888' }}>{s.label.split(' ').slice(1).join(' ')}</div>
                      <div style={{ fontSize: 10, color: '#555' }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escenario */}
            <Field label="Escenario">
              <select value={form.scene} onChange={e => setForm({ ...form, scene: e.target.value })}>
                <option value="workshop">Taller profesional</option>
                <option value="home">Casa / hogar</option>
                <option value="outdoor">Exterior / aventura</option>
                <option value="gym">Gimnasio / deporte</option>
                <option value="studio">Estudio fotográfico</option>
              </select>
            </Field>

            {/* Persona */}
            <Field label="Persona en la foto">
              <select value={form.person} onChange={e => setForm({ ...form, person: e.target.value })}>
                <option value="man30">Hombre técnico 30-40 años</option>
                <option value="woman30">Mujer profesional 25-35 años</option>
                <option value="couple">Pareja feliz</option>
                <option value="young">Joven 20-25 años</option>
                <option value="kid">Niño/a feliz</option>
              </select>
            </Field>

            <div style={{ height: 1, background: '#1a1a1a' }} />

            {/* Textos */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #1e1e1e', paddingBottom: 4, marginBottom: 10 }}>
                ✏️ Textos del banner
              </div>
              <Field label="Título línea 1"><input value={form.titulo1} onChange={e => setForm({ ...form, titulo1: e.target.value })} /></Field>
              <Field label="Título línea 2"><input value={form.titulo2} onChange={e => setForm({ ...form, titulo2: e.target.value })} /></Field>
              <Field label="Beneficio 1"><input value={form.ben1} onChange={e => setForm({ ...form, ben1: e.target.value })} /></Field>
              <Field label="Beneficio 2"><input value={form.ben2} onChange={e => setForm({ ...form, ben2: e.target.value })} /></Field>
              <Field label="Beneficio 3"><input value={form.ben3} onChange={e => setForm({ ...form, ben3: e.target.value })} /></Field>
              <Field label="Precio (CLP)"><input value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} /></Field>
              <Field label="CTA"><input value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} /></Field>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#1a0505', border: '1px solid #3a0808', borderRadius: 7, padding: 10, fontSize: 11, color: '#ff6b6b', lineHeight: 1.6 }}>
                ❌ {error}
              </div>
            )}

            {/* Progress */}
            {loading && (
              <>
                <div style={{ height: 3, background: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#1a6fff', width: `${progress}%`, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#1a6fff', textAlign: 'center', animation: 'pulse 1.5s infinite' }}>
                  ⏳ Generando imagen con IA... ~20 segundos
                </div>
              </>
            )}

            {/* Botón */}
            <button
              onClick={generate}
              disabled={loading || !productImg}
              style={{ width: '100%', padding: 12, fontSize: 13, fontWeight: 700, fontFamily: 'Oswald, sans-serif', letterSpacing: 2, background: loading || !productImg ? '#333' : '#1a6fff', color: '#fff', border: 'none', borderRadius: 8, cursor: loading || !productImg ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? '⏳ GENERANDO...' : '✨ GENERAR IMAGEN DE MARKETING'}
            </button>

          </div>

          {/* PREVIEW */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', overflowY: 'auto', background: '#080808', gap: 12 }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 400 }}>
              <div style={{ fontSize: 11, color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Vista previa
              </div>
              {generatedImg && (
                <a href={generatedImg} download="banner-ecom-magic.jpg" target="_blank" rel="noreferrer" style={{ background: '#1a6fff', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 6, textDecoration: 'none' }}>
                  ⬇ Descargar imagen
                </a>
              )}
            </div>

            {/* Banner resultado */}
            <div style={{ width: '100%', maxWidth: 400, aspectRatio: '9/16', position: 'relative', overflow: 'hidden', borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {generatedImg ? (
                <>
                  {/* Imagen IA de fondo */}
                  <img src={generatedImg} alt="banner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

                  {/* Overlay con textos */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.5) 0%, transparent 40%, transparent 55%, rgba(0,0,0,.8) 100%)', zIndex: 2 }} />

                  {/* Título */}
                  <div style={{ position: 'absolute', top: '4%', left: '4%', right: '4%', zIndex: 3 }}>
                    <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(18px, 6vw, 28px)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1.05, textShadow: '2px 2px 8px rgba(0,0,0,.9)' }}>
                      {form.titulo1}<br /><span style={{ color: '#60a5fa' }}>{form.titulo2}</span>
                    </h1>
                  </div>

                  {/* Beneficios */}
                  <div style={{ position: 'absolute', bottom: '22%', left: '4%', zIndex: 3, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[form.ben1, form.ben2, form.ben3].map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: '1.5px solid rgba(100,160,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                          {['⚡', '🎯', '🛡️'][i]}
                        </div>
                        <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', textShadow: '1px 1px 3px rgba(0,0,0,.8)' }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Precio */}
                  <div style={{ position: 'absolute', right: '4%', bottom: '22%', zIndex: 3, background: 'radial-gradient(circle,#cc0000,#880000)', borderRadius: '50%', width: 70, height: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,80,80,.4)', textAlign: 'center', padding: 4 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Oferta<br />Especial</div>
                    <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 900, color: '#fff', lineHeight: 1 }}>${form.precio}</div>
                    <div style={{ fontSize: 7, color: 'rgba(255,255,255,.8)' }}>CLP</div>
                  </div>

                  {/* Garantías */}
                  <div style={{ position: 'absolute', bottom: '7%', left: 0, right: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 4%', zIndex: 3 }}>
                    {[['💳', 'Pago Seguro'], ['🚚', 'Envío Gratis'], ['✅', 'Garantía'], ['🛡️', '100% Seguro']].map(([ico, txt]) => (
                      <div key={txt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 14 }}>{ico}</span>
                        <span style={{ fontSize: 7, color: 'rgba(255,255,255,.8)', textAlign: 'center', lineHeight: 1.2 }}>{txt}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#1a5fff', padding: '8px 4%', textAlign: 'center', zIndex: 3 }}>
                    <p style={{ fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>{form.cta}</p>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#333' }}>
                  <div style={{ fontSize: 48 }}>🎨</div>
                  <div style={{ fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
                    {!productImg ? 'Sube tu producto para empezar' : 'Presiona "Generar imagen de marketing"'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input, select { background: #161616; border: 1px solid #252525; border-radius: 6px; padding: 7px 9px; font-size: 12px; color: #fff; font-family: Inter, sans-serif; outline: none; width: 100%; margin-top: 4px; }
        input:focus, select:focus { border-color: #1a6fff; }
        select option { background: #161616; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
      <label style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
