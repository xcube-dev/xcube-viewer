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
import { useTheme } from "@mui/material";
import OriginalMarkdown from "react-markdown";

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
        return <code {...rest} style={{ color: "grey" }} />;
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
    />
  );
}
