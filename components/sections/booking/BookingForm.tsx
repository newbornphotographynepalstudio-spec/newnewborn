"use client";

import { useActionState, useState } from "react";
import type { ChangeEvent } from "react";

import { Cluster } from "@/components/primitives/Cluster";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Select } from "@/components/ui/form/Select";
import { Textarea } from "@/components/ui/form/Textarea";
import { contactInfo } from "@/lib/data/contact";
import { newbornPackages } from "@/lib/data/packages";
import { submitInquiry, type SubmitInquiryState } from "@/lib/inquiries/actions";
import { getPackageOptions } from "@/lib/inquiries/package-options";
import {
  CONTACT_PREFERENCES,
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  type ContactPreference,
} from "@/lib/inquiries/types";
import type { SessionType } from "@/lib/inquiries/types";
import { routes } from "@/lib/navigation/routes";

const initialState: SubmitInquiryState = { status: "idle" };

const contactPreferenceLabels: Record<(typeof CONTACT_PREFERENCES)[number], string> = {
  phone: "Phone call",
  whatsapp: "WhatsApp",
  email: "Email",
};

type FieldValues = {
  name: string;
  email: string;
  phone: string;
  package: string;
  babyName: string;
  familyMembers: string;
  babyDob: string;
  dueDate: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate: string;
  contactPreference: ContactPreference;
  message: string;
};

/**
 * The public booking/training enquiry form. Package options change based
 * on the selected session type (lib/inquiries/package-options.ts reads
 * from the same real package/course data shown on /packages/ and
 * /training/). Submits to the submitInquiry Server Action, which writes
 * straight to Firestore via the Admin SDK — see docs/ARCHITECTURE.md for
 * why this needs real Firebase credentials to actually persist data.
 *
 * `defaultSessionType` lets a page link here with the right session type
 * already selected (e.g. /book-a-session/?type=training from the Training
 * page) instead of every visitor landing on "Newborn Photography" and
 * having to change it themselves.
 *
 * Every field is a controlled input (value + onChange into `fields`
 * state) rather than plain uncontrolled `<input>`s — found via testing a
 * genuine failed submission that React's `<form action={...}>` clears
 * every uncontrolled field (not just the ones with errors) once the
 * action settles, success or not, so an enquiry that fails to send was
 * silently wiping out everything the person had just typed. Controlled
 * state means the displayed values survive the action completing,
 * regardless of its outcome.
 */
