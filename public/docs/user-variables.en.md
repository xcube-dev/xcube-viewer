A _user variable_ is a variable that is defined by a _name_, _title_, _units_, 
and by an algebraic _expression_ that is used to compute the variable's data 
values. User variables are added the currently selected dataset and their
expressions are evaluated in the context of the selected dataset.

**Name**: A name that is unique within the selected dataset's variables.
The name must start with a letter optionally followed by letters or digits. 

**Title**: Optional display name of the variable in the user interface.

**Units**: Optional physical units of the computed data values.
For example, units are used to group time-series.

**Expression**: An algebraic expression used to compute the variable's data
values. The syntax is that of  
[Python expressions](https://docs.python.org/3/reference/expressions.html)
limited to 
- variable references
- attribute references
- functions calls 
- subscriptions and slicings
- parenthesized expressions
- boolean literals `True`, `False`
- numeric and string literals
- list `[v, ...]`, dictionary `{k: v, ...}`, set `{v, ...}` literals
- sign operations  `+`, `-`
- arithmetic operations `+`, `-`, `@`, `*`, `/`, `//`, `%`
- shift operations `<<`, `>>`
- bitwise operations `&`, `^`, `|`, `~`
- comparisons, including `in`, `not in`, `is`, `is not`
- boolean operations `and`, `or`, `not` ¹
- conditional operation `if` – `else`.

The allowed variables are those contained in the selected data product.
The allowed constants are `e`, `pi`, `nan`, and `inf`.
The allowed functions are 
[numpy's universal functions](https://numpy.org/doc/stable/reference/ufuncs.html#math-operations)
plus the 
[numpy `where()`](https://numpy.org/doc/stable/reference/generated/numpy.where.html#numpy-where) 
function.

Expression examples:

- Mask out where a variable `chl` is lower than zero: `where(chl >= 0, chl, nan)`
- Sentinel-2 vegetation index or NDVI: `(B08 - B04) / (B08 + B04)`
- Sentinel-2 moisture index: `(B8A - B11) / (B8A + B11)`


¹ For Python/numpy programmers: Unlike with numpy arrays, the boolean operations 
`and`, `or`, and `not` can be used with arrays as they translate into the
corresponding numpy functions `logical_and()`, `logical_or()`, and `logical_not()`.
