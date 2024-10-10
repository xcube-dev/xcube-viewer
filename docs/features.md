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

### Pin Variables

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/pin_variable.png"
					alt="Pin Variable" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Pin Variable</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				Button that has a dark background when activated or when a pinned
				variable is selected.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				The button pins a variable. When a variable is pinned, the 
				<a
					href="#split-mode"
					rel="noopener noreferrer"
					>split mode</a
				> for visual comparison is automatically activated, if it hasn't
				been opened yet. A variable can be unpinned by clicking the button
				again. If the variable should remain pinned but the split mode should be
				closed, the split mode button must be clicked.
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>To pin variables for comparison.</td>
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

### Open User Variable Management

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/user_variables.png"
					alt="User Variable" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Open User Variable Management</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>A button that opens a window for managing user variables.</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>To open user variable management menu.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a href="/user_guide/analyse/#user-variables" rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### User Variable Management

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/user_variables_management.png"
					alt="User Variables Management" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>User Variable Management</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A window for managing user variables when activated through
				<a href="#open-user-variable-management" rel="noopener noreferrer"
					>this feature</a
				>. The window displays a list of all existing user variables, including
				their name, title, units, and expression. It also contains various
				buttons for managing user variables, as well as a button that opens an
				informational text regarding user variables.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				The following features can be used to manage the variables:<br /><br />
				When no variable is selected:
				<ul>
					<li>
						<a href="#add-user-variable" rel="noopener noreferrer"
					><strong>Add User Variable</strong></a
				>: Opens a new window to create a
						user variable.
					</li>
				</ul>
				When a user variable is selected:
				<ul>
					<li>
						<strong>Add User Variable</strong>: Opens a new window to create a
						user variable.
					</li>
					<li>
						<strong>Duplicate User Variable</strong>: Duplicates the selected
						variable, appending <code>_copy</code> to the title of the
						duplicate.
					</li>
					<li>
						<strong>Edit User Variable</strong>: Opens a window similar to the
						Add User Variable window for editing the selected variable.
					</li>
					<li>
						<strong>Remove User Variable</strong>: Removes the variable from the
						list.
					</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td><b>Aim</b></td>
			<td>To manage user variables.</td>
		</tr>
		<tr>
			<td colspan="2">
				Link to feature mentioned in
				<a href="/user_guide/analyse/#user-variables" rel="noopener noreferrer"
					>User Guide</a
				>
			</td>
		</tr>
	</tbody>
</table>

### Add User Variables

<table>
	<thead>
		<tr>
			<th colspan="2">
				<img
					src="/assets/images/features/user_variables_add.png"
					alt="Add User Variable" />
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Feature Name</b></td>
			<td>Add User Variable</td>
		</tr>
		<tr>
			<td><b>Description</b></td>
			<td>
				A window that opens using the <code>+</code>-button in the User Variables
				Management menu. The window contains input fields for
				<strong>Name</strong>, <strong>Title</strong>, <strong>Unit</strong>,
				and the <strong>Expression</strong>. There is also an option to display
				various optional components of the expression.
			</td>
		</tr>
		<tr></tr>
		<tr>
			<td><b>Functionality</b></td>
			<td>
				To successfully add a variable, a valid <strong>Name</strong> and a
				valid <strong>Python Expression</strong> must be provided.
				<strong>Title</strong> and <strong>Units</strong> are optional fields.
    			<ul>
    				<li>
    					The Name must be a unique identifier within the
    					User Variables and must start with a letter.
    				</li>
    				<li>
    					The Expression is an algebraic expression that
    					follows the syntax of Python expressions.
    				</li>
    			</ul>
    		</td>
    	</tr>
    	<tr>
    		<td><b>Aim</b></td>
    		<td>To add user variables.</td>
    	</tr>
    	<tr>
    		<td colspan="2">
    			Link to feature mentioned in
    			<a href="/user_guide/analyse/#user-variables" rel="noopener noreferrer"
    				>User Guide</a
    			>
    		</td>
    	</tr>
    </tbody>

</table>
