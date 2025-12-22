/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useMemo } from "react";
import { useTheme } from "@mui/material";
import OriginalMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildPath } from "@/util/path";

interface MarkdownProps {
  text?: string;
  path?: string;
}

export default function Markdown({ text, path }: MarkdownProps) {
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
        const mode = theme.palette.mode;

        const { node: _, ...rest } = props;
        const alt = rest.alt as string;
        const fullSrc = rest.src as string;

        const [rawSrc, fragment] = fullSrc.split("#");
        let src = rawSrc;

        if (fragment === "light-mode-only" && mode !== "light") return null;
        if (fragment === "dark-mode-only" && mode !== "dark") return null;

        const style: React.CSSProperties = {
          display: "block",
          margin: "1rem auto",
          maxWidth: "100%",
        };

        if (path) {
          src = buildPath(path, src);
        }

        return <img src={src} alt={alt} style={style} />;
      },
    }),
    [theme, path],
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
