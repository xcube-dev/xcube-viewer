# Feature References

![Interface](assets/images/viewer/features_label_light.png){: class="light-image" }
![Interface](assets/images/viewer/features_label_dark.png){: class="dark-image" }

A list of all the features that the viewer contains will be created here, in which the functionality of each one is explained in more detail.

### Select Dataset

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/select_dataset.png"
					alt="Select Dataset" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Select Dataset</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A drop-down menu, grouped by data format, selected dataset is
				highlighted
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				<ul>
					<li>Holds all datasets available on the server.</li>
					<li>
						The map's zoom and pan behavior upon dataset selection depends on
						<a
							href="/user_guide/settings/#zoom-on-datasetvarialbe-selection"
							rel="noopener noreferrer"
							>user-defined settings</a
						>.
					</li>
					<li>When a new dataset is selected:</li>
					<ul>
						<li>
							The first variable in the dataset is automatically selected,
							<b>or</b>
						</li>
						<li>
							If the new dataset contains a variable with the same name as the
							previously selected variable, that variable will be pre-selected.
						</li>
					</ul>
				</ul>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/getting_started/#select-dataset-and-variables"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### Locate Dataset in Map

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/locate_dataset.png"
					alt="Locate Dataset" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Locate Dataset</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>Button</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>Pans and zooms to extent of selected dataset.</td>
		</tr>
	</tbody>
</table>

### Select Variable

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/select_variable.png"
					alt="Select Variable" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Select Variable</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A drop-down menu lists all variables in the dataset, ordered according
				to their sequence in the dataset.
				<a href="user_guide/analyse/#user-variables" rel="noopener noreferrer"
					>User-defined variables</a
				>
				are marked with an icon and placed at the bottom of the list. The
				currently selected variable is highlighted in blue.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				Displays all variables available in the dataset, along with any
				user-defined variables. The map's zoom and pan behavior when selecting a
				dataset depends on the
				<a
					href="/user_guide/settings/#zoom-on-datasetvarialbe-selection"
					rel="noopener noreferrer"
					>user-defined settings</a
				>.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>Enable users to easily access and switch between variables.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/getting_started/#select-dataset-and-variables"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

---

### Show/Hide Layer Panel

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img src="/assets/images/features/layerpanel.png" alt="Layerpanel" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Show/Hide Layer Panel</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>Button, highlighted when feature is enabled</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				Shows or hides the
				<a href="#layer-panel" rel="noopener noreferrer">Layer Panel</a>.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>Enable users to controll the visibility of layers.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/getting_started/#adjust-layer-visibilities"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### Layer Panel

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img src="/assets/images/features/layerpanel.png" alt="Layerpanel" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Layer Panel</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A draggable window displaying a list of available layers, with options
				at the bottom to add user-defined basemaps or overlays. Visible layers
				are marked with a checkmark, while pinned variables are indicated by a
				pin icon.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				The Layer Panel allows users to show or hide the following layers: the
				selected variable, pinned variable (marked with an icon), user and
				dataset places, base map and overlay, the boundary box of the selected
				dataset, and the RGB of both the selected and pinned dataset. It also
				enables users to add or modify user variables or overlays, a function
				that can also be performed in the
				<a
					href="user_guide/settings/#base-maps-and-overlays"
					rel="noopener noreferrer"
					>settings</a
				>. The window appears when the function is enabled and can be closed
				either by clicking the 'X' or by clicking the button again.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>Enable users to controll the visibility of layers.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/getting_started/#adjust-layer-visibilities"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### Split Mode

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img src="/assets/images/features/splitmode.png" alt="Split Mode" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Split Mode</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A button, highlighted when the function is enabled. When the mode is
				activated, the screen is divided in the middle by a slidable line.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				In comparison mode, the currently selected variable is displayed on the
				right side of the slidable line. If a variable is pinned, it is
				displayed on the left side of the screen along with its color bar. But
				the pinned variable can also be made transparent using the layer
				visibility menu. The slidable line allows users to shift the view,
				enabling spatial comparison with underlying layers, such as basemaps or
				the pinned variable. Comparison mode is automatically activated when a
				variable is pinned, and the variable on the left can be displayed with
				transparency to enhance the comparison.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>
				Enables visual comparison of the selected variable with another (pinned
				variable) or with other layers, such as a user basemap or dataset RGB.
			</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/analyse/#compare-variables"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### Information Box

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img src="/assets/images/features/infobox.png" alt="Info box" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Information Box</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>Button, highlighted when function is enabled</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				Displays an information box that provides pixel details for the area
				being hovered over. This includes latitude, longitude, the selected
				variable, and the pinned variable.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>tbc.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a
					href="/user_guide/analyse/#infobox"
					rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>
