/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { type WithLocale } from "@/util/lang";

import Markdown from "@/components/Markdown";
import useFetchText from "@/hooks/useFetchText";
import { Config } from "@/config";

interface AboutDialogProps extends WithLocale {}

const AboutItem = ({}: AboutDialogProps) => {
  const path = Config.instance.branding.allowAboutPage ?? "";
  const text = useFetchText(path);

  return <Markdown text={text} />;
};

export default AboutItem;
