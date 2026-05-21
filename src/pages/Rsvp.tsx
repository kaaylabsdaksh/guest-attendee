import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Sparkles, Check, X, CalendarPlus, Pencil, Lock, AlertCircle } from "lucide-react";
import banner from "@/assets/event-banner.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Step = "invitation" | "accept" | "decline" | "confirmed-yes" | "confirmed-no" | "closed";

// Mocked invitation payload — would normally be fetched by RSVP token
const invitation = {
  guestName: "Amelia",
  eventName: "An Evening at Aurora Hall",
  host: "Eleanor & James Whitford",
  date: "Saturday, 14 June 2026",
  time: "6:30 PM — Midnight",
  venue: "Aurora Hall, 22 Belgrave Square, London",
  dressCode: "Black Tie",
  description:
    "Join us for an intimate evening of dinner, music and celebration beneath the chandeliers of Aurora Hall.",
  deadline: "Replies kindly requested by 1 June 2026",
  deadlineDate: new Date("2026-06-01T23:59:59"),
  brand: "Whitford & Co.",
};

export default function Rsvp() {
  const [params] = useSearchParams();
  const isClosed = params.get("state") === "closed";
  const initial: Step = isClosed ? "closed" : "invitation";
  const [step, setStep] = useState<Step>(initial);

  const [dietary, setDietary] = useState("");
  const [access, setAccess] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [editing, setEditing] = useState(false);

  const initials = useMemo(
    () => invitation.guestName.split(" ").map((s) => s[0]).join("").slice(0, 2),
    []
  );

  const submitAccept = () => {
    if (!consent) {
      toast.error("Please confirm consent to continue.");
      return;
    }
    setStep("confirmed-yes");
    setEditing(false);
    toast.success("RSVP confirmed — a confirmation email is on its way.");
  };

  const submitDecline = () => {
    setStep("confirmed-no");
    toast.success("Thank you for letting us know.");
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="mx-auto w-full max-w-[560px] px-4 pb-24 pt-6 sm:pt-10">
        {/* Brand strip */}
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium tracking-wide text-foreground/70">
              {invitation.brand}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Private invitation</span>
        </header>

        {/* Banner card */}
        <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-panel">
          <div className="relative">
            <img
              src={banner}
              alt="Aurora Hall ballroom set for the evening"
              width={1280}
              height={832}
              className="aspect-[5/4] w-full object-cover sm:aspect-[16/10]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">
                You're invited, {invitation.guestName}
              </p>
              <h1 className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
                {invitation.eventName}
              </h1>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {invitation.description}
            </p>

            <ul className="space-y-3">
              <DetailRow icon={Calendar} label="Date" value={invitation.date} />
              <DetailRow icon={Clock} label="Time" value={invitation.time} />
              <DetailRow icon={MapPin} label="Venue" value={invitation.venue} />
              <DetailRow icon={User} label="Hosted by" value={invitation.host} />
              <DetailRow icon={Sparkles} label="Dress code" value={invitation.dressCode} />
            </ul>

            <p className="text-xs italic text-muted-foreground">{invitation.deadline}</p>
          </div>
        </section>

        {/* Step content */}
        <section className="mt-6">
          {step === "invitation" && (
            <RsvpActions
              onAccept={() => setStep("accept")}
              onDecline={() => setStep("decline")}
            />
          )}

          {step === "accept" && (
            <Card title="Lovely — a few details" subtitle="So we can host you perfectly.">
              <div className="space-y-4">
                <Field label="Dietary requirements" hint="e.g. vegetarian, gluten-free, allergies">
                  <Input value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="None" />
                </Field>
                <Field label="Accessibility / access needs">
                  <Input value={access} onChange={(e) => setAccess(e.target.value)} placeholder="None" />
                </Field>
                <Field label="Notes for the host (optional)">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything you'd like us to know"
                  />
                </Field>
                <label className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3 text-sm">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(Boolean(v))}
                    className="mt-0.5"
                  />
                  <span className="text-muted-foreground">
                    I consent to my information being used for event-related communications.
                  </span>
                </label>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button variant="ghost" className="sm:flex-1" onClick={() => setStep("invitation")}>
                  Back
                </Button>
                <Button className="h-12 rounded-2xl sm:flex-[2]" onClick={submitAccept}>
                  Confirm attendance
                </Button>
              </div>
            </Card>
          )}

          {step === "decline" && (
            <Card title="We'll miss you" subtitle="A short note is welcome but not required.">
              <Field label="Reason (optional)">
                <Textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={3}
                  placeholder="Travelling, prior engagement, etc."
                />
              </Field>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button variant="ghost" className="sm:flex-1" onClick={() => setStep("invitation")}>
                  Back
                </Button>
                <Button variant="secondary" className="h-12 rounded-2xl sm:flex-[2]" onClick={submitDecline}>
                  Send response
                </Button>
              </div>
            </Card>
          )}

          {step === "confirmed-yes" && (
            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-success text-white shadow-elegant">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-serif text-2xl">You're attending</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We've sent a confirmation to your email.
                </p>

                <div className="mt-5 w-full rounded-2xl bg-muted/60 p-4 text-left">
                  <p className="text-sm font-medium">{invitation.eventName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {invitation.date} · {invitation.time}
                  </p>
                  <p className="text-xs text-muted-foreground">{invitation.venue}</p>
                </div>

                <Button className="mt-5 h-12 w-full rounded-2xl">
                  <CalendarPlus className="mr-2 h-4 w-4" /> Add to calendar
                </Button>
                <button
                  onClick={() => {
                    setStep("accept");
                    setEditing(true);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit my response
                </button>
                {editing && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    You can edit until the RSVP deadline.
                  </p>
                )}
              </div>
            </Card>
          )}

          {step === "confirmed-no" && (
            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground/70">
                  <X className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-serif text-2xl">Thank you</h2>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  We've passed your reply on to {invitation.host.split(" ")[0]}. You're missed already.
                </p>
                <button
                  onClick={() => setStep("invitation")}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Change my response
                </button>
              </div>
            </Card>
          )}

          {step === "closed" && (
            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-serif text-2xl">RSVPs are now closed</h2>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  The deadline for replies has passed. Please contact the host directly for any changes.
                </p>
              </div>
            </Card>
          )}
        </section>

        <footer className="mt-8 text-center text-[11px] text-muted-foreground">
          <p>This invitation is unique to {invitation.guestName} ({initials}).</p>
          <p className="mt-1">Powered with care by {invitation.brand}.</p>
        </footer>
      </div>

      {/* Sticky mobile CTA — only on invitation step */}
      {step === "invitation" && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-card/90 p-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex max-w-[560px] gap-2">
            <Button
              variant="secondary"
              className="h-12 flex-1 rounded-2xl"
              onClick={() => setStep("decline")}
            >
              Decline
            </Button>
            <Button className="h-12 flex-[1.4] rounded-2xl" onClick={() => setStep("accept")}>
              Accept
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </li>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-border/60 bg-card p-5 shadow-soft sm:p-6">
      {title && (
        <div className="mb-4">
          <h2 className="font-serif text-xl text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <Separator className="mt-4" />
        </div>
      )}
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function RsvpActions({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="hidden gap-3 sm:flex">
      <Button variant="secondary" className="h-14 flex-1 rounded-2xl text-base" onClick={onDecline}>
        <X className="mr-2 h-4 w-4" /> Decline
      </Button>
      <Button className="h-14 flex-[1.4] rounded-2xl text-base" onClick={onAccept}>
        <Check className="mr-2 h-4 w-4" /> Accept invitation
      </Button>
    </div>
  );
}
