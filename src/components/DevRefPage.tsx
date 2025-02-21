/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import { type ContributionState, useContributionsRecord } from "chartlets";

import i18n from "@/i18n";
import { type WithLocale } from "@/util/lang";
import { derivedStateProperties } from "@/ext/store";
import MarkdownPage from "@/components/MarkdownPage";
import useFetchText from "@/hooks/useFetchText";

interface DevRefPageProps extends WithLocale {
  open: boolean;
  onClose: () => void;
}

export const DevRefPage = ({ open, onClose }: DevRefPageProps) => {
  const templateText = useFetchText(i18n.get("docs/dev-reference.en.md"));
  const contributionPoints = useContributionsRecord();

  const text = useMemo(() => {
    if (templateText) {
      const extensionsMarkdown = getExtensionsMarkdown(contributionPoints);
      const derivedStateMarkdown = getDerivedStateMarkdown();
      return templateText
        .replace("${extensions}", extensionsMarkdown)
        .replace("${derivedState}", derivedStateMarkdown);
    }
  }, [templateText, contributionPoints]);

  return (
    <MarkdownPage
      title={i18n.get("Developer Reference")}
      text={text || ""}
      open={open}
      onClose={onClose}
    />
  );
};

export default DevRefPage;

function getExtensionsMarkdown(
  contributionPoints: Record<string, ContributionState[]>,
) {
  const lines: string[] = [];
  Object.getOwnPropertyNames(contributionPoints).forEach(
    (contribPoint: string) => {
      const contributionStates = contributionPoints[contribPoint];
      lines.push(`\nContribution point **\`${contribPoint}\`**:\n`);
      contributionStates.forEach(({ name, extension }) => {
        lines.push(`- \`${name}\` from extension \`${extension}\``);
      });
    },
  );
  return lines.join("\n");
}

function getDerivedStateMarkdown() {
  const lines: string[] = [];
  Object.getOwnPropertyNames(derivedStateProperties).forEach(
    (propertyName: string) => {
      const derivedProperty = derivedStateProperties[propertyName];
      lines.push(
        `- \`${propertyName}\`: **${derivedProperty.type}**    ${derivedProperty.description}`,
      );
    },
  );
  return lines.join("\n");
}
