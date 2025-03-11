/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import { type WithLocale } from "@/util/lang";
import MarkdownPage from "@/components/MarkdownPage";
import useFetchText from "@/hooks/useFetchText";

interface ImprintPageProps extends WithLocale {
  open: boolean;
  onClose: () => void;
}

const ImprintPage = ({ open, onClose }: ImprintPageProps) => {
  const text = useFetchText(i18n.get("docs/imprint.en.md"));
  return (
    <MarkdownPage
      title={i18n.get("Imprint")}
      text={text ?? ""}
      open={open}
      onClose={onClose}
    />
  );
};

export default ImprintPage;