export function BookingForm({
  defaultSessionType = "newborn",
  defaultPackage,
}: {
  defaultSessionType?: SessionType;
  /** Pre-selects "Preferred Package" — e.g. linking from a specific
   * package's "Book This Package" button. Ignored if it doesn't match one
   * of that session type's real package/course names. */
  defaultPackage?: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const [sessionType, setSessionType] = useState<SessionType>(defaultSessionType);
  const packageOptions = getPackageOptions(sessionType);
  const [consent, setConsent] = useState(false);
  const [fields, setFields] = useState<FieldValues>(() => ({
    name: "",
    email: "",
    phone: "",
    package: defaultPackage && getPackageOptions(defaultSessionType).includes(defaultPackage) ? defaultPackage : "",
    babyName: "",
    familyMembers: "",
    babyDob: "",
    dueDate: "",
    preferredDate: "",
    preferredTime: "",
    alternativeDate: "",
    contactPreference: "phone",
    message: "",
  }));

  function updateField<K extends keyof FieldValues>(key: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: event.target.value as FieldValues[K] }));
    };
  }

  function handleSessionTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextType = event.target.value as SessionType;
    setSessionType(nextType);
    // A package chosen under the previous session type won't exist in the
    // new type's option list — clear it rather than silently submitting a
    // mismatched package name.
    setFields((prev) => ({ ...prev, package: "" }));
  }

  // Only newborn session types have real, published pricing data
  // (lib/data/packages.ts) to show inline — training/maternity/baby/
  // cake-smash/family have no equivalent published price list yet, so
  // this stays undefined for them rather than guessing.
  const selectedPackage =
    sessionType === "newborn" ? newbornPackages.find((pkg) => pkg.name === fields.package) : undefined;

  if (state.status === "success") {
    return (
      <div role="status" className="border border-taupe/25 bg-white px-8 py-12 text-center">
        <p className="text-eyebrow font-medium tracking-eyebrow text-plum uppercase">
          Request Received
        </p>
        <h2 className="mt-3 text-h2">Thank you for reaching out.</h2>
        <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
          We&apos;ve received your session enquiry and will be in touch
          shortly to discuss your preferred date, session details and next
          steps.
        </p>
        <Cluster gap="sm" align="center" justify="center" className="mt-6">
          <Button href={contactInfo.whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp Us
          </Button>
          <Button href={routes.home} variant="secondary">
            Back to Homepage
          </Button>
        </Cluster>
        <div className="mt-8 border-t border-taupe/20 pt-6 text-small text-charcoal/70">
          <a href={`tel:${contactInfo.phoneE164}`} className="hover:text-plum">
            {contactInfo.phoneDisplay}
          </a>
          <span className="mx-2 text-taupe">&middot;</span>
          <a href={`mailto:${contactInfo.email}`} className="hover:text-plum">
            {contactInfo.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onReset={(event) => {
        // React (and the browser) natively reset a <form action={...}>
        // once the action settles, success or failure — including
        // controlled checkboxes, whose `checked` DOM property this reset
        // can flip even though React's own `consent` state never changed
        // (unlike controlled text `value`, which React's input tracking
        // silently repairs). Blocking the native reset outright is the
        // standard fix; every field's real value already lives in this
        // component's own state, not the DOM, so nothing here depends on
        // native reset behavior anyway.
        event.preventDefault();
      }}
    >
      <Stack gap="2xl">
        <fieldset>
          <legend className="flex items-baseline gap-3">
            <span className="font-display text-h3 text-rose">01</span>
            <span className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
              Your Session
            </span>
          </legend>
          <Stack gap="md" className="mt-4">
            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Select
                id="sessionType"
                name="sessionType"
                required
                className="mt-2"
                value={sessionType}
                onChange={handleSessionTypeChange}
              >
                {SESSION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {SESSION_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </div>

            {packageOptions.length > 0 ? (
              <div>
                <Label htmlFor="package">Preferred Package</Label>
                <Select
                  id="package"
                  name="package"
                  className="mt-2"
                  value={fields.package}
                  onChange={updateField("package")}
                >
                  <option value="">Not sure yet</option>
                  {packageOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {selectedPackage ? (
              <div className="border border-taupe/25 bg-blush/40 px-5 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-small font-medium text-plum">{selectedPackage.name}</p>
                  <p className="text-small font-medium text-plum">{selectedPackage.priceLabel}</p>
                </div>
                <p className="mt-1 text-caption text-charcoal/70">
                  {selectedPackage.duration} &middot; {selectedPackage.editedPhotos}
                </p>
                <ul className="mt-3 space-y-1">
                  {selectedPackage.includes.map((item) => (
                    <li key={item} className="text-caption text-charcoal/75">
                      &bull; {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="babyName">Baby&apos;s Name (optional)</Label>
                <Input
                  id="babyName"
                  name="babyName"
                  type="text"
                  className="mt-2"
                  value={fields.babyName}
                  onChange={updateField("babyName")}
                />
              </div>
              <div>
                <Label htmlFor="familyMembers">Number of Family Members (optional)</Label>
                <Input
                  id="familyMembers"
                  name="familyMembers"
                  type="number"
                  min={1}
                  className="mt-2"
                  value={fields.familyMembers}
                  onChange={updateField("familyMembers")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="babyDob">Baby&apos;s Date of Birth (optional)</Label>
                <Input
                  id="babyDob"
                  name="babyDob"
                  type="date"
                  className="mt-2"
                  value={fields.babyDob}
                  onChange={updateField("babyDob")}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Expected Due Date (optional)</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="mt-2"
                  value={fields.dueDate}
                  onChange={updateField("dueDate")}
                />
              </div>
            </div>
          </Stack>
        </fieldset>

        <fieldset>
          <legend className="flex items-baseline gap-3">
            <span className="font-display text-h3 text-rose">02</span>
            <span className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
              Preferred Date
            </span>
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                className="mt-2"
                value={fields.preferredDate}
                onChange={updateField("preferredDate")}
              />
            </div>
            <div>
              <Label htmlFor="preferredTime">Preferred Time (optional)</Label>
              <Input
                id="preferredTime"
                name="preferredTime"
                type="time"
                className="mt-2"
                value={fields.preferredTime}
                onChange={updateField("preferredTime")}
              />
            </div>
            <div>
              <Label htmlFor="alternativeDate">Alternative Date (optional)</Label>
              <Input
                id="alternativeDate"
                name="alternativeDate"
                type="date"
                className="mt-2"
                value={fields.alternativeDate}
                onChange={updateField("alternativeDate")}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-baseline gap-3">
            <span className="font-display text-h3 text-rose">03</span>
            <span className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
              Your Details
            </span>
          </legend>
          <Stack gap="md" className="mt-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-2"
                value={fields.name}
                onChange={updateField("name")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2"
                  value={fields.email}
                  onChange={updateField("email")}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="mt-2"
                  value={fields.phone}
                  onChange={updateField("phone")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contactPreference">Preferred Contact Method</Label>
              <Select
                id="contactPreference"
                name="contactPreference"
                className="mt-2"
                value={fields.contactPreference}
                onChange={updateField("contactPreference")}
              >
                {CONTACT_PREFERENCES.map((pref) => (
                  <option key={pref} value={pref}>
                    {contactPreferenceLabels[pref]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Notes (optional)</Label>
              <Textarea
                id="message"
                name="message"
                className="mt-2"
                placeholder="Anything you'd like us to know"
                value={fields.message}
                onChange={updateField("message")}
              />
            </div>
          </Stack>
        </fieldset>

        <div>
          <Checkbox
            id="consent"
            name="consent"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            label="I'm okay with being contacted about this enquiry by phone, WhatsApp or email."
          />
        </div>

        {state.status === "error" && state.message ? (
          <div role="alert" className="border border-plum/30 bg-blush/40 px-5 py-4">
            <p className="text-small text-charcoal/85">{state.message}</p>
            <p className="mt-2 text-small text-charcoal/70">
              Or reach us directly:{" "}
              <a
                href={contactInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-plum underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>{" "}
              &middot;{" "}
              <a href={`tel:${contactInfo.phoneE164}`} className="text-plum underline-offset-4 hover:underline">
                {contactInfo.phoneDisplay}
              </a>
            </p>
          </div>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full justify-center">
          {pending ? "Sending…" : "Request Your Session"}
        </Button>
      </Stack>
    </form>
  );
}
