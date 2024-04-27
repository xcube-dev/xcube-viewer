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

import Box from "@mui/material/Box";

import useItemStyles from "./useItemStyles";
import useColorRecords from "./useColorRecords";
import UserColorBarCanvas from "./UserColorBarCanvas";

interface UserColorBarGroupItemProps {
  name: string;
  code: string;
  selected: boolean;
  onSelect: (name: string) => void;
}

export default function UserColorBarGroupItem({
  name,
  code,
  selected,
  onSelect,
}: UserColorBarGroupItemProps) {
  const classes = useItemStyles();

  const { colorRecords, errorMessage } = useColorRecords(code);

  const handleSelect = () => {
    onSelect(name);
  };

  return (
    <Box
      className={
        selected ? classes.colorBarGroupItemSelected : classes.colorBarGroupItem
      }
    >
      <UserColorBarCanvas
        colorRecords={colorRecords}
        errorMessage={errorMessage}
        onSelect={handleSelect}
        width={238} // box width - 2 x border
        height={18} // box height - 2 x border
      />
    </Box>
  );
}
