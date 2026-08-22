import { useEffect, useRef, useState } from "react";
import {
  ensureMetaPixel,
  trackMetaPixelCustomEvent,
  trackMetaPixelPageView,
  trackMetaPixelViewContent,
} from "@/lib/meta-pixel";
import "./cid-funil.css";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

type FunnelOption = {
  label: string;
  value: string;
};

type FunnelStep = {
  id: string;
  prompt: string;
  options: FunnelOption[];
};

type VturbSmartPlayerElement = HTMLElement & {
  displayHiddenElements?: (
    delaySeconds: number,
    selectors: string[],
    options: { persist: boolean },
  ) => void;
};

const CHECKOUT_URL = "https://hub.la/r/fb-ads";
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const FUNNEL_NAME = "cid_v2_conversacional";
const START_BUTTON_LABEL = "Sim, quero descobrir";
const PITCH_DELAY_SECONDS = 9 * 60 + 10;
const PITCH_CTA_SELECTOR = ".cid-pitch-cta";
const VTURB_PLAYER_ID = "vid-6a892e63245921387e3bf113";
const VTURB_PLAYER_SCRIPT =
  "https://scripts.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/players/6a892e63245921387e3bf113/v4/player.js";
const VTURB_LIBRARY_SCRIPT =
  "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js";
const VTURB_VIDEO_MANIFEST =
  "https://cdn.converteai.net/d96d1452-17dc-48ff-8763-0c764e770de2/6a892e384a151e4680afbf42/main.m3u8";
const VTURB_HOSTS = [
  "https://cdn.converteai.net",
  "https://scripts.converteai.net",
  "https://images.converteai.net",
  "https://license.vturb.com",
];

