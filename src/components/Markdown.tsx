/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import { useTheme } from "@mui/material";
import OriginalMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  text?: string;
}

export default function Markdown({ text }: MarkdownProps) {
  const theme = useTheme();
  const components = useMemo(
    () => ({
      p: (props: Record<string, unknown>) => {
        const { node: _, ...rest } = props;
        return <p {...rest} style={{ padding: 0, margin: 0 }} />;
      },
      a: (props: Record<string, unknown>) => {
        const { node: _, ...rest } = props;
        return (
          <a
            {...rest}
            style={{
              color: theme.palette.mode === "dark" ? "#90caf9" : "#1e90ff",
            }}
          />
        );
      },
      code: (props: Record<string, unknown>) => {
        const { node: _, ...rest } = props;
        return (
          <code
            {...rest}
            style={{
              color: theme.palette.mode === "dark" ? "#bbb" : "#666",
            }}
          />
        );
      },
      img: (props: Record<string, unknown>) => {
        const { node: _, ...rest } = props;
        return <img style={{ maxWidth: "100%" }} {...rest} />;
      },
    }),
    [theme],
  );

  if (!text) {
    return null;
  }

  return (
    <OriginalMarkdown
      children={text}
      components={components}
      linkTarget="_blank"
      remarkPlugins={[remarkGfm]}
    />
  );
}
