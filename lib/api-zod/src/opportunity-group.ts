import { z } from "zod/v4";

export const JoinOpportunityGroupBody = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => {
      const isBrazilianNationalNumber = value.length === 10 || value.length === 11;
      const hasBrazilianCountryCode =
        value.startsWith("55") && (value.length === 12 || value.length === 13);

      return isBrazilianNationalNumber || hasBrazilianCountryCode;
    })
    .transform((value) => (value.startsWith("55") ? `+${value}` : `+55${value}`)),
});

export const JoinOpportunityGroupResponse = z.object({
  ok: z.literal(true),
});

export type JoinOpportunityGroupInput = z.input<
  typeof JoinOpportunityGroupBody
>;
export type JoinOpportunityGroupOutput = z.output<
  typeof JoinOpportunityGroupBody
>;
