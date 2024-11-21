# General Concepts

This section explains general concepts and terms regarding xcube Viewer's
_data model_, _selections_, and _layers_ shown in the map view.

## Data Model

### Dataset

In the context of xcube, a _dataset_ is a container for spatial
gridded data [variables](#variable) that usually shares the same
coordinate reference system, the same dimensions, and therefore
the same grid.
Besides the data variables, a dataset also provides metadata such
as the spatio-temporal coverages, the type of coordinates, and information
about the content.
A dataset can be associated with [place groups](#places-and-place-groups).

Datasets that provide variables with two spatial dimensions and a time
dimension are also referred to as _data cubes_. Hence, the data cubes
supported by the viewer are 4-D: variable, time, y, and x.
The viewer may support also other data cube dimensions in the future.

The list of available datasets is usually fixed for a deployed viewer
application instance. One of the available datasets is the viewer's
[selected dataset](#selected-dataset).

### Variable

A _variable_ provides n-dimensional, gridded, geospatial data.
Every variable has a name, a numeric data type, and two spatial dimensions.
Usually, variables are 3-D and also have a time dimension that can be of
variable length. Each time step along the dimension determines an individual
2-D spatial image of the 3-D variable and is associated with a given timestamp.

### Places and Place Groups

A _place_ represents a region or location that can be associated with
data about that region or location. For this purpose a place comprises
a name, a geographical vector geometry (point, polygon, etc), and a
set of optional data properties.

A _place group_ is a named collection of places.

Places and place groups can be associated with a [dataset](#dataset) or
provided by the user. Users can define new places either by drawing points
and shapes into the map. Drawn places end up in special place group
called `My places`. Or they import custom place groups from GeoJSON
or CSV files.

## Selections

### Selected Dataset

The selected dataset determines the set of selectable [variables](#variable)
and the possible range of the currently [selected time](#selected-time).
Only one dataset can be selected at the same time.
The selected dataset's time coverage limits the possible values for the
[selected time](#selected-time).  
If the dataset selection changes, the [selected variable](#selected-variable)
and the [selected time](#selected-time) may be adjusted if their current values
are not applicable to the newly selected dataset. In this case:

* The newly [selected variable](#selected-variable) will be the first
  variable of the selected dataset.
* The [selected time](#selected-time) will be the latest time stamp
  of the selected dataset.

### Selected Variable

The _selected variable_ is the one shown in the map, given that the
[variable layer](#variable-layer) is visible.
Only one variable of a dataset can be selected,
but a selected variable may be _pinned_ to allow for inspection of two
variables at the same time.

### Pinned Variable

A _pinned variable_ is a variable that is marked for comparison with
the [selected variable](#selected-variable).  
Only one variable can be pinned at the same time. Note that the
pinned variable does not depend on the [selected dataset](#selected-dataset).
If the dataset selection changes the pinned variable stays the same.

### Selected Place

One of the available [places](#places-and-place-groups) can be selected by pointing
at it on the map. A selected place is required, for example, to compute time-series
and statistics. Only one place can be selected at the same time.

### Selected Time

The _selected time_ determines the current time step for datasets with a
time dimension. For such datasets, the selected time is required, for example,
to compute statistics.

## Layers

### Variable Layer

The _variable layer_ is the top-most gridded data layer in the map.
It overlays the [dataset RGB layer](#dataset-rgb-layer).

### Dataset RGB Layer

Some datasets provide an additional RGB layer that can be displayed
along with the [variable layer](#variable-layer).
Currently, there can be only be a single RGB layer per dataset.

### Basemaps and Overlays

The _basemap_ is the layer that is optionally shown below any other layer.
The _overlay_ is the layer that is optionally shown above all other layers.
Currently, there can be only be a single overlay.
