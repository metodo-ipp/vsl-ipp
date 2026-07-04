import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetArea, useCreateEvent, getGetAreaQueryKey, type AreaSlug } from "@workspace/api-client-react";
import { useQuizStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

export default function ThankYou() {
  const [match, params] = useRoute("/obrigado/:slug");
  const [, setLocation] = useLocation();
  
  const leadId = useQuizStore((state) => state.leadId);
  const slug = match ? (params.slug as AreaSlug) : null;
  
  const { data: area, isLoading } = useGetArea(slug as AreaSlug, {
    query: { enabled: !!slug, queryKey: getGetAreaQueryKey(slug as AreaSlug) }
  });
  
  const createEvent = useCreateEvent();

  useEffect(() => {
    if (!slug) {
      setLocation("/");
    }
  }, [slug, setLocation]);

  const handleWhatsappClick = () => {
    createEvent.mutate({
      data: {
        eventName: "whatsapp_group_clicked",
        leadId,
        eventPayload: { slug },
      }
    });
    if (area?.whatsappGroupUrl) {
      window.open(area.whatsappGroupUrl, "_blank");
    }
  };

  if (isLoading || !area) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12 text-center max-w-3xl mx-auto w-full">
        
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full flex flex-col items-center">
          
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground text-balance">
            Tudo certo! Seu acesso foi confirmado.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Estamos muito felizes por você ter dado esse passo. Para garantir que você receba todos os materiais e avisos importantes, o próximo passo é essencial:
          </p>

          <div className="bg-card border-2 border-border rounded-2xl p-8 w-full max-w-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Entre no grupo exclusivo</h3>
            <p className="text-muted-foreground mb-8">
              É lá que nossa equipe de suporte vai te enviar os links de acesso e tirar todas as suas dúvidas.
            </p>
            
            <Button 
              onClick={handleWhatsappClick}
              className="w-full h-14 text-lg rounded-full font-bold shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-transform duration-200 bg-[#25D366] hover:bg-[#20bd5a] text-white"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Entrar no grupo do WhatsApp
            </Button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
