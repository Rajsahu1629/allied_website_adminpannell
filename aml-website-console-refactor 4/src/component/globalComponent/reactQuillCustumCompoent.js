import ReactQuill, { Quill } from "react-quill";
const sizes = [
  "2px", "4px", "6px", "8px", "10px", "12px", "14px", "16px", "18px", "20px",
  "22px", "24px", "26px", "28px", "30px", "32px", "34px", "36px", "38px", "40px",
  "42px", "44px", "46px", "48px", "50px", "52px", "54px", "56px", "58px", "60px",
  "62px", "64px", "66px", "68px", "70px", "72px", "74px", "76px", "78px", "80px",
  "82px", "84px", "86px", "88px", "90px", "92px", "94px", "96px", "98px", "100px"
];
export function registerQuillSizes() {
  if (typeof Quill !== "undefined") {
    const Size = Quill.import("attributors/style/size");
    Size.whitelist = sizes;
    Quill.register(Size, true);

    // Defer the DOM text update until the Quill editor is rendered
    const tryUpdateDropdownLabels = () => {
      const sizePicker = document.querySelector(".ql-size .ql-picker-options");
      if (sizePicker) {
        const pickerItems = sizePicker.querySelectorAll(".ql-picker-item");
        for (let item of pickerItems) {
          item.textContent = item.dataset.value || "Default";
          item.classList.add("custom-size-item");
        }
      } else {
        // Retry in case the toolbar isn't ready yet
        setTimeout(tryUpdateDropdownLabels, 100);
      }
    };

    setTimeout(tryUpdateDropdownLabels, 100);
  }
}

export {sizes}