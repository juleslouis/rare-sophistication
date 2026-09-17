import React from "react";
import { Hr, Link, Section, Text } from "@react-email/components";
import { DivusLayout, rule, type EmailLocale } from "./divus-layout";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: EmailLocale;
}

const ACCESS_URL = "https://maisondivus.com/collection";

const copy = {
  fr: { preview: "L'accès est ouvert.", heading: "L'accès est ouvert.", cta: "Accéder" },
  en: { preview: "Access is open.", heading: "Access is open.", cta: "Enter" },
};

const Email = ({ locale = "fr" }: Props) => {
  const t = copy[locale] ?? copy.fr;
  return (
    <DivusLayout locale={locale} preview={t.preview}>
      <Text style={heading}>{t.heading}</Text>
      <Section style={linkWrap}>
        <Link href={ACCESS_URL} style={link}>{t.cta}</Link>
      </Section>
      <Section style={bottomRuleWrap}>
        <Hr style={rule} />
      </Section>
    </DivusLayout>
  );
};

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    data?.locale === "en" ? "Access is open" : "Accès ouvert",
  displayName: "Ouverture — Accès ouvert",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const heading = {
  margin: "0",
  paddingBottom: "40px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "24px",
  lineHeight: "1.6",
  color: "#151515",
};

const linkWrap = { paddingBottom: "64px", textAlign: "center" as const };

const link = {
  display: "inline-block",
  paddingBottom: "4px",
  borderBottom: "1px solid #0A0A0A",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "14px",
  lineHeight: "1.4",
  letterSpacing: "2px",
  color: "#0A0A0A",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const bottomRuleWrap = { paddingBottom: "64px" };