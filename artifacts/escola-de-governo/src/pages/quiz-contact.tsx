import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitQuiz } from "@workspace/api-client-react";
import { useQuizStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Por favor, informe seu nome completo."),
  email: z.string().email("Por favor, informe um email válido."),
  whatsapp: z.string().min(14, "Por favor, informe um WhatsApp válido com DDD."),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuizContact() {
  const [, setLocation] = useLocation();
  const answers = useQuizStore((state) => state.answers);
  const utmParams = useQuizStore((state) => state.utmParams);
  const setResultData = useQuizStore((state) => state.setResultData);
  
  const submitQuiz = useSubmitQuiz();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  // Redirect if no answers
  if (answers.length < 5) {
    setLocation("/quiz");
    return null;
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const onSubmit = (data: FormValues) => {
    setSubmitError(null);
    
    const maritalStatusAnswer = answers.find(a => a.questionKey === "estado_civil")?.answerText;
    const intentLevelAnswer = answers.find(a => a.questionKey === "termometro_intencao")?.answerText;
    
    submitQuiz.mutate({
      data: {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp.replace(/\D/g, ""),
        maritalStatus: maritalStatusAnswer,
        intentLevel: intentLevelAnswer,
        answers: answers,
        utmSource: utmParams.utm_source || null,
        utmMedium: utmParams.utm_medium || null,
        utmCampaign: utmParams.utm_campaign || null,
        utmContent: utmParams.utm_content || null,
        utmTerm: utmParams.utm_term || null,
        landingUrl: window.location.origin,
      }
    }, {
      onSuccess: (result) => {
        setResultData({
          leadId: result.leadId,
          slug: result.slug,
          resultUrl: result.resultUrl,
        });
        setLocation("/quiz/analisando");
      },
      onError: () => {
        setSubmitError("Ocorreu um erro ao enviar suas respostas. Tente novamente.");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-white max-w-2xl mx-auto px-6 py-8">
      <header className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/quiz")} className="rounded-full hover:bg-primary/5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3 font-serif">
            Estamos quase lá
          </h2>
          <p className="text-muted-foreground text-lg">
            Para onde devemos enviar a análise detalhada do seu diagnóstico?
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Nome completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome" 
                      className="h-14 text-lg rounded-xl bg-card border-2 border-border focus-visible:border-primary focus-visible:ring-0" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email principal</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="seu@email.com" 
                      className="h-14 text-lg rounded-xl bg-card border-2 border-border focus-visible:border-primary focus-visible:ring-0" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">WhatsApp (com DDD)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 90000-0000" 
                      className="h-14 text-lg rounded-xl bg-card border-2 border-border focus-visible:border-primary focus-visible:ring-0" 
                      {...field}
                      onChange={(e) => field.onChange(formatWhatsApp(e.target.value))}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <p className="text-destructive text-sm font-medium text-center">{submitError}</p>
            )}

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={submitQuiz.isPending}
                className="w-full h-14 text-lg rounded-full font-medium shadow-lg transition-transform duration-200 hover:scale-[1.02]"
              >
                {submitQuiz.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Ver meu resultado agora"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
