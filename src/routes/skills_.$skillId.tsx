import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Code2,
  Flame,
  GitBranch,
  HelpCircle,
  Loader2,
  Puzzle,
  RotateCcw,
  Terminal,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/skills_/$skillId")({
  component: SkillPracticePage,
});

/* ────────────────────────────────────────────────────────────── */
/*  HELPERS                                                        */
/* ────────────────────────────────────────────────────────────── */

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* Minimal syntax highlighter */
function highlight(code: string, blankHighlight = false) {
  const KW =
    /\b(const|let|var|function|return|if|else|for|while|export|import|from|new|class|extends|await|async|try|catch|throw|def|print|range|True|False|None|self|with|as|open|in|not|and|or|is|lambda|yield|raise|except|finally|pass|break|continue|elif|del|global|nonlocal|assert|CREATE|INDEX|ON|WHERE|IN|CONCURRENTLY|DESC)\b/g;
  const STR = /([\"'`])(?:\\.|(?!\1).)*\1/g;
  const CMT = /(\/\/[^\n]*|--[^\n]*|#[^\n]*)/g;
  const NUM = /\b\d+\b/g;
  const BLANK = /___+/g;
  type Part = { t: string; c?: string };
  const parts: Part[] = [{ t: code }];
  const apply = (re: RegExp, cls: string) => {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].c) continue;
      const m = [...parts[i].t.matchAll(re)];
      if (!m.length) continue;
      const p = parts.splice(i, 1)[0];
      let last = 0;
      let added = 0;
      for (const match of m) {
        const index = match.index!;
        if (index > last) {
          parts.splice(i + added++, 0, { t: p.t.slice(last, index) });
        }
        parts.splice(i + added++, 0, { t: match[0], c: cls });
        last = index + match[0].length;
      }
      if (last < p.t.length) {
        parts.splice(i + added++, 0, { t: p.t.slice(last) });
      }
      i += added - 1;
    }
  };
  apply(CMT, "text-white/30 italic");
  apply(STR, "text-emerald-300/80");
  apply(KW, "text-indigo-400 font-semibold");
  apply(NUM, "text-fuchsia-300");
  if (blankHighlight) {
    apply(BLANK, "bg-cyan-400/20 text-cyan-300 px-1 rounded font-bold border-b-2 border-cyan-400/50");
  }

  return parts.map((p, i) =>
    p.c ? (
      <span key={i} className={p.c}>
        {p.t}
      </span>
    ) : (
      p.t
    ),
  );
}

/* Shuffle an array using Fisher–Yates */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ────────────────────────────────────────────────────────────── */
/*  CARD TYPES                                                     */
/* ────────────────────────────────────────────────────────────── */

type CardType = "code-review" | "concept" | "predict-output" | "fill-blank";

type BaseCard = {
  id: string;
  type: CardType;
  concept: string;
  why: string;
};

type CodeReviewCard = BaseCard & {
  type: "code-review";
  title: string;
  lang: string;
  code: string;
  bad: boolean;
};

type ConceptCard = BaseCard & {
  type: "concept";
  question: string;
  options: string[];
  correctIndex: number;
};

type PredictOutputCard = BaseCard & {
  type: "predict-output";
  title: string;
  lang: string;
  code: string;
  options: string[];
  correctIndex: number;
};

type FillBlankCard = BaseCard & {
  type: "fill-blank";
  title: string;
  lang: string;
  code: string; // contains `___` placeholder
  options: string[];
  correctIndex: number;
};

type Card = CodeReviewCard | ConceptCard | PredictOutputCard | FillBlankCard;

/* ────────────────────────────────────────────────────────────── */
/*  CARD TYPE METADATA                                             */
/* ────────────────────────────────────────────────────────────── */

const CARD_META: Record<
  CardType,
  {
    label: string;
    icon: React.ElementType;
    accentBorder: string;
    accentBg: string;
    accentText: string;
    accentGlow: string;
    title: string;
    subtitle: string;
    hint: string;
  }
