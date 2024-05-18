export const getErrorMsg = (error, enqueueSnackbar) => {
  if (error.errors && error.errors.length > 0) {
    error.errors.forEach(errorElm => {
      enqueueSnackbar(errorElm.message, {
        variant: 'error',
      });
    });
  } else {
    enqueueSnackbar(error.message, {
      variant: 'error',
    });
  }
};
