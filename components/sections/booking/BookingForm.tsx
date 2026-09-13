"use client";

import { useActionState, useState } from "react";

import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Select } from "@/components/ui/form/Select";
import { Textarea } from "@/components/ui/form/Textarea";
import { contactInfo } from "@/lib/data/contact";
import { submitInquiry, type SubmitInquiryState } from "@/lib/inquiries/actions";
import { getPackageOptions } from "@/lib/inquiries/package-options";
import { CONTACT_PREFERENCES, SESSION_TYPE_LABELS, SESSION_TYPES } from "@/lib/inquiries/types";
import type { SessionType } from "@/lib/inquiries/types";

const initialState: SubmitInquiryState = { status: "idle" };

const contactPreferenceLabels: Record<(typeof CONTACT_PREFERENCES)[number], string> = {
  phone: "Phone call",
  whatsapp: "WhatsApp",
  email: "Email",
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

  if (state.status === "success") {
    return (
      <div className="border border-taupe/25 bg-white px-8 py-12 text-center">
        <p className="text-eyebrow font-medium tracking-eyebrow text-plum uppercase">
          Enquiry Received
        </p>
        <h2 className="mt-3 text-h2">Thank you — your enquiry has been received.</h2>
        <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
          The studio will get back to you directly to confirm details and
          answer any questions. If it&apos;s urgent, WhatsApp is the
          fastest way to reach us in the meantime.
        </p>
        <Button href={contactInfo.whatsappUrl} className="mt-6">
          Message on WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <Stack gap="2xl">
        <fieldset>
          <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
            Your Details
          </legend>
          <Stack gap="md" className="mt-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" required autoComplete="name" className="mt-2" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-2" />
              </div>
            </div>
          </Stack>
        </fieldset>

        <fieldset>
          <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
            Session
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
                onChange={(e) => setSessionType(e.target.value as SessionType)}
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
                  defaultValue={defaultPackage && packageOptions.includes(defaultPackage) ? defaultPackage : ""}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="babyName">Baby&apos;s Name (optional)</Label>
                <Input id="babyName" name="babyName" type="text" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="familyMembers">Number of Family Members (optional)</Label>
                <Input id="familyMembers" name="familyMembers" type="number" min={1} className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="babyDob">Baby&apos;s Date of Birth (optional)</Label>
                <Input id="babyDob" name="babyDob" type="date" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="dueDate">Expected Due Date (optional)</Label>
                <Input id="dueDate" name="dueDate" type="date" className="mt-2" />
              </div>
            </div>
          </Stack>
        </fieldset>

        <fieldset>
          <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
            Date
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input id="preferredDate" name="preferredDate" type="date" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="preferredTime">Preferred Time (optional)</Label>
              <Input id="preferredTime" name="preferredTime" type="time" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="alternativeDate">Alternative Date (optional)</Label>
              <Input id="alternativeDate" name="alternativeDate" type="date" className="mt-2" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">
            Message
          </legend>
          <Stack gap="md" className="mt-4">
            <div>
              <Label htmlFor="contactPreference">Preferred Contact Method</Label>
              <Select id="contactPreference" name="contactPreference" className="mt-2" defaultValue="phone">
                {CONTACT_PREFERENCES.map((pref) => (
                  <option key={pref} value={pref}>
                    {contactPreferenceLabels[pref]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Notes (optional)</Label>
              <Textarea id="message" name="message" className="mt-2" placeholder="Anything you'd like us to know" />
            </div>
          </Stack>
        </fieldset>

        <div>
          <Checkbox
            id="consent"
            name="consent"
            required
            label="I'm okay with being contacted about this enquiry by phone, WhatsApp or email."
          />
        </div>

        {state.status === "error" && state.message ? (
          <p role="alert" className="text-small text-plum">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full justify-center">
          {pending ? "Sending…" : "Request Your Session"}
        </Button>
      </Stack>
    </form>
  );
}
