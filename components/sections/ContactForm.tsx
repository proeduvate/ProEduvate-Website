"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactFormValues } from "@/lib/schemas";

const reasons: ContactFormValues["reason"][] = [
  "General Inquiry",
  "Partnership",
  "Careers",
  "Media",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { reason: "General Inquiry" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // TODO: no backend is wired up yet; wire to an email service or CRM
    // before launch. Logging for now so the flow is reviewable end-to-end.
    console.log("Contact form submitted", data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface-2 p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-medium text-chalk">Message sent.</h2>
        <p className="mt-2 text-gray-400">We usually reply within two business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-chalk">
            Name
          </label>
          <input id="name" type="text" className={inputClass(!!errors.name)} {...register("name")} />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-chalk">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-chalk">
            Company <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input id="company" type="text" className={inputClass(false)} {...register("company")} />
        </div>
        <div>
          <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-chalk">
            Reason
          </label>
          <select id="reason" className={inputClass(false)} {...register("reason")}>
            {reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-chalk">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className={inputClass(!!errors.message)}
          {...register("message")}
        />
        {errors.message && <ErrorText>{errors.message.message}</ErrorText>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-surface px-4 py-3 text-sm text-chalk focus-visible:outline-2 focus-visible:outline-accent ${
    hasError ? "border-red-400" : "border-white/10"
  }`;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
      {children}
    </p>
  );
}
