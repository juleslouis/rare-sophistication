import React from "react";
import { Hr, Section, Text } from "@react-email/components";
import { DivusLayout, rule, type EmailLocale } from "./divus-layout";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: EmailLocale;
}

const copy = {
  fr: {
    preview: "La pierre se travaille avec la lumière du Sud. Nous aussi.",
    line1: "La pierre se travaille",
    line2: "avec la lumière du Sud.",
    line3: "Nous aussi.",
  },
  en: {
    preview: "Stone is shaped with the light of the South. So are we.",
    line1: "Stone is shaped",
    line2: "with the light of the South.",
    line3: "So are we.",
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
        <br />
        {t.line3}
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
    data?.locale === "en" ? "Material" : "Matière",
  displayName: "Indice textuel — Matière",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const message = {
  margin: "0",
  paddingBottom: "64px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: "italic" as const,
  fontSize: "21px",
  lineHeight: "1.8",
  color: "#151515",
};

const bottomRuleWrap = { paddingBottom: "64px" };
