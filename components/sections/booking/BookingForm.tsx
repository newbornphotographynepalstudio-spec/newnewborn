"use client";

import { useActionState, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Select } from "@/components/ui/form/Select";
import { contactInfo } from "@/lib/data/contact";
import { newbornPackages } from "@/lib/data/packages";
import { submitInquiry, type SubmitInquiryState } from "@/lib/inquiries/actions";
import { getPackageOptions } from "@/lib/inquiries/package-options";
import type { SessionType } from "@/lib/inquiries/types";

const initialState: SubmitInquiryState = { status: "idle" };

/**
 * The public booking form — simplified to exactly 4 visible fields (Name,
 * Phone, Package, Preferred Date). Everything the previous longer version
 * asked for beyond these (email, baby's name/DOB, due date, family size,
 * preferred time, alternative date, contact method, notes, consent
 * checkbox) is either dropped entirely or supplied automatically, since
 * `submitInquiry` (lib/inquiries/actions.ts) already treats every one of
 * those as optional except name/phone/consent — see that file for the one
 * genuine backend change this required (email untangled from a hard
 * requirement, since this form no longer collects it).
 *
 * `sessionType` is NOT a visible field, but it still matters: this same
 * form is reached from every one of the 5 service pages and the Training
 * page, each passing its own real `?type=` (see ServicePageLayout,
 * PortfolioCategoryLayout, the Training page) — collapsing that to a
 * single hardcoded "newborn" would silently mis-record every maternity/
 * baby/cake-smash/family/training enquiry as a newborn one, and would
 * hide Training's own real course names behind an unrelated newborn
 * package list. It's carried through as a hidden field instead, so the
 * dominant newborn path (no `?type=`, the vast majority of entry points
 * sitewide) gets exactly the 4-field experience this simplification asks
 * for, without breaking the other 5 real booking paths that share this
 * same page and component.
 *
 * `consent` is likewise no longer a visible checkbox — submitting this
 * short form is treated as consent to be contacted about it, sent as a
 * hidden field so `submitInquiry`'s existing consent check (unchanged)
 * still passes.
 */
export function BookingForm({
  defaultSessionType = "newborn",
  defaultPackage,
}: {
  defaultSessionType?: SessionType;
  /** Pre-selects the package — e.g. linking from a specific package's
   * "Book This Package" button. Ignored if it doesn't match one of this
   * session type's real package/course names. */
  defaultPackage?: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const sessionType: SessionType = defaultSessionType;
  const packageOptions = getPackageOptions(sessionType);

  const featuredNewbornPackage = newbornPackages.find((pkg) => pkg.featured)?.name;
  const initialPackage =
    defaultPackage && packageOptions.includes(defaultPackage)
      ? defaultPackage
      : (featuredNewbornPackage && packageOptions.includes(featuredNewbornPackage)
          ? featuredNewbornPackage
          : packageOptions[0]) ?? "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [packageName, setPackageName] = useState(initialPackage);
  const [preferredDate, setPreferredDate] = useState("");

  function updateText(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setter(event.target.value);
  }

  if (state.status === "success") {
    return (
      <div role="status" className="border border-taupe/25 bg-white px-8 py-10 text-center">
        <p className="text-eyebrow font-medium tracking-eyebrow text-plum uppercase">Request Received</p>
        <p className="mx-auto mt-3 max-w-prose text-body-lg leading-relaxed text-charcoal/85">
          Thank you! Your booking request has been received. We&apos;ll contact you shortly.
        </p>
        <p className="mt-4 text-small text-charcoal/70">
          Prefer WhatsApp?{" "}
          <a
            href={contactInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-plum underline-offset-4 hover:underline"
          >
            Message us directly
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      <input type="hidden" name="sessionType" value={sessionType} />
      <input type="hidden" name="consent" value="on" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-2"
            value={name}
            onChange={updateText(setName)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="mt-2"
            value={phone}
            onChange={updateText(setPhone)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {packageOptions.length > 0 ? (
          <div>
            <Label htmlFor="package">Select Package</Label>
            <Select
              id="package"
              name="package"
              required
              className="mt-2"
              value={packageName}
              onChange={updateText(setPackageName)}
            >
              {packageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
        <div>
          <Label htmlFor="preferredDate">Preferred Session Date</Label>
          <Input
            id="preferredDate"
            name="preferredDate"
            type="date"
            required
            className="mt-2"
            value={preferredDate}
            onChange={updateText(setPreferredDate)}
          />
        </div>
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
        {pending ? "Sending…" : "Send Booking Request"}
      </Button>
    </form>
  );
}
