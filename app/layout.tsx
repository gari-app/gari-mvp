export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="es">
<body style={{fontFamily:'system-ui', margin:0}}>{children}</body>
</html>
)
}
