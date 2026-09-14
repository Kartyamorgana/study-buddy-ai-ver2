// src/components/studynotes/MarkdownPreview.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  Check,
  Info,
  Lightbulb,
  AlertTriangle,
  Flame,
  Star,
  Clock,
  FileText,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  CodeBlock                                                                 */
/* -------------------------------------------------------------------------- */

function CodeBlock({ className, children }: { className?: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const lang = (className ?? "").replace("language-", "").replace("hljs", "").trim() || "text";
  const text = String(Array.isArray(children) ? children.join("") : children ?? "");
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{lang}</span>
        <button className="copy-btn" onClick={onCopy} type="button">
          {copied ? <Check className="inline w-3 h-3 mr-1" /> : <Copy className="inline w-3 h-3 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Callouts                                                                  */
/* -------------------------------------------------------------------------- */

const CALLOUTS = {
  NOTE: { label: "Catatan", icon: Info, cls: "callout-note" },
  TIP: { label: "Tips", icon: Lightbulb, cls: "callout-tip" },
  IMPORTANT: { label: "Penting", icon: Star, cls: "callout-important" },
  WARNING: { label: "Hati-hati", icon: AlertTriangle, cls: "callout-warning" },
  CAUTION: { label: "Awas", icon: Flame, cls: "callout-caution" },
} as const;

type CalloutKey = keyof typeof CALLOUTS;

const CALLOUT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/i;

/**
 * Deteksi marker `[!TYPE]` di awal blockquote TANPA re-render ulang isinya.
 * Mengembalikan { key, children } dengan marker di-strip, atau null jika bukan callout.
 */
function extractCallout(children: ReactNode): { key: CalloutKey; children: ReactNode } | null {
  const arr = Array.isArray(children) ? children : [children];
  if (arr.length === 0) return null;
  const first = arr[0];

  // Kasus A: anak pertama adalah string mentah
  if (typeof first === "string") {
    const m = first.match(CALLOUT_RE);
    if (!m) return null;
    const key = m[1]!.toUpperCase() as CalloutKey;
    const rest = first.slice(m[0].length);
    const remaining = rest.trim() ? [rest, ...arr.slice(1)] : arr.slice(1);
    return { key, children: remaining.length === 1 ? remaining[0] : remaining };
  }

  // Kasus B: anak pertama adalah elemen (biasanya <p>)
  if (isValidElement(first)) {
    const el = first as { props?: { children?: ReactNode } };
    const inner = el.props?.children;
    const innerArr = Array.isArray(inner) ? inner : [inner];
    const firstInner = innerArr[0];
    if (typeof firstInner !== "string") return null;

    const m = firstInner.match(CALLOUT_RE);
    if (!m) return null;

    const key = m[1]!.toUpperCase() as CalloutKey;
    const restText = firstInner.slice(m[0].length);
    const newInnerArr = restText.trim()
      ? [restText, ...innerArr.slice(1)]
      : innerArr.slice(1);

    // cloneElement untuk strip marker — anak-anak lain tetap utuh
    const clonedFirst = cloneElement(
      first as React.ReactElement,
      {},
      ...(newInnerArr as ReactNode[]),
    );
    const newChildren = [clonedFirst, ...arr.slice(1)];
    return { key, children: newChildren.length === 1 ? newChildren[0] : newChildren };
  }

  return null;
}

function Blockquote({ children }: { children?: ReactNode }) {
  const callout = extractCallout(children);
  if (!callout) return <blockquote>{children}</blockquote>;
  const meta = CALLOUTS[callout.key];
  const Icon = meta.icon;
  return (
    <div className={`callout ${meta.cls}`}>
      <div className="callout-title">
        <Icon className="w-4 h-4" />
        {meta.label}
      </div>
      <div className="callout-body">{callout.children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Symbol map & MATHY                                                        */
/* -------------------------------------------------------------------------- */

const SYMBOLS: Record<string, string> = {
  rightarrow: "→",
  Rightarrow: "⇒",
  leftarrow: "←",
  Leftarrow: "⇐",
  leftrightarrow: "↔",
  to: "→",
  times: "×",
  cdot: "·",
  approx: "≈",
  neq: "≠",
  leq: "≤",
  geq: "≥",
  pm: "±",
  infty: "∞",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  Delta: "Δ",
  theta: "θ",
  lambda: "λ",
  mu: "μ",
  pi: "π",
  sigma: "σ",
  Sigma: "Σ",
  omega: "ω",
  Omega: "Ω",
};

const MATHY =
  /^(frac|dfrac|tfrac|sqrt|sum|prod|int|iint|oint|lim|binom|vec|hat|bar|tilde|overline|underline|overrightarrow|mathrm|mathbf|mathbb|mathcal|operatorname|log|ln|exp|sin|cos|tan|sec|csc|cot|partial|nabla|cdots|ldots|dots|begin|end|left|right|substack|matrix|pmatrix|bmatrix|cases|align|aligned|text)$/;

/* -------------------------------------------------------------------------- */
/*  normalizeMath                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Pastikan `<details>...</details>` punya blank line di sekitar kontennya
 * agar markdown di dalam (termasuk rumus $...$) tetap diparsing.
 *
 * Pendekatan: per-line scan untuk handle indentasi (list item) & line ending.
 */
function fixDetailsBlocks(src: string): string {
  // Normalisasi line ending dulu — AI kadang kirim \r\n (Windows)
  const normalized = src.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  const out: string[] = [];
  let inDetails = false;
  let indent = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Deteksi awal <details> (mungkin dengan indentasi di dalam list item)
    const openMatch = line.match(/^([ \t]*)<details\b/i);
    if (openMatch) {
      inDetails = true;
      indent = openMatch[1];
      out.push(line);
      continue;
    }

    if (inDetails) {
      // Setelah </summary> → pastikan ada blank line sebelum konten berikutnya
      if (/<\/summary>\s*$/i.test(line)) {
        out.push(line);
        const next = lines[i + 1];
        if (next !== undefined && next.trim() !== "") {
          out.push(indent); // blank line dengan indentasi yang sama
        }
        continue;
      }

      // Sebelum </details> → pastikan ada blank line sebelum tag penutup
      if (/^[ \t]*<\/details>/i.test(line)) {
        const prev = out[out.length - 1];
        if (prev !== undefined && prev.trim() !== "") {
          out.push(indent);
        }
        out.push(line);
        inDetails = false;
        continue;
      }
    }

    out.push(line);
    void trimmed;
  }

  return out.join("\n");
}

export function normalizeMath(src: string): string {
  // 0a. Normalisasi line ending
  let out = src.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 0b. Fix <details> blocks agar markdown di dalamnya diparsing
  out = fixDetailsBlocks(out);

  // 1. \[ ... \] -> $$ ... $$ ; \( ... \) -> $ ... $
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner) => `\n$$\n${String(inner).trim()}\n$$\n`);
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner) => `$${String(inner).trim()}$`);

  // protect(): split pada delimiter math/kode.
  const protect = (s: string) =>
    s.split(/(\$\$[\s\S]*?\$\$|\$[^$]{1,500}?\$|`[^`]*`|```[\s\S]*?```)/g);

  // 2. \begin{env} ... \end{env} di luar math -> blok $$
  out = protect(out)
    .map((seg, i) =>
      i % 2 === 1
        ? seg
        : seg.replace(
            /\\begin\{(equation\*?|align\*?|aligned|gather\*?|cases|array|[pbvB]?matrix)\}([\s\S]*?)\\end\{\1\}/g,
            (_m, env: string, body: string) =>
              env.startsWith("equation")
                ? `\n$$\n${body.trim()}\n$$\n`
                : `\n$$\n\\begin{${env}}${body}\\end{${env}}\n$$\n`,
          ),
    )
    .join("");

  // 3. Perintah bermakna matematika + argumen/sub-superskrip yang lupa dibungkus $
  out = protect(out)
    .map((seg, i) => {
      if (i % 2 === 1) return seg;
      return seg.replace(
        /\\[A-Za-z]+(?:\s*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\[[^\]\n]*\]|[_^]\{[^{}]*\}|[_^][A-Za-z0-9]))+/g,
        (m) => {
          const name = /^\\([A-Za-z]+)/.exec(m)?.[1] ?? "";
          if (!MATHY.test(name)) return m;
          return `$${m.trim()}$`;
        },
      );
    })
    .join("");

  // 4. Perintah LaTeX berdiri sendiri di luar math -> simbol unicode
  return protect(out)
    .map((seg, i) => {
      if (i % 2 === 1) return seg;
      return seg.replace(/\\([A-Za-z]+)/g, (m, name: string) => SYMBOLS[name] ?? m);
    })
    .join("");
}

/* -------------------------------------------------------------------------- */
/*  MarkdownPreview                                                           */
/* -------------------------------------------------------------------------- */

export function MarkdownPreview({ source }: { source: string }) {
  const stats = useMemo(() => {
    const words = source.trim() ? source.trim().split(/\s+/).length : 0;
    return { words, minutes: Math.max(1, Math.round(words / 200)) };
  }, [source]);

  return (
    <div className="prose-note">
      {stats.words > 120 && (
        <div className="note-meta">
          <span>
            <FileText className="w-3.5 h-3.5" /> {stats.words.toLocaleString("id-ID")} kata
          </span>
          <span>
            <Clock className="w-3.5 h-3.5" /> ±{stats.minutes} menit baca
          </span>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeKatex, { throwOnError: false, strict: false }],
          rehypeHighlight,
        ]}
        components={{
          blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children, ...rest }) => {
            const isInternal = typeof href === "string" && href.startsWith("/");
            if (isInternal) {
              return (
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={href as any}
                  className="text-primary underline underline-offset-2 hover:opacity-80 font-medium"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
                {...rest}
              >
                {children}
              </a>
            );
          },
          code: ({
            className,
            children,
            ...props
          }: {
            className?: string;
            children?: ReactNode;
            node?: unknown;
            inline?: boolean;
          }) => {
            const isBlock = className?.includes("language-");
            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {source ? normalizeMath(source) : "*Start writing to see the preview...*"}
      </ReactMarkdown>
    </div>
  );
}