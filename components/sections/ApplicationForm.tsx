"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { applicationSchema, type ApplicationFormValues } from "@/lib/schemas";

export function ApplicationForm({ roleTitle, roleId }: { roleTitle: string; roleId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    // TODO: no backend/ATS is wired up yet. Wire this to an email service,
    // ATS integration, or database before launch. For now we log the
    // submission (minus the file contents) so the flow is reviewable.
    console.log("Application submitted", {
      ...data,
      resume: data.resume?.[0]?.name,
      roleId,
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-off-white p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-medium text-black">Application received.</h2>
        <p className="mt-2 text-gray-600">
          Thanks for applying to {roleTitle}. We&apos;ll be in touch if there&apos;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <label htmlFor="which-role" className="mb-1.5 block text-sm font-medium text-black">
          Applying for
        </label>
        <input
          id="which-role"
          value={roleTitle}
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            className={inputClass(!!errors.name)}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            className={inputClass(!!errors.phone)}
            {...register("phone")}
          />
        </Field>
        <Field
          label="LinkedIn / Portfolio URL"
          htmlFor="linkedinOrPortfolio"
          error={errors.linkedinOrPortfolio?.message}
        >
          <input
            id="linkedinOrPortfolio"
            type="url"
            placeholder="https://"
            className={inputClass(!!errors.linkedinOrPortfolio)}
            {...register("linkedinOrPortfolio")}
          />
        </Field>
      </div>

      <Field label="Resume (PDF)" htmlFor="resume" error={errors.resume?.message as string}>
        <input
          id="resume"
          type="file"
          accept="application/pdf"
          className={inputClass(!!errors.resume) + " file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white"}
          {...register("resume")}
        />
      </Field>

      <Field label="Cover Note" htmlFor="coverNote" error={errors.coverNote?.message}>
        <textarea
          id="coverNote"
          rows={5}
          className={inputClass(!!errors.coverNote)}
          {...register("coverNote")}
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus-visible:outline-2 focus-visible:outline-accent"
            {...register("consent")}
          />
          I consent to ProEduvate storing my application details for recruitment purposes.
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.consent.message as string}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-black focus-visible:outline-2 focus-visible:outline-accent ${
    hasError ? "border-red-400" : "border-gray-200"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-black">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
