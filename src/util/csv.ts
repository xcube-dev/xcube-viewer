/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
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

export class ParseError extends Error {
}

export interface ParseOptions {
    separator: string;
    comment: string;
    quote: string;
    escape: string;
    trim: boolean;
    nanToken: string;
    trueToken: string;
    falseToken: string;
}

export const defaultParseOptions: ParseOptions = {
    separator: ',',
    comment: '#',
    quote: '"',
    escape: '\\',
    trim: true,
    nanToken: 'NaN',
    trueToken: 'true',
    falseToken: 'false',
}

type Line = [string, number];
export type Value = string | number | boolean | null;

export function parseCsv(text: string, options?: Partial<ParseOptions>): Value[][] {
    return new Parser(options).parse(text);
}

class Parser {
    readonly options: ParseOptions;

    constructor(options?: Partial<ParseOptions>) {
        this.options = {
            ...defaultParseOptions,
            ...options
        };
        this.parseLine = this.parseLine.bind(this);
    }

    parse(text: string): Value[][] {
        return this.parseText(text).map(this.parseLine);
    }

    parseText(text: string): Line[] {
        const {comment, trim} = this.options;
        return text
            .split("\n")
            .map((line, index): Line => {
                if (trim) {
                    line = line.trim();
                }
                return [line, index];
            })
            .filter(([line, _index]): boolean => {
                return line.trim() !== "" && !line.startsWith(comment);
            });
    }

    parseLine([line, index]: Line): Value[] {
        const {separator, quote, escape} = this.options;
        let quoteSeen = false;
        const values: Value[] = [];
        let start = 0;
        let end = 0;
        for (; end < line.length; end++) {
            const char = line[end];
            if (char === escape) {
                end++;
            } else if (quoteSeen) {
                if (char === quote) {
                    quoteSeen = false;
                }
            } else if (char === quote) {
                quoteSeen = true;
            } else if (char === separator) {
                this.collectValue(line, start, end, values);
                start = end + 1;
            }
        }
        if (quoteSeen) {
            throw error(`missing quote character [${this.options.quote}]`, index, start);
        }
        this.collectValue(line, start, end, values);
        return values;
    }

    collectValue(line: string, start: number, end: number, values: Value[]): void {
        const token = line.slice(start, end);
        values.push(this.parseToken(token));
    }

    parseToken(token: string): Value {
        const options = this.options;
        if (options.trim) {
            token = token.trim();
        }
        if (token === "") {
            return null;
        }
        if (token.startsWith(options.quote)) {
            token = token.substring(1, token.length - 1);
        } else {
            if (token === options.trueToken) {
                return true;
            }
            if (token === options.falseToken) {
                return false;
            }
            if (token === options.nanToken) {
                return Number.NaN;
            }
            const value = Number(token);
            if (!Number.isNaN(value)) {
                return value;
            }
        }
        return unescapeString(token, options.escape);
    }
}

function error(message: string, lineIndex: number, colIndex: number): ParseError {
    return new ParseError(`line ${lineIndex + 1}, column ${colIndex + 1}: ${message}`);
}

function unescapeString(token: string, escape: string) {
    let end = token.indexOf(escape);
    if (end < 0) {
        return token;
    }
    let start = 0;
    let token2 = '';
    for (; end < token.length; end++) {
        if (token[end] === escape) {
            token2 += token.substring(start, end) + token.substring(end + 1, end + 2);
            end += 2;
            start = end;
        }
    }
    token2 += token.substring(start, token.length);
    return token2;
}
