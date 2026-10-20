"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FinderAnswers, MatchResponse } from "@/lib/types";
import { AGE_RANGES, BUDGETS, GENDERS, INTERESTS, OCCASIONS, PET_AGES, PET_OCCASIONS, PET_TYPES, REGIONS, RELATIONS } from "@/lib/options";
import { Choice, ChoiceGrid } from "./Choice";
import { Results } from "./Results";
import { FinderStage } from "./FinderStage";

type StepId = "who" | "about" | "interests" | "petType" | "petAge" | "occasion" | "budget";

const HUMAN_STEPS: StepId[] = ["who", "about", "interests", "occasion", "budget"];
const PET_STEPS: StepId[] = ["who", "petType", "petAge", "occasion", "budget"];

function initialAnswers(params: URLSearchParams): FinderAnswers {
  if (params.get("for") === "pet") return { recipientType: "pet" };
  const relation = params.get("relation") ?? undefined;
  return { recipientType: "human", relation: relation && RELATIONS.includes(relation) ? relation : undefined };
}

export function GiftFinder() {
  const params = useSearchParams();
  const [answers, setAnswers] = useState<FinderAnswers>(() => initialAnswers(params));
  const startsAhead = params.get("for") === "pet" || !!answers.relation;
  const [step, setStep] = useState(startsAhead ? 1 : 0);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  const steps = answers.recipientType === "pet" ? PET_STEPS : HUMAN_STEPS;
  const current = steps[step];
  const set = (patch: Partial<FinderAnswers>) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function submit(exclude: string[] = []) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, exclude }),
      });
      if (!res.ok) throw new Error();
      const data: MatchResponse = await res.json();
      setResult(data);
      setSeen((s) => [...new Set([...s, ...data.picks.map((p) => p.product.id)])]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong finding your gifts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canContinue = useMemo(() => {
    switch (current) {
      case "who": return answers.recipientType === "pet" || !!answers.relation;
      case "about": return !!answers.ageRange;
      case "interests": return true;
      case "petType": return !!answers.petType;
      case "petAge": return true;
      case "occasion": return !!answers.occasion;
      case "budget": return !!answers.budget;
    }
  }, [current, answers]);

  const summary = [
    answers.recipientType === "pet" ? (answers.petType && answers.petType !== "Other" ? `🐾 ${answers.petType}` : "🐾 A pet") : answers.relation,
    answers.ageRange,
    answers.petAge,
    ...(answers.interests ?? []),
    answers.occasion,
    BUDGETS.find((b) => b.value === answers.budget)?.label,
  ].filter((s): s is string => !!s);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
      <div className="lg:sticky lg:top-24 lg:order-2">
        <FinderStage build={result || loading ? 3 : Math.min(step, 3)} phase={loading ? "matching" : result ? "revealed" : "asking"} summary={summary} />
      </div>
      <div className="min-w-0 lg:order-1">{renderBody()}</div>
    </div>
  );

  function renderBody() {
    if (loading) return <Thinking pet={answers.recipientType === "pet"} />;

    if (result) {
      return (
        <Results
          result={result}
          onShuffle={() => submit(seen)}
          onRestart={() => {
            setResult(null);
            setSeen([]);
            setStep(0);
            setAnswers({ recipientType: "human" });
          }}
          onEdit={() => {
            setResult(null);
            setSeen([]);
          }}
        />
      );
    }

    return (
      <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Step {step + 1} of {steps.length}</span>
          {step > 0 && <button onClick={back} className="font-medium hover:text-ink">← Back</button>}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1}>
          <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <div key={current} className="animate-rise mt-8">
          {current === "who" && (
            <Step title="Who's the lucky one?" hint="Pick the closest fit.">
              <ChoiceGrid>
                {RELATIONS.map((r) => (
                  <Choice key={r} selected={answers.recipientType === "human" && answers.relation === r} onClick={() => { set({ recipientType: "human", relation: r }); next(); }}>
                    {r}
                  </Choice>
                ))}
                <Choice selected={answers.recipientType === "pet"} onClick={() => { setAnswers({ recipientType: "pet" }); setStep(1); }}>
                  🐾 A pet
                </Choice>
              </ChoiceGrid>
            </Step>
          )}

          {current === "about" && (
            <Step title="Tell us a little about them">
              <Label>How old are they?</Label>
              <ChoiceGrid cols={4}>
                {AGE_RANGES.map((a) => (
                  <Choice key={a} selected={answers.ageRange === a} onClick={() => set({ ageRange: a })}>{a}</Choice>
                ))}
              </ChoiceGrid>
              <Label className="mt-7">Gift style <span className="font-normal text-muted">(optional)</span></Label>
              <ChoiceGrid cols={4}>
                {GENDERS.map((g) => (
                  <Choice key={g} selected={answers.gender === g} onClick={() => set({ gender: answers.gender === g ? undefined : g })}>{g}</Choice>
                ))}
              </ChoiceGrid>
            </Step>
          )}

          {current === "interests" && (
            <Step title="What are they into?" hint="Choose up to four — or skip if you're not sure.">
              <ChoiceGrid cols={3}>
                {INTERESTS.map((i) => {
                  const selected = answers.interests?.includes(i.value) ?? false;
                  const full = (answers.interests?.length ?? 0) >= 4;
                  return (
                    <Choice
                      key={i.value}
                      selected={selected}
                      disabled={!selected && full}
                      onClick={() =>
                        set({ interests: selected ? answers.interests!.filter((x) => x !== i.value) : [...(answers.interests ?? []), i.value] })
                      }
                    >
                      <span aria-hidden className="mr-1.5">{i.emoji}</span>{i.value}
                    </Choice>
                  );
                })}
              </ChoiceGrid>
            </Step>
          )}

          {current === "petType" && (
            <Step title="What kind of pet?">
              <ChoiceGrid cols={3}>
                {PET_TYPES.map((p) => (
                  <Choice key={p.value} big selected={answers.petType === p.value} onClick={() => { set({ petType: p.value }); next(); }}>
                    <span className="block text-4xl" aria-hidden>{p.emoji}</span>{p.value === "Other" ? "Other pet" : p.value}
                  </Choice>
                ))}
              </ChoiceGrid>
            </Step>
          )}

          {current === "petAge" && (
            <Step title="How old are they?" hint="Optional, but it helps.">
              <ChoiceGrid cols={2}>
                {PET_AGES.map((a) => (
                  <Choice key={a} selected={answers.petAge === a} onClick={() => { set({ petAge: a }); next(); }}>{a}</Choice>
                ))}
              </ChoiceGrid>
            </Step>
          )}

          {current === "occasion" && (
            <Step title="What's the occasion?">
              <ChoiceGrid cols={3}>
                {(answers.recipientType === "pet" ? PET_OCCASIONS : OCCASIONS).map((o) => (
                  <Choice key={o} selected={answers.occasion === o} onClick={() => { set({ occasion: o }); next(); }}>{o}</Choice>
                ))}
              </ChoiceGrid>
            </Step>
          )}

          {current === "budget" && (
            <Step title="What would you like to spend?">
              <ChoiceGrid cols={3}>
                {BUDGETS.map((b) => (
                  <Choice key={b.value} selected={answers.budget === b.value} onClick={() => set({ budget: b.value })}>
                    <span className="block font-semibold">{b.label}</span>
                    <span className="block text-sm font-normal text-muted">{b.hint}</span>
                  </Choice>
                ))}
              </ChoiceGrid>
              <Label className="mt-7">Where should it ship? <span className="font-normal text-muted">(optional)</span></Label>
              <select
                value={answers.region ?? ""}
                onChange={(e) => set({ region: e.target.value || undefined })}
                className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-[15px] focus:border-brand focus:outline-none"
              >
                <option value="">Anywhere</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <Label className="mt-7" htmlFor="notes">Anything else we should know? <span className="font-normal text-muted">(optional)</span></Label>
              <textarea
                id="notes"
                rows={3}
                maxLength={400}
                value={answers.notes ?? ""}
                onChange={(e) => set({ notes: e.target.value })}
                placeholder={answers.recipientType === "pet" ? "e.g. destroys every toy within a day, loves chasing things" : "e.g. just got into sourdough, always cold, has every gadget already"}
                className="w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-muted/70 focus:border-brand focus:outline-none"
              />
            </Step>
          )}
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm font-medium text-brand-ink">{error}</p>}

        {(current === "about" || current === "interests" || current === "petAge" || current === "budget") && (
          <div className="mt-8 flex justify-end">
            {current === "budget" ? (
              <button className="btn-primary" disabled={!canContinue} onClick={() => submit()}>Find my gifts ✨</button>
            ) : (
              <button className="btn-dark" disabled={!canContinue} onClick={next}>
                {current === "interests" && !answers.interests?.length ? "Skip" : "Continue"} →
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="h-display text-3xl sm:text-4xl">{title}</legend>
      {hint && <p className="mt-2 text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function Label({ children, className = "", htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className={`mb-3 block text-[15px] font-semibold ${className}`}>{children}</label>;
}

function Thinking({ pet }: { pet: boolean }) {
  return (
    <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[2rem] border border-line bg-white p-10 text-center shadow-soft" role="status">
      <div className="relative h-20 w-20">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand text-4xl">{pet ? "🐾" : "🎁"}</span>
      </div>
      <p className="h-display mt-8 text-2xl">Finding gifts they&apos;ll love…</p>
      <p className="mt-2 text-muted">Weighing every idea against your answers.</p>
    </div>
  );
}
