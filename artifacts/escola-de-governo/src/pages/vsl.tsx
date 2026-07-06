export default function VSL() {
  const CHECKOUT_URL = "#"; // TODO: adicionar URL do checkout

  // TODO: substituir pelos IDs reais do Bunny.net
  const BUNNY_LIBRARY_ID = "000000";
  const BUNNY_VIDEO_ID = "00000000-0000-0000-0000-000000000000";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-background text-foreground">
      <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-8">
        {/* Headline */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
            Assista ao vídeo abaixo antes de sair desta página
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Uma mensagem importante para quem quer assumir o governo da própria vida.
          </p>
        </div>

        {/* Video */}
        <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${BUNNY_VIDEO_ID}?autoplay=false&loop=false&muted=false&preload=true`}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <a
            href={CHECKOUT_URL}
            className="w-full inline-flex h-16 items-center justify-center rounded-full bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Quero me inscrever agora
          </a>
          <p className="text-sm text-muted-foreground">
            Acesso imediato após a confirmação do pagamento.
          </p>
        </div>
      </main>
    </div>
  );
}
