/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";
import { buildPath } from "@/util/path";

import { Config } from "@/config";

const AboutItem = () => {
  const configPath = Config.instance.configPath;
  const aboutItemPath = buildPath(configPath, "about.en.md");

  const text = useFetchText(aboutItemPath);
  return <Markdown text={text} path={configPath} />;
};

export default AboutItem;
