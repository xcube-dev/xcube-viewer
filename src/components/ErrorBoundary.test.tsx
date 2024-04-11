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

import { expect, it, describe } from "vitest";
import { render } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function MyWidget(props: { name: string | null }) {
    if (!props.name) {
        throw new Error('Oh no!');
    }
    return <div className="myWidget">{`Hi ${props.name}!`}</div>;
}

describe('ErrorBoundary', () => {
    it('renders the child if child does not throw', () => {
        const {getByText} = render(<ErrorBoundary><MyWidget name="Bibo"/></ErrorBoundary>);
        const element = getByText(/Hi Bibo!/i);
        expect(element).toBeInTheDocument();
    });

    it('renders the correct text when a child throws', () => {
        const {getByText} = render(<ErrorBoundary><MyWidget name={null}/></ErrorBoundary>);
        const element1 = getByText(/Something went wrong/i);
        expect(element1).toBeInTheDocument();
        const element2 = getByText(/Oh no/i);
        expect(element2).toBeInTheDocument();
    });

    it('throws when no children given', () => {
        expect(() => {
            render(<ErrorBoundary/>);
        }).toThrow();
    });
});