> = {
  "code-review": {
    label: "Code Review",
    icon: GitBranch,
    accentBorder: "border-indigo-400/30",
    accentBg: "bg-indigo-400/10",
    accentText: "text-indigo-300",
    accentGlow: "bg-indigo-500",
    title: "Code Review",
    subtitle: "Approve or Reject.",
    hint: "Swipe right to approve, left to reject",
  },
  concept: {
    label: "Concept",
    icon: Brain,
    accentBorder: "border-violet-400/30",
    accentBg: "bg-violet-400/10",
    accentText: "text-violet-300",
    accentGlow: "bg-violet-500",
    title: "Concept Check",
    subtitle: "Test Your Knowledge.",
    hint: "Select the best answer",
  },
  "predict-output": {
    label: "Predict Output",
    icon: Terminal,
    accentBorder: "border-amber-400/30",
    accentBg: "bg-amber-400/10",
    accentText: "text-amber-300",
    accentGlow: "bg-amber-500",
    title: "Predict the Output",
    subtitle: "Read & Reason.",
    hint: "What does this code print?",
  },
  "fill-blank": {
    label: "Fill in the Blank",
    icon: Puzzle,
    accentBorder: "border-cyan-400/30",
    accentBg: "bg-cyan-400/10",
    accentText: "text-cyan-300",
    accentGlow: "bg-cyan-500",
    title: "Fill the Blank",
    subtitle: "Complete the Code.",
    hint: "Pick the correct missing piece",
  },
};

/* ────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                      */
/* ────────────────────────────────────────────────────────────── */

