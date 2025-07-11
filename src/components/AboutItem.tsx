/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import i18n from "@/i18n";
import { type WithLocale } from "@/util/lang";

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";

interface AboutDialogProps extends WithLocale {}

const AboutItem = ({}: AboutDialogProps) => {
  const text = useFetchText(i18n.get("docs/about.en.md"));

  return <Markdown text={text} />;
};

export default AboutItem;
