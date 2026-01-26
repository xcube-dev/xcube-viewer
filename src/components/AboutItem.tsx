/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";
import { Config } from "@/config";

const AboutItem = () => {
  const configPath = Config.instance.branding.configPath;

  const text = useFetchText(configPath + "about.en.md");
  return <Markdown text={text} path={configPath} />;
};

export default AboutItem;