const PYTHON_CARDS: Card[] = [
  // Code Review cards
  {
    id: "py-cr-1",
    type: "code-review",
    title: "File handling without context manager",
    lang: "python",
    code: `f = open('data.txt', 'r')\ncontent = f.read()\n# Missing f.close()`,
    bad: true,
    concept: "Context Managers",
    why: "Always use the `with` statement for file handling to ensure files are closed properly even if an exception occurs.",
  },
  {
    id: "py-cr-2",
    type: "code-review",
    title: "List comprehension",
    lang: "python",
    code: `squares = [x**2 for x in range(10) if x % 2 == 0]`,
    bad: false,
    concept: "List Comprehensions",
    why: "This is the Pythonic way to create lists. It's concise and generally faster than a standard for-loop.",
  },
  {
    id: "py-cr-3",
    type: "code-review",
    title: "Mutable default argument",
    lang: "python",
    code: `def append_to(element, target=[]):\n    target.append(element)\n    return target`,
    bad: true,
    concept: "Mutable Defaults",
    why: "Default mutable arguments are shared across calls. Use `None` as default and create inside the function body.",
  },
  {
    id: "py-cr-4",
    type: "code-review",
    title: "Dictionary .get() with default",
    lang: "python",
    code: `config = {'debug': True}\nverbose = config.get('verbose', False)`,
    bad: false,
    concept: "Safe Dict Access",
    why: "Using `.get()` with a default value prevents KeyError and is idiomatic Python.",
  },

  // Concept cards
  {
    id: "py-co-1",
    type: "concept",
    question: "What is the purpose of Python's `__init__` method?",
    options: [
      "It initializes a new instance of a class",
      "It destroys an object when it goes out of scope",
      "It defines a static method",
      "It imports modules at class level",
    ],
    correctIndex: 0,
    concept: "OOP Constructors",
    why: "`__init__` is the initializer (often called constructor) that runs when a new instance is created via `ClassName()`. It sets up the object's initial state.",
  },
  {
    id: "py-co-2",
    type: "concept",
    question: "Which statement about Python's GIL is correct?",
    options: [
      "It allows true parallel execution of threads",
      "It prevents multiple threads from executing Python bytecode simultaneously",
      "It only applies to multiprocessing, not threading",
      "It was removed in Python 3.0",
    ],
    correctIndex: 1,
    concept: "Global Interpreter Lock",
    why: "The GIL (Global Interpreter Lock) ensures only one thread executes Python bytecode at a time, which simplifies memory management but limits CPU-bound parallelism.",
  },
  {
    id: "py-co-3",
    type: "concept",
    question: "What does the `yield` keyword do in Python?",
    options: [
      "Terminates the function and returns a value",
      "Pauses the function and produces a value to the caller, creating a generator",
      "Raises an exception",
      "Imports a module lazily",
    ],
    correctIndex: 1,
    concept: "Generators",
    why: "`yield` turns a function into a generator. It pauses execution and produces a value each time `next()` is called, enabling lazy evaluation of sequences.",
  },

  // Predict Output cards
  {
    id: "py-po-1",
    type: "predict-output",
    title: "List multiplication surprise",
    lang: "python",
    code: `a = [[0]] * 3\na[0][0] = 5\nprint(a)`,
    options: [
      "[[5], [0], [0]]",
      "[[5], [5], [5]]",
      "[[0], [0], [5]]",
      "Error",
    ],
    correctIndex: 1,
    concept: "Shallow Copy Pitfall",
    why: "`[[0]] * 3` creates 3 references to the same inner list. Mutating one mutates all of them. Use a list comprehension `[[0] for _ in range(3)]` instead.",
  },
  {
    id: "py-po-2",
    type: "predict-output",
    title: "String slicing",
    lang: "python",
    code: `s = "Hello, World!"\nprint(s[::-1])`,
    options: [
      '"Hello, World!"',
      '"!dlroW ,olleH"',
      '"World! Hello,"',
      "Error",
    ],
    correctIndex: 1,
    concept: "String Slicing",
    why: "`[::-1]` reverses a sequence by stepping backwards through the entire string. This is a common Python idiom for reversing strings and lists.",
  },
  {
    id: "py-po-3",
    type: "predict-output",
    title: "Truthiness of collections",
    lang: "python",
    code: `values = [[], {}, '', 0, None]\nresult = [bool(v) for v in values]\nprint(result)`,
    options: [
      "[True, True, True, True, True]",
      "[False, False, False, False, False]",
      "[False, True, False, True, False]",
      "[True, False, True, False, True]",
    ],
    correctIndex: 1,
    concept: "Truthiness",
    why: "Empty collections (`[]`, `{}`), empty strings, `0`, and `None` are all falsy in Python. Non-empty containers and non-zero numbers are truthy.",
  },

  // Fill in the Blank cards
  {
    id: "py-fb-1",
    type: "fill-blank",
    title: "Context manager syntax",
    lang: "python",
    code: `___ open('file.txt', 'r') as f:\n    data = f.read()`,
    options: ["with", "using", "from", "try"],
    correctIndex: 0,
    concept: "Context Managers",
    why: "The `with` statement ensures proper resource management. It automatically calls `__enter__` and `__exit__` on the context manager, guaranteeing cleanup.",
  },
  {
    id: "py-fb-2",
    type: "fill-blank",
    title: "List comprehension filter",
    lang: "python",
    code: `evens = [x for x in range(20) ___ x % 2 == 0]`,
    options: ["if", "when", "where", "while"],
    correctIndex: 0,
    concept: "List Comprehensions",
    why: "`if` is used in list comprehensions to filter elements. It follows the iteration clause and only includes elements where the condition is True.",
  },
  {
    id: "py-fb-3",
    type: "fill-blank",
    title: "Exception handling",
    lang: "python",
    code: `try:\n    result = 10 / 0\n___ ZeroDivisionError:\n    result = 0`,
    options: ["except", "catch", "handle", "rescue"],
    correctIndex: 0,
    concept: "Exception Handling",
    why: "Python uses `except` to catch exceptions, not `catch` (Java/JS) or `rescue` (Ruby). The `except` clause specifies which exception types to handle.",
  },
];

