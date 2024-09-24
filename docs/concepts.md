# General Concepts

## Dataset

In the context of xcube, a _dataset_ is a container for spatial
gridded data [variables](#variable) that usually shares the same
coordinate reference system, the same dimensions, and therefore
the same grid.
Besides the data variables, a dataset also provides metadata such
as the spatio-temporal coverages, the type of coordinates, and information
about the content.
A dataset can be associated with places that are
organised in place groups.

Datasets that provide variables with two spatial dimensions and a time
dimension are also referred to as _data cubes_. Hence, the data cubes
supported by the viewer are 4-D: variable, time, y, and x.
The viewer may support also other data cube dimensions in the future.

The list of available datasets is usually fixed for a deployed viewer
application instance. One of the datasets is the viewer's
[selected dataset](#selected-dataset).

## Variable

A _variable_ provides n-dimensional, gridded, geospatial data.
Every variable has a name, a numeric data type, and two spatial dimensions.
Usually, variables are 3-D and also have a time dimension that can be of
variable length. Each time step along the dimension determines an individual
2-D spatial image of the 3-D variable and is associated with a given timestamp.

## Selected Dataset

The selected dataset determines the set of selectable [variables](#variable)
and the possible range of the currently selected time.

If the selected dataset changes, the selected variable will also change.
The new selected variable will either be the one with the same name as
the previously selected variable, if it exists in the newly selected dataset,
or it will default to the first variables listed in the new selected dataset.

### Selected Variable

The selected variable is the one shown in the map, given that the
[variable layer](#variable-layer) is visible.

### Variable Layer

The _variable layer_ is the top-most gridded data layer in the map.
It overlays the dataset RGB layer.
