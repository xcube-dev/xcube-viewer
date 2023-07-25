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

import * as React from 'react'
import Splitter, { SplitDir } from './Splitter';
import { Theme } from "@mui/material/styles";
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';

// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        hor: {
            display: "flex",
            flexFlow: "row nowrap",
            flex: "auto",  // same as "flex: 1 1 auto;"
        },
        ver: {
            // width: "100%",
            height: "100%",
            display: "flex",
            flexFlow: "column nowrap",
            flex: "auto",  // same as "flex: 1 1 auto;"
        },
        childHor: {
            flex: "none",
        },
        childVer: {
            flex: "none",
        },
    });

export interface ISplitPaneProps extends WithStyles<typeof styles> {
    dir: SplitDir;
    initialSize?: number;
    onChange?: (newSize: number, oldSize: number) => void;
    style?: React.CSSProperties;
    child1Style?: React.CSSProperties;
    child2Style?: React.CSSProperties;
    className?: string;
    child1ClassName?: string;
    child2ClassName?: string;
    children: [React.ReactNode, React.ReactNode];
}

export interface ISplitPaneState {
    size: number;
}

/**
 * A simple SplitPane component which must have exactly two child elements.
 *
 * Properties:
 * - dir: the split direction, either "hor" or "ver"
 * - initialSize: the initial width ("hor") or height ("ver") of the first child's container
 */
class SplitPane extends React.PureComponent<ISplitPaneProps, ISplitPaneState> {

    constructor(props: ISplitPaneProps) {
        super(props);
        this.handleSplitDelta = this.handleSplitDelta.bind(this);
        this.state = {size: props.initialSize || 50};
    }

    private handleSplitDelta(delta: number) {
        this.setState((state: ISplitPaneState) => {
            const oldSize = state.size;
            const newSize = oldSize + delta;
            if (this.props.onChange) {
                this.props.onChange(newSize, oldSize);
            }
            return {size: newSize};
        });
    }

    render() {
        const children = this.props.children as React.ReactNode;
        if (!children || !Array.isArray(children)) {
            return children;
        }
        if (children.length === 1) {
            return children[0];
        }
        if (children.length > 2) {
            throw new Error("SplitPane expects not more than two children");
        }
        let className;
        let childClassName;
        let child1Style;
        let child2Style;
        if (this.props.dir === 'hor') {
            const width1 = this.state.size;
            className = this.props.classes.hor;
            childClassName = this.props.classes.childVer;
            child1Style = {width: width1, ...this.props.child1Style};
            child2Style = this.props.child2Style;
        } else {
            const height1 = this.state.size;
            className = this.props.classes.ver;
            childClassName = this.props.classes.childVer;
            child1Style = {height: height1, ...this.props.child1Style};
            child2Style = this.props.child2Style;
        }
        return (
            <div
                    id='SplitPane'
                    className={classNames(className, this.props.className)}
                    style={this.props.style}
            >
                <div
                        id='SplitPane-Child-1'
                        className={classNames(childClassName, this.props.child1ClassName)}
                        style={child1Style}
                >
                    {children[0]}
                </div>
                <Splitter
                        dir={this.props.dir}
                        onChange={this.handleSplitDelta}
                />
                <div
                        id='SplitPane-Child-2'
                        className={classNames(childClassName, this.props.child2ClassName)}
                        style={child2Style}
                >
                    {children[1]}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SplitPane);