/*
 * The CEO spotlight on the About page.
 *
 * NOTHING HERE IS CONFIRMED YET. No name, portrait, or statement has been
 * supplied, so the section renders its layout with each field visibly marked
 * as pending rather than inventing a person or putting words in their mouth.
 *
 * To finish it:
 *   1. Drop the portrait at `public/team/ceo.jpg` (portrait crop, ~4:5,
 *      at least 800px wide) and set `photo` to "/team/ceo.jpg".
 *   2. Fill in `name`.
 *   3. Replace `quote` with the CEO's actual words and set
 *      `quoteApproved: true` — that flag is what removes the caveat from
 *      the page.
 *   4. Replace `bio` and `focus` with real detail.
 */

export interface CeoProfile {
  name: string | null;
  role: string;
  photo: string | null;
  quote: string;
  quoteApproved: boolean;
  bio: string;
  /** Short "what they own" list shown beside the portrait. */
  focus: string[];
}

export const ceo: CeoProfile = {
  name: null,
  role: "Chief Executive Officer",
  photo: null,
  quote:
    "We started ProEduvate because the software institutions depend on every day was years behind the software everyone uses everywhere else. Closing that gap is still the whole job.",
  quoteApproved: false,
  bio: "Sets the direction across ProEduvate's product line and client work, and holds both to the same standard of craft.",
  focus: ["Company direction", "Product standard", "Partnerships"],
};
