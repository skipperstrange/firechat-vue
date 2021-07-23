const toasterOptions = {
  className: "warning",
  position: "top-right",
  singleton: true,

  action: {
    text: "Ok",
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
  },
};

export default toasterOptions;
