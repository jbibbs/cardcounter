async function init() {
  board.ui.on("icon:click", async () => {
	await board.ui.openPanel({ url: "app.html" });
  });
}

miro.onReady(() => {
	const updateNextIdWidget = async () => {
		// Fetch all widgets on the board
		const widgets = await miro.board.widgets.get();
		let highestId = 0;

		// Find the highest ID among card widgets
		for (const widget of widgets) {
			if (widget.type === 'CARD') {
				const content = widget.data.content;
				const id = parseInt(content.split(' ')[0], 10); // Assuming ID is the first part of content
				if (!isNaN(id) && id > highestId) {
					highestId = id;
				}
			}
		}

		const nextId = highestId + 1;

		// Check if a "Next ID" widget already exists
		let nextIdWidget = widgets.find(widget => 
			widget.type === 'TEXT' && widget.data.content.includes('Next ID:')
		);

		if (nextIdWidget) {
			// Update the existing widget
			await miro.board.widgets.update({
				id: nextIdWidget.id,
				data: { content: `Next ID: ${nextId}` },
			});
		} else {
			// Create a new "Next ID" widget
			await miro.board.widgets.create({
				type: 'TEXT',
				data: { content: `Next ID: ${nextId}` },
				style: { fontSize: 14 },
				position: { x: 0, y: 0 },
			});
		}
	};

	// Update the Next ID widget initially
	updateNextIdWidget();

	// Listen for widget creation or updates to re-calculate the Next ID
	miro.board.ui.on('WIDGETS_CREATED', updateNextIdWidget);
	miro.board.ui.on('WIDGETS_UPDATED', updateNextIdWidget);
});