const QUESTION_STEPS: FunnelStep[] = [
  {
    id: "desire",
    prompt: "Se sua vida financeira mudasse ainda este ano, qual seria a principal mudança que você gostaria de ver?",
    options: [
      { label: "Ganhar mais dinheiro", value: "ganhar_mais_dinheiro" },
      { label: "Sair das dívidas", value: "sair_das_dividas" },
      { label: "Ter dinheiro sobrando", value: "dinheiro_sobrando" },
      { label: "Fazer meu negócio crescer", value: "crescer_negocio" },
      { label: "Dar uma vida melhor para minha família", value: "melhorar_familia" },
    ],
  },
  {
    id: "challenge",
    prompt: "Hoje, qual é o maior desafio que você enfrenta com dinheiro?",
    options: [
      { label: "O dinheiro nunca sobra", value: "dinheiro_nunca_sobra" },
      { label: "Minha renda está travada", value: "renda_travada" },
      { label: "Tenho dívidas", value: "tenho_dividas" },
      { label: "Trabalho muito e ganho pouco", value: "trabalho_ganho_pouco" },
      { label: "Quero crescer mais", value: "quero_crescer_mais" },
    ],
  },
  {
    id: "phrase",
    prompt: "Quando você pensa em dinheiro, qual dessas frases mais aparece na sua cabeça?",
    options: [
      { label: "Dinheiro está difícil", value: "dinheiro_dificil" },
      { label: "Nunca sobra para mim", value: "nunca_sobra_para_mim" },
      { label: "Eu preciso ganhar mais", value: "preciso_ganhar_mais" },
      { label: "Tudo está caro", value: "tudo_esta_caro" },
      { label: "Eu vou prosperar", value: "eu_vou_prosperar" },
    ],
  },
  {
    id: "attempts",
    prompt: "O que você já tentou fazer para melhorar sua vida financeira?",
    options: [
      { label: "Trabalhar mais", value: "trabalhar_mais" },
      { label: "Economizar", value: "economizar" },
      { label: "Buscar renda extra", value: "buscar_renda_extra" },
      { label: "Fazer cursos", value: "fazer_cursos" },
      { label: "Já tentei várias coisas", value: "tentei_varias_coisas" },
    ],
  },
  {
    id: "belief",
    prompt: "Você acredita que aquilo que você pensa e fala todos os dias pode influenciar suas decisões e seus resultados?",
    options: [
      { label: "Sim, acredito", value: "sim_acredito" },
      { label: "Faz sentido", value: "faz_sentido" },
      { label: "Nunca pensei nisso", value: "nunca_pensei_nisso" },
      { label: "Tenho dúvidas", value: "tenho_duvidas" },
    ],
  },
  {
    id: "mechanism",
    prompt: "Qual parte você mais gostaria de aprender?",
    options: [
      { label: "O que declarar", value: "o_que_declarar" },
      { label: "Como declarar", value: "como_declarar" },
      { label: "Quando declarar", value: "quando_declarar" },
      { label: "O que sentir", value: "o_que_sentir" },
      { label: "Quero aprender tudo", value: "aprender_tudo" },
    ],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "A vida que você deseja já existe.",
  },
  {
    id: 2,
    role: "bot",
    text: "Mas talvez exista algo que está te afastando dela sem você perceber.",
  },
  {
    id: 3,
    role: "bot",
    text: "As palavras que você repete todos os dias podem estar construindo a realidade que você vive hoje.",
  },
  {
    id: 4,
    role: "bot",
    text: "Eu sei disso porque eu já vivi uma fase onde parecia impossível mudar.",
  },
  {
    id: 5,
    role: "bot",
    text: "Eu tinha mais de R$ 300 mil em dívidas, minha realidade financeira era completamente diferente...",
  },
  {
    id: 6,
    role: "bot",
    text: "Até que eu comecei a entender o poder das minhas palavras.",
  },
  {
    id: 7,
    role: "bot",
    text: "Aprendi a declarar de uma forma diferente e comecei a construir a vida que eu vivo hoje.",
  },
  {
    id: 8,
    role: "bot",
    text: "Hoje eu tenho uma empresa próspera, moro em um dos melhores condomínios da minha cidade e vivo uma realidade que um dia parecia distante.",
  },
  {
    id: 9,
    role: "bot",
    text: "Agora eu quero entender a sua realidade e te mostrar como esses princípios podem fazer sentido para você.",
  },
  {
    id: 10,
    role: "bot",
    text: "Posso te fazer algumas perguntas rápidas?",
  },
  {
    id: 11,
    role: "bot",
    text: "Vamos começar?",
  },
];

function nextMessagesFor(stepIndex: number): string[] {
  if (stepIndex === 0) {
    return [
      "Entendi.",
      "Então é essa realidade que você quer começar a construir.",
      "Agora eu quero entender o que mais tem pesado para você hoje.",
      QUESTION_STEPS[1].prompt,
    ];
  }

  if (stepIndex === 1) {
    return [
      "Obrigado por me responder.",
      "Muita gente tenta mudar a vida financeira olhando apenas para fora...",
      "Mas existe algo que quase ninguém observa:",
      "As palavras que essa pessoa repete todos os dias.",
      QUESTION_STEPS[2].prompt,
    ];
  }

  if (stepIndex === 2) {
    return [
      "Percebe uma coisa?",
      "Talvez você nunca tenha chamado isso de declaração.",
      "Mas toda vez que você repete uma frase sobre dinheiro, você está declarando algo sobre a sua vida.",
      "A questão é:",
      "Será que as suas palavras estão trabalhando a favor da vida que você quer construir?",
      QUESTION_STEPS[3].prompt,
    ];
  }

  if (stepIndex === 3) {
    return [
      "Eu entendo.",
      "Eu também já tentei resolver minha vida mudando apenas as coisas externas.",
      "Até entender que existe uma mudança que começa dentro:",
      "A forma como eu pensava, falava e agia todos os dias.",
      QUESTION_STEPS[4].prompt,
    ];
  }

  if (stepIndex === 4) {
    return [
      "É exatamente nesse ponto que muitas pessoas começam a enxergar algo diferente.",
      "Não é simplesmente repetir frases positivas.",
      "Existe uma forma correta de declarar.",
      "Existe o que declarar, como declarar, quando declarar e principalmente o que sentir enquanto declara.",
      QUESTION_STEPS[5].prompt,
    ];
  }

  return [
    "Pelas suas respostas, eu já consigo entender uma coisa:",
    "Você quer construir uma realidade financeira diferente.",
    "E foi exatamente isso que eu precisei fazer.",
    "Eu saí de uma realidade com mais de R$300 mil em dívidas para viver uma nova fase da minha vida.",
    "E parte dessa transformação começou quando eu aprendi a usar minhas palavras da forma correta.",
    "Eu preparei uma aula onde vou te mostrar:",
    "O que declarar.",
    "Como declarar.",
    "Quando declarar.",
    "O que sentir enquanto declara.",
    "E como você pode começar a aplicar esses princípios na sua própria vida.",
    "Assista agora.",
  ];
}

