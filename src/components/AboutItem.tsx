/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";
import { getConfigPath } from "@/util/configPath";
import { buildPath } from "@/util/path";

const AboutItem = () => {
  const configPath = getConfigPath();
  const aboutItemPath = buildPath(configPath, "about.en.md");

  const text = useFetchText(aboutItemPath);
  return <Markdown text={text} path={configPath} />;
};

export default AboutItem;
