export default function AppHome() {
  return (
    <main style={{padding:24}}>
      <h2>¿Qué querés hacer?</h2>
      <ul style={{lineHeight:1.8}}>
        <li><a href="/app/search">Buscar cocheras (Conductor)</a></li>
        <li><a href="/app/publicar">Publicar cochera (Anfitrión)</a></li>
        <li><a href="/app/reservas">Mis reservas</a></li>
        <li><a href="/login">Iniciar sesión</a></li>
      </ul>
    </main>
  )
}