function typingDelayFor(text: string): number {
  return Math.min(3600, Math.max(900, text.trim().length * 30));
}

function checkoutWithUtms(baseUrl: string) {
  const checkoutUrl = new URL(baseUrl);
  const pageUrl = new URL(window.location.href);

  pageUrl.searchParams.forEach((value, key) => checkoutUrl.searchParams.set(key, value));

  if (pageUrl.search) {
    const sck = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      .map((parameter) => pageUrl.searchParams.get(parameter) ?? "")
      .join("|");
    checkoutUrl.searchParams.set("sck", sck);
  }

  return checkoutUrl.toString();
}

function ensureVslPreload(href: string, resourceType: "script" | "fetch") {
  const alreadyPreloaded = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="preload"]'),
  ).some((link) => link.href === href);

  if (alreadyPreloaded) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = resourceType;
  if (resourceType === "fetch") {
    link.crossOrigin = "anonymous";
  }
  document.head.appendChild(link);
}

function ensureVslDnsPrefetch(href: string) {
  const alreadyPrefetched = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>('link[rel="dns-prefetch"]'),
  ).some((link) => link.href === href);

  if (alreadyPrefetched) return;

  const link = document.createElement("link");
  link.rel = "dns-prefetch";
  link.href = href;
  document.head.appendChild(link);
}

