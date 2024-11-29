/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
