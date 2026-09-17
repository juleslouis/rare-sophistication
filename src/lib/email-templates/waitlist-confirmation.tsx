import React from "react";
import { Hr, Section, Text } from "@react-email/components";
import { DivusLayout, rule, type EmailLocale } from "./divus-layout";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: EmailLocale;
}

const copy = {
  fr: {
    preview: "Votre inscription est enregistrée.",
    line1: "Votre inscription est enregistrée.",
    line2: "Nous reviendrons vers vous.",
  },
  en: {
    preview: "Your registration has been recorded.",
    line1: "Your registration has been recorded.",
    line2: "We will be in touch.",
  },
};

const Email = ({ locale = "fr" }: Props) => {
  const t = copy[locale] ?? copy.fr;
  return (
    <DivusLayout locale={locale} preview={t.preview}>
      <Text style={message}>
        {t.line1}
        <br />
        {t.line2}
      </Text>
      <Section style={bottomRuleWrap}>
        <Hr style={rule} />
      </Section>
    </DivusLayout>
  );
};

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    data?.locale === "en"
      ? "DIVUS — Early access list"
      : "DIVUS — Liste d'accès anticipé",
  displayName: "Confirmation liste d'accès anticipé",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const message = {
  margin: "0",
  paddingBottom: "56px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "19px",
  lineHeight: "1.75",
  color: "#151515",
};

const bottomRuleWrap = { paddingBottom: "64px" };
