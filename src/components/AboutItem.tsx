/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";
import i18n from "@/i18n";

const AboutItem = () => {
  const text = useFetchText(i18n.get("about.en.md"));
  return <Markdown text={text} />;
};

export default AboutItem;
