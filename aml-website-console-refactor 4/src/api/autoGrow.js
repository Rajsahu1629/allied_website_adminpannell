// autoGrow.js
export default function autoGrow(quill) {
  const editor = quill.root;
  const updateHeight = () => {
    editor.style.height = "auto";
    editor.style.height = `${editor.scrollHeight}px`;
  };

  quill.on("text-change", updateHeight);
  window.addEventListener("resize", updateHeight);
  updateHeight();
}
