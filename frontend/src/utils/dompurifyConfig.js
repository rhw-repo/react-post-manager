import DOMPurify from "dompurify";

DOMPurify.setConfig({
  FORBID_ATTR: ["style", "onload", "onerror"],
  FORBID_TAGS: ["script", "svg", "math"],
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
});

export default DOMPurify;
