# General Concepts

## Dataset

In the context of xcube, a _dataset_ is a container for spatial
gridded data [variables](#Variable) that usually shares the same
coordinate reference system, the same dimensions, and therefore
the same grid.
Besides the data variables, a dataset also provides metadata such
as the spatio-temporal coverages, the type of coordinates, and information
about the content.

Datasets that provide variables with two spatial dimensions and a time
dimension are also referred to as _data cubes_. Hence, the data cubes
supported by the viewer are 4-dimensional: variable, time, y, and x.
The viewer may support also other data cube dimensions in the future.

The viewer allows only a single dataset to be selected at the same time.
This is the [selected dataset](#selected-dataset).

## Variable

A _variable_ provides n-dimensional, gridded, geospatial data.
It has a name, a numeric data type, two spatial dimensions and optionally
a time dimension.

## Selected Dataset

The selected dataset determines the set of selectable [variables](#variable)
and the possible range of the currently [selected time](#selected-time).

If the selected dataset changes, the selected variable will also change.
The new selected variable will either be the one with the same name as
the previously selected variable, if it exists in the newly selected dataset,
or it will default to the first variables listed in the new selected dataset.
