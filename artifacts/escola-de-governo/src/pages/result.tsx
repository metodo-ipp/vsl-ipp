import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetArea, useCreateEvent, getGetAreaQueryKey, type AreaSlug } from "@workspace/api-client-react";
import { useQuizStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Result() {
  const [match, params] = useRoute("/resultado/:slug");
  const [, setLocation] = useLocation();
  
  const leadId = useQuizStore((state) => state.leadId);
  const slug = match ? (params.slug as AreaSlug) : null;
  
  const { data: area, isLoading } = useGetArea(slug as AreaSlug, {
    query: { enabled: !!slug, queryKey: getGetAreaQueryKey(slug as AreaSlug) }
  });
  
  const createEvent = useCreateEvent();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const event80Fired = useRef(false);
  const eventViewedFired = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLocation("/");
    }
  }, [slug, setLocation]);

  const handlePlay = () => {
    if (!eventViewedFired.current) {
      createEvent.mutate({
        data: {
          eventName: "vsl_viewed",
          leadId,
          eventPayload: { slug },
        }
      });
      eventViewedFired.current = true;
    }
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const { currentTime, duration } = videoRef.current;
    if (!duration) return;
    
    const progress = currentTime / duration;
    
    if (progress >= 0.8 && !event80Fired.current) {
      createEvent.mutate({
        data: {
          eventName: "vsl_80_percent_viewed",
          leadId,
          eventPayload: { slug },
        }
      });
      event80Fired.current = true;
      setShowCTA(true);
    }
  };

  const handleCTAClick = () => {
    createEvent.mutate({
      data: {
        eventName: "checkout_clicked",
        leadId,
        eventPayload: { slug },
      }
    });
    if (area?.checkoutUrl497) {
      window.location.assign(area.checkoutUrl497);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
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
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-20 w-full max-w-4xl mx-auto animate-in fade-in duration-700">
        
        <div className="text-center space-y-4 mb-10 w-full">
          <p className="text-sm md:text-base font-semibold text-primary uppercase tracking-wider">
            Seu Diagnóstico
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-foreground text-balance">
            {area.diagnosisTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Assista ao vídeo abaixo para entender exatamente o que está acontecendo e como resolver.
          </p>
        </div>

        <div className="w-full relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
          <video
            ref={videoRef}
            src={area.vslUrl}
            poster={area.poster || undefined}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            controls={hasStarted} // Show native controls only after started
            className="w-full h-full object-cover"
            playsInline
          />
          
          {!hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors cursor-pointer group" onClick={togglePlayPause}>
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {showCTA && (
          <div className="mt-12 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Button
              onClick={handleCTAClick}
              className="w-full h-16 text-xl rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-200 bg-primary text-primary-foreground"
            >
              Quero comprar agora
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Pagamento 100% seguro.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