// Generic fallback
const FALLBACK_CARDS: Card[] = [
  {
    id: "fb-cr-1",
    type: "code-review",
    title: "Generic variable assignment",
    lang: "code",
    code: `let x = 10;\nx = "hello";`,
    bad: true,
    concept: "Type consistency",
    why: "Reassigning a variable with a different type can lead to runtime errors in strictly typed contexts.",
  },
  {
    id: "fb-cr-2",
    type: "code-review",
    title: "Simple loop optimization",
    lang: "code",
    code: `for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}`,
    bad: false,
    concept: "Basic iteration",
    why: "Standard iteration is perfectly acceptable here.",
  },
  {
    id: "fb-co-1",
    type: "concept",
    question: "What is a closure?",
    options: [
      "A function that has access to variables from its outer scope",
      "A class that cannot be instantiated",
      "A loop that terminates early",
      "A method that returns void",
    ],
    correctIndex: 0,
    concept: "Closures",
    why: "A closure is a function that retains access to its lexical scope even when executed outside that scope. This enables powerful patterns like data privacy and partial application.",
  },
  {
    id: "fb-po-1",
    type: "predict-output",
    title: "Type coercion",
    lang: "javascript",
    code: `console.log(1 + "2" + 3)`,
    options: ['"123"', "6", '"33"', '"15"'],
    correctIndex: 0,
    concept: "Type Coercion",
    why: '`1 + "2"` coerces 1 to a string giving "12", then `"12" + 3` coerces 3 to a string giving "123". JavaScript performs left-to-right evaluation.',
  },
  {
    id: "fb-fb-1",
    type: "fill-blank",
    title: "Arrow function",
    lang: "javascript",
    code: `const add = (a, b) ___ a + b;`,
    options: ["=>", "->", "::", "~>"],
    correctIndex: 0,
    concept: "Arrow Functions",
    why: "The `=>` syntax defines an arrow function in JavaScript. For single-expression bodies, the result is implicitly returned without curly braces.",
  },
];

const MOCK_SKILL_DATA: Record<string, Card[]> = {
  python: PYTHON_CARDS,
};

/* ────────────────────────────────────────────────────────────── */
/*  COMPONENTS                                                     */
/* ────────────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
      <div className="flex items-center gap-2 text-[12px] text-white/50">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
    </div>
  );
}

function KeyboardBridge({
  onResolve,
  onSelectOption,
  active,
  cardType,
  optionCount,
}: {
  onResolve: (d: "left" | "right") => void;
  onSelectOption: (index: number) => void;
  active: boolean;
  cardType: CardType;
  optionCount: number;
}) {
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (cardType === "code-review") {
        if (e.key === "ArrowLeft") onResolve("left");
        if (e.key === "ArrowRight") onResolve("right");
      } else {
        // Number keys 1-4 for MCQ selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= optionCount) {
          onSelectOption(num - 1);
        }
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [onResolve, onSelectOption, active, cardType, optionCount]);
  return null;
}

/* ── Code Review Card (swipeable) ── */

