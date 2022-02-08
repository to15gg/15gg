if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (searchValue, replaceValue) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(searchValue).toLowerCase() ===
      "[object regexp]"
    ) {
      return this.replace(searchValue, replaceValue as string);
    }

    // If a string
    return this.replace(new RegExp(searchValue, "g"), replaceValue as string);
  };
}

export {};
