import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import VSL from "@/pages/vsl";
import GrupoGratis from "@/pages/grupo-gratis";
import Links from "@/pages/links";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import QuizContact from "@/pages/quiz-contact";
import QuizAnalyzing from "@/pages/quiz-analyzing";
import Result from "@/pages/result";
import CidGrupo from "@/pages/cid-grupo";
import CidManychat from "@/pages/cid-manychat";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Links} />
      <Route path="/como-imprimir-dinheiro-com-palavras" component={VSL} />
      <Route path="/grupo-gratis" component={GrupoGratis} />
      <Route path="/cid/grupo" component={CidGrupo} />
      <Route path="/cid/manychat" component={CidManychat} />
      <Route path="/escola-de-governo" component={Home} />
      <Route path="/escola-de-governo/quiz" component={Quiz} />
      <Route path="/escola-de-governo/quiz/contato" component={QuizContact} />
      <Route path="/escola-de-governo/quiz/analisando" component={QuizAnalyzing} />
      <Route path="/escola-de-governo/resultado/:slug" component={Result} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
