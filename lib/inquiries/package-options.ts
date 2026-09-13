import { newbornPackages } from "@/lib/data/packages";
import { trainingCourses } from "@/lib/data/training";
import type { SessionType } from "@/lib/inquiries/types";

/**
 * Package choices offered in the booking form, per session type — reads
 * from the same real package/course data shown on /packages/ and
 * /training/, so the form can never drift out of sync with what's
 * actually published. Session types without a published package list
 * (maternity, baby, cake-smash, family) get an empty list; the form
 * treats that as "no package step" for that session type.
 */
export function getPackageOptions(sessionType: SessionType): string[] {
  if (sessionType === "newborn") {
    return newbornPackages.map((pkg) => pkg.name);
  }
  if (sessionType === "training") {
    return trainingCourses.map((course) => course.name);
  }
  return [];
}
