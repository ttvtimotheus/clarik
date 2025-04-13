import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="container flex justify-between items-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} clarik.app</p>
        <div className="space-x-4">
          <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary">Impressum</Link>
          <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary">Datenschutz</Link>
          <Link href="/agb" className="text-sm text-muted-foreground hover:text-primary">AGB</Link>
          <Link href="/status" className="text-sm text-muted-foreground hover:text-primary">Status</Link>
        </div>
      </div>
    </footer>
  )
}
