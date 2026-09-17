import React from "react";
import { Hr, Section, Text } from "@react-email/components";
import { DivusLayout, rule, type EmailLocale } from "./divus-layout";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: EmailLocale;
}

const copy = {
  fr: {
    preview: "Une question, avant tout.",
    question: "Pourquoi cette pièce vous intéresse-t-elle ?",
    answer: "Répondez simplement à cet email.",
    priority: "Les réponses les plus sincères recevront un accès prioritaire à l'ouverture.",
  },
  en: {
    preview: "One question, before anything else.",
    question: "Why does this piece interest you?",
    answer: "Simply reply to this email.",
    priority: "The most sincere responses will receive priority access when it opens.",
  },
};

const Email = ({ locale = "fr" }: Props) => {
  const t = copy[locale] ?? copy.fr;
  return (
    <DivusLayout locale={locale} preview={t.preview}>
      <Text style={question}>{t.question}</Text>
      <Text style={answer}>
        {t.answer}
        <br />
        {t.priority}
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
    data?.locale === "en" ? "One question, before anything else" : "Une question, avant tout",
  displayName: "Question — Accès prioritaire",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const question = {
  maxWidth: "400px",
  margin: "0 auto",
  paddingBottom: "32px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "22px",
  lineHeight: "1.6",
  color: "#151515",
};

const answer = {
  maxWidth: "400px",
  margin: "0 auto",
  paddingBottom: "56px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  lineHeight: "1.8",
  color: "#4A4A46",
};

const bottomRuleWrap = { paddingBottom: "64px" };