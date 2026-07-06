const YOUTUBE_URL = "https://youtube.com/@samuelpereira"; // TODO: confirmar URL

const links = [
  {
    label: "Declarando Prosperidade",
    href: "/como-imprimir-dinheiro-com-palavras",
    external: false,
  },
  {
    label: "Escola de Governo",
    href: "/escola-de-governo",
    external: false,
  },
  {
    label: "YouTube",
    href: YOUTUBE_URL,
    external: true,
  },
];

export default function Links() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* Nome e Bio */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-foreground">Samuel Pereira</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ✍🏼 Criador do IPP&nbsp;&nbsp;📖 Autor de Impossível Permanecer Pobre
            <br />
            📊 Empresário | Palestrante
          </p>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex h-13 items-center justify-center rounded-full border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="w-full inline-flex h-13 items-center justify-center rounded-full border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}
