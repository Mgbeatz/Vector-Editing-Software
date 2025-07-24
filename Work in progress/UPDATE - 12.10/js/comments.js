function addStickyNote() {
  const selected = canvas.getActiveObject();

  const noteWidth = 160;
  const noteHeight = 100;
  const bg = new fabric.Rect({
    width: noteWidth,
    height: noteHeight,
    fill: '#fff8b5',
    stroke: '#e0d500',
    rx: 8,
    ry: 8
  });

  const author = "User"; // Optional: dynamic from login
  const date = new Date().toLocaleString();

  const commentText = `${author} - ${date}\nComment...`;

  const textbox = new fabric.Textbox(commentText, {
    width: noteWidth - 20,
    top: 10,
    left: 10,
    fontSize: 12,
    fill: '#333',
    editable: true
  });

  const commentGroup = new fabric.Group([bg, textbox], {
    left: selected ? selected.left + 100 : 200,
    top: selected ? selected.top - 50 : 200,
    lockScalingFlip: true,
    hasControls: true,
    name: 'commentGroup',
    metadata: {
      author,
      date,
      linkedToId: selected?.id || null
    }
  });

  if (selected) {
    if (!selected.comments) selected.comments = [];
    selected.comments.push(commentGroup);
  }

  canvas.add(commentGroup);
  canvas.setActiveObject(commentGroup);
  canvas.requestRenderAll();
}


// 💡 If objects don't have IDs yet, assign them with a helper

function assignUniqueId(obj) {
  if (!obj.id) obj.id = 'obj-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}




const metaText = `${author} – ${date}\n`;
textbox.text = metaText + 'Write your comment...';





if (selected) {
  const line = new fabric.Line(
    [selected.left, selected.top, commentGroup.left, commentGroup.top],
    {
      stroke: '#e0d500',
      selectable: false,
      evented: false
    }
  );
  canvas.add(line);
}
















function addCommentAt(x, y, text = "Comment...") {
  const comment = new fabric.Textbox(text, {
    left: x,
    top: y,
    width: 200,
    fontSize: 16,
    fill: '#fff',
    backgroundColor: '#333',
    editable: true,
    hasControls: true,
    hasBorders: true,
    padding: 4,
  });

  comment.set({ selectable: true, lockScalingFlip: true });
  comment.layerName = 'Comment';

  canvas.add(comment);
  canvas.setActiveObject(comment);
  canvas.renderAll();
}

canvas.on('mouse:down', function(opt) {
  if (currentTool === 'comment') {
    const pointer = canvas.getPointer(opt.e);
    addCommentAt(pointer.x, pointer.y);
  }
});
