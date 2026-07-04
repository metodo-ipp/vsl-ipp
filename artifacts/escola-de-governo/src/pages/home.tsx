import { useEffect } from "react";
import { Link } from "wouter";
import { useQuizStore } from "@/lib/store";
import { useListAreas } from "@workspace/api-client-react";

export default function Home() {
  const setUtmParams = useQuizStore((state) => state.setUtmParams);
  const resetAnswers = useQuizStore((state) => state.resetAnswers);
  const { data: areas } = useListAreas();

  useEffect(() => {
    // Capture UTM params on mount
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    keys.forEach((key) => {
      const val = params.get(key);
      if (val) utm[key] = val;
    });
    if (Object.keys(utm).length > 0) {
      setUtmParams(utm);
    }
  }, [setUtmParams]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12 text-center max-w-4xl mx-auto w-full">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Escola de Governo
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
            Descubra o ponto de desalinhamento que está travando o seu <span className="text-primary italic">progresso.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
            Muitas vezes, não é falta de esforço. É uma única área da sua vida sugando energia de todas as outras. Faça o diagnóstico gratuito e descubra qual das {areas?.length || 5} áreas fundamentais é a raiz do problema.
          </p>
          
          <div className="pt-4 flex flex-col items-center gap-4">
            <Link 
              href="/quiz" 
              onClick={() => resetAnswers()}
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Iniciar Diagnóstico
            </Link>
            <p className="text-sm text-muted-foreground">Leva menos de 2 minutos.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
