import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuizStore } from "@/lib/store";
import { useCreateEvent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface Option {
  text: string;
  scoreArea: string | null;
}

interface Question {
  key: string;
  text: string;
  options: Option[];
}

const questions: Question[] = [
  {
    key: "estado_civil",
    text: "Para começarmos, qual é o seu estado civil atual?",
    options: [
      { text: "Casado(a)", scoreArea: null },
      { text: "Solteiro(a)", scoreArea: null },
      { text: "Namorando / Noivo(a)", scoreArea: null },
      { text: "Divorciado(a) / Viúvo(a)", scoreArea: null },
    ],
  },
  {
    key: "energia_matinal",
    text: "Como você se sente na maior parte dos seus dias logo ao acordar?",
    options: [
      { text: "Cansado, sem energia física e sentindo o corpo pesado.", scoreArea: "saude" },
      { text: "Ansioso, com a mente a mil e já sobrecarregado antes do dia começar.", scoreArea: "emocional" },
      { text: "Frustrado com o clima em casa ou preocupado com minha família.", scoreArea: "familia" },
      { text: "Desconectado de um propósito maior, sentindo um vazio interno.", scoreArea: "espiritual" },
      { text: "Preocupado com boletos, estagnado ou insatisfeito com meu trabalho.", scoreArea: "profissional" },
    ],
  },
  {
    key: "sacrificio_rotina",
    text: "Quando a rotina aperta e falta tempo, o que você costuma sacrificar primeiro?",
    options: [
      { text: "Minha alimentação e meus treinos.", scoreArea: "saude" },
      { text: "Minha paciência; acabo explodindo ou me isolando.", scoreArea: "emocional" },
      { text: "O tempo de qualidade e a atenção com meu cônjuge e/ou filhos.", scoreArea: "familia" },
      { text: "Meu tempo com Deus, orações e leitura.", scoreArea: "espiritual" },
      { text: "Meus projetos pessoais e o foco no meu crescimento financeiro.", scoreArea: "profissional" },
    ],
  },
  {
    key: "problema_a_resolver",
    text: "Se você pudesse resolver um único problema hoje, qual traria mais paz para a sua vida?",
    options: [
      { text: "Ter saúde de ferro, disposição e o corpo que desejo.", scoreArea: "saude" },
      { text: "Ter blindagem emocional, paz mental e parar de procrastinar.", scoreArea: "emocional" },
      { text: "Ter um lar harmonioso, sem brigas e com conexão real.", scoreArea: "familia" },
      { text: "Ter clareza espiritual e intimidade para ouvir a voz de Deus.", scoreArea: "espiritual" },
      { text: "Ter paz financeira e ser reconhecido pelo meu trabalho.", scoreArea: "profissional" },
    ],
  },
  {
    key: "termometro_intencao",
    text: "O quanto você está disposto(a) a investir energia para assumir o governo dessa área nos próximos 30 dias?",
    options: [
      { text: "Totalmente disposto. Não aceito mais viver como estou hoje.", scoreArea: null },
      { text: "Disposto, mas tenho pouco tempo na rotina.", scoreArea: null },
      { text: "Quero apenas entender o que está acontecendo primeiro.", scoreArea: null },
    ],
  },
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  
  const answers = useQuizStore((state) => state.answers);
  const setAnswer = useQuizStore((state) => state.setAnswer);
  
  const createEvent = useCreateEvent();
  const [eventFired, setEventFired] = useState(false);

  useEffect(() => {
    if (!eventFired) {
      createEvent.mutate({ data: { eventName: "quiz_started", leadId: null } });
      setEventFired(true);
    }
  }, [createEvent, eventFired]);

  // Pre-fill if going back
  useEffect(() => {
    const q = questions[currentStep];
    const existing = answers.find(a => a.questionKey === q.key);
    if (existing) {
      const opt = q.options.find(o => o.text === existing.answerText);
      setSelectedOption(opt || null);
    } else {
      setSelectedOption(null);
    }
  }, [currentStep, answers]);

  const handleNext = () => {
    if (!selectedOption) return;
    
    const q = questions[currentStep];
    setAnswer({
      questionKey: q.key,
      questionText: q.text,
      answerText: selectedOption.text,
      scoreArea: selectedOption.scoreArea,
    });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setLocation("/escola-de-governo/quiz/contato");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      setLocation("/escola-de-governo");
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-white max-w-2xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-primary/5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Pergunta {currentStep + 1} de {questions.length}
        </span>
      </header>

      <Progress value={progress} className="h-2 mb-12 bg-secondary" />

      <main className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground leading-tight text-balance">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption?.text === option.text;
            return (
              <button
                key={idx}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary-foreground shadow-md" 
                    : "border-border hover:border-primary/50 hover:bg-muted bg-card text-foreground"
                }`}
              >
                <span className={`block text-lg ${isSelected ? "font-semibold text-primary" : "font-medium"}`}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="mt-12">
        <Button 
          onClick={handleNext} 
          disabled={!selectedOption}
          className="w-full h-14 text-lg rounded-full font-medium shadow-lg hover:scale-[1.02] transition-transform duration-200"
        >
          {currentStep === questions.length - 1 ? "Finalizar" : "Próxima"}
          {currentStep < questions.length - 1 && <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </footer>
    </div>
  );
}
