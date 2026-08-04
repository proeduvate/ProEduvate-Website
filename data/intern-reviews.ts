/*
 * Interns who have worked with ProEduvate.
 *
 * NAMES AND TRACKS ARE REAL, as supplied by the company. The quotes are NOT
 * -- they are drafted stand-ins so the section can be built and reviewed.
 * Collect the actual words from each person (with their permission) and
 * replace them before launch; attributing an invented quote to a real,
 * named person is the one thing this section must never ship doing.
 */

export interface InternReview {
  quote: string;
  name: string;
  track: string;
  cohort: string;
  initials: string;
  /** False until the person's own words have replaced the draft. */
  quoteApproved: boolean;
}

export const internReviews: InternReview[] = [
  {
    quote:
      "I shipped to a real product module in my first fortnight. Nothing here felt like busywork built to keep interns occupied.",
    name: "Vijayalakshmi",
    track: "Full Stack Development",
    cohort: "Cohort 01",
    initials: "V",
    quoteApproved: false,
  },
  {
    quote:
      "The code review culture is the part I did not expect. Every PR came back with reasoning, not just approvals.",
    name: "Sakthi S",
    track: "Software Development",
    cohort: "Cohort 01",
    initials: "SS",
    quoteApproved: false,
  },
  {
    quote:
      "I came in knowing React and left understanding how a product actually gets decided, scoped, and released.",
    name: "Srinath L",
    track: "Front End Development",
    cohort: "Cohort 01",
    initials: "SL",
    quoteApproved: false,
  },
  {
    quote:
      "Being handed ownership of a feature this early was daunting, and it is the reason I improved as fast as I did.",
    name: "Selvi P",
    track: "Backend Development",
    cohort: "Cohort 02",
    initials: "SP",
    quoteApproved: false,
  },
  {
    quote:
      "The team treated my questions as useful rather than an interruption. That changed how much I was willing to attempt.",
    name: "Janani P",
    track: "Product Development",
    cohort: "Cohort 02",
    initials: "JP",
    quoteApproved: false,
  },
  {
    quote:
      "Weekly demos meant my work was visible to the whole company. It kept the standard high and the feedback fast.",
    name: "Hari Haran",
    track: "Full Stack Development",
    cohort: "Cohort 02",
    initials: "HH",
    quoteApproved: false,
  },
  {
    quote:
      "I learned to write for a real audience rather than for a brief. The feedback loop was days, not months.",
    name: "Shalini",
    track: "Digital Marketing",
    cohort: "Cohort 02",
    initials: "S",
    quoteApproved: false,
  },
  {
    quote:
      "Working on the models behind a live product is nothing like a course project. The constraints are what taught me.",
    name: "Jayashri",
    track: "AI & Machine Learning",
    cohort: "Cohort 03",
    initials: "J",
    quoteApproved: false,
  },
  {
    quote:
      "I joined expecting to observe and ended up owning a piece of the release. That trust is why I stayed on.",
    name: "Vignesh",
    track: "Backend Development",
    cohort: "Cohort 03",
    initials: "V",
    quoteApproved: false,
  },
];
