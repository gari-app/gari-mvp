import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="appbar">
          <div className="appbar__inner">
            <a className="appbar__brand" href="/app">GARI</a>
            <nav style={{display:'flex', gap:12}}>
              <a href="/app/search">Buscar</a>
              <a href="/app/publicar">Publicar</a>
              <a href="/app/reservas">Reservas</a>
            </nav>
            <div className="appbar__spacer" />
            <a href="/login">Iniciar sesión</a>
          </div>
        </header>
        <main className="shell">{children}</main>
      </body>
    </html>
  )
}