export default function CidFunil() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showVsl, setShowVsl] = useState(false);
  const messageId = useRef(0);
  const timers = useRef<Set<number>>(new Set());
  const isMounted = useRef(true);
  const historyRef = useRef<HTMLDivElement>(null);
  const vslPlayerRef = useRef<HTMLDivElement>(null);

  const activeStep =
    currentQuestionIndex === null ? null : QUESTION_STEPS[currentQuestionIndex];
  const checkoutUrl =
    typeof window === "undefined" ? CHECKOUT_URL : checkoutWithUtms(CHECKOUT_URL);

  useEffect(() => {
    if (!META_PIXEL_ID) return;

    ensureMetaPixel(META_PIXEL_ID);
    trackMetaPixelPageView(META_PIXEL_ID, window.location.href);
  }, []);

  useEffect(() => {
    isMounted.current = true;

    async function revealIntro() {
      for (let index = 0; index < INITIAL_MESSAGES.length; index += 1) {
        if (!isMounted.current) return;

        if (index > 0) {
          await wait(900);
        }
        setIsTyping(true);
        await wait(typingDelayFor(INITIAL_MESSAGES[index].text));
        if (!isMounted.current) return;

        appendBotMessage(INITIAL_MESSAGES[index].text);
        setIsTyping(false);
      }

      if (isMounted.current) {
        setIsStreaming(false);
      }
    }

    revealIntro();

    return () => {
      isMounted.current = false;
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  useEffect(() => {
    const history = historyRef.current;
    if (!history) return;
    history.scrollTo({ top: history.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!showVsl) return;

    const container = vslPlayerRef.current;
    if (!container) return;

    ensureVslPreload(VTURB_PLAYER_SCRIPT, "script");
    ensureVslPreload(VTURB_LIBRARY_SCRIPT, "script");
    ensureVslPreload(VTURB_VIDEO_MANIFEST, "fetch");
    VTURB_HOSTS.forEach(ensureVslDnsPrefetch);

    const player = document.createElement(
      "vturb-smartplayer",
    ) as VturbSmartPlayerElement;
    player.id = VTURB_PLAYER_ID;
    player.style.cssText = "display:block;margin:0 auto;width:100%;max-width:400px;";

    const placeholder = document.createElement("div");
    placeholder.className = "vturb-player-placeholder";
    placeholder.style.cssText =
      "position:relative;width:100%;padding:177.77777777777777% 0 0;z-index:0;background-color:black;";
    player.appendChild(placeholder);
    container.replaceChildren(player);

    const existingScript = document.head.querySelector<HTMLScriptElement>(
      `script[src="${VTURB_PLAYER_SCRIPT}"]`,
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = VTURB_PLAYER_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }

    let pitchCtaConfigured = false;
    const configurePitchCta = () => {
      if (pitchCtaConfigured || typeof player.displayHiddenElements !== "function") {
        return;
      }

      pitchCtaConfigured = true;
      player.displayHiddenElements(PITCH_DELAY_SECONDS, [PITCH_CTA_SELECTOR], {
        persist: true,
      });
    };

    player.addEventListener("player:ready", configurePitchCta);

    return () => {
      player.removeEventListener("player:ready", configurePitchCta);
      container.replaceChildren();
    };
  }, [showVsl]);

  useEffect(() => {
    if (!showVsl || !META_PIXEL_ID) return;

    ensureMetaPixel(META_PIXEL_ID);
    trackMetaPixelViewContent(META_PIXEL_ID, FUNNEL_NAME);
  }, [showVsl]);

  function wait(duration: number) {
    return new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        resolve();
      }, duration);
      timers.current.add(timer);
    });
  }

  function appendBotMessage(text: string) {
    messageId.current += 1;
    setMessages((current) => [
      ...current,
      { id: messageId.current, role: "bot", text },
    ]);
  }

  function appendUserMessage(text: string) {
    messageId.current += 1;
    setMessages((current) => [
      ...current,
      { id: messageId.current, role: "user", text },
    ]);
  }

  async function revealBotMessages(texts: string[]) {
    for (let index = 0; index < texts.length; index += 1) {
      if (!isMounted.current) return;

      if (index > 0) {
        await wait(900);
      }
      setIsTyping(true);
      await wait(typingDelayFor(texts[index]));
      if (!isMounted.current) return;

      appendBotMessage(texts[index]);
      setIsTyping(false);
    }
  }

  async function handleStart() {
    if (isStreaming || isTyping || hasStarted || showVsl) return;

    if (META_PIXEL_ID) {
      ensureMetaPixel(META_PIXEL_ID);
      trackMetaPixelCustomEvent(
        META_PIXEL_ID,
        "InitiateConversation",
        `${FUNNEL_NAME}:initiate_conversation`,
        { funnel: FUNNEL_NAME, version: "V2" },
      );
    }

    appendUserMessage(START_BUTTON_LABEL);
    setHasStarted(true);
    setIsStreaming(true);
    setIsTyping(true);
    await wait(520);
    await revealBotMessages([QUESTION_STEPS[0].prompt]);
    if (!isMounted.current) return;

    setCurrentQuestionIndex(0);
    setIsStreaming(false);
  }

  function handlePitchClick() {
    if (!META_PIXEL_ID) return;

    ensureMetaPixel(META_PIXEL_ID);
    trackMetaPixelCustomEvent(
      META_PIXEL_ID,
      "cid_v2_offer_click",
      `${FUNNEL_NAME}:offer_click`,
      { funnel: FUNNEL_NAME, version: "V2" },
    );
  }

  async function handleChoice(option: FunnelOption) {
    if (
      isStreaming ||
      isTyping ||
      !hasStarted ||
      showVsl ||
      currentQuestionIndex === null ||
      !activeStep
    ) {
      return;
    }

    const stepIndex = currentQuestionIndex;
    const nextAnswers = { ...answers, [activeStep.id]: option.value };
    setAnswers(nextAnswers);
    appendUserMessage(option.label);
    setIsStreaming(true);

    const response = nextMessagesFor(stepIndex);
    const isLastQuestion = stepIndex === QUESTION_STEPS.length - 1;

    setIsTyping(true);
    await wait(520);
    await revealBotMessages(response);
    if (!isMounted.current) return;

    if (isLastQuestion) {
      setShowVsl(true);
    } else {
      setCurrentQuestionIndex(stepIndex + 1);
    }

    setIsStreaming(false);
  }

  function renderMessageGroups() {
    const groups: Message[][] = [];

    messages.forEach((message) => {
      const lastGroup = groups[groups.length - 1];
      if (message.role === "bot" && lastGroup?.[0]?.role === "bot") {
        lastGroup.push(message);
        return;
      }

      groups.push([message]);
    });

    const lastBotGroup = [...groups]
      .reverse()
      .find((group) => group[0]?.role === "bot");

    return groups.map((group) => {
      const firstMessage = group[0];
      if (firstMessage.role === "user") {
        return (
          <div key={firstMessage.id} className="cid-message-chunk cid-user-row">
            <div className="cid-user-stack">
              <div className="cid-user-bubble">
                <span>{firstMessage.text}</span>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          key={firstMessage.id}
          className={`cid-message-chunk cid-bot-row${showVsl && group === lastBotGroup ? " cid-row-with-vsl" : ""}`}
        >
          <div className="cid-avatar-slot" aria-hidden="true">
            {!(isTyping && group === lastBotGroup) && (
              <img src="/cid-avatar-samuel.png" alt="" />
            )}
          </div>
          <div className="cid-bot-stack">
            {group.map((message) => (
              <div key={message.id} className="cid-bot-line">
                <div className="cid-bot-bubble">{message.text}</div>
              </div>
            ))}
            {showVsl && group === lastBotGroup && (
              <div className="cid-bot-line cid-vsl-line">
                <div className="cid-vsl-bubble" aria-label="VSL Como Imprimir Dinheiro com Suas Palavras">
                  <div ref={vslPlayerRef} className="cid-vturb-player" />
                  <div className="cid-pitch-cta">
                    <a className="cid-pitch-button smartplayer-click-event" href={checkoutUrl} onClick={handlePitchClick}>
                      QUERO MINHA TRANSFORMAÇÃO AGORA
                    </a>
                    <div className="cid-pitch-badges">
                      <span>✓ 7 dias de garantia</span>
                      <span>✓ 100% Seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  return (
    <main className="cid-funnel-page">
      <section
        ref={historyRef}
        className="cid-chat-scroll"
        aria-live="polite"
        aria-label="Conversa do diagnóstico"
      >
        <div className="cid-chat-view">
          <div className="cid-chat-content">
            {renderMessageGroups()}

            {isTyping && (
              <div className="cid-message-chunk cid-bot-row cid-typing-row" aria-label="Estou digitando">
                <div className="cid-avatar-slot" aria-hidden="true">
                  <img src="/cid-avatar-samuel.png" alt="" />
                </div>
                <div className="cid-bot-stack">
                  <div className="cid-bot-line">
                    <div className="cid-bot-bubble cid-typing-bubble">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!hasStarted && !isStreaming && !isTyping && (
              <div className="cid-options">
                <button type="button" className="cid-option" onClick={handleStart}>
                  {START_BUTTON_LABEL}
                </button>
              </div>
            )}

            {hasStarted && !showVsl && !isStreaming && !isTyping && activeStep && (
              <div className="cid-options">
                {activeStep.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="cid-option"
                    onClick={() => handleChoice(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
