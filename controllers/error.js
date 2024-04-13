(() => {
  exports.get404Page = (req, res, next) => {
    res.status(404).render("page404", {
      pageTitle: "Page 404",
      path: null,
    });
  };

  exports.get500Page = (req, res, next) => {
    res.status(500).render("page500", {
      pageTitle: "Something went wrong",
      path: null,
    });
  };
})();