function CodeReviewCardComponent({
  card,
  approveOpacity,
  rejectOpacity,
}: {
  card: CodeReviewCard;
  approveOpacity: any;
  rejectOpacity: any;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e12] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-white/50" />
          <span className="text-[12px] font-medium text-white/80">{card.title}</span>
        </div>
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-white/50">
          {card.lang}
        </span>
      </div>
      <pre className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-[1.7] text-white/85">
        <code>{highlight(card.code)}</code>
      </pre>
      <div className="border-t border-white/[0.06] bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-white/70">{card.concept}</span>
      </div>

      <motion.div
        style={{ opacity: approveOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-lg border-2 border-emerald-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-emerald-400"
      >
        Approve
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-lg border-2 border-rose-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-rose-400"
      >
        Reject
      </motion.div>
    </div>
  );
}

/* ── Concept Card (MCQ) ── */

function ConceptCardComponent({
  card,
  selectedOption,
  onSelect,
}: {
  card: ConceptCard;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}) {
  const answered = selectedOption !== null;
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-b from-[#0f0a14] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-violet-400/10 bg-violet-500/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-violet-400/70" />
          <span className="text-[12px] font-medium text-violet-200/80">Concept Question</span>
        </div>
        <span className="rounded border border-violet-400/20 bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-violet-300">
          MCQ
        </span>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="flex items-start gap-3 mb-6">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-violet-400/60" />
          <p className="text-[15px] font-medium leading-relaxed text-white/90">{card.question}</p>
        </div>

        <div className="space-y-2.5">
          {card.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === card.correctIndex;
            let optClass =
              "w-full rounded-xl border px-4 py-3 text-[13px] transition-all cursor-pointer flex items-center gap-3";

            if (!answered) {
              optClass += " border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.06] hover:border-white/20";
            } else if (isCorrect) {
              optClass += " border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
            } else if (isSelected && !isCorrect) {
              optClass += " border-rose-400/40 bg-rose-400/10 text-rose-300";
            } else {
              optClass += " border-white/5 bg-white/[0.01] text-white/30";
            }

            return (
              <button
                key={idx}
                onClick={() => !answered && onSelect(idx)}
                disabled={answered}
                className={optClass}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                    !answered && "bg-white/[0.06] text-white/50",
                    answered && isCorrect && "bg-emerald-400/20 text-emerald-300",
                    answered && isSelected && !isCorrect && "bg-rose-400/20 text-rose-300",
                    answered && !isCorrect && !isSelected && "bg-white/[0.03] text-white/20",
                  )}
                >
                  {answered && isCorrect ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : answered && isSelected && !isCorrect ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="text-left">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-violet-400/10 bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-violet-300/70">{card.concept}</span>
      </div>
    </div>
  );
}

/* ── Predict Output Card (MCQ) ── */

function PredictOutputCardComponent({
  card,
  selectedOption,
  onSelect,
}: {
  card: PredictOutputCard;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}) {
  const answered = selectedOption !== null;
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#12100a] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-amber-400/10 bg-amber-500/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-amber-400/70" />
          <span className="text-[12px] font-medium text-amber-200/80">{card.title}</span>
        </div>
        <span className="rounded border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-300">
          {card.lang}
        </span>
      </div>

      <pre className="overflow-auto border-b border-amber-400/10 bg-black/30 p-4 font-mono text-[12px] leading-[1.7] text-white/85">
        <code>{highlight(card.code)}</code>
      </pre>

      <div className="flex-1 overflow-auto p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-amber-300/60">
          What's the output?
        </p>
        <div className="space-y-2">
          {card.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === card.correctIndex;
            let optClass =
              "w-full rounded-xl border px-4 py-2.5 text-[13px] font-mono transition-all cursor-pointer flex items-center gap-3";

            if (!answered) {
              optClass += " border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.06] hover:border-white/20";
            } else if (isCorrect) {
              optClass += " border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
            } else if (isSelected && !isCorrect) {
              optClass += " border-rose-400/40 bg-rose-400/10 text-rose-300";
            } else {
              optClass += " border-white/5 bg-white/[0.01] text-white/30";
            }

            return (
              <button
                key={idx}
                onClick={() => !answered && onSelect(idx)}
                disabled={answered}
                className={optClass}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                    !answered && "bg-white/[0.06] text-white/50",
                    answered && isCorrect && "bg-emerald-400/20 text-emerald-300",
                    answered && isSelected && !isCorrect && "bg-rose-400/20 text-rose-300",
                    answered && !isCorrect && !isSelected && "bg-white/[0.03] text-white/20",
                  )}
                >
                  {answered && isCorrect ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : answered && isSelected && !isCorrect ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="text-left">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-amber-400/10 bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-amber-300/70">{card.concept}</span>
      </div>
    </div>
  );
}

/* ── Fill in the Blank Card (MCQ) ── */

function FillBlankCardComponent({
  card,
  selectedOption,
  onSelect,
}: {
  card: FillBlankCard;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}) {
  const answered = selectedOption !== null;
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0a1014] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-cyan-400/10 bg-cyan-500/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <Puzzle className="h-3.5 w-3.5 text-cyan-400/70" />
          <span className="text-[12px] font-medium text-cyan-200/80">{card.title}</span>
        </div>
        <span className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-cyan-300">
          {card.lang}
        </span>
      </div>

      <pre className="overflow-auto border-b border-cyan-400/10 bg-black/30 p-4 font-mono text-[12px] leading-[1.7] text-white/85">
        <code>{highlight(card.code, true)}</code>
      </pre>

      <div className="flex-1 overflow-auto p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-cyan-300/60">
          Fill the blank
        </p>
        <div className="grid grid-cols-2 gap-2">
          {card.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === card.correctIndex;
            let optClass =
              "w-full rounded-xl border px-4 py-2.5 text-[13px] font-mono transition-all cursor-pointer text-center";

            if (!answered) {
              optClass += " border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.06] hover:border-white/20";
            } else if (isCorrect) {
              optClass += " border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
            } else if (isSelected && !isCorrect) {
              optClass += " border-rose-400/40 bg-rose-400/10 text-rose-300";
            } else {
              optClass += " border-white/5 bg-white/[0.01] text-white/30";
            }

            return (
              <button
                key={idx}
                onClick={() => !answered && onSelect(idx)}
                disabled={answered}
                className={optClass}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-cyan-400/10 bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-cyan-300/70">{card.concept}</span>
      </div>
    </div>
  );
}

/* ── Card Type Badge ── */

function CardTypeBadge({ type }: { type: CardType }) {
  const meta = CARD_META[type];
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        meta.accentBorder,
        meta.accentBg,
        meta.accentText,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                       */
/* ────────────────────────────────────────────────────────────── */

function SkillPracticePage() {
  const { skillId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Deck — shuffle once on mount
  const rawDeck = MOCK_SKILL_DATA[skillId] || FALLBACK_CARDS;
  const deck = useMemo(() => shuffle(rawDeck), [skillId]);

  // Swiping State
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    card: Card;
    selectedOption?: number;
  }>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [prevStreak, setPrevStreak] = useState(0);
  const [prevXp, setPrevXp] = useState(0);

  // Framer Motion Values (for code-review swipe)
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0.3, 1, 1, 1, 0.3]);
  const approveOpacity = useTransform(x, [20, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, -20], [1, 0]);

  const card = deck[i % deck.length];
  const meta = CARD_META[card.type];

  const formattedSkillName = skillId
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ── Resolve: code-review swipe ── */
  function resolveSwipe(dir: "left" | "right") {
    if (card.type !== "code-review") return;
    const userSaysBad = dir === "left";
    const correct = userSaysBad === card.bad;
    setPrevStreak(streak);
    setPrevXp(xp);
    setFeedback({ correct, card });
    if (correct) {
      setStreak((s) => s + 1);
      setXp((v) => v + 15);
    } else {
      setStreak(0);
    }
  }

  /* ── Resolve: MCQ option select ── */
  function resolveOption(index: number) {
    if (card.type === "code-review") return;
    if (selectedOption !== null) return; // already answered
    setSelectedOption(index);
    const correct = index === (card as ConceptCard | PredictOutputCard | FillBlankCard).correctIndex;
    setPrevStreak(streak);
    setPrevXp(xp);

    // Delay feedback slightly to let the user see their selection highlight
    setTimeout(() => {
      setFeedback({ correct, card, selectedOption: index });
      if (correct) {
        setStreak((s) => s + 1);
        setXp((v) => v + 15);
      } else {
        setStreak(0);
      }
    }, 600);
  }

  function nextCard() {
    setFeedback(null);
    setSelectedOption(null);
    setI((n) => n + 1);
    x.set(0);
  }

  function undo() {
    if (!feedback) return;
    setStreak(prevStreak);
    setXp(prevXp);
    setFeedback(null);
    setSelectedOption(null);
    x.set(0);
  }

  /* ── Render the right card component ── */
  function renderCard() {
    switch (card.type) {
      case "code-review":
        return (
          <CodeReviewCardComponent
            card={card}
            approveOpacity={approveOpacity}
            rejectOpacity={rejectOpacity}
          />
        );
      case "concept":
        return (
          <ConceptCardComponent
            card={card}
            selectedOption={selectedOption}
            onSelect={resolveOption}
          />
        );
      case "predict-output":
        return (
          <PredictOutputCardComponent
            card={card}
            selectedOption={selectedOption}
            onSelect={resolveOption}
          />
        );
      case "fill-blank":
        return (
          <FillBlankCardComponent
            card={card}
            selectedOption={selectedOption}
            onSelect={resolveOption}
          />
        );
    }
  }

  /* ── Feedback explanation for MCQ types ── */
  function renderFeedbackExtra() {
    if (!feedback) return null;
    const fb = feedback;
    if (fb.card.type === "code-review") return null;
    const mcqCard = fb.card as ConceptCard | PredictOutputCard | FillBlankCard;
    return (
      <div className="mt-3 space-y-2">
        {fb.selectedOption !== undefined && fb.selectedOption !== mcqCard.correctIndex && (
          <div className="rounded-lg border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-[12px] text-rose-300/80">
            <span className="font-semibold">Your answer:</span> {mcqCard.options[fb.selectedOption]}
          </div>
        )}
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[12px] text-emerald-300/80">
          <span className="font-semibold">Correct answer:</span> {mcqCard.options[mcqCard.correctIndex]}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30">
      {/* Subtle Background Glow — uses card type accent color */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.06] blur-[150px] transition-colors duration-700",
          meta.accentGlow,
        )}
      />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/skills"
              className="flex items-center gap-1.5 text-[13px] text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Skills Library
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/dashboard" className="text-[13px] text-white/50 transition hover:text-white">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            {formattedSkillName} Session
          </div>
        </div>
      </header>

      {/* Main Practice Area */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Info & Stats */}
          <div>
            <CardTypeBadge type={card.type} />
            <h1 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              {meta.title}
              <br />
              <span className="text-white/40">{meta.subtitle}</span>
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/60">
              You are practicing <strong>{formattedSkillName}</strong>.{" "}
              {card.type === "code-review"
                ? "Evaluate the code for potential bugs, anti-patterns, or security flaws. Swipe right if the code is solid, swipe left to reject it."
                : meta.hint + ". Choose wisely — first try earns full XP!"}
            </p>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <StatCard icon={Flame} label="Streak" value={streak} />
              <StatCard icon={Zap} label="Session XP" value={xp} />
              <StatCard icon={TrendingUp} label="Cards" value={i + (feedback ? 1 : 0)} />
            </div>

            <div className="mt-8 flex items-center gap-4 text-[12px] text-white/50">
              {card.type === "code-review" ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                      ←
                    </kbd>
                    Reject
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                      →
                    </kbd>
                    Approve
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                      1-4
                    </kbd>
                    Select option
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Card Area */}
          <div className="relative mx-auto h-[520px] w-full max-w-md">
            <AnimatePresence mode="wait">
              {!feedback && (
                <motion.div
                  key={`${i}-${card.type}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  {...(card.type === "code-review"
                    ? {
                        drag: "x" as const,
                        dragConstraints: { left: 0, right: 0 },
                        onDragEnd: (_: any, info: any) => {
                          if (info.offset.x < -100) resolveSwipe("left");
                          else if (info.offset.x > 100) resolveSwipe("right");
                        },
                        style: { x, rotate, opacity },
                      }
                    : {})}
                  className={cn(
                    "absolute inset-0",
                    card.type === "code-review" && "cursor-grab active:cursor-grabbing",
                  )}
                >
                  {renderCard()}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-xl backdrop-blur-sm"
                >
                  <div
                    className={cn(
                      "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      feedback.correct
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-rose-400/10 text-rose-300",
                    )}
                  >
                    {feedback.correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {feedback.correct ? "+15 XP" : "Missed"}
                  </div>
                  <div className="mt-4 text-[15px] font-semibold text-white">
                    {feedback.card.concept}
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/65">
                    {feedback.card.why}
                  </p>

                  {renderFeedbackExtra()}

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <button
                      onClick={undo}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Undo
                    </button>
                    <button
                      onClick={nextCard}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-all cursor-pointer",
                        card.type === "code-review"
                          ? "bg-indigo-500 hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                          : card.type === "concept"
                            ? "bg-violet-500 hover:bg-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                            : card.type === "predict-output"
                              ? "bg-amber-500 hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-black"
                              : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-black",
                      )}
                    >
                      Next Card
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!feedback && card.type === "code-review" && (
              <div className="pointer-events-none absolute -bottom-6 left-1/2 flex w-full -translate-x-1/2 justify-center gap-2 text-[11px] text-white/30">
                <span>Drag horizontally to review</span>
              </div>
            )}
            {!feedback && card.type !== "code-review" && (
              <div className="pointer-events-none absolute -bottom-6 left-1/2 flex w-full -translate-x-1/2 justify-center gap-2 text-[11px] text-white/30">
                <span>Click an option or press 1-4</span>
              </div>
            )}
          </div>
        </div>
        <KeyboardBridge
          onResolve={resolveSwipe}
          onSelectOption={resolveOption}
          active={!feedback}
          cardType={card.type}
          optionCount={card.type !== "code-review" ? (card as any).options?.length ?? 4 : 0}
        />
      </main>
    </div>
  );
}
