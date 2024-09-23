# General Concepts

## Dataset

In the context of xcube, a _dataset_ is a container for spatial
gridded data [_variables_](#Variable) that usually share the same
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
This is the [_selected dataset](#Selected-Dataset).

## Variable

A _variable_ provides n-dimensional, gridded, geospatial data.
It has a name, a numeric data type, two spatial dimensions and optionally
a time dimension.

## Selected Dataset

The selected dataset determines the set of selectable [_variables_](#Variable) 
and the possible range of the currently [_selected time](#Selected-Time).

If the selected dataset changes also the selected variable changes.
The selected variable will then be either 

The variable with the same name as the previously selected variable
if that exists in the newly selected dataset. If not, the new selected 
variable will be the first of the variables in newly selected dataset.  

## Selected Variable


## Pinned Variable

## Place and Place Group

## User Places

## Selected Time

## Layers

## Basemaps and Overlays
