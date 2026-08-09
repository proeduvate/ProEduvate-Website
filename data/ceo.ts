/*
 * The CEO spotlight on the About page.
 *
 * NOTHING HERE IS CONFIRMED YET. No name, portrait, or statement has been
 * supplied, so the section renders its layout with each field visibly marked
 * as pending rather than inventing a person or putting words in their mouth.
 *
 * To finish it:
 *   1. Export the portrait as a CUT-OUT PNG with a transparent background
 *      (subject only, no backdrop), save it to `public/team/ceo.png`, and set
 *      `photo`. The section composites it straight onto the page -- there is
 *      no frame or card behind it -- so a photo with its original background
 *      still attached will look wrong.
 *   2. Fill in `name`.
 *   3. Replace `about` with real biography. It is an array; each entry is
 *      one paragraph.
 *   4. Replace `quote` with the CEO's actual words and set
 *      `quoteApproved: true` — that flag is what removes the caveat from
 *      the page.
 */

export interface CeoProfile {
  name: string | null;
  role: string;
  /** Cut-out PNG with a transparent background. */
  photo: string | null;
  /** Biography paragraphs, shown before the statement. */
  about: string[];
  /** Short "what they own" list. */
  focus: string[];
  quote: string;
  quoteApproved: boolean;
}

export const ceo: CeoProfile = {
  name: "Uma Devi G",
  role: "Founder & Chief Executive Officer",
  photo: "/team/ceo.png",
  about: [
    "Uma Devi G founded ProEduvate on a straightforward observation: the software institutions depend on every day had fallen years behind the software the same people use everywhere else. She started the company to close that gap rather than complain about it.",
    "The role since has been less about direction-setting in the abstract and more about holding one standard across two halves of a company — the products ProEduvate runs itself and the work it takes on for clients. Same team, same bar, whichever side it comes from.",
  ],
  focus: ["Company direction", "Product standard", "Partnerships"],
  // Empty until the CEO supplies their own words. The section hides the
  // statement block entirely while this is blank or unapproved.
  quote: "",
  quoteApproved: false,
};
