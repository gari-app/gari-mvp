export default function AppHome() {
  return (
    <div className="grid">
      <section className="panel card">
        <h2 style={{marginTop:0}}>¿Qué querés hacer?</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))'}}>
          <a className="card" href="/app/search">
            <h3 style={{marginTop:0}}>Conductor</h3>
            <p>Buscá cocheras disponibles cerca de tu destino.</p>
            <button className="button button--primary">Buscar cocheras</button>
          </a>
          <a className="card" href="/app/publicar">
            <h3 style={{marginTop:0}}>Anfitrión</h3>
            <p>Publicá tu cochera y generá ingresos.</p>
            <button className="button">Publicar</button>
          </a>
          <a className="card" href="/app/reservas">
            <h3 style={{marginTop:0}}>Mis reservas</h3>
            <p>Revisá tu historial y reservas activas.</p>
            <button className="button">Ver reservas</button>
          </a>
        </div>
      </section>
    </div>
  )
}
