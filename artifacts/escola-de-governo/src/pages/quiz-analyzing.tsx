import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuizStore } from "@/lib/store";

export default function QuizAnalyzing() {
  const [, setLocation] = useLocation();
  const slug = useQuizStore((state) => state.slug);

  useEffect(() => {
    if (!slug) {
      setLocation("/");
      return;
    }

    const timer = setTimeout(() => {
      setLocation(`/resultado/${slug}`);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [slug, setLocation]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-primary text-primary-foreground">
      <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
          Analisando suas respostas...
        </h2>
      </div>
    </div>
  );
}
